---
title: "[Java] Comparable 과 Comparator"
date: 2022-03-05 02:00:00
tags:
  - 학습 기록
  - java
---

## 학습 동기

우테코 로또 미션에서 `LottoNumber` 라는 사용자 정의 클래스를 숫자처럼 오름차순 정렬해야할 일이 있었다. 이전 자동차 경주 미션 때에도 자동차를 위치를 기준으로 정렬하기 위해 `Comparable` 을 사용하였던 적이 있다. 이번 미션에도 똑같이 `Comparable` 을 사용하여 정렬을 구현하였는데, `Comparable` 을 찾아보면 항상 함께 등장하는 것이 `Comparator` 라는 인터페이스였다. 지금까지 어떤 인터페이스인지 정확히 모르고 있었는데, 이번 기회에 제대로 공부해보려 한다.

## Comparable 인터페이스

Comparable 은 객체가 **임의의 기준으로 정렬될 수 있도록** 만들고 싶을 때 사용된다. 즉, 객체를 **‘정렬 가능하도록'** 만들기 위해 사용되는 인터페이스이다. `Comparable` 인터페이스를 구현하는 클래스는 `compareTo(T o)` 메소드를 오버라이딩 해야한다. `compareTo` 는 인자로 객체를 받는다. 반환값은 아래의 기준을 따르며 정렬 기준은 오름차순이다.

- 현재 객체가 인자로 받아온 객체보다 앞이라면 (우선순위가 높다면) : **양수 반환**
- 현재 객체가 인자로 받아온 객체보다 뒤라면 (우선순위가 낮다면) : **음수 반환**
- 둘이 같다면 : **0 반환**

`Integer` , `Double` , `String` 은 모두 `Comparable` 을 구현하고 있어 정렬이 가능하다. 하지만, 사용자 정의 클래스는 직접 `compareTo` 를 오버라이드 해야한다.

```java
class Number {
    private final int value;

    Number(int value) {
        this.value = value;
    }
}
```

위 `Number` 사용자 정의 클래스를 정렬 가능하도록 만들기 위해서는 아래와 같이 코드를 작성하면 된다. implements 를 해줄 때 `Comparable` 의 제네릭으로 해당 객체의 타입을 넣어준다. 아래의 경우 `Comparable<Number>` 로 작성된 것을 확인할 수 있다.

```java
class Number implements Comparable<Number> {
    private final int value;

    Number(int value) {
        this.value = value;
    }

    @Override
    public int compareTo(Number other) {
        if (this.value > other.value) {
            return 1;
        }

        if (this.value < other.value) {
            return -1;
        }

        return 0;
    }

    @Override
    public String toString() {
        return "Number{" +
                "value=" + value +
                '}';
    }
}
```

> `toString` 메소드는 정렬 결과를 보기 편하도록 오버라이드 하였다.

위 `Number` 클래스를 `Collectors.sort` 메소드로 오름차순 정렬 해보자.

```java
List<Number> numbers = new ArrayList<>(
        List.of(
                new Number(5),
                new Number(2),
                new Number(12),
                new Number(22),
                new Number(9),
                new Number(17),
                new Number(6)
        )
);

Collections.sort(numbers);
System.out.println(numbers);
// [Number{value=2}, Number{value=5}, Number{value=6}, Number{value=9}, Number{value=12}, Number{value=17}, Number{value=22}]
```

Number 같은 경우 아주 간단한 기준으로 정렬되므로 재정의된 `compareTo` 는 아래와 같이 간단하게 바꿔볼 수 있다.

```java
@Override
public int compareTo(Number other) {
    return this.value - other.value;
}
```

## Comparator 인터페이스

`Comparable` 은 객체 자신이 정렬 가능하도록 구현하는데 목적이 있다면, `Comparator` 는 타입이 같은 객체 두개를 매개변수로 전달받아 우선순위를 비교할 수 있는 정렬자를 만드는데 그 목적이 있다. `Comparator` 를 구현하기 위해서는 `compare(T o1, T o2)` 메소드를 오버라이딩 하면 된다. 반환값은 아래의 기준을 따른다.

- `o1` 이 `o2` 보다 앞에 온다면 (우선순위가 높다면) : **양수 반환**
- `o1` 이 `o2` 보다 뒤에 온다면 (우선순위가 낮다면) : **음수 반환**
- 둘이 같다면 : **0 반환**

이미 객체 자기 자신이 우선순위를 계산할 수 있는 `Comparable` 인터페이스가 존재하는데, 제 3자가 둘의 우선순위를 비교하는 기능이 필요할까? 첫번째로는 정렬 대상 클래스의 코드를 수정할 수 없을 경우, 두번째로는 정렬 대상 클래스에 이미 정의된 `compareTo` 와 다른 기준으로 정렬하고 싶을 경우, 세번째로 여러 정렬 기준을 적용하고 싶을 경우 사용한다.

일단 `Number` 클래스의 `value` 필드가 `private` 이므로 Getter 메소드를 하나 아래와 같이 추가하겠다. 참고로, 이 `Number` 클래스는 `Comparable` 을 구현하지 않는다.

```java
class Number {
    // ...

    public int getValue() {
        return value;
    }

    // ...
}
```

그리고 아래와 같이 `NumberComparator` 를 정의한다. `Comparable` 과 동일하게 비교 대상의 타입을 제네릭으로 전달한다.

```java
class NumberComparator implements Comparator<Number> {
    @Override
    public int compare(Number number1, Number number2) {
        return number1.getValue() - number2.getValue();
    }
}
```

위 코드를 사용한다면 아래와 같이 사용할 수 있을 것 이다.

```java
List<Number> numbers = new ArrayList<>(
        List.of(
                new Number(5),
                new Number(2),
                new Number(12),
                new Number(22),
                new Number(9),
                new Number(17),
                new Number(6)
        )
);

Collections.sort(numbers, new NumberComparator());
System.out.println(numbers);
// [Number{value=2}, Number{value=5}, Number{value=6}, Number{value=9}, Number{value=12}, Number{value=17}, Number{value=22}]
```

> Collections.sort 는 인자 하나만 받는다면 List 하나만 받지만, **인자 두개를 받는다면 첫번째로는 List, 두번째로는 Comparator 구현체를 전달받는다.**

만약 내림차순도 적용해보고 싶다면, 새로운 `Comparator` 구현체를 아래와 같이 작성해 볼 수 있을 것이다. 기존과 반환 기준만 반대로 작성해주면 된다.

```java
class DescendingNumberComparator implements Comparator<Number> {
    @Override
    public int compare(Number number1, Number number2) {
        return number2.getValue() - number1.getValue();
    }
}
```
