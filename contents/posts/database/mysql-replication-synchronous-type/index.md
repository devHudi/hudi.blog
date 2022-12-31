---
title: "MySQL 복제 동기화 방식 - 비동기와 반동기"
date: 2022-11-15 01:30:00
tags:
  - 학습기록
  - 데이터베이스
  - mysql
---

## 비동기 복제 방식

### 특징

소스 서버에서 트랜잭션은 바이너리 로그에 저장되고, 레플리카 서버는 주기적으로 바이너리 로그를 요청한다. 비동기 복제 방식에서는 레플리카로 바이너리 로그에 저장된 이벤트가 (1) 잘 전달 되었는지, (2) 실제로 적용이 되었는지 알지 못하며 보장도 하지 않는다.

### 단점

소스 서버에 장애 발생 시 레플리카 서버로 이벤트가 제대로 전달되지 않을 수 있다. 즉, 복제에서 누락이 발생할 수 있다는 것을 의미한다. 만약 소스 서버 장애시 Failover를 위해 레플리카를 승격(promotion) 시킬 경우, 레플리카에서 누락된 데이터를 찾고, 필요 시 레플리카에 누락분을 수동으로 반영해야한다.

또한, 비동기 복제 방식에서는 소스에서 데이터를 변경한 직후 레플리카를 조회하면, 변경 전 내용이 조회될 수 있다. 일반적으로는 200~300ms 이내로 소스의 변경내용이 레플리카에도 적용되지만, 실시간성이 매우 중요한 쿼리의 경우 소스 서버로 직접 읽기 요청을 보내는것이 좋다.

### 장점

듣기만 했을 때는 비동기 복제 방식 왜 쓰나 싶은데, 좋은 점도 존재한다. 소스가 레플리카의 이벤트 전달 및 적용 여부를 전혀 신경쓰지 않으므로 이로 인한 오버헤드가 발생하지 않아 더 좋은 성능을 보인다. 또, 레플리카 서버를 전혀 신경쓰지 않으므로 레플리카 장애 시 영향을 받지 않는다. 따라서 레플리카 여러대를 연결한다고 하더라도 큰 문제 없다. 이런 특징으로 레플리카 서버에 무거운 쿼리가 돌아가 성능 저하가 발생해도 소스 서버는 무관하다. 즉, 데이터 분석용으로 사용하기 적합하다.

## 반동기 복제 방식

### 특징

반동기 복제 방식은 레플리카가 소스의 변동 내역을 전달 받았다고 소스에 알려줄때까지 기다리는 방식이다. 좀 더 자세히 이야기하자면, 소스 서버는 레플리카 서버가 소스 서버로부터 전달받은 변경 이벤트를 릴레이 로그에 기록 하고 응답(ACK)을 보내면 그 때 트랜잭션을 커밋한다. 이런 특징으로 비동기 복제 방식보다 좀 더 향상된 데이터 무결성을 제공할 수 있다.

하지만, 변경된 이벤트를 “전달” 받았음을 보장하는 것이지, “적용” 했음을 보장하지는 않는다. 레플리카는 이벤트를 릴레이 로그에 기록한 순간 ACK를 보낸다. 그래서 반동기(semi-synchronous) 이다.

### 단점

반동기 복제 방식은 트랜잭션 처리 중 레플리카의 응답을 기다리므로 트랜잭션 처리가 비동기 방식에 비해 늦다. 기본적으로 반동기를 위한 네트워크 통신이 한번 더 발생하며, 레플리카 서버에 부하가 걸려 ACK 응답이 더 늦는경우 트랜잭션 시간은 그만큼 더 길어진다. 따라서 물리적으로 가까이 위치한 경우 적용하기 적합하다.

물론 소스는 타임아웃을 지정하고, 레플리카 서버의 응답이 타임아웃 시간동안 오지 않다면 자동으로 비동기 복제 방식으로 전환한다고 한다. 또한, 여러대의 레플리카가 물려있을 때 모든 레플리카의 ACK를 받아야하는 것은 아니며, 사용자가 응답을 받아야하는 레플리카 수를 지정할 수 있다고 한다.

### 장점

앞서 살펴보았듯이 ACK 응답을 받은 뒤 트랜잭션을 커밋하므로 최소 하나 이상의 레플리카에는 복제가 성공했음을 보장할 수 있다. 복제 과정에서 정합성이 중요하고, 성능은 다소 떨어져도 되는 상황에서 사용하면 좋을 것 같다. 

## 더 공부해볼 키워드

- 반동기 복제 방식에서 `AFTER_SYNC` 와 `AFTER_COMMIT` 의 차이

## 참고

- Real MySQL 8.0 - 백은빈, 이성욱