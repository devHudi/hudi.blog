---
title: "OAuth 2.0 개념과 동작원리"
date: 2022-07-13 01:00:00
tags:
  - 학습기록
  - OAuth
---

## OAuth 등장 배경

우리의 서비스가 사용자를 대신하여 구글의 캘린더에 일정을 추가하거나, 페이스북, 트위터에 글을 남기는 기능을 만들 수 있을 것 이다. 이때, 가장 쉽게 이 기능을 구현하는 방법은 사용자로부터 구글, 페이스북, 트위터의 ID, Password 를 직접 제공받아 우리의 서비스에 저장하고 활용하는 방법이다.

![](./1.png)

하지만 이런 방법이 안전할까? 사용자들은 처음보는 우리 서비스를 신뢰하고 자신의 구글 계정 정보를 맡길 수 있을까? 만약 서비스의 데이터베이스가 의문의 해커에게 탈취라도 당한다면? 사실 현재의 관점으로 바라보면 미친짓이나 다름없다. 하지만, OAuth가 없었던 이전에는 실제로 이런 방식으로 많이 구현했다고 한다.

![](./2.png)

심지어 일반적으로 사용자들은 많은 웹사이트에서 동일한 ID, Password 를 사용하기 때문에 이것이 유출된다면 우리의 사이트에서 피해가 발생하는 것으로만 끝나지 않을 것 이다.

이는 우리의 서비스와 구글, 페이스북, 트위터 등의 입장에서도 굉장한 부담이다. 우리의 입장에서는 사용자의 아주 민감한 정보를 직접 저장하고 관리해야한다는 부담이 생길 것 이다. 또한 구글, 페이스북, 트위터는 자신의 사용자 정보를 신뢰할 수 없는 제3자에게 맡긴다는 것이 매우 불만족스러울 것 이다.

이런 문제를 해결하기 위해 OAuth 가 등장하기 이전에는 구글은 AuthSub, 야후는 BBAuth 등 각자 회사가 개발한 방법을 사용하였다. 하지만 이 방식은 표준화 되어있지 않기 때문에 구글과 연동하는 서비스를 만들기 위해서는 AuthSub, 야후와 연동하기 위해서는 BBAuth 에 맞춰 개별적으로 개발하고 유지보수 해야한다.

이를 위해 등장한 것이 바로 OAuth 이다. 최초 1.0 버전은 2006년 트위터와 Ma.gnolia 가 주도적으로 개발하였고, 이후 1.0버전이 계속 개선되다가 2012년 OAuth 2.0이 등장하게 되었다.

> 이 포스팅에서는 가장 최신 버전인 OAuth 2.0을 기준으로 설명한다. 또한 2.0 버전과 하위 버전은 호환되지 않음에 주의하자.

## OAuth 란?

구글, 페이스북, 트위터와 같은 다양한 플랫폼의 특정한 사용자 데이터에 접근하기 위해 제3자 클라이언트(우리의 서비스)가 사용자의 **접근 권한을 위임(Delegated Authorization)**받을 수 있는 표준 프로토콜이다.

쉽게 말하자면, 우리의 서비스가 우리 서비스를 이용하는 유저의 타사 플랫폼 정보에 접근하기 위해서 권한을 타사 플랫폼으로부터 위임 받는 것 이다.

## OAuth 용어 정리

위에서 언급한 ‘사용자', ‘우리의 서비스', ‘타사 플랫폼(구글, 페이스북, 트위터)' 등을 부르는 용어가 존재한다.

- Resource Owner : 리소스 소유자. 우리의 서비스를 이용하면서, 구글, 페이스북 등의 플랫폼에서 리소스를 소유하고 있는 주체.
- Client : 보호된 자원을 이용하기 위해 Resource Server 에 등록된 우리의 서비스.
- Resource Server : 구글, 페이스북, 트위터와 같이 리소스를 가지고 있는 서버.
- Authorization Server : 성공적으로 인증을 마친 Client 에게 액세스 토큰을 발급해준다.

