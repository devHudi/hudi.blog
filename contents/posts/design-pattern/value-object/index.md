---
title: "원시 타입 대신 VO(Value Object)를 사용하자"
date: 2022-04-14 21:00:00
tags:
  - 객체지향
  - Java
---

## VO(Value Object)

VO (한국어로는 값 객체) 는 도메인에서 한 개 또는 그 이상의 속성들을 묶어서 특정 값을 나타내는 객체이다. 이때 특정 값의 예시로 나이, 금액과 같이 정수 하나로 표현할 수 있는 값과 X값, Y값의 쌍으로 표현되는 2차원 좌표, 시작 날짜와 끝 날짜로 이루어진 기간등을 들 수 있을 것 이다.

## Primitive Obsession (원시 타입에 대한 집착)

마틴 파울러의 책, 리팩토링에서 Primitive Obsession, 직역하자면 원시 타입에 대한 집착이라는 단어를 찾아볼 수 있다. Primitive Obsession 이란 간단한 작업을 위해서 작은 객체를 사용하는 것이 아닌 원시 타입 (`int`, `double`, `String` 등) 을 사용하는 것을 의미한다.

예를 들어 나이에 대한 처리를 단순히 `int` 로 처리한다고 가정해보자. 그렇다면 값을 처리하는 클라이언트에서 항상 나이가 음수는 아닌지, 나이가 상식을 뛰어넘도록 큰 값을 (가령 21억) 가지고 있지는 않은지 등을 검사해야한다.

또한 관련된 데이터를 묶어두지 않고 흩어놓게 되면, 각각 정보에 대한 정보를 외부에 공개해야 한다. 이는 객체지향의 중요한 특징 중 하나인 캡슐화를 깨트린다.

이런 문제들을 방지하기 위해 VO사용을 고려해볼 수 있다.

> 나는 프로그래밍 할 때 무언가를 조합하여 표현하는 것이 유용하다는 것을 자주 발견한다. 2차원 좌표는 x 값과 y 값으로 구성되고, 돈은 숫자와 통화로 구성되어 있다. 기간은 시작 날짜와 끝 날짜로, 그리고 각각의 날짜는 또한 년, 월, 일로 구성될 수 있을 것 이다.
>
> _마틴 파울러 (Martin Fowler)_

## VO의 제약사항

VO는 크게 아래의 3가지 제약사항이 존재한다.

### 불변성 (Immutable)

VO는 수정자(Setter) 메소드를 가지지 않는다. 즉, VO는 불변하다.

불변성을 갖기 때문에 VO는 언제, 어디서 호출이 되던 값이 변경되었을 걱정을 할 필요가 없다. 따라서 안심하고 객체를 공유할 수 있다. 예를 들어, DB에서 값을 가져와 데이터를 VO에 담는다면 항상 VO의 값을 원본으로써 신뢰할 수 있다.

이러한 특징 때문에 계층간 데이터를 전송할 때 DTO 대신 VO를 전송할 수도 있다.

### 동등성 (Equality)

두 객체가 실제 다른 객체이더라도 즉, 동일성(Identity)를 갖지 않더라도 논리적으로 표현하는 값이 같다면 동등성(Equality)를 갖는다.

내 지갑에 있는 만원권 지폐와 친구 지갑에 있는 만원권 지폐는 엄연하게 서로 다른 물체이지만, 동등한 가치를 지니므로 논리적으로 동등하다고 할 수 있다.

동일성과 동등성에 대해서는 [동일성(Identity)과 동등성(Equality)](https://hudi.blog/identity-vs-equality/) 포스트에 자세히 적어두었으니 참고하자.

### 자가 유효성 검사 (Self-Validation)

원시 타입을 사용하면, 값의 유효성을 사용하는 측에서 검사해야한다. 이는 'Primitive Obsession' 문단에서 언급한 나이 값을 원시 값을 통하여 표현했을 때 발생하는 문제와 같다.

VO는 자가 유효성 검사라는 특징을 갖는다. 모든 유효성 검사는 생성 시간에 이루어져야 하며, 따라서 유효하지 않는 값으로 VO를 생성할 수 없다. 따라서 VO를 사용하는 클라이언트는 도메인 규칙이 깨진다는 염려 없이 심리적 안정감을 갖고 값을 다룰 수 있다.

## DTO와는 다르다

가끔 인터넷을 둘러보면 DTO와 VO를 혼용하여 사용하는 사람이 있다. VO를 DTO로 사용할 수는 있겠지만 엄연히 DTO와 VO는 서로 다른 개념이다. DTO 는 이름 그대로 Data Transfer Object, 즉 계층간 데이터 '전송' 을 위하여 만들어진 객체이다.

VO는 비즈니스 로직을 포함할 수 있지만, DTO는 비즈니스 로직을 갖지 않는다.

> VO가 비즈니스 로직을 가져도 되는가에 대해서는 의견이 많이 갈리는 것 같다. 지극히 개인적인 생각이지만, 금액과 같이 VO가 충분히 도메인 객체로서 역할을 할 수 있다면 비즈니스 로직을 가져도 무방하다고 생각한다. 물론 이 생각은 내가 경험이 더 쌓인다면 바뀔수도 있다고 생각한다. 하지만 개발에는 정답은 없는 것 이니까 😎

또한 VO는 불변이어야 하지만, DTO는 꼭 불변일 필요는 없다. 즉, DTO는 Setter를 허용한다. 마지막으로 서로 다른 두 DTO가 동일한 값을 가지고 있더라도 동등성을 갖지 않는다.

정리하자면 DTO는 데이터가 여러 레이어를 거쳐가며 혹시 모를 변경으로부터 도메인 객체를 보호하기 위해 별도로 생성하여 사용하는 '전송용' 객체이다. 그에 반해 VO는 도메인에서 의미있는 값 그 자체를 표현하기 위해 사용하는 객체이므로 이를 혼동해서는 안되겠다.

## 참고

- [https://tecoble.techcourse.co.kr/post/2020-06-11-value-object/](https://tecoble.techcourse.co.kr/post/2020-06-11-value-object/)
- [https://tecoble.techcourse.co.kr/post/2021-05-16-dto-vs-vo-vs-entity/](https://tecoble.techcourse.co.kr/post/2021-05-16-dto-vs-vo-vs-entity/)
- [https://www.youtube.com/watch?v=z5fUkck_RZM](https://www.youtube.com/watch?v=z5fUkck_RZM)
- [https://martinfowler.com/bliki/ValueObject.html](https://martinfowler.com/bliki/ValueObject.html)
- [https://medium.com/@nicolopigna/value-objects-like-a-pro-f1bfc1548c72](https://medium.com/@nicolopigna/value-objects-like-a-pro-f1bfc1548c72)
