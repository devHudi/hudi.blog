---
title: "[Java] 타입 캐스팅에 대하여"
date: 2022-03-01 15:30:00
tags:
  - 학습기록
  - java
---

## 학습 동기

우아한테크코스 레벨1 로또 미션을 진행하면서, 자바 Stream 의 `count` 메소드를 사용할 일이 있었다. `count` 메소드의 반환 타입은 `long` 이었고, 내가 저장하고 싶은 변수의 타입은 `int` 였다. 그냥 자연스럽게, 타입 캐스팅으로 강제 형변환을 해주었다.

이전까지 타입 캐스팅은 그냥 단순히 현재 타입을 다른 타입으로 강제로 형 변환 해주는 기능 정도로만 알고 있었다. 그런데, 새삼 '강제' 라는 단어가 조금 찝찝하게 다가왔다. **'강제로 바꿔주는 것 이라면 조심해서 사용해야하지 않을까?'** 라는 생각이 문득 들게 되었고, 제대로 타입 캐스팅에 대해 공부해야겠다는 생각을 하게 되었다.

## 타입 캐스팅이란

타입 캐스팅은 상대적으로 작은 크기의 타입에 큰 크기의 타입의 데이터를 저장하기 위해 사용한다.

```java
int intValue = 3;
long longValue = intValue; // 가능
```

위 코드를 살펴보자. `int` 타입은 `long` 타입에 비해 저장 용량이 작은 타입이다. 따라서 `longValue` 변수에는 `intValue` 의 데이터를 문제없이 저장할 수 있다. 자바에서 자동 타입 변환을 해주기 때문이다.

```java
long longValue = 3;
int intValue = longValue; // 불가능
```

하지만, 위와 같이 `long` 타입의 데이터를 `int` 타입의 변수로 저장하는 것은 불가능하다. 따라서 아래와 같이 캐스팅 연산자 `(타입명)` 을 앞에 붙여주어 강제로 형변환 해야한다.

```java
long longValue = 3;
int intValue = (int) longValue;
```

## 타입 캐스팅의 원리와 위험성

상식적으로 큰 상자를 작은 상자에 집어 넣을 수는 없다. 하지만, 큰 상자를 몇조각으로 잘라서 작은상자에 일부분을 집어 넣을 수 있을 것 이다. 하지만, 이렇게 되면 손실이 발생하게 된다.

타입 캐스팅도 마찬가지이다. `int` 타입 (4byte) 의 데이터를 `byte` 타입 (1byte) 로 강제 타입 변환을 한다고 생각해보자. `int` 타입의 데이터를 `byte` 타입 변수에 넣기위해 1byte 단위로 잘라야 할 것이다. 이때, 가장 뒤에 있는 1byte 가 `byte` 타입 변수에 할당된다. 아래 코드를 살펴보자.

```java
int intValue = 123456780; // 00000111 01011011 11001101 00001100
byte byteValue = (byte) intValue; // 00001100

System.out.println(intValue); // 123456780
System.out.println(byteValue); // 12
```

$123456780$ 를 이진법으로 표현하면, $00000111010110111100110100001100_{(2)}$ 이다. 이를 1byte 단위로 끊으면, $00000111$, $01011011$, $11001101$, $00001100$ 이렇게 4개로 분리될 것이다. 이 중 가장 뒤에 있는 $00001100$ (즉 10진법으로는 $12$) 가 `byteValue` 에 할당되어 `byteValue` 를 출력하면 $12$ 가 나오는 것을 알 수 있다.

즉, 타입 캐스팅은 잠재적으로 데이터의 손실 위험성을 가지고 있다.

## 안전하게 타입 캐스팅하기

작은 타입에 저장하기 위해 큰 타입의 변수를 캐스팅 할 때, 큰 타입의 변수가 가지고 있는 데이터의 크기가 작은 타입에도 저장될 수 있는 용량인지 확인할 필요가 있다.

| 기본 타입 | 최대값 상수       | 최소값 상수       |
| --------- | ----------------- | ----------------- |
| byte      | Byte.MAX_VALUE    | Byte.MIN_VALUE    |
| short     | Short.MAX_VALUE   | Short.MIN_VALUE   |
| int       | Integer.MAX_VALUE | Integer.MIN_VALUE |
| long      | Long.MAX_VALUE    | Long.MIN_VALUE    |
| float     | Float.MAX_VALUE   | Float.MIN_VALUE   |
| double    | Double.MAX_VALUE  | Double.MIN_VALUE  |

자바는 위 표와 같이 각 타입별 최대값과 최소값을 각 타입의 래퍼클래스의 상수를 통해 알 수 있다.

```java
int intValue = 123456780;

if (intValue < Byte.MIN_VALUE || intValue > Byte.MAX_VALUE) {
    throw new IllegalArgumentException("byte 타입으로 변환될 수 없습니다.");
}

byte byteValue = (byte) intValue;
```
