---
title: "SSH config를 통해 간편하게 SSH 연결하기"
date: 2022-08-08 21:50:00
tags:
  - 운영체제
---

유닉스 계열 OS에서는 SSH의 Config를 설정하여 마치 Alias를 설정한 것 처럼 간단하게 SSH 접속을 할 수 있다. 지금까지 달록 프로젝트를 하면서 SSH 연결을 위해 쉘 스크립트를 작성하고 사용했는데 바보같은 짓 이었다.

## ~/.ssh/config 생성

```shell
$ cd ~/.ssh
$ vim config
```

위 명령을 통해 `~/.ssh/config` 파일을 생성한다. 이미 존재한다면, 존재하는 파일을 편집한다. 여기에 아래와 같이 설정을 입력할 것이다.

```
Host hostname
	HostName XXX.XXX.XXX.XXX
	User ubuntu
	Port 22
	IdentityFile ~/.ssh/XXXXXXX.pem
```

- **Host**: 접속할 호스트의 이름을 설정하는 부분이다.
- **HostName**: 접속할 호스트의 IP 주소이다.
- **User**: 접속할 호스트의 유저 이름이다.
- **Port**: SSH로 접속할 포트이다. 기본 포트(22)를 사용한다면 생략해도 된다.
- **IdentityFile**: 호스트 접속시 사용되는 키의 경로를 입력한다. AWS에서 발급받은 pem 키등이 여기에 해당된다.

여러 호스트를 설정할 것 이라면, 작성한 Config 아래에 이어서 계속 작성해주면 된다.

## SSH 접속하기

앞서 작성한 호스트 이름을 사용해서 아래와 같이 손쉽게 SSH 접속을 할 수 있다.

```shell
$ ssh hostname
```
