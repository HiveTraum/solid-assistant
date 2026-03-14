import type { QuestionData } from './types';

export const ispQuestions: QuestionData[] = [
  // 1. Жирный интерфейс Printer
  {
    text: 'Класс SimplePrinter реализует интерфейс с методами print(), scan(), fax() и staple(). Простой принтер умеет только печатать. Что нарушается?',
    options: [
      'Single Responsibility Principle',
      'Interface Segregation Principle',
      'Open/Closed Principle',
      'Dependency Inversion Principle',
    ],
    correctIndex: 1,
    explanation:
      'Interface Segregation Principle (ISP) гласит: клиенты не должны зависеть от методов, которые они не используют. SimplePrinter вынужден реализовывать scan(), fax() и staple(), хотя не поддерживает эти функции.',
    codeExamples: {
      ts: {
        bad: `// Жирный интерфейс — принтер обязан реализовать всё
interface Machine {
  print(doc: string): void;
  scan(doc: string): void;
  fax(doc: string): void;
  staple(doc: string): void;
}
class SimplePrinter implements Machine {
  print(doc: string) { /* ок */ }
  scan() { throw new Error("Не умею!"); }
  fax() { throw new Error("Не умею!"); }
  staple() { throw new Error("Не умею!"); }
}`,
        good: `// Разделённые интерфейсы
interface Printer { print(doc: string): void; }
interface Scanner { scan(doc: string): void; }
interface Fax { fax(doc: string): void; }
interface Stapler { staple(doc: string): void; }

class SimplePrinter implements Printer {
  print(doc: string) { /* ок */ }
}
// МФУ реализует несколько интерфейсов
class AllInOne implements Printer, Scanner, Fax {
  print(doc: string) { /* ... */ }
  scan(doc: string) { /* ... */ }
  fax(doc: string) { /* ... */ }
}`,
      },
      go: {
        bad: `// Жирный интерфейс
type Machine interface {
    Print(doc string)
    Scan(doc string)
    Fax(doc string)
    Staple(doc string)
}
// SimplePrinter вынужден реализовать всё
type SimplePrinter struct{}
func (p SimplePrinter) Print(doc string) {}
func (p SimplePrinter) Scan(doc string)  { panic("не умею") }
func (p SimplePrinter) Fax(doc string)   { panic("не умею") }
func (p SimplePrinter) Staple(doc string){ panic("не умею") }`,
        good: `// Маленькие интерфейсы
type Printer interface { Print(doc string) }
type Scanner interface { Scan(doc string) }
type Faxer interface  { Fax(doc string) }

type SimplePrinter struct{}
func (p SimplePrinter) Print(doc string) { /* ок */ }

// МФУ реализует несколько интерфейсов
type AllInOne struct{}
func (a AllInOne) Print(doc string) {}
func (a AllInOne) Scan(doc string)  {}
func (a AllInOne) Fax(doc string)   {}`,
      },
      python: {
        bad: `# Жирный интерфейс
class Machine(ABC):
    @abstractmethod
    def print(self, doc: str): ...
    @abstractmethod
    def scan(self, doc: str): ...
    @abstractmethod
    def fax(self, doc: str): ...
    @abstractmethod
    def staple(self, doc: str): ...

class SimplePrinter(Machine):
    def print(self, doc): ...  # ок
    def scan(self, doc): raise NotImplementedError
    def fax(self, doc): raise NotImplementedError
    def staple(self, doc): raise NotImplementedError`,
        good: `# Разделённые интерфейсы
class Printer(ABC):
    @abstractmethod
    def print(self, doc: str): ...

class Scanner(ABC):
    @abstractmethod
    def scan(self, doc: str): ...

class SimplePrinter(Printer):
    def print(self, doc: str):
        ...  # только печать

class AllInOne(Printer, Scanner):
    def print(self, doc: str): ...
    def scan(self, doc: str): ...`,
      },
    },
    principle: 'I',
  },
  // 2. Интерфейс Vehicle с fly(), sail(), drive()
  {
    text: 'Интерфейс Vehicle содержит методы fly(), sail() и drive(). Класс Car реализует этот интерфейс и выбрасывает исключение в fly() и sail(). Какое решение наиболее правильное с точки зрения ISP?',
    options: [
      'Оставить пустые реализации fly() и sail() в Car',
      'Разделить Vehicle на Flyable, Sailable и Drivable',
      'Сделать fly() и sail() необязательными через дефолтные реализации',
      'Создать базовый класс AbstractVehicle с пустыми методами',
    ],
    correctIndex: 1,
    explanation:
      'ISP рекомендует разделить большой интерфейс на маленькие, чтобы каждый клиент зависел только от нужных ему методов. Car реализует только Drivable, а Airplane — Flyable и Drivable.',
    codeExamples: {
      ts: {
        bad: `// Единый «толстый» интерфейс
interface Vehicle {
  fly(): void;
  sail(): void;
  drive(): void;
}
class Car implements Vehicle {
  drive() { console.log("Еду"); }
  fly() { throw new Error("Машина не летает!"); }
  sail() { throw new Error("Машина не плавает!"); }
}`,
        good: `// Разделённые интерфейсы способностей
interface Drivable { drive(): void; }
interface Flyable  { fly(): void; }
interface Sailable { sail(): void; }

class Car implements Drivable {
  drive() { console.log("Еду"); }
}
class Amphibia implements Drivable, Sailable {
  drive() { console.log("Еду"); }
  sail()  { console.log("Плыву"); }
}`,
      },
      go: {
        bad: `// Толстый интерфейс транспорта
type Vehicle interface {
    Fly()
    Sail()
    Drive()
}
type Car struct{}
func (c Car) Drive() { fmt.Println("Еду") }
func (c Car) Fly()   { panic("не летаю") }
func (c Car) Sail()  { panic("не плаваю") }`,
        good: `// Маленькие интерфейсы
type Drivable interface { Drive() }
type Flyable  interface { Fly() }
type Sailable interface { Sail() }

type Car struct{}
func (c Car) Drive() { fmt.Println("Еду") }

type Amphibia struct{}
func (a Amphibia) Drive() { fmt.Println("Еду") }
func (a Amphibia) Sail()  { fmt.Println("Плыву") }`,
      },
      python: {
        bad: `# Толстый интерфейс
class Vehicle(ABC):
    @abstractmethod
    def fly(self): ...
    @abstractmethod
    def sail(self): ...
    @abstractmethod
    def drive(self): ...

class Car(Vehicle):
    def drive(self): print("Еду")
    def fly(self): raise NotImplementedError
    def sail(self): raise NotImplementedError`,
        good: `# Разделённые интерфейсы
class Drivable(ABC):
    @abstractmethod
    def drive(self): ...

class Sailable(ABC):
    @abstractmethod
    def sail(self): ...

class Car(Drivable):
    def drive(self): print("Еду")

class Amphibia(Drivable, Sailable):
    def drive(self): print("Еду")
    def sail(self): print("Плыву")`,
      },
    },
    principle: 'I',
  },
  // 3. Repository интерфейс с CRUD + search + aggregate
  {
    text: 'Сервис отчётов использует интерфейс Repository с методами create(), update(), delete(), findById(), search() и aggregate(). Для отчётов нужны только findById() и aggregate(). Как правильно рефакторить по ISP?',
    options: [
      'Передавать полный Repository и просто не вызывать ненужные методы',
      'Создать ReadRepository и WriteRepository, передавать только ReadRepository',
      'Удалить ненужные методы из Repository',
      'Сделать все методы необязательными',
    ],
    correctIndex: 1,
    explanation:
      'По ISP интерфейс нужно разделить на ReadRepository (findById, search, aggregate) и WriteRepository (create, update, delete). Сервис отчётов зависит только от ReadRepository.',
    codeExamples: {
      ts: {
        bad: `// Сервис зависит от полного репозитория
interface Repository<T> {
  create(item: T): void;
  update(id: string, item: T): void;
  delete(id: string): void;
  findById(id: string): T;
  search(query: string): T[];
  aggregate(pipeline: any): any;
}
class ReportService {
  constructor(private repo: Repository<Order>) {}
  // использует только findById и aggregate
}`,
        good: `// Разделённые интерфейсы
interface ReadRepo<T> {
  findById(id: string): T;
  search(query: string): T[];
  aggregate(pipeline: any): any;
}
interface WriteRepo<T> {
  create(item: T): void;
  update(id: string, item: T): void;
  delete(id: string): void;
}
class ReportService {
  constructor(private repo: ReadRepo<Order>) {}
}`,
      },
      go: {
        bad: `// Единый интерфейс репозитория
type Repository interface {
    Create(item any) error
    Update(id string, item any) error
    Delete(id string) error
    FindByID(id string) (any, error)
    Search(query string) ([]any, error)
    Aggregate(pipeline any) (any, error)
}
// ReportService зависит от всего Repository
type ReportService struct { repo Repository }`,
        good: `// Разделённые интерфейсы
type Reader interface {
    FindByID(id string) (any, error)
    Search(query string) ([]any, error)
    Aggregate(pipeline any) (any, error)
}
type Writer interface {
    Create(item any) error
    Update(id string, item any) error
    Delete(id string) error
}
// Зависимость только от Reader
type ReportService struct { repo Reader }`,
      },
      python: {
        bad: `# Единый репозиторий
class Repository(ABC):
    @abstractmethod
    def create(self, item): ...
    @abstractmethod
    def update(self, id, item): ...
    @abstractmethod
    def delete(self, id): ...
    @abstractmethod
    def find_by_id(self, id): ...
    @abstractmethod
    def search(self, query): ...
    @abstractmethod
    def aggregate(self, pipeline): ...

class ReportService:
    def __init__(self, repo: Repository): ...`,
        good: `# Разделённые интерфейсы
class ReadRepo(ABC):
    @abstractmethod
    def find_by_id(self, id): ...
    @abstractmethod
    def search(self, query): ...
    @abstractmethod
    def aggregate(self, pipeline): ...

class WriteRepo(ABC):
    @abstractmethod
    def create(self, item): ...
    @abstractmethod
    def update(self, id, item): ...

class ReportService:
    def __init__(self, repo: ReadRepo): ...`,
      },
    },
    principle: 'I',
  },
  // 4. Интерфейс SmartDevice
  {
    text: 'Интерфейс SmartDevice содержит методы: turnOn(), turnOff(), setTemperature(), playMusic(), lock(), unlock(). Умная лампочка должна его реализовать. Что является главным признаком нарушения ISP?',
    options: [
      'Слишком много методов в интерфейсе',
      'Клиент вынужден реализовывать методы, которые не имеют для него смысла',
      'Интерфейс содержит и getter-ы и setter-ы',
      'Методы возвращают void',
    ],
    correctIndex: 1,
    explanation:
      'Главный признак нарушения ISP — клиент вынужден зависеть от методов, которые ему не нужны. Лампочка не может setTemperature(), playMusic(), lock() — эти методы для неё бессмысленны.',
    codeExamples: {
      ts: {
        bad: `// Один интерфейс для всех устройств
interface SmartDevice {
  turnOn(): void;
  turnOff(): void;
  setTemperature(t: number): void;
  playMusic(track: string): void;
  lock(): void;
  unlock(): void;
}
class SmartBulb implements SmartDevice {
  turnOn() { /* ок */ }
  turnOff() { /* ок */ }
  setTemperature() { /* ??? */ }
  playMusic() { /* ??? */ }
  lock() { /* ??? */ }
  unlock() { /* ??? */ }
}`,
        good: `// Роли устройств разделены
interface Switchable { turnOn(): void; turnOff(): void; }
interface Thermostat { setTemperature(t: number): void; }
interface MusicPlayer { playMusic(track: string): void; }
interface Lockable { lock(): void; unlock(): void; }

class SmartBulb implements Switchable {
  turnOn() { /* включить */ }
  turnOff() { /* выключить */ }
}
class SmartSpeaker implements Switchable, MusicPlayer {
  turnOn() {} turnOff() {}
  playMusic(track: string) {}
}`,
      },
      go: {
        bad: `// Один интерфейс для всех устройств
type SmartDevice interface {
    TurnOn()
    TurnOff()
    SetTemperature(t float64)
    PlayMusic(track string)
    Lock()
    Unlock()
}
type SmartBulb struct{}
func (b SmartBulb) TurnOn()  {}
func (b SmartBulb) TurnOff() {}
func (b SmartBulb) SetTemperature(float64) { panic("нет") }
func (b SmartBulb) PlayMusic(string) { panic("нет") }
func (b SmartBulb) Lock()   { panic("нет") }
func (b SmartBulb) Unlock() { panic("нет") }`,
        good: `// Маленькие интерфейсы по ролям
type Switchable interface {
    TurnOn()
    TurnOff()
}
type Lockable interface {
    Lock()
    Unlock()
}
type SmartBulb struct{}
func (b SmartBulb) TurnOn()  { /* включить */ }
func (b SmartBulb) TurnOff() { /* выключить */ }`,
      },
      python: {
        bad: `# Один интерфейс для всех устройств
class SmartDevice(ABC):
    @abstractmethod
    def turn_on(self): ...
    @abstractmethod
    def turn_off(self): ...
    @abstractmethod
    def set_temperature(self, t): ...
    @abstractmethod
    def play_music(self, track): ...
    @abstractmethod
    def lock(self): ...

class SmartBulb(SmartDevice):
    def turn_on(self): ...  # ок
    def turn_off(self): ... # ок
    def set_temperature(self, t): raise NotImplementedError
    def play_music(self, track): raise NotImplementedError
    def lock(self): raise NotImplementedError`,
        good: `# Разделённые интерфейсы
class Switchable(ABC):
    @abstractmethod
    def turn_on(self): ...
    @abstractmethod
    def turn_off(self): ...

class Lockable(ABC):
    @abstractmethod
    def lock(self): ...
    @abstractmethod
    def unlock(self): ...

class SmartBulb(Switchable):
    def turn_on(self): print("Свет включён")
    def turn_off(self): print("Свет выключен")`,
      },
    },
    principle: 'I',
  },
  // 5. UserService с admin-методами
  {
    text: 'Интерфейс UserService содержит методы: getProfile(), updateProfile(), banUser(), deleteUser(), assignRole(). Компонент профиля обычного пользователя зависит от UserService. Какая проблема возникает?',
    options: [
      'Нарушение DIP — компонент зависит от конкретного класса',
      'Нарушение ISP — компонент профиля зависит от admin-методов banUser, deleteUser, assignRole',
      'Нарушение OCP — нельзя добавить новые методы без изменения интерфейса',
      'Нарушение SRP — слишком много ответственностей в одном сервисе',
    ],
    correctIndex: 1,
    explanation:
      'Компонент профиля обычного пользователя зависит от методов banUser(), deleteUser(), assignRole(), которые ему не нужны. Это нарушение ISP — интерфейс нужно разделить на UserProfile и AdminUserService.',
    codeExamples: {
      ts: {
        bad: `// Один интерфейс для всех операций
interface UserService {
  getProfile(id: string): User;
  updateProfile(id: string, data: Partial<User>): void;
  banUser(id: string): void;
  deleteUser(id: string): void;
  assignRole(id: string, role: string): void;
}
// Компонент профиля зависит от admin-методов
class ProfilePage {
  constructor(private svc: UserService) {}
  load() { return this.svc.getProfile("1"); }
}`,
        good: `// Разделённые интерфейсы по ролям
interface UserProfileService {
  getProfile(id: string): User;
  updateProfile(id: string, data: Partial<User>): void;
}
interface AdminService {
  banUser(id: string): void;
  deleteUser(id: string): void;
  assignRole(id: string, role: string): void;
}
class ProfilePage {
  constructor(private svc: UserProfileService) {}
  load() { return this.svc.getProfile("1"); }
}`,
      },
      go: {
        bad: `// Единый интерфейс
type UserService interface {
    GetProfile(id string) User
    UpdateProfile(id string, data User) error
    BanUser(id string) error
    DeleteUser(id string) error
    AssignRole(id, role string) error
}
// ProfilePage зависит от всего UserService
type ProfilePage struct { svc UserService }`,
        good: `// Разделённые интерфейсы
type ProfileReader interface {
    GetProfile(id string) User
    UpdateProfile(id string, data User) error
}
type AdminActions interface {
    BanUser(id string) error
    DeleteUser(id string) error
    AssignRole(id, role string) error
}
// Зависимость только от нужного
type ProfilePage struct { svc ProfileReader }`,
      },
      python: {
        bad: `# Единый интерфейс
class UserService(ABC):
    @abstractmethod
    def get_profile(self, id: str) -> User: ...
    @abstractmethod
    def update_profile(self, id: str, data: dict): ...
    @abstractmethod
    def ban_user(self, id: str): ...
    @abstractmethod
    def delete_user(self, id: str): ...
    @abstractmethod
    def assign_role(self, id: str, role: str): ...

class ProfilePage:
    def __init__(self, svc: UserService): ...`,
        good: `# Разделённые интерфейсы
class ProfileService(ABC):
    @abstractmethod
    def get_profile(self, id: str) -> User: ...
    @abstractmethod
    def update_profile(self, id: str, data: dict): ...

class AdminService(ABC):
    @abstractmethod
    def ban_user(self, id: str): ...
    @abstractmethod
    def delete_user(self, id: str): ...

class ProfilePage:
    def __init__(self, svc: ProfileService): ...`,
      },
    },
    principle: 'I',
  },
  // 6. Связь ISP и SRP — в чём разница
  {
    text: 'В чём ключевое отличие Interface Segregation Principle от Single Responsibility Principle?',
    options: [
      'ISP применяется только к интерфейсам, а SRP только к классам',
      'SRP — про причины изменения класса, ISP — про зависимости клиентов от неиспользуемых методов',
      'ISP и SRP — это одно и то же, просто на разных уровнях абстракции',
      'SRP запрещает большие классы, а ISP запрещает большие интерфейсы',
    ],
    correctIndex: 1,
    explanation:
      'SRP говорит о том, что у класса должна быть одна причина для изменения (одна ответственность). ISP говорит о том, что клиенты не должны зависеть от методов, которые они не используют. Класс может соблюдать SRP, но нарушать ISP, если его единственный интерфейс слишком широк для некоторых клиентов.',
    codeExamples: {
      ts: {
        bad: `// SRP соблюдён: класс только про логирование
// ISP нарушен: клиенту нужен только write()
interface Logger {
  write(msg: string): void;
  flush(): void;
  rotate(): void;
  getStats(): Stats;
}
// Этому потребителю нужен только write
function logMessage(logger: Logger, msg: string) {
  logger.write(msg);
}`,
        good: `// ISP соблюдён: клиент зависит только от того, что использует
interface LogWriter {
  write(msg: string): void;
}
interface LogManager {
  flush(): void;
  rotate(): void;
  getStats(): Stats;
}
// Потребитель зависит только от LogWriter
function logMessage(logger: LogWriter, msg: string) {
  logger.write(msg);
}`,
      },
      go: {
        bad: `// SRP ок: структура только про логи
// ISP нарушен: клиенту нужен только Write
type Logger interface {
    Write(msg string)
    Flush()
    Rotate()
    GetStats() Stats
}
// Функции нужен только Write
func LogMessage(l Logger, msg string) {
    l.Write(msg)
}`,
        good: `// ISP соблюдён
type LogWriter interface {
    Write(msg string)
}
type LogManager interface {
    Flush()
    Rotate()
    GetStats() Stats
}
func LogMessage(w LogWriter, msg string) {
    w.Write(msg)
}`,
      },
      python: {
        bad: `# SRP ок: класс отвечает только за логи
# ISP нарушен: клиенту нужен только write
class Logger(ABC):
    @abstractmethod
    def write(self, msg: str): ...
    @abstractmethod
    def flush(self): ...
    @abstractmethod
    def rotate(self): ...
    @abstractmethod
    def get_stats(self) -> dict: ...

def log_message(logger: Logger, msg: str):
    logger.write(msg)  # использует только write`,
        good: `# ISP: разделённые интерфейсы
class LogWriter(ABC):
    @abstractmethod
    def write(self, msg: str): ...

class LogManager(ABC):
    @abstractmethod
    def flush(self): ...
    @abstractmethod
    def rotate(self): ...

def log_message(writer: LogWriter, msg: str):
    writer.write(msg)  # зависит только от нужного`,
      },
    },
    principle: 'I',
  },
  // 7. EventHandler с onConnect, onDisconnect, onMessage, onError
  {
    text: 'Интерфейс EventHandler определяет методы onConnect(), onDisconnect(), onMessage() и onError(). Классу MetricsCollector нужен только onMessage(). Какой подход лучше всего соответствует ISP?',
    options: [
      'Создать адаптер, который оборачивает MetricsCollector и заглушает остальные методы',
      'Разбить EventHandler на отдельные интерфейсы: OnConnect, OnMessage, OnError и т.д.',
      'Сделать методы в EventHandler опциональными (с дефолтной пустой реализацией)',
      'Оставить как есть — четыре метода не так уж много',
    ],
    correctIndex: 1,
    explanation:
      'По ISP каждый обработчик оформляется как отдельный интерфейс. MetricsCollector реализует только OnMessage. Дефолтные реализации (вариант C) маскируют проблему, а не решают её.',
    codeExamples: {
      ts: {
        bad: `// Единый интерфейс обработчиков
interface EventHandler {
  onConnect(id: string): void;
  onDisconnect(id: string): void;
  onMessage(id: string, data: unknown): void;
  onError(id: string, err: Error): void;
}
class MetricsCollector implements EventHandler {
  onConnect() {}    // пустышка
  onDisconnect() {} // пустышка
  onMessage(id: string, data: unknown) { /* собираем метрики */ }
  onError() {}      // пустышка
}`,
        good: `// Отдельные интерфейсы событий
interface OnMessage {
  onMessage(id: string, data: unknown): void;
}
interface OnConnect {
  onConnect(id: string): void;
}
interface OnError {
  onError(id: string, err: Error): void;
}
class MetricsCollector implements OnMessage {
  onMessage(id: string, data: unknown) {
    /* собираем метрики */
  }
}`,
      },
      go: {
        bad: `// Единый интерфейс
type EventHandler interface {
    OnConnect(id string)
    OnDisconnect(id string)
    OnMessage(id string, data []byte)
    OnError(id string, err error)
}
type MetricsCollector struct{}
func (m MetricsCollector) OnConnect(string)      {}
func (m MetricsCollector) OnDisconnect(string)   {}
func (m MetricsCollector) OnMessage(id string, data []byte) {
    // собираем метрики
}
func (m MetricsCollector) OnError(string, error) {}`,
        good: `// Отдельные интерфейсы
type MessageHandler interface {
    OnMessage(id string, data []byte)
}
type ConnectHandler interface {
    OnConnect(id string)
}
type MetricsCollector struct{}
func (m MetricsCollector) OnMessage(id string, data []byte) {
    // собираем метрики
}`,
      },
      python: {
        bad: `# Единый интерфейс
class EventHandler(ABC):
    @abstractmethod
    def on_connect(self, id: str): ...
    @abstractmethod
    def on_disconnect(self, id: str): ...
    @abstractmethod
    def on_message(self, id: str, data): ...
    @abstractmethod
    def on_error(self, id: str, err): ...

class MetricsCollector(EventHandler):
    def on_connect(self, id): pass  # пустышка
    def on_disconnect(self, id): pass
    def on_message(self, id, data): ...  # полезная работа
    def on_error(self, id, err): pass`,
        good: `# Отдельные интерфейсы
class MessageHandler(ABC):
    @abstractmethod
    def on_message(self, id: str, data): ...

class ConnectHandler(ABC):
    @abstractmethod
    def on_connect(self, id: str): ...

class MetricsCollector(MessageHandler):
    def on_message(self, id: str, data):
        # собираем метрики
        ...`,
      },
    },
    principle: 'I',
  },
  // 8. Go-идиоматика: маленькие интерфейсы
  {
    text: 'В Go стандартная библиотека определяет io.Reader (один метод Read) и io.Writer (один метод Write). Почему это считается образцовым примером ISP?',
    options: [
      'Потому что Go не поддерживает наследование',
      'Потому что каждый интерфейс содержит минимально необходимый набор методов, и клиент зависит только от того, что использует',
      'Потому что io.Reader и io.Writer используют дженерики',
      'Потому что в Go интерфейсы реализуются неявно (implicitly)',
    ],
    correctIndex: 1,
    explanation:
      'io.Reader и io.Writer — это интерфейсы с одним методом. Функция, которой нужно только читать, принимает io.Reader и не зависит от Write. Это суть ISP: минимальный контракт для каждого клиента.',
    codeExamples: {
      ts: {
        bad: `// Один интерфейс для чтения и записи
interface Stream {
  read(buf: Buffer): number;
  write(data: Buffer): number;
  close(): void;
  seek(offset: number): void;
}
// Функции нужно только читать, но зависит от всего
function processData(stream: Stream) {
  const buf = Buffer.alloc(1024);
  stream.read(buf);
}`,
        good: `// Минимальные интерфейсы
interface Reader { read(buf: Buffer): number; }
interface Writer { write(data: Buffer): number; }
interface Closer { close(): void; }
// Комбинируем по необходимости
type ReadCloser = Reader & Closer;

function processData(r: Reader) {
  const buf = Buffer.alloc(1024);
  r.read(buf); // зависит только от read
}`,
      },
      go: {
        bad: `// Толстый интерфейс потока
type Stream interface {
    Read(p []byte) (int, error)
    Write(p []byte) (int, error)
    Close() error
    Seek(offset int64, whence int) (int64, error)
}
// Нужен только Read, но зависит от всего
func ProcessData(s Stream) {
    buf := make([]byte, 1024)
    s.Read(buf)
}`,
        good: `// Идиоматичный Go — маленькие интерфейсы
// io.Reader — один метод
type Reader interface {
    Read(p []byte) (n int, err error)
}
// io.Writer — один метод
type Writer interface {
    Write(p []byte) (n int, err error)
}
// Функция зависит только от Reader
func ProcessData(r io.Reader) {
    buf := make([]byte, 1024)
    r.Read(buf)
}`,
      },
      python: {
        bad: `# Один протокол для всего
class Stream(Protocol):
    def read(self, n: int) -> bytes: ...
    def write(self, data: bytes) -> int: ...
    def close(self) -> None: ...
    def seek(self, offset: int) -> int: ...

# Нужно только чтение
def process_data(stream: Stream):
    data = stream.read(1024)`,
        good: `# Минимальные протоколы
class Readable(Protocol):
    def read(self, n: int) -> bytes: ...

class Writable(Protocol):
    def write(self, data: bytes) -> int: ...

# Зависимость только от чтения
def process_data(reader: Readable):
    data = reader.read(1024)`,
      },
    },
    principle: 'I',
  },
  // 9. Интерфейс Cache
  {
    text: 'Интерфейс Cache имеет методы: get(), set(), delete(), getStats() и flush(). Микросервис использует только get() и set(). Разработчик решил оставить полный интерфейс «на всякий случай». Чем это грозит?',
    options: [
      'Увеличением потребления памяти',
      'Микросервис получает доступ к flush() и может случайно очистить весь кэш',
      'Ничем, если не вызывать лишние методы',
      'Замедлением работы кэша',
    ],
    correctIndex: 1,
    explanation:
      'Нарушение ISP создаёт риск: микросервис получает доступ к опасным операциям (flush, delete), которые ему не нужны. Минимальный интерфейс CacheReader с get/set ограничивает поверхность взаимодействия и уменьшает риск ошибок.',
    codeExamples: {
      ts: {
        bad: `// Полный интерфейс кэша
interface Cache {
  get(key: string): unknown;
  set(key: string, value: unknown, ttl?: number): void;
  delete(key: string): void;
  getStats(): CacheStats;
  flush(): void; // опасная операция!
}
class OrderService {
  constructor(private cache: Cache) {}
  // имеет доступ к cache.flush() — рискованно!
}`,
        good: `// Минимальный интерфейс для потребителя
interface CacheStore {
  get(key: string): unknown;
  set(key: string, value: unknown, ttl?: number): void;
}
interface CacheAdmin {
  delete(key: string): void;
  flush(): void;
  getStats(): CacheStats;
}
class OrderService {
  constructor(private cache: CacheStore) {}
  // нет доступа к flush() — безопаснее
}`,
      },
      go: {
        bad: `// Полный интерфейс
type Cache interface {
    Get(key string) (any, error)
    Set(key string, val any, ttl time.Duration) error
    Delete(key string) error
    GetStats() Stats
    Flush() error // опасно!
}
type OrderService struct { cache Cache }
// Сервис имеет доступ к Flush — рискованно`,
        good: `// Минимальный интерфейс
type CacheStore interface {
    Get(key string) (any, error)
    Set(key string, val any, ttl time.Duration) error
}
type CacheAdmin interface {
    Delete(key string) error
    Flush() error
    GetStats() Stats
}
type OrderService struct { cache CacheStore }
// Нет доступа к Flush — безопаснее`,
      },
      python: {
        bad: `# Полный интерфейс кэша
class Cache(ABC):
    @abstractmethod
    def get(self, key: str): ...
    @abstractmethod
    def set(self, key: str, val, ttl=None): ...
    @abstractmethod
    def delete(self, key: str): ...
    @abstractmethod
    def get_stats(self) -> dict: ...
    @abstractmethod
    def flush(self): ...  # опасно!

class OrderService:
    def __init__(self, cache: Cache): ...`,
        good: `# Минимальный интерфейс
class CacheStore(ABC):
    @abstractmethod
    def get(self, key: str): ...
    @abstractmethod
    def set(self, key: str, val, ttl=None): ...

class CacheAdmin(ABC):
    @abstractmethod
    def flush(self): ...
    @abstractmethod
    def get_stats(self) -> dict: ...

class OrderService:
    def __init__(self, cache: CacheStore): ...`,
      },
    },
    principle: 'I',
  },
  // 10. React props interface с 20 необязательными полями
  {
    text: 'React-компонент Button принимает пропсы с 20 необязательными полями: onClick, onHover, icon, badge, tooltip, loading, disabled, size, variant, animation и т.д. Это нарушение ISP?',
    options: [
      'Нет, потому что все поля необязательные и клиент передаёт только нужные',
      'Да, потому что компонент-потребитель видит огромный интерфейс и вынужден в нём разбираться',
      'Нет, в React пропсы всегда необязательные — это нормально',
      'Да, потому что React-компоненты не должны принимать больше 5 пропсов',
    ],
    correctIndex: 1,
    explanation:
      'Хотя формально необязательные поля не заставляют передавать лишнее, огромный интерфейс пропсов усложняет использование компонента. По духу ISP лучше разбить на композицию: BaseButton, IconButton, LoadingButton и т.д.',
    codeExamples: {
      ts: {
        bad: `// Огромный интерфейс пропсов
interface ButtonProps {
  onClick?: () => void;
  onHover?: () => void;
  icon?: string;
  badge?: number;
  tooltip?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'ghost';
  // ...ещё 10 полей
}
const Button = (props: ButtonProps) => { /* ... */ };`,
        good: `// Базовые пропсы + расширения
interface BaseButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
interface IconProps { icon: string; }
interface LoadingProps { loading: boolean; }

const Button = (props: BaseButtonProps) => { /* ... */ };
const IconButton = (props: BaseButtonProps & IconProps) => {};
const LoadingButton = (props: BaseButtonProps & LoadingProps) => {};`,
      },
      go: {
        bad: `// Огромная структура настроек
type ButtonConfig struct {
    OnClick   func()
    OnHover   func()
    Icon      string
    Badge     int
    Tooltip   string
    Loading   bool
    Disabled  bool
    Size      string
    Variant   string
    // ...ещё 10 полей
}
func NewButton(cfg ButtonConfig) *Button { return nil }`,
        good: `// Минимальная базовая конфигурация + опции
type ButtonConfig struct {
    OnClick  func()
    Disabled bool
    Size     string
}
type IconOption struct { Icon string }
type LoadingOption struct { Loading bool }

func NewButton(cfg ButtonConfig) *Button { return nil }
func NewIconButton(cfg ButtonConfig, icon IconOption) *Button {
    return nil
}`,
      },
      python: {
        bad: `# Огромный набор параметров
@dataclass
class ButtonProps:
    on_click: Callable = None
    on_hover: Callable = None
    icon: str = None
    badge: int = None
    tooltip: str = None
    loading: bool = False
    disabled: bool = False
    size: str = "md"
    variant: str = "primary"
    # ...ещё 10 полей`,
        good: `# Разделённые пропсы
@dataclass
class BaseButtonProps:
    on_click: Callable = None
    disabled: bool = False
    size: str = "md"

@dataclass
class IconButtonProps(BaseButtonProps):
    icon: str = ""

@dataclass
class LoadingButtonProps(BaseButtonProps):
    loading: bool = False`,
      },
    },
    principle: 'I',
  },
  // 11. Интерфейс Logger
  {
    text: 'Интерфейс Logger содержит: debug(), info(), warn(), error(), fatal(), trace(), setLevel() и addTransport(). Модулю бизнес-логики нужен только info() и error(). Какой подход соответствует ISP?',
    options: [
      'Использовать полный Logger — все методы семантически связаны с логированием',
      'Создать SimpleLogger с info() и error(), который модуль будет использовать',
      'Удалить debug, trace, fatal из Logger — они редко используются',
      'Передать модулю два отдельных callback: infoFn и errorFn',
    ],
    correctIndex: 1,
    explanation:
      'По ISP модуль бизнес-логики должен зависеть только от тех методов, которые ему нужны. Интерфейс SimpleLogger (или AppLogger) с info() и error() — правильное решение. Методы setLevel() и addTransport() — это конфигурация, которая модулю не нужна.',
    codeExamples: {
      ts: {
        bad: `// Толстый интерфейс логгера
interface Logger {
  debug(msg: string): void;
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  fatal(msg: string): void;
  trace(msg: string): void;
  setLevel(level: string): void;
  addTransport(t: Transport): void;
}
class OrderService {
  constructor(private log: Logger) {}
  // использует только log.info() и log.error()
}`,
        good: `// Узкий интерфейс для бизнес-логики
interface AppLogger {
  info(msg: string): void;
  error(msg: string): void;
}
// Интерфейс конфигурации отдельно
interface LoggerConfig {
  setLevel(level: string): void;
  addTransport(t: Transport): void;
}
class OrderService {
  constructor(private log: AppLogger) {}
}`,
      },
      go: {
        bad: `// Толстый интерфейс
type Logger interface {
    Debug(msg string)
    Info(msg string)
    Warn(msg string)
    Error(msg string)
    Fatal(msg string)
    Trace(msg string)
    SetLevel(level string)
    AddTransport(t Transport)
}
type OrderService struct { log Logger }`,
        good: `// Узкий интерфейс для бизнес-кода
type AppLogger interface {
    Info(msg string)
    Error(msg string)
}
type LoggerConfigurator interface {
    SetLevel(level string)
    AddTransport(t Transport)
}
type OrderService struct { log AppLogger }`,
      },
      python: {
        bad: `# Толстый интерфейс логгера
class Logger(ABC):
    @abstractmethod
    def debug(self, msg: str): ...
    @abstractmethod
    def info(self, msg: str): ...
    @abstractmethod
    def warn(self, msg: str): ...
    @abstractmethod
    def error(self, msg: str): ...
    @abstractmethod
    def fatal(self, msg: str): ...
    @abstractmethod
    def set_level(self, level: str): ...
    @abstractmethod
    def add_transport(self, t): ...

class OrderService:
    def __init__(self, log: Logger): ...`,
        good: `# Узкий интерфейс
class AppLogger(ABC):
    @abstractmethod
    def info(self, msg: str): ...
    @abstractmethod
    def error(self, msg: str): ...

class LogConfigurator(ABC):
    @abstractmethod
    def set_level(self, level: str): ...
    @abstractmethod
    def add_transport(self, t): ...

class OrderService:
    def __init__(self, log: AppLogger): ...`,
      },
    },
    principle: 'I',
  },
  // 12. Паттерн Role Interface
  {
    text: 'Паттерн Role Interface предлагает определять интерфейсы на основе ролей, которые объект играет для разных клиентов. Как это связано с ISP?',
    options: [
      'Role Interface противоречит ISP, так как один объект реализует несколько интерфейсов',
      'Role Interface — это практическая реализация ISP: каждый клиент видит объект через свой ролевой интерфейс',
      'Role Interface применяется только совместно с DIP, а не с ISP',
      'Role Interface — это альтернатива ISP для языков без множественного наследования интерфейсов',
    ],
    correctIndex: 1,
    explanation:
      'Role Interface — это паттерн, при котором для каждого клиента (роли) создаётся свой узкий интерфейс. Один объект реализует несколько ролевых интерфейсов, но каждый клиент зависит только от своей роли. Это прямая реализация ISP.',
    codeExamples: {
      ts: {
        bad: `// Один широкий интерфейс для всех клиентов
interface Employee {
  getName(): string;
  getSalary(): number;
  getSchedule(): Schedule;
  getPerformance(): number;
  getSecurityLevel(): number;
}
// HR видит всё, включая securityLevel
function hrReport(emp: Employee) { /* ... */ }
// Охрана видит всё, включая salary
function securityCheck(emp: Employee) { /* ... */ }`,
        good: `// Ролевые интерфейсы
interface HRView {
  getName(): string;
  getSalary(): number;
  getPerformance(): number;
}
interface SecurityView {
  getName(): string;
  getSecurityLevel(): number;
}
// Каждый клиент видит свою роль
function hrReport(emp: HRView) { /* ... */ }
function securityCheck(emp: SecurityView) { /* ... */ }`,
      },
      go: {
        bad: `// Один широкий интерфейс
type Employee interface {
    Name() string
    Salary() float64
    Schedule() Schedule
    Performance() float64
    SecurityLevel() int
}
// HR видит всё
func HRReport(emp Employee) { /* ... */ }
// Охрана видит всё
func SecurityCheck(emp Employee) { /* ... */ }`,
        good: `// Ролевые интерфейсы
type HRView interface {
    Name() string
    Salary() float64
    Performance() float64
}
type SecurityView interface {
    Name() string
    SecurityLevel() int
}
func HRReport(emp HRView) { /* ... */ }
func SecurityCheck(emp SecurityView) { /* ... */ }`,
      },
      python: {
        bad: `# Один широкий интерфейс
class Employee(ABC):
    @abstractmethod
    def get_name(self) -> str: ...
    @abstractmethod
    def get_salary(self) -> float: ...
    @abstractmethod
    def get_performance(self) -> float: ...
    @abstractmethod
    def get_security_level(self) -> int: ...

def hr_report(emp: Employee): ...
def security_check(emp: Employee): ...`,
        good: `# Ролевые интерфейсы (протоколы)
class HRView(Protocol):
    def get_name(self) -> str: ...
    def get_salary(self) -> float: ...
    def get_performance(self) -> float: ...

class SecurityView(Protocol):
    def get_name(self) -> str: ...
    def get_security_level(self) -> int: ...

def hr_report(emp: HRView): ...
def security_check(emp: SecurityView): ...`,
      },
    },
    principle: 'I',
  },
  // 13. Ненужные перекомпиляции
  {
    text: 'Модуль A зависит от «толстого» интерфейса I, из которого использует только метод x(). Метод y() интерфейса I был изменён. Что произойдёт с модулем A в компилируемом языке?',
    options: [
      'Ничего — модуль A не вызывает y(), поэтому перекомпиляция не нужна',
      'Модуль A будет перекомпилирован, хотя изменение y() его не касается',
      'Возникнет ошибка компиляции в модуле A',
      'Изменение y() невозможно без изменения x()',
    ],
    correctIndex: 1,
    explanation:
      'Если модуль A зависит от интерфейса I, любое изменение I (включая метод y()) вызовет перекомпиляцию A. Это одна из практических проблем нарушения ISP — ненужные перекомпиляции замедляют цикл разработки.',
    codeExamples: {
      ts: {
        bad: `// Модуль A зависит от толстого интерфейса
// файл: service.ts
interface BigService {
  methodX(): string;  // нужен модулю A
  methodY(): number;  // не нужен модулю A
}
// файл: moduleA.ts — импортирует BigService
// При изменении methodY() — moduleA.ts перекомпилируется!
import { BigService } from './service';
function useX(svc: BigService) { return svc.methodX(); }`,
        good: `// Модуль A зависит от узкого интерфейса
// файл: serviceX.ts
interface ServiceX { methodX(): string; }
// файл: serviceY.ts
interface ServiceY { methodY(): number; }
// файл: moduleA.ts — импортирует только ServiceX
// Изменение ServiceY не затронет moduleA.ts
import { ServiceX } from './serviceX';
function useX(svc: ServiceX) { return svc.methodX(); }`,
      },
      go: {
        bad: `// package service — толстый интерфейс
type BigService interface {
    MethodX() string // нужен пакету A
    MethodY() int    // не нужен пакету A
}

// package a — зависит от service.BigService
// При изменении MethodY пакет a перекомпилируется
func UseX(svc service.BigService) string {
    return svc.MethodX()
}`,
        good: `// Пакет a определяет свой интерфейс
// (Go-идиоматика: интерфейс у потребителя)
type XProvider interface {
    MethodX() string
}
// Изменение MethodY в другом пакете
// не затрагивает этот пакет
func UseX(svc XProvider) string {
    return svc.MethodX()
}`,
      },
      python: {
        bad: `# Толстый интерфейс в одном модуле
# service.py
class BigService(ABC):
    @abstractmethod
    def method_x(self) -> str: ...
    @abstractmethod
    def method_y(self) -> int: ...

# module_a.py — импортирует BigService
from service import BigService
def use_x(svc: BigService) -> str:
    return svc.method_x()
# Изменение method_y затрагивает module_a`,
        good: `# Разделённые интерфейсы в разных модулях
# service_x.py
class XProvider(ABC):
    @abstractmethod
    def method_x(self) -> str: ...

# service_y.py
class YProvider(ABC):
    @abstractmethod
    def method_y(self) -> int: ...

# module_a.py — зависит только от XProvider
from service_x import XProvider
def use_x(svc: XProvider) -> str:
    return svc.method_x()`,
      },
    },
    principle: 'I',
  },
  // 14. Интерфейс Shape
  {
    text: 'Интерфейс Shape определяет методы draw(), resize(), rotate() и serialize(). Класс Line (линия) не может быть resize() в ширину, а класс Point не может rotate(). Как исправить по ISP?',
    options: [
      'Добавить в каждый метод проверку canResize(), canRotate() и т.д.',
      'Выделить интерфейсы Drawable, Resizable, Rotatable и Serializable',
      'Сделать Shape абстрактным классом с пустыми методами по умолчанию',
      'Использовать паттерн Visitor вместо методов в интерфейсе',
    ],
    correctIndex: 1,
    explanation:
      'По ISP каждая возможность фигуры оформляется отдельным интерфейсом. Line реализует Drawable и Serializable, Point — только Drawable. Каждый класс реализует только те интерфейсы, поведение которых он поддерживает.',
    codeExamples: {
      ts: {
        bad: `// Все фигуры обязаны всё уметь
interface Shape {
  draw(): void;
  resize(factor: number): void;
  rotate(angle: number): void;
  serialize(): string;
}
class Point implements Shape {
  draw() { /* ок */ }
  resize() { /* бессмысленно для точки */ }
  rotate() { /* бессмысленно для точки */ }
  serialize() { return "point"; }
}`,
        good: `// Разделённые возможности
interface Drawable { draw(): void; }
interface Resizable { resize(factor: number): void; }
interface Rotatable { rotate(angle: number): void; }
interface Serializable { serialize(): string; }

class Point implements Drawable, Serializable {
  draw() { /* рисуем точку */ }
  serialize() { return "point"; }
}
class Rectangle implements Drawable, Resizable, Rotatable {
  draw() {} resize(f: number) {} rotate(a: number) {}
}`,
      },
      go: {
        bad: `// Толстый интерфейс фигуры
type Shape interface {
    Draw()
    Resize(factor float64)
    Rotate(angle float64)
    Serialize() string
}
type Point struct{ X, Y float64 }
func (p Point) Draw()              {}
func (p Point) Resize(float64)     {} // бессмысленно
func (p Point) Rotate(float64)     {} // бессмысленно
func (p Point) Serialize() string  { return "point" }`,
        good: `// Разделённые интерфейсы
type Drawable interface { Draw() }
type Resizable interface { Resize(factor float64) }
type Rotatable interface { Rotate(angle float64) }
type Serializable interface { Serialize() string }

type Point struct{ X, Y float64 }
func (p Point) Draw()             {}
func (p Point) Serialize() string { return "point" }
// Point не реализует Resizable и Rotatable`,
      },
      python: {
        bad: `# Толстый интерфейс
class Shape(ABC):
    @abstractmethod
    def draw(self): ...
    @abstractmethod
    def resize(self, factor: float): ...
    @abstractmethod
    def rotate(self, angle: float): ...
    @abstractmethod
    def serialize(self) -> str: ...

class Point(Shape):
    def draw(self): ...
    def resize(self, factor): pass  # бессмысленно
    def rotate(self, angle): pass   # бессмысленно
    def serialize(self) -> str: return "point"`,
        good: `# Разделённые интерфейсы
class Drawable(ABC):
    @abstractmethod
    def draw(self): ...

class Resizable(ABC):
    @abstractmethod
    def resize(self, factor: float): ...

class Serializable(ABC):
    @abstractmethod
    def serialize(self) -> str: ...

class Point(Drawable, Serializable):
    def draw(self): ...
    def serialize(self) -> str: return "point"`,
      },
    },
    principle: 'I',
  },
  // 15. Microservice API
  {
    text: 'Микросервис заказов предоставляет один большой gRPC-интерфейс OrderService с 15 методами (createOrder, getOrder, listOrders, cancelOrder, refundOrder, getInvoice, ...). Сервис уведомлений использует только getOrder(). Как применить ISP на уровне API?',
    options: [
      'Дать сервису уведомлений доступ ко всему API — он просто не будет вызывать лишние методы',
      'Разбить OrderService на мелкие контракты: OrderReader, OrderWriter, OrderBilling и т.д.',
      'Создать API Gateway, который фильтрует методы для каждого клиента',
      'Использовать REST вместо gRPC — там URL-ы уже разделены',
    ],
    correctIndex: 1,
    explanation:
      'ISP применим не только к классам, но и к API-контрактам. Разбиение OrderService на OrderReader, OrderWriter, OrderBilling позволяет каждому микросервису-клиенту зависеть только от нужного контракта. Это уменьшает связанность между сервисами.',
    codeExamples: {
      ts: {
        bad: `// Один большой API-контракт
interface OrderService {
  createOrder(data: OrderData): Order;
  getOrder(id: string): Order;
  listOrders(filter: Filter): Order[];
  cancelOrder(id: string): void;
  refundOrder(id: string): void;
  getInvoice(id: string): Invoice;
  // ... ещё 9 методов
}
// Сервис уведомлений зависит от всего контракта
class NotificationService {
  constructor(private orders: OrderService) {}
}`,
        good: `// Разбитые контракты
interface OrderReader {
  getOrder(id: string): Order;
  listOrders(filter: Filter): Order[];
}
interface OrderWriter {
  createOrder(data: OrderData): Order;
  cancelOrder(id: string): void;
}
interface OrderBilling {
  refundOrder(id: string): void;
  getInvoice(id: string): Invoice;
}
class NotificationService {
  constructor(private orders: OrderReader) {}
}`,
      },
      go: {
        bad: `// Один большой контракт
type OrderService interface {
    CreateOrder(data OrderData) (Order, error)
    GetOrder(id string) (Order, error)
    ListOrders(filter Filter) ([]Order, error)
    CancelOrder(id string) error
    RefundOrder(id string) error
    GetInvoice(id string) (Invoice, error)
}
// Сервис уведомлений зависит от всего
type NotifService struct { orders OrderService }`,
        good: `// Мелкие контракты
type OrderReader interface {
    GetOrder(id string) (Order, error)
    ListOrders(filter Filter) ([]Order, error)
}
type OrderWriter interface {
    CreateOrder(data OrderData) (Order, error)
    CancelOrder(id string) error
}
// Зависимость только от чтения
type NotifService struct { orders OrderReader }`,
      },
      python: {
        bad: `# Один большой контракт
class OrderService(ABC):
    @abstractmethod
    def create_order(self, data) -> Order: ...
    @abstractmethod
    def get_order(self, id: str) -> Order: ...
    @abstractmethod
    def cancel_order(self, id: str): ...
    @abstractmethod
    def refund_order(self, id: str): ...
    @abstractmethod
    def get_invoice(self, id: str) -> Invoice: ...

class NotifService:
    def __init__(self, orders: OrderService): ...`,
        good: `# Мелкие контракты
class OrderReader(ABC):
    @abstractmethod
    def get_order(self, id: str) -> Order: ...
    @abstractmethod
    def list_orders(self, filter) -> list: ...

class OrderWriter(ABC):
    @abstractmethod
    def create_order(self, data) -> Order: ...
    @abstractmethod
    def cancel_order(self, id: str): ...

class NotifService:
    def __init__(self, orders: OrderReader): ...`,
      },
    },
    principle: 'I',
  },
  // 16. Нарушение ISP через абстрактный класс
  {
    text: 'Абстрактный класс AbstractNotifier имеет методы: sendEmail(), sendSMS(), sendPush() и sendSlack(). Подкласс EmailNotifier реализует только sendEmail(), а остальные методы бросают NotImplementedError. Какой принцип SOLID нарушен в первую очередь?',
    options: [
      'Open/Closed Principle — нельзя добавить новые каналы без изменения класса',
      'Liskov Substitution Principle — подкласс не может заменить базовый класс',
      'Interface Segregation Principle — подкласс вынужден наследовать ненужные методы',
      'Dependency Inversion Principle — зависимость от конкретного класса',
    ],
    correctIndex: 2,
    explanation:
      'Абстрактный класс с необязательными методами — классическое нарушение ISP. EmailNotifier вынужден «реализовывать» sendSMS(), sendPush(), sendSlack(), хотя они ему не нужны. Каждый канал должен быть отдельным интерфейсом.',
    codeExamples: {
      ts: {
        bad: `// Абстрактный класс с лишними методами
abstract class AbstractNotifier {
  abstract sendEmail(to: string, msg: string): void;
  abstract sendSMS(to: string, msg: string): void;
  abstract sendPush(to: string, msg: string): void;
  abstract sendSlack(channel: string, msg: string): void;
}
class EmailNotifier extends AbstractNotifier {
  sendEmail(to: string, msg: string) { /* ок */ }
  sendSMS() { throw new Error("Не поддерживается"); }
  sendPush() { throw new Error("Не поддерживается"); }
  sendSlack() { throw new Error("Не поддерживается"); }
}`,
        good: `// Отдельные интерфейсы каналов
interface EmailSender {
  sendEmail(to: string, msg: string): void;
}
interface SMSSender {
  sendSMS(to: string, msg: string): void;
}
interface PushSender {
  sendPush(to: string, msg: string): void;
}
class EmailNotifier implements EmailSender {
  sendEmail(to: string, msg: string) { /* отправка */ }
}`,
      },
      go: {
        bad: `// Толстый интерфейс уведомлений
type Notifier interface {
    SendEmail(to, msg string) error
    SendSMS(to, msg string) error
    SendPush(to, msg string) error
    SendSlack(ch, msg string) error
}
type EmailNotifier struct{}
func (e EmailNotifier) SendEmail(to, msg string) error { return nil }
func (e EmailNotifier) SendSMS(to, msg string) error {
    return errors.New("не поддерживается")
}
func (e EmailNotifier) SendPush(to, msg string) error {
    return errors.New("не поддерживается")
}
func (e EmailNotifier) SendSlack(ch, msg string) error {
    return errors.New("не поддерживается")
}`,
        good: `// Отдельные интерфейсы
type EmailSender interface {
    SendEmail(to, msg string) error
}
type SMSSender interface {
    SendSMS(to, msg string) error
}
type EmailNotifier struct{}
func (e EmailNotifier) SendEmail(to, msg string) error {
    // отправка email
    return nil
}`,
      },
      python: {
        bad: `# Абстрактный класс с лишними методами
class AbstractNotifier(ABC):
    @abstractmethod
    def send_email(self, to, msg): ...
    @abstractmethod
    def send_sms(self, to, msg): ...
    @abstractmethod
    def send_push(self, to, msg): ...
    @abstractmethod
    def send_slack(self, ch, msg): ...

class EmailNotifier(AbstractNotifier):
    def send_email(self, to, msg): ...  # ок
    def send_sms(self, to, msg): raise NotImplementedError
    def send_push(self, to, msg): raise NotImplementedError
    def send_slack(self, ch, msg): raise NotImplementedError`,
        good: `# Отдельные интерфейсы каналов
class EmailSender(ABC):
    @abstractmethod
    def send_email(self, to: str, msg: str): ...

class SMSSender(ABC):
    @abstractmethod
    def send_sms(self, to: str, msg: str): ...

class EmailNotifier(EmailSender):
    def send_email(self, to: str, msg: str):
        # отправка email
        ...`,
      },
    },
    principle: 'I',
  },
  // 17. Интерфейс Payment
  {
    text: 'Интерфейс PaymentProcessor определяет: chargeCard(), initiateWireTransfer(), processPayPal(), handleCrypto(). Класс StripeProcessor поддерживает только chargeCard(). Какой рефакторинг соответствует ISP?',
    options: [
      'Добавить метод supports() и проверять его перед вызовом',
      'Сделать все методы опциональными с дефолтной реализацией',
      'Создать отдельные интерфейсы: CardProcessor, WireProcessor, PayPalProcessor, CryptoProcessor',
      'Использовать паттерн Strategy для каждого метода оплаты',
    ],
    correctIndex: 2,
    explanation:
      'По ISP каждый способ оплаты оформляется отдельным интерфейсом. StripeProcessor реализует только CardProcessor. Метод supports() (вариант A) — это обходной путь, который переносит проблему из compile-time в runtime.',
    codeExamples: {
      ts: {
        bad: `// Один интерфейс для всех платёжных систем
interface PaymentProcessor {
  chargeCard(amount: number, card: CardInfo): void;
  initiateWireTransfer(amount: number, iban: string): void;
  processPayPal(amount: number, email: string): void;
  handleCrypto(amount: number, wallet: string): void;
}
class StripeProcessor implements PaymentProcessor {
  chargeCard(amount: number, card: CardInfo) { /* ок */ }
  initiateWireTransfer() { throw new Error("Нет"); }
  processPayPal() { throw new Error("Нет"); }
  handleCrypto() { throw new Error("Нет"); }
}`,
        good: `// Отдельные интерфейсы по способу оплаты
interface CardProcessor {
  chargeCard(amount: number, card: CardInfo): void;
}
interface WireProcessor {
  initiateWireTransfer(amount: number, iban: string): void;
}
interface CryptoProcessor {
  handleCrypto(amount: number, wallet: string): void;
}
class StripeProcessor implements CardProcessor {
  chargeCard(amount: number, card: CardInfo) { /* ок */ }
}`,
      },
      go: {
        bad: `// Толстый интерфейс платежей
type PaymentProcessor interface {
    ChargeCard(amount float64, card CardInfo) error
    WireTransfer(amount float64, iban string) error
    ProcessPayPal(amount float64, email string) error
    HandleCrypto(amount float64, wallet string) error
}
type StripeProcessor struct{}
func (s StripeProcessor) ChargeCard(float64, CardInfo) error { return nil }
func (s StripeProcessor) WireTransfer(float64, string) error {
    return errors.New("не поддерживается")
}
func (s StripeProcessor) ProcessPayPal(float64, string) error {
    return errors.New("не поддерживается")
}
func (s StripeProcessor) HandleCrypto(float64, string) error {
    return errors.New("не поддерживается")
}`,
        good: `// Отдельные интерфейсы
type CardProcessor interface {
    ChargeCard(amount float64, card CardInfo) error
}
type WireProcessor interface {
    WireTransfer(amount float64, iban string) error
}
type CryptoProcessor interface {
    HandleCrypto(amount float64, wallet string) error
}
type StripeProcessor struct{}
func (s StripeProcessor) ChargeCard(a float64, c CardInfo) error {
    return nil // обработка карты
}`,
      },
      python: {
        bad: `# Толстый интерфейс
class PaymentProcessor(ABC):
    @abstractmethod
    def charge_card(self, amount, card): ...
    @abstractmethod
    def wire_transfer(self, amount, iban): ...
    @abstractmethod
    def process_paypal(self, amount, email): ...
    @abstractmethod
    def handle_crypto(self, amount, wallet): ...

class StripeProcessor(PaymentProcessor):
    def charge_card(self, amount, card): ...  # ок
    def wire_transfer(self, amount, iban): raise NotImplementedError
    def process_paypal(self, amount, email): raise NotImplementedError
    def handle_crypto(self, amount, wallet): raise NotImplementedError`,
        good: `# Отдельные интерфейсы
class CardProcessor(ABC):
    @abstractmethod
    def charge_card(self, amount: float, card): ...

class WireProcessor(ABC):
    @abstractmethod
    def wire_transfer(self, amount: float, iban: str): ...

class CryptoProcessor(ABC):
    @abstractmethod
    def handle_crypto(self, amount: float, wallet: str): ...

class StripeProcessor(CardProcessor):
    def charge_card(self, amount, card):
        ...  # обработка карты через Stripe`,
      },
    },
    principle: 'I',
  },
  // 18. Composition of interfaces vs one big interface
  {
    text: 'Когда лучше использовать один большой интерфейс вместо композиции мелких?',
    options: [
      'Когда все методы всегда используются вместе и нет клиентов, которым нужно подмножество',
      'Когда интерфейс содержит менее 10 методов',
      'Когда используется язык без поддержки множественной реализации интерфейсов',
      'Никогда — всегда нужно делить интерфейсы на мелкие',
    ],
    correctIndex: 0,
    explanation:
      'Если все клиенты используют все методы интерфейса, его деление не имеет смысла и добавляет лишнюю сложность. ISP говорит: «не заставляй клиента зависеть от лишнего» — но если лишнего нет, один интерфейс допустим.',
    codeExamples: {
      ts: {
        bad: `// Ненужное дробление: все клиенты используют оба метода
interface Readable { read(): string; }
interface Writable { write(data: string): void; }
// Каждый клиент всё равно требует оба
function processFile(r: Readable & Writable) {
  const data = r.read();
  r.write(data.toUpperCase());
}
// Дробление не дало пользы — только усложнило код`,
        good: `// Один интерфейс, если все клиенты используют всё
interface FileHandler {
  read(): string;
  write(data: string): void;
}
function processFile(fh: FileHandler) {
  const data = fh.read();
  fh.write(data.toUpperCase());
}
// Если появится клиент, которому нужен только read,
// тогда стоит разделить интерфейс`,
      },
      go: {
        bad: `// Лишнее дробление
type Readable interface { Read() string }
type Writable interface { Write(data string) }
// Все клиенты требуют оба интерфейса
type ReadWriter interface {
    Readable
    Writable
}
// Дробление не дало пользы — все функции
// принимают ReadWriter
func Process(rw ReadWriter) {
    data := rw.Read()
    rw.Write(strings.ToUpper(data))
}`,
        good: `// Один интерфейс, когда все методы нужны вместе
type FileHandler interface {
    Read() string
    Write(data string)
}
func Process(fh FileHandler) {
    data := fh.Read()
    fh.Write(strings.ToUpper(data))
}
// Разделить, когда появится клиент
// с подмножеством методов`,
      },
      python: {
        bad: `# Ненужное дробление
class Readable(ABC):
    @abstractmethod
    def read(self) -> str: ...

class Writable(ABC):
    @abstractmethod
    def write(self, data: str): ...

# Все клиенты требуют оба протокола
def process_file(fh: Readable & Writable):
    data = fh.read()
    fh.write(data.upper())
# Дробление не дало пользы`,
        good: `# Один интерфейс — все клиенты используют всё
class FileHandler(ABC):
    @abstractmethod
    def read(self) -> str: ...
    @abstractmethod
    def write(self, data: str): ...

def process_file(fh: FileHandler):
    data = fh.read()
    fh.write(data.upper())
# Разделить при появлении клиента
# с подмножеством методов`,
      },
    },
    principle: 'I',
  },
];
