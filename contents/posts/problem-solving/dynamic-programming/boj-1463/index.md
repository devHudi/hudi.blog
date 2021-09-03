---
title: "[PS #26] 1로 만들기 (1463)"
date: 2021-09-03 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/1463
- **난이도** : 실버 III
- **주제** : 다이나믹 프로그래밍
- **풀이 일자** : `2021/09/03`

## 2. 문제 접근

처음에는 3으로 나누어 떨어지면 나누고, 그게 아니면 2로 나누어 떨어지는지 확인하고 나누고, 모두 아니라면 1을 빼는 방식으로 접근했는데 당연히 최적의 해를 내놓지 못하여 실패하였다.

그 뒤로 접근한 방법은 재귀를 이용한 접근이다. 3으로 나누기, 2로 나누기, 1을 빼기 세가지 경우마다 재귀로 처리해 모든 경우의 수를 탐색하는 것이다. 단, 현재 기준 최저 횟수를 따로 변수로 기록하여, 최저 횟수보다 많이 탐색하게 될 경우의 수는 바로 배제하여 최적화한다.

## 3. 소스코드

```python
min_count = float("inf")

def work(number, count):
    global min_count

    if number == 1:
        if count < min_count:
            min_count = count
        return

    if count >= min_count: return

    if number % 3 == 0:
        work(number // 3, count + 1)

    if number % 2 == 0:
        work(number // 2, count + 1)

    work(number - 1, count + 1)


work(int(input()), 0)

print(min_count)
```

## 4. 배운점

재귀로 문제풀이를 해본적은 처음이다. 재귀를 이용하여 문제를 해결하는 방법은 머릿속에서 흐릿했고, 아직 크게 활용하지 못한다고 생각했었는데 생각외로 재귀를 활용하는 것이 어렵지 않았다.

또한 파이썬에서는 '양의 무한대' 와 '음의 무한대' 를 `float("inf")` , `float("-inf")` 와 같이 구현할 수 있는데, 최대값 혹은 최소값을 구할 때 활용하기 좋은 방법 같다.
