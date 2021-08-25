---
title: "[PS #21] 조이스틱 (42860)"
date: 2021-08-25 02:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42860
- **난이도** : Level 2
- **주제** : 그리디 알고리즘
- **풀이 일자** : `2021/08/25`

## 2. 문제 접근

주어진 목표 이름에서 `A` 를 제외한 나머지를 `(글자 인덱스, 글자)` 형태의 튜플 리스트로 만들어 저장하였다. 그 이후 좌/우로 이동해보며 둘 중에서 A 가 아닌 글자로 커서를 이동할 수 있는 횟수가 짧은지 계산하여 커서 위치를 변경한다. 커서 위치를 변경 한 다음 해당 위치의 글자를 위/아래로 이동해보며 둘 중 더 가까운 거리로 방향을 결정한다. 커서를 좌우로 움직이고, 위아래로 움직일 때 마다 이동횟수로 계산하여 더해준다. 위아래로 움직여 목표 글자로 만든 자리에 해당하는 튜플은 리스트에서 제거한다. 리스트의 길이가 0이 될 때 까지 반복한다.

## 3. 소스코드

### 3-1. 처음 작성한 코드

```python
def shortest_vertical_distance(f, t):
    alphabets = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ]

    down_distance = alphabets.index(f) + (len(alphabets) - alphabets.index(t))
    up_distance = alphabets.index(t) - alphabets.index(f)

    if down_distance < up_distance: return down_distance
    return up_distance

def shortest_horizontal_distance(l, cursor, length):
    index_list = list(map(lambda i: i[0], l))
    left_cursor = cursor
    left_count = 0
    right_cursor = cursor
    right_count = 0

    if left_cursor in index_list:
        return (0, l[index_list.index(left_cursor)])
    elif right_cursor in index_list:
        return (0, l[index_list.index(right_cursor)])

    while right_cursor not in index_list:
        if right_cursor + 1 >= length: right_cursor = 0
        else: right_cursor += 1

        right_count += 1

    while left_cursor not in index_list:
        if left_cursor - 1 < 0: left_cursor = length - 1
        else: left_cursor -= 1

        left_count += 1

    if left_count < right_count: return (left_count, l[index_list.index(left_cursor)])
    else: return (right_count, l[index_list.index(right_cursor)])

def solution(name):

    move_count = 0
    cursor = 0
    target_name = name

    remain_letters = []
    for i, c in enumerate(name):
        if c == "A": continue
        remain_letters.append( (i, c) )

    while len(remain_letters) > 0:
        if (len(remain_letters) == 0): break
        horizontal = shortest_horizontal_distance(remain_letters, cursor, len(name))
        move_count += horizontal[0]
        cursor = horizontal[1][0]

        move_count += shortest_vertical_distance("A", horizontal[1][1])

        remain_letters.remove(horizontal[1])


    return move_count
```

처음에는 위와 같이 작성하였으나, 가독성도 좋지 않고 길이도 너무 길어 새로 작성했다. 튜플 리스트로 글자를 관리하는 것은 그리 좋은 아이디어는 아니었던 것 같다.

### 3-2. 개선된 코드

```python
def ud_distance(target_letter):
    alphabets = list(map(chr, range(65, 91)))
    target_index = alphabets.index(target_letter)

    to_left = len(alphabets) - target_index
    to_right = target_index

    return min([to_left, to_right])

def lr_distance(ud_list, cursor):
    if ud_list[cursor] > 0: return (0, cursor)

    left_cursor = right_cursor = cursor
    left_count = right_count = 0

    while True:
        left_cursor = left_cursor - 1 if left_cursor > 0 else len(ud_list) - 1
        left_count += 1

        if ud_list[left_cursor] == 0: continue  # do while 처럼 사용하기 위함
        break

    while True:
        right_cursor = (right_cursor + 1) % (len(ud_list))
        right_count += 1

        if ud_list[right_cursor] == 0: continue
        break

    if left_count < right_count: return (left_count, left_cursor)
    else: return (right_count, right_cursor)


def solution(name):
    move_count = 0
    cursor = 0

    ud_list = list(map(lambda c: ud_distance(c), name))

    while sum(ud_list) > 0:
        lr = lr_distance(ud_list, cursor)
        cursor = lr[1]

        move_count += lr[0]
        move_count += ud_distance(name[cursor])

        ud_list[cursor] = 0

    return move_count
```

굳이 튜플로 리스트를 만들어 사용하지 않고, 대신에 각각의 자리에서상하로 조이스틱을 움직이는 최적의 횟수를 먼저 리스트로 만들어두었다. 그 리스트를 기반으로 최적의 방향으로 좌우로 움직이고, 좌우로 움직인 방향과 `cursor` 가 가리키고 있는 위치의 숫자를 더해 `move_count` 를 계산한다.

## 4. 배운점

`do ~ while` 문이 필요했는데, 파이썬에서는 존재하지 않는다. 파이썬에서 `do ~ while` 처럼 동작하는 `while` 문을 작성하는 테크닉을 배우게 되었다.

이번 문제를 풀면서 가장 헷갈렸던 것은 리스트의 인덱스 관리였다. `list index out of range` 에러를 조심하며 인덱스를 다루는 것이 꽤 까다롭게 다가왔다. 연습이 많이 필요하단 것을 느꼈다.
