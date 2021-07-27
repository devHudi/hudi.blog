---
title: "[PS #10] 2 x n 타일링 (12900)"
date: 2021-07-27 03:00:00
tags:
  - CSE
  - problem-solving
  - algorithm
  - python
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/12900
- **난이도** : Level 3
- **풀이 일자** : `2021/07/27`

## 2. 문제 접근

일단 가로크기를 1을 차지하는 경우와 2를 차지하는 경우 나눔.
가로크기를 1을 차지하는 경우는 블럭을 세로로 배치하는경우.
2를 차지하는 경우는 가로로 2개를 배치하는 경우.
패턴은 2개로밖에 나뉘어지지 않음.

그 것 끼리 조합을 일단 구함

그 뒤로 그걸 순열을 구하려고함

순열 구할 때 itertools.permutations 쓰면 시간초과됨
왜냐하면 1과 2만 이뤄진 긴 리스트를 순열연산하려다보니 중복된 결과가 많이나옴 => 모든 테스트케이스에서 시간초과

인터넷을 뒤져서 같은것이 있는 순열 공식을 가져옴
일단 정확성 테스트에서 2개를 제외하고 모두 시간안에 문제 풀이 성공. 2개는 여전히 시간초과

## 3. 소스코드

### 3-1. 첫번째 시도

```python
from itertools import permutations

def solution(n):
    one_area_cnt = n % 2
    two_area_cnt = (n - one_area_cnt) // 2

    areas_combinations = []
    for i in range(two_area_cnt + 1):
        areas_combinations.append( [2] * i )
        areas_combinations[i].extend([1] * ((two_area_cnt - i) * 2 + one_area_cnt))

    areas_permutations = []
    for area in areas_combinations:
        areas_permutations.extend(
            permutations(area)
        )
    areas_permutations = set(areas_permutations)

    return len(areas_permutations) % 1000000007

```

### 3-2. 두번째 시도

```python
from itertools import permutations
from math import factorial

def solution(n):
    one_area_cnt = n % 2
    two_area_cnt = (n - one_area_cnt) // 2

    areas_combinations = []
    for i in range(two_area_cnt + 1):
        areas_combinations.append( [2] * i )
        areas_combinations[i].extend([1] * ((two_area_cnt - i) * 2 + one_area_cnt))

    ret = 0
    for area in areas_combinations:
        one_count = area.count(1)
        two_count = area.count(2)
        ret += factorial(one_count + two_count) // (factorial(one_count) * factorial(two_count))

    return ret % 1000000007
```

### 3-3. 세번째 시도

```python
from math import factorial

def solution(n):
    max_one_area_cnt = n % 2
    max_two_area_cnt = (n - max_one_area_cnt) // 2

    areas_combinations = []
    for i in range(max_two_area_cnt + 1):
        one_count = (max_two_area_cnt - i) * 2 + max_one_area_cnt
        two_count = i

        areas_combinations.append(
            (one_count, two_count)
        )

    ret = 0
    for area in areas_combinations:
        one_count = area[0]
        two_count = area[1]
        ret += factorial(one_count + two_count) // factorial(one_count) * factorial(two_count)

    return ret % 1000000007
```

### 3-4. 네번째 시도

```python
def factorial(x, start=1):
    ret = 1
    for v in range(start, x + 1):
        ret *= v

    return ret

def solution(n):
    max_one_area_cnt = n % 2
    max_two_area_cnt = (n - max_one_area_cnt) // 2

    areas_combinations = []
    for i in range(max_two_area_cnt + 1):
        one_count = (max_two_area_cnt - i) * 2 + max_one_area_cnt
        two_count = i

        areas_combinations.append(
            (one_count, two_count)
        )

    ret = 0
    for area in areas_combinations:
        one_count = area[0]
        two_count = area[1]

        smaller = one_count if one_count < two_count else two_count
        larger = one_count if one_count >= two_count else two_count

        ret += factorial(one_count + two_count, larger + 1) // factorial(smaller)

    return ret % 1000000007


```

## 4. 배운점

같은 것이 있는 순열 계산 방법을 알게 되었다

각 연산 단위별로 time 모듈을 사용해 시간 체크를 하며 어느 구간에서 시간이 많이 지체되는지 체크하였다.
