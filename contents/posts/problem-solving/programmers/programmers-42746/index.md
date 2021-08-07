---
title: "[PS #11] 가장 큰 수 (42746)"
date: 2021-08-04 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42746
- **난이도** : Level 2
- **주제** : 정렬
- **풀이 일자** : `2021/08/04`

## 2. 문제 접근

접근에 대해 고민을 많이 한 문제이다. 맨 처음에는 당연히 타임아웃 될 것을 알면서도 순열로 접근하였다. 당연히 매우 비효율적인 방법으로 시간이 굉장히 오래걸렸고, 애당초 문제 주제인 정렬에도 맞지 않는 방법이라 금방 포기하였다.

순열로 접근해본 다음에는 주제에 맞춰 정렬 알고리즘을 사용하였다. 정렬기준은 다음과 같다. 비교 대상 두 수 N1 과 N2 가 있다. 이를 `join` 하여 "N1N2", "N2N1" 두가지 문자열을 만든다. 그 다음 그 두개의 문자열을 숫자로 변환한다. N1N2 > N2N1 이라면 N1 을 더 앞에 배치하고, 그 반대라면 N2 를 앞에 배치한다. 이렇게 정렬하면 가장 큰 수를 만들 수 있다.

두번째 접근은 **버블소트 (Bubble Sort)** 를 통해 접근하였다. 버블소트는 최적, 최악의 경우 모두 $O(N^2)$ 의 시간복잡도를 갖는다고 한다. 비효율적이다. 반개의 테스트케이스를 통과하였다.

세번째 접근은 **퀵소트 (Quick Sort)** 를 통해 접근하였다. 퀵소트는 최적의 경우에 $O(NlogN)$, 최악의 경우에 $O(N^2)$ 의 시간복잡도를 갖는다고 한다. 퀵소트는 이름 그대로 정렬 속도가 빨라 지어진 이름이다. 퀵소트를 적용하니 처리속도가 대폭 낮아져 마지막 1개의 테스트 케이스를 제외하고 모두 통과하게 되었다.

마지막 11번 테스트 케이스는 모든 숫자가 0 으로 제시되는 테스트케이스였던 것 같다. "0000000" 과 같은 결과를 "0" 으로 바꾸는 로직까지 추가하여 모든 테스트 케이스를 통과하였다!

## 3. 소스코드

### 3-1. 버블 소트를 이용한 접근

```python
def solution(numbers):
    for i in range(len(numbers) - 1):
        for j in range(len(numbers) - i - 1):
            n1 = str(numbers[j])
            n2 = str(numbers[j + 1])

            n3 = int(n1 + n2)
            n4 = int(n2 + n1)

            if n3 < n4:
                numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]

    return ''.join(map(str,numbers))

```

### 3-2. 퀵 소트를 이용한 접근

```python
def compare(n1, n2):
    n3 = int(str(n1) + str(n2))
    n4 = int(str(n2) + str(n1))
    if n3 > n4: return "left"
    if n3 < n4: return "right"
    return "same"

def quick_sort(a, left, right):
    pl = left
    pr = right
    pivot = a[(left + right) // 2]

    while pl <= pr:
        while compare(a[pl], pivot) == "left": pl += 1
        while compare(a[pr], pivot) == "right": pr -= 1

        if pl <= pr:
            a[pl], a[pr] = a[pr], a[pl]
            pl += 1
            pr -= 1

    if left <= pr: quick_sort(a, left, pr)
    if pl <= right: quick_sort(a, pl, right)

def solution(numbers):
    quick_sort(numbers,0, len(numbers) - 1)
    return str(int(''.join(map(str, list(numbers)))))


```

## 4. 배운점

버블소트와 퀵 소트의 시간 복잡도에 대해 알게되었다. 또한 퀵소트에 대해 처음으로 공부하게 된 계기가 되었는데, 재귀함수를 통해 구현하는 과정이 그나마 익숙해졌다. 나중에 정렬 알고리즘에 대해서는 따로 다뤄보려고 한다.
