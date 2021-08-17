---
title: "[PS #16] 소수 찾기 (42839)"
date: 2021-08-16 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42839
- **난이도** : Level 2
- **주제** : 완전탐색
- **풀이 일자** : `2021/08/16`

## 2. 문제 접근

예전에 자주 활용한 `itertools` 의 `permutations` 로 주어진 문자열에 대해 순열을 구해 만들어질 수 있는 모든 수를 산출한뒤, 소수 판별 함수를 통해 모든 경우를 다 검사해보았다.

## 3. 소스코드

```python
from math import sqrt
from itertools import permutations


def is_prime(n):
    if n <= 1:
        return False
    if n == 2:
        return True

    root = sqrt(n)
    for i in range(2, int(root) + 2):
        if n % i == 0:
            return False

    return True


def solution(numbers):
    perms = []
    for i in range(1, len(numbers) + 1):
        perms.extend(int(''.join(n)) for n in
                     list(permutations(numbers, i)))

    prime_numbers = set()
    for n in perms:
        if is_prime(n):
            prime_numbers.add(n)

    return len(prime_numbers)

```

## 4. 배운점

예전에 잠깐 **에라토스테네스의 체** 알고리즘을 본적이 있다. 각 수의 소수(Prime Number) 여부를 판별하기 위해 2부터 그 수 까지 전부 나눠보는 것이 아니라, 그 수의 제곱근보다 작은 수 까지만 검사한다. 수를 나눌 때 '나누는 수' 와 '몫' 이 발생하게 되는데, 어떤 수가 특정 수로 나누어 질 때 몫과 나누는 수 둘 중 하나는 반드시 수의 제곱근 이하에 존재한다.

위 조건을 바탕으로 `is_prime` 함수를 정의 하였고, 순열로 산출한 각 수의 소수 여부를 판별하여 `set` 에 넣고, 길이를 반환하였다.
