---
title: "자바 8 표준 API의 함수형 인터페이스 (Consumer, Supplier, Function, Operator, Predicate)"
date: 2022-03-05 01:00:00
tags:
  - 학습기록
  - java
---

> 이 글은 이것이 자바다의 내용을 참고하여 작성되었다.

## 학습 동기

우테코 미션 중, 특히 Stream 을 사용하면서 매개변수에 낯선 타입을 전달 받는 메소드를 많이 마주치게 되었다. 추후 알아보니 대부분이 자바 8의 표준 API 에서 제공하는 함수형 인터페이스들이었다. 공부해보니 정말 별것이 아니었다는 것을 알게되었다. 그 내용을 정리해본다.

## 자바 8이 제공하는 함수형 인터페이스

자바 8버전부터 빈번하게 사용되는 함수형 인터페이스를 `java.util.function` 표준 API 패키지로 제공한다고 한다. 제공되는 함수형 인터페이스는 크게 5가지로 `Consumer`, `Supplier`, `Function`, `Operator`, `Predicate` 이다. 각 인터페이스는 또 여러개의 인터페이스로 나뉜다.

두개의 매개변수를 받는 인터페이스라면 `Bi` 라는 접두사, 정수 타입을 매개변수로 전달받는 인터페이스라면 `Int` 라는 접두사가 혹은 실수 타입을 반환하는 인터페이스라면 `AsDouble` 과 같은 접미사가 달려있는 등 일정한 네이밍 규칙이 존재한다. 각 인터페이스의 특징과 세부 종류를 알아보도록 하자.

## Consumer 계열

매개값은 있고, 반환값은 없다. 매개값을 전달받아 사용하고 아무것도 반환하지 않을 때 사용된다. 이를 **소비 (Consume)** 한다고 표현한다. `accept` 추상 메소드를 가지고 있다.

### 종류

| 인터페이스 이름      | 설명                               | 추상 메소드                    |
| -------------------- | ---------------------------------- | ------------------------------ |
| Consumer<T>          | 객체 T를 받아 소비한다.            | void accept(T t)               |
| BiConsumer<T, U>     | 객체 T와 U 두가지를 받아 소비한다. | void accept(T t, U u)          |
| DoubleConsumer       | double 값을 받아 소비한다.         | void accept(double value)      |
| IntConsumer          | int 값을 받아 소비한다.            | void accept(int value)         |
| LongConsumer         | long 값을 받아 소비한다.           | void accept(long value)        |
| ObjDoubleConsumer<T> | 객체 T와 double 을 받아 소비한다.  | void accept(T t, double value) |
| ObjIntConsumer<T>    | 객체 T와 int 를 받아 소비한다.     | void accept(T t, int value)    |
| ObjLongConsumer<t>   | 객체 T와 long 을 받아 소비한다.    | void accept(T t, long value)   |

### 용례

대표적으로 Stream 의 `forEach` 메소드의 매개변수 타입이 `Consumer` 이다.

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
numbers.stream().forEach(number -> System.out.println(number));
// Consumer 전달됨
```

매개값으로 `number` 를 받고 람다 표현식 내부에서 사용되기만 할 뿐 아무것도 반환하지 않는 것을 확인할 수 있다.

또한 `Map` 의 `forEach` 메소드는 `BiConsumer` 타입을 매개변수로 받는다.

```java
Map<String, Integer> map = Map.of("hudi", 25, "baby", 1);
map.forEach((name, number) -> System.out.println(name + "는 " + number + "살"));
// BiConsumer 전달됨
```

위와 같이 첫번째 매개변수는 `Map` 의 key 를, 두번째 매개변수는 `Map` 의 value 를 전달받는다.

## Supplier 계열

매개값은 없고, 반환값은 있다. 실행 후 호출한 곳으로 데이터를 **공급 (Supply)** 한다. `getXXX` 추상 메소드를 가지고 있다.

### 종류

| 인터페이스 이름 | 설명                   | 추상 메소드            |
| --------------- | ---------------------- | ---------------------- |
| Supplier<T>     | T 객체를 반환한다.     | T get()                |
| BooleanSupplier | boolean 값을 반환한다. | boolean getAsBoolean() |
| DoubleSupplier  | double 값을 반환한다.  | double getAsDouble()   |
| IntSupplier     | int 값을 반환한다.     | int getAsInt()         |
| LongSupplier    | long 값을 반환한다.    | long getAsLong()       |

### 용례

Stream 의 `generate` 는 매개변수로 `Supplier` 타입을 받아 해당 `get` 메소드의 반환값으로 무한한 Stream 을 생성한다.

```java
Stream.generate(() -> "Infinite Stream!") // Supplier 전달됨
        .limit(5)
        .forEach(System.out::println);
