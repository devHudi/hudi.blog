---
title: "[PS #20] 체육복 (42862)"
date: 2021-08-24 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42862
- **난이도** : Level 1
- **주제** : 그리디 알고리즘
- **풀이 일자** : `2021/08/24`

## 2. 문제 접근

그리디 알고리즘은 지역적인 문제 최적의 해 (Locally Optimal) 를 도출해나가는 과정에서 전체 해 (Globally Optimal) 의 도출을 꾀하는 방법이다. 당장 눈 앞에 닥친 문제만에 관심을 두어 해결하다보니 도출된 전체 해가 최적이라는 것을 보장하지는 않는다.

그리디 알고리즘을 이용하여 현재 가리키고 있는 학생이 여분 체육복을 가지고 있다면, 그 전/후 학생에게 한 벌을 건내어주는 방식으로 풀이해나갔다.

## 3. 소스코드

```python
def list_safe_get(l, i):
    if i < 0: return None
    if i >= len(l): return None
    
    return l[i]

def solution(n, lost, reserve):
    students = list(
        map(lambda s: 2 if s in reserve else 1, list(range(1, n + 1)))
    ) # 원래 체육복 보유수로 학생 초기화
    
    for i, s in enumerate(students):
        if (i + 1) in lost: students[i] -= 1
    # 체육복 도난
    
    for i, s in enumerate(students):
        prev_student = list_safe_get(students, i - 1)
        next_student = list_safe_get(students, i + 1)
        
        if students[i] >= 2 and prev_student == 0:
            students[i] -= 1
            students[i - 1] += 1
            
        if students[i] >= 2 and next_student == 0:
            students[i] -= 1
            students[i + 1] += 1
    # 좌우로 체육복 없으면 빌려주기
    
    result = len(list(filter(lambda s: s > 0, students)))
    # 최종적으로 체육복이 있는 학생 수 세기
    
    return result
```

## 4. 배운점

그리디 알고리즘은 텍스트로 이론만 알고있는 상황이다. 조금 더 어려운 문제를 풀어서 그리디 알고리즘 문제에 대해 감을 잡아야겠다.