---
title: "격리된 테스트 (Isolated Test) (feat. Spring 에서 테스트 격리하기)"
date: 2022-05-19 12:50:00
tags:
  - 학습기록
  - 테스트
  - Spring
---

## 격리된 테스트 (Isolated Test)

데이터베이스와 같은 공유 자원을 사용하는 테스트는 실행 순서에 따라 성공, 실패 여부가 결정되는 **비결정적인(non-deterministic) 테스트**가 될 수 있다. 이런 비결정적 테스트는 실패하면 버그가 원인인지, 비결정적 동작이 원인인지 알기 힘들다. 따라서 테스트는 실행 순서에 상관 없이 독립적으로, **결정적(deterministic)으로 실행되어야한다.**

테스트 격리는 **공유 자원을 사용하는 여러 테스트끼리 격리하여 서로 영향을 주고 받지 못하게 하는** 기법이다. 특히 데이터베이스를 사용하는 객체를 테스트할 때 테스트 격리가 필요하다.

> _Therefore I find it's really important to focus on keeping tests isolated. <u>**Properly isolated tests can be run in any sequence.**</u> As you get to larger operational scope of functional tests, it gets progressively harder to keep tests isolated. When you are tracking down a non-determinism, lack of isolation is a common and frustrating cause._
>
> _― [Martin Fowler](https://martinfowler.com/articles/nonDeterminism.html)_

## Spring 에서의 테스트 격리 방법

앞서 격리된 테스트가 무엇인지, 테스트를 격리하는 것이 왜 중요한 것인지 알아보았다. 다음으로는 Spring Framework 에서 테스트를 격리하는 여러 방법에 대해 알아보자.

### 테스트 더블을 사용한 테스트 격리

이전 테스트 더블 포스팅에서 테스트 더블은 테스트 대상(SUT: System Under Test)을 테스트 대상이 의존하고 있는 구성요소(DOC: Depened-on Component) 로부터 분리하여 테스트하기 위해 사용한다고 이야기했다.

테스트 더블은 또한 테스트 격리를 위해서도 사용된다. 예를 들어 Service 테스트에서 Dao 를 Mocking 하지 않고 실제 객체를 그대로 사용한다고 가정하자. Service Layer 의 각 테스트는 실제 데이터베이스를 변화시킬 것 이고, 이 테스트는 비결정적 테스트가 될 것이다.

하지만 Service 가 사용하는 Dao 를 Mocking 한다면, Service 는 데이터베이스 즉, 공유자원으로부터의 의존이 사라지고, 각각의 Service 테스트는 상호 영향을 끼치지 않는 격리된 상태가 될 것이다.

따라서 Dummy, Fake, Stub, Spy, Mock 등의 테스트 더블을 사용하여 테스트들을 격리할 수 있을 것 이다. 보통은 Mockito 라는 Mocking Framework 가 사용될 것이다.

### @Transactional 을 사용한 테스트 격리

Spring은 트랜잭션 관리를 위한 `@Transactional` 이라는 어노테이션을 제공한다. 프로덕션 코드에서 사용하는 방식과 다르게 테스트 코드에서 `@Transactional` 어노테이션을 사용하면 테스트 메서드가 종료될 때 자동으로 해당 트랜잭션이 롤백되어 테스트 코드가 변경한 데이터베이스를 테스트 이전 상태로 되돌려준다.

이 방법은 실질적으로 트랜잭션을 관리하는 Service Layer 에서 사용하기 좋은 테스트 격리 방식이다. 아래는 우아한테크코스 레벨2 지하철 노선도 미션에서 작성한 테스트 코드이다.

```java
@Transactional
@JdbcTest
class LineServiceTest {

    // ...

    @DisplayName("이름, 색상, 상행선, 하행선, 길이를 전달받아 새로운 노선을 등록한다.")
    @Test
    void createLine() {
        // given
        String name = "2호선";
        String color = "bg-green-600";
        Long upStationId = createdStation1.getId();
        Long downStationId = createdStation2.getId();
        Integer distance = 10;

        LineRequest lineRequest = new LineRequest(name, color, upStationId, downStationId, distance);

        // when
        LineResponse actual = lineService.createLine(lineRequest);

        // then
        assertAll(
                () -> assertThat(actual.getName()).isEqualTo(name),
                () -> assertThat(actual.getColor()).isEqualTo(color)
        );
    }
```

테스트 클래스 상단에 `@Transactional` 어노테이션을 붙여 매 테스트 메소드가 끝날때 마다 트랜잭션이 롤백되도록 해두었다.

### @JdbcTest, @DataJpaTest

DAO(Repository)를 테스트할 때 `JdbcTemplate` 을 주입받고 DAO 객체를 생성하기 위해 나는 기계적으로 `@JdbcTest` 어노테이션을 사용하였다. 이때까지 별 생각없이 영속성 레이어 테스트를 진행했는데, 이 포스팅을 쓰다보니 무언가 이상하다는 생각이 들었다. 분명 테스트 격리나 트랜잭션 처리를 해주지 않았는데, DAO가 격리되어 서로 영향을 끼치지 않고 진행되었다.

이에 대해서 알아보니 `@JdbcTest` 어노테이션은 내부적으로 `@Transactional` 어노테이션을 가지고 있었다. `@JdbcTest` 내부를 살펴보자.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@BootstrapWith(JdbcTestContextBootstrapper.class)
@ExtendWith(SpringExtension.class)
@OverrideAutoConfiguration(enabled = false)
@TypeExcludeFilters(JdbcTypeExcludeFilter.class)
@Transactional
@AutoConfigureCache
@AutoConfigureJdbc
@AutoConfigureTestDatabase
@ImportAutoConfiguration
public @interface JdbcTest {
```

정말 `@Transactional` 을 가지고 있다. 이는 `@DataJpaTest` 도 마찬가지라고 한다. 따라서 영속성 레이어를 테스트하기 위해서는 `@JdbcTest` 혹은 `@DataJpaTest` 를 사용해볼 수 있겠다.

> @DataJpaTest 는 JPA 컴포넌트를 테스트하기 위해 사용하는 어노테이션이라고 하지만, 나는 아직 JPA를 공부해본적이 없으므로 적당히 넘어가겠다 😅

### @Sql 어노테이션

`@Sql` 은 스프링에서 제공하는 어노테이션으로써, 테스트 클래스에 해당 어노테이션을 붙이면 매 테스트 메소드 실행전 지정된 경로의 SQL 스크립트를 실행해준다.

SQL 명령에는 데이터를 지우기 위한 `DROP` 과 `DELETE` 명령이 존재한다. `DROP` 은 테이블 자체를 제거하는 명령이고, `DELETE` 는 특정 행을 지우는 명령이다. 여기에 더해 SQL에는 `TRUNCATE` 라는 명령이 존재한다. `TRUNCATE` 는 테이블 자체를 제거하지는 않지만, 테이블의 모든 행을 제거하는 명령이다.

이 명령을 활용하여 우리는 격리된 테스트를 만들어볼 수 있다.

**IsolcatedTest.java**

```java
@Sql("/truncate.sql")
public class IsolatedTest {
    // ...
```

**truncate.sql**

```sql
TRUNCATE TABLE member;
TRUNCATE TABLE article;
```

`@Sql` 어노테이션은 어떤 유형의 테스트던 상관없이 공유자원이 데이터베이스라면 유용하게 사용할 수 있는 어노테이션이지만, 특히 인수테스트에서 더 빛을 볼 수 있을 것이다.

이때, 인수테스트란 사용자의 시나리오에 맞게 실제 운영환경과 동일하게 테스트 환경을 구축하여 통합적으로 테스트하는 것을 의미한다. Mock 프레임워크 등을 사용한다면 실제 운영환경과 다른 테스트 환경이 구축되기 때문에 인수테스트의 본래 목적을 달성할 수 없다. 따라서 `@Sql` 어노테이션을 활용하여 매 테스트마다 데이터베이스를 초기화 하는 전략을 꽤해 볼 수 있겠다.

> 또한 @Transactional 은 인수테스트에서는 사용할 수 없다고 한다. 인수테스트는 @SpringBootTest 어노테이션을 사용하여 진행되는데, 이때 HTTP 클라이언트와 서버는 각각 다른 스레드에서 실행되어 트랜잭션 롤백이 의도대로 동작하지 않아 사용할 수 없다고 한다. 아직 경험이 부족해 이 부분은 명확히 이해가 안되므로 추후 별도의 포스팅으로 보충하도록 하겠다.

### @DirtiesContext

인수테스트를 진행할 때 일반적으로 `@SpringBootTest` 어노테이션을 사용하여 `ApplicationContext` 를 띄워 테스트를 진행할 것 이다. 이때 `ApplicationContext` 는 한번 로딩되면 캐싱되어 각각의 테스트에서 재사용된다.

> _The Spring TestContext Framework provides consistent loading of Spring ApplicationContexts and WebApplicationContexts as well as caching of those contexts. (생략) By default, once loaded, the configured ApplicationContext is reused for each test._
>
> ― _[스프링 공식문서](https://docs.spring.io/spring-framework/docs/4.2.x/spring-framework-reference/html/integration-testing.html)_

캐싱과 재사용 키워드에 집중해보자. `ApplicationContext` 가 로딩되면 `schema.sql` 이 실행되는데, 문제는 컨텍스트는 캐싱되고, 각각의 테스트는 동일한 컨텍스트를 사용하므로 테스트들이 동일한 데이터베이스를 사용하게 된다.

`@DirtiesContext` 어노테이션을 사용하면, 테스트마다 별도의 컨텍스트를 로드하여 테스트할 수 있으므로 테스트 격리를 할 수 있게된다. 아래는 `@DirtiesContext` 를 사용하여, 인수테스트의 매 테스트 메소드마다 컨텍스트를 새로 띄워 테스트를 격리한 예시이다.

```java
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AcceptanceTest {
```

하지만 컨텍스트를 새로 로드하는 것은 비용이 큰 작업이다. 따라서 이 어노테이션은 사용 타당성이 충분히 확보된 상황에서 사용하는 것이 좋다고 한다. DirtiesContext를 제대로 이해하려면, ApplicationContext를 이해해야 할 것 같다.

내용이 방대하고 학습이 아직 부족해 충분한 학습 이후에 더 자세한 내용을 추후 포스팅 해볼 예정이다. DirtiesContext와 테스트 코드 최적화에 관련하여 **[[10분 테코톡] 🎃 손너잘의 테스트 코드 최적화 여행기](https://www.youtube.com/watch?v=N06UeRrWFdY)** 라는 좋은 발표 영상이 있으니 한번 시청하면 좋을 것 같다.

## 참고

- https://tecoble.techcourse.co.kr/post/2020-09-15-test-isolation/
- https://martinfowler.com/articles/nonDeterminism.html
- https://www.youtube.com/watch?v=N06UeRrWFdY&t=183s
- https://www.youtube.com/watch?v=OM_bN4wzd0g
