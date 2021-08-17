---
title: "[PS #15] 모의고사 (42840)"
date: 2021-08-16 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42840
- **난이도** : Level 1
- **주제** : 완전탐색
- **풀이 일자** : `2021/08/16`

## 2. 문제 접근

완전탐색이란 가능한 경우의 수를 모두 대입하여 문제를 해결하는 방식이다. 각 수포자의 찍기 패턴을 배열로 등록한 다음 일일히 정답과 비교하여 각 수포자의 점수를 산정한다.

## 3. 소스코드

```python
PATTERN = [
    [1,2,3,4,5],
    [2,1,2,3,2,4,2,5],
    [3,3,1,1,2,2,4,4,5,5]
]

def solution(answers):
    score = [0, 0, 0]

    for i, a in enumerate(answers):
        for j, s in enumerate(score):
            answer = PATTERN[j][i % len(PATTERN[j])]
            score[j] += answer == a

    max_score = max(score)
    ret = list(i[0] + 1 for i in filter(lambda s: s[1] == max_score, enumerate(score)))

    return ret
```

## 4. 배운점

각 수포자별로 배열의 길이가 다르므로 나머지 연산자 `%` 를 사용하여, 반복하는 배열을 구현하고 점수를 산정하였다. 이 때 숫자에 `True` 를 더하면, 1이 더해지는 방식을 사용하여 코드 줄 수를 줄였다. 최고점이 여러명일 수 있으므로 리스트 컴프리헨션 (List Comprehension) 을 사용하여 최고점자를 산출하였다.
