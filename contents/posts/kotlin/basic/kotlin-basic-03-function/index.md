---
title: "코틀린 기초 (3) - 함수"
date: 2023-01-04 18:45:00
series: "코틀린 기초 학습"
tags:
  - Kotlin
---

> 이 포스팅의 목표는 코틀린의 대략적인 문법 체계를 익히는데 있다. 각각의 주제에 대한 깊은 내용은 나중에 기회가 된다면 별도의 포스팅으로 다뤄보겠다.

## 함수

### 함수의 정의

```kotlin
fun 함수명(인자: 타입, 인자: 타입): 반환타입 {
	return 반환값
}
```

위와 같이 `fun` 이라는 키워드를 사용하여 함수를 정의한다. 반환 타입은 메소드 시그니쳐 맨 뒤에 변수와 동일하게 `:` 을 사용하여 명시한다. 나머지는 자바와 비슷하다.

> 참고로 코틀린의 함수는 자바와 다르게 반드시 클래스 안에 있을 필요가 없다. 클래스 밖에 여러개의 함수를 선언할 수 있다.

### 단일 표현식 함수 (**Single-expression functions)**

코틀린은 단일 표현식 함수라는 기능을 통해 함수의 정의를 축약할 수 있다. 만일 함수가 하나의 표현식 (Expression)만으로 구성되어 있다면, 중괄호로 Block을 감싸는 대신 `=` 을 사용하여 함수를 정의할 수 있다.

```kotlin
fun sum(a: Int, b: Int): Int = a + b
```

단일 표현식 함수는 반환 타입을 생략하면 타입 추론을 사용할 수 있으므로 아래와 같이 축약할 수 있다.

```kotlin
fun sum(a: Int, b: Int) = a + b
```

### 가변 인자와 스프레드 연산자

```kotlin
fun sumAll(vararg n: Int): Int {
    return n.sum()
}
```

자바에서는 `타입... 이름` 형태로 메소드의 가변인자를 정의했다. 코틀린에서는 위와 같이 `vararg` 키워드를 사용하여 가변인자를 표현한다.

가변인자에 값을 전달하는 방법은 (1) 여러 값을 `,` 로 구분해서 넣어주는 방법 (2) 배열을 사용하는 방법 이렇게 자바와 마찬가지로 2가지이다. 단, 두번째 방법은 조금 차이점이 존재한다.

바로 **스프레드 연산자 (Spread Operator)**를 사용해야 한다는 점이다. 스프레드 연산자는 리스트의 요소를 단순 나열할 때 사용한다. 스프레드 연산자는 변수 앞에 `*` 을 붙여 사용한다.

```kotlin
// 1번째 방법
println(sumAll(1, 2, 3, 4, 5))

// 2번째 방법 (스프레드 연산자)
val list = intArrayOf(1, 2, 3, 4, 5)
println(sumAll(*list))
```

### 기본 매개변수 (Default Argument)

```kotlin
fun sum(
    a: Int = 0,
    b: Int = 0
) = a + b
```

자바와 다르게 코틀린은 위와 같이 언어 차원에서 기본 파라미터를 지원한다. 감동스럽다.

### 네임드 매개변수 (Named Argument)

코틀린에서는 파라미터의 이름을 명시하여, 순서와 상관없이 특정 파라미터에 값을 넣어줄 수 있다. 예를 들어 위에서 정의한 `sum()` 함수를 아래와 같이 호출할 수 있는 것이다.

```kotlin
sum(b = 5) // 5
```

이 기능을 활용하면 네임드 매개변수로 지정하지 않은 값은 선택적으로 기본값을 사용하게 되며, 빌더 패턴을 사용하지 않고도 같은 기능을 사용할 수 있게 되었다. 코틀린에서는 자바에서와 같은 장황한 빌더 클래스를 작성하지 않아도 된다. 이것도 감동스럽다.

> 코틀린에서 자바 함수를 사용할 때에는 네임드 매개변수를 사용할 수 없음에 주의하자. 자바의 함수가 바이트 코드로 컴파일 될 때 매개변수의 이름을 보존하지 않기 때문이다.

## 확장 함수와 확장 프로퍼티

### 확장 함수

코틀린에서는 특정 클래스의 메소드를 클래스 밖에서 정의할 수 있다. 이 기능을 확장 함수라고 부른다.

```kotlin
fun String.double(): String {
    return this.repeat(2)
}
```

위는 `String` 클래스에 `double()` 라는 새로운 함수를 정의한 예시이다. 아래와 같이 사용한다.

```kotlin
println("Hello".double()) // HelloHello
```

위에서 `String` 을 수신객체 타입, `this` 를 수신자라고 부른다.

확장함수는 대상 클래스의 캡슐화를 지키기 위해, private과 protected 멤버에 접근할 수 없다. 또한, 대상 클래스의 메소드와 확장 함수의 메소드 시그니처과 동일하다면 대상 클래스 멤버가 우선 호출된다.

### 확장 프로퍼티

확장 프로퍼티도 확장 함수와 비슷하다. 확장 함수를 정의하듯이 클래스 외부에서 대상 클래스의 프로퍼티를 확장할 수 있다. 이때 Custom Getter/Setter 를 활용한다. Custom Getter/Setter는 이후 포스팅에서 더 자세히 다룰 예정이니 간단히만 짚고 넘어간다.

```kotlin
val String.double: String
    get() = this.repeat(2)
```

## 중위 함수

메소드는 일반적으로 `객체.메소드(파라미터)` 형태로 호출한다. 코틀린에서는 이와 다른 중위 함수라는 메소드 호출 방법이 존재한다. 중위 함수를 사용하면 `객체 함수 파라미터` 형태로 메소드를 호출할 수 있다.

```kotlin
class Money(val value: Int) {
    infix fun add(other: Money): Money {
        return Money(this.value + other.value)
    }
}
```

중위 함수를 만들기 위해 `infix` 라는 키워드를 사용한다.

```kotlin
val money1 = Money(5000)
val money2 = Money(10000)
val money3 = money1 add money2

println(money3.value) // 15000
```

중위 함수는 위와 같이 호출한다.

```kotlin
infix fun String.add(value: String): String {
    return this + value
}

println("dev" add "Hudi") // devHudi
```

위와 같이 확장 함수도 중위 함수로 선언할 수 있다.

### 중위 함수 제한 조건

- 멤버 함수 또는 확장 함수여야 한다.
- 매개변수를 단 하나만 가지고 있어야한다.
- 가변인자를 받으면 안되고, 기본값을 받을 수 없다.

## 지역 함수

```kotlin
fun foo() {
    fun bar() {
        println("Hello, world!")
    }

    bar()
}
```

코틀린은 위와 같이 함수 안에 함수를 선언하여 사용할 수 있다.

```kotlin
fun foo() {
    val a = "data"

    fun bar() {
        println(a)
    }

    bar()
}
```

코틀린은 클로저(Closure)를 지원하며, 따라서 `bar()` 메소드는 Outer Scope인 `foo()` 의 변수에 접근이 가능하다.
