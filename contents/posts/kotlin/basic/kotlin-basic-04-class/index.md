---
title: "코틀린 기초 (4) - 클래스, 인터페이스"
date: 2023-01-04 18:50:00
series: "코틀린 기초 학습"
tags:
  - 학습기록
  - Kotlin
---

> 이 포스팅의 목표는 코틀린의 대략적인 문법 체계를 익히는데 있다. 각각의 주제에 대한 깊은 내용은 나중에 기회가 된다면 별도의 포스팅으로 다뤄보겠다.

## 클래스

### 클래스의 정의

```kotlin
class Member constructor(email: String, username: String) {
    val email = email
    var username = username
}
```

코틀린에서 클래스는 위와 같이 정의한다.

### 주 생성자

클래스 이름 우측의 `**constructor` 키워드를 통해 클래스의 생성자를 정의**할 수 있다. 이를 **주 생성자(Primary Constructor)** 라고 한다. 주 생성자는 파라미터가 하나도 없는 경우를 제외하고는 **반드시 존재**해야한다. 파라미터가 하나도 없는 경우, 주 생성자 정의를 생략해도 되는데 그렇다면 기본적으로 No-Args Constructor가 생성된다.

주 생성자 정의 부분의 `constructor` 키워드는 생략이 가능하다.

```kotlin
class Member(email: String, username: String) {
    val email = email
    var username = username
}
```

현재 클래스의 Body에서 `email` 과 `username` 이라는 프로퍼티를 정의하고 있는데, 코틀린은 이 부분도 축약할 수 있다. **생성자에서 바로 프로퍼티를 정의**하는 방법이다. 클래스 Body에 정의된 필드를 제거하고, 클래스 주 생성자 파라미터 앞에 `val` 혹은 `var` 을 추가하자.

```kotlin
class Member(val email: String, var username: String) {
}
```

또한 코틀린은 클래스의 Body가 비어있다면, **중괄호를 생략**할수도 있다.

```kotlin
class Member(val email: String, var username: String)
```

심지어 코틀린은 **프로퍼티에 대한 Getter/Setter를 자동으로 정의**해주므로, 별도의 메소드를 정의할 필요가 없다.

```kotlin
val member = Member("devhudi@gmail.com", "hudi")

println(member.email) // Getter 사용
member.username = "devHudi" // Setter 사용
```

자바 코드를 작성할 때 느꼈던 불필요한 장황함을 코틀린이 굉장히 많은 부분 해소해준 것을 알 수 있다.

### init 블록

코틀린의 init 블록은 생성자가 호출되는 시점에 실행된다. 파라미터의 값을 적절히 가공하거나, 값을 검증할 때 사용한다.

```kotlin
class Member(val email: String, var username: String) {
    init {
        if (username.length > 10) {
            throw IllegalArgumentException("이름은 10글자를 초과할 수 없습니다.")
        }
    }
}
```

### 부 생성자 (Secondary Constructor)

코틀린 클래스에서 생성자를 추가하고 싶다면 **부 생성자**를 사용하면 된다.

```kotlin
class Member(val email: String, var username: String) {
    init {
        if (username.length > 10) {
            throw IllegalArgumentException("이름은 10글자를 초과할 수 없습니다.")
        }
    }

    constructor(email: String) : this(email, "anonymous")
}
```

위와 같이 `constructor` 키워드를 사용하고, `this` 키워드로 주 생성자를 호출하는 방식으로 부 생성자를 정의한다.

부 생성자는 반드시 주 생성자를 호출해야하는데, 이 과정에서 **연쇄적으로 부 생성자를 호출하더라도 상관은 없다**. 또한 **아래와 같이 부 생성자도 Body**를 가질 수 있다.

```kotlin
class Member(val email: String, var username: String) {
    // ...

    constructor(email: String) : this(email, "anonymous") {
        println("부 생성자 호출!")
    }
}
```

하지만, 코틀린에는 자바와 다르게 **디폴트 매개변수**가 존재한다. 자바는 디폴트 매개변수가 존재하지 않아서, 부 생성자를 여러개 만드는 **점진적 생성자 패턴**을 사용하거나 **빌더 패턴**을 사용하여 이를 해결하였다. 하지만, 코틀린은 이것을 **디폴트 매개변수로 충분히 더 나은 방식으로 대체**가 가능하다.

### init 블록, 부 생성자의 Body 실행 순서

```kotlin
class Member(val email: String, var username: String) {
    init {
        println("init 블럭 실행!")
    }

    constructor(email: String) : this(email, "anonymous") {
        println("부 생성자1 호출!")
    }

    constructor() : this("") {
        println("부 생성자2 호출!")
    }
}
```

