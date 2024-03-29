---
title: "문제 해결 능력을 위한 깊이 있는 학습 방법에 대해"
date: 2022-09-09 21:30:00
tags:
  - 회고
---

**[자바 공부를 어떻게 하길래, "언체크드 예외 발생시 트랜잭션 롤백?"](https://www.youtube.com/watch?v=_WkMhytqoCc)** 백기선님의 유튜브 영상 제목이다. 다소 자극적인 제목의 영상이지만, 영상을 보는 내내 깊이 공감하고 또 깊이 반성했다. 위 영상을 보고, 자극을 받아 오랜만에 좋은 학습 방법에 대한 내 생각을 글로 작성해본다.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/_WkMhytqoCc" title="자바 공부를 어떻게 하길래, "언체크드 예외 발생시 트랜잭션 롤백?"" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

영상을 보면 자바의 Checked Exception 및 Unchecked Exception 관련된 내용을 검색했을 때, 많은 블로그에서 Checked Exception이 발생했다면 트랜잭션을 롤백하지 않고, Unchecked Exception이 발생했다면 롤백한다고 설명 되어있다. 지금껏 나는 Checked Exception과 Unchecked Exception의 차이점은 명시적인 예외 처리 여부와 확인 시점 정도로 알고있었다. 그래서 저 표를 보았을 때 _'Checked/Unchecked Exception이 애초에 자바 언어의 스펙이고, 웹 프레임워크에 종속적인 내용도 아닌데, 왜 트랜잭션 롤백에 대한 이야기가 나올까?'_ 라는 의문이 들었다. 영상에 따르면 알고보니 저 문장의 기원은 스프링의 트랜잭션 처리 정책이라고 한다.

내가 데이터베이스 트랜잭션 격리 수준에 대해서 처음 공부한다고 가정해보자. 찾아보니 격리 수준이 참 많다. UNCOMMITTED-READ, COMMITTED-READ, REPEATABLE-READ, SERIALIZABLE … 각 격리 수준 별로 발생하는 문제도 있단다. UNCOMMITTED-READ는 Dirty Read, Non-Repeatable Read, Phantom Read가 발생한다고 한다. '근데, REPEATABLE-READ는 Dirty Read와 Non-Repeatable Read는 발생하지 않네?' **열심히 적고 외운다**. 책 내용을 다 외웠다. **그럼 이제 나는 데이터베이스 트랜잭션 격리 수준에 대해 이해한 사람인가?** 이와 같은 학습 방법에는 2가지 문제점이 존재한다.

첫번째로, 학습 주제에 대한 설명에 **자신이 모르는 개념이 포함**되어 있다. 라면에 대해 '라면은 국수를 증기로 익힌 뒤 기름에 튀겨 말린 것에 분말 스프를 별도로 첨부한 즉석 식품입니다.' 라고 잘 설명하는 사람이 정작 '국수', '기름', '분말 스프' 가 무엇인지 모른다면, 이 사람은 라면에 대해 알고있는 사람인걸까? 국수가 무엇인지, 기름이 무엇인지, 분말 스프가 무엇인지를 알아야 온전히 라면이 무엇인지를 이해했다고 할 수 있다.

_'UNCOMMITTED-READ는 Dirty Read, Non-Repeatable Read, Phantom Read 가 발생할 수 있다.'_ 라는 **'문장'을 외운** 사람은 Dirty Read, Non-Repeatable Read, Phantom Read가 무엇인지 모른다. **즉, '무엇'에 대한 학습의 depth가 얕다.**

두번째로, **'왜?' 라는 질문이 생략되었다.** 기술은 문장을 외우라고 등장한 것이 아니다. 기술은 현실 세계에 존재하는 **'문제를 해결하기 위해'** 세상에 등장한다. 이런 기술을 적절한 곳에 잘 사용하기 위해서는 **'왜?' 라는 질문을 통해 기술에 대해 깊이있는 이해**를 하는 것이 중요하다. _'UNCOMMITTED-READ는 왜 쓰는것일까?'_ 그럼, _'REPEATABLE-READ는 언제, 왜 쓰는 것일까?'_ 애초에 _'트랜잭션 격리를 왜 해야하는것이고, 왜 여러 수준으로 나뉘어져 있는 것일까?'_ 라는 질문을 스스로에게 던지다보면, **기술에 대한 이해가 깊어지고, 언제 어디에 기술을 적용해야하는지 알 수 있게 된다**.

또한 '왜?' 는 **기술의 내부 동작 과정과 원리를 학습하기 위한 좋은 도구**이다. **'왜?'를 통해 '어떻게?'에 도달**하는 것이다. _'왜 UNCOMMITTED-READ는 Dirty Read, Non-Repeatable Read, Phantom Read 가 발생할까?'_ 라는 질문을 던지고, 답변하기 위해서는 **실제로 데이터베이스가 내부에서 UNCOMMITTED-READ 수준에서 트랜잭션이 어떻게 격리되는지 학습**해야한다. 이처럼 '왜?' 라는 질문은 전보다 훨씬 깊은 수준의 학습을 할 수 있도록 도와주는 좋은 도구이다.

혹은 '왜?' 는 기존의 방법을 **의심**하고, **비판적으로 사고**하게 만들어주며, 이로 인해 **더 나은 해결 방법**을 찾는 것을 도와줄수도 있다. 충분히 '왜?' 라는 질문을 던지며 학습했다면 영상과 같은 문제가 발생하지 않았을 수도 있겠다.

물론, 현실적으로 끝없이 '왜?' 라는 질문을 파고들 수 없다. 시간은 한정적이기 때문이다. 따라서 어느정도 깊이를 현실과 타협해야한다. 우아한테크코스 레벨3때 우아한형제들 커머스 웹 프론트 팀장님이신 **[마강휘(Vallista)님](https://vallista.kr/)**의 특강에서는 '왜?'라는 질문을 **1depth로 끝내지 않고, 최소 2depth 까지 파고드는 것을 권장하셨고, 3dpeth 까지 고민**해보는 것이 가장 좋다고 하셨다.

그런데, **왜** 기술의 내부 동작 과정을 학습하는 것이 중요한 것일까? 기술이 내부적으로 어떻게 동작하는지 알고 있다면, 서비스에 장애가 발생했을경우 더 빠르고 능숙하게 문제를 해결할 수 있기 때문이다. 즉, **높은 문제 해결 능력**을 함양하기 위함이다.

우아한테크코스 레벨4에서 TCP 소켓을 사용해 직접 HTTP 서버를 구현해보는 미션이 있었다. 이 미션에서 나는 소켓의 InputStream을 BufferedReader로 변환하여, 데이터를 한줄씩 읽어왔다. 그런데, 이상한 일이 발생했다. HTTP Request Message의 Header와 Body 사이의 CRLF를 받아온 이후로 더이상 BufferedReader가 readLine() 의 반환값을 넘겨주지 않고 어딘가에서 무한정 대기하였다. 이 문제로 며칠을 고생했다.

알고보니, BufferedReader의 readLine()은 캐리지 리턴 혹은 라인 피드를 만나야 라인의 끝으로 인식하고 사용자에게 데이터를 반환한다. 하지만, 이 때 수신한 HTTP 데이터의 마지막에 캐리지 리턴이나 라인 피드가 없어 무한정 대기하고 있던 것이었다. 이 문제를 BufferedReader의 내부 동작을 라인 브레이크를 찍어가며 파악하기 전까지는 알지 못했다. 내가 자바 BufferedReader의 **내부 동작 과정을 알고 있었다면 며칠을 고생하지 않았을 것**이다.

비슷한 맥락으로 CS 지식이 중요하다는 것도 앞서 말한 문제 해결 능력 이야기와 이어진다. CS 지식이 중요하다는 이야기는 스피드 퀴즈 마냥 _'프로세스와 쓰레드의 차이가 무엇인가요?'_ 라는 질문에 누구보다 **빠르게 암기한 내용을 줄줄 이야기 할 수 있는 것이 중요하다는 것이 아니다**. 우리가 만든 소프트웨어, 특히 웹 애플리케이션은 운영체제, 네트워크, 데이터베이스 환경위에서 동작한다. 애플리케이션에서 장애가 발생했을 때, 우리가 작성한 코드가 잘못되었을 가능성도 있지만, 애플리케이션이 동작하는 그 **환경에서 발생한 문제일 가능성**도 크다. 즉, 우리가 만든 프로그램 뿐 아니라 **우리가 만든 프로그램이 살아 숨쉬는 환경에 대한 깊은 공부도 문제 해결 능력을 기르기 위해 중요**하다.

즉, 기업에서 지원자에게 CS 지식을 요구하는 것은 **'이 지원자가 암기를 얼마나 잘하는가'가 아닌 '이 지원자가 서비스 장애가 발생했을 때 얼마나 능숙하게 트러블 슈팅을 할 수 있는지' 를 판단하기 위함**이다. CS 지식을 공부한다고 무엇인지도 모르는, 왜 사용되는지 모르는 개념의 문장을 받아쓰기 공부 마냥 암기 하는 것은 별 의미가 없다고 생각한다.

더 나아가 학습의 범위는 텍스트를 읽고 이해하는 것에서 끝나는 것이 아니라, 그 **이론적인 내용을 직접 경험해보는 것**까지 포함된다고 생각한다. 우아한테크코스 두번째 레벨 인터뷰에서 토미는 나에게 **_"왜 스프링을 사용하시나요?"_**라는 질문을 던져주셨다. 조금 당황했지만, 어디서 주워들은 말로 열심히 대답을 했다. **_"스프링이 등장하기 전에는 EJB를 사용했는데, 프레임워크를 사용하기 위해 객체를 특정 구현체를 상속하도록 요구되었습니다. 자바의 단일 상속 제한으로 인하여 객체지향의 이점을 제대로 얻지 못하고, 프레임워크에 종속적인 코드를 작성하게 되었고, …"_** 나름 잘 대답한 것 같았다.

그런데 토미는 약간 갸우뚱 하시더니 **_"자바에서 스프링 외의 프레임워크를 사용해보셨나요?"_** 라고 질문을 주셨다. 말문이 턱 막혔다. 저 질문에는 **_"당신은 스프링이 등장하기 이전의 프레임워크를 실제로 사용해보았고, 당신이 이야기한 문제를 실제로 겪었나요? 또한 스프링을 사용함으로써 그런 문제들이 실제로 해소되었나요?"_** 라는 의미가 함축되어 있다. 나는 힘없이 _"아니요… 사용해보지 않았습니다."_ 라고 대답할 수 밖에 없었다. 그럴듯하게 말은 잘 한 사람이 사실 관련된 경험이 전혀 없었다는 것을 알게 되었다면 그 사람을 신뢰할 수 있을까?

정리해보자면, 어떤 주제에 대해 학습을 위해서는 우선 **'무엇' 에 대해 깊게 공부**해야한다. **학습 대상을 설명하는 문장에도 모르는 개념이 존재하면, 그 개념까지 함께 학습하는 것을 반복해야한다.** 마치 DFS 처럼 말이다. 그 이후에는 각각의 개념에 대해 **'왜?' 라는 질문을 2 ~ 3 depth까지** 던져보며 **'어떻게?' 까지 도달하여 한 주제에 대해 깊은 이해**를 해보자. 이런 학습 과정에서는 직접 적용해보고, 구현해보는 등의 **'경험'이 동반**되어야 한다.

학습을 위해 개인 블로그를 운영하는 것은 참 좋은 문화라고 생각한다. 그런데, 자신이 글을 열심히 쓰고 있다는 그 사실만에 취하기 전에 블로그를 통해 **_'진짜로 의미있는 학습을 하고 있는가?'_** 를 끊임없이 질문하면 좋겠다. 수동적으로 암기하는 것은 학습 비용이 당장 적게 들어가고 편하다. 그런데 그게 의미가 있는지, 시간낭비 하고 있는 것은 아닌지, 애초에 그 행위가 학습이 맞긴 한건지 부터 다시 생각하면 좋을 것 같다.

덧붙여, 읽기 쉽다는 이유로 책이나 공식문서, 해외 자료를 읽지 않고 국내 개인 블로그를 찾는 경우가 많다. 이는 위험할 수 있다. **한번 오개념으로 작성된 글이 학습을 위한 다른 개인 블로그로 전파되는 경우가 잦기 때문이다.** 글 맨 처음에 첨부한 영상에서 백기선님이 지적한 문제도 오개념을 계속 여기저기 퍼가면서 글을 작성하는 데에서 발생했다. 따라서 항상 '왜?' 라는 물음으로 **의심**하고, **교차검증** 해야한다. 사실 처음부터 어느정도 검증된 책, 공식문서와 해외 웹사이트에서 부터 자료를 찾는 습관을 들이는게 가장 좋다고 생각한다.
