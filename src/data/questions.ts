export type { CodePair, QuestionData, Question } from './types';
import type { QuestionData, Question } from './types';
import { srpQuestions } from './questions-s';
import { ocpQuestions } from './questions-o';
import { lspQuestions } from './questions-l';
import { ispQuestions } from './questions-i';
import { dipQuestions } from './questions-d';

const baseQuestions: QuestionData[] = [
  {
    text: 'Какой принцип SOLID гласит, что класс должен иметь только одну причину для изменения?',
    options: [
      'Open/Closed Principle',
      'Single Responsibility Principle',
      'Liskov Substitution Principle',
      'Interface Segregation Principle',
    ],
    correctIndex: 1,
    explanation:
      'Single Responsibility Principle (SRP) — каждый класс должен отвечать только за одну часть функциональности и иметь только одну причину для изменения.',
    codeExamples: {
      ts: {
        bad: `// Класс делает слишком много
class Employee {
  calculatePay() { /* ... */ }
  saveToDatabase() { /* ... */ }
  generateReport() { /* ... */ }
}`,
        good: `// Каждый класс — одна ответственность
class Employee { /* данные сотрудника */ }
class PayCalculator { calculatePay(e: Employee) {} }
class EmployeeRepository { save(e: Employee) {} }
class ReportGenerator { generate(e: Employee) {} }`,
      },
      go: {
        bad: `// Структура делает слишком много
type Employee struct{ Name string }

func (e *Employee) CalculatePay() float64 { /* ... */ }
func (e *Employee) SaveToDatabase() error { /* ... */ }
func (e *Employee) GenerateReport() string { /* ... */ }`,
        good: `// Каждая структура — одна ответственность
type Employee struct{ Name string }

type PayCalculator struct{}
func (p *PayCalculator) Calculate(e Employee) float64 { /* ... */ }

type EmployeeRepo struct{}
func (r *EmployeeRepo) Save(e Employee) error { /* ... */ }

type ReportGenerator struct{}
func (g *ReportGenerator) Generate(e Employee) string { /* ... */ }`,
      },
      python: {
        bad: `# Класс делает слишком много
class Employee:
    def calculate_pay(self): ...
    def save_to_database(self): ...
    def generate_report(self): ...`,
        good: `# Каждый класс — одна ответственность
class Employee: ...

class PayCalculator:
    def calculate(self, e: Employee): ...

class EmployeeRepository:
    def save(self, e: Employee): ...

class ReportGenerator:
    def generate(self, e: Employee): ...`,
      },
    },
    principle: 'S',
  },
  {
    text: 'Класс UserService содержит методы: createUser(), sendEmail(), generateReport(). Какой принцип нарушен?',
    options: [
      'Dependency Inversion Principle',
      'Open/Closed Principle',
      'Single Responsibility Principle',
      'Liskov Substitution Principle',
    ],
    correctIndex: 2,
    explanation:
      'Класс берёт на себя три обязанности: управление пользователями, отправку писем и генерацию отчётов. Это нарушение SRP — каждая из этих задач должна быть в отдельном классе.',
    codeExamples: {
      ts: {
        bad: `class UserService {
  createUser(data: UserData) { /* ... */ }
  sendEmail(to: string, body: string) { /* ... */ }
  generateReport(userId: string) { /* ... */ }
}`,
        good: `class UserService {
  createUser(data: UserData) { /* ... */ }
}
class EmailService {
  send(to: string, body: string) { /* ... */ }
}
class ReportService {
  generate(userId: string) { /* ... */ }
}`,
      },
      go: {
        bad: `type UserService struct{}

func (s *UserService) CreateUser(data UserData) error { /* ... */ }
func (s *UserService) SendEmail(to, body string) error { /* ... */ }
func (s *UserService) GenerateReport(userID string) string { /* ... */ }`,
        good: `type UserService struct{}
func (s *UserService) CreateUser(data UserData) error { /* ... */ }

type EmailService struct{}
func (s *EmailService) Send(to, body string) error { /* ... */ }

type ReportService struct{}
func (s *ReportService) Generate(userID string) string { /* ... */ }`,
      },
      python: {
        bad: `class UserService:
    def create_user(self, data: UserData): ...
    def send_email(self, to: str, body: str): ...
    def generate_report(self, user_id: str): ...`,
        good: `class UserService:
    def create_user(self, data: UserData): ...

class EmailService:
    def send(self, to: str, body: str): ...

class ReportService:
    def generate(self, user_id: str): ...`,
      },
    },
    principle: 'S',
  },
  {
    text: 'Принцип Open/Closed гласит, что программные сущности должны быть:',
    options: [
      'Открыты для модификации, закрыты для наследования',
      'Открыты для расширения, закрыты для модификации',
      'Закрыты для расширения, открыты для модификации',
      'Открыты и для расширения, и для модификации',
    ],
    correctIndex: 1,
    explanation:
      'Open/Closed Principle (OCP) — классы должны быть открыты для расширения (можно добавить новое поведение), но закрыты для модификации (не нужно менять существующий код).',
    codeExamples: {
      ts: {
        bad: `// Добавление нового типа требует изменения класса
class AreaCalculator {
  calculate(shape: Shape) {
    if (shape.type === 'circle') return Math.PI * shape.r ** 2;
    if (shape.type === 'rect') return shape.w * shape.h;
    // каждый новый тип — изменение здесь
  }
}`,
        good: `// Новый тип — новый класс, старый код не трогаем
interface Shape {
  area(): number;
}
class Circle implements Shape {
  constructor(private r: number) {}
  area() { return Math.PI * this.r ** 2; }
}
class Rect implements Shape {
  constructor(private w: number, private h: number) {}
  area() { return this.w * this.h; }
}`,
      },
      go: {
        bad: `// Добавление нового типа требует изменения функции
func CalculateArea(shape Shape) float64 {
    switch shape.Type {
    case "circle":
        return math.Pi * shape.R * shape.R
    case "rect":
        return shape.W * shape.H
    // каждый новый тип — изменение здесь
    }
    return 0
}`,
        good: `// Новый тип — новая структура с методом
type Shape interface {
    Area() float64
}
type Circle struct{ R float64 }
func (c Circle) Area() float64 {
    return math.Pi * c.R * c.R
}
type Rect struct{ W, H float64 }
func (r Rect) Area() float64 {
    return r.W * r.H
}`,
      },
      python: {
        bad: `# Добавление нового типа требует изменения класса
class AreaCalculator:
    def calculate(self, shape):
        if shape.type == "circle":
            return math.pi * shape.r ** 2
        if shape.type == "rect":
            return shape.w * shape.h
        # каждый новый тип — изменение здесь`,
        good: `# Новый тип — новый класс, старый код не трогаем
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, r: float): self.r = r
    def area(self) -> float: return math.pi * self.r ** 2

class Rect(Shape):
    def __init__(self, w: float, h: float): self.w, self.h = w, h
    def area(self) -> float: return self.w * self.h`,
      },
    },
    principle: 'O',
  },
  {
    text: 'Какой паттерн лучше всего демонстрирует соблюдение Open/Closed Principle?',
    options: [
      'Singleton',
      'Strategy',
      'Builder',
      'Prototype',
    ],
    correctIndex: 1,
    explanation:
      'Паттерн Strategy позволяет добавлять новые алгоритмы без изменения кода, который их использует, — идеальная реализация OCP.',
    codeExamples: {
      ts: {
        bad: `class Sorter {
  sort(data: number[], algorithm: string) {
    if (algorithm === 'bubble') { /* ... */ }
    if (algorithm === 'quick') { /* ... */ }
    // новый алгоритм = изменение Sorter
  }
}`,
        good: `interface SortStrategy {
  sort(data: number[]): number[];
}
class BubbleSort implements SortStrategy {
  sort(data: number[]) { /* ... */ }
}
class QuickSort implements SortStrategy {
  sort(data: number[]) { /* ... */ }
}
// Новая стратегия — новый класс, Sorter не меняется
class Sorter {
  constructor(private strategy: SortStrategy) {}
  sort(data: number[]) {
    return this.strategy.sort(data);
  }
}`,
      },
      go: {
        bad: `func Sort(data []int, algorithm string) {
    switch algorithm {
    case "bubble":
        // ...
    case "quick":
        // ...
    // новый алгоритм = изменение Sort
    }
}`,
        good: `type SortStrategy interface {
    Sort(data []int) []int
}
type BubbleSort struct{}
func (b BubbleSort) Sort(data []int) []int { /* ... */ }

type QuickSort struct{}
func (q QuickSort) Sort(data []int) []int { /* ... */ }

// Новая стратегия — новая структура, Sorter не меняется
type Sorter struct{ strategy SortStrategy }
func (s Sorter) Sort(data []int) []int {
    return s.strategy.Sort(data)
}`,
      },
      python: {
        bad: `class Sorter:
    def sort(self, data: list[int], algorithm: str):
        if algorithm == "bubble": ...
        if algorithm == "quick": ...
        # новый алгоритм = изменение Sorter`,
        good: `from abc import ABC, abstractmethod

class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data: list[int]) -> list[int]: ...

class BubbleSort(SortStrategy):
    def sort(self, data): ...

class QuickSort(SortStrategy):
    def sort(self, data): ...

# Новая стратегия — новый класс, Sorter не меняется
class Sorter:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy
    def sort(self, data: list[int]):
        return self._strategy.sort(data)`,
      },
    },
    principle: 'O',
  },
  {
    text: 'Принцип подстановки Лисков (LSP) означает, что:',
    options: [
      'Базовый класс можно заменить любым другим классом',
      'Подклассы должны быть взаимозаменяемы с базовым классом без нарушения корректности программы',
      'Интерфейсы можно заменять абстрактными классами',
      'Любой объект может быть заменён на null',
    ],
    correctIndex: 1,
    explanation:
      'LSP — объекты подклассов должны вести себя так, чтобы их можно было подставить вместо объектов базового класса без нарушения работы программы.',
    codeExamples: {
      ts: {
        bad: `class Bird {
  fly() { console.log('Лечу!'); }
}
class Penguin extends Bird {
  fly() {
    throw new Error('Пингвины не летают!');
    // Код, ожидающий Bird, сломается
  }
}`,
        good: `class Bird {
  move() { /* ... */ }
}
class FlyingBird extends Bird {
  fly() { console.log('Лечу!'); }
}
class Penguin extends Bird {
  swim() { console.log('Плыву!'); }
}
// Penguin корректно заменяет Bird`,
      },
      go: {
        bad: `type Bird interface {
    Fly()
}
type Sparrow struct{}
func (s Sparrow) Fly() { fmt.Println("Лечу!") }

type Penguin struct{}
func (p Penguin) Fly() {
    panic("Пингвины не летают!")
    // Код, ожидающий Bird, сломается
}`,
        good: `type Bird interface {
    Move()
}
type Flyer interface {
    Fly()
}
type Sparrow struct{}
func (s Sparrow) Move() { s.Fly() }
func (s Sparrow) Fly()  { fmt.Println("Лечу!") }

type Penguin struct{}
func (p Penguin) Move() { p.Swim() }
func (p Penguin) Swim() { fmt.Println("Плыву!") }
// Penguin корректно заменяет Bird`,
      },
      python: {
        bad: `class Bird:
    def fly(self):
        print("Лечу!")

class Penguin(Bird):
    def fly(self):
        raise NotImplementedError("Пингвины не летают!")
        # Код, ожидающий Bird, сломается`,
        good: `class Bird:
    def move(self): ...

class FlyingBird(Bird):
    def move(self): self.fly()
    def fly(self): print("Лечу!")

class Penguin(Bird):
    def move(self): self.swim()
    def swim(self): print("Плыву!")
# Penguin корректно заменяет Bird`,
      },
    },
    principle: 'L',
  },
  {
    text: 'Класс Square наследует Rectangle и переопределяет setWidth так, что он также меняет height. Какой принцип нарушен?',
    options: [
      'Single Responsibility Principle',
      'Interface Segregation Principle',
      'Liskov Substitution Principle',
      'Dependency Inversion Principle',
    ],
    correctIndex: 2,
    explanation:
      'Классический пример нарушения LSP: квадрат изменяет поведение прямоугольника, и код, ожидающий Rectangle, ломается при получении Square.',
    codeExamples: {
      ts: {
        bad: `class Rectangle {
  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
}
class Square extends Rectangle {
  setWidth(w: number) {
    this.width = w;
    this.height = w; // неожиданный побочный эффект!
  }
}
// rect.setWidth(5); rect.setHeight(3);
// Ожидаем area = 15, получаем 9`,
        good: `interface Shape {
  area(): number;
}
class Rectangle implements Shape {
  constructor(private w: number, private h: number) {}
  area() { return this.w * this.h; }
}
class Square implements Shape {
  constructor(private side: number) {}
  area() { return this.side ** 2; }
}`,
      },
      go: {
        bad: `type Rectangle struct{ Width, Height float64 }
func (r *Rectangle) SetWidth(w float64)  { r.Width = w }
func (r *Rectangle) SetHeight(h float64) { r.Height = h }

type Square struct{ Rectangle }
func (s *Square) SetWidth(w float64) {
    s.Width = w
    s.Height = w // неожиданный побочный эффект!
}
// rect.SetWidth(5); rect.SetHeight(3)
// Ожидаем area = 15, получаем 9`,
        good: `type Shape interface {
    Area() float64
}
type Rectangle struct{ W, H float64 }
func (r Rectangle) Area() float64 { return r.W * r.H }

type Square struct{ Side float64 }
func (s Square) Area() float64 { return s.Side * s.Side }`,
      },
      python: {
        bad: `class Rectangle:
    def set_width(self, w):  self.width = w
    def set_height(self, h): self.height = h

class Square(Rectangle):
    def set_width(self, w):
        self.width = w
        self.height = w  # неожиданный побочный эффект!
# rect.set_width(5); rect.set_height(3)
# Ожидаем area = 15, получаем 9`,
        good: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Rectangle(Shape):
    def __init__(self, w: float, h: float):
        self.w, self.h = w, h
    def area(self) -> float: return self.w * self.h

class Square(Shape):
    def __init__(self, side: float): self.side = side
    def area(self) -> float: return self.side ** 2`,
      },
    },
    principle: 'L',
  },
  {
    text: 'Interface Segregation Principle рекомендует:',
    options: [
      'Создавать один универсальный интерфейс для всех клиентов',
      'Разделять большие интерфейсы на маленькие, специализированные',
      'Использовать только абстрактные классы вместо интерфейсов',
      'Каждый класс должен реализовывать все методы интерфейса',
    ],
    correctIndex: 1,
    explanation:
      'ISP — клиенты не должны зависеть от методов, которые они не используют. Лучше иметь много маленьких интерфейсов, чем один большой.',
    codeExamples: {
      ts: {
        bad: `interface Animal {
  fly(): void;
  swim(): void;
  run(): void;
}
// Собака вынуждена реализовать fly()
class Dog implements Animal {
  fly() { throw new Error('Не умею!'); }
  swim() { /* ... */ }
  run() { /* ... */ }
}`,
        good: `interface Flyable { fly(): void; }
interface Swimmable { swim(): void; }
interface Runnable { run(): void; }

class Dog implements Swimmable, Runnable {
  swim() { /* ... */ }
  run() { /* ... */ }
}
class Duck implements Flyable, Swimmable {
  fly() { /* ... */ }
  swim() { /* ... */ }
}`,
      },
      go: {
        bad: `type Animal interface {
    Fly()
    Swim()
    Run()
}
// Собака вынуждена реализовать Fly()
type Dog struct{}
func (d Dog) Fly()  { panic("Не умею!") }
func (d Dog) Swim() { /* ... */ }
func (d Dog) Run()  { /* ... */ }`,
        good: `type Flyer interface { Fly() }
type Swimmer interface { Swim() }
type Runner interface { Run() }

type Dog struct{}
func (d Dog) Swim() { /* ... */ }
func (d Dog) Run()  { /* ... */ }

type Duck struct{}
func (d Duck) Fly()  { /* ... */ }
func (d Duck) Swim() { /* ... */ }`,
      },
      python: {
        bad: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def fly(self): ...
    @abstractmethod
    def swim(self): ...
    @abstractmethod
    def run(self): ...

# Собака вынуждена реализовать fly()
class Dog(Animal):
    def fly(self): raise NotImplementedError
    def swim(self): ...
    def run(self): ...`,
        good: `from abc import ABC, abstractmethod

class Flyable(ABC):
    @abstractmethod
    def fly(self): ...

class Swimmable(ABC):
    @abstractmethod
    def swim(self): ...

class Runnable(ABC):
    @abstractmethod
    def run(self): ...

class Dog(Swimmable, Runnable):
    def swim(self): ...
    def run(self): ...

class Duck(Flyable, Swimmable):
    def fly(self): ...
    def swim(self): ...`,
      },
    },
    principle: 'I',
  },
  {
    text: 'Интерфейс Worker содержит методы work() и eat(). Класс Robot реализует Worker, но метод eat() не имеет смысла. Какой принцип нарушен?',
    options: [
      'Open/Closed Principle',
      'Dependency Inversion Principle',
      'Single Responsibility Principle',
      'Interface Segregation Principle',
    ],
    correctIndex: 3,
    explanation:
      'Нарушен ISP: Robot вынужден реализовывать eat(), который ему не нужен. Решение — разделить Worker на Workable и Feedable.',
    codeExamples: {
      ts: {
        bad: `interface Worker {
  work(): void;
  eat(): void;
}
class Robot implements Worker {
  work() { /* сварка деталей */ }
  eat() { /* ??? роботы не едят */ }
}`,
        good: `interface Workable { work(): void; }
interface Feedable { eat(): void; }

class Human implements Workable, Feedable {
  work() { /* ... */ }
  eat() { /* обед */ }
}
class Robot implements Workable {
  work() { /* сварка деталей */ }
}`,
      },
      go: {
        bad: `type Worker interface {
    Work()
    Eat()
}
type Robot struct{}
func (r Robot) Work() { /* сварка деталей */ }
func (r Robot) Eat()  { /* ??? роботы не едят */ }`,
        good: `type Workable interface { Work() }
type Feedable interface { Eat() }

type Human struct{}
func (h Human) Work() { /* ... */ }
func (h Human) Eat()  { /* обед */ }

type Robot struct{}
func (r Robot) Work() { /* сварка деталей */ }`,
      },
      python: {
        bad: `from abc import ABC, abstractmethod

class Worker(ABC):
    @abstractmethod
    def work(self): ...
    @abstractmethod
    def eat(self): ...

class Robot(Worker):
    def work(self): ...  # сварка деталей
    def eat(self): ...   # ??? роботы не едят`,
        good: `from abc import ABC, abstractmethod

class Workable(ABC):
    @abstractmethod
    def work(self): ...

class Feedable(ABC):
    @abstractmethod
    def eat(self): ...

class Human(Workable, Feedable):
    def work(self): ...
    def eat(self): ...  # обед

class Robot(Workable):
    def work(self): ...  # сварка деталей`,
      },
    },
    principle: 'I',
  },
  {
    text: 'Dependency Inversion Principle гласит, что:',
    options: [
      'Модули верхнего уровня должны зависеть от модулей нижнего уровня',
      'Модули верхнего уровня не должны зависеть от модулей нижнего уровня — оба должны зависеть от абстракций',
      'Зависимости всегда должны внедряться через конструктор',
      'Нижние модули должны зависеть от верхних',
    ],
    correctIndex: 1,
    explanation:
      'DIP — модули высокого уровня не должны зависеть от модулей низкого уровня. Оба типа модулей должны зависеть от абстракций.',
    codeExamples: {
      ts: {
        bad: `// Высокий уровень зависит от низкого
class NotificationService {
  private sender = new SmtpEmailSender();

  notify(msg: string) {
    this.sender.sendEmail(msg);
    // Замена на SMS = переписывание класса
  }
}`,
        good: `// Оба уровня зависят от абстракции
interface MessageSender {
  send(msg: string): void;
}
class EmailSender implements MessageSender {
  send(msg: string) { /* SMTP */ }
}
class SmsSender implements MessageSender {
  send(msg: string) { /* SMS API */ }
}
class NotificationService {
  constructor(private sender: MessageSender) {}
  notify(msg: string) { this.sender.send(msg); }
}`,
      },
      go: {
        bad: `// Высокий уровень зависит от низкого
type NotificationService struct {
    sender SmtpEmailSender // конкретный тип!
}
func (n *NotificationService) Notify(msg string) {
    n.sender.SendEmail(msg)
    // Замена на SMS = переписывание структуры
}`,
        good: `// Оба уровня зависят от абстракции
type MessageSender interface {
    Send(msg string) error
}
type EmailSender struct{}
func (e EmailSender) Send(msg string) error { /* SMTP */ }

type SmsSender struct{}
func (s SmsSender) Send(msg string) error { /* SMS API */ }

type NotificationService struct {
    sender MessageSender
}
func (n *NotificationService) Notify(msg string) {
    n.sender.Send(msg)
}`,
      },
      python: {
        bad: `# Высокий уровень зависит от низкого
class NotificationService:
    def __init__(self):
        self.sender = SmtpEmailSender()  # конкретный тип!

    def notify(self, msg: str):
        self.sender.send_email(msg)
        # Замена на SMS = переписывание класса`,
        good: `# Оба уровня зависят от абстракции
from abc import ABC, abstractmethod

class MessageSender(ABC):
    @abstractmethod
    def send(self, msg: str): ...

class EmailSender(MessageSender):
    def send(self, msg: str): ...  # SMTP

class SmsSender(MessageSender):
    def send(self, msg: str): ...  # SMS API

class NotificationService:
    def __init__(self, sender: MessageSender):
        self.sender = sender
    def notify(self, msg: str):
        self.sender.send(msg)`,
      },
    },
    principle: 'D',
  },
  {
    text: 'Класс OrderService напрямую создаёт экземпляр MySQLDatabase в конструкторе. Какой принцип нарушен?',
    options: [
      'Single Responsibility Principle',
      'Liskov Substitution Principle',
      'Open/Closed Principle',
      'Dependency Inversion Principle',
    ],
    correctIndex: 3,
    explanation:
      'Нарушен DIP: OrderService (модуль высокого уровня) напрямую зависит от конкретной реализации MySQLDatabase (модуль низкого уровня) вместо абстракции (например, интерфейса Database).',
    codeExamples: {
      ts: {
        bad: `class OrderService {
  private db = new MySQLDatabase();

  getOrders() {
    return this.db.query('SELECT * FROM orders');
    // Жёсткая привязка к MySQL
  }
}`,
        good: `interface Database {
  query(sql: string): any[];
}
class MySQLDatabase implements Database {
  query(sql: string) { /* MySQL */ }
}
class PostgresDatabase implements Database {
  query(sql: string) { /* Postgres */ }
}
class OrderService {
  constructor(private db: Database) {}
  getOrders() { return this.db.query('...'); }
}`,
      },
      go: {
        bad: `type OrderService struct {
    db MySQLDatabase // конкретный тип!
}
func (s *OrderService) GetOrders() []Order {
    return s.db.Query("SELECT * FROM orders")
    // Жёсткая привязка к MySQL
}`,
        good: `type Database interface {
    Query(sql string) []Order
}
type MySQLDatabase struct{}
func (m MySQLDatabase) Query(sql string) []Order { /* MySQL */ }

type PostgresDatabase struct{}
func (p PostgresDatabase) Query(sql string) []Order { /* Postgres */ }

type OrderService struct {
    db Database
}
func (s *OrderService) GetOrders() []Order {
    return s.db.Query("...")
}`,
      },
      python: {
        bad: `class OrderService:
    def __init__(self):
        self.db = MySQLDatabase()  # конкретный тип!

    def get_orders(self):
        return self.db.query("SELECT * FROM orders")
        # Жёсткая привязка к MySQL`,
        good: `from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def query(self, sql: str) -> list: ...

class MySQLDatabase(Database):
    def query(self, sql: str) -> list: ...  # MySQL

class PostgresDatabase(Database):
    def query(self, sql: str) -> list: ...  # Postgres

class OrderService:
    def __init__(self, db: Database):
        self.db = db
    def get_orders(self) -> list:
        return self.db.query("...")`,
      },
    },
    principle: 'D',
  },
];

const allQuestionData: QuestionData[] = [
  ...baseQuestions,
  ...srpQuestions,
  ...ocpQuestions,
  ...lspQuestions,
  ...ispQuestions,
  ...dipQuestions,
];

export const questions: Question[] = allQuestionData.map((q, i) => ({
  ...q,
  id: i + 1,
}));
