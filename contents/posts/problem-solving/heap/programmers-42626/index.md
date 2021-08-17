---
title: "[PS #13] 더 맵게 (42626)"
date: 2021-08-07 01:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42626
- **난이도** : Level 2
- **주제** : 힙
- **풀이 일자** : `2021/08/07`

## 2. 문제 접근

가장 작은 값과 그 다음으로 작은 값을 가져와 특정한 계산식으로 계산해 값을 더 큰 하나의 수로 만들어 다시 자료구조에 집어넣어야 한다. 가장 작거나 큰 값을 효율적으로 가져오면서, 새로운 값이 계속 등록되고 정렬되려면 힙 (Heap) 자료구조를 사용하는 것이 가장 효율적이다.

힙은 최악이던 최적이던 $O(N logN)$ 의 안정적인 시간 복잡도를 가진 자료구조이다. 이와 같은 문제에 최적인 셈이다.

## 3. 소스코드

```python
import heapq

def solution(scoville, K):
    hq = scoville
    heapq.heapify(hq)

    count = 0
    while hq[0] < K:
        if len(hq) < 2: return -1
        n1 = heapq.heappop(hq)
        n2 = heapq.heappop(hq)

        heapq.heappush(hq, n1 + (n2 * 2))
        count += 1

    return count
```

## 4. 배운점

파이썬에서 `heapq` 모듈을 사용하여 힙을 사용해본 것이 처음이었다. 자료구조론 수업을 들으면서 분명 힙을 직접 구현해봤었는데... 벌써 까먹었다. 나중에 블로그에 포스트로 힙 자료구조를 정리하면서 다시 구현해봐야겠다.
