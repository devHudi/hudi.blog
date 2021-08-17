---
title: "[PS #08] 다리를 지나는 트럭 (42583)"
date: 2021-07-27 00:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42583
- **난이도** : Level 2
- **주제** : 스택/큐
- **풀이 일자** : `2021/07/27`

## 2. 문제 접근

구현에 있어 조금 시행착오를 겪긴 했지만, 풀이 접근자체는 어렵지 않게 했다. 고정된 길이의 큐를 생성하고, 무게 한도가 넘지 않는 선에서 계속 차량을 다리 위에 enqueue 하고 dequeue 해주며 그 이동 횟수를 기록해 반환해주면 된다.

이런 방법으로 접근하였을 때 1개를 제외한 모든 테스트케이스가 성공적으로 통과되었다. 통과되지 못한 테스트케이스는 시간초과로 실패하였다. 최적화에 대해 계속 고민하며, 이리저리 테스트케이스를 추가해보던 중 최적화 아이디어가 떠올랐다.

다리 위에 최대한으로 차량을 올린 상태에서는 맨 앞 차량이 빠져나가지 않는 이상 새로운 차량을 다리에 올릴 수 없다. 그 상황에서는 차량 이동 과정 계산을 생략하여 맨 앞 차량 앞의 빈 공간을 지우고, 지운 만큼을 소요시간으로 계산하는 방법으로 코드를 수정하였다.

이 아이디어를 코드로 구현하는 것에도 작은 시행착오를 겪었으나, 결국 구현을 성공했고 전체적으로 코드 러닝타임을 크게 줄일 수 있었다. 결과적으로 모든 테스트 케이스를 무사히 통과!

## 3. 소스코드

```python
class BridgeQueue:
    def __init__(self, length, weight):
        self.weight = weight
        self.bridge = [None] * length

    # 다리위에 올라와있는 차량의 모든 무게
    def total_truck_weight(self):
        total_truck_weight = 0
        for w in self.bridge:
            if w != None:
                total_truck_weight += w
        return total_truck_weight

    # 파라미터로 넣어준 트럭을 다리위에 올릴 수 있는지 체크
    def check_weight(self, truck_weight):
        if truck_weight == None: truck_weight = 0

        return self.total_truck_weight() + truck_weight <= self.weight

    def dequeue(self):
        self.bridge.append(None)
        return self.bridge.pop(0)

    def enqueue(self, truck_weight):
        self.bridge[-1] = truck_weight

    # 파라미터로 받아온 차량을 다리위에 올리고 동시에 내릴 차량을 내리는 작업
    # 튜플 (차량 올리기 성공여부, 소요시간) 을 반환
    def step(self, truck_weight):
        self.dequeue()

        if self.check_weight(truck_weight):
            self.enqueue(truck_weight)
        else:
            # 다리 무게 한도에 도달하였을 때는
            # 가장 앞에 달리고 있는 차량의 앞칸을 생략하고, 생략한 만큼 소요시간을 반환
            skip_count = 0
            for i, w in enumerate(self.bridge):
                skip_count = i
                if w != None: break

            # 생략한 만큼 차량을 앞으로 이동시키고
            # 차량 뒤에 생략한 만큼 빈공간을 채워넣음
            new_bridge = self.bridge[skip_count:] + [None] * skip_count

            self.bridge = new_bridge
            return (False, skip_count + 1)

        return (True, 1)

def solution(bridge_length, weight, waiting_trucks):
    bridge = BridgeQueue(bridge_length, weight)

    trucks_count = len(waiting_trucks)

    seconds = 0
    while True:
        # 대기 차량이 0이고, 다리위 차량도 없으면 반복 탈출
        if len(waiting_trucks) <= 0 and bridge.total_truck_weight() == 0:
            break

        # 더이상 다리위에 올릴 트럭이 없으면 None 을 계속 올림
        # 이미 올라가있는 트럭을 계속 밀어주기 위함
        in_truck = None
        if len(waiting_trucks) > 0:
            in_truck = waiting_trucks[0]

        # in_success : 트럭이 다리위에 성공적으로 올라갔는가?
        # s : 이번 스텝에서 소요된 시간 (초)
        in_success, s = bridge.step(in_truck)

        # 트럭이 다리위에 올라간 경우만 트럭 대기열에서 제거
        if in_success and (len(waiting_trucks) > 0):
            waiting_trucks.pop(0)

        seconds += s

    return seconds
```

## 4. 배운점

이번 문제를 풀면서 배운건 Big O 기반의 시간 복잡도 최적화보다는 생략이 가능한 구간에서의 연산을 생략하여 최적화 하는 방법이다. 이번 문제는 꽤 어려움을 겪었는데, 결국에는 풀어냈다는 사실에 자신감이 많이 생겼다. 😁

또한 시간 복잡도에 대한 예외처리를 하기 위해서는 극단적인 테스트 케이스를 작성할 줄 알아야한다는 것을 많이 느낀다. 문제풀이를 하다 꼭 테스트 케이스 하나만 통과되지 않는 상황이 발생하는데, 문제를 다 풀고 보면 항상 극단적인 테스트 케이스였다. 이를 **Edge Case** 라고 부르는 모양이다.
