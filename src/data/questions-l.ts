import type { QuestionData } from './types';

export const lspQuestions: QuestionData[] = [
  // 1. ReadOnlyCollection наследует Collection и бросает исключение на add()
  {
    text: 'Класс ReadOnlyCollection наследует Collection и выбрасывает исключение при вызове add(). Нарушает ли это принцип LSP?',
    options: [
      'Да, потому что подкласс не может быть подставлен вместо базового класса без ошибок',
      'Нет, потому что ReadOnlyCollection — это допустимое ограничение',
      'Нет, если исключение задокументировано в базовом классе',
      'Да, но только если add() вызывается в runtime',
    ],
    correctIndex: 0,
    explanation:
      'ReadOnlyCollection нарушает LSP, так как код, работающий с Collection, ожидает, что add() работает корректно. Выброс исключения нарушает контракт базового класса — подкласс нельзя безопасно подставить вместо родителя.',
    codeExamples: {
      ts: {
        bad: `// Нарушение LSP: подкласс ломает контракт
class Collection<T> {
  protected items: T[] = [];
  add(item: T) { this.items.push(item); }
  getAll(): T[] { return this.items; }
}

class ReadOnlyCollection<T> extends Collection<T> {
  add(item: T): void {
    throw new Error("Нельзя добавлять!");
  }
}`,
        good: `// Правильно: разделяем интерфейсы
interface Readable<T> {
  getAll(): T[];
}
interface Writable<T> extends Readable<T> {
  add(item: T): void;
}

class Collection<T> implements Writable<T> {
  private items: T[] = [];
  add(item: T) { this.items.push(item); }
  getAll(): T[] { return this.items; }
}`,
      },
      go: {
        bad: `// Нарушение LSP: метод Add паникует
type Collection struct { items []string }
func (c *Collection) Add(item string) {
  c.items = append(c.items, item)
}

type ReadOnlyCollection struct { Collection }
func (r *ReadOnlyCollection) Add(item string) {
  panic("нельзя добавлять!")
}`,
        good: `// Правильно: раздельные интерфейсы
type Reader interface { GetAll() []string }
type Writer interface {
  Reader
  Add(item string)
}

type Collection struct { items []string }
func (c *Collection) Add(s string) { c.items = append(c.items, s) }
func (c *Collection) GetAll() []string { return c.items }`,
      },
      python: {
        bad: `# Нарушение LSP: подкласс бросает исключение
class Collection:
    def __init__(self):
        self._items = []
    def add(self, item):
        self._items.append(item)

class ReadOnlyCollection(Collection):
    def add(self, item):
        raise RuntimeError("Нельзя добавлять!")`,
        good: `# Правильно: разделяем через ABC
from abc import ABC, abstractmethod

class Readable(ABC):
    @abstractmethod
    def get_all(self) -> list: ...

class Writable(Readable):
    @abstractmethod
    def add(self, item) -> None: ...

class Collection(Writable):
    def __init__(self): self._items = []
    def add(self, item): self._items.append(item)
    def get_all(self): return list(self._items)`,
      },
    },
    principle: 'L',
  },

  // 2. Усиление предусловий в подклассе
  {
    text: 'Метод базового класса принимает любое число. Подкласс переопределяет метод и бросает ошибку при отрицательных значениях. Что происходит с точки зрения LSP?',
    options: [
      'Подкласс ослабляет постусловия',
      'Подкласс нарушает инварианты класса',
      'Подкласс усиливает предусловия — это нарушение LSP',
      'Это допустимо, подкласс может добавлять валидацию',
    ],
    correctIndex: 2,
    explanation:
      'Усиление предусловий в подклассе нарушает LSP. Если базовый класс принимает любое число, то подкласс тоже обязан принимать любое число. Добавление ограничений делает подкласс несовместимым с кодом, рассчитанным на базовый класс.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: подкласс усиливает предусловия
class Calculator {
  square(n: number): number {
    return n * n;
  }
}

class PositiveCalculator extends Calculator {
  square(n: number): number {
    if (n < 0) throw new Error("Только положительные!");
    return n * n;
  }
}`,
        good: `// Правильно: подкласс соблюдает контракт
class Calculator {
  square(n: number): number {
    return n * n;
  }
}

class LoggingCalculator extends Calculator {
  square(n: number): number {
    console.log(\`Вычисляем квадрат \${n}\`);
    return super.square(n);
  }
}`,
      },
      go: {
        bad: `// Нарушение: усиление предусловий
type Calculator struct{}
func (c *Calculator) Square(n float64) float64 {
  return n * n
}

type PositiveCalc struct{ Calculator }
func (p *PositiveCalc) Square(n float64) float64 {
  if n < 0 { panic("только положительные!") }
  return n * n
}`,
        good: `// Правильно: контракт соблюдён
type Squarer interface { Square(n float64) float64 }

type Calculator struct{}
func (c *Calculator) Square(n float64) float64 {
  return n * n
}

type LoggingCalc struct{ calc Calculator }
func (l *LoggingCalc) Square(n float64) float64 {
  log.Printf("Квадрат %f", n)
  return l.calc.Square(n)
}`,
      },
      python: {
        bad: `# Нарушение: подкласс усиливает предусловия
class Calculator:
    def square(self, n: float) -> float:
        return n * n

class PositiveCalculator(Calculator):
    def square(self, n: float) -> float:
        if n < 0:
            raise ValueError("Только положительные!")
        return n * n`,
        good: `# Правильно: подкласс не ограничивает вход
class Calculator:
    def square(self, n: float) -> float:
        return n * n

class LoggingCalculator(Calculator):
    def square(self, n: float) -> float:
        print(f"Вычисляем квадрат {n}")
        return super().square(n)`,
      },
    },
    principle: 'L',
  },

  // 3. Ослабление постусловий
  {
    text: 'Метод базового класса гарантирует возврат непустого объекта. Подкласс переопределяет метод и может вернуть null. Какой аспект LSP нарушен?',
    options: [
      'Нарушен инвариант класса',
      'Усилены предусловия метода',
      'Нарушено правило истории (history rule)',
      'Ослаблены постусловия — подкласс возвращает менее строгий результат',
    ],
    correctIndex: 3,
    explanation:
      'Ослабление постусловий нарушает LSP. Если базовый класс гарантирует ненулевой результат, подкласс обязан соблюдать эту гарантию. Клиентский код рассчитывает на контракт базового класса и не проверяет null.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: подкласс может вернуть null
class UserRepo {
  findById(id: string): User {
    return this.db.find(id) ?? new GuestUser();
  }
}

class CachedUserRepo extends UserRepo {
  findById(id: string): User | null {
    return this.cache.get(id) ?? null; // может вернуть null!
  }
}`,
        good: `// Правильно: подкласс соблюдает постусловие
class UserRepo {
  findById(id: string): User {
    return this.db.find(id) ?? new GuestUser();
  }
}

class CachedUserRepo extends UserRepo {
  findById(id: string): User {
    return this.cache.get(id) ?? super.findById(id);
  }
}`,
      },
      go: {
        bad: `// Нарушение: подкласс возвращает nil
type UserRepo struct{}
func (r *UserRepo) FindByID(id string) *User {
  return &User{Name: "guest"} // всегда не nil
}

type CachedRepo struct{ UserRepo }
func (c *CachedRepo) FindByID(id string) *User {
  return nil // нарушает постусловие!
}`,
        good: `// Правильно: постусловие сохранено
type UserRepo struct{}
func (r *UserRepo) FindByID(id string) *User {
  return &User{Name: "guest"}
}

type CachedRepo struct{ repo UserRepo }
func (c *CachedRepo) FindByID(id string) *User {
  if u := c.cache[id]; u != nil { return u }
  return c.repo.FindByID(id)
}`,
      },
      python: {
        bad: `# Нарушение: метод может вернуть None
class UserRepo:
    def find_by_id(self, uid: str) -> User:
        return self.db.get(uid) or GuestUser()

class CachedUserRepo(UserRepo):
    def find_by_id(self, uid: str) -> User | None:
        return self.cache.get(uid)  # может вернуть None!`,
        good: `# Правильно: постусловие соблюдено
class UserRepo:
    def find_by_id(self, uid: str) -> User:
        return self.db.get(uid) or GuestUser()

class CachedUserRepo(UserRepo):
    def find_by_id(self, uid: str) -> User:
        return self.cache.get(uid) or super().find_by_id(uid)`,
      },
    },
    principle: 'L',
  },

  // 4. Нарушение инвариантов (Stack наследует List)
  {
    text: 'Класс Stack наследует List и добавляет методы push/pop. Почему это нарушает LSP?',
    options: [
      'Потому что Stack — это не List по контракту',
      'Потому что Stack работает быстрее, чем List',
      'Потому что Stack не реализует все методы List',
      'LSP не нарушен — Stack может наследовать List',
    ],
    correctIndex: 0,
    explanation:
      'Stack нарушает инварианты List. List позволяет вставку/удаление в любую позицию, а Stack — только LIFO. Если подставить Stack вместо List, код, который вставляет элемент в середину, нарушит инвариант стека. Stack — это не подтип List.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: Stack наследует List, но ломает LIFO
class List<T> {
  protected items: T[] = [];
  insert(index: number, item: T) {
    this.items.splice(index, 0, item);
  }
  get(index: number): T { return this.items[index]; }
}

class Stack<T> extends List<T> {
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  // insert() доступен — ломает LIFO!
}`,
        good: `// Правильно: Stack — отдельный класс
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  get size(): number { return this.items.length; }
}`,
      },
      go: {
        bad: `// Нарушение: встраивание List в Stack
