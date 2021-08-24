---
title: "[PS #20] 체육복 (42862)"
date: 2021-08-25 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42862
- **난이도** : Level 1
- **주제** : 그리디 알고리즘
- **풀이 일자** : `2021/08/25`

## 2. 문제 접근

그리디 알고리즘은 **지역적인 문제 최적의 해 (Local Optimal Solution)** 를 도출해나가는 과정에서 **전체 최적 해 (Global Optimal Solution)** 의 도출을 꾀하는 방법이다. 하지만 당장 눈 앞에 닥친 문제만에 관심을 두어 해결하다보니 도출된 전체 해가 최적이라는 것을 보장하지는 않는다. 하지만 이런 특징으로 최적해가 아닌 **근사해 (Approximate Solution)** 를 구할수는 있겠다. 이 문제는 부분 최적해가 전체 최적해가 된다.

그리디 알고리즘을 이용하여 현재 가리키고 있는 학생이 여분 체육복을 가지고 있다면, 그 전/후 학생에게 한 벌을 건내어주는 방식으로 풀이해나갔다.

## 3. 소스코드

### 직접 작성한 코드

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

### 다시 작성한 코드

위 풀이가 문제 난이도에 비해 긴 것 같아 다른 사람의 풀이를 한번 찾아보았다. 나는 아직 숏코딩을 하기에는 먼 것 같다. 다른 사람의 풀이를 참고한 것을 토대로 아래와 같이 새로 작성했다.

```python
def solution(n, lost, reserve):
    new_lost = set(lost) - set(reserve)
    new_reserve = set(reserve) - set(lost)
    # 여벌을 가져오고 도난당했으면, 도난자, 여벌보유자 리스트에서 제외
    
    for s in new_reserve:
        if (s - 1 in new_lost): new_lost.remove(s - 1)
        elif (s + 1 in new_lost): new_lost.remove(s + 1)
            
    return n - len(new_lost)
```

`set` 을 이용한 차집합 연산으로 여벌을 가지고 온 사람이 도난 당했을 경우를 처리한다. 이후 여벌을 가지고 온 학생을 기준으로 좌, 우 학생을 확인해 도난당한 학생 리스트에 있는지 확인하고, 분실자 리스트에 있다면 그 리스트에서 해당 학생을 제거한다.

이 코드를 작성할 때에도 7~8번 코드를 작성할 때 `s + 1` 을 먼저 계산했다가 11, 13 번 테스트 케이스를 통과하지 않아 고생했다. 바보같은 실수였다. 우측의 학생부터 비교한다면 분실자 리스트의 맨 처음 학생이 제대로 처리되지 않을 수 있다.

## 4. 배운점

그리디 알고리즘은 텍스트로 이론만 알고있는 상황이다. 조금 더 어려운 문제를 풀어서 그리디 알고리즘 문제에 대해 감을 잡아야겠다.

일부러 최대한 `map` 과 `filter` 함수를 사용해보려고 했다. 자바스크립트의 그것과 같긴한데, 오랫동안 자바스크립트만 써오다보니 문법이나 가독성이 아직 어색하다. 특히 삼항연산자나 `lambda` 같은 것들. 나에게는 아직 화살표 함수가 더 편하다.

첫 풀이로 바로 성공하였지만, 다른 사람이 작성한 코드의 아이디어를 토대로 새롭게 코드를 짜는 과정이 꼭 필요한 것 같다. 문제를 풀었다고 끝내는게 아니라 문제를 이용해서 최대한 내 생각을 넓게 만들어야 한다는 생각을 느끼게 해주는 문제였다.