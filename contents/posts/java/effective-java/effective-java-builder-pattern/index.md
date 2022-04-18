---
title: "생성자에 매개변수가 많다면 빌더를 고려하라"
date: 2022-02-25 10:00:00
tags:
  - 학습기록
  - 디자인패턴
  - 객체지향
  - 이펙티브자바
  - java
series: Effective Java 3/E 학습 기록
---

## 빌더 패턴 (Builder Pattern)

빌더 패턴은 선택적 매개변수가 많은 상황에서 생성자 혹은 정적 팩토리 메소드보다 더 유용하게 사용할 수 있다. 빌더 패턴을 이해하기 위해 우리는 자바로 가상의 햄버거 객체를 만들어 본다.

햄버거를 주문할 때, 사이즈는 필수로 입력해야하지만 나머지 속재료들은 주문하는 사람이 마음대로 결정할 수 있다고 하자. 여기서 필수 매개변수는 햄버거의 사이즈가 될 것이고, 여러 속재료들은 선택 매개변수가 될 것이다.

## 빌더 패턴을 사용하기 전

빌더 패턴을 사용하기 전, 많은 선택적 매개변수를 처리하기 위해 아래 두 가지 패턴이 사용되었다.

### 점층적 생성자 패턴 (Telescoping Constructor Pattern)

점층적 생성자 패턴은 이름과 같이 필수 매개변수와 함께 선택 매개변수를 0개 받는, 1개 받는, 2개받는 ... 형태로 생성자를 점차 선택 매개변수를 많이 받는 형태로 오버로딩 하는 방식이다. 즉, 선택 매개변수가 전달되는 여러 경우의 수에 대해 생성자를 여러개 정의해야한다. 이를 코드로 표현하면 아래와 같을 것 이다.

```java
public class Hamburger {
    // 필수 매개변수
    private final int size;

    // 선택 매개변수
    private final int bun;
    private final int patty;
    private final int lettuce;
    private final int tomato;

    public Hamburger(int size, int bun, int patty, int lettuce, int tomato) {
        this.size = size;
        this.bun = bun;
        this.patty = patty;
        this.lettuce = lettuce;
        this.tomato = tomato;
    }

    public Hamburger(int size, int bun, int patty, int lettuce) {
        this(size, bun, patty, lettuce, 0);
    }

    public Hamburger(int size, int bun, int patty) {
        this(size, bun, patty, 0);
    }

    public Hamburger(int size, int bun) {
        this(size, bun, 0);
    }

    public Hamburger(int size) {
        this(size, 0);
    }
}
```

위 클래스를 사용하여 햄버거를 생성하는 코드는 아래와 같을 것 이다.

```java
// 모든 재료가 있는 햄버거
Hamburger hamburger1 = new Hamburger(10, 2, 4, 6, 8);

// 양상추와 토마토가 없는 햄버거
Hamburger hamburger2 = new Hamburger(10, 2, 2);

// 번과 토마토만 있는 햄버거 (맛 없겠다)
Hamburger hamburger3 = new Hamburger(10, 2, 0, 0, 2);
```

여기서 주목해야할 부분은 `hamburger3` 이다. `hamburger3` 는 `patty` 와 `lettuce` 가 필요 없다. 하지만, 이를 생략할 방법은 `Hamburger` 클래스에 구현되어 있지 않다. 할 수 없이 사용자는 직접 `patty` 와 `lettuce` 파라미터에 `0` 을 전달해줘야 한다.

즉, 점층적 생성자 패턴은 **사용자가 설정하길 원치 않는 매개변수까지 포함되기 쉬운** 형태이다. 또한, 매개변수가 많아지면 생성자가 읽기 힘들어지는 형태가 된다. 따라서 실수로 잘못된 순서로 매개변수를 전달할 수 있다. 점층적 생성자 패턴은 이런 한계점을 가지고 있다.

### 자바빈즈 패턴 (JavaBeans Pattern)

자바빈즈 패턴은 선택적 매개변수가 많을 때 활용할 수 있는 두번째 대안이다. 자바 빈즈 패턴은 (1) 매개변수가 없는 생성자로 객체를 만들고 (2) 세터 (Setter) 메서들을 호출하여 매개변수를 설정한다.

햄버거 클래스를 점층적 생성자 패턴 대신 자바빈즈 패턴으로 구현하면 아래와 같을 것 이다.

```java
public class Hamburger {
    private int size = -1; // 필수 매개변수
    private int bun = 0;
    private int patty = 0;
    private int lettuce = 0;
    private int tomato = 0;

    public Hamburger() {}

    public void setSize(int size) {
        this.size = size;
    }

    public void setBun(int bun) {
        this.bun = bun;
    }

    public void setPatty(int patty) {
        this.patty = patty;
    }

    public void setLettuce(int lettuce) {
        this.lettuce = lettuce;
    }

    public void setTomato(int tomato) {
        this.tomato = tomato;
    }
}
```

위 클래스로 점층적 생성자 패턴에서 불편하게 생성했던 '번과 토마토만 있는 햄버거' 를 생성해보자.

```java
Hamburger hamburger = new Hamburger();
hamburger.setSize(1);
hamburger.setBun(2);
hamburger.setTomato(2);
```

더 이상 점층적 생성자 패턴의 단점이 보이지 않는다.

#### 일관성 문제

