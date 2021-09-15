---
title: "[PS #35] 숫자 카드 2 (10816)"
date: 2021-09-15 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/10816
- **난이도** : 실버 IV
- **주제** : 이진 탐색
- **풀이 일자** : `2021/09/15`

## 2. 문제 접근

해시 테이블 혹은 Python 의 `Counter` 를 사용하면 아주 쉽게 풀 수 있는 문제이다.

하지만, 이진 탐색을 공부하고 있어서 굳이 이진 탐색으로 풀어보았다.

## 3. 소스코드

### 3-1. 해시 테이블을 사용한 풀이

```python
from collections import defaultdict

n = int(input())
n_list = list(map(int, input().split(" ")))

m = int(input())
m_list = list(map(int, input().split(" ")))

hash = defaultdict(lambda : 0)

for card in n_list:
    hash[card] += 1

for check in m_list:
    print(hash[check], end=" ")
```

### 3-2. Counter 모듈을 사용한 풀이

```python
from collections import Counter

n = int(input())
n_list = sorted(map(int, input().split(" ")))

m = int(input())
m_list = list(map(int, input().split(" ")))

c = Counter(n_list)
for check in m_list: print(c[check], end=" ")
```

... 이건 좀 반칙같다.

### 3-3. 이진 탐색을 사용한 풀이

```python
n = int(input())
n_list = sorted(map(int, input().split(" ")))

m = int(input())
m_list = list(map(int, input().split(" ")))

def binary_search(data, target, low, high):
    if low > high:
        return 0

    middle_idx = (low + high) // 2
    middle = data[middle_idx]

    if middle == target:
        left = right = middle_idx

        while left > 0:
            if data[left - 1] != target: break
            left -= 1

        while right < len(data) - 1:
            if data[right + 1] != target: break
            right += 1

        return right - left + 1
    elif middle > target:
        return binary_search(data, target, low, middle_idx - 1)
    elif middle < target:
        return binary_search(data, target, middle_idx + 1, high)

# 이미 계산한 값에 대해 해시에 저장하지 않으면 시간 초과 발생
# m_list 에 중복된 숫자가 들어간 테스트케이스가 있는 것 같다.
hash = {}
for check in m_list:
    if check not in hash:
        hash[check] = binary_search(n_list, check, 0, len(n_list) - 1)

for check in m_list:
    if check not in hash:
        print(0, end=" ")
    else:
        print(hash[check], end=" ")
```

기존의 이진탐색에 추가적인 로직이 필요하다. 만약 `target` 을 찾았다면, 그 위치에서 좌우로 같은 숫자가 몇개 있는지 `left` 와 `right` 변수를 통해 알아낸다.

## 4. 배운점

이진트리를 사용한 풀이에서 시간초과가 자주 발생했다. `m_list` 에 똑같은 숫자가 여러개 들어올 것 이라는 생각을 하지 못했다. 이는 다른 사람의 코드를 참고해가면서 해결했다. 제약 사항을 좀 더 자세히 확인해야할 것 같다.
