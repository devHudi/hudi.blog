---
title: "[Java] 람다 표현식과 함수형 인터페이스"
date: 2022-03-04 17:00:00
tags:
  - 학습기록
  - java
---

## 학습 동기

우테코에서 JDK 에서 제공하는 여러 클래스와 메소드를 사용하다 보니 생소한 인터페이스를 자주 접하게 되었다. 가령 `Predicate`, `BiFunction`, `Consumer` 등등... 이런 인터페이스를 사용할 때는 자바스크립트의 화살표 함수 (Arrow Function) 와 비슷한 문법을 사용했다. **'자바도 자바스크립트처럼 함수 자체가 객체일수 있는 것인가?'** 라는 의문을 품으며 찾아보다 람다표현식과 함수형 인터페이스에 대해 알게되었다.

## 람다 표현식

최근 함수형 프로그래밍이 주목을 받으며, 자바도 JDK 8 버전부터 **익명(=무명) 함수 (Anonymous Function)** 를 표현하기 위한 람다 표현식을 지원하기 시작했다. 람다식은 아래와 같은 형태를 가지고 있다. 자바스크립트의 화살표 함수 (`() => {}`) 와 굉장히 비슷한 형태이다.

```java
(매개변수) -> { 실행 코드 }
```

무언가 이상하다. 분명 자바는 아주 엄격한 객체지향 언어인 것으로 알고 있었고, 따라서 메소드가 독립적으로 존재하는 경우는 본 적이 없었다. 자바의 메소드는 무조건 클래스의 구성 멤버여야 한다. 실제로 람다 표현식을 작성하면, 메소드가 독립적으로 생성되는 것이 아니라, 런타임 시 메소드를 하나만 가지고 있는 **익명 객체 (Anonymous Object)** 가 생성된다고 한다.

람다 표현식은 매개변수와 실행 코드에 따라서 조금씩 다른 형태를 가질 수 있다.

### 기본 형태

```java
(int x, int y) -> { return x + y; }
```

기본 형태는 위와 같이 괄호 (`()`) 안에는 타입과 매개변수를 나열하고 화살표 모양을 작성한 다음 (`->`) 중괄호 (`{}`) 안에 실행될 코드를 작성한다.

### 타입 생략

보통의 경우 대입되는 시점에서 매개변수의 타입을 추론할 수 있으므로, 아래와 같이 타입을 생략해서 사용한다.

```java
(x, y) -> { return x + y; }
```

### 매개변수가 없을 경우

매개변수가 없을경우 반드시 아래와 같이 빈 괄호 (`()`) 를 사용해야한다.

```java
() -> { System.out.println("Hello World"); }
```

### 하나의 매개변수만 있는 경우

하나의 매개변수만 있는 경우에는 아래와 같이 괄호를 생략하여 작성할 수 있다.

```java
x -> { System.out.println(x); }
```

### 한줄의 실행 코드만 있는 경우

실행 코드가 한 줄만 있는 경우 중괄호를 생략하여 작성할 수 있다.

```java
() -> System.out.println("Hello World")
```

### 실행 코드에 반환문만 있는 경우

실행 코드에 반환문 하나만 존재하는 경우 중괄호와 `return` 키워드를 생략할 수 있다.

```java
(x, y) -> x + y
```

## 함수형 인터페이스

함수형 인터페이스는 한개의 추상 메소드가 정의된 인터페이스를 의미한다. 아래의 코드를 살펴보자.

```java
public interface FiInterface {
    public void run();
}
```

`FiInterface` 는 `run` 이라는 메소드 하나만 정의되어 있다. 이 인터페이스를 사용한다면 아래와 같이 코드를 작성할 수 있을 것 이다.

```java
class SomeClass {
    public void someMethod(FiInterface fi) {
        fi.run();
    }
}
```

`SomeClass` 의 `someMethod` 는 `FiInterface` 타입의 `fi` 변수를 받아온다. 위 클래스를 사용하기 위해 아래처럼 `FiInterface` 를 구현한 클래스를 새로 정의하고, 그 클래스의 인스턴스를 넣어줄 수 있겠다.

```java
// FiInterface 의 구현체
class OtherClass implements FiInterface {
    @Override
    public void run() {
        System.out.println("실행되었음");
    }
}

// 사용하는 부분
SomeClass some = new SomeClass();
some.someMethod(new OtherClass());
```

하지만, 이는 함수형 인터페이스를 제대로 사용하지 않는 코드이다. 아래와 같이 람다식을 이용해보자.

```java
FiInterface fi = () -> {
    System.out.println("실행되었음");
};

SomeClass some = new SomeClass();
some.someMethod(fi);
```

새로운 클래스를 정의하지 않고, 람다식을 통해 메소드만 정의한 다음 `SomeClass` 의 매개변수로 전달할 수 있다. 이때, `FiInterface` 와 같이 람다표현식이 대입될 타입을 **타겟 타입 (Target Type)** 이라고 한다.

위 코드는 아래와 같이 더 축약되어 사용할 수 있을 것 이다.

```java
SomeClass some = new SomeClass();
some.someMethod(() -> {
    System.out.println("실행되었음");
});
```

코드가 직접 클래스를 직접 작성하는 것과 비교하여 굉장히 간략화 되었고, 가독성이 증가되었다. 이것이 람다표현식과 함수형 인터페이스를 사용하는 이유이다.

## @FunctionalInterface 어노테이션

두개 이상의 추상 메소드가 선언된 인터페이스는 람다식으로 구현 객체를 만들 수 없다. 즉, 함수형 인터페이스를 작성하려면 인터페이스에 하나의 추상 메소드만 정의해야한다.

그런데, 함수형 인터페이스로 사용되던 인터페이스에 누군가 실수로 추상 메소드를 하나 더 정의했다면 문제가 생길 것 이다. 이런 문제를 컴파일러가 체킹할 수 있도록 만들어주는 어노테이션이 존재하는데 그것이 바로 `@FunctionalInterface` 어노테이션이다. 인터페이스에 해당 어노테이션을 달아주면, 해당 인터페이스는 두개 이상의 추상 메소드를 가질 수 없다.

```java
@FunctionalInterface
public interface FiInterface {
    public void run();
    public void secondMethod(); // 컴파일 에러
}
```
