---
title: "[PS #06] 폰켓몬 (1845)"
date: 2021-07-26 06:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/1845
- **난이도** : Level 1
- **풀이 일자** : `2021/07/26`

## 2. 문제 접근

선택할 수 있는 최대 폰켓몬의 **종류** 를 구하는 문제. 파이썬의 `set` 을 활용해서 중복되는 폰켓몬을 제거하면 종류만 남게 된다. 종류의 개수가 선택가능 횟수보다 크면 선택가능 횟수를 반환하고, 작다면 종류의 개수를 반환한다.

## 3. 소스코드

```python
def solution(nums):
    choice = len(nums) / 2
    remove_duplicated = set(nums)

    if len(remove_duplicated) <= choice:
        return len(remove_duplicated)
    else:
        return choice
```

## 4. 배운점

문제 난이도 선별을 잘못한 것 같다. 너무 허무하게 쉽게 풀려버려서...
