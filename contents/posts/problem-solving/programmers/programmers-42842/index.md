---
title: "[PS #17] 카펫 (42842)"
date: 2021-08-16 03:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42842
- **난이도** : Level 2
- **주제** : 완전탐색
- **풀이 일자** : `2021/08/16`

## 2. 문제 접근

카페트의 세로크기가 가로크기보다 작거나 같으니, 세로크기를 1부터 노란색 격자의 수 만큼 반복시킨다. `격자 수 / 세로크기` 계산으로 가로크기를 구할 수 있다. 이 때 나머지가 0인 것들만 유효한 크기로 간주한다.

노란색 격자의 가로, 세로 크기가 정해졌으면, 갈색 격자 개수는 구하기 쉽다. 노란색 격자의 가로, 세로 각 크기에 1을 더한다음 2을 곱해 더하면 된다. 구해진 갈색 격자의 개수가 파라미터로 주어진 숫자와 일치하면, 그 때의 노란 격자의 가로세로 크기에 각각 2를 더하여 총 카페트의 가로, 세로 크기를 반환한다.

## 3. 소스코드

```python
def solution(brown, yellow):
    for inner_h in range(1, yellow + 1):
        if yellow % inner_h == 0:
            inner_w = yellow // inner_h
            brown_count = (inner_h + 1) * 2 + (inner_w + 1) * 2

            if brown_count == brown:
                return [inner_w + 2, inner_h + 2]
```

## 4. 배운점

어렵지 않은 문제여서 쉽게 풀이할 수 있었다. 완전탐색 문제는 존재하는 경우의 수를 모두 계산해보는 것이 문제이기 때문에 크게 어렵지 않은 것인가?... 아직 이렇게 결론 내리는 것은 섣부르고, 아무튼 더 열심히 많은 문제를 풀어야겠다.
