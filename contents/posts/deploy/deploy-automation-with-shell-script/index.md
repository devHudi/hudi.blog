---
title: "쉘 스크립트와 함께하는 달록의 스프링부트 어플리케이션 배포 자동화"
date: 2022-07-19 01:45:00
tags:
  - 학습기록
  - 데브옵스
  - 우아한테크코스
  - 달록
---

> 이 글은 우아한테크코스 4기 [달록팀의 기술 블로그](https://dallog.github.io/deploy-automation-with-shell-script/)에 게시된 글 입니다.

웹서비스 개발팀은 새롭게 개발한 서비스의 기능을 어떻게 사용자에게 전달할까요? 새로운 기능이 메인 브랜치에 병합될 때 마다 EC2 인스턴스에 접속하여 브랜치를 Pull 하고, 프로젝트를 빌드하고, 현재 동작중인 어플리케이션의 프로세스를 종료하고, 새롭게 빌드된 어플리케이션의 프로세스를 띄우는 과정...

배포가 필요할때마다 이런 명령을 수동으로 일일히 입력한다면, 그건 너무 지루한 작업아닐까요? 😫 실수라도 하면 어쩌죠? 😰

우테코 달록팀 백엔드는 이런 한계점을 극복하고자 쉘 스크립트를 활용하여 배포 프로세스를 자동화하였습니다. 달록팀은 어떻게 스프링부트 어플리케이션의 배포를 자동화했을까요?

## 쉘 스크립트

쉘 스크립트는 유닉스/리눅스 기반 운영체제에서의 일련의 명령으로 구성된 실행가능한 텍스트 파일입니다. 원래라면 일일히 키보드로 입력해야하는 리눅스 명령을 하나의 파일에 모아두고, 한번에 실행할 수 있죠. 작성된 명령은 셸이라고 불리는 명령줄 인터프리터에서 실행되며, 위에서부터 아래로 차례로 실행됩니다. 이 쉘 스크립트를 이용해 리눅스 환경에서 여러 프로세스를 자동화할 수 있습니다.

달록이 스프링부트 어플리케이션을 배포하는 환경은 Ubuntu 22 버전이므로 쉘 스크립트를 활용할 수 있습니다.

## 수동으로 배포하기

배포 프로세스를 자동화하려면 우선 수동으로 어떤 명령을 사용해서 배포를 하는지 알아야합니다. 어떤과정을 거쳐 배포되는지부터 알아볼까요?

> 레포지토리는 이미 Clone 되어있다고 가정합니다.

### 1. Git Pull

```shell
$ cd 2022-dallog/backend
$ git pull
```

우선 Github에서 가장 최신 버전을 pull 해와야겠죠?

### 2. 빌드

```shell
./gradlew bootJar
```

`gradlew` 를 사용하여 자바 프로젝트를 빌드해서 `.jar` 파일을 생성합니다.

### 3. 프로세스 종료

```shell
$ ps -ef | grep jar
$ kill -15 XXXXX
```

`ps` 명령을 사용해서 실행중인 스프링부트 어플리케이션의 PID를 알아내고, `kill` 명령을 통해 프로세스를 종료합니다.

### 4. 환경변수 설정

달록의 스프링부트 어플리케이션은 여러 민감한 정보를 환경변수를 사용하여 외부에 노출되지 않도록 하였습니다. 따라서 어플리케이션이 실행될 때 환경변수도 함께 설정을 해주어야합니다.

```shell
$ export GOOGLE_CLIENT_ID="XXXXX"
$ export GOOGLE_CLIENT_SECRET="XXXXX"
$ export GOOGLE_REDIRECT_URI="XXXXX"
$ export GOOGLE_TOKEN_URI="XXXXX"
$ export JWT_SECRET_KEY="XXXXX"
$ export JWT_EXPIRE_LENGTH=3600

...
```

### 5. 드디어 실행

```shell
$ sudo -E nohup java -jar ./build/libs/backend-0.0.1-SNAPSHOT.jar
```

드디어 스프링부트 어플리케이션을 실행합니다.

이 귀찮은 과정을 배포 할때마다 해야한다니 벌써 머리가 어질어질 하네요. 😵‍💫 그렇다면 앞서 소개드린 쉘 스크립트를 통해서 이 과정을 자동화해볼까요?

## 달록의 배포 쉘 스크립트

```shell
#! /bin/bash

PROJECT_PATH=/home/ubuntu/2022-dallog
PROJECT_NAME=backend
PROJECT_BUILD_PATH=backend/build/libs

cd $PROJECT_PATH/$PROJECT_NAME

clear

echo "🌈 Github에서 프로젝트를 Pull 합니다.\n"

git pull

echo "\n🌈 SpringBoot 프로젝트 빌드를 시작합니다.\n"

./gradlew bootJar

CURRENT_PID=$(pgrep -f ${PROJECT_NAME}-.*.jar | head -n 1)

if [ -z "$CURRENT_PID" ]; then
	echo "🌈 구동중인 애플리케이션이 없으므로 종료하지 않습니다."
else
	echo "🌈 구동중인 애플리케이션을 종료했습니다. (pid : $CURRENT_PID)"
	kill -15 $CURRENT_PID
fi

echo "\n🌈 SpringBoot 환경변수 설정"

export GOOGLE_CLIENT_ID="XXXXX"
export GOOGLE_CLIENT_SECRET="XXXXX"
export GOOGLE_REDIRECT_URI="XXXXX"
export GOOGLE_TOKEN_URI="XXXXX"
export JWT_SECRET_KEY="XXXXX"
export JWT_EXPIRE_LENGTH=3600

echo "\n🌈 SpringBoot 애플리케이션을 실행합니다.\n"

JAR_PATH=$(ls $PROJECT_PATH/$PROJECT_BUILD_PATH/ | grep .jar | head -n 1)
sudo -E nohup java -jar $PROJECT_PATH/$PROJECT_BUILD_PATH/$JAR_PATH &
```

달록이 작성한 배포 자동화 쉘 스크립트는 아래와 같습니다. 차근차근 알아볼까요?

### #! /bin/bash

`#! /bin/bash` 은 해당 쉘 스크립트가 많은 쉘 중 **Bash Shell 로 실행됨**을 알립니다.

### 변수 사용

`PROJECT_PATH`, `PROJECT_NAME` 과 같이 자주 사용되는 데이터는 쉘 스크립트에서 제공하는 변수 기능으로 분리하였습니다. 이때 주의할 점은 쉘 스크립트에서 변수를 선언할 때 `=` **앞뒤에 공백이 와서는 안된다는 점** 입니다.

### echo

`echo` 명령을 통해 배포 프로세스가 어디까지 진행됐는지 사용자에게 알려줍니다.

### 실행중인 어플리케이션의 PID 가져오기

```shell
CURRENT_PID=$(pgrep -f ${PROJECT_NAME}-.*.jar | head -n 1)
```

#### pgrep

쉘 스크립트 중 위와 같은 코드가 있었습니다. 위 코드는 우선 `pgrep` 이라는 명령을 통해서 실행중인 프로세스의 이름으로 PID 목록을 가져옵니다.

#### pipe와 head

그리고 파이프(`|`)명령으로 다른 프로세스로 PID 목록을 보냅니다. PID 목록은 `head` 명령으로 전달되며, `head` 명령은 PID 목록의 첫번째만을 가져옵니다.

#### 명령의 실행결과를 변수에 담기

이렇게 가져온 PID는 `$()` 문법을 통해 `CURRENT_PID` 변수에 저장됩니다. `$()` 는 `$(command)` 형태로 사용되며, 괄호 내부의 실행 결과를 변수로 저장하기 위해 사용됩니다.

### 조건문

쉘 스크립트에도 `if` 문을 사용하여 조건문을 작성할 수 있습니다. 다만, 우리에게 익숙한 프로그래밍 언어에서의 if문과는 조금 괴리가 존재해서 별도로 학습이 필요할수도 있습니다.

```shell
if [ -z "$CURRENT_PID" ]; then
	echo "🌈 구동중인 애플리케이션이 없으므로 종료하지 않습니다."
else
	echo "🌈 구동중인 애플리케이션을 종료했습니다. (pid : $CURRENT_PID)"
	kill -15 $CURRENT_PID
fi
```

위 코드는 아까 PID를 담은 `CURRENT_PID` 가 비어있는지 확인한 후 존재하지 않다면 메시지만 출력하고, 존재한다면 해당 PID를 `kill` 명령으로 종료합니다.

쉘 스크립트의 `if` 문에서 `-z` 는 조건식의 종류 중 하나이며, 주어진 문자열의 길이가 0이라면 True를 나타냅니다. 확실히 조금 낯설죠? 😅

### JAR파일 경로 가져오기

```shell
JAR_PATH=$(ls $PROJECT_PATH/$PROJECT_BUILD_PATH/ | grep .jar | head -n 1)
```

`ls` 명령을 통해 빌드 디렉토리의 파일 목록을 가져오고, `grep` 명령을 통해 `.jar` 파일만을 가져옵니다. 그다음 `head` 명령을 통해 단 하나의 파일만을 가져온 다음, `JAR_PATH` 변수에 저장합니다.

### 어플리케이션 실행하기

```shell
sudo -E nohup java -jar $PROJECT_PATH/$PROJECT_BUILD_PATH/$JAR_PATH &
```

어플리케이션을 실행합니다.

#### sudo -E

`sudo` 명령 뒤에 붙은 `-E` 옵션은 유저가 설정한 환경변수를 `sudo` 명령에서도 공유하여 사용할 수 있도록 만드는 옵션입니다.

#### nohup

`nohup` 명령은 현재 **터미널 세션이 끊어져도 프로세스가 계속 살아있도록** 만들기 위해 사용되는 명령입니다.

#### Background 프로세스

그리고 명령 맨 뒤에 `&` 가 붙어있는데, 프로세스를 Foreground가 아닌 **Background에서 실행**하기 위해 붙여줍니다.

## 한계점

하지만, 이런 방식도 결국 한계점이 존재합니다. 특히나 달록과 같이 애자일한 조직에서는 최대한 작은 기능단위로 개발이 병렬적으로 진행되어, 메인 브랜치에 머지됩니다. 하루에 몇번이고 배포를 해야하는 상황이 발생할수도 있죠.
그렇지 않아도 모든 개발자가 바쁘게 새로운 기능을 개발하기 바쁜데, 메인 브랜치에 병합된 시점마다 EC2 인스턴스에 접속해서 쉘 스크립트를 실행해야할까요?

이런 한계점을 극복하고자, 달록팀은 앞으로 CI/CD 도구를 도입할 예정입니다. 세상에는 참 다양한 CI/CD 도구가 존재합니다. Jenkins, Github Actions, Travis CI, Circle CI, Gitlab CI/CD 등등...

달록의 이번 스프린트의 배포 태스크에서는 이런 다양한 CI/CD 도구들의 장단을 분석하고 도입할 예정입니다. 많은 기대 부탁드립니다. 👏👏