만약 위 클래스의 부 생성자2를 호출하면, 각각의 Body 실행 순서는 어떻게 될까?

```
init 블럭 실행!
부 생성자1 호출!
부 생성자2 호출!
```

위 출력 결과처럼, 호출 순서의 역순으로 실행된다.

### Custom Getter/Setter

위 예제에서 `Member` 의 이름이 ‘anonymous’ 인지 확인하기 위해서는 아래와 같이 `isAnonymous()` 라는 메소드를 정의하는 방법이 있을 것이다.

```kotlin
class Member(val email: String, var username: String) {
    constructor(email: String) : this(email, "anonymous")

    fun isAnonymous(): Boolean {
        return this.username == "anonymous"
    }
}
```

코틀린에서는 위 기능을 **커스텀 접근자 (Custom Getter)**를 사용하여 다른 방법으로 구현할 수 있다. 커스텀 접근자는 단순히 값을 반환하는 것이 아니라 **어떠한 연산을 수행한 그 결과값(계산된 결과)을 반환할 때 사용**한다. 

```kotlin
class Member(val email: String, var username: String) {
    constructor(email: String) : this(email, "anonymous")

    val isAnonymous: Boolean
        get() {
            return this.username == "anonymous"
        }
}
```

위와 같이 커스텀 접근자를 정의할 수 있다. 프로퍼티에 접근하는 방법은 아래와 같이 일반적인 프로퍼티에 접근하는 것과 동일하다.

```kotlin
val member = Member("devhudi@gmail.com")
member.isAnonymous
```

커스텀 접근자를 사용하여, **필드 자기 자신의 실제 값을 가공하여 반환**할수도 있다. 아래와 같이 `**field` 라는 키워드**를 사용하여 필드 자기 자신에 접근하고, `uppercase()` 메소드를 호출하여 전부 대문자로 만든뒤에 반환하는 `get()` 을 정의해주었다. 

```kotlin
class Member(val email: String, username: String) {
    val username: String = username
        get() {
            return field.uppercase()
        }
}
```

이 접근자를 직접 호출해보자.

```kotlin
val member = Member("devhudi@gmail.com", "devHudi")
println(member.username) // "DEVHUDI
```

분명 `member` 프로퍼티엔 ‘devHudi’ 라는 값이 저장되어 있지만, 접근자는 대문자로 변환한뒤 반환하기 때문에 위와 같은 결과를 얻을 수 있다. 이때 `field` 키워드를 Backing Field 라고 부른다.

> Custom Setter도 동일한 방법으로 사용할 수 있지만, Setter 자체를 지양하므로 생략한다.
> 

### 클래스 상속하기

```kotlin
open class Vehicle(
    val color: String,
    val wheelCount: Int
) {
    open fun drive() {
        println("탈것 운전")
    }
}
```

위와 같이 `Vehicle` 이라는 탈 것 클래스가 존재한다. 코틀린은 기본적으로 클래스가 final이므로, `open` 키워드를 앞에 붙여 상속이 가능하도록 만들어야한다. 이 클래스를 상속받는 `Car` 클래스를 만들어보자. 

```kotlin
class Car(
    color: String
) : Vehicle(color, 4)
```

코틀린은 위와 같이 `:` 를 사용하여 클래스간 상속을 표현한다. `Car` 의 생성자로 받은 `color` 프로퍼티는 그대로 `Vehicle` 의 생성자에 넘겨주되, `wheelCount` 는 4로 고정하여 넘겨주는 모습을 확인할 수 있다.

### 메소드 오버라이드

자바에서는 `@Override` 라는 어노테이션을 사용하여 상위 클래스의 메소드를 오버라이드 함을 나타냈다. 코틀린은 이 어노테이션 대신 `override` 라는 키워드를 사용한다.

```kotlin
open class Car(
    color: String
) : Vehicle(color, 4) {
    override fun drive() {
        println("차량 운전")
    }
}
```

### 프로퍼티 오버라이드

`Car` 를 상속받는 6륜 구동 자동차 클래스인 `SixWheeler` 를 구현한다고 하자. `Car` 클래스의 `wheelCount` 는 이미 4로 고정되어 있으므로, 프로퍼티를 오버라이드 해야한다. 일단 최상위 클래스인 `Vehicle` 의 `wheelCount` 에 `open` 키워드를 추가해 오버라이드가 가능하도록 만든다.

```kotlin
open class Vehicle(
    val color: String,
    open val wheelCount: Int
// ...
```

그리고 아래와 같이 `SixWheeler` 를 구현한다.

```kotlin
class SixWheeler(
    color: String
) : Car(color) {
    override val wheelCount = 6
}
```

