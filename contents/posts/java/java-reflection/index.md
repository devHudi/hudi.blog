---
title: "자바 리플렉션 (Reflection) 기초"
date: 2022-09-17 01:40:00
tags:
  - Java
---

## 리플렉션 (Reflection)

JVM은 **클래스 정보를 클래스 로더를 통해 읽어와서 해당 정보를 JVM 메모리에 저장**한다. 그렇게 저장된 클래스에 대한 정보가 마치 거울에 투영된 모습과 닮아있어, 리플렉션이라는 이름을 가지게 되었다. 리플렉션을 사용하면 **생성자, 메소드, 필드 등 클래스에 대한 정보를 아주 자세히 알아낼 수 있다**.

대표적으로 여러 라이브러리, 프레임워크에서 사용되는 어노테이션이 리플렉션을 사용한 예시이다. 방금 말했듯 리플렉션을 사용하면 클래스와 메소드에 어떤 어노테이션이 붙어 있는지 확인할 수 있다. 어노테이션은 그 자체로는 아무 역할도 하지 않는다. 리플렉션 덕분에 우리가 스프링에서 `@Component` , `@Bean` 과 같은 어노테이션을 프레임워크의 기능을 사용하기 위해 사용할 수 있는 것이다.

또한, 인텔리제이와 같은 IDE에서 Getter, Setter를 자동으로 생성해주는 기능도 리플렉션을 사용하여 필드 정보를 가져와 구현한다고 한다. 이와 같이 리플렉션은 다양한 곳에서 무궁무진한 방법으로 사용될 수 있다.

신기한것은 리플렉션을 사용하면 접근 제어자와 무관하게 클래스의 필드나 메소드도 가져와서 호출할 수 있다는 점이다.

## Class 클래스

리플렉션의 가장 핵심은 `Class` 클래스이다. `Class` 클래스는 `java.lang` 패키지에서 제공된다. 어떻게 특정 클래스의 `Class` 인스턴스를 획득할 수 있을까?

### Class 객체 획득 방법

```java
Class<Member> aClass = Member.class; // (1)

Member member1 = new Member();
Class<? extends Member> bClass = member1.getClass(); // (2)

Class<?> cClass = Class.forName("hudi.reflection.Member"); // (3)
```

첫번째 방법으로는 클래스의 `class` 프로퍼티를 통해 획득 하는 방법이다. 두번째 방법으로는 인스턴스의 `getClass()` 메소드를 사용하는 것이다. 세번째 방법으로는 `Class` 클래스의 `forName()` 정적 메소드에 **FQCN(Fully Qualified Class Name)**를 전달하여 해당 경로와 대응하는 클래스에 대한 `Class` 클래스의 인스턴스를 얻는 방법이다.

이런 `Class` 의 객체는 `Class` 에 **public 생성자가 존재하지 않아** 우리가 직접 생성할 수 있는 방법은 없다. 대신 `Class` 의 객체는 **JVM이 자동으로 생성**해준다.

### getXXX() vs getDelcaredXXX()

`Class` 객체의 메소드 중 `getFields()` , `getMethods()` , `getAnnotations()` 와 같은 형태와`getDeclaredFields()` , `getDeclaredMethods()` , `getDeclaredAnnotations()` 와 같은 형태로 메소드가 정의되어 있는 것을 확인할 수 있다. 이 메소드들은 클래스에 정의된 필드, 메소드, 어노테이션 목록을 가져오기 위해 사용된다.

편의상 이 두 형태를 각각 `getXXX()` , `getDeclaredXXX()` 로 부르겠다. 이 둘은 무엇이 다른 것일까? `getXXX()` 는 **상속받은 클래스와 인터페이스를 포함하여 모든 public 요소**를 가져온다. 예를 들면 `getMethods()` 는 해당 클래스가 상속받은 그리고 구현한 인터페이스에 대한 모든 public 메소드를 가져온다.

반면, `getDeclaredXXX()` 는 **상속받은 클래스와 인터페이스를 제외하고 해당 클래스에 직접 정의된 내용만 가져온다**. 또한 접근 제어자와 상관없이 요소에 접근할 수 있다. 예를 들어 `getDeclaredMethods()` 는 해당 클래스에만 직접 정의된 **private, protected, public 메소드를 전부 가져온다**.

## Constructor

`Class` 를 사용해서 생성자를 `Constructor` 타입으로 가져올 수 있다. `Constructor` 는 `java.lang.reflect` 패키지에서 제공하는 클래스이며, 클래스 생성자에 대한 정보와 접근을 제공한다. 리플렉션으로 생성자에 직접 접근하고, 객체를 생성해보자.

```java
Constructor<?> constructor = aClass.getDeclaredConstructor();
// 생성자 가져오기

Object object = constructor.newInstance();
// 이렇게 인스턴스를 생성할 수 있다.

Member member = (Member) constructor.newInstance();
// 타입 캐스팅을 사용해서 위와 같이 받아올 수 있다.
```

