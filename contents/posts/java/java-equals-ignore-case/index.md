---
title: "String 클래스의 equalsIgnoreCase() 메소드"
date: 2022-09-04 12:00:00
tags:
  - 학습기록
  - java
---

## 학습 배경

우테코 레벨4 HTTP 서버 구현 미션을 진행하며, HTTP Request Start Line의 Method를 비교하는 등과 같은 일들이 많았다. HTTP Method 를 관리하는 enum 클래스에는 `GET` , `POST` 와 같이 모든 문자를 대문자로 저장했는데, 실제 요청은 `Get` 혹은 `get` 과 같이 대소문자 구분없이 들어올 수 있다.

이를 위해서 처음에는 `toUpperCase()` 혹은 `toLowerCase()` 와 같은 메소드를 사용하여 대소문자를 통일한뒤 비교했다. 이후 다른 크루의 코드를 리뷰하며, `equalsIgnoreCase()` 라는 편리한 메소드를 알게되어 기록한다.

## equalsIgnoreCase()

`equalsIgnoreCase()` 는 `String` 클래스에서 기본으로 제공하는 메소드이다. 이름과 같이 대소문자를 구분하지 않고, 두 문자열을 비교한다.

```java
@Test
void equalsIgnoreCase() {
    // given
    String hudi = "hudi";

    // when
    boolean actual1 = hudi.equalsIgnoreCase("HUDI");
    boolean actual2 = hudi.equalsIgnoreCase("hUdI");
    boolean actual3 = hudi.equalsIgnoreCase("HuDi");

    // then
    assertAll(() -> {
        assertThat(actual1).isTrue();
        assertThat(actual2).isTrue();
        assertThat(actual3).isTrue();
    });
}
```

따라서 위의 테스트는 통과한다.
