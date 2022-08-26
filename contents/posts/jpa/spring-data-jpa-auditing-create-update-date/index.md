---
title: "Spring Data JPA Auditing으로 엔티티의 생성/수정 시각 자동으로 기록"
date: 2022-08-26 22:40:00
tags:
  - 학습기록
  - spring
  - jpa
---

## Auditing?

Audit은 사전적 의미로 **감사하다, 심사하다** 등의 의미를 가지고 있다. Spring Data JPA에서는 Auditing이라는 기능을 제공한다. 이를 사용하여 엔티티가 생성되고, 변경되는 그 시점을 감지하여 생성시각, 수정시각, 생성한 사람, 수정한 사람을 기록할 수 있다.

특히 서비스를 운영할 때 데이터가 생성되고, 수정한 일자를 기록하고 트래킹하는 것은 중요하다. 이번 포스팅에서는 Spring Data JPA Auditing을 사용해서 엔티티의 생성시각, 수정시각을 자동으로 기록하는 방법에 대해서 알아본다.

## @EnableJpaAuditing

```java
@SpringBootApplication
@EnableJpaAuditing
public class SampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }
}
```

우선 `@EnableJpaAuditing` 어노테이션을 사용하여, Auditing을 활성화 해야한다.

## 엔티티 코드 작성

### Post 엔티티

```java
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Entity
public class Post {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private String content;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Post(final String title, final String content) {
        this.title = title;
        this.content = content;
    }
}
```

> `@Getter` 와 `@NoArgsConstructor` 는 lombok에서 제공하는 어노테이션이다.

### @EntityListeners

우선 Auditing을 적용할 엔티티 클래스에 `@EntityListeners` 어노테이션을 적용해야한다. 해당 어노테이션은 엔티티의 변화를 감지하여 엔티티와 매핑된 테이블의 데이터를 조작한다.

이 어노테이션의 파라미터에 이벤트 리스너를 넣어줘야하는데, 여기에 `AuditingEntityListener` 클래스를 넣어준다. 이 클래스는 Spring Data JPA에서 제공하는 이벤트 리스너로 엔티티의 영속, 수정 이벤트를 감지하는 역할을 한다.

### @CreateDate

생성일을 기록하기 위해 `LocalDateTime` 타입의 필드에 `@CreateDate` 를 적용한다. 또한 생성일자는 수정되어서는 안되므로 `@Column(updatable = false)` 를 적용한다. 이렇게 적용하면, 엔티티가 생성됨을 감지하고 그 시점을 `createdAt` 필드에 기록한다.

### @LastModifiedDate

수정일을 기록하기 위해 `LocalDateTime` 타입의 필드에 `@LastModifiedDate` 를 적용한다. 이렇게 적용하면, 엔티티가 수정됨을 감지하고 그 시점을 `updatedAt` 필드에 기록한다.

사실 Auditing 적용은 이것이 끝이다. 직접 엔티티를 생성하고, 조회해보면 `createAt`과 `updatedAt`에 시각이 잘 들어가는 것을 확인할 수 있다.

## BaseEntity로 분리하기

사실 생성시각과 수정시각은 대부분의 엔티티에서 사용되는 필드일 것이다. 따라서 이를 별개의 엔티티 클래스로 분리하고, 다른 엔티티에서 상속을 받아 사용하면 많은 중복 코드를 없앨 수 있을 것이다.

### BaseEntity

```java
@Getter
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public class BaseEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

`@EntityListners` 어노테이션, `createdAt`, `updatedAt` 필드를 `Post` 클래스와 똑같이 가져온다.

`@MappedSuperclass` 어노테이션은 공통 매핑 정보가 필요할 때 부모 클래스에 선언된 필드를 상속받는 클래스에서 그대로 사용할 때 사용한다. 이때, 부모 클래스에 대한 테이블은 별도로 생성되지 않는다.

### Post

```java
@Getter
@NoArgsConstructor
@Entity
public class Post extends BaseEntity {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private String content;

    public Post(final String title, final String content) {
        this.title = title;
        this.content = content;
    }
}
```

`@EntityListeners` 어노테이션과, `createdAt`, `updatedAt` 필드를 제거한다. 그리고 방금 만든 `BaseEntity` 클래스를 상속받는다.

이렇게되면 중복코드를 없애면서, 여러 엔티티에서 생성시각과 수정시각을 쉽게 추적할 수 있다.
