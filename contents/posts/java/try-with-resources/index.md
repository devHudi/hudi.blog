---
title: "[Java] try-with-resources"
date: 2022-04-19 23:00:00
tags:
  - Java
---

## 학습동기

레벨1 체스미션 구현 중 DAO(Data Access Object)를 처음 사용해보면서, 데이터베이스 연결 후 제대로 연결 해제를 해주지 않아 아래와 같은 피드백을 받게 되었다. 정확히는 데이터베이스와의 연결을 해제하는 메서드를 만들어두고 사용하지 않았다.

![https://github.com/woowacourse/java-chess/pull/419#discussion_r845061803](./review.png)

위 피드백에 대해 고민해보고, 이전에 들어본 키워드인 try-with-resources 를 사용하여, DAO에서 SQL을 사용한 직후 자원을 해제하도록 구현하였다.

## try-with-resources

자바7에 새롭게 추가된 예외 발생 여부와 상관없이 리소스를 해제하기 위한 기능이다. 여기서 리소스란 각종 입출려 스트림 (파일 등), 데이터베이스 연결, 소켓 등을 의미한다. try-with-resources 는 이런 리소스의 `close()` 메소드를 자동으로 실행하여 자원을 해제한다.

체스 미션에서 try-with-resources 를 사용한 예는 아래와 같다.

```java
public void createPiece(CreatePieceDto createPieceDto) {
    String query = String.format(
            "INSERT INTO %s(game_id, x_axis, y_axis, piece_type, piece_color) VALUES(?, ?, ?, ?, ?)",
            TABLE_NAME);

    try (Connection connection = getConnection()) { // try-with-resources 사용
        // 생략
    } catch (SQLException e) {
        throw new DatabaseException(e.getMessage());
    }
}
```

`getConnection()` 메소드는 데이터베이스 연결을 가져오는 메소드이다. 위와 같이 `try` 문에서 괄호 (`()`) 를 열어주고, 안에 자동으로 닫을 리소스를 선언한다. 이렇게 작성해주면, `try` 블럭이 정상적으로 실행됐거나, 예외가 발생하면 자동으로 명시된 자원을 해제해준다.

복수개의 자원을 사용하기 위해서는 아래와 같이 작성한다.

```java
try (
  FileInputStream fis = new FileInputStream("file1.txt");
  FileOutputStream fos = new FileOutputStream("file2.txt")
) {
  // ...
} catch(IOException e) {
  // ...
}
```

## AutoClosable 인터페이스

try-with-resources 를 사용하기 위해 해당 자원은 `AutoClosable` 인터페이스를 구현해야한다. `AutoClosable` 에는 `close()` 메소드가 정의되어 있다. try-with-resources 는 자원을 해제할 시점의 `AutoClosable`의 `close()` 메소드를 자동 호출한다.

```java
public class SomeResource implements AutoCloseable {
    @Override
    public void close() throws Exception {
        System.out.println("자원이 해제되었습니다.");
    }

    public void throwException() {
        throw new RuntimeException("예외 발생!");
    }
}
```

위와 같이 단순히 메세지를 출력하는 자원을 try-with-resources 를 사용하여 해제해보자.

```java
try (SomeResource resource = new SomeResource()) {
    // ...
} catch (Exception e) {
    // ...
}
```

위 코드를 실행하면 아래와 같이 정상적으로 자원이 해제되었다는 메세지가 출력되는 것을 확인할 수 있다.

```
자원이 해제되었습니다.
```

또한 아래와 같이 예외를 의도적으로 발생시켜보면 어떤 순서로 자원이 해제될까?

```java
try (SomeResource resource = new SomeResource()) {
    resource.throwException();
} catch (Exception e) {
    System.out.println(e.getMessage());
}
```

아래와 같이 자원을 먼저 해제한 다음 예외처리를 하는 것을 확인할 수 있다.

```java
자원이 해제되었습니다.
예외 발생!
```
