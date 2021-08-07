---
title: "[PS #01] 완주하지 못한 선수 (42576)"
date: 2021-07-26 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42576
- **난이도** : Level 1
- **주제** : 해시 테이블
- **풀이 일자** : `2021/07/22`

## 2. 문제 접근

주제가 해시 테이블인만큼 해시 테이블을 사용하여 접근해보고자 하였다. 참가자 목록과 완주자 목록을 하나하나 비교한다면, 이중 For 문으로 해결해야할 것 같고 시간 복잡도는 $O(N^2)$ 이 되기에, $O(N)$ 의 복잡도 작업 세개를 따로 돌리는 것이 효율적이라고 판단하였다.

## 3. 소스코드

```python
def solution(participant, completion):
    hash_map = {}

    # 해시 테이블을 만들어 참가자 명단을 추가합니다.
    # 이때, 해시 테이블의 Value 는 참가자 등장 수 입니다.
    for p in participant:
        if p in hash_map.keys():
            hash_map[p] += 1
        else:
            hash_map[p] = 1

    # 완주자로 Loop 을 돌며, 해시 테이블에서 해당하는 참가자의 수를 줄 입니다.
    for c in completion:
        hash_map[c] -= 1

    # 해시테이블의 Value 가 1인 사람이 완주하지 못한 사람입니다.
    for k in hash_map.keys():
        if hash_map[k] == 1:
            return k
```

## 4. 배운점

딕셔너리를 사용할 때 `collections` 모듈의 `defaultdict` 클래스를 사용하면, 특정 타입을 기본값으로 갖는 유사 딕셔너리를 생성할 수 있다는 점을 스터디원분들과 코드리뷰를 나누며 알게되었다. 아래는 그 사용 예시다.

```python
from collections import defaultdict

hash_map = defaultdict(int)  # key에 대한 value값이 기본 0으로 시작
for p in participant:
    hash_map[p] += 1
```

해시 테이블은 지난 자료구조 수업에서 듣고 _"아 그렇구나~"_ 하고 쉽게 넘겼었는데, 이 문제를 풀며 해시 테이블의 쓰임새가 직접 와닿게 되었다. 알고리즘과 자료구조 전반에 대한 공부를 매우 소홀히 하였는데, 시간 복잡도를 고민하는 과정 자체가 개발자로서 큰 성장 과정이라는 것을 체감한다.
