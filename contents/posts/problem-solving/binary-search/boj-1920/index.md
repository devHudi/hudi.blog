---
title: "[PS #34] 수 찾기 (1920)"
date: 2021-09-13 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/1920
- **난이도** : 실버 IV
- **주제** : 이진 탐색
- **풀이 일자** : `2021/09/13`

## 2. 문제 접근

리스트에서 특정 수의 존재 유무를 검사하는 문제이다. 선형탐색으로 풀 수도 있으나, 당연히 시간 제한이 존재해 $O(N)$ 보다 빠른 알고리즘을 채택해야한다.

**이진탐색 (Binary Search)** 는 한번 검사할 때 마다 검사 대상이 절반으로 줄어들어 $O(logN)$ 의 시간 복잡도를 갖는 탐색 방법이다. 이진탐색을 이용하여 문제를 풀이하자.

## 3. 소스코드

```python
n = int(input())
n_list = sorted(map(int, input().split(" ")))

m = int(input())
m_list = map(int, input().split(" "))

def binary_search(array, target, left, right):
    middle_index = (right+left) // 2
    middle_number = array[middle_index]

    if left > right:
        return 0

    if middle_number == target:
        return 1
    elif middle_number > target: # 좌측을 살림
        return binary_search(array, target, left, middle_index - 1)
    elif middle_number < target: # 우측을 살림
        return binary_search(array, target, middle_index + 1, right)

for target in m_list:
  print(binary_search(n_list, target, 0, len(n_list) - 1))
```

## 4. 배운점

이진탐색을 처음 구현해봐서 처음에는 **List Slicing** 을 통해 리스트를 잘라 재귀함수로 전달했다. 이 방법은 시간 초과가 발생했고, 인터넷을 검색해보니 파이썬의 List Slicing 은 $O(N)$ 의 시간 복잡도를 갖는다고 한다.

조금 알아본 결과 이진탐색은 `left`, `right` 변수를 사용하여 변수를 직접 자르지 않고 탐색 범위를 제한하는 듯 했다. 이 방식을 적용하니 쉽게 통과하였다.