type List struct { items []int }
func (l *List) Insert(i int, v int) {
  // вставка по индексу
}

type Stack struct { List } // Insert доступен!
func (s *Stack) Push(v int) {
  s.items = append(s.items, v)
}
func (s *Stack) Pop() int {
  v := s.items[len(s.items)-1]
  s.items = s.items[:len(s.items)-1]
  return v
}`,
        good: `// Правильно: Stack без наследования от List
type Stack struct { items []int }

func (s *Stack) Push(v int) {
  s.items = append(s.items, v)
}
func (s *Stack) Pop() (int, bool) {
  if len(s.items) == 0 { return 0, false }
  v := s.items[len(s.items)-1]
  s.items = s.items[:len(s.items)-1]
  return v, true
}`,
      },
      python: {
        bad: `# Нарушение: Stack наследует list
class Stack(list):
    def push(self, item):
        self.append(item)
    def pop_top(self):
        return self.pop()
    # insert(), __setitem__() доступны — ломают LIFO!

s = Stack()
s.push(1)
s.insert(0, 99)  # нарушает инвариант стека`,
        good: `# Правильно: Stack инкапсулирует список
class Stack:
    def __init__(self):
        self._items: list = []
    def push(self, item):
        self._items.append(item)
    def pop(self):
        return self._items.pop()
    def peek(self):
        return self._items[-1] if self._items else None`,
      },
    },
    principle: 'L',
  },

  // 5. Электронная утка (ElectricDuck)
  {
    text: 'Класс Duck имеет метод swim(). ElectricDuck наследует Duck, но перед swim() нужно вызвать turnOn(). Какой принцип нарушен?',
    options: [
      'Single Responsibility — класс делает слишком много',
      'Open/Closed — класс закрыт для расширения',
      'Interface Segregation — слишком широкий интерфейс',
      'Liskov Substitution — подкласс требует дополнительных действий перед использованием',
    ],
    correctIndex: 3,
    explanation:
      'ElectricDuck нарушает LSP, так как усиливает предусловия: перед swim() нужно вызвать turnOn(). Код, работающий с Duck, не знает про этот шаг и вызовет swim() напрямую, что приведёт к ошибке.',
    codeExamples: {
      ts: {
        bad: `// Нарушение LSP: нужно включить утку перед swim
class Duck {
  swim() { console.log("Плыву!"); }
}

class ElectricDuck extends Duck {
  private isOn = false;
  turnOn() { this.isOn = true; }
  swim() {
    if (!this.isOn) throw new Error("Сначала включите!");
    console.log("Плыву на батарейках!");
  }
}`,
        good: `// Правильно: электронная утка управляет собой сама
class Duck {
  swim() { console.log("Плыву!"); }
}

class ElectricDuck extends Duck {
  private isOn = false;
  swim() {
    this.isOn = true; // включается автоматически
    console.log("Плыву на батарейках!");
  }
}`,
      },
      go: {
        bad: `// Нарушение LSP: swim паникует без turnOn
type Duck struct{}
func (d *Duck) Swim() { fmt.Println("Плыву!") }

type ElectricDuck struct {
  Duck
  isOn bool
}
func (e *ElectricDuck) Swim() {
  if !e.isOn { panic("сначала включите!") }
  fmt.Println("Плыву на батарейках!")
}`,
        good: `// Правильно: утка сама управляет включением
type Swimmer interface { Swim() }

type Duck struct{}
func (d *Duck) Swim() { fmt.Println("Плыву!") }

type ElectricDuck struct{ isOn bool }
func (e *ElectricDuck) Swim() {
  e.isOn = true
  fmt.Println("Плыву на батарейках!")
}`,
      },
      python: {
        bad: `# Нарушение LSP: нужно включить перед swim
class Duck:
    def swim(self):
        print("Плыву!")

class ElectricDuck(Duck):
    def __init__(self):
        self._is_on = False
    def turn_on(self): self._is_on = True
    def swim(self):
        if not self._is_on:
            raise RuntimeError("Сначала включите!")
        print("Плыву на батарейках!")`,
        good: `# Правильно: утка включается сама при swim()
class Duck:
    def swim(self):
        print("Плыву!")

class ElectricDuck(Duck):
    def __init__(self):
        self._is_on = False
    def swim(self):
        self._is_on = True
        print("Плыву на батарейках!")`,
      },
    },
    principle: 'L',
  },

  // 6. FileStream наследует Stream, но не поддерживает seek()
  {
    text: 'Класс FileStream наследует Stream, но метод seek() бросает UnsupportedOperationException. Как правильно решить эту проблему с точки зрения LSP?',
    options: [
      'Добавить проверку canSeek() перед вызовом seek()',
      'Разделить интерфейс Stream на Readable и Seekable',
      'Задокументировать, что seek() не поддерживается',
      'Вернуть -1 из seek() для обозначения неудачи',
    ],
    correctIndex: 1,
    explanation:
      'Правильное решение — разделить интерфейс. Если не все потоки поддерживают seek(), то seek() не должен быть в базовом интерфейсе Stream. Разделение на Readable и Seekable позволяет типам поддерживать только нужные операции без нарушения LSP.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: FileStream не поддерживает seek
interface Stream {
  read(bytes: number): Buffer;
  seek(pos: number): void;
  close(): void;
}

class NetworkStream implements Stream {
  read(bytes: number) { return Buffer.alloc(bytes); }
  seek(pos: number) {
    throw new Error("Seek не поддерживается!");
  }
  close() { /* ... */ }
}`,
        good: `// Правильно: разделение интерфейсов
interface Readable {
  read(bytes: number): Buffer;
  close(): void;
}
interface Seekable {
  seek(pos: number): void;
}

class NetworkStream implements Readable {
  read(bytes: number) { return Buffer.alloc(bytes); }
  close() { /* ... */ }
}
class FileStream implements Readable, Seekable {
  read(bytes: number) { return Buffer.alloc(bytes); }
  seek(pos: number) { /* перемотка */ }
  close() { /* ... */ }
}`,
      },
      go: {
        bad: `// Нарушение: Seek паникует в NetworkStream
type Stream interface {
  Read(n int) []byte
  Seek(pos int)
  Close()
}

type NetworkStream struct{}
func (n *NetworkStream) Read(b int) []byte { return nil }
func (n *NetworkStream) Seek(pos int) {
  panic("seek не поддерживается!")
}
func (n *NetworkStream) Close() {}`,
        good: `// Правильно: раздельные интерфейсы
type Reader interface {
  Read(n int) []byte
  Close()
}
type Seeker interface {
  Seek(pos int)
}

type NetworkStream struct{}
func (n *NetworkStream) Read(b int) []byte { return nil }
func (n *NetworkStream) Close() {}

type FileStream struct{}
func (f *FileStream) Read(b int) []byte { return nil }
func (f *FileStream) Seek(pos int) { /* ... */ }
func (f *FileStream) Close() {}`,
      },
      python: {
        bad: `# Нарушение: seek бросает исключение
from abc import ABC, abstractmethod

class Stream(ABC):
    @abstractmethod
    def read(self, n: int) -> bytes: ...
    @abstractmethod
    def seek(self, pos: int) -> None: ...

class NetworkStream(Stream):
    def read(self, n): return b""
    def seek(self, pos):
        raise NotImplementedError("Не поддерживается!")`,
        good: `# Правильно: разделение абстракций
from abc import ABC, abstractmethod

class Readable(ABC):
    @abstractmethod
    def read(self, n: int) -> bytes: ...

class Seekable(ABC):
    @abstractmethod
    def seek(self, pos: int) -> None: ...

class NetworkStream(Readable):
    def read(self, n): return b""

class FileStream(Readable, Seekable):
    def read(self, n): return b""
    def seek(self, pos): pass`,
      },
    },
    principle: 'L',
  },

  // 7. Квадрат-Прямоугольник через призму контрактов
  {
    text: 'Квадрат наследует Прямоугольник. При вызове setWidth() у квадрата меняется и высота. Почему это классический пример нарушения LSP?',
    options: [
      'Потому что квадрат — это математически частный случай прямоугольника',
      'Потому что нарушен контракт: setWidth() не должен менять высоту',
      'Потому что квадрат не может наследовать прямоугольник в принципе',
      'Потому что это нарушает Open/Closed Principle',
    ],
    correctIndex: 1,
    explanation:
      'Контракт прямоугольника предполагает, что setWidth() изменяет только ширину, а высота остаётся прежней. Квадрат нарушает это постусловие, так как меняет обе стороны. Код, рассчитанный на прямоугольник, получит неожиданный результат при площади.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: setWidth меняет и высоту
class Rectangle {
  constructor(protected w: number, protected h: number) {}
  setWidth(w: number) { this.w = w; }
  setHeight(h: number) { this.h = h; }
  area(): number { return this.w * this.h; }
}

class Square extends Rectangle {
  setWidth(w: number) { this.w = w; this.h = w; }
  setHeight(h: number) { this.w = h; this.h = h; }
}
// rect.setWidth(5); rect.setHeight(3);
// Ожидаем area()=15, но у квадрата area()=9`,
        good: `// Правильно: общий интерфейс Shape
interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  constructor(private w: number, private h: number) {}
  area(): number { return this.w * this.h; }
}

class Square implements Shape {
  constructor(private side: number) {}
  area(): number { return this.side * this.side; }
}`,
      },
      go: {
        bad: `// Нарушение: SetWidth меняет обе стороны
type Rectangle struct{ W, H float64 }
func (r *Rectangle) SetWidth(w float64) { r.W = w }
func (r *Rectangle) SetHeight(h float64) { r.H = h }
func (r *Rectangle) Area() float64 { return r.W * r.H }

type Square struct{ Rectangle }
func (s *Square) SetWidth(w float64) {
  s.W = w; s.H = w // нарушение контракта!
}`,
        good: `// Правильно: общий интерфейс
type Shape interface { Area() float64 }

type Rectangle struct{ W, H float64 }
func (r Rectangle) Area() float64 { return r.W * r.H }

type Square struct{ Side float64 }
func (s Square) Area() float64 { return s.Side * s.Side }`,
      },
      python: {
        bad: `# Нарушение: set_width меняет обе стороны
class Rectangle:
    def __init__(self, w, h): self.w, self.h = w, h
    def set_width(self, w): self.w = w
    def set_height(self, h): self.h = h
    def area(self): return self.w * self.h

class Square(Rectangle):
    def set_width(self, w): self.w = self.h = w
    def set_height(self, h): self.w = self.h = h`,
        good: `# Правильно: общий протокол Shape
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Rectangle(Shape):
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h

class Square(Shape):
    def __init__(self, side): self.side = side
    def area(self): return self.side ** 2`,
      },
    },
    principle: 'L',
  },

  // 8. Иммутабельный подкласс мутабельного родителя
  {
    text: 'ImmutableList наследует MutableList, но переопределяет все мутирующие методы, бросая исключения. Какое правило LSP нарушено?',
    options: [
      'Правило контравариантности аргументов',
      'Правило истории (history constraint) — подтип не должен разрешать изменения состояния, запрещённые базовым типом',
      'Правило истории (history constraint) — подтип не должен запрещать изменения состояния, разрешённые базовым типом',
      'Правило ковариантности возвращаемых типов',
    ],
    correctIndex: 2,
    explanation:
      'Правило истории (history rule) Лисков гласит: подтип должен допускать все изменения состояния, которые допускает базовый тип. ImmutableList запрещает мутации, разрешённые в MutableList, поэтому его нельзя подставить вместо MutableList.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: иммутабельный наследует мутабельный
class MutableList<T> {
  protected items: T[] = [];
  add(item: T) { this.items.push(item); }
  remove(i: number) { this.items.splice(i, 1); }
  get(i: number): T { return this.items[i]; }
}

class ImmutableList<T> extends MutableList<T> {
  add(item: T) { throw new Error("Иммутабельный!"); }
  remove(i: number) { throw new Error("Иммутабельный!"); }
}`,
        good: `// Правильно: общий read-only интерфейс
interface ReadableList<T> {
  get(i: number): T;
  readonly length: number;
}

class MutableList<T> implements ReadableList<T> {
  private items: T[] = [];
  get length() { return this.items.length; }
  get(i: number): T { return this.items[i]; }
  add(item: T) { this.items.push(item); }
}

class ImmutableList<T> implements ReadableList<T> {
  constructor(private items: readonly T[]) {}
  get length() { return this.items.length; }
  get(i: number): T { return this.items[i]; }
}`,
      },
      go: {
        bad: `// Нарушение: иммутабельный тип с паникой
type MutableList struct{ items []int }
func (m *MutableList) Add(v int) {
  m.items = append(m.items, v)
}
func (m *MutableList) Get(i int) int { return m.items[i] }

type ImmutableList struct{ MutableList }
func (im *ImmutableList) Add(v int) {
  panic("иммутабельный список!")
}`,
        good: `// Правильно: раздельные интерфейсы
type Reader interface { Get(i int) int; Len() int }
type Writer interface {
  Reader
  Add(v int)
}

type MutableList struct{ items []int }
func (m *MutableList) Add(v int) { m.items = append(m.items, v) }
func (m *MutableList) Get(i int) int { return m.items[i] }
func (m *MutableList) Len() int { return len(m.items) }

type ImmutableList struct{ items []int }
func (im *ImmutableList) Get(i int) int { return im.items[i] }
func (im *ImmutableList) Len() int { return len(im.items) }`,
      },
      python: {
        bad: `# Нарушение: иммутабельный наследует мутабельный
class MutableList:
    def __init__(self): self._items = []
    def add(self, item): self._items.append(item)
    def get(self, i): return self._items[i]

class ImmutableList(MutableList):
    def add(self, item):
        raise TypeError("Список иммутабельный!")`,
        good: `# Правильно: общий базовый read-only класс
from abc import ABC, abstractmethod

class ReadableList(ABC):
    @abstractmethod
    def get(self, i: int): ...

class MutableList(ReadableList):
    def __init__(self): self._items = []
    def get(self, i): return self._items[i]
    def add(self, item): self._items.append(item)

class ImmutableList(ReadableList):
    def __init__(self, items): self._items = tuple(items)
    def get(self, i): return self._items[i]`,
      },
    },
    principle: 'L',
  },

  // 9. Нарушение LSP через выброс неожиданного исключения
  {
    text: 'Базовый класс PaymentProcessor определяет метод process(), который бросает PaymentException. Подкласс CryptoProcessor бросает NetworkTimeoutException. Нарушает ли это LSP?',
    options: [
      'Нет, исключения — это детали реализации',
      'Нет, если NetworkTimeoutException наследует PaymentException',
      'Да, подкласс бросает исключение, не предусмотренное контрактом базового класса',
      'Да, подкласс не должен бросать исключения вообще',
    ],
    correctIndex: 2,
    explanation:
      'Если подкласс бросает исключение, не являющееся подтипом исключений базового класса, это нарушает LSP. Клиентский код перехватывает PaymentException, но не NetworkTimeoutException. Однако если NetworkTimeoutException наследует PaymentException — нарушения нет.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: неожиданное исключение
class PaymentError extends Error {}

class PaymentProcessor {
  process(amount: number): void {
    // может бросить PaymentError
  }
}

class CryptoProcessor extends PaymentProcessor {
  process(amount: number): void {
    // бросает TypeError — клиент его не ловит!
    throw new TypeError("Неверная сумма крипты");
  }
}`,
        good: `// Правильно: исключение — подтип базового
class PaymentError extends Error {}
class CryptoPaymentError extends PaymentError {}

class PaymentProcessor {
  process(amount: number): void { /* ... */ }
}

class CryptoProcessor extends PaymentProcessor {
  process(amount: number): void {
    if (amount <= 0)
      throw new CryptoPaymentError("Неверная сумма");
    // ...
  }
}`,
      },
      go: {
        bad: `// Нарушение: неожиданный тип ошибки
type PaymentError struct{ Msg string }
func (e *PaymentError) Error() string { return e.Msg }

type Processor interface {
  Process(amount float64) error // ожидаем *PaymentError
}

type CryptoProcessor struct{}
func (c *CryptoProcessor) Process(amount float64) error {
  return fmt.Errorf("таймаут сети") // не PaymentError!
}`,
        good: `// Правильно: ошибка — подтип базовой
type PaymentError struct{ Msg string }
func (e *PaymentError) Error() string { return e.Msg }

type CryptoError struct{ PaymentError }

type CryptoProcessor struct{}
func (c *CryptoProcessor) Process(amount float64) error {
  if amount <= 0 {
    return &CryptoError{PaymentError{"неверная сумма"}}
  }
  return nil
}`,
      },
      python: {
        bad: `# Нарушение: неожиданное исключение
class PaymentError(Exception): pass

class PaymentProcessor:
    def process(self, amount: float) -> None:
        ...  # может бросить PaymentError

class CryptoProcessor(PaymentProcessor):
    def process(self, amount: float) -> None:
        raise ConnectionError("Таймаут!")  # неожиданно!`,
        good: `# Правильно: исключение — подкласс базового
class PaymentError(Exception): pass
class CryptoPaymentError(PaymentError): pass

class PaymentProcessor:
    def process(self, amount: float) -> None: ...

class CryptoProcessor(PaymentProcessor):
    def process(self, amount: float) -> None:
        if amount <= 0:
            raise CryptoPaymentError("Неверная сумма")`,
      },
    },
    principle: 'L',
  },

  // 10. Правильное использование композиции вместо наследования для LSP
  {
    text: 'Какой подход лучше всего помогает избежать нарушений LSP при повторном использовании кода?',
    options: [
      'Глубокие иерархии наследования с абстрактными классами',
      'Множественное наследование с миксинами',
      'Композиция и делегирование вместо наследования',
      'Использование protected-методов в базовом классе',
    ],
    correctIndex: 2,
    explanation:
      'Композиция (has-a) вместо наследования (is-a) позволяет повторно использовать код без создания ложных подтиповых отношений. Объект содержит другой объект и делегирует ему вызовы, не обязываясь соблюдать контракт базового класса.',
    codeExamples: {
      ts: {
        bad: `// Наследование создаёт ложное "is-a"
class Engine {
  start() { console.log("Двигатель запущен"); }
  stop() { console.log("Двигатель остановлен"); }
}

class Car extends Engine {
  drive() {
    this.start(); // Car IS Engine? Нет!
    console.log("Еду");
  }
}`,
        good: `// Композиция: Car HAS Engine
class Engine {
  start() { console.log("Двигатель запущен"); }
  stop() { console.log("Двигатель остановлен"); }
}

class Car {
  constructor(private engine: Engine) {}
  drive() {
    this.engine.start();
    console.log("Еду");
  }
}`,
      },
      go: {
        bad: `// Встраивание создаёт неявное наследование
type Engine struct{}
func (e *Engine) Start() { fmt.Println("Запуск") }
func (e *Engine) Stop()  { fmt.Println("Стоп") }

type Car struct {
  Engine // Car «наследует» Engine
}
// car.Start() — Car IS Engine? Нет!`,
        good: `// Композиция: Car содержит Engine
type Engine struct{}
func (e *Engine) Start() { fmt.Println("Запуск") }
func (e *Engine) Stop()  { fmt.Println("Стоп") }

type Car struct {
  engine *Engine // приватное поле
}
func (c *Car) Drive() {
  c.engine.Start()
  fmt.Println("Еду")
}`,
      },
      python: {
        bad: `# Наследование создаёт ложную связь
class Engine:
    def start(self): print("Двигатель запущен")
    def stop(self): print("Двигатель остановлен")

class Car(Engine):  # Car IS Engine? Нет!
    def drive(self):
        self.start()
        print("Еду")`,
        good: `# Композиция: Car содержит Engine
class Engine:
    def start(self): print("Двигатель запущен")
    def stop(self): print("Двигатель остановлен")

class Car:
    def __init__(self, engine: Engine):
        self._engine = engine
    def drive(self):
        self._engine.start()
        print("Еду")`,
      },
    },
    principle: 'L',
  },

  // 11. Контракт метода save(): подкласс молча игнорирует вызов
  {
    text: 'Подкласс переопределяет метод save() базового класса, но внутри ничего не делает (пустое тело). Нарушает ли это LSP?',
    options: [
      'Нет, пустое тело — это валидная реализация',
      'Нет, если метод не возвращает значение',
      'Да, если контракт базового класса гарантирует сохранение данных',
      'Да, только если метод помечен как abstract',
    ],
    correctIndex: 2,
    explanation:
      'Если контракт базового класса гарантирует, что save() действительно сохраняет данные, то пустая реализация нарушает постусловие. Клиентский код вызовет save() и будет уверен, что данные сохранены, но это не так.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: save() ничего не делает
class Document {
  save(path: string): void {
    // сохраняет документ на диск
    fs.writeFileSync(path, this.content);
  }
}

class TemporaryDocument extends Document {
  save(path: string): void {
    // ничего не делает — молча игнорирует!
  }
}`,
        good: `// Правильно: явное разделение типов
interface Readable {
  getContent(): string;
}
interface Saveable {
  save(path: string): void;
}

class Document implements Readable, Saveable {
  getContent() { return this.content; }
  save(path: string) { fs.writeFileSync(path, this.content); }
}

class TemporaryDocument implements Readable {
  getContent() { return this.content; }
  // save() нет — нет обмана!
}`,
      },
      go: {
        bad: `// Нарушение: Save() ничего не делает
type Document struct{ Content string }
func (d *Document) Save(path string) error {
  return os.WriteFile(path, []byte(d.Content), 0644)
}

type TempDocument struct{ Document }
func (t *TempDocument) Save(path string) error {
  return nil // молча игнорирует!
}`,
        good: `// Правильно: раздельные интерфейсы
type Readable interface { GetContent() string }
type Saveable interface { Save(path string) error }

type Document struct{ Content string }
func (d *Document) GetContent() string { return d.Content }
func (d *Document) Save(p string) error {
  return os.WriteFile(p, []byte(d.Content), 0644)
}

type TempDocument struct{ Content string }
func (t *TempDocument) GetContent() string { return t.Content }`,
      },
      python: {
        bad: `# Нарушение: save() молча игнорирует вызов
class Document:
    def save(self, path: str) -> None:
        with open(path, "w") as f:
            f.write(self.content)

class TemporaryDocument(Document):
    def save(self, path: str) -> None:
        pass  # молча ничего не делает!`,
        good: `# Правильно: TemporaryDocument не обещает save
from abc import ABC, abstractmethod

class Readable(ABC):
    @abstractmethod
    def get_content(self) -> str: ...

class Saveable(Readable):
    @abstractmethod
    def save(self, path: str) -> None: ...

class Document(Saveable):
    def get_content(self): return self.content
    def save(self, path):
        with open(path, "w") as f: f.write(self.content)

class TempDocument(Readable):
    def get_content(self): return self.content`,
      },
    },
    principle: 'L',
  },

  // 12. Коллекция с ограничением размера наследует обычную коллекцию
  {
    text: 'BoundedList наследует List и ограничивает максимальное количество элементов. При превышении лимита add() бросает исключение. Это нарушение LSP?',
    options: [
      'Нет, это нормальное поведение — лимиты ожидаемы',
      'Нет, потому что базовый List тоже может бросать исключения (OutOfMemory)',
      'Да, это усиление предусловий — базовый класс не ограничивал размер',
      'Да, но только если лимит меньше 100 элементов',
    ],
    correctIndex: 2,
    explanation:
      'BoundedList усиливает предусловия метода add(): базовый List принимает элемент всегда, а BoundedList — только при незаполненности. Код, рассчитанный на List, не готов к этому исключению. Лучше создать отдельный тип с явным контрактом.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: add() бросает при превышении лимита
class MyList<T> {
  protected items: T[] = [];
  add(item: T) { this.items.push(item); }
  size(): number { return this.items.length; }
}

class BoundedList<T> extends MyList<T> {
  constructor(private maxSize: number) { super(); }
  add(item: T) {
    if (this.items.length >= this.maxSize)
      throw new Error("Лимит превышен!");
    this.items.push(item);
  }
}`,
        good: `// Правильно: BoundedList — отдельный тип
interface Addable<T> {
  add(item: T): boolean; // возвращает успех
  size(): number;
}

class MyList<T> implements Addable<T> {
  private items: T[] = [];
  add(item: T) { this.items.push(item); return true; }
  size() { return this.items.length; }
}

class BoundedList<T> implements Addable<T> {
  private items: T[] = [];
  constructor(private max: number) {}
  add(item: T) {
    if (this.items.length >= this.max) return false;
    this.items.push(item); return true;
  }
  size() { return this.items.length; }
}`,
      },
      go: {
        bad: `// Нарушение: Add паникует при превышении
type List struct{ items []int }
func (l *List) Add(v int) { l.items = append(l.items, v) }

type BoundedList struct {
  List
  maxSize int
}
func (b *BoundedList) Add(v int) {
  if len(b.items) >= b.maxSize {
    panic("лимит превышен!")
  }
  b.items = append(b.items, v)
}`,
        good: `// Правильно: контракт через интерфейс с bool
type Adder interface { Add(v int) bool }

type List struct{ items []int }
func (l *List) Add(v int) bool {
  l.items = append(l.items, v); return true
}

type BoundedList struct {
  items   []int
  maxSize int
}
func (b *BoundedList) Add(v int) bool {
  if len(b.items) >= b.maxSize { return false }
  b.items = append(b.items, v); return true
}`,
      },
      python: {
        bad: `# Нарушение: add бросает при превышении
class MyList:
    def __init__(self): self._items = []
    def add(self, item): self._items.append(item)

class BoundedList(MyList):
    def __init__(self, max_size):
        super().__init__()
        self._max = max_size
    def add(self, item):
        if len(self._items) >= self._max:
            raise OverflowError("Лимит превышен!")
        self._items.append(item)`,
        good: `# Правильно: контракт с возвратом bool
from abc import ABC, abstractmethod

class Addable(ABC):
    @abstractmethod
    def add(self, item) -> bool: ...

class MyList(Addable):
    def __init__(self): self._items = []
    def add(self, item):
        self._items.append(item); return True

class BoundedList(Addable):
    def __init__(self, max_size):
        self._items, self._max = [], max_size
    def add(self, item):
        if len(self._items) >= self._max: return False
        self._items.append(item); return True`,
      },
    },
    principle: 'L',
  },

  // 13. Ковариантность/контравариантность возвращаемых типов
  {
    text: 'Метод базового класса возвращает тип Animal. Подкласс переопределяет метод и возвращает Cat. Нарушает ли это LSP?',
    options: [
      'Да, возвращаемый тип должен быть идентичным',
      'Да, потому что клиент ожидает Animal, а не Cat',
      'Нет, ковариантность возвращаемого типа допустима — Cat является подтипом Animal',
      'Нет, но только если Cat объявлен как final',
    ],
    correctIndex: 2,
    explanation:
      'Ковариантность возвращаемых типов не нарушает LSP. Если метод базового класса возвращает Animal, подкласс может вернуть Cat (подтип Animal). Клиентский код получит Cat, но будет работать с ним как с Animal — контракт соблюдён.',
    codeExamples: {
      ts: {
        bad: `// Нарушение: возвращает несовместимый тип
class AnimalShelter {
  adopt(): Animal {
    return new Animal("Животное");
  }
}

class CatShelter extends AnimalShelter {
  adopt(): string { // несовместимый тип!
    return "Кот";
  }
}`,
        good: `// Правильно: ковариантный возвращаемый тип
class Animal { constructor(public name: string) {} }
class Cat extends Animal {
  purr() { console.log("Мурр!"); }
}

class AnimalShelter {
  adopt(): Animal { return new Animal("Животное"); }
}

class CatShelter extends AnimalShelter {
  adopt(): Cat { return new Cat("Мурзик"); } // Cat <: Animal — ОК!
}`,
      },
      go: {
        bad: `// Нарушение: возвращает несовместимый тип
type Shelter interface {
  Adopt() Animal
}

type CatShelter struct{}
func (c *CatShelter) Adopt() string { // не Animal!
  return "Кот"
}`,
        good: `// Правильно: возвращаем подтип через интерфейс
type Animal interface { Name() string }

type Cat struct{ name string }
func (c *Cat) Name() string { return c.name }
func (c *Cat) Purr() string { return "Мурр!" }

type Shelter interface { Adopt() Animal }

type CatShelter struct{}
func (c *CatShelter) Adopt() Animal {
  return &Cat{name: "Мурзик"} // Cat реализует Animal
}`,
      },
      python: {
        bad: `# Нарушение: возвращает несовместимый тип
class AnimalShelter:
    def adopt(self) -> "Animal":
        return Animal("Животное")

class CatShelter(AnimalShelter):
    def adopt(self) -> str:  # строка вместо Animal!
        return "Кот"`,
        good: `# Правильно: ковариантный возвращаемый тип
class Animal:
    def __init__(self, name: str): self.name = name

class Cat(Animal):
    def purr(self): return "Мурр!"

class AnimalShelter:
    def adopt(self) -> Animal:
        return Animal("Животное")

class CatShelter(AnimalShelter):
    def adopt(self) -> Cat:  # Cat — подтип Animal, ОК!
        return Cat("Мурзик")`,
      },
    },
    principle: 'L',
  },

  // 14. NullObject паттерн как соблюдение LSP
  {
    text: 'Паттерн NullObject создаёт подкласс, который ничего не делает, но не бросает исключений. Как он соотносится с LSP?',
    options: [
      'NullObject всегда нарушает LSP, так как ничего не делает',
      'NullObject соблюдает LSP, так как подставляется безопасно вместо базового класса',
      'NullObject не связан с LSP — это паттерн для устранения null-проверок',
      'NullObject нарушает LSP, если у базового класса есть постусловия',
    ],
    correctIndex: 1,
    explanation:
      'NullObject соблюдает LSP: он реализует все методы базового класса без ошибок и исключений. Его можно безопасно подставить вместо реального объекта. Он предоставляет нейтральное поведение, а не ломает контракт.',
    codeExamples: {
      ts: {
        bad: `// Без NullObject: проверки null повсюду
class OrderService {
  process(logger: Logger | null) {
    if (logger) logger.log("Начало");
    // бизнес-логика
    if (logger) logger.log("Конец");
  }
}`,
        good: `// NullObject соблюдает LSP
interface Logger {
  log(msg: string): void;
}

class ConsoleLogger implements Logger {
  log(msg: string) { console.log(msg); }
}

class NullLogger implements Logger {
  log(msg: string) { /* ничего — нейтральное поведение */ }
}

class OrderService {
  process(logger: Logger) {
    logger.log("Начало"); // работает с любым Logger
    logger.log("Конец");
  }
}`,
      },
      go: {
        bad: `// Без NullObject: проверки на nil
func Process(logger *Logger) {
  if logger != nil { logger.Log("Начало") }
  // бизнес-логика
  if logger != nil { logger.Log("Конец") }
}`,
        good: `// NullObject через интерфейс — соблюдает LSP
type Logger interface { Log(msg string) }

type ConsoleLogger struct{}
func (c *ConsoleLogger) Log(msg string) {
  fmt.Println(msg)
}

type NullLogger struct{}
func (n *NullLogger) Log(msg string) {} // нейтральное

func Process(logger Logger) {
  logger.Log("Начало") // работает с любым Logger
  logger.Log("Конец")
}`,
      },
      python: {
        bad: `# Без NullObject: проверки None
def process(logger=None):
    if logger: logger.log("Начало")
    # бизнес-логика
    if logger: logger.log("Конец")`,
        good: `# NullObject соблюдает LSP
from abc import ABC, abstractmethod

class Logger(ABC):
    @abstractmethod
    def log(self, msg: str) -> None: ...

class ConsoleLogger(Logger):
    def log(self, msg): print(msg)

class NullLogger(Logger):
    def log(self, msg): pass  # нейтральное поведение

def process(logger: Logger):
    logger.log("Начало")  # работает с любым Logger
    logger.log("Конец")`,
      },
    },
    principle: 'L',
  },

  // 15. Подкласс меняет побочные эффекты (логирование, события)
  {
    text: 'Базовый класс при вызове transfer() переводит деньги. Подкласс переопределяет transfer() и дополнительно отправляет email-уведомление. Нарушает ли это LSP?',
    options: [
      'Нет, дополнительное поведение не ломает контракт',
      'Да, любое изменение поведения — это нарушение LSP',
      'Зависит от того, задокументированы ли побочные эффекты в контракте',
      'Да, потому что подкласс делает больше работы',
    ],
    correctIndex: 2,
    explanation:
      'Всё зависит от контракта. Если базовый класс не гарантирует отсутствие побочных эффектов, то дополнительный email допустим. Но если контракт гласит "только перевод", то email — нарушение. Ключевое — что именно обещает контракт базового класса.',
    codeExamples: {
      ts: {
        bad: `// Потенциальное нарушение: неожиданный побочный эффект
class BankService {
  transfer(from: string, to: string, amount: number) {
    // только перевод денег
    this.db.transfer(from, to, amount);
  }
}

class NotifyingBankService extends BankService {
  transfer(from: string, to: string, amount: number) {
    super.transfer(from, to, amount);
    this.emailService.send(from, "Перевод выполнен");
    // побочный эффект — может замедлить или упасть!
  }
}`,
        good: `// Правильно: события через наблюдатель
class BankService {
  private listeners: TransferListener[] = [];
  onTransfer(listener: TransferListener) {
    this.listeners.push(listener);
  }
  transfer(from: string, to: string, amount: number) {
    this.db.transfer(from, to, amount);
    this.listeners.forEach(l => l.onTransfer(from, to, amount));
  }
}
// Уведомления добавляются снаружи, а не в подклассе`,
      },
      go: {
        bad: `// Потенциальное нарушение: побочный эффект в подтипе
type BankService struct{ db DB }
func (b *BankService) Transfer(from, to string, amt float64) {
  b.db.Transfer(from, to, amt)
}

type NotifyingBank struct {
  BankService
  email EmailService
}
func (n *NotifyingBank) Transfer(from, to string, amt float64) {
  n.BankService.Transfer(from, to, amt)
  n.email.Send(from, "Перевод выполнен") // побочный эффект!
}`,
        good: `// Правильно: хуки через функциональные опции
type TransferHook func(from, to string, amt float64)

type BankService struct {
  db    DB
  hooks []TransferHook
}
func (b *BankService) Transfer(from, to string, amt float64) {
  b.db.Transfer(from, to, amt)
  for _, h := range b.hooks { h(from, to, amt) }
}`,
      },
      python: {
        bad: `# Потенциальное нарушение: неожиданный побочный эффект
class BankService:
    def transfer(self, fr: str, to: str, amount: float):
        self.db.transfer(fr, to, amount)

class NotifyingBank(BankService):
    def transfer(self, fr: str, to: str, amount: float):
        super().transfer(fr, to, amount)
        self.email.send(fr, "Перевод выполнен")  # побочный!`,
        good: `# Правильно: паттерн Observer
class BankService:
    def __init__(self):
        self._listeners = []
    def on_transfer(self, listener):
        self._listeners.append(listener)
    def transfer(self, fr, to, amount):
        self.db.transfer(fr, to, amount)
        for l in self._listeners:
            l(fr, to, amount)`,
      },
    },
    principle: 'L',
  },

  // 16. Нарушение LSP в реальных фреймворках
  {
    text: 'В Java класс Stack наследует Vector. Почему разработчики JDK считают это ошибкой дизайна?',
    options: [
      'Потому что Vector устарел и работает медленно',
      'Потому что Stack IS-A Vector нарушает LSP: Vector позволяет доступ по индексу, что ломает LIFO-инвариант Stack',
      'Потому что Stack и Vector используют разные типы данных',
      'Потому что Stack должен наследовать ArrayList, а не Vector',
    ],
    correctIndex: 1,
    explanation:
      'Java Stack наследует Vector, что позволяет вызывать add(index, element), insertElementAt() и другие методы, нарушающие LIFO-инвариант. Это классический пример нарушения LSP в реальном фреймворке. Правильнее использовать Deque.',
    codeExamples: {
      ts: {
        bad: `// Аналог ошибки Java Stack extends Vector
class Vector<T> {
  protected data: T[] = [];
  add(item: T) { this.data.push(item); }
  insertAt(i: number, item: T) {
    this.data.splice(i, 0, item);
  }
  get(i: number): T { return this.data[i]; }
}

class Stack<T> extends Vector<T> {
  push(item: T) { this.add(item); }
  pop(): T | undefined { return this.data.pop(); }
  // insertAt() доступен — ломает LIFO!
}`,
        good: `// Правильно: Stack использует Deque-интерфейс
interface StackLike<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  readonly size: number;
}

class Stack<T> implements StackLike<T> {
  private data: T[] = [];
  push(item: T) { this.data.push(item); }
  pop() { return this.data.pop(); }
  peek() { return this.data[this.data.length - 1]; }
  get size() { return this.data.length; }
}`,
      },
      go: {
        bad: `// Аналог: Stack встраивает slice-обёртку
type Vector struct{ data []int }
func (v *Vector) Add(val int) { v.data = append(v.data, val) }
func (v *Vector) InsertAt(i, val int) {
  // вставка по индексу — ломает LIFO
}

type Stack struct{ Vector } // InsertAt доступен!
func (s *Stack) Push(v int) { s.Add(v) }
func (s *Stack) Pop() int {
  v := s.data[len(s.data)-1]
  s.data = s.data[:len(s.data)-1]
  return v
}`,
        good: `// Правильно: Stack с минимальным интерфейсом
type Stack interface {
  Push(v int)
  Pop() (int, bool)
  Peek() (int, bool)
  Size() int
}

type stack struct{ data []int }
func (s *stack) Push(v int) { s.data = append(s.data, v) }
func (s *stack) Pop() (int, bool) {
  if len(s.data) == 0 { return 0, false }
  v := s.data[len(s.data)-1]
  s.data = s.data[:len(s.data)-1]
  return v, true
}
func (s *stack) Peek() (int, bool) {
  if len(s.data) == 0 { return 0, false }
  return s.data[len(s.data)-1], true
}
func (s *stack) Size() int { return len(s.data) }`,
      },
      python: {
        bad: `# Аналог: Stack наследует list (как в Java)
class Stack(list):
    """Stack IS-A list — ошибка дизайна!"""
    def push(self, item):
        self.append(item)
    def pop_top(self):
        return self.pop()
    # insert(), __setitem__() — ломают LIFO!

s = Stack()
s.push(1); s.push(2)
s.insert(0, 99)  # нарушение LIFO`,
        good: `# Правильно: Stack — независимый класс
class Stack:
    def __init__(self):
        self._data: list = []
    def push(self, item): self._data.append(item)
    def pop(self):
        if not self._data: raise IndexError("пусто")
        return self._data.pop()
    def peek(self):
        return self._data[-1] if self._data else None
    def __len__(self): return len(self._data)`,
      },
    },
    principle: 'L',
  },

  // 17. Принцип "Design by Contract" и связь с LSP
  {
    text: 'Принцип "Design by Contract" определяет три компонента контракта метода. Какой из следующих НЕ является компонентом контракта?',
    options: [
      'Предусловия (preconditions) — что должно быть истинно перед вызовом',
      'Постусловия (postconditions) — что гарантируется после вызова',
      'Инварианты (invariants) — что всегда истинно для объекта',
      'Декораторы (decorators) — как метод оборачивается дополнительной логикой',
    ],
    correctIndex: 3,
    explanation:
      'Design by Contract (автор Бертран Мейер) включает предусловия, постусловия и инварианты. Декораторы — это паттерн проектирования, не связанный с контрактами. LSP требует: подтип не усиливает предусловия, не ослабляет постусловия и сохраняет инварианты.',
    codeExamples: {
      ts: {
        bad: `// Нарушение контракта: все три аспекта
class Account {
  // Инвариант: баланс >= 0
  // Предусловие withdraw: amount > 0
  // Постусловие: баланс уменьшился на amount
  constructor(protected balance: number) {}
  withdraw(amount: number): number {
    this.balance -= amount;
    return this.balance;
  }
}

class OverdraftAccount extends Account {
  withdraw(amount: number): number {
    this.balance -= amount * 1.1; // нарушает постусловие!
    return this.balance; // может быть < 0 — нарушает инвариант!
  }
}`,
        good: `// Правильно: контракт соблюдён
class Account {
  constructor(protected balance: number) {}
  withdraw(amount: number): number {
    if (amount <= 0) throw new Error("amount > 0");
    if (amount > this.balance) throw new Error("Недостаточно");
    this.balance -= amount;
    return this.balance;
  }
}

class SavingsAccount extends Account {
  withdraw(amount: number): number {
    // Не усиливает предусловия, соблюдает постусловие
    return super.withdraw(amount);
  }
}`,
      },
      go: {
        bad: `// Нарушение контракта
type Account struct{ Balance float64 }
// Инвариант: Balance >= 0
// Предусловие: amount > 0
// Постусловие: Balance уменьшился на amount

func (a *Account) Withdraw(amount float64) float64 {
  a.Balance -= amount
  return a.Balance
}

type OverdraftAccount struct{ Account }
func (o *OverdraftAccount) Withdraw(amount float64) float64 {
  o.Balance -= amount * 1.1 // нарушает постусловие!
  return o.Balance
}`,
        good: `// Правильно: контракт соблюдён
type Account struct{ Balance float64 }

func (a *Account) Withdraw(amount float64) (float64, error) {
  if amount <= 0 { return 0, errors.New("amount > 0") }
  if amount > a.Balance {
    return 0, errors.New("недостаточно средств")
  }
  a.Balance -= amount
  return a.Balance, nil
}

type SavingsAccount struct{ Account }
// Наследует Withdraw без изменений — контракт соблюдён`,
      },
      python: {
        bad: `# Нарушение контракта
class Account:
    # Инвариант: balance >= 0
    def __init__(self, balance: float):
        self.balance = balance
    def withdraw(self, amount: float) -> float:
        self.balance -= amount
        return self.balance

class OverdraftAccount(Account):
    def withdraw(self, amount: float) -> float:
        self.balance -= amount * 1.1  # нарушение!
        return self.balance  # может быть < 0`,
        good: `# Правильно: контракт соблюдён
class Account:
    def __init__(self, balance: float):
        assert balance >= 0
        self.balance = balance
    def withdraw(self, amount: float) -> float:
        assert amount > 0, "amount > 0"
        assert amount <= self.balance, "недостаточно"
        self.balance -= amount
        return self.balance

class SavingsAccount(Account):
    pass  # наследует withdraw — контракт соблюдён`,
      },
    },
    principle: 'L',
  },

  // 18. Тест: функция принимает базовый тип — как проверить LSP
  {
    text: 'Как на практике проверить, соблюдает ли подкласс B принцип LSP по отношению к базовому классу A?',
    options: [
      'Запустить статический анализ кода (линтер)',
      'Проверить, что все тесты базового класса A проходят при подстановке экземпляра B',
      'Убедиться, что подкласс B не добавляет новых методов',
      'Проверить, что B переопределяет все методы A',
    ],
    correctIndex: 1,
    explanation:
      'Главный практический способ проверки LSP: все тесты, написанные для базового класса A, должны проходить и для подкласса B. Если хоть один тест падает при подстановке B вместо A — LSP нарушен. Это прямое следствие определения Лисков.',
    codeExamples: {
      ts: {
        bad: `// Тест LSP: подкласс ломает тесты базового класса
class Sorter {
  sort(arr: number[]): number[] {
    return [...arr].sort((a, b) => a - b);
  }
}
class BrokenSorter extends Sorter {
  sort(arr: number[]): number[] {
    return arr; // не сортирует — тест упадёт!
  }
}

// Тест базового класса:
function testSorter(s: Sorter) {
  const result = s.sort([3, 1, 2]);
  console.assert(result[0] === 1); // FAIL для BrokenSorter!
}`,
        good: `// Правильно: подкласс проходит тесты базового класса
class Sorter {
  sort(arr: number[]): number[] {
    return [...arr].sort((a, b) => a - b);
  }
}
class QuickSorter extends Sorter {
  sort(arr: number[]): number[] {
    // своя реализация, но результат тот же
    return [...arr].sort((a, b) => a - b);
  }
}

function testSorter(s: Sorter) {
  const r = s.sort([3, 1, 2]);
  console.assert(r[0] === 1); // OK для QuickSorter!
  console.assert(r[2] === 3); // OK!
}`,
      },
      go: {
        bad: `// Тест LSP: подтип ломает тесты интерфейса
type Sorter interface { Sort([]int) []int }

type BrokenSorter struct{}
func (b *BrokenSorter) Sort(arr []int) []int {
  return arr // не сортирует!
}

func TestSorter(s Sorter) bool {
  result := s.Sort([]int{3, 1, 2})
  return result[0] == 1 // false для BrokenSorter!
}`,
        good: `// Правильно: подтип проходит те же тесты
type Sorter interface { Sort([]int) []int }

type QuickSorter struct{}
func (q *QuickSorter) Sort(arr []int) []int {
  sorted := make([]int, len(arr))
  copy(sorted, arr)
  sort.Ints(sorted)
  return sorted
}

func TestSorter(s Sorter) bool {
  result := s.Sort([]int{3, 1, 2})
  return result[0] == 1 && result[2] == 3 // true!
}`,
      },
      python: {
        bad: `# Тест LSP: подкласс не проходит тесты
class Sorter:
    def sort(self, arr: list[int]) -> list[int]:
        return sorted(arr)

class BrokenSorter(Sorter):
    def sort(self, arr: list[int]) -> list[int]:
        return arr  # не сортирует!

def test_sorter(s: Sorter):
    result = s.sort([3, 1, 2])
    assert result == [1, 2, 3]  # FAIL для BrokenSorter!`,
        good: `# Правильно: подкласс проходит все тесты базового
class Sorter:
    def sort(self, arr: list[int]) -> list[int]:
        return sorted(arr)

class ReverseThenSort(Sorter):
    def sort(self, arr: list[int]) -> list[int]:
        return sorted(arr)  # результат корректен

def test_sorter(s: Sorter):
    result = s.sort([3, 1, 2])
    assert result == [1, 2, 3]  # OK для любого подтипа!`,
      },
    },
    principle: 'L',
  },
];
