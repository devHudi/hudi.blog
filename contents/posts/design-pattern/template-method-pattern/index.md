---
title: "템플릿 메소드 패턴 (Template Method Pattern)"
date: 2022-04-01 15:00:00
tags:
  - 디자인패턴
  - 객체지향
  - Java
---

## 학습동기

우아한테크코스 레벨1 마지막 미션인 체스미션을 진행하며, 페어인 토르와 이야기하던 중 템플릿 메소드 패턴이라는 디자인 패턴을 알게 되었다. 페어 프로그래밍이 끝난 이후 내 체스 코드에도 비슷하게 템플릿 메소드 패턴을 적용해볼 수 있을 것 같아 사용해보았는데, 코드가 굉장히 깔끔하게 개선되었다.

## 코드로 라면 끓이기

템플릿 메서드 패턴이 무엇인지 설명하기 전에 직관적으로 필요성을 이해하기 위해, 라면을 끓이는 과정을 코드로 구현해본다. 우리는 진라면, 삼양라면, 너구리 이 3가지 라면을 끓일 것 이다. 어떤 종류의 라면을 끓이는지 상관없이, 국물 라면이라면 아래 순서대로 조리하는 것이 일반적일 것 이다.

> 가스 불을 켠다 → 냄비에 물을 받고 끓인다 → 라면을 준비한다 → 스프와 면을 넣는다 → 가스불을 끈다

하지만, '라면을 준비한다' 단계는 어떤 종류의 라면인지에 따라 구현이 달라질 것 이다.

### 템플릿 메소드 패턴이 없다면

템플릿 메소드 패턴을 사용하지 않고 진라면, 삼양라면, 너구리 3가지 라면을 모두 구체클래스로만 만들면 아래와 같을 것 이다.

```java
// JinRamyun.java
public class JinRamyun {
    public void cook() {
        System.out.println("가스불을 켠다.");
        System.out.println("냄비에 물을 받고 끓인다.");
        System.out.println("진라면을 준비한다."); // 이 부분만 다름
        System.out.println("스프와 면을 넣는다.");
        System.out.println("가스불을 끈다.");
    }
}

// SamyangRamyun.java
public class SamyangRamyun {
    public void cook() {
        System.out.println("가스불을 켠다.");
        System.out.println("냄비에 물을 받고 끓인다.");
        System.out.println("삼양라면을 준비한다."); // 이 부분만 다름
        System.out.println("스프와 면을 넣는다.");
        System.out.println("가스불을 끈다.");
    }
}

// NeoguriRamyun.java
public class NeoguriRamyun {
    public void cook() {
        System.out.println("가스불을 켠다.");
        System.out.println("냄비에 물을 받고 끓인다.");
        System.out.println("너구리 라면을 준비한다."); // 이 부분만 다름
        System.out.println("스프와 면을 넣는다.");
        System.out.println("가스불을 끈다.");
    }
}
```

3개의 클래스에서 실질적으로 다르게 구현된 단계는 'OO라면을 준비한다' 하나 밖에 없고, 나머지 4가지 작업에 대한 코드가 중복되는 것을 확인할 수 있다.

책 '실용주의 프로그래머' 에서는 중복을 해악이라고 표현한다. 그만큼 우리는 코드의 중복에 대해 항상 경계해야한다. 그렇다면 어떻게 위 코드에서 중복을 제거할 수 있을까?

## 템플릿 메소드 패턴

템플릿 메소드 패턴은 여러 작업들이 완전히 동일한 단계를 갖지만, 일부 동작은 각각 다르게 구현해야할 때 사용되는 패턴이다. 템플릿 메소드 패턴은 아래와 같이 두가지로 나뉜다.

1. **실행 과정을 구현한 상위 클래스 (추상 클래스)**
2. **실행 과정의 일부 단계를 구현한 하위 클래스 (구체 클래스)**

상위 클래스는 작업의 전체 흐름을 구현한다. 즉, **상위 클래스가 흐름 제어의 주체**가 된다. 그리고 각 구현체별 다르게 구현해야하는 **일부 동작은 추상 메소드로 따로 정의**한 다음, 그 추상 메소드를 호출하는 방식으로 구현하게 된다. 하위 클래스는 다르게 동작해야하는 부분 즉, 추상 메서드만 재정의하면 된다.

### 템플릿 메소드 패턴으로 중복 제거하기

위에서 설명한 것 처럼 라면 끓이기는 여러 작업들이 완전히 동일한 단계를 갖지만, 일부 동작 (라면 가져오기) 이 다르다. 템플릿 메소드 패턴을 사용하여 코드에서 중복을 제거해보자.

먼저 `Ramyun` 이라는 상위 클래스를 아래와 같이 구현한다.

```java
abstract class Ramyun {
    public void cook() {
        System.out.println("가스불을 켠다.");
        System.out.println("냄비에 물을 받고 끓인다.");

        getRamyun();

        System.out.println("스프와 면을 넣는다.");
        System.out.println("가스불을 끈다.");
    }

    protected abstract void getRamyun();
}
```

`Ramyun` 추상 클래스는 공통된 부분을 직접 `cook()` 메소드에 구현해놓았다. 그리고 라면의 종류마다 다르게 구현해야하는 라면을 준비하는 부분만 `getRamyun()` 이라는 추상 메소드로 분리해놓은 것을 확인할 수 있다.

