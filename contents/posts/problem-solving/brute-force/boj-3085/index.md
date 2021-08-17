---
title: "[PS #19] 사탕 게임 (3085)"
date: 2021-08-17 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/3085
- **난이도** : 실버 IV
- **주제** : 완전탐색
- **풀이 일자** : `2021/08/17`

## 2. 문제 접근

모든 칸을 순회하면서, 우측 칸과 Swap 한 뒤 가로, 세로 축 각각 연속된 캔디 개수 중 최대값을 센다. Swap 한 캔디를 원래대로 돌려놓기 위해 다시 Swap 한다. 그 다음 아래 쪽으로도 Swap 하고 마찬가지로 연속된 캔디의 최대값을 세고, 다시 Swap 한다.

`4292ms` 의 소요시간으로 통과하였다. 내 생각엔 턱걸이를 한 것 같다. 다른 정답자들 소요 시간을 조회해보니 2자리수 대로 통과하신 분들도 굉장히 많았다. 당장은 이 코드에서 더 최적화 하기는 어려울 것 같아, 제출하고 마무리하였다.

(수정) 이후 가로, 세로 방향으로 연속된 캔디의 최대값을 세는 로직에서 Swap 이 영향을 끼치는 라인만 검사하도록 코드를 개선하였다. 예를 들어 `swap_right` 를 하면 좌우 캔디 두개에 해당하는 Y축 두개와, X축 하나만을 검사하는 것 이다. 이결과 약 4000ms 로 동작하던 코드를 200ms 로 획기적으로 줄였다.

## 3. 소스코드

### 3-1. 최적화 전

```python
class Board:
    def __init__(self, size):
        self.size = size
        self.board = [[None] * size for _ in range(size)]

    def place_candy(self, x, y, color):
        self.board[y][x] = color

    def swap_right(self, x, y):
        if x + 1 >= self.size: return False
        self.board[y][x], self.board[y][x + 1] = self.board[y][x + 1], self.board[y][x]

    def swap_down(self, x, y):
        if y + 1 >= self.size: return False
        self.board[y][x], self.board[y + 1][x] = self.board[y + 1][x], self.board[y][x]

    def h_sequence(self):
        counts = set()

        for y in range(self.size):
            current_row = self.board[y]
            current = current_row[0]
            count = 0

            for x in range(self.size):
                pointer = current_row[x]

                if current != pointer:
                    current = current_row[x]
                    counts.add(count)
                    count = 0

                count += 1

            counts.add(count)

        return max(counts)

    def v_sequence(self):
        counts = set()

        for x in range(self.size):
            current = self.board[0][x]
            count = 0

            for y in range(self.size):
                pointer = self.board[y][x]

                if current != pointer:
                    current = self.board[y][x]
                    counts.add(count)
                    count = 0
                count += 1

            counts.add(count)

        return max(counts)

    def search(self):
        arr = []
        for y in range(self.size):
            for x in range(self.size):
                self.swap_right(x, y)
                arr.append(self.h_sequence())
                arr.append(self.v_sequence())
                self.swap_right(x, y)

                self.swap_down(x, y)
                arr.append(self.h_sequence())
                arr.append(self.v_sequence())
                self.swap_down(x, y)

        return max(arr)

if __name__ == "__main__":
    size = int(input())
    b = Board(size)

    for y in range(size):
        row = input()

        for x, col in enumerate(row):
            b.place_candy(x, y, col)

    print(b.search())
```

### 3-2. 최적화 후

```python
class Board:
    def __init__(self, size):
        self.size = size
        self.board = [[None] * size for _ in range(size)]

    def place_candy(self, x, y, color):
        self.board[y][x] = color

    def swap_right(self, x, y):
        if x + 1 >= self.size: return False
        self.board[y][x], self.board[y][x + 1] = self.board[y][x + 1], self.board[y][x]

    def swap_down(self, x, y):
        if y + 1 >= self.size: return False
        self.board[y][x], self.board[y + 1][x] = self.board[y + 1][x], self.board[y][x]

    def h_sequence(self, y):
        if y >= self.size: return 0

        counts = set()

        current_row = self.board[y]
        current = current_row[0]
        count = 0

        for x in range(self.size):
            pointer = current_row[x]

            if current != pointer:
                current = current_row[x]
                counts.add(count)
                count = 0

            count += 1

        counts.add(count)

        return max(counts)

    def v_sequence(self, x):
        if x >= self.size: return False

        counts = set()

        current = self.board[0][x]
        count = 0

        for y in range(self.size):
            pointer = self.board[y][x]

            if current != pointer:
                current = self.board[y][x]
                counts.add(count)
                count = 0
            count += 1

        counts.add(count)

        return max(counts)

    def search(self):
        arr = []
        for y in range(self.size):
            for x in range(self.size):
                self.swap_right(x, y)
                arr.append(self.h_sequence(y))
                arr.append(self.v_sequence(x))
                arr.append(self.v_sequence(x + 1))
                self.swap_right(x, y)

                self.swap_down(x, y)
                arr.append(self.h_sequence(y))
                arr.append(self.h_sequence(y+1))
                arr.append(self.v_sequence(x))
                self.swap_down(x, y)

        return max(arr)

if __name__ == "__main__":
    size = int(input())
    b = Board(size)

    for y in range(size):
        row = input()

        for x, col in enumerate(row):
            b.place_candy(x, y, col)

    print(b.search())
```

## 4. 배운점

처음에 일정 크기의 빈 2차원 배열을 만들기 위해 아래와 같이 코드를 작성하였다.

```python
board = [[None] * 3] * 3
```

이상했던 점은 아래와 같이 특정 원소를 대입하는 코드를 실행하였을 때, 다른 원소의 값도 변경되는 현상이었다.

```python
board[0][0] = "A"

print(board) # [['A', None, None], ['A', None, None], ['A', None, None]]
```

`id` 함수로 객체의 고유 값을 확인해 보니 모두 같은 것을 확인할 수 있었다.

```python
print(id(board[0])) # 4346642560
print(id(board[1])) # 4346642560
print(id(board[2])) # 4346642560
```

파이썬의 리스트 곱 연산자는 **얕은 복사 (Shallow Copy)** 가 되어 모두 같은 리스트 객체를 레퍼런스 하고 있었던 것 이었다. **깊은 복사 (Deep Copy)** 를 위해서는 리스트 컴프리헨션 (List Comprehension) 을 사용해야했다.

```python
board = [[None] * 3 for _ in range(3)]
```
