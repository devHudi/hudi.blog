---
title: "[PS #27] 1, 2, 3 더하기 (9095)"
date: 2021-09-03 03:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/9095
- **난이도** : 실버 III
- **주제** : 다이나믹 프로그래밍
- **풀이 일자** : `2021/09/03`

## 2. 문제 접근

이전에 풀이한 [1로 만들기](/boj-1463) 와 굉장히 유사한 문제이다. 1 더하기, 2 더하기, 3 더하기 각 케이스별로 재귀를 돌려 문제를 풀 수 있었다. 주의할 점은 조합의 개념이 아니라 순열의 개념으로 풀어야한다. `1 + 1 + 2` 와 `1 + 2 + 1` 은 다른 케이스이다.

그런데, 문제를 다 풀고난 후 다른사람의 풀이를 살펴보니 나처럼 재귀를 이용한 풀이가 보이지 않았다. 어디서 언뜻 'DP는 점화식을 정의하는 방법이다' 라는 소리를 들었던 것 같다. 다른 사람은 다들 귀납적으로 결과값은 최근 3개의 개수를 모두 더한 결과값이라는 것을 알아내신 것 같다. n의 제한조건이 11보다 작은 양의 정수라서 일일히 시도해볼만도 한 것 같다. 그래서 나도 점화식으로 다시 풀어보았다.

## 3. 소스코드

### 3-1. 재귀를 이용한 풀이

```python
test_case_count = int(input())
test_cases = list()

for _ in range(test_case_count):
    test_cases.append(int(input()))

for test_case in test_cases:
    cases = list()

    def recursion(numbers):
        global cases

        s = sum(numbers)

        if s == test_case:
            cases.append(numbers)
            return

        if s + 1 <= test_case: recursion(numbers + [1])
        if s + 2 <= test_case: recursion(numbers + [2])
        if s + 3 <= test_case: recursion(numbers + [3])

    recursion([])
    print(len(cases))
```

### 3-2. 점화식을 이용한 풀이

```python
test_case_count = int(input())
test_cases = list()

for _ in range(test_case_count):
    test_cases.append(int(input()))

for test_case in test_cases:
    l = [1, 2, 4]
    if test_case < 4:
        print(l[test_case - 1])
        continue

    for _ in range(test_case - 3):
        l.append(l[-1] + l[-2] + l[-3])

    print(l[-1])
```

## 4. 배운점

**'DP 는 점화식을 세워 풀이한다'** 를 기억하고 있어야겠다. 처음에 어느정도 귀납적으로 접근을 해야하는 것 같다.