```java
// JinRamyun.java
public class JinRamyun extends Ramyun {
    @Override
    protected void getRamyun() {
        System.out.println("진라면을 준비한다.");
    }
}

// SamyangRamyun.java
public class SamyangRamyun extends Ramyun {
    @Override
    protected void getRamyun() {
        System.out.println("삼양라면을 준비한다.");
    }
}

// NeoguriRamyun.java
public class NeoguriRamyun extends Ramyun {
    @Override
    protected void getRamyun() {
        System.out.println("너구리 라면을 준비한다.");
    }
}
```

그리고 각 하위 클래스에서는 구현체별로 다르게 처리해야하는 `getRamyun()` 메소드만 재정의한다. 위와 같이 템플릿 메서드 패턴을 사용하게 되면, 동일한 실행 과정의 구현을 제공하면서 하위 클래스에서 일부 단계를 구현하도록 할 수 있다. 따라서 불필요한 중복을 해소할 수 있다.

## 체스미션에서 적용한 템플릿 메소드 패턴

그렇다면 나는 이번 체스미션에서 템플릿 메소드 패턴을 어떻게 사용했을까?

### 템플릿 메소드 패턴 적용 전

체스 게임의 흐름을 위해 상태 패턴을 사용했는데, 여러 상태 중 '흑팀 차례 상태' 와 '백팀 차례 상태' 에서 아래와 같이 중복이 발생했다.

```java
// BlackTurn.java
public class BlackTurn extends InGame {

    // 생략

    @Override
    public GameState move(Position from, Position to) {
        Board board = getBoard();
        MoveResult moveResult = board.executeCommand(from, to, PieceColor.BLACK);
        // 구현이 다른 부분 (1)

        if (!moveResult.isMoveSuccess()) {
            throw new IllegalStateException("말을 이동하는 것에 실패했습니다.");
        }

        if (moveResult.isMoveResult(MoveResult.KILL_KING)) {
            return new ReadyToStart();
        }

        return new WhiteTurn(board);
        // 구현이 다른 부분 (2)
    }
}

// WhiteTurn.java
public class WhiteTurn extends InGame {

    // 생략

    @Override
    public GameState move(Position from, Position to) {
        Board board = getBoard();
        MoveResult moveResult = board.executeCommand(from, to, PieceColor.WHITE);
        // 구현이 다른 부분 (1)

        if (!moveResult.isMoveSuccess()) {
            throw new IllegalStateException("말을 이동하는 것에 실패했습니다.");
        }

        if (moveResult.isMoveResult(MoveResult.KILL_KING)) {
            return new ReadyToStart();
        }

        return new BlackTurn(board);
        // 구현이 다른 부분 (2)
    }
}
```

`move()` 메소드에서 실질적으로 구현이 다른 부분은 주석으로 표시한 2번째 라인과 마지막 라인이다. 나머지 코드는 모두 중복이었다.

### 템플릿 메소드 적용 후

`BlackTurn` 과 `WhiteTurn` 은 둘다 `InGame` 이라는 추상 클래스를 상속 받는다. 기존에는 `InGame` 에서 `move()` 를 구현하지 않았는데, 아래와 같이 변경했다.

```java
@Override
public GameState move(Position from, Position to) {
    Board board = getBoard();
    MoveResult moveResult = board.executeCommand(from, to, getCurrentPieceColor());

    if (!moveResult.isMoveSuccess()) {
        throw new IllegalStateException("말을 이동하는 것에 실패했습니다.");
    }

    if (moveResult.equals(MoveResult.KILL_KING)) {
        return new ReadyToStart();
    }

    return getNextTurnState();
}

protected abstract PieceColor getCurrentPieceColor();

protected abstract GameState getNextTurnState();
```

현재 차례인 색상을 가져오는 `getCurrentPieceColor()` 메소드와 다음 차례 색상의 상태를 반환하는 `getNestTurnState()` 를 별도의 추상 메소드로 정의하였다. `BlackTurn` 과 `WhiteTurn` 은 이제 두 추상 메소드만 아래와 같이 재정의해주면 된다.

```java
// BlackTurn.java
public class BlackTurn extends InGame {

    // 생략

    @Override
    protected PieceColor getCurrentPieceColor() {
        return PieceColor.BLACK;
    }

    @Override
    protected GameState getNextTurnState() {
        return new WhiteTurn(getBoard());
    }
}

// WhiteTurn.java
public class WhiteTurn extends InGame {

    // 생략

    @Override
    protected PieceColor getCurrentPieceColor() {
        return PieceColor.WHITE;
    }

    @Override
    protected GameState getNextTurnState() {
        return new BlackTurn(getBoard());
    }
}
```

## 마치며

충분한 경험 없는 상태로 디자인패턴을 공부하는 것은 생각을 되려 가두게 된다는 이야기를 우아한테크코스 내에서 많이 들었다. 그래서 나도 디자인패턴 없는 상태로 충분히 불편을 먼저 겪어본 다음 디자인패턴을 학습하자는 생각을 하고 있었다.

그리고 이번 미션에서와 같이 먼저 중복이 발생한 코드를 접하고, 그 뒤에 코드의 중복을 제거할 수 있는 디자인패턴을 적용해보니 필요성에 대해 더 깊게 이해되는 경험을 하게 되었다.