```

## Function 계열

매개값도 있고, 리턴값도 있다. 주로 매개값을 반환값으로 매핑할 때 즉, 타입 변환이 목적일 때 사용한다. `applyXXX` 추상 메소드를 갖고 있다.

### 종류

| 인터페이스 이름          | 설명                                 | 추상 메소드                      |
| ------------------------ | ------------------------------------ | -------------------------------- |
| Function<T, R>           | 객체 T를 객체 R로 매핑한다.          | R apply(T t)                     |
| BiFunction<T, U, R>      | 객체 T와 U를 객체 R로 매핑한다.      | R apply(T t, U u)                |
| DoubleFunction<R>        | double 값을 객체 R로 매핑한다.       | R apply(double value)            |
| IntFunction<R>           | int 값을 객체 R로 매핑한다.          | R apply(int value)               |
| IntToDoubleFunction      | int 값을 double 값으로 매핑한다.     | double applyAsDouble(int value)  |
| IntToLongFunction        | int 값을 long 값으로 매핑한다.       | long applyAsLong(int value)      |
| LongToDoubleFunction     | long 값을 double 값으로 매핑한다.    | double applyAsDouble(long value) |
| LongToIntFunction        | long 값을 int 값으로 매핑한다.       | int applyAsInt(long value)       |
| ToDoubleBiFunction<T, U> | 객체 T와 U를 double 값으로 매핑한다. | double applyAsDouble(T t, U u)   |
| ToDoubleFunction<T>      | 객체 T를 double 값으로 매핑한다.     | double applyAsDouble(T t)        |
| ToIntBiFunction<T, U>    | 객체 T와 U를 int 값으로 매핑한다.    | int applyAsInt(T t, U u)         |
| ToIntFunction<T>         | 객체 T를 int 값으로 매핑한다.        | int applyAsInt(T t)              |
| ToLongBiFunction<T, U>   | 객체 T와 U를 long 값으로 매핑한다.   | long applyAsLong(T t, U u)       |
| ToLongFunction<T>        | 객체 T를 long 값으로 매핑한다.       | long applyAsLong(T t)            |

### 용례

`IntStream` 의 `mapToObj` 는 정수를 객체로 매핑하는 메소드이다. 이 메소드는 인자로 `IntFunction` 타입을 전달받는다.

```java
List<Number> numbers = IntStream.rangeClosed(0, 10)
        .mapToObj(number -> new Number(number)) // IntFunction 전달됨
        .collect(Collectors.toList());
```

## Operator 계열

Function 과 마찬가지로, 매개값도 있고, 반환값도 있다. 주로 매개값을 **연산 (Operation)** 하여 결과를 반환할 때 사용된다. `Function` 과 마찬가지로 `applyXXX` 추상 메소드를 가지고 있다.

### 종류

| 인터페이스 이름      | 설명                                         | 추상 메소드                          |
| -------------------- | -------------------------------------------- | ------------------------------------ |
| BinaryOperator<T>    | 객체 T와 T를 연산 후 객체 T를 반환한다.      | T apply(T t, T t)                    |
| UnaryOperator<T>     | 객체 T를 연산 후 T를 반환한다.               | T apply(T t)                         |
| DoubleBinaryOperator | 두개의 double 을 연산 후 double 을 반환한다. | double applyAsDouble(double, double) |
| DoubleUnaryOperator  | 한개의 double 을 연산 후 double 을 반환한다. | double applysDouble(double, double)  |
| IntBinaryOperator    | 두개의 int 를 연산 후 int 을 반환한다.       | int applyAsInt(int, int)             |
| IntUnaryOperator     | 한개의 int 를 연산 후 int 을 반환한다.       | int applyAsInt(int)                  |
| LongBinaryOperator   | 두개의 long 을 연산 후 long 을 반환한다.     | long applyAsLong(long, long)         |
| LongUnaryOperator    | 한개의 long 을 연산 후 long 을 반환한다.     | long applyAsLong(long)               |

### 용례

Stream 의 여러 오버로드된 `reduce` 메소드 중 하나는 매개변수로 `BinaryOperator` 를 전달받는다. 아래는 `BinaryOperator` 를 활용하여 컬렉션의 모든 수를 더하는 예시이다.

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
Integer sum = numbers.stream()
        .reduce((acc, cur) -> acc + cur) // BinaryOperator 전달됨
        .get();
```

## Predicate 계열

매개값은 있고, 반환 타입은 boolean 이다. 매개값을 받아 검사하고 `true` 혹은 `false` 를 반환할 때 사용된다. `test` 추상 메소드를 가지고 있다.

### 종류

| 인터페이스 이름   | 설명                                             | 추상 메소드                |
| ----------------- | ------------------------------------------------ | -------------------------- |
| Predicate<T>      | 객체 T를 조사 후 boolean 값을 반환한다.          | boolean test(T t)          |
| BiPredicate<T, U> | 객체 T와 U를 비교 조사 후 boolean 값을 반환한다. | boolean test(T t, U u)     |
| DoublePredicate   | double 값을 조사 후 boolean 값을 반환한다.       | boolean test(double value) |
| IntPredicate      | int 값을 조사 후 boolean 값을 반환한다.          | boolean test(int value)    |
| LongPredicate     | long 값을 조사 후 boolean 값을 반환한다.         | boolean test(long value)   |

### 용례

Stream 의 `allMatch` 메소드는 매개변수로 `Predicate` 타입을 전달받아, 컬렉션의 모든 요소가 주어진 조건에 모두 일치하면 `true` 를 반환한다.

```java
List<Integer> numbers = List.of(10, 20, 25, 15, 30, 35);
boolean allMatched = numbers.stream()
        .allMatch(number -> number > 5);
```

## 마치며

`Consumer`, `Function`, `Operator` 계열은 `andThen` 과 `compose` 라는 디폴트 메소드를 가지고 있다고 한다. 또한 `Predicate` 계열은 `and`, `or`, `negate` 라는 디폴트 메소드, 그리고 `isEqual` 이라는 정적 메소드를 가지고 있다고 한다. 이 부분은 아직 공부하지 않았으므로 추후 공부하게 되면 추가 포스팅을 작성하도록 한다.
