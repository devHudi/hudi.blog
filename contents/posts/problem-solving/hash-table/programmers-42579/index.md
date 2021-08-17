---
title: "[PS #05] 베스트앨범 (42579)"
date: 2021-07-26 05:00:00
tags:
  - CSE
  - problem-solving
series: "Problem Solving 🤔"
---

## 1. 문제 개요

- **문제 링크** : https://programmers.co.kr/learn/courses/30/lessons/42579
- **난이도** : Level 3
- **주제** : 해시 테이블
- **풀이 일자** : `2021/07/22`

## 2. 문제 접근

해시 테이블에 데이터를 어떻게 잘 저장하느냐를 보는 문제 같았다.

장르를 Key 로 갖는 Chaining 해시 테이블을 만들고 각 슬롯에 음악을 넣어준다. 단, 이때 각 해시테이블 버킷의 0번째 인덱스는 장르의 플레이 수의 총 합이다. 음악을 넣어줄 때는 Tuple 로 `(고유번호, 장르, 플레이수)` 형태로 넣어주었다. 그 이후 플레이 수 총 합을 기준으로 내림차순 정렬 하여 장르를 따로 정렬하였다.

이후 각 장르별 음악별로 2개 혹은 1개의 음악을 뽑아 순서대로 앨범에 넣어준다. 넣어주기 전에 각 장르별 음악을 플레이수로 내림차순 정렬 하였다.

## 3. 소스코드

```python
def solution(genres, plays):
    genres_hash = {}

    # 장르를 key 로 list 인 value 의 음악들을 넣어줍니다.
    # 단 이떄 value 의 0번째 인덱스는 장르의 플레이 수의 총 합입니다.
    for i, g in enumerate(genres):
        if genres_hash.get(g) == None:
            genres_hash[g] = [plays[i], ( i, g, plays[i] )]
        else:
            genres_hash[g][0] += plays[i]
            genres_hash[g].append(( i, g, plays[i] ))

    # 플레이 수 총 합으로 장르를 내림차순 정렬합니다.
    genres_and_plays = [(g[0], g[1][0]) for g in genres_hash.items()]
    sorted_genres_with_plays = sorted(genres_and_plays, key=lambda x: x[1], reverse=True)
    sorted_genres = [ g[0] for g in sorted_genres_with_plays ]

    # 각 장르별 2개 혹은 1개의 음악을 뽑아 앨범에 넣습니다.
    best_album = []
    for g in sorted_genres:
        # 장르별 음악을 플레이수로 내림차순 정렬합니다.
        # 이 때 해시 테이블의 value 0번째 인덱스는 플레이수이므로 슬라이스합니다.
        sorted_music = sorted(genres_hash[g][1:], key=lambda x: x[2], reverse=True)
        if len(sorted_music) >= 2:
            best_album.extend([m[0] for m in sorted_music][0:2])
        else:
            best_album.append(sorted_music[0][0])

    # "장르 내에서 재생 횟수가 같은 노래 중에서는 고유 번호가 낮은 노래를 먼저 수록합니다."
    # 위 조건은 이미 노래가 고유번호 순서대로 추가되어 있으므로 따로 신경쓸 필요가 없습니다.

    return best_album
```

## 4. 배운점

이 문제풀이는 나름 코드가 깔끔하게 짜인 것 같아 기분이 좋다. 다른 사람들의 풀이를 봐도 전체적인 접근 방법은 비슷비슷한데, 세부 구현만 조금씩 다른 정도인 것 같다.
