import type { QuestionData } from './types';

export const ocpQuestions: QuestionData[] = [
  // 1. Калькулятор скидок с if-else цепочкой для типов клиентов
  {
    text: 'Калькулятор скидок использует цепочку if-else для определения скидки по типу клиента. При добавлении нового типа клиента нужно менять код калькулятора. Какой принцип нарушен?',
    options: [
      'Single Responsibility Principle',
      'Open/Closed Principle',
      'Liskov Substitution Principle',
      'Dependency Inversion Principle',
    ],
    correctIndex: 1,
    explanation:
      'Нарушен OCP: каждый новый тип клиента требует модификации существующего кода калькулятора. Решение — вынести логику скидки в отдельные классы, реализующие общий интерфейс.',
    codeExamples: {
      ts: {
        bad: `// Каждый новый тип клиента — изменение класса
class DiscountCalculator {
  calculate(type: string, price: number): number {
    if (type === 'regular') return price * 0.95;
    if (type === 'vip') return price * 0.8;
    if (type === 'employee') return price * 0.7;
    // новый тип = новый if
    return price;
  }
}`,
        good: `// Новый тип клиента — новый класс
interface DiscountStrategy {
  calculate(price: number): number;
}
class VipDiscount implements DiscountStrategy {
  calculate(price: number) { return price * 0.8; }
}
class EmployeeDiscount implements DiscountStrategy {
  calculate(price: number) { return price * 0.7; }
}
class Calculator {
  constructor(private strategy: DiscountStrategy) {}
  calculate(price: number) { return this.strategy.calculate(price); }
}`,
      },
      go: {
        bad: `// Каждый новый тип клиента — изменение функции
func CalculateDiscount(custType string, price float64) float64 {
    if custType == "regular" { return price * 0.95 }
    if custType == "vip" { return price * 0.8 }
    if custType == "employee" { return price * 0.7 }
    // новый тип = новый if
    return price
}`,
        good: `// Новый тип клиента — новая структура
type DiscountStrategy interface {
    Calculate(price float64) float64
}
type VipDiscount struct{}
func (v VipDiscount) Calculate(price float64) float64 {
    return price * 0.8
}
type Calculator struct{ strategy DiscountStrategy }
func (c Calculator) Calculate(price float64) float64 {
    return c.strategy.Calculate(price)
}`,
      },
      python: {
        bad: `# Каждый новый тип клиента — изменение класса
class DiscountCalculator:
    def calculate(self, cust_type: str, price: float) -> float:
        if cust_type == "regular": return price * 0.95
        if cust_type == "vip": return price * 0.8
        if cust_type == "employee": return price * 0.7
        # новый тип = новый if
        return price`,
        good: `# Новый тип клиента — новый класс
from abc import ABC, abstractmethod

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, price: float) -> float: ...

class VipDiscount(DiscountStrategy):
    def calculate(self, price: float) -> float:
        return price * 0.8

class Calculator:
    def __init__(self, strategy: DiscountStrategy):
        self._strategy = strategy
    def calculate(self, price: float) -> float:
        return self._strategy.calculate(price)`,
      },
    },
    principle: 'O',
  },
  // 2. Система уведомлений (email/sms/push) через switch-case
  {
    text: 'Система уведомлений использует switch-case для выбора канала (email, sms, push). Что нужно сделать для соблюдения OCP?',
    options: [
      'Добавить комментарий к каждому case-блоку',
      'Вынести каждый канал в отдельный класс, реализующий общий интерфейс',
      'Использовать enum вместо строк',
      'Вынести switch в отдельный метод',
    ],
    correctIndex: 1,
    explanation:
      'Для соблюдения OCP нужно создать интерфейс Notifier и реализовать каждый канал в отдельном классе. Добавление нового канала не потребует изменения существующего кода.',
    codeExamples: {
      ts: {
        bad: `// switch растёт с каждым новым каналом
class NotificationService {
  send(channel: string, msg: string) {
    switch (channel) {
      case 'email': /* отправка email */ break;
      case 'sms': /* отправка sms */ break;
      case 'push': /* отправка push */ break;
      // новый канал = изменение switch
    }
  }
}`,
        good: `// Каждый канал — отдельный класс
interface Notifier {
  send(msg: string): void;
}
class EmailNotifier implements Notifier {
  send(msg: string) { /* отправка email */ }
}
class SmsNotifier implements Notifier {
  send(msg: string) { /* отправка sms */ }
}
class PushNotifier implements Notifier {
  send(msg: string) { /* отправка push */ }
}`,
      },
      go: {
        bad: `// switch растёт с каждым новым каналом
func Send(channel, msg string) {
    switch channel {
    case "email": // отправка email
    case "sms":   // отправка sms
    case "push":  // отправка push
    // новый канал = изменение switch
    }
}`,
        good: `// Каждый канал — отдельная структура
type Notifier interface {
    Send(msg string) error
}
type EmailNotifier struct{}
func (e EmailNotifier) Send(msg string) error { /* email */ return nil }

type SmsNotifier struct{}
func (s SmsNotifier) Send(msg string) error { /* sms */ return nil }`,
      },
      python: {
        bad: `# switch растёт с каждым новым каналом
class NotificationService:
    def send(self, channel: str, msg: str):
        if channel == "email":   ...  # отправка email
        elif channel == "sms":   ...  # отправка sms
        elif channel == "push":  ...  # отправка push
        # новый канал = новый elif`,
        good: `# Каждый канал — отдельный класс
from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, msg: str): ...

class EmailNotifier(Notifier):
    def send(self, msg: str): ...  # email

class SmsNotifier(Notifier):
    def send(self, msg: str): ...  # sms`,
      },
    },
    principle: 'O',
  },
  // 3. Обработчик платежей с новым способом оплаты
  {
    text: 'В систему оплаты нужно добавить криптовалюту. Обработчик платежей содержит switch по типу оплаты (карта, PayPal, банковский перевод). Что произойдёт при добавлении нового типа?',
    options: [
      'Ничего не изменится, система расширяема',
      'Нужно будет модифицировать существующий switch — нарушение OCP',
      'Нужно будет удалить старые типы оплаты',
      'Произойдёт нарушение LSP',
    ],
    correctIndex: 1,
    explanation:
      'При использовании switch по типам оплаты добавление нового типа требует модификации существующего кода — это прямое нарушение OCP. Нужен полиморфизм.',
    codeExamples: {
      ts: {
        bad: `// Добавление крипто требует изменения класса
class PaymentProcessor {
  process(type: string, amount: number) {
    switch (type) {
      case 'card': /* обработка карты */ break;
      case 'paypal': /* обработка PayPal */ break;
      // добавить case 'crypto' — модификация!
    }
  }
}`,
        good: `// Добавление крипто — новый класс
interface PaymentMethod {
  process(amount: number): void;
}
class CardPayment implements PaymentMethod {
  process(amount: number) { /* карта */ }
}
class CryptoPayment implements PaymentMethod {
  process(amount: number) { /* криптовалюта */ }
}
class PaymentProcessor {
  constructor(private method: PaymentMethod) {}
  process(amount: number) { this.method.process(amount); }
}`,
      },
      go: {
        bad: `// Добавление крипто требует изменения функции
func ProcessPayment(pType string, amount float64) {
    switch pType {
    case "card":   // обработка карты
    case "paypal": // обработка PayPal
    // добавить case "crypto" — модификация!
    }
}`,
        good: `// Добавление крипто — новая структура
type PaymentMethod interface {
    Process(amount float64) error
}
type CardPayment struct{}
func (c CardPayment) Process(amount float64) error { return nil }

type CryptoPayment struct{}
func (cr CryptoPayment) Process(amount float64) error { return nil }`,
      },
      python: {
        bad: `# Добавление крипто требует изменения класса
class PaymentProcessor:
    def process(self, pay_type: str, amount: float):
        if pay_type == "card":   ...  # карта
        elif pay_type == "paypal": ...  # PayPal
        # добавить elif "crypto" — модификация!`,
        good: `# Добавление крипто — новый класс
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount: float): ...

class CardPayment(PaymentMethod):
    def process(self, amount: float): ...  # карта

class CryptoPayment(PaymentMethod):
    def process(self, amount: float): ...  # крипто`,
      },
    },
    principle: 'O',
  },
  // 4. Паттерн Decorator как реализация OCP
  {
    text: 'Какой паттерн позволяет добавлять новое поведение объекту без изменения его класса, оборачивая объект в декоратор?',
    options: [
      'Singleton',
      'Observer',
      'Decorator',
      'Builder',
    ],
    correctIndex: 2,
    explanation:
      'Decorator — классический пример OCP. Он позволяет расширять поведение объекта, оборачивая его в дополнительные слои, без модификации исходного класса.',
    codeExamples: {
      ts: {
        bad: `// Добавление сжатия и шифрования — изменение класса
class FileWriter {
  write(data: string) {
    // базовая запись
    // + сжатие (захардкожено)
    // + шифрование (захардкожено)
  }
}`,
        good: `// Декораторы добавляют поведение без изменения
interface Writer { write(data: string): void; }

class FileWriter implements Writer {
  write(data: string) { /* базовая запись */ }
}
class CompressingWriter implements Writer {
  constructor(private inner: Writer) {}
  write(data: string) { this.inner.write(compress(data)); }
}
class EncryptingWriter implements Writer {
  constructor(private inner: Writer) {}
  write(data: string) { this.inner.write(encrypt(data)); }
}`,
      },
      go: {
        bad: `// Добавление сжатия и шифрования — изменение структуры
type FileWriter struct{}
func (f *FileWriter) Write(data string) {
    // базовая запись
    // + сжатие (захардкожено)
    // + шифрование (захардкожено)
}`,
        good: `// Декораторы добавляют поведение без изменения
type Writer interface { Write(data string) }

type FileWriter struct{}
func (f *FileWriter) Write(data string) { /* запись */ }

type CompressingWriter struct{ inner Writer }
func (c *CompressingWriter) Write(data string) {
    c.inner.Write(compress(data))
}`,
      },
      python: {
        bad: `# Добавление сжатия и шифрования — изменение класса
class FileWriter:
    def write(self, data: str):
        # базовая запись
        # + сжатие (захардкожено)
        # + шифрование (захардкожено)
        pass`,
        good: `# Декораторы добавляют поведение без изменения
class Writer(ABC):
    @abstractmethod
    def write(self, data: str): ...

class FileWriter(Writer):
    def write(self, data: str): ...  # базовая запись

class CompressingWriter(Writer):
    def __init__(self, inner: Writer): self._inner = inner
    def write(self, data: str):
        self._inner.write(compress(data))`,
      },
    },
    principle: 'O',
  },
  // 5. Паттерн Template Method и OCP
  {
    text: 'Паттерн Template Method определяет скелет алгоритма в базовом классе, позволяя подклассам переопределять отдельные шаги. Как это связано с OCP?',
    options: [
      'Template Method нарушает OCP, так как использует наследование',
      'Template Method реализует OCP: алгоритм закрыт для модификации, но открыт для расширения через переопределение шагов',
      'Template Method связан только с SRP',
      'Template Method не имеет отношения к принципам SOLID',
    ],
    correctIndex: 1,
    explanation:
      'Template Method — реализация OCP через наследование. Общий алгоритм (шаблон) закрыт для модификации в базовом классе, но отдельные шаги открыты для расширения в подклассах.',
    codeExamples: {
      ts: {
        bad: `// Вся логика в одном методе, расширение невозможно
class ReportBuilder {
  build(type: string) {
    if (type === 'pdf') { /* собираем PDF */ }
    if (type === 'html') { /* собираем HTML */ }
    // новый формат = изменение метода
  }
}`,
        good: `// Шаблон закрыт, шаги открыты для расширения
abstract class ReportBuilder {
  build() {         // шаблонный метод — неизменяем
    this.header();
    this.body();
    this.footer();
  }
  protected abstract header(): void;
  protected abstract body(): void;
  protected abstract footer(): void;
}
class PdfReport extends ReportBuilder {
  protected header() { /* PDF-заголовок */ }
  protected body() { /* PDF-тело */ }
  protected footer() { /* PDF-подвал */ }
}`,
      },
      go: {
        bad: `// Вся логика в одном методе, расширение невозможно
func BuildReport(reportType string) {
    if reportType == "pdf" { /* собираем PDF */ }
    if reportType == "html" { /* собираем HTML */ }
    // новый формат = изменение функции
}`,
        good: `// Шаги определяются через интерфейс
type ReportSteps interface {
    Header()
    Body()
    Footer()
}
func BuildReport(s ReportSteps) { // шаблон — неизменяем
    s.Header()
    s.Body()
    s.Footer()
}
type PdfReport struct{}
func (p PdfReport) Header() { /* PDF-заголовок */ }
func (p PdfReport) Body()   { /* PDF-тело */ }
func (p PdfReport) Footer() { /* PDF-подвал */ }`,
      },
      python: {
        bad: `# Вся логика в одном методе, расширение невозможно
class ReportBuilder:
    def build(self, report_type: str):
        if report_type == "pdf": ...   # собираем PDF
        if report_type == "html": ...  # собираем HTML
        # новый формат = изменение метода`,
        good: `# Шаблон закрыт, шаги открыты для расширения
from abc import ABC, abstractmethod

class ReportBuilder(ABC):
    def build(self):  # шаблонный метод — неизменяем
        self.header()
        self.body()
        self.footer()
    @abstractmethod
    def header(self): ...
    @abstractmethod
    def body(self): ...
    @abstractmethod
    def footer(self): ...

class PdfReport(ReportBuilder):
    def header(self): ...  # PDF-заголовок
    def body(self): ...    # PDF-тело
    def footer(self): ...  # PDF-подвал`,
      },
    },
    principle: 'O',
  },
  // 6. Фабричный метод и расширяемость
  {
    text: 'Как фабричный метод (Factory Method) помогает соблюдать OCP?',
    options: [
      'Он запрещает создание новых классов',
      'Он позволяет расширять создание объектов через подклассы без модификации базового кода',
      'Он заменяет все конструкторы на статические методы',
      'Он не связан с OCP',
    ],
    correctIndex: 1,
    explanation:
      'Factory Method позволяет подклассам определять, какой объект создавать, без изменения кода базового класса. Это расширение без модификации — суть OCP.',
    codeExamples: {
      ts: {
        bad: `// Создание транспорта захардкожено
class Logistics {
  createTransport(type: string) {
    if (type === 'truck') return new Truck();
    if (type === 'ship') return new Ship();
    // новый транспорт = изменение метода
  }
}`,
        good: `// Фабричный метод — расширение через подклассы
abstract class Logistics {
  abstract createTransport(): Transport;
  plan() {
    const t = this.createTransport();
    t.deliver();
  }
}
class RoadLogistics extends Logistics {
  createTransport() { return new Truck(); }
}
class SeaLogistics extends Logistics {
  createTransport() { return new Ship(); }
}`,
      },
      go: {
        bad: `// Создание транспорта захардкожено
func CreateTransport(tType string) Transport {
    if tType == "truck" { return &Truck{} }
    if tType == "ship" { return &Ship{} }
    // новый транспорт = изменение функции
    return nil
}`,
        good: `// Фабричный метод через интерфейс
type Transport interface { Deliver() }
type LogisticsFactory interface {
    CreateTransport() Transport
}
type RoadFactory struct{}
func (r RoadFactory) CreateTransport() Transport {
    return &Truck{}
}
type SeaFactory struct{}
func (s SeaFactory) CreateTransport() Transport {
    return &Ship{}
}`,
      },
      python: {
        bad: `# Создание транспорта захардкожено
class Logistics:
    def create_transport(self, t_type: str):
        if t_type == "truck": return Truck()
        if t_type == "ship": return Ship()
        # новый транспорт = изменение метода`,
        good: `# Фабричный метод — расширение через подклассы
from abc import ABC, abstractmethod

class Logistics(ABC):
    @abstractmethod
    def create_transport(self) -> Transport: ...
    def plan(self):
        t = self.create_transport()
        t.deliver()

class RoadLogistics(Logistics):
    def create_transport(self): return Truck()

class SeaLogistics(Logistics):
    def create_transport(self): return Ship()`,
      },
    },
    principle: 'O',
  },
  // 7. Конфигурация через plugin-систему
  {
    text: 'Приложение поддерживает плагины: каждый плагин реализует интерфейс Plugin и регистрируется в системе. Это пример соблюдения:',
    options: [
      'Single Responsibility Principle',
      'Liskov Substitution Principle',
      'Open/Closed Principle',
      'Interface Segregation Principle',
    ],
    correctIndex: 2,
    explanation:
      'Плагин-система — классический пример OCP. Ядро приложения закрыто для модификации, но открыто для расширения через регистрацию новых плагинов.',
    codeExamples: {
      ts: {
        bad: `// Новый плагин — изменение ядра приложения
class App {
  run() {
    this.initAuth();
    this.initLogger();
    this.initCache();
    // новый плагин = изменение метода run()
  }
}`,
        good: `// Плагин-система: ядро не меняется
interface Plugin {
  init(): void;
}
class App {
  private plugins: Plugin[] = [];
  register(plugin: Plugin) {
    this.plugins.push(plugin);
  }
  run() {
    this.plugins.forEach(p => p.init());
  }
}
// Новый плагин — новый класс, App не меняется
class CachePlugin implements Plugin {
  init() { /* настройка кэша */ }
}`,
      },
      go: {
        bad: `// Новый плагин — изменение ядра приложения
type App struct{}
func (a *App) Run() {
    a.initAuth()
    a.initLogger()
    a.initCache()
    // новый плагин = изменение Run()
}`,
        good: `// Плагин-система: ядро не меняется
type Plugin interface { Init() }

type App struct{ plugins []Plugin }
func (a *App) Register(p Plugin) {
    a.plugins = append(a.plugins, p)
}
func (a *App) Run() {
    for _, p := range a.plugins { p.Init() }
}
// Новый плагин — новая структура
type CachePlugin struct{}
func (c CachePlugin) Init() { /* настройка кэша */ }`,
      },
      python: {
        bad: `# Новый плагин — изменение ядра приложения
class App:
    def run(self):
        self._init_auth()
        self._init_logger()
        self._init_cache()
        # новый плагин = изменение run()`,
        good: `# Плагин-система: ядро не меняется
from abc import ABC, abstractmethod

class Plugin(ABC):
    @abstractmethod
    def init(self): ...

class App:
    def __init__(self): self._plugins: list[Plugin] = []
    def register(self, plugin: Plugin):
        self._plugins.append(plugin)
    def run(self):
        for p in self._plugins: p.init()

# Новый плагин — новый класс, App не меняется
class CachePlugin(Plugin):
    def init(self): ...  # настройка кэша`,
      },
    },
    principle: 'O',
  },
  // 8. Валидатор форм с захардкоженными правилами
  {
    text: 'Валидатор формы содержит захардкоженные правила проверки (email, телефон, длина строки) внутри одного метода validate(). При добавлении нового правила нужно менять метод. Как исправить?',
    options: [
      'Добавить больше параметров в метод validate()',
      'Создать интерфейс ValidationRule и передавать список правил извне',
      'Использовать регулярные выражения для всех проверок',
      'Разбить метод на несколько приватных методов',
    ],
    correctIndex: 1,
    explanation:
      'Создание интерфейса ValidationRule и передача списка правил извне позволяет добавлять новые правила без модификации валидатора — соблюдение OCP.',
    codeExamples: {
      ts: {
        bad: `// Правила захардкожены внутри валидатора
class FormValidator {
  validate(data: Record<string, string>) {
    if (!data.email.includes('@')) return false;
    if (data.phone.length < 10) return false;
    if (data.name.length < 2) return false;
    // новое правило = изменение метода
    return true;
  }
}`,
        good: `// Правила передаются извне
interface ValidationRule {
  validate(value: string): boolean;
}
class EmailRule implements ValidationRule {
  validate(value: string) { return value.includes('@'); }
}
class MinLengthRule implements ValidationRule {
  constructor(private min: number) {}
  validate(value: string) { return value.length >= this.min; }
}
class FormValidator {
  constructor(private rules: ValidationRule[]) {}
  validate(value: string) {
    return this.rules.every(r => r.validate(value));
  }
}`,
      },
      go: {
        bad: `// Правила захардкожены внутри валидатора
func Validate(data map[string]string) bool {
    if !strings.Contains(data["email"], "@") { return false }
    if len(data["phone"]) < 10 { return false }
    if len(data["name"]) < 2 { return false }
    // новое правило = изменение функции
    return true
}`,
        good: `// Правила передаются извне
type ValidationRule interface {
    Validate(value string) bool
}
type EmailRule struct{}
func (e EmailRule) Validate(v string) bool {
    return strings.Contains(v, "@")
}
type MinLengthRule struct{ Min int }
func (m MinLengthRule) Validate(v string) bool {
    return len(v) >= m.Min
}
type Validator struct{ rules []ValidationRule }
func (v Validator) Validate(val string) bool {
    for _, r := range v.rules {
        if !r.Validate(val) { return false }
    }
    return true
}`,
      },
      python: {
        bad: `# Правила захардкожены внутри валидатора
class FormValidator:
    def validate(self, data: dict) -> bool:
        if "@" not in data["email"]: return False
        if len(data["phone"]) < 10: return False
        if len(data["name"]) < 2: return False
        # новое правило = изменение метода
        return True`,
        good: `# Правила передаются извне
from abc import ABC, abstractmethod

class ValidationRule(ABC):
    @abstractmethod
    def validate(self, value: str) -> bool: ...

class EmailRule(ValidationRule):
    def validate(self, value: str) -> bool:
        return "@" in value

class MinLengthRule(ValidationRule):
    def __init__(self, min_len: int): self.min = min_len
    def validate(self, value: str) -> bool:
        return len(value) >= self.min

class Validator:
    def __init__(self, rules: list[ValidationRule]):
        self._rules = rules
    def validate(self, value: str) -> bool:
        return all(r.validate(value) for r in self._rules)`,
      },
    },
    principle: 'O',
  },
  // 9. Сериализатор данных (JSON/XML/YAML) через if-else
  {
    text: 'Сериализатор данных использует if-else для выбора формата (JSON, XML, YAML). Какой подход соответствует OCP?',
    options: [
      'Добавить параметр format в конструктор и использовать if-else',
      'Использовать один универсальный формат для всех случаев',
      'Создать интерфейс Serializer и реализовать каждый формат отдельным классом',
      'Хранить форматы в конфигурационном файле',
    ],
    correctIndex: 2,
    explanation:
      'Интерфейс Serializer с отдельной реализацией для каждого формата позволяет добавлять новые форматы без модификации существующего кода — это OCP.',
    codeExamples: {
      ts: {
        bad: `// if-else для каждого формата
class DataSerializer {
  serialize(data: object, format: string): string {
    if (format === 'json') return JSON.stringify(data);
    if (format === 'xml') return toXml(data);
    if (format === 'yaml') return toYaml(data);
    // новый формат = изменение метода
    throw new Error('Неизвестный формат');
  }
}`,
        good: `// Каждый формат — отдельный класс
interface Serializer {
  serialize(data: object): string;
}
class JsonSerializer implements Serializer {
  serialize(data: object) { return JSON.stringify(data); }
}
class XmlSerializer implements Serializer {
  serialize(data: object) { return toXml(data); }
}
// Новый формат = новый класс, старый код не меняется`,
      },
      go: {
        bad: `// if-else для каждого формата
func Serialize(data any, format string) (string, error) {
    if format == "json" { /* JSON */ }
    if format == "xml" { /* XML */ }
    if format == "yaml" { /* YAML */ }
    // новый формат = изменение функции
    return "", fmt.Errorf("неизвестный формат")
}`,
        good: `// Каждый формат — отдельная структура
type Serializer interface {
    Serialize(data any) (string, error)
}
type JsonSerializer struct{}
func (j JsonSerializer) Serialize(data any) (string, error) {
    b, err := json.Marshal(data)
    return string(b), err
}
type XmlSerializer struct{}
func (x XmlSerializer) Serialize(data any) (string, error) {
    b, err := xml.Marshal(data)
    return string(b), err
}`,
      },
      python: {
        bad: `# if-else для каждого формата
class DataSerializer:
    def serialize(self, data: dict, fmt: str) -> str:
        if fmt == "json": return json.dumps(data)
        if fmt == "xml": return to_xml(data)
        if fmt == "yaml": return yaml.dump(data)
        # новый формат = изменение метода
        raise ValueError("Неизвестный формат")`,
        good: `# Каждый формат — отдельный класс
from abc import ABC, abstractmethod

class Serializer(ABC):
    @abstractmethod
    def serialize(self, data: dict) -> str: ...

class JsonSerializer(Serializer):
    def serialize(self, data: dict) -> str:
        return json.dumps(data)

class XmlSerializer(Serializer):
    def serialize(self, data: dict) -> str:
        return to_xml(data)
# Новый формат = новый класс, старый код не меняется`,
      },
    },
    principle: 'O',
  },
  // 10. Генератор отчётов с жёстко зашитыми форматами
  {
    text: 'Генератор отчётов умеет создавать отчёты только в PDF и Excel. Форматы жёстко зашиты в метод generate(). Менеджер просит добавить CSV. Что не так с текущим дизайном?',
    options: [
      'Класс не следует SRP',
      'Класс нарушает ISP',
      'Класс нарушает OCP — добавление нового формата требует модификации существующего кода',
      'Класс нарушает DIP',
    ],
    correctIndex: 2,
    explanation:
      'Жёстко зашитые форматы нарушают OCP: каждый новый формат требует изменения метода generate(). Нужно вынести форматирование в отдельные классы через общий интерфейс.',
    codeExamples: {
      ts: {
        bad: `// Форматы жёстко зашиты
class ReportGenerator {
  generate(data: Data[], format: string) {
    if (format === 'pdf') { /* генерация PDF */ }
    else if (format === 'excel') { /* генерация Excel */ }
    // добавить CSV = изменить этот метод
  }
}`,
        good: `// Каждый формат — отдельный класс
interface ReportFormatter {
  format(data: Data[]): Buffer;
}
class PdfFormatter implements ReportFormatter {
  format(data: Data[]) { /* PDF */ return Buffer.from(''); }
}
class CsvFormatter implements ReportFormatter {
  format(data: Data[]) { /* CSV */ return Buffer.from(''); }
}
class ReportGenerator {
  constructor(private formatter: ReportFormatter) {}
  generate(data: Data[]) { return this.formatter.format(data); }
}`,
      },
      go: {
        bad: `// Форматы жёстко зашиты
func GenerateReport(data []Data, format string) []byte {
    if format == "pdf" { /* генерация PDF */ }
    if format == "excel" { /* генерация Excel */ }
    // добавить CSV = изменить функцию
    return nil
}`,
        good: `// Каждый формат — отдельная структура
type ReportFormatter interface {
    Format(data []Data) []byte
}
type PdfFormatter struct{}
func (p PdfFormatter) Format(data []Data) []byte { /* PDF */ return nil }

type CsvFormatter struct{}
func (c CsvFormatter) Format(data []Data) []byte { /* CSV */ return nil }

func GenerateReport(f ReportFormatter, data []Data) []byte {
    return f.Format(data)
}`,
      },
      python: {
        bad: `# Форматы жёстко зашиты
class ReportGenerator:
    def generate(self, data: list, fmt: str) -> bytes:
        if fmt == "pdf": ...    # генерация PDF
        elif fmt == "excel": ...  # генерация Excel
        # добавить CSV = изменить этот метод`,
        good: `# Каждый формат — отдельный класс
from abc import ABC, abstractmethod

class ReportFormatter(ABC):
    @abstractmethod
    def format(self, data: list) -> bytes: ...

class PdfFormatter(ReportFormatter):
    def format(self, data: list) -> bytes: ...  # PDF

class CsvFormatter(ReportFormatter):
    def format(self, data: list) -> bytes: ...  # CSV

class ReportGenerator:
    def __init__(self, formatter: ReportFormatter):
        self._fmt = formatter
    def generate(self, data: list) -> bytes:
        return self._fmt.format(data)`,
      },
    },
    principle: 'O',
  },
  // 11. Система логирования с расширением через новые транспорты
  {
    text: 'Система логирования записывает логи в файл. Нужно добавить отправку логов в Elasticsearch и Sentry. Как реализовать расширение по OCP?',
    options: [
      'Добавить методы logToElastic() и logToSentry() в существующий класс',
      'Создать интерфейс LogTransport и реализовать каждый транспорт отдельно',
      'Использовать глобальные переменные для выбора транспорта',
      'Написать один метод log() с параметром destination',
    ],
    correctIndex: 1,
    explanation:
      'Интерфейс LogTransport с отдельными реализациями для файла, Elasticsearch и Sentry позволяет расширять систему без изменения ядра логирования.',
    codeExamples: {
      ts: {
        bad: `// Транспорты захардкожены в классе
class Logger {
  log(msg: string) {
    fs.appendFileSync('app.log', msg);
    // добавить Elastic — изменение класса
    // добавить Sentry — ещё изменение
  }
}`,
        good: `// Каждый транспорт — отдельный класс
interface LogTransport {
  send(msg: string): void;
}
class FileTransport implements LogTransport {
  send(msg: string) { fs.appendFileSync('app.log', msg); }
}
class ElasticTransport implements LogTransport {
  send(msg: string) { /* отправка в Elasticsearch */ }
}
class Logger {
  constructor(private transports: LogTransport[]) {}
  log(msg: string) {
    this.transports.forEach(t => t.send(msg));
  }
}`,
      },
      go: {
        bad: `// Транспорты захардкожены в структуре
type Logger struct{}
func (l *Logger) Log(msg string) {
    os.WriteFile("app.log", []byte(msg), 0644)
    // добавить Elastic — изменение структуры
}`,
        good: `// Каждый транспорт — отдельная структура
type LogTransport interface {
    Send(msg string) error
}
type FileTransport struct{ path string }
func (f FileTransport) Send(msg string) error {
    return os.WriteFile(f.path, []byte(msg), 0644)
}
type ElasticTransport struct{}
func (e ElasticTransport) Send(msg string) error { return nil }

type Logger struct{ transports []LogTransport }
func (l *Logger) Log(msg string) {
    for _, t := range l.transports { t.Send(msg) }
}`,
      },
      python: {
        bad: `# Транспорты захардкожены в классе
class Logger:
    def log(self, msg: str):
        with open("app.log", "a") as f:
            f.write(msg)
        # добавить Elastic — изменение класса`,
        good: `# Каждый транспорт — отдельный класс
from abc import ABC, abstractmethod

class LogTransport(ABC):
    @abstractmethod
    def send(self, msg: str): ...

class FileTransport(LogTransport):
    def send(self, msg: str):
        with open("app.log", "a") as f: f.write(msg)

class ElasticTransport(LogTransport):
    def send(self, msg: str): ...  # Elasticsearch

class Logger:
    def __init__(self, transports: list[LogTransport]):
        self._transports = transports
    def log(self, msg: str):
        for t in self._transports: t.send(msg)`,
      },
    },
    principle: 'O',
  },
  // 12. Middleware chain / pipeline как OCP
  {
    text: 'В веб-фреймворке каждый HTTP-запрос проходит через цепочку middleware (аутентификация, логирование, CORS). Новый middleware добавляется регистрацией в цепочке. Это пример:',
    options: [
      'Нарушения SRP — слишком много middleware',
      'Соблюдения OCP — новое поведение добавляется без изменения существующего кода',
      'Нарушения DIP — middleware зависят друг от друга',
      'Соблюдения LSP — middleware взаимозаменяемы',
    ],
    correctIndex: 1,
    explanation:
      'Middleware-цепочка — пример OCP: ядро обработки запросов закрыто для модификации, но открыто для расширения через добавление новых middleware.',
    codeExamples: {
      ts: {
        bad: `// Обработка захардкожена в одном методе
class Server {
  handle(req: Request): Response {
    this.logRequest(req);
    this.checkAuth(req);
    this.setCors(req);
    // новый шаг = изменение handle()
    return this.processRequest(req);
  }
}`,
        good: `// Middleware добавляются без изменения ядра
interface Middleware {
  handle(req: Request, next: () => Response): Response;
}
class AuthMiddleware implements Middleware {
  handle(req: Request, next: () => Response) {
    if (!req.token) throw new Error('401');
    return next();
  }
}
class Server {
  private stack: Middleware[] = [];
  use(mw: Middleware) { this.stack.push(mw); }
  // добавление нового middleware не меняет Server
}`,
      },
      go: {
        bad: `// Обработка захардкожена в одном методе
func Handle(req *http.Request) *http.Response {
    logRequest(req)
    checkAuth(req)
    setCors(req)
    // новый шаг = изменение Handle()
    return processRequest(req)
}`,
        good: `// Middleware добавляются без изменения ядра
type Middleware func(http.Handler) http.Handler

func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.Header.Get("Token") == "" { w.WriteHeader(401); return }
        next.ServeHTTP(w, r)
    })
}
// mux.Use(AuthMiddleware) — Server не меняется`,
      },
      python: {
        bad: `# Обработка захардкожена в одном методе
class Server:
    def handle(self, request):
        self._log(request)
        self._check_auth(request)
        self._set_cors(request)
        # новый шаг = изменение handle()
        return self._process(request)`,
        good: `# Middleware добавляются без изменения ядра
from abc import ABC, abstractmethod

class Middleware(ABC):
    @abstractmethod
    def handle(self, request, next_handler): ...

class AuthMiddleware(Middleware):
    def handle(self, request, next_handler):
        if not request.token: raise PermissionError
        return next_handler(request)

class Server:
    def __init__(self): self._middlewares = []
    def use(self, mw: Middleware):
        self._middlewares.append(mw)
    # добавление нового middleware не меняет Server`,
      },
    },
    principle: 'O',
  },
  // 13. Event system / observer и расширяемость
  {
    text: 'Система событий позволяет подписываться на события через on() и вызывать обработчики через emit(). Как это связано с OCP?',
    options: [
      'Никак — событийная система относится только к DIP',
      'Событийная система нарушает OCP из-за динамической типизации',
      'Событийная система реализует OCP: новые обработчики добавляются без изменения эмиттера',
      'Событийная система нарушает OCP, так как emit() нужно менять для каждого нового события',
    ],
    correctIndex: 2,
    explanation:
      'Event-система (паттерн Observer) — реализация OCP: эмиттер событий закрыт для модификации, но открыт для расширения через регистрацию новых обработчиков.',
    codeExamples: {
      ts: {
        bad: `// Обработчики захардкожены
class OrderService {
  placeOrder(order: Order) {
    this.saveOrder(order);
    this.sendEmail(order);     // захардкожено
    this.updateStock(order);   // захардкожено
    // новое действие = изменение метода
  }
}`,
        good: `// Обработчики добавляются через подписку
class EventEmitter {
  private handlers = new Map<string, Function[]>();
  on(event: string, handler: Function) {
    this.handlers.get(event)?.push(handler) ??
      this.handlers.set(event, [handler]);
  }
  emit(event: string, data: any) {
    this.handlers.get(event)?.forEach(h => h(data));
  }
}
// emitter.on('orderPlaced', sendEmail);
// emitter.on('orderPlaced', updateStock);`,
      },
      go: {
        bad: `// Обработчики захардкожены
func PlaceOrder(order Order) {
    saveOrder(order)
    sendEmail(order)    // захардкожено
    updateStock(order)  // захардкожено
    // новое действие = изменение функции
}`,
        good: `// Обработчики добавляются через подписку
type EventHandler func(data any)
type EventEmitter struct {
    handlers map[string][]EventHandler
}
func (e *EventEmitter) On(event string, h EventHandler) {
    e.handlers[event] = append(e.handlers[event], h)
}
func (e *EventEmitter) Emit(event string, data any) {
    for _, h := range e.handlers[event] { h(data) }
}
// emitter.On("orderPlaced", sendEmail)`,
      },
      python: {
        bad: `# Обработчики захардкожены
class OrderService:
    def place_order(self, order):
        self._save(order)
        self._send_email(order)    # захардкожено
        self._update_stock(order)  # захардкожено
        # новое действие = изменение метода`,
        good: `# Обработчики добавляются через подписку
class EventEmitter:
    def __init__(self):
        self._handlers: dict[str, list] = {}
    def on(self, event: str, handler):
        self._handlers.setdefault(event, []).append(handler)
    def emit(self, event: str, data):
        for h in self._handlers.get(event, []):
            h(data)
# emitter.on("order_placed", send_email)
# emitter.on("order_placed", update_stock)`,
      },
    },
    principle: 'O',
  },
  // 14. Расчёт налогов для разных стран через if-else
  {
    text: 'Система расчёта налогов содержит if-else цепочку по коду страны (US, DE, RU, JP...). Компания выходит на новые рынки. Какая проблема с текущим подходом?',
    options: [
      'Слишком много стран для поддержки',
      'Каждая новая страна требует модификации существующего кода — нарушение OCP',
      'Нарушение SRP — слишком много ответственности',
      'Нарушение DIP — зависимость от конкретных стран',
    ],
    correctIndex: 1,
    explanation:
      'Добавление новой страны требует изменения метода расчёта — прямое нарушение OCP. Нужно создать интерфейс TaxCalculator и реализовать логику каждой страны в отдельном классе.',
    codeExamples: {
      ts: {
        bad: `// Новая страна = изменение метода
class TaxCalculator {
  calculate(country: string, amount: number): number {
    if (country === 'US') return amount * 0.07;
    if (country === 'DE') return amount * 0.19;
    if (country === 'RU') return amount * 0.20;
    // новая страна = новый if
    return amount;
  }
}`,
        good: `// Каждая страна — отдельный класс
interface TaxStrategy {
  calculate(amount: number): number;
}
class UsTax implements TaxStrategy {
  calculate(amount: number) { return amount * 0.07; }
}
class DeTax implements TaxStrategy {
  calculate(amount: number) { return amount * 0.19; }
}
// Новая страна — новый класс, старый код не трогаем
const taxes: Record<string, TaxStrategy> = {
  US: new UsTax(), DE: new DeTax(),
};`,
      },
      go: {
        bad: `// Новая страна = изменение функции
func CalculateTax(country string, amount float64) float64 {
    if country == "US" { return amount * 0.07 }
    if country == "DE" { return amount * 0.19 }
    if country == "RU" { return amount * 0.20 }
    // новая страна = новый if
    return amount
}`,
        good: `// Каждая страна — отдельная структура
type TaxStrategy interface {
    Calculate(amount float64) float64
}
type UsTax struct{}
func (u UsTax) Calculate(amount float64) float64 {
    return amount * 0.07
}
type DeTax struct{}
func (d DeTax) Calculate(amount float64) float64 {
    return amount * 0.19
}
// Новая страна — новая структура`,
      },
      python: {
        bad: `# Новая страна = изменение метода
class TaxCalculator:
    def calculate(self, country: str, amount: float) -> float:
        if country == "US": return amount * 0.07
        if country == "DE": return amount * 0.19
        if country == "RU": return amount * 0.20
        # новая страна = новый if
        return amount`,
        good: `# Каждая страна — отдельный класс
from abc import ABC, abstractmethod

class TaxStrategy(ABC):
    @abstractmethod
    def calculate(self, amount: float) -> float: ...

class UsTax(TaxStrategy):
    def calculate(self, amount: float) -> float:
        return amount * 0.07

class DeTax(TaxStrategy):
    def calculate(self, amount: float) -> float:
        return amount * 0.19

# Новая страна — новый класс, старый код не трогаем
taxes = {"US": UsTax(), "DE": DeTax()}`,
      },
    },
    principle: 'O',
  },
  // 15. Роутинг с хардкод обработчиками vs маппинг
  {
    text: 'Веб-сервер обрабатывает маршруты через цепочку if-else: if (path === "/users") ... else if (path === "/orders") .... Как привести к OCP?',
    options: [
      'Заменить if-else на switch-case',
      'Вынести маршруты в конфигурационный JSON-файл',
      'Использовать маппинг маршрутов на обработчики с возможностью регистрации новых маршрутов',
      'Создать отдельный сервер для каждого маршрута',
    ],
    correctIndex: 2,
    explanation:
      'Маппинг маршрутов с регистрацией позволяет добавлять новые маршруты без модификации ядра роутера — соблюдение OCP. Switch-case не решает проблему.',
    codeExamples: {
      ts: {
        bad: `// Маршруты захардкожены
class Router {
  handle(path: string) {
    if (path === '/users') return this.getUsers();
    if (path === '/orders') return this.getOrders();
    // новый маршрут = изменение Router
    return '404';
  }
}`,
        good: `// Маршруты регистрируются динамически
type Handler = () => string;
class Router {
  private routes = new Map<string, Handler>();
  register(path: string, handler: Handler) {
    this.routes.set(path, handler);
  }
  handle(path: string) {
    return this.routes.get(path)?.() ?? '404';
  }
}
// router.register('/users', getUsers);
// router.register('/orders', getOrders);`,
      },
      go: {
        bad: `// Маршруты захардкожены
func Handle(path string) string {
    if path == "/users" { return getUsers() }
    if path == "/orders" { return getOrders() }
    // новый маршрут = изменение Handle
    return "404"
}`,
        good: `// Маршруты регистрируются динамически
type Handler func() string
type Router struct {
    routes map[string]Handler
}
func (r *Router) Register(path string, h Handler) {
    r.routes[path] = h
}
func (r *Router) Handle(path string) string {
    if h, ok := r.routes[path]; ok { return h() }
    return "404"
}
// router.Register("/users", getUsers)`,
      },
      python: {
        bad: `# Маршруты захардкожены
class Router:
    def handle(self, path: str) -> str:
        if path == "/users": return self._get_users()
        if path == "/orders": return self._get_orders()
        # новый маршрут = изменение Router
        return "404"`,
        good: `# Маршруты регистрируются динамически
class Router:
    def __init__(self):
        self._routes: dict[str, callable] = {}
    def register(self, path: str, handler: callable):
        self._routes[path] = handler
    def handle(self, path: str) -> str:
        handler = self._routes.get(path)
        return handler() if handler else "404"
# router.register("/users", get_users)
# router.register("/orders", get_orders)`,
      },
    },
    principle: 'O',
  },
  // 16. Экспорт данных в новые форматы
  {
    text: 'Какой из следующих фрагментов кода соответствует OCP при экспорте данных?',
    options: [
      'export(data, "csv") с switch внутри',
      'class CsvExporter implements Exporter — каждый формат в отдельном классе',
      'export_csv(data), export_json(data) — отдельная функция для каждого формата в одном модуле',
      'Все форматы в одном методе с флагами',
    ],
    correctIndex: 1,
    explanation:
      'Отдельные классы, реализующие общий интерфейс Exporter, позволяют добавлять новые форматы без модификации существующего кода. Отдельные функции без общего интерфейса не дают полиморфизма.',
    codeExamples: {
      ts: {
        bad: `// Все форматы в одном классе
class DataExporter {
  export(data: any[], format: string): string {
    switch (format) {
      case 'csv': return data.map(r => r.join(',')).join('\\n');
      case 'json': return JSON.stringify(data);
      // новый формат = изменение switch
    }
    return '';
  }
}`,
        good: `// Каждый формат — отдельный класс
interface Exporter {
  export(data: any[]): string;
}
class CsvExporter implements Exporter {
  export(data: any[]) {
    return data.map(r => r.join(',')).join('\\n');
  }
}
class JsonExporter implements Exporter {
  export(data: any[]) { return JSON.stringify(data); }
}
// Новый формат — новый класс`,
      },
      go: {
        bad: `// Все форматы в одной функции
func Export(data [][]string, format string) string {
    switch format {
    case "csv":  return strings.Join(/* ... */)
    case "json": b, _ := json.Marshal(data); return string(b)
    // новый формат = изменение switch
    }
    return ""
}`,
        good: `// Каждый формат — отдельная структура
type Exporter interface {
    Export(data [][]string) string
}
type CsvExporter struct{}
func (c CsvExporter) Export(data [][]string) string {
    // CSV-логика
    return ""
}
type JsonExporter struct{}
func (j JsonExporter) Export(data [][]string) string {
    b, _ := json.Marshal(data); return string(b)
}`,
      },
      python: {
        bad: `# Все форматы в одном классе
class DataExporter:
    def export(self, data: list, fmt: str) -> str:
        if fmt == "csv":
            return "\\n".join(",".join(r) for r in data)
        if fmt == "json":
            return json.dumps(data)
        # новый формат = изменение метода`,
        good: `# Каждый формат — отдельный класс
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, data: list) -> str: ...

class CsvExporter(Exporter):
    def export(self, data: list) -> str:
        return "\\n".join(",".join(r) for r in data)

class JsonExporter(Exporter):
    def export(self, data: list) -> str:
        return json.dumps(data)`,
      },
    },
    principle: 'O',
  },
  // 17. Антипаттерн: модификация библиотечного кода вместо расширения
  {
    text: 'Разработчик столкнулся с ограничением библиотечного класса Logger. Вместо расширения он отредактировал исходный код библиотеки в node_modules. Какой принцип нарушен и почему это опасно?',
    options: [
      'Нарушен SRP — Logger делает слишком много',
      'Нарушен OCP — нужно было расширить класс (наследование или обёртка), а не модифицировать чужой код',
      'Нарушен DIP — нужно было внедрить зависимость',
      'Нарушен ISP — интерфейс Logger слишком большой',
    ],
    correctIndex: 1,
    explanation:
      'Модификация библиотечного кода — грубое нарушение OCP. Изменения потеряются при обновлении зависимостей. Нужно расширять через наследование, обёртки или конфигурацию.',
    codeExamples: {
      ts: {
        bad: `// Модификация чужого кода в node_modules!
// node_modules/logger/index.ts — ИЗМЕНЕНО
class Logger {
  log(msg: string) {
    console.log(msg);
    sendToSlack(msg); // добавлено вручную!
    // потеряется при npm install
  }
}`,
        good: `// Расширение через обёртку
import { Logger } from 'logger';

class ExtendedLogger {
  constructor(private logger: Logger) {}
  log(msg: string) {
    this.logger.log(msg);
    this.sendToSlack(msg); // расширение
  }
  private sendToSlack(msg: string) { /* Slack API */ }
}`,
      },
      go: {
        bad: `// Модификация чужого пакета — антипаттерн!
// vendor/logger/logger.go — ИЗМЕНЕНО
func (l *Logger) Log(msg string) {
    fmt.Println(msg)
    sendToSlack(msg) // добавлено вручную!
    // потеряется при go mod vendor
}`,
        good: `// Расширение через обёртку
type ExtendedLogger struct {
    inner *logger.Logger
}
func (e *ExtendedLogger) Log(msg string) {
    e.inner.Log(msg)
    e.sendToSlack(msg) // расширение
}
func (e *ExtendedLogger) sendToSlack(msg string) {
    // Slack API
}`,
      },
      python: {
        bad: `# Модификация чужого пакета — антипаттерн!
# site-packages/logger/core.py — ИЗМЕНЕНО
class Logger:
    def log(self, msg: str):
        print(msg)
        send_to_slack(msg)  # добавлено вручную!
        # потеряется при pip install`,
        good: `# Расширение через обёртку
from logger import Logger

class ExtendedLogger:
    def __init__(self, inner: Logger):
        self._inner = inner
    def log(self, msg: str):
        self._inner.log(msg)
        self._send_to_slack(msg)  # расширение
    def _send_to_slack(self, msg: str): ...`,
      },
    },
    principle: 'O',
  },
  // 18. Вопрос про разницу между наследованием и композицией для OCP
  {
    text: 'Какой способ расширения поведения класса лучше соответствует OCP и почему?',
    options: [
      'Наследование — потому что оно позволяет переопределять методы',
      'Композиция — потому что она позволяет комбинировать поведения без жёсткой связи и изменения существующих классов',
      'Оба способа одинаково хороши для OCP',
      'Ни один не подходит — для OCP нужны только интерфейсы',
    ],
    correctIndex: 1,
    explanation:
      'Композиция лучше соответствует OCP: она позволяет добавлять и комбинировать поведения через внедрение зависимостей без модификации существующих классов и без хрупкой иерархии наследования.',
    codeExamples: {
      ts: {
        bad: `// Наследование: жёсткая связь, хрупкая иерархия
class Animal { move() { /* ходьба */ } }
class FlyingAnimal extends Animal {
  move() { /* полёт */ }
}
class SwimmingFlyingAnimal extends FlyingAnimal {
  move() { /* ??? плавание + полёт */ }
  // Глубокая иерархия, сложно расширять
}`,
        good: `// Композиция: гибкое комбинирование поведений
interface MoveBehavior { move(): void; }
class Walk implements MoveBehavior {
  move() { /* ходьба */ }
}
class Fly implements MoveBehavior {
  move() { /* полёт */ }
}
class Animal {
  constructor(private behavior: MoveBehavior) {}
  move() { this.behavior.move(); }
  setBehavior(b: MoveBehavior) { this.behavior = b; }
}
// Любое поведение без изменения Animal`,
      },
      go: {
        bad: `// Встраивание (embedding) создаёт жёсткую связь
type Animal struct{}
func (a *Animal) Move() { /* ходьба */ }

type FlyingAnimal struct{ Animal }
func (f *FlyingAnimal) Move() { /* полёт */ }

// Нельзя гибко комбинировать поведения`,
        good: `// Композиция: гибкое комбинирование поведений
type MoveBehavior interface { Move() }

type Walk struct{}
func (w Walk) Move() { /* ходьба */ }

type Fly struct{}
func (f Fly) Move() { /* полёт */ }

type Animal struct{ behavior MoveBehavior }
func (a *Animal) Move() { a.behavior.Move() }
func (a *Animal) SetBehavior(b MoveBehavior) {
    a.behavior = b
}`,
      },
      python: {
        bad: `# Наследование: жёсткая связь, хрупкая иерархия
class Animal:
    def move(self): print("ходьба")

class FlyingAnimal(Animal):
    def move(self): print("полёт")

class SwimmingFlyingAnimal(FlyingAnimal):
    def move(self): ...  # ??? плавание + полёт
    # Глубокая иерархия, сложно расширять`,
        good: `# Композиция: гибкое комбинирование поведений
from abc import ABC, abstractmethod

class MoveBehavior(ABC):
    @abstractmethod
    def move(self): ...

class Walk(MoveBehavior):
    def move(self): print("ходьба")

class Fly(MoveBehavior):
    def move(self): print("полёт")

class Animal:
    def __init__(self, behavior: MoveBehavior):
        self._behavior = behavior
    def move(self): self._behavior.move()
    def set_behavior(self, b: MoveBehavior):
        self._behavior = b`,
      },
    },
    principle: 'O',
  },
];
