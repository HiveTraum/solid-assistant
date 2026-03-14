import type { QuestionData } from './types';

export const srpQuestions: QuestionData[] = [
  // 1. Класс Logger, который и логирует, и отправляет метрики
  {
    text: 'Класс Logger записывает логи в файл и одновременно отправляет метрики в систему мониторинга. Какой принцип SOLID нарушен?',
    options: [
      'Open/Closed Principle',
      'Single Responsibility Principle',
      'Dependency Inversion Principle',
      'Interface Segregation Principle',
    ],
    correctIndex: 1,
    explanation:
      'Логирование и отправка метрик — это две разные ответственности. Класс Logger должен только логировать, а отправку метрик следует вынести в отдельный класс MetricsExporter.',
    codeExamples: {
      ts: {
        bad: `// Класс совмещает логирование и метрики
class Logger {
  log(msg: string) {
    fs.appendFileSync('app.log', msg);
  }
  sendMetric(name: string, value: number) {
    fetch('/metrics', { body: JSON.stringify({ name, value }) });
  }
}`,
        good: `// Разделяем ответственности
class Logger {
  log(msg: string) {
    fs.appendFileSync('app.log', msg);
  }
}
class MetricsExporter {
  send(name: string, value: number) {
    fetch('/metrics', { body: JSON.stringify({ name, value }) });
  }
}`,
      },
      go: {
        bad: `// Структура совмещает логирование и метрики
type Logger struct{}

func (l *Logger) Log(msg string) {
    os.WriteFile("app.log", []byte(msg), 0644)
}
func (l *Logger) SendMetric(name string, val float64) {
    http.Post("/metrics", "application/json", nil)
}`,
        good: `// Разделяем ответственности
type Logger struct{}
func (l *Logger) Log(msg string) {
    os.WriteFile("app.log", []byte(msg), 0644)
}

type MetricsExporter struct{}
func (m *MetricsExporter) Send(name string, val float64) {
    http.Post("/metrics", "application/json", nil)
}`,
      },
      python: {
        bad: `# Класс совмещает логирование и метрики
class Logger:
    def log(self, msg: str):
        with open("app.log", "a") as f:
            f.write(msg)
    def send_metric(self, name: str, value: float):
        requests.post("/metrics", json={"name": name, "value": value})`,
        good: `# Разделяем ответственности
class Logger:
    def log(self, msg: str):
        with open("app.log", "a") as f:
            f.write(msg)

class MetricsExporter:
    def send(self, name: str, value: float):
        requests.post("/metrics", json={"name": name, "value": value})`,
      },
    },
    principle: 'S',
  },

  // 2. React-компонент, который и рендерит, и делает fetch, и валидирует
  {
    text: 'React-компонент UserProfile загружает данные пользователя через fetch, валидирует форму и рендерит UI. Что нужно сделать для соблюдения SRP?',
    options: [
      'Добавить больше пропсов компоненту',
      'Вынести fetch в кастомный хук, валидацию — в утилиту',
      'Использовать class component вместо функционального',
      'Обернуть компонент в React.memo',
    ],
    correctIndex: 1,
    explanation:
      'По SRP компонент должен отвечать только за отображение. Загрузку данных следует вынести в кастомный хук (useUser), а валидацию — в отдельную утилиту или хук.',
    codeExamples: {
      ts: {
        bad: `// Компонент делает всё сам
function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch(\`/api/users/\${id}\`).then(r => r.json()).then(setUser); }, [id]);
  const isValid = (name: string) => name.length > 2;
  return <div>{user?.name}</div>;
}`,
        good: `// Ответственности разделены
function useUser(id: string) {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch(\`/api/users/\${id}\`).then(r => r.json()).then(setUser); }, [id]);
  return user;
}
const isValidName = (name: string) => name.length > 2;
function UserProfile({ id }: { id: string }) {
  const user = useUser(id);
  return <div>{user?.name}</div>;
}`,
      },
      go: {
        bad: `// Обработчик делает всё: валидацию, запрос к БД, рендер
func UserHandler(w http.ResponseWriter, r *http.Request) {
    name := r.FormValue("name")
    if len(name) < 2 { http.Error(w, "invalid", 400); return }
    user, _ := db.Query("SELECT * FROM users WHERE name=?", name)
    json.NewEncoder(w).Encode(user)
}`,
        good: `// Разделяем: валидация, репозиторий, обработчик
func validateName(name string) bool { return len(name) >= 2 }

func (repo *UserRepo) FindByName(name string) (*User, error) {
    return repo.db.Query("SELECT * FROM users WHERE name=?", name)
}
func UserHandler(w http.ResponseWriter, r *http.Request) {
    name := r.FormValue("name")
    if !validateName(name) { http.Error(w, "invalid", 400); return }
    user, _ := repo.FindByName(name)
    json.NewEncoder(w).Encode(user)
}`,
      },
      python: {
        bad: `# Вьюха делает всё: валидацию, запрос к БД, рендер
def user_view(request):
    name = request.GET["name"]
    if len(name) < 2:
        return HttpResponse("invalid", status=400)
    user = User.objects.get(name=name)
    return JsonResponse({"name": user.name})`,
        good: `# Разделяем: валидация, репозиторий, вьюха
def validate_name(name: str) -> bool:
    return len(name) >= 2

class UserRepository:
    def find_by_name(self, name: str) -> User:
        return User.objects.get(name=name)

def user_view(request):
    name = request.GET["name"]
    if not validate_name(name):
        return HttpResponse("invalid", status=400)
    user = UserRepository().find_by_name(name)
    return JsonResponse({"name": user.name})`,
      },
    },
    principle: 'S',
  },

  // 3. Функция, которая и парсит CSV, и валидирует, и сохраняет
  {
    text: 'Функция processCSV читает CSV-файл, валидирует каждую строку и сохраняет данные в базу. Сколько причин для изменения у этой функции?',
    options: [
      'Одна — обработка CSV',
      'Две — парсинг и сохранение',
      'Три — парсинг, валидация, сохранение',
      'Ни одной — функция написана правильно',
    ],
    correctIndex: 2,
    explanation:
      'У функции три причины для изменения: изменение формата CSV (парсинг), изменение правил валидации, изменение способа сохранения. По SRP каждую из этих обязанностей нужно вынести отдельно.',
    codeExamples: {
      ts: {
        bad: `// Функция делает три вещи сразу
function processCSV(path: string) {
  const rows = fs.readFileSync(path, 'utf-8').split('\\n');
  for (const row of rows) {
    const [name, age] = row.split(',');
    if (!name || Number(age) < 0) continue; // валидация
    db.query('INSERT INTO users VALUES (?, ?)', [name, age]);
  }
}`,
        good: `// Три отдельные функции
function parseCSV(path: string): string[][] {
  return fs.readFileSync(path, 'utf-8').split('\\n').map(r => r.split(','));
}
function validateRow(row: string[]): boolean {
  return !!row[0] && Number(row[1]) >= 0;
}
function saveRows(rows: string[][]) {
  rows.filter(validateRow).forEach(r => db.query('INSERT INTO users VALUES (?, ?)', r));
}`,
      },
      go: {
        bad: `// Функция делает три вещи сразу
func ProcessCSV(path string) error {
    data, _ := os.ReadFile(path)
    for _, line := range strings.Split(string(data), "\\n") {
        parts := strings.Split(line, ",")
        if len(parts) < 2 || parts[0] == "" { continue }
        db.Exec("INSERT INTO users VALUES (?, ?)", parts[0], parts[1])
    }
    return nil
}`,
        good: `// Три отдельные функции
func ParseCSV(path string) [][]string {
    data, _ := os.ReadFile(path)
    var rows [][]string
    for _, line := range strings.Split(string(data), "\\n") {
        rows = append(rows, strings.Split(line, ","))
    }
    return rows
}
func ValidateRow(row []string) bool { return len(row) >= 2 && row[0] != "" }
func SaveRows(rows [][]string) { /* сохранение в БД */ }`,
      },
      python: {
        bad: `# Функция делает три вещи сразу
def process_csv(path: str):
    with open(path) as f:
        for line in f:
            name, age = line.strip().split(",")
            if not name or int(age) < 0:  # валидация
                continue
            db.execute("INSERT INTO users VALUES (?, ?)", (name, age))`,
        good: `# Три отдельные функции
def parse_csv(path: str) -> list[list[str]]:
    with open(path) as f:
        return [line.strip().split(",") for line in f]

def validate_row(row: list[str]) -> bool:
    return bool(row[0]) and int(row[1]) >= 0

def save_rows(rows: list[list[str]]):
    for row in filter(validate_row, rows):
        db.execute("INSERT INTO users VALUES (?, ?)", row)`,
      },
    },
    principle: 'S',
  },

  // 4. Класс AuthService с логикой хеширования паролей внутри
  {
    text: 'Класс AuthService содержит метод login() и внутри себя реализует хеширование паролей через bcrypt. Почему это нарушает SRP?',
    options: [
      'Потому что bcrypt — устаревший алгоритм',
      'Потому что аутентификация и хеширование — разные ответственности',
      'Потому что login() должен быть статическим методом',
      'Потому что нужно использовать интерфейс вместо класса',
    ],
    correctIndex: 1,
    explanation:
      'Аутентификация (проверка учётных данных) и хеширование паролей — это две отдельные ответственности. Если алгоритм хеширования изменится, придётся менять AuthService, хотя логика аутентификации не изменилась.',
    codeExamples: {
      ts: {
        bad: `// AuthService сам хеширует пароли
class AuthService {
  async login(email: string, password: string) {
    const user = await db.findUser(email);
    const hash = await bcrypt.hash(password, 10); // хеширование внутри
    return bcrypt.compare(password, user.passwordHash);
  }
}`,
        good: `// Хеширование вынесено в отдельный сервис
class PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
class AuthService {
  constructor(private hasher: PasswordHasher) {}
  async login(email: string, password: string) {
    const user = await db.findUser(email);
    return this.hasher.compare(password, user.passwordHash);
  }
}`,
      },
      go: {
        bad: `// AuthService сам хеширует пароли
type AuthService struct{ db *DB }

func (a *AuthService) Login(email, password string) (bool, error) {
    user, _ := a.db.FindUser(email)
    err := bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(password))
    return err == nil, err
}`,
        good: `// Хеширование вынесено отдельно
type PasswordHasher struct{}
func (h *PasswordHasher) Compare(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

type AuthService struct{ db *DB; hasher *PasswordHasher }
func (a *AuthService) Login(email, password string) bool {
    user, _ := a.db.FindUser(email)
    return a.hasher.Compare(password, user.Hash)
}`,
      },
      python: {
        bad: `# AuthService сам хеширует пароли
class AuthService:
    def login(self, email: str, password: str) -> bool:
        user = db.find_user(email)
        return bcrypt.checkpw(
            password.encode(), user.password_hash.encode()
        )`,
        good: `# Хеширование вынесено в отдельный класс
class PasswordHasher:
    def compare(self, password: str, hash: str) -> bool:
        return bcrypt.checkpw(password.encode(), hash.encode())

class AuthService:
    def __init__(self, hasher: PasswordHasher):
        self.hasher = hasher
    def login(self, email: str, password: str) -> bool:
        user = db.find_user(email)
        return self.hasher.compare(password, user.password_hash)`,
      },
    },
    principle: 'S',
  },

  // 5. Класс, который и сериализует, и шифрует данные
  {
    text: 'Класс DataProcessor имеет методы serialize() и encrypt(). Какой рефакторинг необходим по SRP?',
    options: [
      'Объединить оба метода в один',
      'Сделать методы статическими',
      'Разделить на Serializer и Encryptor',
      'Добавить метод decrypt() для симметрии',
    ],
    correctIndex: 2,
    explanation:
      'Сериализация и шифрование — две независимые задачи. Формат сериализации (JSON, XML) может измениться независимо от алгоритма шифрования. Разделение на два класса позволяет менять их независимо.',
    codeExamples: {
      ts: {
        bad: `// Класс совмещает сериализацию и шифрование
class DataProcessor {
  serialize(data: object): string {
    return JSON.stringify(data);
  }
  encrypt(text: string): string {
    return crypto.createCipher('aes-256-cbc', key).update(text, 'utf8', 'hex');
  }
}`,
        good: `// Каждый класс — одна ответственность
class Serializer {
  serialize(data: object): string {
    return JSON.stringify(data);
  }
}
class Encryptor {
  encrypt(text: string): string {
    return crypto.createCipher('aes-256-cbc', key).update(text, 'utf8', 'hex');
  }
}`,
      },
      go: {
        bad: `// Структура совмещает сериализацию и шифрование
type DataProcessor struct{}

func (d *DataProcessor) Serialize(data any) ([]byte, error) {
    return json.Marshal(data)
}
func (d *DataProcessor) Encrypt(text []byte) ([]byte, error) {
    block, _ := aes.NewCipher(key)
    // шифрование...
    return encrypted, nil
}`,
        good: `// Каждая структура — одна ответственность
type Serializer struct{}
func (s *Serializer) Serialize(data any) ([]byte, error) {
    return json.Marshal(data)
}

type Encryptor struct{ key []byte }
func (e *Encryptor) Encrypt(text []byte) ([]byte, error) {
    block, _ := aes.NewCipher(e.key)
    return encrypted, nil
}`,
      },
      python: {
        bad: `# Класс совмещает сериализацию и шифрование
class DataProcessor:
    def serialize(self, data: dict) -> str:
        return json.dumps(data)
    def encrypt(self, text: str) -> bytes:
        cipher = AES.new(key, AES.MODE_CBC)
        return cipher.encrypt(text.encode())`,
        good: `# Каждый класс — одна ответственность
class Serializer:
    def serialize(self, data: dict) -> str:
        return json.dumps(data)

class Encryptor:
    def encrypt(self, text: str) -> bytes:
        cipher = AES.new(key, AES.MODE_CBC)
        return cipher.encrypt(text.encode())`,
      },
    },
    principle: 'S',
  },

  // 6. Контроллер с бизнес-логикой внутри
  {
    text: 'REST-контроллер OrderController содержит расчёт стоимости заказа, применение скидок и формирование ответа. Что здесь не так?',
    options: [
      'Контроллер должен использовать ORM',
      'Бизнес-логика должна быть в отдельном сервисе, а не в контроллере',
      'Нужно использовать GraphQL вместо REST',
      'Контроллер должен быть абстрактным классом',
    ],
    correctIndex: 1,
    explanation:
      'Контроллер должен только принимать запрос и возвращать ответ. Бизнес-логика (расчёт стоимости, скидки) — это отдельная ответственность, которую нужно вынести в сервисный слой.',
    codeExamples: {
      ts: {
        bad: `// Контроллер содержит бизнес-логику
class OrderController {
  createOrder(req: Request, res: Response) {
    const items = req.body.items;
    let total = items.reduce((s, i) => s + i.price * i.qty, 0);
    if (total > 1000) total *= 0.9; // скидка 10%
    db.query('INSERT INTO orders ...', [total]);
    res.json({ total });
  }
}`,
        good: `// Бизнес-логика в сервисе
class OrderService {
  calculateTotal(items: Item[]): number {
    let total = items.reduce((s, i) => s + i.price * i.qty, 0);
    return total > 1000 ? total * 0.9 : total;
  }
}
class OrderController {
  constructor(private service: OrderService) {}
  createOrder(req: Request, res: Response) {
    const total = this.service.calculateTotal(req.body.items);
    res.json({ total });
  }
}`,
      },
      go: {
        bad: `// Обработчик содержит бизнес-логику
func CreateOrder(w http.ResponseWriter, r *http.Request) {
    var items []Item
    json.NewDecoder(r.Body).Decode(&items)
    total := 0.0
    for _, i := range items { total += i.Price * float64(i.Qty) }
    if total > 1000 { total *= 0.9 }
    db.Exec("INSERT INTO orders ...", total)
    json.NewEncoder(w).Encode(map[string]float64{"total": total})
}`,
        good: `// Бизнес-логика в сервисе
type OrderService struct{}
func (s *OrderService) CalcTotal(items []Item) float64 {
    total := 0.0
    for _, i := range items { total += i.Price * float64(i.Qty) }
    if total > 1000 { return total * 0.9 }
    return total
}

func CreateOrder(svc *OrderService) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var items []Item
        json.NewDecoder(r.Body).Decode(&items)
        json.NewEncoder(w).Encode(map[string]float64{"total": svc.CalcTotal(items)})
    }
}`,
      },
      python: {
        bad: `# Контроллер содержит бизнес-логику
@app.post("/orders")
def create_order(items: list[Item]):
    total = sum(i.price * i.qty for i in items)
    if total > 1000:
        total *= 0.9  # скидка
    db.execute("INSERT INTO orders ...", (total,))
    return {"total": total}`,
        good: `# Бизнес-логика в сервисе
class OrderService:
    def calc_total(self, items: list[Item]) -> float:
        total = sum(i.price * i.qty for i in items)
        return total * 0.9 if total > 1000 else total

@app.post("/orders")
def create_order(items: list[Item]):
    total = OrderService().calc_total(items)
    return {"total": total}`,
      },
    },
    principle: 'S',
  },

  // 7. Модель базы данных с методами отправки уведомлений
  {
    text: 'Модель User имеет методы save(), delete() и sendWelcomeEmail(). Какой метод не соответствует ответственности модели?',
    options: [
      'save()',
      'delete()',
      'sendWelcomeEmail()',
      'Все методы уместны',
    ],
    correctIndex: 2,
    explanation:
      'Модель отвечает за представление данных и работу с хранилищем. Отправка email — это инфраструктурная задача, не связанная с моделью данных. Её нужно вынести в NotificationService.',
    codeExamples: {
      ts: {
        bad: `// Модель отправляет email
class User {
  name: string;
  email: string;
  save() { db.query('INSERT INTO users ...'); }
  sendWelcomeEmail() {
    mailer.send({ to: this.email, subject: 'Добро пожаловать!' });
  }
}`,
        good: `// Модель отвечает только за данные
class User {
  name: string;
  email: string;
  save() { db.query('INSERT INTO users ...'); }
}
class NotificationService {
  sendWelcome(user: User) {
    mailer.send({ to: user.email, subject: 'Добро пожаловать!' });
  }
}`,
      },
      go: {
        bad: `// Модель отправляет email
type User struct { Name, Email string }

func (u *User) Save() error {
    _, err := db.Exec("INSERT INTO users ...", u.Name, u.Email)
    return err
}
func (u *User) SendWelcomeEmail() error {
    return mailer.Send(u.Email, "Добро пожаловать!")
}`,
        good: `// Модель отвечает только за данные
type User struct { Name, Email string }
func (u *User) Save() error {
    _, err := db.Exec("INSERT INTO users ...", u.Name, u.Email)
    return err
}

type NotificationService struct{}
func (n *NotificationService) SendWelcome(u *User) error {
    return mailer.Send(u.Email, "Добро пожаловать!")
}`,
      },
      python: {
        bad: `# Модель отправляет email
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
    def save(self):
        db.execute("INSERT INTO users ...", (self.name, self.email))
    def send_welcome_email(self):
        mailer.send(to=self.email, subject="Добро пожаловать!")`,
        good: `# Модель отвечает только за данные
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
    def save(self):
        db.execute("INSERT INTO users ...", (self.name, self.email))

class NotificationService:
    def send_welcome(self, user: User):
        mailer.send(to=user.email, subject="Добро пожаловать!")`,
      },
    },
    principle: 'S',
  },

  // 8. Класс FileManager, который и читает, и архивирует, и загружает в облако
  {
    text: 'Класс FileManager имеет методы read(), compress() и uploadToCloud(). Как правильно разделить обязанности?',
    options: [
      'FileReader, FileCompressor, CloudUploader',
      'FileManager с тремя приватными методами',
      'Один интерфейс IFileManager с тремя методами',
      'Наследование: FileReader -> FileCompressor -> CloudUploader',
    ],
    correctIndex: 0,
    explanation:
      'Каждая операция — отдельная ответственность. Чтение файлов, архивация и загрузка в облако могут меняться независимо друг от друга, поэтому их следует разнести по отдельным классам.',
    codeExamples: {
      ts: {
        bad: `// Один класс делает всё
class FileManager {
  read(path: string): Buffer { return fs.readFileSync(path); }
  compress(data: Buffer): Buffer { return zlib.gzipSync(data); }
  uploadToCloud(data: Buffer, key: string) {
    s3.putObject({ Bucket: 'my-bucket', Key: key, Body: data });
  }
}`,
        good: `// Три отдельных класса
class FileReader {
  read(path: string): Buffer { return fs.readFileSync(path); }
}
class FileCompressor {
  compress(data: Buffer): Buffer { return zlib.gzipSync(data); }
}
class CloudUploader {
  upload(data: Buffer, key: string) {
    s3.putObject({ Bucket: 'my-bucket', Key: key, Body: data });
  }
}`,
      },
      go: {
        bad: `// Одна структура делает всё
type FileManager struct{}

func (f *FileManager) Read(path string) ([]byte, error) {
    return os.ReadFile(path)
}
func (f *FileManager) Compress(data []byte) []byte {
    var buf bytes.Buffer
    gz := gzip.NewWriter(&buf)
    gz.Write(data); gz.Close()
    return buf.Bytes()
}
func (f *FileManager) Upload(data []byte, key string) error {
    return s3.Upload(key, data)
}`,
        good: `// Три отдельные структуры
type FileReader struct{}
func (r *FileReader) Read(path string) ([]byte, error) { return os.ReadFile(path) }

type Compressor struct{}
func (c *Compressor) Compress(data []byte) []byte { /* gzip */ return nil }

type CloudUploader struct{}
func (u *CloudUploader) Upload(data []byte, key string) error { return s3.Upload(key, data) }`,
      },
      python: {
        bad: `# Один класс делает всё
class FileManager:
    def read(self, path: str) -> bytes:
        return open(path, "rb").read()
    def compress(self, data: bytes) -> bytes:
        return gzip.compress(data)
    def upload_to_cloud(self, data: bytes, key: str):
        s3.put_object(Bucket="my-bucket", Key=key, Body=data)`,
        good: `# Три отдельных класса
class FileReader:
    def read(self, path: str) -> bytes:
        return open(path, "rb").read()

class FileCompressor:
    def compress(self, data: bytes) -> bytes:
        return gzip.compress(data)

class CloudUploader:
    def upload(self, data: bytes, key: str):
        s3.put_object(Bucket="my-bucket", Key=key, Body=data)`,
      },
    },
    principle: 'S',
  },

  // 9. Сервис оплаты, который и валидирует карту, и списывает, и отправляет чек
  {
    text: 'PaymentService валидирует номер карты, списывает средства и отправляет чек на email. Сколько классов должно быть по SRP?',
    options: [
      'Один — PaymentService',
      'Два — PaymentService и ReceiptService',
      'Три — CardValidator, PaymentProcessor, ReceiptSender',
      'Четыре — нужен ещё логгер',
    ],
    correctIndex: 2,
    explanation:
      'По SRP каждая из трёх задач — отдельная ответственность: валидация карты, проведение платежа и отправка чека. Каждая может меняться по своей причине.',
    codeExamples: {
      ts: {
        bad: `// Один сервис делает всё
class PaymentService {
  pay(card: string, amount: number, email: string) {
    if (!/^\\d{16}$/.test(card)) throw new Error('Неверная карта');
    stripe.charge({ card, amount });
    mailer.send({ to: email, text: \`Оплачено: \${amount}\` });
  }
}`,
        good: `// Три отдельных класса
class CardValidator {
  validate(card: string) { if (!/^\\d{16}$/.test(card)) throw new Error('Неверная карта'); }
}
class PaymentProcessor {
  charge(card: string, amount: number) { stripe.charge({ card, amount }); }
}
class ReceiptSender {
  send(email: string, amount: number) { mailer.send({ to: email, text: \`Оплачено: \${amount}\` }); }
}`,
      },
      go: {
        bad: `// Один сервис делает всё
type PaymentService struct{}

func (p *PaymentService) Pay(card string, amount float64, email string) error {
    if len(card) != 16 { return errors.New("неверная карта") }
    stripe.Charge(card, amount)
    mailer.Send(email, fmt.Sprintf("Оплачено: %.2f", amount))
    return nil
}`,
        good: `// Три отдельные структуры
type CardValidator struct{}
func (v *CardValidator) Validate(card string) error {
    if len(card) != 16 { return errors.New("неверная карта") }
    return nil
}
type PaymentProcessor struct{}
func (p *PaymentProcessor) Charge(card string, amount float64) { stripe.Charge(card, amount) }

type ReceiptSender struct{}
func (r *ReceiptSender) Send(email string, amount float64) { mailer.Send(email, fmt.Sprintf("Оплачено: %.2f", amount)) }`,
      },
      python: {
        bad: `# Один сервис делает всё
class PaymentService:
    def pay(self, card: str, amount: float, email: str):
        if len(card) != 16:
            raise ValueError("Неверная карта")
        stripe.charge(card=card, amount=amount)
        mailer.send(to=email, text=f"Оплачено: {amount}")`,
        good: `# Три отдельных класса
class CardValidator:
    def validate(self, card: str):
        if len(card) != 16: raise ValueError("Неверная карта")

class PaymentProcessor:
    def charge(self, card: str, amount: float):
        stripe.charge(card=card, amount=amount)

class ReceiptSender:
    def send(self, email: str, amount: float):
        mailer.send(to=email, text=f"Оплачено: {amount}")`,
      },
    },
    principle: 'S',
  },

  // 10. Класс с god-object антипаттерном
  {
    text: 'Класс Application содержит методы: handleRequest(), connectDB(), renderTemplate(), sendEmail(), logError(). Какой антипаттерн здесь представлен?',
    options: [
      'Singleton',
      'God Object',
      'Circular Dependency',
      'Anemic Domain Model',
    ],
    correctIndex: 1,
    explanation:
      'God Object — это антипаттерн, при котором один класс берёт на себя слишком много обязанностей. Это прямое нарушение SRP. Каждый метод здесь относится к отдельной области: HTTP, БД, шаблоны, почта, логирование.',
    codeExamples: {
      ts: {
        bad: `// God Object — всё в одном классе
class Application {
  handleRequest(req: Request) { /* маршрутизация */ }
  connectDB(url: string) { /* подключение к БД */ }
  renderTemplate(name: string, data: object) { /* шаблон */ }
  sendEmail(to: string, body: string) { /* почта */ }
  logError(err: Error) { /* логирование */ }
}`,
        good: `// Разделено на отдельные классы
class Router { handle(req: Request) { /* маршрутизация */ } }
class Database { connect(url: string) { /* подключение */ } }
class TemplateEngine { render(name: string, data: object) { /* шаблон */ } }
class Mailer { send(to: string, body: string) { /* почта */ } }
class Logger { error(err: Error) { /* логирование */ } }`,
      },
      go: {
        bad: `// God Object — всё в одной структуре
type Application struct{}

func (a *Application) HandleRequest(w http.ResponseWriter, r *http.Request) {}
func (a *Application) ConnectDB(url string) error { return nil }
func (a *Application) RenderTemplate(name string, data any) string { return "" }
func (a *Application) SendEmail(to, body string) error { return nil }
func (a *Application) LogError(err error) {}`,
        good: `// Разделено на отдельные структуры
type Router struct{}
func (rt *Router) Handle(w http.ResponseWriter, r *http.Request) {}

type Database struct{}
func (db *Database) Connect(url string) error { return nil }

type Mailer struct{}
func (m *Mailer) Send(to, body string) error { return nil }`,
      },
      python: {
        bad: `# God Object — всё в одном классе
class Application:
    def handle_request(self, request): ...
    def connect_db(self, url: str): ...
    def render_template(self, name: str, data: dict): ...
    def send_email(self, to: str, body: str): ...
    def log_error(self, err: Exception): ...`,
        good: `# Разделено на отдельные классы
class Router:
    def handle(self, request): ...

class Database:
    def connect(self, url: str): ...

class Mailer:
    def send(self, to: str, body: str): ...

class Logger:
    def error(self, err: Exception): ...`,
      },
    },
    principle: 'S',
  },

  // 11. Utility-класс со смешанными обязанностями (даты + строки + файлы)
  {
    text: 'Класс Utils содержит методы formatDate(), capitalizeString() и readFile(). Почему такой класс — плохая практика?',
    options: [
      'Потому что утилитные классы запрещены в ООП',
      'Потому что он смешивает несвязанные обязанности: даты, строки, файлы',
      'Потому что все методы должны быть асинхронными',
      'Потому что название класса слишком короткое',
    ],
    correctIndex: 1,
    explanation:
      'Класс Utils нарушает SRP, объединяя работу с датами, строками и файлами. Это три несвязанных области, которые меняются по разным причинам. Лучше создать DateUtils, StringUtils и FileUtils.',
    codeExamples: {
      ts: {
        bad: `// Свалка разных утилит в одном классе
class Utils {
  static formatDate(d: Date): string { return d.toISOString(); }
  static capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  static readFile(path: string): string {
    return fs.readFileSync(path, 'utf-8');
  }
}`,
        good: `// Утилиты разделены по области
class DateUtils {
  static format(d: Date): string { return d.toISOString(); }
}
class StringUtils {
  static capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
class FileUtils {
  static read(path: string): string { return fs.readFileSync(path, 'utf-8'); }
}`,
      },
      go: {
        bad: `// Свалка разных утилит в одном пакете
package utils

func FormatDate(t time.Time) string { return t.Format(time.RFC3339) }
func Capitalize(s string) string {
    if s == "" { return s }
    return strings.ToUpper(s[:1]) + s[1:]
}
func ReadFile(path string) (string, error) {
    data, err := os.ReadFile(path)
    return string(data), err
}`,
        good: `// Утилиты разделены по пакетам
package dateutil
func Format(t time.Time) string { return t.Format(time.RFC3339) }

package strutil
func Capitalize(s string) string {
    if s == "" { return s }
    return strings.ToUpper(s[:1]) + s[1:]
}

package fileutil
func Read(path string) (string, error) {
    data, err := os.ReadFile(path)
    return string(data), err
}`,
      },
      python: {
        bad: `# Свалка разных утилит в одном классе
class Utils:
    @staticmethod
    def format_date(d: datetime) -> str:
        return d.isoformat()
    @staticmethod
    def capitalize(s: str) -> str:
        return s.capitalize()
    @staticmethod
    def read_file(path: str) -> str:
        return open(path).read()`,
        good: `# Утилиты разделены по модулям
# date_utils.py
def format_date(d: datetime) -> str:
    return d.isoformat()

# string_utils.py
def capitalize(s: str) -> str:
    return s.capitalize()

# file_utils.py
def read_file(path: str) -> str:
    return open(path).read()`,
      },
    },
    principle: 'S',
  },

  // 12. Класс Order с методами расчёта скидки, отправки email и генерации PDF
  {
    text: 'Класс Order содержит: calculateDiscount(), sendConfirmationEmail() и generateInvoicePDF(). Сколько причин для изменения у этого класса?',
    options: [
      'Одна — изменение бизнес-логики заказа',
      'Две — скидки и уведомления',
      'Три — скидки, email, генерация PDF',
      'Причин для изменения нет',
    ],
    correctIndex: 2,
    explanation:
      'У класса три причины для изменения: правила расчёта скидок, формат/способ отправки email, формат PDF-документа. Каждая причина — отдельная ответственность: DiscountCalculator, EmailSender, PdfGenerator.',
    codeExamples: {
      ts: {
        bad: `// Order делает слишком много
class Order {
  items: Item[];
  calculateDiscount(): number {
    return this.items.length > 5 ? 0.1 : 0;
  }
  sendConfirmationEmail(email: string) {
    mailer.send({ to: email, subject: 'Заказ подтверждён' });
  }
  generateInvoicePDF(): Buffer {
    return pdf.create(\`Счёт: \${this.items.length} товаров\`);
  }
}`,
        good: `// Каждая ответственность — отдельный класс
class Order { items: Item[]; }
class DiscountCalculator {
  calculate(order: Order): number { return order.items.length > 5 ? 0.1 : 0; }
}
class OrderMailer {
  sendConfirmation(email: string) { mailer.send({ to: email, subject: 'Заказ подтверждён' }); }
}
class InvoiceGenerator {
  generate(order: Order): Buffer { return pdf.create(\`Счёт: \${order.items.length} товаров\`); }
}`,
      },
      go: {
        bad: `// Order делает слишком много
type Order struct{ Items []Item }

func (o *Order) CalcDiscount() float64 {
    if len(o.Items) > 5 { return 0.1 }
    return 0
}
func (o *Order) SendEmail(email string) { mailer.Send(email, "Заказ подтверждён") }
func (o *Order) GeneratePDF() []byte { return pdf.Create("Счёт") }`,
        good: `// Каждая ответственность — отдельная структура
type Order struct{ Items []Item }

type DiscountCalc struct{}
func (d *DiscountCalc) Calc(o *Order) float64 {
    if len(o.Items) > 5 { return 0.1 }
    return 0
}
type OrderMailer struct{}
func (m *OrderMailer) Send(email string) { mailer.Send(email, "Заказ подтверждён") }

type InvoiceGen struct{}
func (g *InvoiceGen) Generate(o *Order) []byte { return pdf.Create("Счёт") }`,
      },
      python: {
        bad: `# Order делает слишком много
class Order:
    def __init__(self, items: list):
        self.items = items
    def calculate_discount(self) -> float:
        return 0.1 if len(self.items) > 5 else 0
    def send_confirmation_email(self, email: str):
        mailer.send(to=email, subject="Заказ подтверждён")
    def generate_invoice_pdf(self) -> bytes:
        return pdf.create(f"Счёт: {len(self.items)} товаров")`,
        good: `# Каждая ответственность — отдельный класс
class Order:
    def __init__(self, items: list):
        self.items = items

class DiscountCalculator:
    def calculate(self, order: Order) -> float:
        return 0.1 if len(order.items) > 5 else 0

class OrderMailer:
    def send_confirmation(self, email: str):
        mailer.send(to=email, subject="Заказ подтверждён")

class InvoiceGenerator:
    def generate(self, order: Order) -> bytes:
        return pdf.create(f"Счёт: {len(order.items)} товаров")`,
      },
    },
    principle: 'S',
  },

  // 13. Middleware, который и аутентифицирует, и логирует, и rate-limit
  {
    text: 'Middleware-функция одновременно проверяет JWT-токен, логирует запрос и проверяет rate-limit. Как это исправить?',
    options: [
      'Оставить как есть — это стандартная практика для middleware',
      'Разделить на три отдельных middleware: authMiddleware, logMiddleware, rateLimitMiddleware',
      'Вынести всё в контроллер',
      'Использовать декоратор вместо middleware',
    ],
    correctIndex: 1,
    explanation:
      'Каждый middleware должен отвечать за одну задачу. Аутентификация, логирование и rate-limiting — три разных ответственности. Разделение позволяет переиспользовать, тестировать и настраивать каждый отдельно.',
    codeExamples: {
      ts: {
        bad: `// Один middleware делает всё
function middleware(req: Request, res: Response, next: Function) {
  // логирование
  console.log(\`\${req.method} \${req.url}\`);
  // аутентификация
  const token = req.headers.authorization;
  if (!verifyJWT(token)) return res.status(401).end();
  // rate limiting
  if (rateLimiter.isExceeded(req.ip)) return res.status(429).end();
  next();
}`,
        good: `// Три отдельных middleware
function logMiddleware(req: Request, res: Response, next: Function) {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}
function authMiddleware(req: Request, res: Response, next: Function) {
  if (!verifyJWT(req.headers.authorization)) return res.status(401).end();
  next();
}
function rateLimitMiddleware(req: Request, res: Response, next: Function) {
  if (rateLimiter.isExceeded(req.ip)) return res.status(429).end();
  next();
}`,
      },
      go: {
        bad: `// Один middleware делает всё
func AllInOneMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL) // логирование
        token := r.Header.Get("Authorization")
        if !verifyJWT(token) { w.WriteHeader(401); return } // аутентификация
        if rateLimiter.IsExceeded(r.RemoteAddr) { w.WriteHeader(429); return }
        next.ServeHTTP(w, r)
    })
}`,
        good: `// Три отдельных middleware
func LogMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL)
        next.ServeHTTP(w, r)
    })
}
func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if !verifyJWT(r.Header.Get("Authorization")) { w.WriteHeader(401); return }
        next.ServeHTTP(w, r)
    })
}`,
      },
      python: {
        bad: `# Один middleware делает всё
class AllInOneMiddleware:
    def __call__(self, request):
        print(f"{request.method} {request.path}")  # логирование
        if not verify_jwt(request.headers.get("Authorization")):
            return HttpResponse(status=401)  # аутентификация
        if rate_limiter.is_exceeded(request.META["REMOTE_ADDR"]):
            return HttpResponse(status=429)  # rate limit
        return self.get_response(request)`,
        good: `# Три отдельных middleware
class LogMiddleware:
    def __call__(self, request):
        print(f"{request.method} {request.path}")
        return self.get_response(request)

class AuthMiddleware:
    def __call__(self, request):
        if not verify_jwt(request.headers.get("Authorization")):
            return HttpResponse(status=401)
        return self.get_response(request)

class RateLimitMiddleware:
    def __call__(self, request):
        if rate_limiter.is_exceeded(request.META["REMOTE_ADDR"]):
            return HttpResponse(status=429)
        return self.get_response(request)`,
      },
    },
    principle: 'S',
  },

  // 14. Класс, нарушающий SRP через наследование (Base -> всё в одном)
  {
    text: 'Класс BaseService имеет методы log(), validate() и sendNotification(). Все сервисы наследуются от него. Какая проблема связана с SRP?',
    options: [
      'Наследование медленнее композиции',
      'Базовый класс навязывает потомкам три несвязанные ответственности',
      'Нужно использовать абстрактные методы',
      'Проблемы нет — это стандартный подход',
    ],
    correctIndex: 1,
    explanation:
      'Базовый класс с несвязанными методами нарушает SRP и навязывает все свои ответственности потомкам. Логирование, валидация и уведомления должны быть отдельными классами, внедряемыми через композицию.',
    codeExamples: {
      ts: {
        bad: `// Базовый класс навязывает лишние обязанности
class BaseService {
  log(msg: string) { console.log(msg); }
  validate(data: any) { if (!data) throw new Error('invalid'); }
  notify(email: string, msg: string) { mailer.send({ to: email, text: msg }); }
}
class UserService extends BaseService {
  createUser(data: any) {
    this.validate(data);
    this.log('User created');
    this.notify(data.email, 'Добро пожаловать');
  }
}`,
        good: `// Композиция вместо наследования
class UserService {
  constructor(
    private logger: Logger,
    private validator: Validator,
    private notifier: Notifier,
  ) {}
  createUser(data: UserData) {
    this.validator.validate(data);
    this.logger.log('User created');
    this.notifier.notify(data.email, 'Добро пожаловать');
  }
}`,
      },
      go: {
        bad: `// Встраивание навязывает лишние обязанности
type BaseService struct{}
func (b *BaseService) Log(msg string) { log.Println(msg) }
func (b *BaseService) Validate(data any) error { return nil }
func (b *BaseService) Notify(email, msg string) { mailer.Send(email, msg) }

type UserService struct{ BaseService }
func (u *UserService) CreateUser(data UserData) {
    u.Validate(data)
    u.Log("User created")
    u.Notify(data.Email, "Добро пожаловать")
}`,
        good: `// Композиция вместо встраивания
type UserService struct {
    logger   *Logger
    validator *Validator
    notifier *Notifier
}
func (u *UserService) CreateUser(data UserData) {
    u.validator.Validate(data)
    u.logger.Log("User created")
    u.notifier.Notify(data.Email, "Добро пожаловать")
}`,
      },
      python: {
        bad: `# Базовый класс навязывает лишние обязанности
class BaseService:
    def log(self, msg: str): print(msg)
    def validate(self, data): assert data, "invalid"
    def notify(self, email: str, msg: str): mailer.send(email, msg)

class UserService(BaseService):
    def create_user(self, data):
        self.validate(data)
        self.log("User created")
        self.notify(data["email"], "Добро пожаловать")`,
        good: `# Композиция вместо наследования
class UserService:
    def __init__(self, logger: Logger, validator: Validator, notifier: Notifier):
        self.logger = logger
        self.validator = validator
        self.notifier = notifier

    def create_user(self, data):
        self.validator.validate(data)
        self.logger.log("User created")
        self.notifier.notify(data["email"], "Добро пожаловать")`,
      },
    },
    principle: 'S',
  },

  // 15. Тест: как определить нарушение SRP — если описание класса содержит «и»
  {
    text: 'Какой простой тест помогает выявить нарушение SRP?',
    options: [
      'Если класс содержит больше 100 строк кода',
      'Если описание класса содержит слово «и» (например, «парсит и сохраняет»)',
      'Если класс использует больше двух зависимостей',
      'Если класс имеет больше трёх публичных методов',
    ],
    correctIndex: 1,
    explanation:
      'Простой тест на SRP: попробуйте описать, что делает класс, одним предложением. Если в описании появляется «и» — скорее всего, класс имеет несколько ответственностей. Например: «Класс парсит CSV и сохраняет в БД» — две ответственности.',
    codeExamples: {
      ts: {
        bad: `// «Класс парсит данные И отправляет отчёт»
class ReportManager {
  // Ответственность 1: парсинг
  parseData(raw: string): Data[] {
    return JSON.parse(raw);
  }
  // Ответственность 2: отправка
  sendReport(data: Data[]) {
    mailer.send({ subject: 'Отчёт', body: JSON.stringify(data) });
  }
}`,
        good: `// «Класс парсит данные» — одна ответственность
class DataParser {
  parse(raw: string): Data[] { return JSON.parse(raw); }
}
// «Класс отправляет отчёт» — одна ответственность
class ReportSender {
  send(data: Data[]) {
    mailer.send({ subject: 'Отчёт', body: JSON.stringify(data) });
  }
}`,
      },
      go: {
        bad: `// «Структура парсит данные И отправляет отчёт»
type ReportManager struct{}

func (r *ReportManager) ParseData(raw string) ([]Data, error) {
    var data []Data
    json.Unmarshal([]byte(raw), &data)
    return data, nil
}
func (r *ReportManager) SendReport(data []Data) {
    mailer.Send("Отчёт", data)
}`,
        good: `// «Структура парсит данные» — одна ответственность
type DataParser struct{}
func (p *DataParser) Parse(raw string) ([]Data, error) {
    var data []Data
    json.Unmarshal([]byte(raw), &data)
    return data, nil
}
// «Структура отправляет отчёт» — одна ответственность
type ReportSender struct{}
func (s *ReportSender) Send(data []Data) { mailer.Send("Отчёт", data) }`,
      },
      python: {
        bad: `# «Класс парсит данные И отправляет отчёт»
class ReportManager:
    def parse_data(self, raw: str) -> list:
        return json.loads(raw)  # парсинг

    def send_report(self, data: list):
        mailer.send(subject="Отчёт", body=json.dumps(data))  # отправка`,
        good: `# «Класс парсит данные» — одна ответственность
class DataParser:
    def parse(self, raw: str) -> list:
        return json.loads(raw)

# «Класс отправляет отчёт» — одна ответственность
class ReportSender:
    def send(self, data: list):
        mailer.send(subject="Отчёт", body=json.dumps(data))`,
      },
    },
    principle: 'S',
  },

  // 16. Repository, который ещё и кеширует
  {
    text: 'UserRepository содержит методы findById() с внутренней логикой кеширования (проверяет Redis, если нет — идёт в БД). Нарушает ли это SRP?',
    options: [
      'Нет, кеширование — часть доступа к данным',
      'Да, кеширование — отдельная ответственность, нужен CacheDecorator',
      'Нет, если кеш и БД — одна технология',
      'Да, но только если используется Redis',
    ],
    correctIndex: 1,
    explanation:
      'Кеширование — отдельная ответственность. Стратегия кеширования может меняться независимо от логики доступа к данным. Лучше использовать паттерн Decorator: CachedUserRepository оборачивает UserRepository.',
    codeExamples: {
      ts: {
        bad: `// Репозиторий сам управляет кешем
class UserRepository {
  async findById(id: string): Promise<User> {
    const cached = await redis.get(\`user:\${id}\`);
    if (cached) return JSON.parse(cached);
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    await redis.set(\`user:\${id}\`, JSON.stringify(user));
    return user;
  }
}`,
        good: `// Кеширование вынесено в декоратор
class UserRepository {
  async findById(id: string): Promise<User> {
    return db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}
class CachedUserRepository {
  constructor(private repo: UserRepository, private cache: Redis) {}
  async findById(id: string): Promise<User> {
    const cached = await this.cache.get(\`user:\${id}\`);
    if (cached) return JSON.parse(cached);
    const user = await this.repo.findById(id);
    await this.cache.set(\`user:\${id}\`, JSON.stringify(user));
    return user;
  }
}`,
      },
      go: {
        bad: `// Репозиторий сам управляет кешем
type UserRepo struct{ db *sql.DB; cache *redis.Client }

func (r *UserRepo) FindByID(id string) (*User, error) {
    cached, err := r.cache.Get(ctx, "user:"+id).Result()
    if err == nil { return parseUser(cached), nil }
    user, _ := r.db.Query("SELECT * FROM users WHERE id = ?", id)
    r.cache.Set(ctx, "user:"+id, serialize(user), time.Hour)
    return user, nil
}`,
        good: `// Кеширование вынесено в декоратор
type UserRepo struct{ db *sql.DB }
func (r *UserRepo) FindByID(id string) (*User, error) {
    return r.db.Query("SELECT * FROM users WHERE id = ?", id)
}

type CachedUserRepo struct{ repo *UserRepo; cache *redis.Client }
func (c *CachedUserRepo) FindByID(id string) (*User, error) {
    cached, err := c.cache.Get(ctx, "user:"+id).Result()
    if err == nil { return parseUser(cached), nil }
    user, _ := c.repo.FindByID(id)
    c.cache.Set(ctx, "user:"+id, serialize(user), time.Hour)
    return user, nil
}`,
      },
      python: {
        bad: `# Репозиторий сам управляет кешем
class UserRepository:
    def find_by_id(self, id: str) -> User:
        cached = redis.get(f"user:{id}")
        if cached:
            return json.loads(cached)
        user = db.execute("SELECT * FROM users WHERE id = ?", (id,))
        redis.set(f"user:{id}", json.dumps(user))
        return user`,
        good: `# Кеширование вынесено в декоратор
class UserRepository:
    def find_by_id(self, id: str) -> User:
        return db.execute("SELECT * FROM users WHERE id = ?", (id,))

class CachedUserRepository:
    def __init__(self, repo: UserRepository, cache):
        self.repo = repo
        self.cache = cache
    def find_by_id(self, id: str) -> User:
        cached = self.cache.get(f"user:{id}")
        if cached: return json.loads(cached)
        user = self.repo.find_by_id(id)
        self.cache.set(f"user:{id}", json.dumps(user))
        return user`,
      },
    },
    principle: 'S',
  },

  // 17. Service с бизнес-логикой и инфраструктурным кодом
  {
    text: 'Класс OrderService содержит бизнес-правила расчёта цены и напрямую использует SQL-запросы для сохранения данных. Какой принцип нарушен и почему?',
    options: [
      'Liskov Substitution — нельзя подставить другую реализацию',
      'SRP — бизнес-логика и инфраструктура (SQL) — разные ответственности',
      'Open/Closed — класс не расширяется',
      'DIP — класс зависит от абстракций',
    ],
    correctIndex: 1,
    explanation:
      'Бизнес-логика (расчёт цены) и инфраструктурный код (SQL-запросы) — это разные ответственности. Бизнес-правила меняются из-за требований бизнеса, а SQL — из-за изменений в БД. Их нужно разделить.',
    codeExamples: {
      ts: {
        bad: `// Бизнес-логика смешана с SQL
class OrderService {
  calculateAndSave(items: Item[]) {
    const total = items.reduce((s, i) => s + i.price, 0);
    const tax = total * 0.2;
    // SQL прямо в сервисе
    db.query('INSERT INTO orders (total, tax) VALUES (?, ?)', [total, tax]);
  }
}`,
        good: `// Бизнес-логика отделена от инфраструктуры
class OrderService {
  constructor(private repo: OrderRepository) {}
  create(items: Item[]) {
    const total = items.reduce((s, i) => s + i.price, 0);
    const tax = total * 0.2;
    this.repo.save({ total, tax });
  }
}
class OrderRepository {
  save(order: { total: number; tax: number }) {
    db.query('INSERT INTO orders (total, tax) VALUES (?, ?)', [order.total, order.tax]);
  }
}`,
      },
      go: {
        bad: `// Бизнес-логика смешана с SQL
type OrderService struct{ db *sql.DB }

func (s *OrderService) CalculateAndSave(items []Item) error {
    total := 0.0
    for _, i := range items { total += i.Price }
    tax := total * 0.2
    _, err := s.db.Exec("INSERT INTO orders (total, tax) VALUES (?, ?)", total, tax)
    return err
}`,
        good: `// Бизнес-логика отделена от инфраструктуры
type OrderService struct{ repo *OrderRepo }
func (s *OrderService) Create(items []Item) error {
    total := 0.0
    for _, i := range items { total += i.Price }
    return s.repo.Save(Order{Total: total, Tax: total * 0.2})
}

type OrderRepo struct{ db *sql.DB }
func (r *OrderRepo) Save(o Order) error {
    _, err := r.db.Exec("INSERT INTO orders (total, tax) VALUES (?, ?)", o.Total, o.Tax)
    return err
}`,
      },
      python: {
        bad: `# Бизнес-логика смешана с SQL
class OrderService:
    def calculate_and_save(self, items: list[Item]):
        total = sum(i.price for i in items)
        tax = total * 0.2
        db.execute(
            "INSERT INTO orders (total, tax) VALUES (?, ?)", (total, tax)
        )`,
        good: `# Бизнес-логика отделена от инфраструктуры
class OrderService:
    def __init__(self, repo: OrderRepository):
        self.repo = repo
    def create(self, items: list[Item]):
        total = sum(i.price for i in items)
        self.repo.save(Order(total=total, tax=total * 0.2))

class OrderRepository:
    def save(self, order: Order):
        db.execute(
            "INSERT INTO orders (total, tax) VALUES (?, ?)",
            (order.total, order.tax),
        )`,
      },
    },
    principle: 'S',
  },

  // 18. Вопрос про причину изменения (reason to change) — ключевую формулировку SRP
  {
    text: 'Роберт Мартин определяет SRP так: «У класса должна быть только одна причина для изменения». Что подразумевается под «причиной для изменения»?',
    options: [
      'Баг в коде, который нужно исправить',
      'Группа пользователей или стейкхолдер, чьи требования могут измениться',
      'Новая версия языка программирования',
      'Изменение в сторонней библиотеке',
    ],
    correctIndex: 1,
    explanation:
      'Под «причиной для изменения» Мартин подразумевает актора — группу пользователей или стейкхолдера. Если класс обслуживает нескольких акторов (бухгалтерию и HR), то изменение требований одного актора заставит менять код, влияющий на другого.',
    codeExamples: {
      ts: {
        bad: `// Два актора: бухгалтерия и HR
class Employee {
  // Актор 1: бухгалтерия определяет правила расчёта
  calculatePay(): number {
    return this.hoursWorked * this.hourlyRate;
  }
  // Актор 2: HR определяет правила отчётности
  generateHRReport(): string {
    return \`Сотрудник: \${this.name}, часы: \${this.hoursWorked}\`;
  }
}`,
        good: `// Каждый актор — свой класс
class Employee { name: string; hoursWorked: number; hourlyRate: number; }

// Актор: бухгалтерия
class PayCalculator {
  calculate(emp: Employee): number {
    return emp.hoursWorked * emp.hourlyRate;
  }
}
// Актор: HR
class HRReportGenerator {
  generate(emp: Employee): string {
    return \`Сотрудник: \${emp.name}, часы: \${emp.hoursWorked}\`;
  }
}`,
      },
      go: {
        bad: `// Два актора: бухгалтерия и HR
type Employee struct {
    Name string; HoursWorked float64; HourlyRate float64
}
// Актор 1: бухгалтерия
func (e *Employee) CalculatePay() float64 {
    return e.HoursWorked * e.HourlyRate
}
// Актор 2: HR
func (e *Employee) GenerateHRReport() string {
    return fmt.Sprintf("Сотрудник: %s, часы: %.0f", e.Name, e.HoursWorked)
}`,
        good: `// Каждый актор — своя структура
type Employee struct { Name string; HoursWorked, HourlyRate float64 }

type PayCalculator struct{} // Актор: бухгалтерия
func (p *PayCalculator) Calc(e *Employee) float64 {
    return e.HoursWorked * e.HourlyRate
}

type HRReporter struct{} // Актор: HR
func (h *HRReporter) Report(e *Employee) string {
    return fmt.Sprintf("Сотрудник: %s, часы: %.0f", e.Name, e.HoursWorked)
}`,
      },
      python: {
        bad: `# Два актора: бухгалтерия и HR
class Employee:
    def __init__(self, name: str, hours: float, rate: float):
        self.name = name
        self.hours = hours
        self.rate = rate
    # Актор 1: бухгалтерия
    def calculate_pay(self) -> float:
        return self.hours * self.rate
    # Актор 2: HR
    def generate_hr_report(self) -> str:
        return f"Сотрудник: {self.name}, часы: {self.hours}"`,
        good: `# Каждый актор — свой класс
class Employee:
    def __init__(self, name: str, hours: float, rate: float):
        self.name = name; self.hours = hours; self.rate = rate

class PayCalculator:  # Актор: бухгалтерия
    def calculate(self, emp: Employee) -> float:
        return emp.hours * emp.rate

class HRReportGenerator:  # Актор: HR
    def generate(self, emp: Employee) -> str:
        return f"Сотрудник: {emp.name}, часы: {emp.hours}"`,
      },
    },
    principle: 'S',
  },
];
