---
title: "[PS #30] 바이러스 (2606)"
date: 2021-09-07 03:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/2606
- **난이도** : 실버 III
- **주제** : DFS/BFS
- **풀이 일자** : `2021/09/07`

## 2. 문제 접근

1번 노드와 연결된 다른 컴퓨터의 개수를 단순히 세면 된다. DFS 와 BFS 둘다 사용해볼 수 있다. 간선이 끊긴 노드는 자연스럽게 탐색하지 않으니, 입력값에 따라 그래프만 잘 만들어주면 된다.

## 3. 소스코드

### 3-1. DFS를 사용한 풀이

```python
from collections import defaultdict

computer_count = int(input())
edge_count = int(input())

graph = defaultdict(set)

for _ in range(edge_count):
    n1, n2 = map(int, input().split(" "))
    graph[n1].add(n2)
    graph[n2].add(n1)

visited = [False] * (computer_count + 1)

def dfs(graph, node, visited):
    visited[node] = True
    for neighbor_node in graph[node]:
        if visited[neighbor_node] == False:
            dfs(graph, neighbor_node, visited)
    return visited

print(sum(dfs(graph, 1, visited)) - 1)
```

### 3-2. BFS를 사용한 풀이

```python
from collections import defaultdict, deque

computer_count = int(input())
edge_count = int(input())

graph = defaultdict(set)

for _ in range(edge_count):
    n1, n2 = map(int, input().split(" "))
    graph[n1].add(n2)
    graph[n2].add(n1)

visited = [False] * (computer_count + 1)

def bfs(graph, node, visited):
    deq = deque()
    deq.append(node)

    while len(deq) > 0:
        current_node = deq.popleft()
        for neighbor_node in graph[current_node]:
            if visited[neighbor_node] == False:
                deq.append(neighbor_node)
                visited[neighbor_node] = True

    return visited

print(sum(bfs(graph, 1, visited)) - 1)
```

## 4. 배운점

DFS/BFS 이론을 모르고 풀면 어려웠을 문제이지만, 알고 풀이하니 굉장히 쉬웠다. 알고리즘을 배우는 것은 거인 어깨 위로 올라타는 것 이라고 하였다.
