---
title: "[PS #07] 기능개발 (42586)"
date: 2021-07-26 07:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42586
- **난이도** : Level 2
- **주제** : 스택/큐
- **풀이 일자** : `2021/07/26`

## 2. 문제 접근

작업율과 작업속도를 멤버로 갖는 클래스를 하나 정의하였다. 배포되어야할 작업 순서가 정해져 있으므로 Queue 의 형태로 데이터를 꺼낸다.

큐에 저장된 모든 작업이 없어질때까지 반복하며, 각 반복마다 각 진행률은 대응하는 진행속도만큼 더해진다. 이때, 만약 진행율이 100을 초과하는 작업률이 있다면 100으로 조정해준다.

각 반복마다 맨 앞 작업률이 100 이상인지 체크한다. 맨 앞 작업률이 100 이상이라면, 큐의 Front 가 100 이상이 아닐때까지 반복하여 dequeue 한다. 이 작업에서 dequeue 한 횟수가 0보다 클 경우 반환값이 담긴 리스트에 그 횟수를 추가한다.

클래스 생성자로 전체 작업률과 작업속도를 미리 받기 때문에 따로 `enqueue` 메소드는 정의하지 않았다.

## 3. 소스코드

```python
class Queue:
    def __init__(self, progresses, speeds):
        self.q = progresses
        self.speeds = speeds

    def __len__(self):
        return len(self.q)

    def dequeue(self):
        self.speeds.pop(0)
        self.q.pop(0)

    def peek(self):
        if len(self.q) > 0:
            return self.q[0]
        return -1

    def do_work(self):
        new_progresses = []
        for i, p in enumerate(self.q):
            new_progress = p + self.speeds[i]
            if new_progress >= 100: new_progress = 100

            new_progresses.append(new_progress)

        self.q = new_progresses

def solution(progresses, speeds):
    q = Queue(progresses, speeds)

    ret = []
    while len(q) > 0:
        q.do_work()

        count = 0
        while q.peek() >= 100:
            q.dequeue()
            count += 1

        if count > 0:
            ret.append(count)

    return ret

```

## 4. 배운점

`dequeue` 를 하면서 `progresses` 만 pop 하고 `speeds` 에서는 pop 하지 않아 계속 테스트 케이스가 대다수가 틀리게 나와서 많이 헤맸다. 다행히도 테스트 케이스를 짐작가는대로 여러개 마구마구 추가해가면서 문제를 겨우 발견할 수 있었다.

코드를 설계하는 능력도 중요하지만, 예외가 발생할만한 테스트 케이스를 떠올리는 능력도 중요한 것 같다.
