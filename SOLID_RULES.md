# SOLID_RULES.md — Code Generation Guidelines

> **Purpose:** This file is a reference to be followed whenever code is generated, reviewed, or refactored. Each rule below is written to be directly actionable — not just theory. When writing code, check it against the relevant rule ID before finalizing.
>
> Examples use Kotlin, but every rule is language-agnostic and applies equally to Java, TypeScript, Python, etc.

---

## How to use this file
1. Before generating a class/module, check which responsibility it's meant to own (S).
2. Before adding an `if/else` or `when` branch for "type" of something, check if it should be polymorphism instead (O).
3. Before extending a class, check the subclass doesn't break the parent's promises (L).
4. Before designing an interface, check it isn't forcing unrelated methods onto implementers (I).
5. Before writing `ClassA` that directly creates `ClassB` internally, check if `ClassB` should be injected instead (D).
6. Run the final code against the **Checklist** at the bottom before considering it done.

---

## S — Single Responsibility Principle

**Rule:** A class/module should have **one reason to change** — one job, owned by one class.

### DO
- Give each class one clear purpose, describable in a single sentence without using "and."
- Split classes along **axes of change** — if a database schema change and a UI change would both require editing the same class, split it.
- Name classes precisely for what they do (`InvoicePdfGenerator`, not `InvoiceManager` — "Manager" is a smell, see below).

### DON'T
- Don't let one class handle data storage + business logic + formatting/output + notifications all at once.
- Don't create "god classes" that grow indefinitely because it was "easier to just add it here."

### Violation signal
If you can't describe a class's purpose without saying "and" or "also," it likely has more than one responsibility. Class/method names ending in `Manager`, `Handler`, `Processor`, `Util`, or `Helper` are common warning signs of accumulated, unrelated responsibilities — verify the name still means one specific thing before keeping it.

### Example

```kotlin
// ❌ Violates SRP — one class does data validation, persistence, AND email notification
class UserRegistration {
    fun registerUser(user: User) {
        if (user.email.isBlank()) throw IllegalArgumentException("Email required")
        database.save(user)
        emailService.sendWelcomeEmail(user.email)
    }
}

// ✅ Each class has one reason to change
class UserValidator {
    fun validate(user: User) {
        if (user.email.isBlank()) throw IllegalArgumentException("Email required")
    }
}

class UserRepository {
    fun save(user: User) { database.save(user) }
}

class WelcomeEmailSender {
    fun send(user: User) { emailService.sendWelcomeEmail(user.email) }
}

class UserRegistrationService(
    private val validator: UserValidator,
    private val repository: UserRepository,
    private val emailSender: WelcomeEmailSender
) {
    fun registerUser(user: User) {
        validator.validate(user)
        repository.save(user)
        emailSender.send(user)
    }
}
```

---

## O — Open/Closed Principle

**Rule:** Code should be **open for extension, closed for modification** — add new behavior by adding new code, not by editing existing, tested code.

### DO
- Use interfaces/abstract classes + polymorphism so new cases are handled by adding a new subclass.
- Prefer strategy-style designs where new behavior plugs in without touching existing classes.

### DON'T
- Don't write long `when`/`if-else` chains that branch on a "type" field and will need a new branch every time a new type is added.
- Don't modify a class that's already tested/working just to bolt on a new case — that's a sign the design needs an extension point instead.

### Violation signal
Search for `when (type)` or `if (x is TypeA) ... else if (x is TypeB)` blocks that check a type/category — these need a new branch every time a new case is introduced, meaning the class is never truly "closed."

### Example

```kotlin
// ❌ Violates OCP — adding a new shape means editing this function again
fun calculateArea(shape: Shape): Double {
    return when (shape.type) {
        "circle" -> Math.PI * shape.radius * shape.radius
        "square" -> shape.side * shape.side
        else -> 0.0
    }
}

// ✅ New shapes extend Shape — calculateArea never needs to change
interface Shape {
    fun area(): Double
}

class Circle(val radius: Double) : Shape {
    override fun area() = Math.PI * radius * radius
}

class Square(val side: Double) : Shape {
    override fun area() = side * side
}

// adding Triangle later = one new class, zero changes to existing code
fun calculateArea(shape: Shape): Double = shape.area()
```

