---
title: "코틀린 기초 (2) - 범위 표현식과 조건문, 반복문"
date: 2022-12-31 20:00:00
series: "코틀린 기초 학습"
tags:
  - Kotlin
---

> 이 포스팅의 목표는 코틀린의 대략적인 문법을 살펴보는데 있다. 각각의 주제에 대한 깊은 내용은 나중에 기회가 된다면 별도의 포스팅으로 다뤄보겠다.

## 범위 표현식 (Range Expression)

코틀린에서 `..` 연산자를 사용하면 특정 수의 범위를 표현할 수 있다. 이렇게 생성된 것을 범위(Range)라고 한다.

### `..`

좌항부터 우항까지의 범위를 생성한다. 이때, 범위에는 우항을 포함한다.

```kotlin
for (n in 1..10) {
    println(n)
}
// 1, 2, 3, ..., 10
```

### until

`..` 은 마지막 숫자가 범위에 포함되지만, `until` 은 포함하지 않는다.

```kotlin
for (n in 1 until 10) {
    println(n)
}
// 1, 2, 3, ..., 9
```

### step

```kotlin
for (n in 1..10 step 2) {
    println(n)
}
// 1, 3, 5, 7, 9
```

수열의 증가 폭 (혹은 감소 폭)을 `step` 을 통해 지정할 수 있다. 위 예제는 1부터 10로 범위를 제한하고, 수열이 2씩 증가하는 범위를 생성한다.

### downTo

```kotlin
for (n in 10 downTo 1) {
    println(n)
}
// 10, 9, 8, ..., 1
```

`..` 와 방향만 반대이다. 범위가 큰 숫자부터 작은 숫자로 내려간다.

```kotlin
for (n in 10 downTo 1 step 2) {
    println(n)
}
// 10, 8, 6, 4, 2
```

마찬가지로 `step` 을 사용할 수 있다.

> until, step과 downTo는 정확히는 ‘중위 함수’라는 개념이다. 더 자세한 내용은 별도의 포스팅으로 다뤄보겠다.

## Progression과 Range

위 코드는 사실 내부적으로 Range 객체를 생성한다. Range 객체의 종류로는 `IntRange` , `LongRange` , `CharRange` 가 있다.

```kotlin
for (n in IntRange(1, 10)) {
    println(n)
}
// 1, 2, 3, ..., 10

for (n in LongRange(1L, 10L)) {
    println(n)
}
// 1L, 2L, 3L, ..., 10L

for (n in CharRange('a', 'z')) {
    println(n)
}
// a, b, c, ..., z
```

그런데 이 Range들은 각각의 Progression을 상속 받는다. 엄밀하게는 Range는 `step` 이 1인 Progression이다.

```kotlin
println((1..10)::class.simpleName) // IntRange
println((1..10 step 2)::class.simpleName) // IntProgression
```

step을 사용하지 않으면 `IntRange` , 사용하면 `IntProgression` 인 것을 볼 수 있다.

## 조건문

### 코틀린의 if는 문(statement)가 아니라 식(expression)이다

이 이야기를 하기전에 **문(statement)**와 **식(expression)**에 대해서 먼저 이야기 해야할 것 같다. Statement는 코드에서 **실행될 수 있는 독립적인 코드 조각**을 의미한다. 대표적으로 자바의 **if ‘문’**이 있다. 반면, Expression은 Statement에 포함되는 개념으로, **그 자체가 평가되어 값으로 표현**될 수 있는 것을 의미한다. ‘1+1’ 은 ‘2’로 평가되므로 Expression이다.

그런데, 코틀린에서는 if가 Statement가 아니라 Expression이다. 단순한 분기 명령정도가 아니라 if ‘식’이 평가되어 특정한 값으로 표현됨을 의미한다. 마치 삼항 연산자처럼 말이다. 이때, 블럭의 값은 블럭의 마지막 식이다.

