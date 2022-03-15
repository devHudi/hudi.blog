---
title: "[Java] Objects.requireNonNull 은 왜 사용할까?"
date: 2022-03-15 17:00:00
tags:
  - 학습기록
  - java
---

## 학습 동기

이펙티브 자바를 읽다보면 `null` 에 대한 체크를 위해 대부분 `Objects` 클래스의 `requireNonNull` 을 사용한다. 또한 다른 우테코 페어의 코드를 읽다보면, 가끔 `requireNonNull` 로 널 체크를 하는 코드를 발견할 수 있었다. 따라서 오늘은 `requireNonNull` 에 대해 알아보고, 왜 사용하는지도 함께 알아보려 한다.

## requireNonNull

자바7에 추가된 `Objects` 클래스에서 제공하는 **널(Null) 체크를 위한 메소드**이다. 파라미터로 입력된 값이 null 이라면 **NPE(NullPointerException)**가 발생하고, 그렇지 않다면 입력값을 그대로 반환하는 간단한 메소드이다. `requireNonNull` 은 아래와 같이 세가지로 오버로딩 되어있다.

| 리턴타입 | 메소드                                              |
| -------- | --------------------------------------------------- |
| T        | requireNonNull(T obj)                               |
| T        | requireNonNull(T obj, String message)               |
| T        | requireNonNull(T obj, Supplier<String> msgSupplier) |

첫번째 메소드는 `null` 을 전달하면 메세지가 비어있는 NPE 예외를 던진다.

```java
Objects.requireNonNull(null);
// java.lang.NullPointerException
```

두번째 메소드는 `null` 을 전달하면, 두번째 파라미터로 전달한 문자열을 메세지로 갖는 NPE 예외를 던진다.

```java
Objects.requireNonNull(null, "null은 전달될 수 없습니다!");
// java.lang.NullPointerException: null은 전달될 수 없습니다!
```

세번째 메소드는 `null` 을 전달하면, 두번째 파라미터로 전달한 Supplier 를 구현한 익명 함수의 반환값을 메세지로 갖는 NPE 예외를 던진다.

```java
Objects.requireNonNull(null, () -> "null은 전달될 수 없습니다!");
// java.lang.NullPointerException: null은 전달될 수 없습니다!
```

> Supplier 에 대한 내용은 [자바 8 표준 API의 함수형 인터페이스 (Consumer, Supplier, Function, Operator, Predicate)](/functional-interface-of-standard-api-java-8) 포스팅을 참고하자.

## requireNonNull 을 사용하는 이유

### 빠른 실패 (Fail-Fast)

null 을 참조하여 예외가 발생하나, `requireNonNull` 에 null 이 들어가나 똑같이 NPE가 발생하는 것은 마찬가지 일텐데, 그렇다면 대체 왜 `requireNonNull` 을 사용하는 것 일까?

그 이유는 바로 **빠른 실패 (Fail-Fast)** 이다. 디버깅을 쉽게 하기 위해서는 문제가 발생한 경우 즉각적으로 감지할 필요가 있다. 문제의 원인과 문제의 발생 지점이 물리적으로 멀리 떨어져 있다면 디버깅하기 힘들 것 이다. 아래 코드를 살펴보자.

```java
void method1(String text) {
    // ...
    method2(text);
}

void method2(String text) {
    // ...
    method3(text);
}

void method3(String text) {
    // ...
    System.out.println(text.toUpperCase());
}
```

`method1` 이 호출되면, 전달받은 문자열 형식의 매개변수를 아무 의심없이 `method2` 에 전달하고, `method2` 는 다시 `method3` 에 전달한다. `method3` 는 전달받은 문자열 매개변수의 특정 메소드를 실행하는데, 만약 매개변수가 아래 코드와 같이 `null` 이라면 NPE 가 발생할 것 이다.

```java
String text = null;
method1(text);

// java.lang.NullPointerException
//     at NullTest.method3(NullTest.java:18)
//     at NullTest.method2(NullTest.java:13)
//     at NullTest.method1(NullTest.java:8)
//     ...
```

이상적으로는 `method1` 에서 예외를 던지는 것 이지만, 이미 `text` 가 `method1` 의 손을 떠나 `method3` 까지 도달한뒤에야 NPE 가 발생하는 것을 콜스택을 통해 알 수 있다.

아래와 같이 `method1` 을 `requireNonNull` 을 사용하여 수정하면 조기에 이상 감지를 하여 `method1` 에서 빠르게 실패할 수 있다.

```java
void method1(String text) {
    // ...
    method2(Objects.requireNonNull(text));
}

// java.lang.NullPointerException
//     at java.base/java.util.Objects.requireNonNull(Objects.java:221)
//     at NullTest.method1(NullTest.java:8)
//     ...
```

### 명시성과 가독성

빠른 실패는 if 문으로도 충분히 구현이 가능하다. 그렇다면 왜 굳이 `requireNonNull` 을 사용하는 것 일까? 바로 가독성 때문이다. 아래 코드를 살펴보자.

#### if 문을 사용한 수동 널 체크

```java
String nullString = null;

if (nullString == null) {
    throw new NullPointerException("입력이 null 입니다!");
}
```

#### requireNonNull 을 사용한 널 체크

```java
String nullString = null;

Objects.requireNonNull(nullString, "입력이 null 입니다!");
```

requireNonNull 을 사용한 코드가 수동으로 널 체크한 코드보다 **가독성이 더 좋고, 명시적**임을 확인할 수 있다.

## 참고

- [Why should one use Objects.requireNonNull()?
  ](https://stackoverflow.com/questions/45632920/why-should-one-use-objects-requirenonnull)
