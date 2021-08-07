---
title: "[PS #12] H-Index (42747)"
date: 2021-08-06 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42747
- **난이도** : Level 2
- **주제** : 정렬
- **풀이 일자** : `2021/08/06`

## 2. 문제 접근

H-Index 의 개념에 대한 이해와 반복문에서 겪은 혼란으로 이상하게 정말 오래 걸린 문제였다. 해당 문제에 대한 프로그래머스 질문 리스트를 보더라도 문제의 H-Index 에 대한 설명이 오해하기 쉽게 적혀있다는 것을 보고는 나 혼자만의 문제는 아닌 것 같아 조금 안도했다.

다만, 위키백과의 설명을 보고도 나는 명쾌하게 이해가지 않았는데... _'내가 이렇게 이해력이 낮았나?'_ 라는 생각이 들 만큼 자존심이 많이 상했다. 개념을 이해하고나서는 생각보다 어렵지 않았다.

## 3. 소스코드

```python
def get_greater_count(arr, target):
    return sum([ target <= n for n in arr ])

def solution(citations):
    sorted_citations = sorted(citations)

    h = 0
    for _ in sorted_citations:
        if h + 1 > get_greater_count(sorted_citations, h + 1): break
        h += 1

    return h
```

## 4. 배운점

이 문제를 가지고 몇시간을 아깝게 허비한 지 모르겠다. 문제 풀이를 할 때에는 나름의 시간제한 원칙을 두어 일정 시간이 지나면 풀이를 보고 넘어가는 학습방법을 수립할 필요를 느낀다. 괜히 자존심 상해서 반나절 넘게 잡고 있었는데, 기회 비용이 낭비된 것 같아 문제풀이를 하고나서도 영 찝찝하다.
