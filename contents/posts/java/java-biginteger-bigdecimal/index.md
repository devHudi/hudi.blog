---
title: "[Java] BigInteger와 BigDecimal"
date: 2022-03-27 17:00:00
tags:
  - 학습기록
  - java
---

## 학습동기

우테코 레벨1 블랙잭 미션을 진행하며, 리뷰어인 앨런에게 아래와 같이 돈 계산에 BigDecimal 이라는 클래스를 사용하라는 피드백을 받게 되었다.

![https://github.com/woowacourse/java-blackjack/pull/369#discussion_r830502747](./review.png)

마침 데일리 이펙티브 자바 스터디에서도 '아이템 60. 정확한 답이 필요하다면 float과 double은 피하라' 에 대해 발표를 맡게되어 해당 토픽에 관심이 생겨 학습하게 되었다.

## BigInteger

BigInteger 는 int와 long 원시타입이 표현할 수 있는 범위보다 훨씬 큰 정수를 표현하기 위한 클래스이다.

### 생성

BigInteger 는 long 형으로도 표현 불가능한 숫자를 담기 위해 사용하기 때문에 숫자 리터럴로 표현할 수 없다. 따라서 생성자로는 int, long 타입을 사용할 수 없으며 문자열을 사용하여 초기화 해야한다.

```java
BigInteger bigInteger = new BigInteger("9999999999999999999");
System.out.println(bigInteger);
// long 형의 최대값을 초과해도 숫자가 잘 표현된다.
```

단, 비교적 작은 숫자를 생성하고 싶은 경우 아래와 같이 `valueOf` 정적 팩토리 메소드를 사용하여 int 혹은 long 타입의 값을 전달할 수 있다.

```java
BigInteger bigInteger1 = BigInteger.valueOf(Integer.MAX_VALUE);
System.out.println(bigInteger1);

BigInteger bigInteger2 = BigInteger.valueOf(Long.MAX_VALUE);
System.out.println(bigInteger2);
```

### 연산

BigInteger 는 원시타입이 아니기 때문에 연산자를 사용할 수 없으며, 아래와 같이 메소드를 사용하여 연산해야한다.

```java
BigInteger number1 = BigInteger.valueOf(10);
BigInteger number2 = BigInteger.valueOf(3);

System.out.println(number1.add(number2)); // 13
System.out.println(number1.subtract(number2)); // 7
System.out.println(number1.multiply(number2)); // 30
System.out.println(number1.divide(number2)); // 3
System.out.println(number1.mod(number2)); // 1
```

BigInteger 는 정수를 표현하기 때문에 나눗셈 연산 결과에서 소수점은 버려진다.

> 단, BigInteger 는 불변성을 가지고 있다는 점을 주의해야한다. 연산 메소드를 사용하면 객체 내부의 값이 변경되지 않고, 연산 결과값을 갖는 새로운 객체가 생성되어 반환된다.

### 대소 비교

연산과 마찬가지로 BigInteger 는 비교 연산자를 사용할 수 없으므로 `compareTo` 라는 메소드를 사용하여 대소를 비교해야한다. 반환값이 `-1` 이면 비교대상보다 작고, `0` 이면 같고, `1` 이면 비교대상보다 큼을 의미한다.

```java
BigInteger number1 = BigInteger.valueOf(10);
BigInteger number2 = BigInteger.valueOf(3);
BigInteger sameNumber = BigInteger.valueOf(10);

System.out.println(number1.compareTo(number2)); // 1
System.out.println(number2.compareTo(number1)); // -1
System.out.println(number1.compareTo(sameNumber)); // 0
```

### 상수

BigInteger 는 아래와 같이 자주 사용하는 숫자는 상수로 미리 생성되어있다.

```java
System.out.println(BigInteger.ZERO); // 0
System.out.println(BigInteger.ONE); // 1
System.out.println(BigInteger.TWO); // 2
System.out.println(BigInteger.TEN); // 10
```

## BigDecimal

> 이 내용은 이펙티브 자바 3판의 '아이템 60. 정확한 답이 필요하다면 float과 double은 피하라' 와 상통하는 내용이다.

BigInteger 가 정수를 다룬다면, BigDecimal 은 소수를 다루는 클래스이다. float, double 은 부동소수점 연산을 처리하며, 실수 연산의 근사치가 저장되기때문에 실제 기대 결과와 다른 결과로 연산될 수 있다. 이런 부동소수점의 특징은 금융 계산 등에서는 이런 오차가 치명적일 수 있다. 따라서 정확한 실수 연산이 필요하다면 float, double 보다는 BigDecimal 을 사용하는 것이 좋다.

### 생성

BigDecimal 은 BigInteger 와는 다르게 원시타입 float 혹은 double 을 생성자에 넣어 생성할 수 있다.

```java
BigDecimal bigDecimal = new BigDecimal(1.1);
System.out.println(bigDecimal);
// 1.100000000000000088817841970012523233890533447265625
```

하지만 위 예시처럼 예상과 다른 값을 얻게될 수 있으므로, BigInteger 와 같이 문자열로 객체를 생성하는 것을 추천한다.

```java
BigDecimal bigDecimal = new BigDecimal("1.1");
System.out.println(bigDecimal);
```

또는 아래와 같이 `valueOf` 정적 팩토리 메소드를 사용하여 객체를 생성할 수 있다. `valueOf` 는 내부적으로 `toString` 을 호출하므로 예상 불가능한 값이 나올 위험이 없다.

```java
BigDecimal bigDecimal = BigDecimal.valueOf(1.1);
System.out.println(bigDecimal);
// 1.1
```

### 연산

BigDecimal 도 BigInteger 와 비슷하게 메소드를 통해 연산할 수 있다.

```java
BigDecimal number1 = BigDecimal.valueOf(10);
BigDecimal number2 = BigDecimal.valueOf(3);

System.out.println(number1.add(number2)); // 13
System.out.println(number1.subtract(number2)); // 7
System.out.println(number1.multiply(number2)); // 30
```

하지만, 나눗셈 연산은 주의하여 사용해야한다. 나눗셈의 결과가 무한소수라면, `ArithmeticException` 예외가 발생한다.

```java
System.out.println(number1.divide(number2));
// java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
```

### 올림, 버림, 반올림 연산

BigDecimal 은 금융권에서 사용되는 여러가지 올림, 버림, 반올림 등의 소수점 처리 연산을 제공한다. `setScale` 메소드에 반올림할 소수점 아래 자리수와 소수점 처리 방식을 전달하면 된다. 소수점 처리 방식은 `RoundingMode` 라는 클래스의 상수로 정의되어있다.

```java
BigDecimal number1 = new BigDecimal("3.5");

System.out.println(number1.setScale(0, RoundingMode.CEILING)); // 올림 (4)
System.out.println(number1.setScale(0, RoundingMode.FLOOR)); // 내림 (3)
System.out.println(number1.setScale(0, RoundingMode.HALF_UP)); // 반올림 (4)
System.out.println(number1.setScale(0, RoundingMode.HALF_DOWN)); // 반내림 (3)
```

위에서 나눗셈의 결과가 무한소수일 경우 예외가 발생한다고 했는데, 아래와 같이 나누기 메소드에 `RoundingMode` 를 전달하면 예외가 발생하지 않는다.

```java
BigDecimal number1 = new BigDecimal("10");
BigDecimal number2 = new BigDecimal("3");

System.out.println(number1.divide(number2, RoundingMode.CEILING));
```

## 원시타입과 연산속도 비교

```java
@Test
void bigInteger() {
    long startTime = System.nanoTime();

    BigInteger bigInteger = new BigInteger("0");
    for (int i = 0; i < Integer.MAX_VALUE; i++) {
        bigInteger = bigInteger.add(BigInteger.valueOf(i));
    }

    long endTime = System.nanoTime();

    System.out.println("BigInteger 소요시간: " + (double) (endTime - startTime) / 1_000_000_000);
}

@Test
void primitiveInt() {
    long startTime = System.nanoTime();

    int number = 0;
    for (int i = 0; i < Integer.MAX_VALUE; i++) {
        number = number + i;
    }

    long endTime = System.nanoTime();

    System.out.println("원시타입 int 소요시간: " + (double) (endTime - startTime) / 1_000_000_000);
}
```

위 실행결과는 아래와 같다.

```
BigInteger 소요시간: 17.195568083
원시타입 int 소요시간: 0.845061292
```

BigInteger가 원시타입 대비 훨씬 실행속도가 느린 것을 알 수 있다.

## 결론

원시타입으로 표현할 수 없는 아주 큰 값을 표현하거나, 아주 정밀한 계산이 요구 될 때는 원시타입 대신 BigInteger 와 BigDecimal 을 사용하자. 단, 연산의 불편함과 느린 속도를 감수해야한다.
