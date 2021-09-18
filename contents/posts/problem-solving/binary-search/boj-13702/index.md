---
title: "[PS #36] 이상한 술집 (13702)"
date: 2021-09-18 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/13702
- **난이도** : 실버 III
- **주제** : 이진 탐색
- **풀이 일자** : `2021/09/18`

## 2. 문제 접근

리스트가 아닌 정수데이터에서도 이진탐색으로 접근할 수 있다는 간단한 아이디어를 떠올리는데 아주 조금 애먹었다.

일반적인 이진 탐색과 같이 범위를 절반씩 좁혀서 탐색하는 것은 동일하다. 데이터 범위는 리스트 대신 0부터 주어진 막걸리의 합이다. `(high + low) // 2` 로 그 상황에서의 `k` 값을 구하고, `k < target_k` 면 인당 주어진 술의 양을 줄이는 방향으로, 그렇지 않으면 술의 양을 늘리는 방향으로 탐색 범위를 좁힌다.

핵심은 `k == target` 일때 탐색을 중단하는 것이 아닌, `k > target_k` 와 마찬가지로 술의 양을 늘리는 방향으로 탐색 범위를 좁혀가는 것 이다.

`low` 가 `high` 를 추월하였을 때, 반복을 멈추고 그 때 계산된 인당 술의 할당량이 정답이다.

## 3. 소스코드

```python
n, k = map(int, input().split(" "))
bottles = list()

for _ in range(n):
    bottles.append(int(input()))

def binary_search(bottles, target_k, low, high):
    amount_per_person = (high + low) // 2

    k = 0
    for bottle in bottles:
        k += bottle // amount_per_person

    if low > high:
        return high

    if k < target_k:
        return binary_search(bottles, target_k, low, amount_per_person - 1)
    else:
        return binary_search(bottles, target_k, amount_per_person + 1, high)

print(binary_search(bottles, k, 0, sum(bottles)))
```

## 4. 배운점

이전보다는 이진 탐색을 좀 더 유용하게 사용할 수 있게 되었다.