---

## L — Liskov Substitution Principle

**Rule:** A subclass must be usable **anywhere its parent class is expected**, without breaking correctness — a subclass should honor, not weaken, the parent's contract.

### DO
- Make sure an overridden method still does what callers of the parent type expect (same general behavior, doesn't throw new unexpected exceptions, doesn't silently do nothing).
- Model "is-a" relationships only when the subclass truly behaves like a specialized version of the parent — not just because it shares some fields.

### DON'T
- Don't override a method to throw `UnsupportedOperationException` or leave it empty just because the subclass "doesn't need" that behavior — that breaks substitutability.
- Don't inherit from a class purely for code reuse if the subclass doesn't honestly satisfy the parent's behavior contract (prefer composition in that case).

### Violation signal
If a subclass overrides a method and either (a) throws an exception, (b) does nothing, or (c) needs a type-check (`if (this is SpecificSubclass)`) somewhere else in the code to work correctly — that's an LSP violation.

### Example

```kotlin
// ❌ Violates LSP — Ostrich can't actually fly, but is forced to inherit fly()
open class Bird {
    open fun fly() = println("Flying")
}

class Ostrich : Bird() {
    override fun fly() {
        throw UnsupportedOperationException("Ostriches can't fly")
    }
}
// Any code that calls bird.fly() on a list of Birds will crash when it hits an Ostrich

// ✅ Split the capability out — only birds that can fly implement it
interface Bird {
    fun eat()
}

interface FlyingBird : Bird {
    fun fly()
}

class Sparrow : FlyingBird {
    override fun eat() = println("Eating")
    override fun fly() = println("Flying")
}

class Ostrich : Bird {
    override fun eat() = println("Eating")
    // no fly() to break — Ostrich was never forced to promise it
}
```

---

## I — Interface Segregation Principle

**Rule:** Don't force a class to implement methods it doesn't use — prefer several **small, focused interfaces** over one large, general-purpose one.

### DO
- Split large interfaces into smaller ones grouped by actual client needs (e.g., `Printable`, `Scannable`, `Faxable` instead of one `MultiFunctionDevice`).
- Let a class implement only the interfaces relevant to what it actually does.

### DON'T
- Don't create one large interface that tries to cover every possible capability "just in case."
- Don't implement an interface method with an empty body or a `TODO()` just to satisfy the compiler — that's a direct sign the interface is too broad for that class.

### Violation signal
An implementing class with empty method bodies, methods that just `throw NotImplementedError()`, or a method body that does nothing meaningful — this means the interface bundled together capabilities that not all implementers need.

### Example

```kotlin
// ❌ Violates ISP — a basic printer is forced to implement scan/fax it doesn't support
interface MultiFunctionDevice {
    fun print()
    fun scan()
    fun fax()
}

class BasicPrinter : MultiFunctionDevice {
    override fun print() = println("Printing")
    override fun scan() = throw UnsupportedOperationException()
    override fun fax() = throw UnsupportedOperationException()
}

// ✅ Segregated interfaces — each class implements only what it supports
interface Printer { fun print() }
interface Scanner { fun scan() }
interface Fax { fun fax() }

class BasicPrinter : Printer {
    override fun print() = println("Printing")
}

class AllInOnePrinter : Printer, Scanner, Fax {
    override fun print() = println("Printing")
    override fun scan() = println("Scanning")
    override fun fax() = println("Faxing")
}
```

---

## D — Dependency Inversion Principle

**Rule:** High-level modules (business logic) should depend on **abstractions (interfaces)**, not on low-level, concrete implementation details. Concrete classes should be **injected in**, not created inside the class that uses them.