### 중첩 클래스

자바에서 중첩 클래스를 만드는 방법은 `static` 의 유무에 따라 크게 2가지로 나뉜다. 내부 클래스에 `static` 을 붙이지 않으면, 내부 클래스에서 외부 클래스를 접근할 수 있다. 반대로 `static` 을 붙이면, 내부 클래스에서 외부 클래스를 접근할 수 없다.

코틀린에서는 반대이다. 코틀린에서는 **내부 클래스에 아무 키워드도 사용하지 않으면, 기본적으로 Static 내부 클래스**로 정의된다. 

```kotlin
class Outer {
    val outer: String = "Outer"

    class Inner {
        fun print() {
            println(outer) // Unresolved reference: hello
        }
    }
}
```

자바의 **Non-Static 내부 클래스로 사용하기 위해서는 `inner` 키워드**를 붙여야한다.

```kotlin
class Outer {
    val outer: String = "Outer"

    inner class Inner {
        fun print() {
            println(outer) // Outer
        }
    }
}
```

## 인터페이스

```kotlin
interface Drivable {
    fun ride() {
        println("탈것 올라탐")
    } // 디폴트 메소드
    
    fun move() // 추상 메소드
}
```

코틀린에서 인터페이스를 정의하는 것은 자바와 굉장히 비슷하다. 다만, 위와 같이 디폴트 메소드를 정의할 때 굳이 `default` 키워드를 붙이지 않고, 구현부를 작성해주면 된다.

클래스가 특정 인터페이스를 구현하게 만들기 위해서는, 상속과 마찬가지로 똑같이 `:` 을 사용한다. `Vehicle` 클래스를 상속 받고 `FuelRequired` 인터페이스를 구현하는 `Car` 클래스는 아래와 같이 작성한다.

```kotlin
open class Vehicle(val color: String, open val wheelCount: Int) {
// ...

interface FuelRequired {
    fun fuelUp()
}

open class Car(
    color: String
) : Vehicle(color, 4), FuelRequired {
    override fun drive() {
        println("차량 운전")
    }

    override fun fuelUp() {
        println("자동차 주유")
    }
}
```

### 인터페이스 프로퍼티

코틀린의 인터페이스는 프로퍼티를 가질 수 있다. 아래의 코드를 보자.

```kotlin
interface FuelRequired {
    val fuel: Int // 인터페이스 프로퍼티

    fun printFuel() {
        println("연료량: $fuel") // 인터페이스 프로퍼티 사용
    }
    
    fun fuelUp()
}

open class Car(
    color: String
) : Vehicle(color, 4), FuelRequired {
    override val fuel: Int
        get() = 50

    // ...
}
```

`FuelRequired` 인터페이스의 첫번째 줄을 보면, `fuel` 이라는 프로퍼티를 선언한 것을 볼 수 있다. 그리고 바로 아래에서는 디폴트 메소드에서 해당 프로퍼티를 사용하고 있다. 이 프로퍼티는 인터페이스를 구현하는 클래스에서 Custom Getter 를 통해 오버라이드 해야한다.

```kotlin
interface FuelRequired {
    val fuel: Int
        get() = 10
// ...
```

또는 위와 같이 디폴트 값을 지정해줄 수도 있다.

## Object 키워드 (싱글톤)

자바에서는 싱글톤을 구현하기 위해 큰 보일러 플레이트가 필요했다. 코틀린에서는 `object` 키워드 하나로 간단히 싱글톤을 구현할 수 있다.

```kotlin
object Singleton {
    fun say() {
        println("I am singleton")
    }
}

// ...
Singleton.say() // I am singletone
```

`object` 키워드로 선언된 싱글톤 객체는 별도의 생성없이 위와 같이 사용할 수 있다. 

## 동반 객체 (Companion Object)

자바에서는 `static` 키워드를 통해 클래스의 정적 멤버를 정의할 수 있다. 하지만 코틀린은 `static` 키워드가 없다. 그렇다면, 코틀린에서는 어떻게 클래스 정적 멤버를 정의할까?

코틀린에서는 **동반 객체 (Companion Object)**를 통해서 이를 구현할 수 있다. 동반 객체는 말 그대로 **클래스와 항상 동반하는 객체**이다. 아래는 동반 객체를 사용하여 구현한 정적 팩토리 메소드이다.

```kotlin
class Member (
    val name: String
) { 
    companion object {
        fun createAnonymous(): Member {
            return Member("anonymous")
        }
    }
}
```

동반 객체 내부에 정의된 메소드는 아래와 같이 2가지 방법으로 사용할 수 있다.

```kotlin
val member1 = Member.createAnonymous()
val member2 = Member.Companion.createAnonymous()
```

