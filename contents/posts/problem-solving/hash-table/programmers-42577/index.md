---
title: "[PS #02] 전화번호 목록 (42577)"
date: 2021-07-26 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42577
- **난이도** : Level 2
- **주제** : 해시 테이블
- **풀이 일자** : `2021/07/22`

## 2. 문제 접근

당장 생각나는 방법은 전화번호로 이중 For 문을 돌려 1번째 부터 N번째 전화번호에 대해 다른 모든 전화번호를 비교하는 방법이 생각났다. 하지만 이 방법은 최소 $O(N^2)$ 의 시간 복잡도를 갖게 되므로, 비효율적이라고 판단하였다.

따라서 출제 의도대로 해시 테이블을 만들고 모든 전화번호를 Key 로 등록하였다. 이렇게 되면 적어도 접두사를 검사할때 선형탐색은 하지 않을 것이라고 판단했기 때문이다.

그 다음 각 전화번호별로 선형으로 탐색하며, 전화번호의 맨 앞자리부터 마지막자리까지 끊어보며 해시테이블에 해당 전화번호가 있는지 검사했다. 그런데, 결국 이 과정에서 $O(N^2)$ 의 시간 복잡도를 갖게 된 것 같다. 다행히도 타임아웃되지 않아 문제는 통과했지만, 어딘가 찝찝한 느낌이다.

## 3. 소스코드

```python
def solution(phone_book):
    hash_map = {}

    # 전화번호로 해시 테이블을 만듭니다
    for p in phone_book:
        hash_map[p] = True

    # 각 전화번호를 첫글자부터 끝글자까지 잘라보며 해시테이블에 존재하는지 유무를 확인합니다
    for p in phone_book:
        for l in range(1, len(p)):
            sliced_letter = p[0:l]
            if hash_map.get(sliced_letter): return False

    return True
```

## 4. 배운점

다른 스터디원의 코드를 참고하니, 특정 문자열이 다른 특정 문자열로 시작하는지 검사하는 `startswith` 라는 메소드를 사용하신 모습을 볼 수 있었다. 이렇게 또 새로운 점을 배워갔다.
