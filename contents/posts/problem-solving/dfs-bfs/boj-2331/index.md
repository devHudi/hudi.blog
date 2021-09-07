---
title: "[PS #29] 반복수열 (2331)"
date: 2021-09-07 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/2331
- **난이도** : 실버 IV
- **주제** : DFS/BFS
- **풀이 일자** : `2021/09/07`

## 2. 문제 접근

백준 DFS 문제 리스트에서 찾아 풀이한 문제인데, 굳이 DFS/BFS 같은 알고리즘을 사용해야하나? 라는 의문이 드는 문제였다.

반복을 검사하는 조건은 수열이 진행하면서 이전에 등장한 숫자가 또 한번 등장했을 때 이다. 이 수를 기준으로 수열의 좌측 수들의 개수를 출력하면 된다.

## 3. 소스코드

### 3-1. DFS 를 사용하지 않은 풀이

```python
a, p = map(int, input().split(" "))

sequence = [a]

cur = a
while True:
    cur = sum(map(lambda n: int(n) ** p, str(cur)))
    if cur in sequence:
        print(len(sequence[:sequence.index(cur)]))
        break

    sequence.append(cur)
```

### 3-2. DFS 를 사용한 풀이

```python
a, p = map(int, input().split(" "))

visited = [0] * (236196 + 1) # (9^5) * 4 + 1
def dfs(number, p, visited):
    if visited[number] == 2:
        return visited

    visited[number] += 1
    next_number = sum(map(lambda n: int(n) ** p, str(number)))
    return dfs(next_number, p, visited)

result = dfs(a, p, visited)
print(
    sum(filter(lambda n: n == 1, result))
)
```

굳이 DFS 를 쓰겠다면, 위와 같이 짜볼 수 있겠다. 다른 풀이를 보면 위 코드와 같이 `visited` 변수의 길이를 미리 지정해놓고 생성하는데, 사실 이는 아래와 같이 해시를 사용하면 길이 예측을 할 필요가 없다.

```python
from collections import defaultdict

a, p = map(int, input().split(" "))

visited = defaultdict(lambda: 0)

# ...

result = dfs(a, p, visited)
print(
    sum(filter(lambda n: n == 1, result.values()))
)
```

## 4. 배운점

이런 1차원 데이터를 재귀적으로 탐색하는 것도 DFS 라는 것을 알게되었다.