위에서 사용된 `Companion` 은 동반 객체의 기본 이름이다. 아래와 같이 **동반 객체의 이름**을 별도로 지어줄 수 있다.

```kotlin
class Member (
    val name: String
) { 
    companion object Factory {
        fun createAnonymous(): Member {
            return Member("anonymous")
        }
    }
}

// ...

val member1 = Member.Factory.createAnonymous()
```

위와 같이 동반 객체에 이름을 지어주면, 더이상 `Companion` 으로 접근할 수 없다.

자바에서 `private static final` 로 클래스 내부에 선언한 상수도 코틀린에서 동반 객체를 통해 사용할 수 있다.

```kotlin
class Member (
    val name: String
) { 
    companion object Factory {
        const val ANONYMOUS_NAME = "anonymous"
        
        fun createAnonymous(): Member {
            return Member(ANONYMOUS_NAME)
        }
    }
    
    fun printAnonymous() {
        println(ANONYMOUS_NAME)
    }
}
```

> 참고로 `const` 키워드를 사용하면, 변수에 대입되는 값이 컴파일 타임에 대입되게 된다 (사용하지 않으면, 런타임에 대입됨). `const` 키워드는 String과 원시 타입에만 사용할 수 있다.
> 

**클래스 맴버는 동반 객체 멤버에 접근할 수 있으므로**, 위와 같이 상수를 기존 자바처럼 자유롭게 활용하면 된다.

동반 객체는 함수와 프로퍼티가 클래스에 연결되어 있지만, 클래스의 인스턴스에는 연결되어있지 않다.

또한 동반 객체 또한 객체이므로 인터페이스를 구현할 수 있다.

## Data Class

코틀린은 데이터를 담고 있는 클래스를 정의하기 위한 `data` 키워드를 별도로 제공한다. `data` 키워드를 사용하여 클래스를 정의하면, `toString()` , `hashCode()` , `equals()` , `copy()` , `componentN()` 메소드를 자동으로 만들어준다. 

> `copy()` 메소드는 프로퍼티를 복사하여 새로운 인스턴스를 생성하는 즉, 깊은 복사를 할 수 있다.
> 

> `componentN()` 메소드는 코틀린의 구조분해를 위해 정의하는 메소드이다. 이는 다른 포스팅에서 더 자세히 다뤄보겠다.
> 

```kotlin
data class MemberResponse(
    val name: String,
    val email: String,
    val age: Int
)
```

이때, Data Class의 기본 생성자에는 최소 하나 이상의 매개변수가 존재해야한다. 또, 모든 기본 생성자 매개변수에는 `val` 또는 `var` 을 사용해야 한다.

따라서 코틀린은 자바처럼 보일러 플레이트를 만들거나, Lombok과 같은 코드 다이어트 라이브러리를 사용할 필요가 없다.

## Enum Class

코틀린도 열거형 클래스를 제공한다. 자바와 사용법은 매우 비슷하며, 아래와 같이 사용한다.

```kotlin
enum class Weekday(name: String) {
    MON("Monday"),
    TUE("Tuesday"),
    WED("Wednesday"),
    THU("Thursday"),
    FRI("Friday"),
    SAT("Saturday"),
    SUN("Sunday")
}
```

## 익명 클래스

단 한번만 사용되는 클래스를 만들기 위해 자바에서는 익명 클래스라는 기능 제공했다. 마찬가지로 코틀린에서도 `object` 키워드를 사용하여 익명 클래스를 만들 수 있다.

```kotlin
val person = object:Person {
    override fun talk(message: String) {
        println(message)
    }
}

person.talk("Hello, world!")
```

## Sealed Class

Sealed Class는 이 클래스의 하위 타입의 종류가 컴파일 타임에 정해진다. 즉, 런타임에는 Sealed Class를 상속받을 수 없다.

클래스를 정의할 때 `sealed` 키워드를 붙이면 된다. 클래스에 `sealed` 키워드가 붙는다면, 해당 클래스는 추상 클래스가 되어 인스턴스를 생성할 수 없게된다. 또한, Sealed Class의 하위 클래스는 같은 패키지 내에 선언되어야 한다.

```kotlin
sealed class Color(val name: String)

class Red: Color("빨강")
class Green: Color("초록")
class Blue: Color("파랑")

fun main() {
    val color: Color = Green()
    
    when (color) {
        is Red -> TODO()
        is Green -> TODO()
        is Blue -> TODO()
    }
}
```

원래라면 위 `when` 에서는 else가 존재해야한다. 하지만, Sealed Class는 컴파일 타임에 하위 타입이 제한되므로, else를 사용하지 않아도 된다.