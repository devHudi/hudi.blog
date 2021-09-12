---
title: "[PS #33] 외판원 순회 2 (10971)"
date: 2021-09-12 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://www.acmicpc.net/problem/10971
- **난이도** : 실버 II
- **주제** : DFS/BFS
- **풀이 일자** : `2021/09/12`

## 2. 문제 접근

DFS 로 순회하되, 노드 간 간선의 비용이 대칭적이지 않다. A → B 와 B → A 는 비용이 다를 수도 있다는 뜻이고 즉, 갈림길을 맞닥뜨리면 그대로 분기하여 모든 경우의 수를 탐색해야한다. 이 과정에서 이전에 탐색하고 완료된 비용보다 더 큰 비용이 발생된다면 해당 경로는 중도에 탐색을 중단하여 최적화한다.

이런 방식으로 모든 노드를 시작점으로 설정하여, 모든 경로를 탐색한다.

## 3. 소스코드

```python
city_count = int(input())

graph = [None] * city_count

for i in range(city_count):
    graph[i] = list(map(int, input().split(" ")))

def dfs(graph, start, node, weight, visited, weights, min_case):
    if sum(weights) > min_case[0]:
        return

    new_visited = visited[:]
    new_visited[node] = True

    new_weights = weights + [weight]

    if all(new_visited):
        if graph[node][start] > 0:
            total = sum(new_weights) + graph[node][start]
            if min_case[0] > total:
                min_case[0] = total
        return

    for n, w in enumerate(graph[node]):
        if w == 0:
            continue # 길 없음

        if new_visited[n] == False:
            dfs(graph, start, n, w, new_visited, new_weights, min_case)


min_case = [float("inf")]

for city in range(city_count):
    dfs(graph, city, city, 0, [False] * city_count, [], min_case)

print(min_case[0])

```

## 4. 배운점

최소 비용을 비교하기 위해 `min_case` 라는 변수를 넘겨주는데, 그냥 `int` 등의 **Immutable** 한 객체로 넘겨주면, Call by value 로 파라미터를 넘겨주게 된다. 파이썬은 명시적인 Call by reference 를 할 수 없다고 한다. 따라서 넘겨야할 값은 하나이지만, **Mutable** 한 객체인 list 를 통해 최솟값을 넘겨준다.

추후 파이썬의 Call by value 와 Call by reference 에 대한 글도 작성해보아야겠다.
