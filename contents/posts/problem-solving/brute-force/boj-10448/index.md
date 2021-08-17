---
title: "[PS #18] 유레카 이론 (10448)"
date: 2021-08-17 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/10448
- **난이도** : 브론즈 II
- **주제** : 완전탐색
- **풀이 일자** : `2021/08/17`

## 2. 문제 접근

삼각수 리스트를 만들어 반환하는 `get_triangular_numbers` 를 우선 구현하였다. 어떠한 삼각수는 `이전 삼각수의 밑면 개수 + 1` 만큼 크다. 이 원리를 이용하여 삼각수 리스트를 산출한다. 또한 세개의 수를 합하여 주어진 수를 만드는데, 주어진 수보다 큰 삼각수는 의미 없다. 따라서 주어진 `n` 보다 작은 삼각수만을 산출한다.

지금까지 써온 `itertools.combinations` 는 중복을 허용하지 않는 조합이다. `itertools` 에는 `combinations_with_replacement` 라는 메소드가 따로 존재한다. 이 메소드는 중복을 허용하는 조합을 계산할 수 있다. 같은 삼각수를 여러번 더해도 되는 것이 문제의 조건이었으므로, 중복조합으로 경우의수를 계산한다.

계산된 조합을 각각 `sum` 으로 덧셈하여 주어진 수와 일치하면 `1` 을, 그렇지 않으면 `0` 을 출력한다.

## 3. 소스코드

```python
from itertools import combinations_with_replacement

def get_triangular_numbers(n):
    numbers = []
    current = 0
    last_row = 1
    while current <= n:
        current += last_row
        last_row += 1
        numbers.append(current)

    return numbers

def is_eureka(n):
    triangular_numbers = get_triangular_numbers(n)
    combs = list(combinations_with_replacement(triangular_numbers, 3))
    for c in combs:
        if sum(c) == n:
            return True

    return False

if __name__ == "__main__":
    loop = int(input())
    numbers = []

    for _ in range(loop):
        n = int(input())

        if is_eureka(n):
            print(1)
        else:
            print(0)
```

## 4. 배운점

`combinations` 로 조합을 구현하는 것 뿐만 아니라 `combinations_with_replacement` 라는 메소드로 중복 조합을 구현하는 방법을 알게되었다.

백준에서 문제를 제대로 풀어본 것은 이번이 처음이다. 프로그래머스에서는 입출력을 함수로 구현하는데 반에 백준은 표준입출력을 통해 경우에 따라 입력값을 파싱하는 경우도 있다고 한다. 여러 코딩테스트 플랫폼을 경험해보는 것도 중요한 것 같다.
