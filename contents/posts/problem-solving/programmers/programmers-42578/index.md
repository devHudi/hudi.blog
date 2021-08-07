---
title: "[PS #03] 위장 (42578)"
date: 2021-07-26 03:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42578
- **난이도** : Level 2
- **주제** : 해시 테이블
- **풀이 일자** : `2021/07/22`

## 2. 문제 접근

처음 이 문제를 접근했을 때는 고등학교 확률과 통계 때 배운 조합을 사용해야겠다는 생각을 했다. 조금 찾아보니 `itertools` 라는 라이브러리에서 `combinations` 라는 함수를 제공해주었고, 리스트에서 특정 개수만큼 선택한 조합을 가져올 수 있었다. 스파이는 최소 한가지의 옷을 입으니 1개를 선택하는 경우의 수 부터 옷의 카테고리 개수만큼 선택하는 경우의 수 까지 고려하여 카테고리의 조합을 생성했다. 그 이후 생성된 조합각 조합별 카테고리 옷 가지수를 곱하고 더하여 경우의 수를 구해보려 했다.

하지만, 모든 테스트 케이스가 통과하는 와중 1번 테스트 케이스만 계속 타임아웃으로 통과하지 않았다. 혹시 몰라 극단적인 테스트케이스로 30 가지 옷을 전부 다른 카테고리로 하여 테스트케이스를 넣어본 결과 타임아웃이 발생하였다. 계속 헤매다 결국 프로그래머스 질문/답변 페이지와 인터넷을 찾아보게 되었고, 두번째 소스코드와 같이 문제를 해결하게 되었다.

두번째 방법은 아주 짧은 코드로 빠르게 실행되어 통과되었다. 각 카테고리별 옷가지수 + 1 한 값을 모두 곱한다음 마지막에 1을 빼는 방법이다. 옷 개수에 1을 더하는 이유는 해당 옷을 입지 않는 경우의 수를 고려하기 위함이며, 마지막에 1을 빼는 이유는 모든 옷을 입지 않는 상태의 경우의 수를 제외하기 위함이다.

이 문제는 해시 테이블이 핵심이 아니라 경우의 수를 구하는 식을 어떻게 수립하느냐가 중점이었던 것 같다.

## 3. 소스코드

### 3-1. 실패한 풀이

```python
from itertools import combinations

def solution(clothes):
    hash_map = {}

    for c in clothes:
        cloth_category = c[1]

        if hash_map.get(cloth_category) == None:
            hash_map[cloth_category] = 1
        else:
            hash_map[cloth_category] += 1

    category_list = hash_map.keys()
    category_count = len(category_list)

    category_combination = []
    for r in range(1, category_count + 1):
        category_combination.extend(
            combinations(category_list, r)
        )

    result = 0
    for i in category_combination:
        multiply = 1
        for j in i:
            multiply *= hash_map[j]
        result += multiply

    return result
```

### 3-2. 성공한 풀이

```python

def solution(clothes):
    hash_map = {}

    for c in clothes:
        cloth_category = c[1]

        if hash_map.get(cloth_category) == None:
            hash_map[cloth_category] = 1
        else:
            hash_map[cloth_category] += 1

    result = 1
    for v in hash_map.values():
        result *= (v + 1)

    return result - 1
```

## 4. 배운점

`itertools` 의 `combinations` 함수를 통해 `nCr` 의 모든 경우의 수를 가져올 수 있는 방법을 알게 되었다.
