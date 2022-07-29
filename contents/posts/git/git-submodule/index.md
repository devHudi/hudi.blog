---
title: "Git Submodule 알아보기"
date: 2022-07-30 01:30:00
tags:
  - 학습기록
  - git
---

## 학습배경

우테코 달록팀은 현재 JWT의 비밀키와 같은 민감한 정보를 다루기 위해 환경변수를 사용한다. 스프링부트 프로젝트의 `application.yml` 에 [Property Placeholders](https://www.notion.so/Git-Submodule-c0de62938f3742b98dfc83422f842c7d) 문법을 사용하여 OS 환경변수를 불러온다.

다른 팀들의 방식을 살펴보니 Git에 커밋되면 안되는 값을 다루는 방법들이 많이 달랐다. 그 중에서 가장 생소한 방식은 Git의 서브모듈을 사용하는 방식이었다. Git의 서브모듈은 우테코에 들어와서 처음 들어본 기능이었다. 따라서 서브모듈을 한번 간단하게 공부해보고자 글을 작성한다.

## 서브 모듈이란

Git의 레포지토리 하위에 다른 저장소를 관리하기 위한 도구이다. 이때 상위 레포지토리를 **슈퍼 프로젝트(superproject)**, 하위 레포지토리를 **서브 모듈(submodule)**이라고 부른다. (혹은 부모 저장소, 자식 저장소라고 부르기도 한다.) 서브모듈을 사용하면 특정한 Git 레포지토리를 다른 레포지토리의 하위 디렉토리로 사용할 수 있다.

슈퍼 프로젝트에 서브 모듈을 추가하면, 슈퍼 프로젝트가 하위 모듈의 특정 커밋을 가리키게 된다. 그리고 슈퍼 프로젝트는 현재 가리키고 있는 하위 모듈의 파일을 슈퍼 프로젝트에 추가하게 된다.

직접 서브 모듈 기능을 사용해보며 익혀보자.

## 레포지토리 생성

먼저 Github에 `super-repository` 와 `sub-repository` 라는 이름의 레포지토리를 생성한다. 각각은 슈퍼 프로젝트와 서브 모듈이다. 그리고 생성한 레포지토리를 로컬 환경으로 클론하자.

먼저 `sub-repository` 에 파일을 하나 추가, 커밋, 푸시를 할 것 이다. 학습을 위함이니 그냥 빈 파일을 생성하고 푸시해보자. `sub-repository` 디렉토리로 이동후 아래 명령을 작성한다.

```bash
$ touch a
$ git add .
$ git commit -m "first commit"
$ git push origin main
```

서브 모듈을 등록할 준비가 완료되었다.

## 서브 모듈 등록

이제 `super-repository` 의 레포지토리의 `lib` 디렉토리에 `sub-repository` 를 서브 모듈로 등록할 것 이다. `super-repository` 의 디렉토리로 이동한 다음 아래 명령을 입력하여 서브 모듈을 등록하자.

```bash
$ git submodule add https://github.com/devHudi/sub-repository.git lib
```

`super-repository` 디렉토리에 `sub-repository` 가 클론되며, 서브모듈이 등록된다. 확인해보면 `lib` 이라는 디렉토리가 생성되었을 것 이다.

### .gitmodules

여기에 추가로 `.gitmodules` 란 파일이 생성된 것을 확인할 수 있다. 이 파일에는 서브 디렉토리와 서브 모듈 저장소 URL이 매핑된 설정 정보가 담겨져있다. `cat` 명령으로 확인해보자.

```bash
$ cat .gitmodules
[submodule "lib"]
	path = lib
	url = https://github.com/devHudi/sub-repository.git
```

`.gitmodules` 도 `.gitignore` 와 마찬가지로 버전관리 대상이다. 이 파일을 통해 프로젝트 참여자들이 이 프로젝트에 어떤 서브 모듈이 있는지 확인할 수 있다.

### 특별한 lib 디렉토리

여기서 `git diff` 명령을 사용하면 재밌는 점을 발견할 수 있다.

```bash
$ git diff --cached lib
diff --git a/lib b/lib
new file mode 160000
index 0000000..e45f25d
--- /dev/null
+++ b/lib
@@ -0,0 +1 @@
+Subproject commit e45f25dc08aabcfa40b666125bdb389a2375e0c7
```

> `git diff` 명령을 사용해 Git 디렉토리에서 파일이 변경된 내용을 확인할 수 있다. `--cached` (혹은 `--staged`) 옵션은 아직 커밋되지 않고, 스테이지에 올라간 파일 대상으로 변경 내용을 확인한다. 그리고 `lib` 은 변경 사항을 확인할 대상이다.

분명 `lib` 디렉토리에 서브모듈이 클론되고, `a` 라는 파일이 생성되었는데 `git diff` 의 결과물에는 보이지 않는다. Git은 이 `lib` 디렉토리를 서브모듈로 취급하기 때문에, `lib` 하위 파일의 변경사항을 추적하지 않는다. 대신에 서브 모듈 디렉토리를 통째로 특별한 커밋으로 취급한다.

마지막줄에 나와있는 `e45f25...` 커밋 해시를 기억해보자. 그리고 다시 서브 모듈 디렉토리로 이동해서 아래와 같은 명령을 입력한다.

```bash
$ git log
commit e45f25dc08aabcfa40b666125bdb389a2375e0c7 (HEAD -> main, origin/main)
Author: devHudi <devhudi@gmail.com>
Date:   Sat Jul 30 00:09:43 2022 +0900

    first commit
```

`git diff` 명령을 사용했을때 출력된 커밋 해시와 동일하다. 즉, 슈퍼 프로젝트는 서브 모듈의 특정 커밋을 가리키고 있다.

## 서브 모듈 변경 & 슈퍼 프로젝트에 반영

서브 모듈을 변경해보고 그 변경 내용을 슈퍼 프로젝트에서 반영해보자. 다시 서브 모듈 디렉토리로 이동하고 아래 명령을 입력해서 `b` 라는 파일을 생성하고 커밋하자.

```bash
$ touch b
$ git add .
$ git commit -m "second commit"
$ git push origin main
```

다시 슈퍼 프로젝트 디렉토리로 이동하자. 그리고 아래 명령을 쳐서 pull을 받아오자.

```bash
$ git pull
Your configuration specifies to merge with the ref 'refs/heads/main'
from the remote, but no such ref was fetched.
```

어, 그런데 변경된 내용이 없다며 pull을 해오지 않는다. 왜 이럴까? `lib` 은 `super-repository` 와 독립적인 저장소이기 때문이다. `lib` 디렉토리로 이동한 다음 다시 pull을 해보자.

```bash
$ cd lib
$ git pull
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 2 (delta 0), reused 2 (delta 0), pack-reused 0
Unpacking objects: 100% (2/2), 208 bytes | 208.00 KiB/s, done.
From https://github.com/devHudi/sub-repository
   e45f25d..5eade94  main       -> origin/main
Updating e45f25d..5eade94
Fast-forward
 b | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 b
```

정상적으로 pull 되고, `b` 라는 파일도 생성된 것을 확인해볼 수 있다. 다시 `git diff` 로 확인해보자.

```bash
$ diff --git a/lib b/lib
index e45f25d..5eade94 160000
--- a/lib
+++ b/lib
@@ -1 +1 @@
-Subproject commit e45f25dc08aabcfa40b666125bdb389a2375e0c7
+Subproject commit 5eade94903dfef83124ea2b6a680cd3ad9622a8f
```

`e45f25...` 커밋이 `53ade9...` 커밋으로 변경되었다. 서브 모듈 디렉토리에서 `git log` 를 해보면 가장 최신 커밋 해시와 일치하는 것을 확인할 수 있다.

## 더 편하게 서브 모듈 최신 커밋 가져오기

위에서는 일일히 서브 모듈 디렉토리에 들어와서 pull 명령을 통해서 서브 모듈의 최신 버전을 가져왔다. 하지만 더 간단한 명령어가 존재한다. 일단 `c` 라는 파일을 생성하고 서브 모듈에 커밋하고 푸시하자. 그리고 슈퍼 프로젝트 디렉토리로 이동한 다음 아래 명령을 입력해보자.

```bash
$ git submodule update --remote
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 2 (delta 0), reused 2 (delta 0), pack-reused 0
Unpacking objects: 100% (2/2), 208 bytes | 104.00 KiB/s, done.
From https://github.com/devHudi/sub-repository
   5eade94..7ced843  main       -> origin/main
Submodule path 'lib': checked out '7ced843b8f637a5bf9096edd56da92a97b99f907'
```

더 간단하게 서브 모듈의 최신 커밋을 가져올 수 있다.

## 서브모듈을 포함한 프로젝트 클론하기

서브모듈을 포함하는 프로젝트를 일반적으로 클론하면, 서브모듈 디렉토리는 빈 디렉토리가 된다. `--recurse-submodules` 옵션을 사용하여 클론해야지 서브모듈을 자동으로 함께 가져온다.

```bash
$ git clone --recurse-submodules https://github.com/devHudi/super-repository.git
```

## 서브 모듈을 사용하여 민감 정보 관리하기

서브모듈을 사용하면 복수의 레포지토리에서 공통으로 사용되는 여러 상수나, 로직 등 공통으로 사용되는 부분을 서브 모듈로 분리하여 관리할 수 있게 된다.

하지만, 서브 모듈을 사용하면 민감한 정보를 프라이빗 레포지토리에 저장하고, 해당 레포지토리를 서브 모듈로 프로젝트에 등록할 수 있다. 민감한 정보라면 데이터베이스 연결 정보, JWT 시크릿 키 등이 있을 것 이다. 이런 정보를 서브 모듈을 사용하여 관리하면 데이터를 보호할 수 있을 뿐만 아니라 민감정보의 형상관리까지 가능해진다.

프라이빗 레포지토리를 서브 모듈로 등록하면, 서브 모듈 레포지토리에 권한이 없는 사람이 슈퍼 프로젝트를 클론해도 민감 정보를 조회할 수 없다.

## 참고

- [https://git-scm.com/book/ko/v2/Git-도구-서브모듈](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%EC%84%9C%EB%B8%8C%EB%AA%A8%EB%93%88)
- [https://www.atlassian.com/git/tutorials/git-submodule](https://www.atlassian.com/git/tutorials/git-submodule)
- [https://gitkraken.medium.com/learn-git-what-is-a-submodule-c87126282ee4](https://gitkraken.medium.com/learn-git-what-is-a-submodule-c87126282ee4)
- [https://www.youtube.com/watch?v=TAe4uZqYt6c](https://www.youtube.com/watch?v=TAe4uZqYt6c)
