---
title: "[JS] 접근자 프로퍼티 (Accessor Property)"
date: 2022-01-18
tags:
  - javascript
---

## Javascript 프로퍼티 종류
자바스크립트에서의 객체의 프로퍼티는 크게 두가지로 분류할 수 있다.
1. **데이터 프로퍼티 (Data Property)**
2. **접근자 프로퍼티 (Accessor Property)**

데이터 프로퍼티는 우리 모두가 일반적으로 알고 있는 프로퍼티의 형태이다. 내부에서 변수처럼 선언하고, 외부에서도 변수처럼 접근하고, 수정할 수 있다.

접근자 프로퍼티는 조금 다르다. 객체 내부에서 프로퍼티를 값의 형태 대신 함수의 형태로 `getter` 와 `setter` 를 선언하고, 외부에서는 일반적인 데이터 프로퍼티와 같이 접근한다. 접근자 프로퍼티는 값을 직접 가지고 있지 않으며, 내부의 다른 값을 가져오고(get), 설정하는(set) 역할을 한다.

프로그래머가 직접 객체의 내부 프로퍼티를 조작하는 것은 객체지향 특징 중 캡슐화 (Encapsulation) 을 위배하는 행위이다. 외부의 조작을 그대로 허용해버리면, 추후 예상하지 못한 이슈를 겪게될 수 있다. 이를 접근자 프로퍼티로 해결해보자.

## 접근자 프로퍼티
### 캡슐화 위배 케이스

```js
class Person {
  firstName;
  lastName;
  age;
}
```

위 같이 사람을 나타내는 아주 간단한 클래스가 있다고 가정하자. 이 클래스로 객체를 생성하고, 프로퍼티를 할당하기 위해서는 아래와 같이 코드를 작성하면 된다.

```js
const hudi = new Person();
hudi.firstName = "Donghyun";
hudi.lastName = "Cho";
hudi.age = 25;
```

간단하다. 하지만 여기서 프로그래머가 실수를 하거나, 예상치 못한 문제가 발생하여 `age` 에 -1 이 설정되었다고 하자.

```js
hudi.age = -1;
```

하지만 아무 에러도 발생하지 않는다. 이를 검증하기 위해 `getAge` 와 `setAge` 두개의 함수를 추가해보자.

```js
class Person {
  // ...

  getAge() {
    return this.age;
  }

  setAge(age) {
    if (age < 1) {
      throw new Error("invalid age");
    }

    this.age = age;
  }
}
```

그리고 아래와 같이 잘못된 나이값을 설정해보면, 의도대로 오류가 발생한다. 또한 `getAge` 메소드도 잘 동작한다.

```js
hudi.setAge(0); // Error: invalid age

// ...

hudi.setAge(25);
console.log(hudi.getAge()); // 25
```

하지만, 아직 해결되지 않은 문제가 존재한다. 아직 아래와 같이 잘못된 나이 값을 프로퍼티에 직접 접근하여 조작하는 경우의 에러는 핸들링 할 수 없다.

```js
hudi.age = -1; // 여전히 가능하다
```

### 접근자 프로퍼티 사용
> 데이터의 은닉은 ES2019 부터 Private class fields 를 지원하게 되면서 해결된 상황이다. 다만, 본 포스팅에서는 접근자 프로퍼티를 설명하고 있기에, 접근자 프로퍼티를 통해 데이터 은닉을 한다. *참고: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields*


## 주의점
### 같은 속성 키에 다수의 접근자를 바인딩할 수 없다.