위와 같이 `Class` 타입 객체의 `getConstructor()` 를 사용하여 `Constructor` 를 획득할 수 있다. 이것의 `newInstance()` 메소드를 사용하여 객체를 직접 생성할 수 있다. 타입 캐스팅을 사용하지 않으면 `Object` 타입으로 받아와지므로, 타입 캐스팅을 사용하자.

위 예시는 기본 생성자를 가져오는 예시이다. 생성자에 파라미터가 있다면 어떻게 할까? `getConstructor()` 메소드에 생성자 파라미터에 대응하는 타입을 전달하면 된다.

```java
Constructor<?> noArgsConstructor = aClass.getDeclaredConstructor();
Constructor<?> onlyNameConstructor = aClass.getDeclaredConstructor(String.class);
Constructor<?> allArgsConstructor = aClass.getDeclaredConstructor(String.class, int.class);
```

파라미터가 존재하는 생성자를 가져왔다면, 아래와 같이 그냥 생성자 사용하듯이 객체를 생성할 수 있게된다.

```java
Member member = (Member) allArgsConstructor.newInstance("후디", 25);
```

그런데, 위와 같은 방법으로 private 생성자로 객체를 생성하면, `java.lang.IllegalAccessException` 예외가 발생한다. 아래와 같이 `setAccessible(true)` 를 사용하면 해결할 수 있다.

```java
noArgsConstructor.setAccessible(true);
Member member = (Member) noArgsConstructor.newInstance();
```

> 참고로 Class 타입의 newInstance() 메소드는 deprecated 되었으므로 사용하지 말자.

## Field

리플렉션을 사용하여 `Field` 타입의 오브젝트를 획득하여 객체 필드에 직접 접근할 수 있다. 아래와 같이 사용한다.

```java
Class<Member> aClass = Member.class;
Member member = new Member("후디", 25);

for (Field field : aClass.getDeclaredFields()) {
    field.setAccessible(true);
    String fieldInfo = field.getType() + ", " + field.getName() + " = " + field.get(member);
    System.out.println(fieldInfo);
}

/*
    class java.lang.String, name = 후디
    int, age = 25
*/
```

아래와 같이 `set()` 메소드를 사용하여, Setter가 없이도 강제로 객체의 필드 값을 변경할수도 있다.

```java
Class<Member> aClass = Member.class;
Member member = new Member("후디", 25);

Field name = aClass.getDeclaredField("name");
name.setAccessible(true);
name.set(member, "Hudi"); // 필드값 변경

System.out.println("member = " + member);
// member = Member{name='Hudi', age=25}
```

## Method

리플렉션을 사용하여 `Method` 타입의 오브젝트를 획득하여 객체 메소드에 직접 접근할 수 있다. 아래와 같이 사용한다.

```java
Class<Member> aClass = Member.class;
Member member = new Member("후디", 25);

Method sayMyName = aClass.getDeclaredMethod("sayMyName");
sayMyName.invoke(member);
// 내 이름은 후디
```

위 예제와 같이 `Method` 타입의 `invoke()` 를 사용하여 메소드를 직접 호출할 수 있다.

## 어노테이션 가져오기

```java
Class<Member> aClass = Member.class;

Entitiy entityAnnotation = aClass.getAnnotation(Entitiy.class);
String value = entityAnnotation.value();
System.out.println("value = " + value);
// 멤버
```

위와 같이 `getAnnotation()` 메소드에 직접 어노테이션 타입을 넣어주면, 클래스에 붙어있는 어노테이션을 가져올 수 있다. 어노테이션이 가지고 있는 필드에도 접근할 수 있는 것을 확인할 수 있다.

## 리플렉션의 단점

일반적으로 메소드를 호출한다면, 컴파일 시점에 분석된 클래스를 사용하지만 리플렉션은 **런타임에 클래스를 분석하므로 속도가 느리다**. JVM을 최적화할 수 없기 때문이라고 한다. 그리고 이런 특징으로 인해 **타입 체크가 컴파일 타임에 불가능**하다. 또한 **객체의 추상화가 깨진다**는 단점도 존재한다.

따라서 일반적인 웹 애플리케이션 개발자는 사실 리플렉션을 사용할일이 거의 없다. 보통 라이브러리나 프레임워크를 개발할 때 사용된다. 따라서 **정말 필요한 곳에만 리플렉션을 한정적으로 사용**해야한다.

## 참고

- [https://www.youtube.com/watch?v=67YdHbPZJn4](https://www.youtube.com/watch?v=67YdHbPZJn4) (우테코 파랑, 아키 감사합니다!)
- [https://www.youtube.com/watch?v=Q-8FC09OSYg](https://www.youtube.com/watch?v=Q-8FC09OSYg)