> Resource Server 와 Authorization Server 는 [공식문서](https://datatracker.ietf.org/doc/html/rfc6749#section-1.2)상 별개로 구분되어 있지만, 별개의 서버로 구성할지, 하나의 서버로 구성할지는 개발자가 선택하기 나름이라고 한다.

> Client는 우리가 구현하는 서비스이므로 Resource Owner와 헷갈리지 말자. Resource Server와 Authorization Server의 입장에서는 우리 서비스가 클라이언트이기 때문에 이런 이름을 갖게 된 것 이다.

## 동작 메커니즘

> 선행되어야 하는 작업이 있다. Client 를 Resource Server 에 등록해야하는 작업이다. Client 를 Resource 에 등록하면 Client ID와 Client Secret를 얻을 수 있다.

> Client ID는 공개되어도 상관없지만, Client Secret은 절대 유출되어서는 안된다. 심각한 보안사고로 이어질 수 있다.

![OAuth 2.0의 동작원리](./oauth2.0-process.png)

1. Resource Owner가 우리 서비스의 ‘구글로 로그인하기' 등의 버튼을 클릭해 로그인을 요청한다.
2. Client는 Client ID, Redirect URI, Response Type, Scope와 함께 Authorization Server에 로그인을 요청한다.
3. Authorization Server는 Resource Owner에게 자사의 로그인 페이지(구글 로그인 등)를 제공한다.
4. Resource Owner는 로그인 페이지에서 ID/PW를 Authorization Server에 제공한다.
5. Authorization Server는 인증이 성공하면 Authorization Code를 Resource Owner에게 발급한다.
6. Resource Owner는 곧바로 Authorization Code와 함께 Client로 리다이렉션된다.
7. Client는 방금 Resource Owner가 보내준 Authorization Code와 Client ID, Client Secret을 가지고 Authorization Server에게 Access Token을 요청한다.
8. Authorization Server는 유효한 요청이라면 Client에게 Access Token을 발급해준다. Client는 이 Access Token을 저장한다.
9. Client는 Resource Owner에게 로그인이 성공하였음을 알린다.
10. 이후 Resource Owner은 Client에게 서비스를 요청한다.
11. Client는 자신이 저장해둔 Access Token을 가지고 Resource Server의 API를 호출한다.
12. Resource Server는 Access Token을 검증하고 리소스를 제공한다.
13. 이어서 Client도 Resource Owner에게 리소스를 제공한다.

## 백엔드와 프론트엔드의 역할

필자가 사실 OAuth를 공부하며 가장 혼란스러웠던 것은 Client의 백엔드, 프론트엔드 사이의 역할을 어떻게 나누어야 하냐는 점 이었다. 어딜 찾아봐도 Client로 뭉뚱그려 설명되어 있을 뿐 백엔드와 프론트엔드에 대한 상세한 이야기는 찾아보기 힘들었다. 이런저런 시행착오를 하며 아래와 같이 나름의 결론을 지어보았다.

일단, Authorization Server의 로그인 페이지로 이동하기 위한 URL을 생성하는 것은 프론트엔드, 백엔드 어디서해도 괜찮다고 생각한다. 단, Client ID나 Scope와 같은 정보들의 응집도를 위해 이것도 백엔드에서 생성하고, 프론트엔드는 백엔드로부터 URL을 가져오는것이 좋다고 생각한다. 일단, 백엔드가 URL을 생성한다고 가정한다.

프론트엔드는 백엔드가 생성한 로그인 URL을 가져와서 사용자에게 보여준다. 사용자는 프론트엔드가 표시한 ‘구글로 로그인하기' 등의 버튼을 클릭하고, Authorization Server의 로그인 페이지로 이동될 것 이다. 그리고 사용자는 로그인을 마치고 Redirect URI로 리다이렉션될텐데, 이때 Redirect URI은 프론트엔드의 URI로 한다.

프론트엔드로 리다이렉트 되었다면 함께 전달된 Authorization Code를 백엔드 API를 통해 백엔드로 전달한다. Authorization Code를 전달받은 백엔드는 Authorization Code, Client ID, Client Secret으로 Authorization Server로부터 Access Token을 발급받는다.

Redirect URI를 백엔드 URI로 설정하면, 백엔드는 다시 프론트엔드로 사용자를 리다이렉션 해줘야하는데, 이것이 API서버의 적절한 역할인지 모르겠다. 또한 사용자의 브라우저 흐름도 Authorization Server 로그인 페이지 → 백엔드 → 프론트엔드 로 이어져 어색하다. 사용자가 굳이 방문하지 않아도 되는 백엔드를 브라우저로 직접 거쳐야하는 과정은 어색하다고 생각된다. 따라서 Redirect URI를 프론트엔드로 설정하였다.

## 마치며

OAuth 2.0을 글로만 공부하면 이해가 정말 어려운 것 같다. 필자도 OAuth SDK 없이 직접 OAuth를 간단히 구현해보며 많은 깨달음을 얻었다. 다음 포스팅은 Spring Boot로 직접 간단하게 OAuth 2.0을 Spring Security 없이 구현해보는 것을 다뤄보려 한다.