### DO
- Define an interface for any dependency that talks to the outside world (database, network, file system, third-party SDK).
- Pass dependencies in through the constructor (constructor injection) rather than instantiating them directly inside the class.
- Depend on the interface type in function signatures/fields, not the concrete class.

### DON'T
- Don't write `private val db = FirebaseDatabase()` directly inside a business-logic class — that hardwires it to one specific implementation and makes testing/swapping it out difficult.
- Don't let high-level logic (e.g., a `ViewModel` or use-case class) know about low-level details (e.g., a specific SDK's API shape).

### Violation signal
A class that directly instantiates (`= SomeConcreteClass()`) another class it depends on, instead of receiving it via the constructor — this is the single most common DIP violation, and it's the reason unit tests become hard to write (there's no way to substitute a fake/mock).

### Example

```kotlin
// ❌ Violates DIP — UserRepository is hardwired to Firebase; can't test or swap it out
class UserRepository {
    private val db = FirebaseDatabase()   // concrete, low-level dependency created internally

    fun getUser(id: String): User = db.fetchUser(id)
}

// ✅ Depend on an abstraction — the concrete implementation is injected in
interface UserDataSource {
    fun fetchUser(id: String): User
}

class FirebaseUserDataSource : UserDataSource {
    override fun fetchUser(id: String): User = /* Firebase-specific code */ TODO()
}

class UserRepository(private val dataSource: UserDataSource) {
    fun getUser(id: String): User = dataSource.fetchUser(id)
}

// Testing becomes trivial — inject a fake instead of hitting a real database
class FakeUserDataSource : UserDataSource {
    override fun fetchUser(id: String): User = User("test-id", "Test User")
}
```

---

## Cross-Cutting Rules (apply across all five)

- **Constructor injection by default.** Any class that depends on another class/service should receive it as a constructor parameter, not create it internally. This single habit does most of the work for both S and D.
- **Depend on interfaces at the boundaries.** Anything that touches the network, database, file system, or a third-party SDK should be wrapped behind an interface your business logic depends on — never call the SDK directly from business logic.
- **Favor composition over inheritance** when in doubt. Inheritance should only be used for genuine "is-a" relationships that satisfy LSP; otherwise, compose behavior from smaller interfaces/classes.
- **Small, focused units over large, general ones** — this applies to both classes (S) and interfaces (I). If a name needs "and" or "or" to describe it, split it.
- **Don't over-engineer prematurely.** SOLID exists to make change easier — don't add abstraction layers (extra interfaces, extra indirection) for code that has no evidence of ever needing to vary. Apply these principles where change is likely (business logic, integrations, anything under active development), not uniformly to every single class regardless of purpose.

---

## Anti-Pattern Quick Reference

| Anti-pattern | Which principle it breaks | What it looks like |
|---|---|---|
| God Object | S | One class doing validation, persistence, formatting, notifications, etc. |
| Rigid/Shotgun Surgery | O | Adding one new case requires editing many existing `if/else` or `when` blocks |
| Fragile Base Class | L | A subclass overrides a method to throw/no-op because it doesn't fit the parent's contract |
| Fat Interface | I | An interface with methods that only some implementers actually need |
| Tight Coupling | D | A class directly instantiates (`= ConcreteClass()`) its own dependencies instead of receiving them |

---

## Final Checklist — Run Before Finalizing Generated Code

- [ ] **(S)** Can I describe this class's job in one sentence without "and"?
- [ ] **(O)** If a new case/type is added later, can it be handled by adding a new class, without touching this code?
- [ ] **(L)** Does every subclass fully honor what the parent class promises — no thrown exceptions or empty overrides?
- [ ] **(I)** Does every class implementing an interface actually use every method on it?
- [ ] **(D)** Are all external dependencies (DB, network, SDKs) passed in via constructor, not created inside the class?
- [ ] Are names precise (no generic `Manager`/`Helper`/`Util` dumping grounds)?
- [ ] Is this the simplest design that satisfies the above — no unnecessary abstraction added "just in case"?