하지만, 자바빈즈 패턴도 치명적인 단점을 가지고 있다. 일단, 객체를 생성하기 위해 여러개의 메소드를 호출해야한다. 또한 객체가 완전히 생성되기 전까지는 일관성(COnsistency) 가 무너진 상태에 놓이게 된다.

객체가 완전히 생성된 상태는 필수 매개변수가 모두 설정된 상태이다. 하지만 개발자의 실수로 `setSize` 메소드를 사용하지 않은 상태라면, 그 객체는 유효하다고 말할 수 없다. 하지만, 일관성이 깨진 상태를 객체 생성 코드를 작성할 때나 컴파일 타임에는 알 수 없다.

어딘가에서 일관성이 깨진 햄버거 인스턴스를 생성하고, 어딘가에서 그 인스턴스를 사용하게 되면 런타임에 문제가 발생하게 될 것이다. 하지만, 이미 객체를 생성하는 부분과 문제가 발생한 코드가 물리적으로 멀리 떨어져 있으므로 디버깅이 쉽지 않다.

#### 불변성 문제

또한 완전히 생성된 객체라고 하더라도 외부적으로 세터 메소드를 노출하고 있으므로, 불변함을 보장할 수 없게된다. 즉, 자바빈즈 패턴을 사용하면 클래스를 불변으로 만들 수 없다.

스레드 안전성 (Thread-Safe) 를 얻기 위해서는 객체를 수동으로 얼리는 (Freezing) 방법을 사용할 수 있다는데, 실전에서는 다루기 어려워 쓰이지 않는다고 한다.

## 빌더 패턴을 사용한다면

빌더 패턴은 빌더라는 별도의 객체를 통해 일련의 과정을 거쳐 객체를 생성하게 된다. 클래스 사용자는 직접 객체를 생성하지 않고, 필수 매개변수만으로 빌더 객체를 생성하고, 이 빌더 객체가 제공하는 일종의 세터 메소드를 사용하여 객체를 완성해갈 수 있다. 이때, 빌더 객체의 세터 메소드의 반환값은 빌더 자기 자신이므로 메소드를 연결하여 연속으로 사용하는 메소드 체이닝(Method Chaining)을 할 수 있다. 빌더 패턴을 코드로 나타내면 아래와 같을 것 이다.

```java
class Hamburger {
    private final int size;
    private final int bun;
    private final int patty;
    private final int lettuce;
    private final int tomato;

    private Hamburger(Builder builder) {
        this.size = builder.size;
        this.bun = builder.bun;
        this.patty = builder.patty;
        this.lettuce = builder.lettuce;
        this.tomato = builder.tomato;
    }

    public static class Builder {
        // 필수 매개변수
        private final int size;

        // 선택 매개변수
        private int bun = 0;
        private int patty = 0;
        private int lettuce = 0;
        private int tomato = 0;

        public Builder(int size) {
            this.size = size;
        }

        public Builder bun(int bun) {
            this.bun = bun;
            return this;
        }

        public Builder patty(int patty) {
            this.patty = patty;
            return this;
        }

        public Builder lettuce(int lettuce) {
            this.lettuce = lettuce;
            return this;
        }

        public Builder tomato(int tomato) {
            this.tomato = tomato;
            return this;
        }

        public Hamburger build() {
            return new Hamburger(this);
        }
    }
}
```

`Hamburger` 클래스 내부에 정적 클래스인 `Builder` 가 정의되어 있는 모습을 볼 수 있다. `Builder` 클래스는 필수 매개변수인 `size` 만을 전달받아 생성된다. 그리고 `bun`, `patty`, `lettuce`, `tomato` 와 같은 메소드는 빌더 자기자신의 매개변수를 설정하고, 자기자신을 반환하는 것을 확인할 수 있다.

마지막으로 `build` 메소드는 `Hamburger` 객체를 생성하여 반환하는데, `Hamburger` 의 매개변수에는 빌더 하나만 전달한다. `Hamburger` 클래스의 생성자는 `Builder` 를 전달받아 매개변수를 설정할 수 있다.

위 클래스는 아래와 같이 사용할 수 있을 것 이다.

```java
Hamburger hamburger = new Hamburger.Builder(10)
    .bun(2)
    .lettuce(3)
    .patty(3)
    .build();
```

빌더패턴은 점층적 생성자 패턴과 자바빈즈 패턴 두 가지의 장점만을 취한 형태이다.

> 책 19p ~ 21p 의 내용은 아직 제네릭에 대한 이해가 부족하므로 생략한다. 추후 제네릭을 제대로 이해하게 되면, 추가 포스팅을 올리거나 내용을 수정하여 추가하도록 할 예정이다.

## 빌더 패턴의 단점

빌더 패턴도 장점만 존재하지는 않다. 선택적 매개변수를 많이 받는 객체를 생성하기 위해서는 먼저 빌더 클래스부터 정의해야한다. 빌더의 생성비용이 크지는 않지만, 성능에 민감한 상황에서는 문제가 될 수 있다고 한다.

또한 매개변수가 4개보다 적다면, 점층적 생성자 패턴을 사용하는 것이 더 좋다고 한다. 빌더 패턴의 코드가 다소 장황하기 때문이다. 하지만, API 는 시간이 지날수록 많은 매개변수를 갖는 경향이 있다. 따라서 애초에 빌더 패턴으로 시작하는 편이 나을 때가 많다고 한다.