```kotlin
fun goodOrBad(score: Int): String {
    return if (score > 50) {
        "Good"
    } else {
        "Bad"
    }
}

fun main() {
    println(goodOrBad(51)) // Good
    println(goodOrBad(49)) // Bad
}
```

따라서 코틀린은 별도로 삼항 연산자를 제공하지 않는다.

### `in` 연산자와 범위 표현 (`..` 연산자)

코틀린에서는 `in` 과 범위를 표현하는 `..` 연산자를 사용하여 위 코드를 다르게 표현해볼 수 있다. `..` 연산자를 사용하면 특정 수의 범위를 표현할 수 있고, `in` 연산자를 사용하면 해당 범위에 특정 수가 포함되어있는지 검사할 수 있다.

```kotlin
println(65 in 51..100) // true
println(30 in 51..100) // false
```

위와 같이 말이다. `in` 과 `..` 연산자를 사용해 앞서 살펴본 `goodOrBad()` 함수를 아래와 같이 작성해볼 수 있다.

```kotlin
fun goodOrBad(score: Int): String {
    return if (score in 51..100) {
        "Good"
    } else {
        "Bad"
    }
}
```

### When 문

코틀린은 Switch 대신 When을 사용한다. 하지만, When은 자바의 Switch 보다 훨씬 강력한 기능을 제공한다. 자바에서 Switch의 조건으로는 상수만을 사용할 수 있지만, 코틀린에서는 When 조건에 조건식을 넣을 수 있다. 아래 예제를 살펴보자.

```kotlin
fun goodOrBad(score: Int): String {
    return when (score) {
        100 -> "Perfect" // (1)
        95, 96, 97, 98, 99 -> "Excellent" // (2)
        in 90..99 -> "Very Good" // (3)
        in 50 until 90 -> "Good" // (4)
        else -> "Bad" // (5)
    }
}

fun main() {
    println(goodOrBad(100)) // Perfect
    println(goodOrBad(97)) // Excellent
    println(goodOrBad(92)) // Very Good
    println(goodOrBad(70)) // Good
    println(goodOrBad(20)) // Bad
}
```

(1)번 코드는 같이 when에 주어진 변수와 정확히 일치하는 경우이다. (2)번 코드와 같이 `,` 를 사용하여 여러 경우에 대한 조건을 설정할수도 있다. (3), (4)번과 같이 연산자를 사용한 조건식 작성도 가능하다. `in` 뿐 아니라 `is` 등 연산자를 사용하여 조건식을 작성할 수 있다. (5)번과 같이 `else` 를 사용하여 상단의 모든 조건을 만족하지 않은 대상에 대해 처리를 별도로 할 수 있다.

when을 인자 없이도 사용할 수 있다. 아래처럼 when에 인자를 생략하고, 조건식 부분에 전체 식을 넣어주면 된다. 마치 Java에서 사용했던 Early Return 패턴과 같이 사용할 수 있다.

```kotlin
fun goodOrBad(score: Int): String {
    return when {
        score == 100 -> "Perfect"
        score in 95..99 -> "Excellent"
        score in 90..99 -> "Very Good"
        score in 50 until 89 -> "Good"
        else -> "Bad"
    }
}
```

눈치챘겠지만, when 또한 Expression 이므로 곧바로 변수에 대입하거나, return 하는 것이 가능하다.

## 반복문

### for 루프

자바에서는 ‘향상된 for문’ 이라는 것을 지원했다. Iterable이 가능한 자료구조를 통해 간단하게 반복문을 구현할 수 있는 방법이다. 이때 자바에서는 `:` 를 사용한다.

코틀린에서는 `:` 대신 `in` 을 사용하여 for-each 문을 사용한다.

```kotlin
fun main() {
    for (n in 1..10) { // 범위 표현식 사용
        println(n)
    }

    for (n in listOf(1, 3, 5, 7, 9)) { // 컬렉션 사용
        println(n)
    }
}
```

자바와 마찬가지로 Iterable 타입이라면 모두 사용할 수 있다.

### while 및 do-while

자바와 완전히 사용법이 같으므로 생략한다.
