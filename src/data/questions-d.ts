import type { QuestionData } from './types';

export const dipQuestions: QuestionData[] = [
  // 1. Сервис с new внутри конструктора vs инъекция через параметр
  {
    text: 'Сервис PaymentService создаёт зависимость через new StripeGateway() внутри конструктора. Что нужно сделать для соблюдения DIP?',
    options: [
      'Передать зависимость через параметр конструктора в виде абстракции',
      'Сделать StripeGateway синглтоном',
      'Вынести создание в статический метод',
      'Использовать глобальную переменную для хранения экземпляра',
    ],
    correctIndex: 0,
    explanation:
      'DIP требует, чтобы модуль высокого уровня (PaymentService) зависел от абстракции (интерфейса), а не от конкретной реализации. Передача зависимости через параметр конструктора в виде интерфейса решает эту проблему.',
    codeExamples: {
      ts: {
        bad: `// Жёсткая зависимость от конкретного класса
class PaymentService {
  private gateway = new StripeGateway();

  pay(amount: number) {
    this.gateway.charge(amount);
  }
}`,
        good: `// Зависимость от абстракции
interface PaymentGateway {
  charge(amount: number): void;
}
class PaymentService {
  constructor(private gateway: PaymentGateway) {}

  pay(amount: number) {
    this.gateway.charge(amount);
  }
}`,
      },
      go: {
        bad: `// Жёсткая зависимость от конкретного типа
type PaymentService struct {
    gateway StripeGateway // конкретный тип
}
func NewPaymentService() *PaymentService {
    return &PaymentService{gateway: StripeGateway{}}
}`,
        good: `// Зависимость от абстракции
type PaymentGateway interface {
    Charge(amount float64) error
}
type PaymentService struct {
    gateway PaymentGateway
}
func NewPaymentService(gw PaymentGateway) *PaymentService {
    return &PaymentService{gateway: gw}
}`,
      },
      python: {
        bad: `# Жёсткая зависимость от конкретного класса
class PaymentService:
    def __init__(self):
        self.gateway = StripeGateway()  # new внутри

    def pay(self, amount: float):
        self.gateway.charge(amount)`,
        good: `# Зависимость от абстракции
class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, amount: float): ...

class PaymentService:
    def __init__(self, gateway: PaymentGateway):
        self.gateway = gateway

    def pay(self, amount: float):
        self.gateway.charge(amount)`,
      },
    },
    principle: 'D',
  },

  // 2. Разница между DI (Dependency Injection) и DIP (Dependency Inversion)
  {
    text: 'В чём ключевое различие между Dependency Injection (DI) и Dependency Inversion Principle (DIP)?',
    options: [
      'DI и DIP — это одно и то же, просто разные названия',
      'DI — это техника передачи зависимостей, DIP — принцип проектирования, требующий зависимости от абстракций',
      'DIP — это паттерн из GoF, а DI — из SOLID',
      'DI применяется только в Java, а DIP — универсален',
    ],
    correctIndex: 1,
    explanation:
      'DIP — это принцип проектирования (модули должны зависеть от абстракций). DI — это техника (способ передачи зависимости извне). Можно использовать DI без DIP (инъектить конкретный класс), и можно соблюдать DIP без DI-контейнера.',
    codeExamples: {
      ts: {
        bad: `// DI есть, но DIP нарушен — инъекция конкретного класса
class OrderService {
  constructor(private repo: MySQLOrderRepo) {}
  // MySQL передан извне, но это всё ещё конкретика
}
const svc = new OrderService(new MySQLOrderRepo());`,
        good: `// DI + DIP — инъекция через абстракцию
interface OrderRepo {
  findAll(): Order[];
}
class OrderService {
  constructor(private repo: OrderRepo) {}
}
// Можно подставить любую реализацию
const svc = new OrderService(new PostgresOrderRepo());`,
      },
      go: {
        bad: `// DI есть, но DIP нарушен — конкретный тип
type OrderService struct {
    repo MySQLOrderRepo // конкретный тип
}
func NewOrderService(r MySQLOrderRepo) *OrderService {
    return &OrderService{repo: r}
}`,
        good: `// DI + DIP — интерфейс
type OrderRepo interface {
    FindAll() ([]Order, error)
}
type OrderService struct {
    repo OrderRepo // абстракция
}
func NewOrderService(r OrderRepo) *OrderService {
    return &OrderService{repo: r}
}`,
      },
      python: {
        bad: `# DI есть, но DIP нарушен — конкретный тип
class OrderService:
    def __init__(self, repo: MySQLOrderRepo):
        self.repo = repo  # конкретный класс
# MySQL передан извне, но это конкретика`,
        good: `# DI + DIP — инъекция абстракции
class OrderRepo(ABC):
    @abstractmethod
    def find_all(self) -> list[Order]: ...

class OrderService:
    def __init__(self, repo: OrderRepo):
        self.repo = repo  # абстракция`,
      },
    },
    principle: 'D',
  },

  // 3. Инверсия через конструктор vs сеттер vs интерфейс
  {
    text: 'Какой способ внедрения зависимостей считается наиболее предпочтительным с точки зрения DIP?',
    options: [
      'Через сеттер, потому что можно менять зависимость в рантайме',
      'Через Service Locator, потому что он централизован',
      'Через конструктор с типом-абстракцией, потому что зависимость обязательна и неизменна',
      'Через глобальный реестр, потому что он доступен отовсюду',
    ],
    correctIndex: 2,
    explanation:
      'Инъекция через конструктор с абстрактным типом — предпочтительный способ: зависимость явная, обязательная, неизменна после создания объекта, и легко тестируется.',
    codeExamples: {
      ts: {
        bad: `// Сеттер — зависимость может быть не установлена
class ReportService {
  private printer?: Printer;
  setPrinter(p: Printer) { this.printer = p; }
  print(data: string) {
    this.printer!.print(data); // может быть undefined!
  }
}`,
        good: `// Конструктор — зависимость гарантирована
interface Printer {
  print(data: string): void;
}
class ReportService {
  constructor(private printer: Printer) {}
  print(data: string) {
    this.printer.print(data); // всегда определён
  }
}`,
      },
      go: {
        bad: `// Сеттер — зависимость может быть nil
type ReportService struct {
    printer *ConsolePrinter // может быть nil
}
func (s *ReportService) SetPrinter(p *ConsolePrinter) {
    s.printer = p
}`,
        good: `// Конструктор — зависимость гарантирована
type Printer interface {
    Print(data string)
}
type ReportService struct {
    printer Printer
}
func NewReportService(p Printer) *ReportService {
    return &ReportService{printer: p}
}`,
      },
      python: {
        bad: `# Сеттер — зависимость может быть не установлена
class ReportService:
    def __init__(self):
        self.printer = None  # может быть None!

    def set_printer(self, p):
        self.printer = p`,
        good: `# Конструктор — зависимость гарантирована
class Printer(ABC):
    @abstractmethod
    def print(self, data: str): ...

class ReportService:
    def __init__(self, printer: Printer):
        self.printer = printer  # всегда задан`,
      },
    },
    principle: 'D',
  },

  // 4. Composition Root — где создаются зависимости
  {
    text: 'Что такое Composition Root в контексте DIP?',
    options: [
      'Базовый класс, от которого наследуются все сервисы',
      'Единственное место в приложении, где создаются и связываются все зависимости',
      'Корневой интерфейс, который реализуют все модули',
      'Паттерн, запрещающий использование конструкторов',
    ],
    correctIndex: 1,
    explanation:
      'Composition Root — это единственная точка (обычно main или entry point), где создаются конкретные реализации и передаются в модули через конструкторы. Бизнес-логика при этом работает только с абстракциями.',
    codeExamples: {
      ts: {
        bad: `// Зависимости создаются повсюду
class UserController {
  private svc = new UserService(new PgUserRepo());
}
class UserService {
  private mailer = new SmtpMailer();
}
// Связывание размазано по всему коду`,
        good: `// Composition Root — всё собирается в одном месте
function main() {
  const repo = new PgUserRepo();
  const mailer = new SmtpMailer();
  const svc = new UserService(repo, mailer);
  const ctrl = new UserController(svc);
  ctrl.start();
}`,
      },
      go: {
        bad: `// Зависимости разбросаны
func NewUserController() *UserController {
    repo := &PgUserRepo{}
    svc := &UserService{repo: repo}
    return &UserController{svc: svc}
}`,
        good: `// Composition Root — main
func main() {
    repo := &PgUserRepo{}
    mailer := &SmtpMailer{}
    svc := NewUserService(repo, mailer)
    ctrl := NewUserController(svc)
    ctrl.Start()
}`,
      },
      python: {
        bad: `# Зависимости создаются внутри классов
class UserController:
    def __init__(self):
        repo = PgUserRepo()
        self.svc = UserService(repo)`,
        good: `# Composition Root — точка входа
def main():
    repo = PgUserRepo()
    mailer = SmtpMailer()
    svc = UserService(repo, mailer)
    ctrl = UserController(svc)
    ctrl.start()`,
      },
    },
    principle: 'D',
  },

  // 5. Абстрактная фабрика для создания зависимостей
  {
    text: 'Как абстрактная фабрика помогает соблюдать DIP?',
    options: [
      'Она заставляет все классы наследоваться от одного базового',
      'Она позволяет модулю высокого уровня создавать объекты через абстракцию, не зная конкретных классов',
      'Она запрещает использование оператора new',
      'Она автоматически внедряет зависимости через рефлексию',
    ],
    correctIndex: 1,
    explanation:
      'Абстрактная фабрика позволяет модулю высокого уровня создавать объекты, завися только от интерфейса фабрики. Конкретная фабрика подставляется извне, и модуль не знает, какие именно объекты создаются.',
    codeExamples: {
      ts: {
        bad: `// Прямое создание — знаем конкретные классы
class Dialog {
  render() {
    const btn = new WindowsButton();
    const input = new WindowsInput();
    // Жёстко привязан к Windows
  }
}`,
        good: `// Абстрактная фабрика — не знаем конкретику
interface UIFactory {
  createButton(): Button;
  createInput(): Input;
}
class Dialog {
  constructor(private factory: UIFactory) {}
  render() {
    const btn = this.factory.createButton();
    const input = this.factory.createInput();
  }
}`,
      },
      go: {
        bad: `// Прямое создание — привязка к конкретике
func NewDialog() *Dialog {
    btn := &WindowsButton{}
    input := &WindowsInput{}
    return &Dialog{btn: btn, input: input}
}`,
        good: `// Абстрактная фабрика
type UIFactory interface {
    CreateButton() Button
    CreateInput() Input
}
func NewDialog(f UIFactory) *Dialog {
    btn := f.CreateButton()
    input := f.CreateInput()
    return &Dialog{btn: btn, input: input}
}`,
      },
      python: {
        bad: `# Прямое создание — привязка к конкретике
class Dialog:
    def render(self):
        btn = WindowsButton()
        inp = WindowsInput()
        # Жёстко привязан к Windows`,
        good: `# Абстрактная фабрика
class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...
    @abstractmethod
    def create_input(self) -> Input: ...

class Dialog:
    def __init__(self, factory: UIFactory):
        self.factory = factory
    def render(self):
        btn = self.factory.create_button()`,
      },
    },
    principle: 'D',
  },

  // 6. Сервис логирования с жёсткой привязкой к файловой системе
  {
    text: 'Сервис аналитики напрямую использует FileLogger для записи логов. Что произойдёт при переходе на облачный логгер?',
    options: [
      'Ничего — FileLogger легко заменить',
      'Придётся изменить код AnalyticsService, что нарушает и DIP, и OCP',
      'Достаточно переименовать FileLogger в CloudLogger',
      'Нужно создать прокси-класс между ними',
    ],
    correctIndex: 1,
    explanation:
      'Если AnalyticsService зависит от конкретного FileLogger, то замена на CloudLogger требует изменения бизнес-логики. Это нарушает DIP (зависимость от конкретики) и OCP (модификация существующего кода).',
    codeExamples: {
      ts: {
        bad: `// Жёсткая привязка к файловой системе
class AnalyticsService {
  private logger = new FileLogger('/var/log/app.log');

  track(event: string) {
    this.logger.writeToFile(event);
    // Замена на CloudWatch — переписывать класс
  }
}`,
        good: `// Абстракция логгера
interface Logger {
  log(message: string): void;
}
class AnalyticsService {
  constructor(private logger: Logger) {}
  track(event: string) {
    this.logger.log(event);
  }
}
// FileLogger, CloudLogger — любая реализация`,
      },
      go: {
        bad: `// Жёсткая привязка к файлу
type AnalyticsService struct {
    logger FileLogger // конкретный тип
}
func (a *AnalyticsService) Track(event string) {
    a.logger.WriteToFile(event)
}`,
        good: `// Абстракция логгера
type Logger interface {
    Log(message string)
}
type AnalyticsService struct {
    logger Logger
}
func (a *AnalyticsService) Track(event string) {
    a.logger.Log(event)
}`,
      },
      python: {
        bad: `# Жёсткая привязка к файлу
class AnalyticsService:
    def __init__(self):
        self.logger = FileLogger("/var/log/app.log")

    def track(self, event: str):
        self.logger.write_to_file(event)`,
        good: `# Абстракция логгера
class Logger(ABC):
    @abstractmethod
    def log(self, message: str): ...

class AnalyticsService:
    def __init__(self, logger: Logger):
        self.logger = logger

    def track(self, event: str):
        self.logger.log(event)`,
      },
    },
    principle: 'D',
  },

  // 7. Тестируемость: мок через интерфейс vs жёсткая зависимость
  {
    text: 'Почему жёсткая зависимость от конкретного класса затрудняет юнит-тестирование?',
    options: [
      'Потому что конкретные классы нельзя наследовать',
      'Потому что невозможно подменить зависимость мок-объектом без интерфейса',
      'Потому что юнит-тесты работают только с абстрактными классами',
      'Потому что конкретные классы всегда медленнее абстрактных',
    ],
    correctIndex: 1,
    explanation:
      'Если класс напрямую создаёт конкретную зависимость (например, реальную БД), подменить её моком для тестирования невозможно без рефакторинга. Интерфейс позволяет легко подставить мок-реализацию.',
    codeExamples: {
      ts: {
        bad: `// Нельзя протестировать без реальной БД
class UserService {
  private db = new PostgresDB();
  getUser(id: string) {
    return this.db.query(\`SELECT * FROM users WHERE id='\${id}'\`);
  }
}
// Тест потребует запущенную PostgreSQL`,
        good: `// Легко подменить мок-объектом
interface DB { query(sql: string): any; }
class UserService {
  constructor(private db: DB) {}
  getUser(id: string) { return this.db.query('...'); }
}
// В тесте:
const mockDB: DB = { query: () => ({ id: '1' }) };
const svc = new UserService(mockDB);`,
      },
      go: {
        bad: `// Нельзя протестировать без реальной БД
type UserService struct {
    db PostgresDB // конкретный тип
}
func (s *UserService) GetUser(id string) User {
    return s.db.Query("SELECT ...")
}`,
        good: `// Легко подменить мок-объектом
type DB interface {
    Query(sql string) User
}
type UserService struct {
    db DB
}
// В тесте — мок:
type MockDB struct{}
func (m MockDB) Query(sql string) User {
    return User{ID: "1"}
}`,
      },
      python: {
        bad: `# Нельзя протестировать без реальной БД
class UserService:
    def __init__(self):
        self.db = PostgresDB()

    def get_user(self, user_id: str):
        return self.db.query(f"SELECT ... {user_id}")`,
        good: `# Легко подменить мок-объектом
class DB(ABC):
    @abstractmethod
    def query(self, sql: str): ...

class UserService:
    def __init__(self, db: DB):
        self.db = db

# В тесте — мок:
mock_db = Mock(spec=DB)
svc = UserService(mock_db)`,
      },
    },
    principle: 'D',
  },

  // 8. Слой use case зависит от интерфейса репозитория, а не от конкретной БД
  {
    text: 'В Clean Architecture слой use case определяет интерфейс UserRepository. Где должна находиться конкретная реализация PostgresUserRepository?',
    options: [
      'В том же слое, что и use case',
      'Во внешнем слое (инфраструктура), реализуя интерфейс из слоя use case',
      'В слое domain entities',
      'В слое presentation (UI)',
    ],
    correctIndex: 1,
    explanation:
      'Согласно DIP и Clean Architecture, интерфейс определяется в слое use case (высокий уровень), а конкретная реализация (PostgresUserRepository) живёт в слое инфраструктуры (низкий уровень) и реализует этот интерфейс.',
    codeExamples: {
      ts: {
        bad: `// use case импортирует конкретную реализацию
import { PgUserRepo } from '../infra/PgUserRepo';

class CreateUser {
  private repo = new PgUserRepo();
  execute(data: UserData) {
    this.repo.save(data);
  }
}`,
        good: `// use case определяет интерфейс
// файл: usecases/ports.ts
interface UserRepository {
  save(data: UserData): void;
}
// файл: usecases/CreateUser.ts
class CreateUser {
  constructor(private repo: UserRepository) {}
  execute(data: UserData) { this.repo.save(data); }
}
// infra/PgUserRepo.ts реализует UserRepository`,
      },
      go: {
        bad: `// use case импортирует конкретную реализацию
import "app/infra"

type CreateUser struct {
    repo infra.PgUserRepo // зависимость от infra
}`,
        good: `// use case определяет интерфейс
// usecases/ports.go
type UserRepository interface {
    Save(data UserData) error
}
// usecases/create_user.go
type CreateUser struct {
    repo UserRepository // абстракция
}
// infra/pg_user_repo.go реализует интерфейс`,
      },
      python: {
        bad: `# use case импортирует конкретную реализацию
from infra.pg_user_repo import PgUserRepo

class CreateUser:
    def __init__(self):
        self.repo = PgUserRepo()`,
        good: `# use case определяет интерфейс
# usecases/ports.py
class UserRepository(ABC):
    @abstractmethod
    def save(self, data: UserData): ...

# usecases/create_user.py
class CreateUser:
    def __init__(self, repo: UserRepository):
        self.repo = repo
# infra/pg_user_repo.py реализует UserRepository`,
      },
    },
    principle: 'D',
  },

  // 9. Event-driven архитектура и инверсия зависимостей
  {
    text: 'Как event-driven архитектура помогает соблюдать DIP?',
    options: [
      'Она заставляет все модули наследоваться от класса Event',
      'Публикатор события не знает о подписчиках — оба зависят от абстракции события',
      'Она запрещает прямые вызовы методов между модулями',
      'Она автоматически создаёт интерфейсы для всех классов',
    ],
    correctIndex: 1,
    explanation:
      'В event-driven архитектуре публикатор и подписчик не знают друг о друге — оба зависят от абстракции (тип события). Это естественная реализация DIP: модули общаются через абстракцию, а не напрямую.',
    codeExamples: {
      ts: {
        bad: `// Прямая зависимость — OrderService знает о EmailService
class OrderService {
  private email = new EmailService();
  createOrder(data: OrderData) {
    // ... создание заказа
    this.email.sendConfirmation(data);
  }
}`,
        good: `// Event-driven — модули независимы
interface EventBus {
  publish(event: string, data: unknown): void;
}
class OrderService {
  constructor(private bus: EventBus) {}
  createOrder(data: OrderData) {
    // ... создание заказа
    this.bus.publish('order.created', data);
  }
}
// EmailService подписывается отдельно`,
      },
      go: {
        bad: `// Прямая зависимость
type OrderService struct {
    email EmailService // знает о конкретике
}
func (s *OrderService) CreateOrder(data OrderData) {
    // ... создание заказа
    s.email.SendConfirmation(data)
}`,
        good: `// Event-driven — модули независимы
type EventBus interface {
    Publish(event string, data interface{})
}
type OrderService struct {
    bus EventBus
}
func (s *OrderService) CreateOrder(data OrderData) {
    // ... создание заказа
    s.bus.Publish("order.created", data)
}`,
      },
      python: {
        bad: `# Прямая зависимость
class OrderService:
    def __init__(self):
        self.email = EmailService()

    def create_order(self, data):
        # ... создание заказа
        self.email.send_confirmation(data)`,
        good: `# Event-driven — модули независимы
class EventBus(ABC):
    @abstractmethod
    def publish(self, event: str, data): ...

class OrderService:
    def __init__(self, bus: EventBus):
        self.bus = bus

    def create_order(self, data):
        # ... создание заказа
        self.bus.publish("order.created", data)`,
      },
    },
    principle: 'D',
  },

  // 10. Ports and Adapters (Hexagonal) как реализация DIP
  {
    text: 'Как паттерн Ports and Adapters (Hexagonal Architecture) реализует DIP?',
    options: [
      'Порты — это конкретные классы, адаптеры — интерфейсы',
      'Ядро приложения определяет порты (интерфейсы), а адаптеры (внешний слой) реализуют их',
      'Адаптеры определяют интерфейсы, которые ядро обязано реализовать',
      'Порты и адаптеры — это синонимы для getter и setter',
    ],
    correctIndex: 1,
    explanation:
      'В Hexagonal Architecture ядро (бизнес-логика) определяет порты — интерфейсы для взаимодействия с внешним миром. Адаптеры (БД, HTTP, очереди) реализуют эти порты. Зависимости направлены от адаптеров к ядру — это и есть DIP.',
    codeExamples: {
      ts: {
        bad: `// Ядро зависит от внешнего слоя
import { AxiosHttpClient } from '../adapters/http';
class ProductService {
  private http = new AxiosHttpClient();
  getPrice(id: string) {
    return this.http.get(\`/prices/\${id}\`);
  }
}`,
        good: `// Порт — интерфейс в ядре
interface PriceProvider {
  getPrice(id: string): Promise<number>;
}
// Ядро зависит только от порта
class ProductService {
  constructor(private prices: PriceProvider) {}
  getPrice(id: string) { return this.prices.getPrice(id); }
}
// Адаптер реализует порт снаружи`,
      },
      go: {
        bad: `// Ядро импортирует адаптер
import "app/adapters/http"
type ProductService struct {
    client http.AxiosClient // внешний адаптер
}`,
        good: `// Порт — интерфейс в ядре
type PriceProvider interface {
    GetPrice(id string) (float64, error)
}
// Ядро зависит от порта
type ProductService struct {
    prices PriceProvider
}
// Адаптер в пакете adapters реализует PriceProvider`,
      },
      python: {
        bad: `# Ядро зависит от внешнего слоя
from adapters.http import AxiosHttpClient

class ProductService:
    def __init__(self):
        self.http = AxiosHttpClient()`,
        good: `# Порт — интерфейс в ядре
class PriceProvider(ABC):
    @abstractmethod
    def get_price(self, id: str) -> float: ...

# Ядро зависит только от порта
class ProductService:
    def __init__(self, prices: PriceProvider):
        self.prices = prices
# Адаптер реализует порт снаружи`,
      },
    },
    principle: 'D',
  },

  // 11. Сервис отправки уведомлений с хардкодом конкретного провайдера
  {
    text: 'NotificationService содержит код: this.twilio.sendSMS(phone, text). Что нарушено и как исправить?',
    options: [
      'Нарушен SRP — нужно вынести SMS в отдельный класс',
      'Нарушен DIP — нужно заменить конкретный Twilio на интерфейс NotificationChannel',
      'Ничего не нарушено, Twilio — стандартный провайдер',
      'Нарушен LSP — Twilio не может быть заменён другим провайдером',
    ],
    correctIndex: 1,
    explanation:
      'NotificationService (высокий уровень) жёстко привязан к Twilio (низкий уровень). Нужно ввести абстракцию NotificationChannel, чтобы можно было легко заменить провайдера.',
    codeExamples: {
      ts: {
        bad: `// Хардкод провайдера Twilio
class NotificationService {
  private twilio = new TwilioClient('key');

  sendAlert(phone: string, text: string) {
    this.twilio.sendSMS(phone, text);
    // Заменить на Vonage? Переписывать весь класс
  }
}`,
        good: `// Абстракция канала уведомлений
interface NotificationChannel {
  send(to: string, message: string): void;
}
class NotificationService {
  constructor(private channel: NotificationChannel) {}
  sendAlert(to: string, text: string) {
    this.channel.send(to, text);
  }
}
// TwilioChannel, VonageChannel — реализации`,
      },
      go: {
        bad: `// Хардкод Twilio
type NotificationService struct {
    twilio TwilioClient
}
func (n *NotificationService) SendAlert(phone, text string) {
    n.twilio.SendSMS(phone, text)
}`,
        good: `// Абстракция канала
type NotificationChannel interface {
    Send(to, message string) error
}
type NotificationService struct {
    channel NotificationChannel
}
func (n *NotificationService) SendAlert(to, text string) {
    n.channel.Send(to, text)
}`,
      },
      python: {
        bad: `# Хардкод Twilio
class NotificationService:
    def __init__(self):
        self.twilio = TwilioClient("key")

    def send_alert(self, phone: str, text: str):
        self.twilio.send_sms(phone, text)`,
        good: `# Абстракция канала
class NotificationChannel(ABC):
    @abstractmethod
    def send(self, to: str, message: str): ...

class NotificationService:
    def __init__(self, channel: NotificationChannel):
        self.channel = channel

    def send_alert(self, to: str, text: str):
        self.channel.send(to, text)`,
      },
    },
    principle: 'D',
  },

  // 12. Модуль высокого уровня импортирует модуль низкого уровня напрямую
  {
    text: 'Модуль бизнес-логики содержит import { PgPool } from "pg". Какую проблему это создаёт с точки зрения DIP?',
    options: [
      'Никакой проблемы — это нормальная практика',
      'Бизнес-логика напрямую зависит от конкретной библиотеки БД, что делает её непереносимой и нетестируемой',
      'Проблема только в производительности',
      'Это нарушение SRP, а не DIP',
    ],
    correctIndex: 1,
    explanation:
      'Когда бизнес-логика импортирует конкретную библиотеку (pg, mysql2 и т.д.), она становится привязана к деталям реализации. По DIP бизнес-логика должна зависеть от абстракции (интерфейса репозитория).',
    codeExamples: {
      ts: {
        bad: `// Бизнес-логика зависит от конкретной библиотеки
import { Pool } from 'pg';

class OrderUseCase {
  private pool = new Pool({ connectionString: '...' });
  async getOrders() {
    const res = await this.pool.query('SELECT ...');
    return res.rows;
  }
}`,
        good: `// Бизнес-логика зависит от абстракции
interface OrderRepository {
  getAll(): Promise<Order[]>;
}
class OrderUseCase {
  constructor(private repo: OrderRepository) {}
  async getOrders() {
    return this.repo.getAll();
  }
}
// PgOrderRepository импортирует pg в слое инфраструктуры`,
      },
      go: {
        bad: `// Бизнес-логика зависит от драйвера БД
import "database/sql"
type OrderUseCase struct {
    db *sql.DB // конкретный драйвер
}
func (u *OrderUseCase) GetOrders() ([]Order, error) {
    rows, _ := u.db.Query("SELECT ...")
}`,
        good: `// Бизнес-логика зависит от абстракции
type OrderRepository interface {
    GetAll() ([]Order, error)
}
type OrderUseCase struct {
    repo OrderRepository
}
func (u *OrderUseCase) GetOrders() ([]Order, error) {
    return u.repo.GetAll()
}`,
      },
      python: {
        bad: `# Бизнес-логика зависит от драйвера
import psycopg2

class OrderUseCase:
    def __init__(self):
        self.conn = psycopg2.connect("...")

    def get_orders(self):
        cur = self.conn.cursor()
        cur.execute("SELECT ...")`,
        good: `# Бизнес-логика зависит от абстракции
class OrderRepository(ABC):
    @abstractmethod
    def get_all(self) -> list[Order]: ...

class OrderUseCase:
    def __init__(self, repo: OrderRepository):
        self.repo = repo

    def get_orders(self):
        return self.repo.get_all()`,
      },
    },
    principle: 'D',
  },

  // 13. Инверсия зависимости через callback / функцию высшего порядка
  {
    text: 'Можно ли реализовать DIP без классов и интерфейсов, используя функции высшего порядка?',
    options: [
      'Нет, DIP работает только с классами и интерфейсами',
      'Да, функция высшего порядка принимает callback как абстракцию, не зная конкретной реализации',
      'Только в функциональных языках вроде Haskell',
      'Только если callback обёрнут в класс-адаптер',
    ],
    correctIndex: 1,
    explanation:
      'DIP — это принцип проектирования, а не привязка к ООП. Функция, принимающая callback (или функцию-параметр), зависит от абстракции (сигнатуры), а не от конкретной реализации. Это полноценная реализация DIP.',
    codeExamples: {
      ts: {
        bad: `// Жёсткая зависимость внутри функции
function processData(data: string[]) {
  const result = data.map(x => x.toUpperCase());
  fs.writeFileSync('/tmp/out.txt', result.join('\\n'));
  // Нельзя заменить вывод без изменения функции
}`,
        good: `// Callback как абстракция
type OutputFn = (data: string) => void;

function processData(data: string[], output: OutputFn) {
  const result = data.map(x => x.toUpperCase());
  output(result.join('\\n'));
}
// Можно передать запись в файл, консоль, HTTP...
processData(items, console.log);`,
      },
      go: {
        bad: `// Жёсткая зависимость внутри функции
func ProcessData(data []string) {
    result := strings.Join(data, "\\n")
    os.WriteFile("/tmp/out.txt", []byte(result), 0644)
    // Нельзя заменить вывод
}`,
        good: `// Функция как абстракция
type OutputFn func(data string) error

func ProcessData(data []string, output OutputFn) {
    result := strings.Join(data, "\\n")
    output(result)
}
// Можно передать любую функцию вывода
ProcessData(items, func(s string) error {
    fmt.Println(s); return nil
})`,
      },
      python: {
        bad: `# Жёсткая зависимость внутри функции
def process_data(data: list[str]):
    result = "\\n".join(x.upper() for x in data)
    with open("/tmp/out.txt", "w") as f:
        f.write(result)  # нельзя заменить`,
        good: `# Callback как абстракция
from typing import Callable
OutputFn = Callable[[str], None]

def process_data(data: list[str], output: OutputFn):
    result = "\\n".join(x.upper() for x in data)
    output(result)

# Можно передать print, запись в файл, HTTP...
process_data(items, print)`,
      },
    },
    principle: 'D',
  },

  // 14. DI-контейнер: плюсы и минусы
  {
    text: 'Какой главный риск при использовании DI-контейнера?',
    options: [
      'DI-контейнер нарушает принцип единственной ответственности',
      'DI-контейнер всегда замедляет приложение',
      'Ошибки связывания обнаруживаются только в рантайме, а не при компиляции',
      'DI-контейнер запрещает использование интерфейсов',
    ],
    correctIndex: 2,
    explanation:
      'Главный минус DI-контейнеров — потеря проверок на этапе компиляции. Если забыть зарегистрировать зависимость, ошибка проявится только при запуске приложения. Ручной DI через конструктор ловит такие ошибки на этапе компиляции.',
    codeExamples: {
      ts: {
        bad: `// DI-контейнер — ошибка только в рантайме
container.register('UserRepo', PgUserRepo);
// Забыли зарегистрировать Logger!
const svc = container.resolve<UserService>('UserService');
// Runtime Error: Logger not registered`,
        good: `// Ручной DI — ошибка при компиляции
const repo = new PgUserRepo();
const logger = new ConsoleLogger();
// Если забыть logger — ошибка TypeScript
const svc = new UserService(repo, logger);`,
      },
      go: {
        bad: `// DI-контейнер — ошибка в рантайме
container.Register("UserRepo", &PgUserRepo{})
// Забыли зарегистрировать Logger!
svc := container.Resolve("UserService")
// panic: Logger not registered`,
        good: `// Ручной DI — ошибка при компиляции
repo := &PgUserRepo{}
logger := &ConsoleLogger{}
// Если забыть logger — ошибка компилятора
svc := NewUserService(repo, logger)`,
      },
      python: {
        bad: `# DI-контейнер — ошибка в рантайме
container.register("user_repo", PgUserRepo)
# Забыли зарегистрировать logger!
svc = container.resolve(UserService)
# RuntimeError: Logger not registered`,
        good: `# Ручной DI — ошибка очевидна
repo = PgUserRepo()
logger = ConsoleLogger()
# Если забыть logger — TypeError при вызове
svc = UserService(repo, logger)`,
      },
    },
    principle: 'D',
  },

  // 15. Нарушение DIP в конфигурации — когда бизнес-логика читает env напрямую
  {
    text: 'Бизнес-логика содержит вызов process.env.STRIPE_KEY. Нарушает ли это DIP?',
    options: [
      'Нет, переменные окружения — это не зависимость',
      'Да, бизнес-логика зависит от конкретного источника конфигурации (env), а должна получать значения через абстракцию',
      'Нет, если переменная обёрнута в try/catch',
      'Да, но только в production-окружении',
    ],
    correctIndex: 1,
    explanation:
      'Чтение process.env напрямую в бизнес-логике — это зависимость от конкретного источника конфигурации. По DIP конфигурация должна передаваться через абстракцию (интерфейс конфига или параметр конструктора).',
    codeExamples: {
      ts: {
        bad: `// Бизнес-логика зависит от env напрямую
class BillingService {
  charge(amount: number) {
    const key = process.env.STRIPE_KEY!;
    const stripe = new Stripe(key);
    stripe.charge(amount);
  }
}`,
        good: `// Конфиг передаётся как абстракция
interface Config {
  stripeKey: string;
}
class BillingService {
  constructor(private config: Config) {}
  charge(amount: number) {
    // config передан извне, источник неизвестен
  }
}`,
      },
      go: {
        bad: `// Бизнес-логика читает env напрямую
func (s *BillingService) Charge(amount float64) {
    key := os.Getenv("STRIPE_KEY")
    client := stripe.New(key)
    client.Charge(amount)
}`,
        good: `// Конфиг передаётся как зависимость
type Config struct {
    StripeKey string
}
type BillingService struct {
    config Config
}
func NewBillingService(cfg Config) *BillingService {
    return &BillingService{config: cfg}
}`,
      },
      python: {
        bad: `# Бизнес-логика читает env напрямую
import os

class BillingService:
    def charge(self, amount: float):
        key = os.environ["STRIPE_KEY"]
        client = StripeClient(key)
        client.charge(amount)`,
        good: `# Конфиг передаётся как зависимость
@dataclass
class Config:
    stripe_key: str

class BillingService:
    def __init__(self, config: Config):
        self.config = config
    # Источник конфига неизвестен бизнес-логике`,
      },
    },
    principle: 'D',
  },

  // 16. Принцип «зависимости направлены внутрь» в Clean Architecture
  {
    text: 'В Clean Architecture правило зависимостей (Dependency Rule) гласит:',
    options: [
      'Внутренние слои могут импортировать внешние слои',
      'Зависимости всегда направлены от внутренних слоёв к внешним',
      'Зависимости исходного кода могут указывать только внутрь — внешние слои зависят от внутренних, но не наоборот',
      'Все слои должны быть независимы друг от друга',
    ],
    correctIndex: 2,
    explanation:
      'Dependency Rule в Clean Architecture — это прямое применение DIP: внешние слои (UI, БД, фреймворки) зависят от внутренних (use cases, entities), но внутренние слои ничего не знают о внешних.',
    codeExamples: {
      ts: {
        bad: `// Внутренний слой (use case) зависит от внешнего
import { ExpressRequest } from 'express';
import { PrismaClient } from '@prisma/client';

class CreateOrderUseCase {
  execute(req: ExpressRequest) {
    const prisma = new PrismaClient();
    // Use case знает о фреймворке и ORM
  }
}`,
        good: `// Внутренний слой не знает о внешних
interface OrderRepo { save(order: Order): Promise<void>; }

class CreateOrderUseCase {
  constructor(private repo: OrderRepo) {}
  execute(data: OrderData) {
    const order = new Order(data);
    return this.repo.save(order);
  }
}
// Express и Prisma — во внешнем слое`,
      },
      go: {
        bad: `// Use case зависит от HTTP и ORM
import (
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)
type CreateOrderUseCase struct {
    db *gorm.DB
}`,
        good: `// Use case не знает о внешних слоях
type OrderRepo interface {
    Save(order Order) error
}
type CreateOrderUseCase struct {
    repo OrderRepo
}
func (uc *CreateOrderUseCase) Execute(data OrderData) error {
    order := NewOrder(data)
    return uc.repo.Save(order)
}`,
      },
      python: {
        bad: `# Use case зависит от фреймворка и ORM
from flask import request
from sqlalchemy import create_engine

class CreateOrderUseCase:
    def execute(self):
        data = request.json  # знает о Flask
        engine = create_engine("...")  # знает об ORM`,
        good: `# Use case не знает о внешних слоях
class OrderRepo(ABC):
    @abstractmethod
    def save(self, order: Order): ...

class CreateOrderUseCase:
    def __init__(self, repo: OrderRepo):
        self.repo = repo
    def execute(self, data: OrderData):
        order = Order(data)
        self.repo.save(order)`,
      },
    },
    principle: 'D',
  },

  // 17. Антипаттерн Service Locator vs Dependency Injection
  {
    text: 'Почему Service Locator считается антипаттерном с точки зрения DIP?',
    options: [
      'Потому что он слишком медленный',
      'Потому что он скрывает реальные зависимости класса — они не видны в конструкторе',
      'Потому что он требует слишком много памяти',
      'Потому что он работает только с синглтонами',
    ],
    correctIndex: 1,
    explanation:
      'Service Locator скрывает зависимости: класс выглядит как не имеющий зависимостей, но внутри обращается к глобальному контейнеру. Это затрудняет тестирование, нарушает явность зависимостей и создаёт скрытую связность.',
    codeExamples: {
      ts: {
        bad: `// Service Locator — зависимости скрыты
class OrderService {
  process(orderId: string) {
    const repo = ServiceLocator.get<OrderRepo>('OrderRepo');
    const mailer = ServiceLocator.get<Mailer>('Mailer');
    // Зависимости не видны снаружи
  }
}`,
        good: `// DI — зависимости явные
class OrderService {
  constructor(
    private repo: OrderRepo,
    private mailer: Mailer,
  ) {}
  process(orderId: string) {
    // Зависимости видны в конструкторе
  }
}`,
      },
      go: {
        bad: `// Service Locator — зависимости скрыты
func (s *OrderService) Process(orderID string) {
    repo := locator.Get("OrderRepo").(OrderRepo)
    mailer := locator.Get("Mailer").(Mailer)
    // Зависимости не видны снаружи
}`,
        good: `// DI — зависимости явные
type OrderService struct {
    repo   OrderRepo
    mailer Mailer
}
func NewOrderService(r OrderRepo, m Mailer) *OrderService {
    return &OrderService{repo: r, mailer: m}
}`,
      },
      python: {
        bad: `# Service Locator — зависимости скрыты
class OrderService:
    def process(self, order_id: str):
        repo = service_locator.get("OrderRepo")
        mailer = service_locator.get("Mailer")
        # Зависимости не видны снаружи`,
        good: `# DI — зависимости явные
class OrderService:
    def __init__(self, repo: OrderRepo, mailer: Mailer):
        self.repo = repo
        self.mailer = mailer
    # Зависимости видны в конструкторе`,
      },
    },
    principle: 'D',
  },

  // 18. Интерфейс определяется потребителем, а не поставщиком
  {
    text: 'Согласно DIP, кто должен определять интерфейс — потребитель (клиент) или поставщик (реализация)?',
    options: [
      'Поставщик, потому что он знает свои возможности',
      'Потребитель, потому что он знает, какие методы ему нужны',
      'Оба вместе, путём переговоров',
      'Ни тот, ни другой — интерфейс генерируется автоматически',
    ],
    correctIndex: 1,
    explanation:
      'В DIP интерфейс принадлежит потребителю (модулю высокого уровня). Потребитель определяет, что ему нужно, а поставщик (модуль низкого уровня) адаптируется к этому интерфейсу. Это и есть «инверсия» — направление зависимости меняется.',
    codeExamples: {
      ts: {
        bad: `// Интерфейс определён поставщиком (БД)
// db/types.ts — пакет поставщика
interface PgQueryResult { rows: any[]; oid: number; }
// use case вынужден работать с типами БД
class UserService {
  constructor(private db: PgDatabase) {}
  getUser(id: string): PgQueryResult { ... }
}`,
        good: `// Интерфейс определён потребителем (use case)
// usecases/ports.ts — пакет потребителя
interface UserFinder {
  findById(id: string): Promise<User | null>;
}
class UserService {
  constructor(private finder: UserFinder) {}
  getUser(id: string) { return this.finder.findById(id); }
}
// БД-адаптер реализует интерфейс потребителя`,
      },
      go: {
        bad: `// Интерфейс в пакете поставщика
// package pgdb
type PgDB interface {
    Query(sql string) (*PgResult, error)
}
// Use case зависит от типов БД
type UserService struct {
    db pgdb.PgDB
}`,
        good: `// Интерфейс в пакете потребителя
// package usecases
type UserFinder interface {
    FindByID(id string) (*User, error)
}
type UserService struct {
    finder UserFinder
}
// Адаптер БД реализует UserFinder`,
      },
      python: {
        bad: `# Интерфейс определён поставщиком (БД)
# db/types.py
class PgQueryResult:
    rows: list
    oid: int

# use case работает с типами БД
class UserService:
    def get_user(self, id: str) -> PgQueryResult: ...`,
        good: `# Интерфейс определён потребителем
# usecases/ports.py
class UserFinder(ABC):
    @abstractmethod
    def find_by_id(self, id: str) -> User | None: ...

class UserService:
    def __init__(self, finder: UserFinder):
        self.finder = finder
# Адаптер БД реализует UserFinder`,
      },
    },
    principle: 'D',
  },
];
