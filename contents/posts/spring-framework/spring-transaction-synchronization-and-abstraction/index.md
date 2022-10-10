---
title: "스프링 트랜잭션 동기화 및 추상화"
date: 2022-10-10 17:40:00
tags:
  - 학습기록
  - spring
  - jdbc
---

## JDBC에서 트랜잭션 사용하기

데이터베이스에서 단순히 `INSERT` 문 하나만 단독으로 실행해도 데이터베이스에 쿼리 결과가 반영되는 것을 확인할 수 있다. 내부적으로 커밋을 자동으로 해주는 **auto commit** 기능 덕분이다 ([참고](https://dev.mysql.com/doc/refman/8.0/en/innodb-autocommit-commit-rollback.html)).

하지만, 우리는 여러개의 커밋을 하나의 논리적인 단위로 묶어 실행해야하는 일이 자주 있다. 그리고 그 단위는 **원자적(atomic)**으로 동작해야한다. 이것을 우린 트랜잭션이라고 한다. auto commit이 활성화 되어 있는 상태에서는 각각의 단일 쿼리가 별개의 트랜잭션으로 동작하게 되어 원자성을 갖지 못하고, 롤백 또한 어렵다.

JDBC를 사용한다면 이런 원자성을 보장하기 위해 auto commit 기능을 비활성화 하고 우리가 직접 커밋과 롤백의 시점을 지정해줘야한다.

`Connection` 은 `setAutoCommit()` 이라는 메소드를 통해 auto commit의 활성화 여부를 제어할 수 있도록 한다. `UserDao` 라는 DAO가 있다고 해보자. 그리고 우리는 회원가입 기능을 구현할 것이다. 회원가입이 되면 `user` 테이블에 유저를 추가하고, `message` 테이블에 회원가입 축하 메시지를 추가할 것이다. 이는 하나의 트랜잭션에 묶여 동작해야할 것이다. 이를 코드로 나타내보자.

`UserDao` 코드이다.

```java
public class UserDao {

    public void saveUser(final Connection connection, final String name) {
        try {
            String sql = "INSERT INTO user(name) VALUES(?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, name);
            preparedStatement.execute();
        } catch (final SQLException e) {
            e.printStackTrace();
        }
    }
}
```

`MessageDao` 코드이다.

```java
public class MessageDao {

    public void saveMessage(final Connection connection, final String message) {
        try {
            String sql = "INSERT INTO message(content) VALUES(?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, message);
            preparedStatement.execute();
        } catch (final SQLException e) {
            e.printStackTrace();
        }
    }
}
```

이상한점이 있다. 위 2개의 DAO는 내부에서 `Connection` 을 생성하지 않고 파라미터로 주입받아 사용한다. 트랜잭션을 사용하기 위해서는 트랜잭션을 구성하는 여러개의 쿼리가 동일한 커넥션에서 실행되어야 하기 때문이다. 아래 `UserService` 코드를 보면 이해가 될 것이다.

```java
public class UserService {

    // ...

    public void register(final String name) {
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            connection.setAutoCommit(false);

            userDao.saveUser(connection, name);
            messageDao.saveMessage(connection, name + "님 가입을 환영합니다.");

            connection.commit();
        } catch (final SQLException e) {
            try {
                connection.rollback();
            } catch (final SQLException ignored) {
            }
        } finally {
            try {
                connection.close();
            } catch (final SQLException ignored) {
            }
        }
    }
}
```

서비스 레이어의 관심사는 비즈니스 로직이다. 하지만, 트랜잭션을 사용하기 위해서는 `UserDao` 와 `MessageDao` 에서 실행되는 쿼리가 동일한 커넥션을 사용해야한다. 따라서 불가피하게 `UserService` 에도 커넥션을 생성하고, 각 DAO에 주입하는 쿼리가 생긴 것이다. 그리고 JDBC를 사용하면 따라오게 되는 try/catch/finally 보일러 플레이트도 발생하였다. 

Service 에서는 커넥션을 생성하고, 트랜잭션 경계를 설정하는 코드가 비즈니스 로직과 뒤섞이게 되고, DAO 에서는 데이터 액세스 기술이 Service 레이어에 종속된다.

> 이때, 트랜잭션의 경계란 트랜잭션이 시작되고 끝나는 지점을 의미한다.
> 

## 트랜잭션 동기화

일단 생성한 `Connection` 을 공유하기 위해 계속 파라미터로 전달하는 코드 먼저 제거해보자. 스프링에서는 이런 문제를 어떻게 해결하고 있을까? 바로 **트랜잭션 동기화(transaction synchronization)**다. 트랜잭션 동기화는 트랜잭션을 시작하기 위해 생성한 `Connection` 객체를 별도의 특별한 공간에 보관하고, 이 커넥션이 필요한 곳 (여기서는 DAO) 에서 커넥션을 꺼내 쓰는 방식이다.

그리고 이 동기화 작업은 쓰레드마다 독립적으로 `Connection` 객체를 보관하므로 멀티 쓰레드 환경에서도 걱정없이 사용할 수 있다.

스프링에서는 `TransactionSynchronizationManager` 라는 클래스를 사용해서 트랜잭션을 동기화한다. 한번 이 클래스를 사용하여 위 코드를 개선해보자. 커넥션을 가져올때 `DataSource` 가 필요하므로 일단 데이터 소스에 대한 설정을 `application.yml` 에 추가하자.

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/database-name
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```

그리고 `DataSource` 빈을 주입받기 위해 `UserService` 에는 `@Service` , `UserDao` 와 `MessageDao` 는 `@Repository` 애노테이션을 추가하였다. 그리고 `UserService` 는 DAO들을 직접 생성하지 않고, 외부에서 주입받도록 코드를 변경하였다.

```java
@Service
public class UserService {

    private final DataSource dataSource;
    private final UserDao userDao;
    private final MessageDao messageDao;

    public UserService(final DataSource dataSource, final UserDao userDao, final MessageDao messageDao) {
        this.dataSource = dataSource;
        this.userDao = userDao;
        this.messageDao = messageDao;
    }
// ...
```

`UserService` 는 `TransactionSynchronizationManager` 클래스를 사용하여 트랜잭션 동기화 작업을 활성화하고, `DataSourceUtils` 라는 헬퍼 클래스를 통해 커넥션을 가져온다.

```java
@Service
public class UserService {

    // ...

    public void register(final String name) {
        TransactionSynchronizationManager.initSynchronization();
        // 트랜잭션 동기화 초기화

        Connection connection = DataSourceUtils.getConnection(dataSource);
        // 커넥션 획득

        try {
            connection.setAutoCommit(false);

            userDao.saveUser(name);
            messageDao.saveMessage(name + "님 가입을 환영합니다.");

            connection.commit();
        } catch (final SQLException e) {
            try {
                connection.rollback();
            } catch (final SQLException ignored) {
            }
        } finally {
            DataSourceUtils.releaseConnection(connection, dataSource);
            // 커넥션 자원 해제
        }
    }
}
```

`UserDao` 와 `MessageDao` 는 외부에서 `Connection` 을 전달받지 않고, `DataSourceUtils` 를 사용해서 커넥션을 꺼내오도록 코드가 변경되었다. 아래는 `UserDao` 코드이다.

```java
@Repository
public class UserDao {

    private final DataSource dataSource;

    public UserDao(final DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void saveUser(final String name) {
        Connection connection = DataSourceUtils.getConnection(dataSource);

        try {
            String sql = "INSERT INTO user(name) VALUES(?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, name);
            preparedStatement.execute();
        } catch (final SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## 트랜잭션 추상화

위에서 `TransactionSynchronizationManager` 클래스를 통해 `Connection` 을 전달하는 코드를 제거해보았다. 하지만, 아직 `UserService` 코드에는 `Connection` 을 통해 직접적으로 트랜잭션 경계를 설정하는 코드가 남아있다. 스프링에서는 트랜잭션 추상화를 위해 `PlatformTransactionManager` 인터페이스를 제공한다. 이 인터페이스를 사용하면 트랜잭션 경계를 지정하는 과정을 추상화할 수 있다.

```java
public interface PlatformTransactionManager extends TransactionManager {

		TransactionStatus getTransaction(@Nullable TransactionDefinition definition)
         throws TransactionException;

		void commit(TransactionStatus status) throws TransactionException;

		void rollback(TransactionStatus status) throws TransactionException;
}
```

`PlatformTransactionManager` 는 위와 같이 3개의 메소드를 정의한다. 즉, `PlatformTransactionManager` 는 트랜잭션이 어디에서 시작되고 종료되는지, 종료는 정상(commit)인지 비정상(rollback)인지를 결정한다.

스프프링은 트랜잭션 전파라는 특징을 가지고 있어, 자유롭게 트랜잭션을 서로 조합하고 트랜잭션의 경계를 확장할 수 있다. 따라서 `begin()` 이라는 네이밍 대신 트랜잭션을 가져온다라는 의미의 `getTransaction()` 을 사용한다.

`PlatformTransactionManager` 의 구현 클래스는 `DataSourceTransactionManager`, `JpaTransactionManager`, `HibernateTransactionManager`, `JmsTransactionManager`, `CciTransactionManager`, `JtaTransactionManager` 등이 있다. 나는 `DataSourceTransactionManager` 를 사용하여 실습해볼 예정이다.

```java
@Service
public class UserService {

    // ...

    public void register(final String name) {
        PlatformTransactionManager transactionManager = new DataSourceTransactionManager(dataSource);
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        try {
            userDao.saveUser(name);
            messageDao.saveMessage(name + "님 가입을 환영합니다.");

            transactionManager.commit(status);
        } catch (RuntimeException e) {
            transactionManager.rollback(status);
        }
    }
}
```

`DataSourceTransactionManager` 를 사용하여 트랜잭션 경계를 설정하는 코드가 조금 더 간결해졌다. 위 코드를 보면 알 수 있듯이 `PlatformTransactionManager` 를 사용하니 트랜잭션 동기화를 하기 위한 코드도 제거되었다. 즉, `PlatformTransactionManager` 는 트랜잭션 동기화 로직도 추상화한다.

위에서 사용된 `TransactionDefinition` 은 트랜잭션의 네 가지 속성 (Transaction Propagation, Isolation Level, Timeout, Read Only)를 나타내는 인터페이스이다. `DefaultTransactionDefinition` 이라는 구현체를 사용하여 트랜잭션을 가져왔다.

`TransactionStatus` 는 현재 참여하고 있는 트랜잭션의 ID와 구분 정보를 담고있다. 커밋과 롤백시 이 정보를 통해 트랜잭션을 식별한다.

```java
public void registerSpecial(final String name) {
    DataSourceTransactionManager txManager = new DataSourceTransactionManager(dataSource);
    TransactionStatus status = txManager.getTransaction(new DefaultTransactionDefinition());

    try {
        register(name);
        messageDao.saveMessage(name + "님은 특별 회원입니다.");

        txManager.commit(status);
    } catch (RuntimeException e) {
        txManager.rollback(status);
    }
}
```

`UserService` 에 위와 같은 메소드를 추가하여, 트랜잭션이 잘 전파되는지 확인해보았다. `registerSpecial()` 메소드에서 `register()` 메소드를 내부적으로 호출하여 트랜잭션 전파를 유도했다. 테스트 결과 두 트랜잭션이 조합되어 원자성을 잘 띄는 것을 확인했다.

이 `PlatformTransactionManager` 는 사실 우리가 일반적으로 사용할일은 거의 없다. 그러면 우리는 어떤 방식으로 트랜잭션 추상화를 누리고 있던것일까?`PlatformTransactionManager` 의 [**Javadoc**](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/PlatformTransactionManager.html)을 한번 읽어보자.

> _Applications can use this directly, but it is not primarily meant as an API: Typically, applications will work with either TransactionTemplate or **declarative transaction demarcation through AOP**._

**AOP를 통한 선언적 트랜잭션 경계(declarative transaction demarcation through AOP)**… 우리가 질리도록 사용한 `@Transactional` 애노테이션을 이야기하는 것이다. 즉 우리는 `@Transactional` 애노테이션이 내부적으로 어떻게 동작한 것인지 알아본 것이다.

## 마치며

트랜잭션 동기화, 추상화… 처음에는 어렵게만 느껴졌는데, 지금도 어렵게 느껴진다 🥲 그래도 우테코 JDBC 미션을 진행하며 모르는 개념이 뭉탱이로 등장했는데, 조금은 그 개념들이 머리속에서 정리된 기분이다. 다음에는 트랜잭션 전파에 대해서도 공부해봐야겠다.

## 참고

- 토비의 스프링 3.1, 이일민
- [https://jongmin92.github.io/2018/04/08/Spring/toby-5/](https://jongmin92.github.io/2018/04/08/Spring/toby-5/)
- [https://steady-coding.tistory.com/570](https://steady-coding.tistory.com/570)