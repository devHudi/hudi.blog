---
title: "직접 만들어보며 이해하는 JWT"
date: 2022-01-31 04:00:00
tags:
  - javascript
  - jwt
  - node.js
  - 인증/인가
---

> 본 포스팅에서는 JWT 의 정의, 구조, 원리 등을 알아보며 실습을 통해 ‘라이브러리 없이’ 직접 JWT 를 생성하고 해독해본다.

![](./thumbnail.png)

## 1. JWT 에 대하여

### 1-1. JWT 의 정의

Json Web Token 의 줄임말이다. [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) 에 명세되어 있는 국제 표준으로써, 통신 양자간의 정보를 JSON 형식을 사용하여 안전하게 전송하기 위한 방법이다. JWT 는 **정보가 토큰 자체에 포함된 (Self-Contained)** **클레임 (Claim) 기반** 토큰이다.

JWT 는 **인증 (Authentication)** 과 **권한부여(Authorization)** 에 사용되는 것이 가장 일반적이다. 인증 절차를 거쳐 서버에서 JWT 를 발급해주면, 클라이언트는 이를 잘 보관하고 있다가 API 등을 사용할 때에 서버에 JWT를 함께 제출하며 서버로부터 행위에 대해 인가 받을 수 있다.

JWT 는 해시 혹은 비대칭키 방식을 사용하여 **서명 (Signature)** 하기 때문에 무결성을 검증할 수 있다는 특징이 있다. 또한 토큰 자신이 정보를 직접 포함하고 있는 특징 덕분에, 통신 양자간 정보를 안전하게 전송할 때에도 사용된다.

또한 JWT 는 **URL에 대해 안전한 (URL-Safe)** 문자열로 구성되어 있어 어떤 경로로든 전송할 수 있다.

> 말이 조금 어렵다. 글 마지막의 JWT 를 직접 생성해보는 실습을 따라오면, 대부분의 내용이 이해될 것이니 너무 걱정하지 말자! 😁

### 1-2. 서버기반 인증 VS 토큰기반 인증

HTTP 는 무상태(Stateless) 프로토콜의 일종이다. 무상태 프로토콜이란, 각 요청을 독립적인 트랜잭션으로 취급하여 모든 상태가 어디에도 저장되지 않는다는 특성이다. 더 쉽게 풀어 설명하자면, 이전 요청과 현재 요청은 서로 관련이 없음을 뜻한다.

따라서 HTTP 그 자체만으로는 사용자가 아무리 인증에 성공한다고 하더라도, 그 인증 상태가 어디에도 저장되지 않는다. 로그인 하고, 다음 페이지로 이동한 뒤, 또 로그인을 해야하는 이상한 서비스는 아무도 사용하지 않을 것 이다.

이런 한계를 극복하기 위해 여러 인증 방법이 등장하게 되었고, 그 중 서버기반 인증과 토큰기반 인증 두가지에 대해 알아보겠다.

#### 서버기반 인증

서버기반 인증에서는 사용자가 성공적으로 로그인한 이후 서버에서 사용자에 대한 세션(Session) 을 생성한다. 또한 이와 동시에 사용자의 브라우저에는 세션 ID 를 저장하는 쿠키가 생성된다. 서버는 이 세션 ID 를 통해 사용자를 식별하고, 사용자에 대한 정보를 저장, 관리한다.

**‘서버에서 사용자에 대한 모든 정보를 갖고 있다’** 는 특징에 집중해보자. 만약 우리가 운영하는 서비스의 사용자가 증가하게 되어 서버를 확장해야 하는 상황에 직면했다고 가정한다.

이 경우 CPU 를 더 좋은 것으로 교체하고, HDD/SSD 용량을 더 큰 것으로 교체하는 등의 방법을 가장 먼저 생각할 수 있다. 이렇게 단일 컴퓨터의 장비를 고성능으로 교체하는 방식의 확장을 **수직 확장 (Scale Up)** 이라고 한다.

하지만, 이는 성능 증가에 따른 비용의 증가폭이 커 **경제적으로 부담**이 된다. 또한 한대의 서버만으로 운영하게 되므로, 이 서비스는 **단일 장애 지점 (SPOF: Single Point of Failure)** 를 갖게 되며, 서버가 다운되면 모든 서비스는 접속이 불가능해질 것 이다.

이런 이슈가 존재해 여러대의 서버를 한번에 운용하는 방법을 선택하는 것으로 방향을 틀었다고 가정해보자. 이렇게 서버를 여러대를 두어 확장하는 방식을 **수평 확장 (Scale Out)** 이라고 한다.

수직 확장의 경제적 부담과 비교하여, 수평 확장은 동일한 사양의 컴퓨터 한대만 추가하고 빼면서 스케일 관리를 할 수 있어 **경제적으로 훨씬 부담이 덜하며 확장에 유연**하다.

또한 하나의 서버 컴퓨터가 죽더라도, 다른 컴퓨터가 그대로 역할을 이어받으면 그만이다. 안정성 측면에서 바라봐도 우위에 있다고 할 수 있다. 이런 특징은 특히 사용자 증가폭 예측이 어려운 서비스에서 빛을 발하게 된다.

이런 Scaling 이슈로 인해 **현대의 대규모 트래픽 처리와 데이터 저장이 필요한 서비스들은 일반적으로 수평적으로 서버를 확장**한다.

하지만, 여러대의 서버를 사용하면 데이터의 불일치의 문제가 발생할 수 있다. 즉, 모든 서버가 메모리에 동일한 세션 정보를 가지고 있는 것이 아니다. 유저가 서비스 사용 중에 로그인이 풀리는 경험을 겪을 수 있다는 것 이다.

이를 해결하기 위해 운용중인 모든 서버 컴퓨터에서 유저의 세션 ID 를 모두 공유해야한다. 이런, 많이 귀찮아질 것 같다.

#### 토큰기반 인증

세션기반 인증에서 세션 정보는 서버 메모리 위에 저장된다고 하였다. 세션 정보에는 유저의 ID, 이름, 권한 등 유저의 여러 정보가 포함될 수 있다.

이에 반해 토큰기반 인증방식은 **유저의 정보를 서버에 저장하지 않는다**. 유저가 성공적으로 로그인하면, 서버는 클라이언트로 토큰 (가장 일반적으로 JWT 가 사용됨) 을 발급한다.

클라이언트는 토큰을 받아 저장하고, 서버에 요청을 할 때 **HTTP header 에 실어 함께 전송**한다. 서버는 이를 검증 (Verification) 하고, 유저를 인가한다. 이와 같이 서버는 **‘발급’** 과 **‘검증’** 두가지 역할만 할뿐 직접 정보를 갖고 있지 않다. 유저 상태의 저장 책임이 서버에서 클라이언트로 이동된 것이다.

이 말인 즉슨, 수평 확장의 환경에서 여러대의 서버 컴퓨터가 모두 유저에 대한 정보를 기억하고 있을 필요가 없다는 뜻이다.

하지만, JWT 와 같이 토큰 자체에 정보가 저장되는 형태의 토큰은 세션과 달리 클라이언트에 유저의 정보가 저장되므로 노출되기 매우 쉽다. 따라서 **민감한 정보를 담아서는 절대 안된다**. 또한 토큰의 사이즈는 세션 ID 에 비해 굉장히 비대하다. 토큰기반 인증을 사용하면 이런 토큰을 사용하여 통신하면서 발생하는 **오버헤드**를 감안해야한다는 단점이 존재한다.

뭐든지 ‘절대적으로’ 좋은 것은 존재하지 않는다. 좋은 개발자는 존재하는 기술을 적재적소에 사용할 수 있어야한다.

예전에는 의미없는 랜덤 문자열등을 생성해서 토큰 기반 인증을 구현하였는데, 이 토큰에는 만료시각 등의 정보를 담을 수 없어, 따로 만료시킬 수단이 존재하지 않는다. JWT 같은 경우 **데이터를 직접 갖고 있는 클레임 (Claim) 기반 토큰**이므로 토큰의 만료를 구현할 수 있게 되었다.

## 2. JWT 의 구조

토큰은 **헤더 (Header), 페이로드 (Payload), 서명 (Signature)** 세 부분으로 구성되어 있다. 각 구성요소는 점 (`.`) 으로 분리된다. 따라서 JWT 는 `헤더.페이로드.서명` 의 형태를 갖는다.

각각의 구성요소는 JSON 형태로 표현된다. 다만, JSON 의 경우 개행을 포함할 수 있어, 이를 한줄로 나타내기 위해 최종적으로는 각 구성요소를 **Base64** 로 인코딩한다.

### 2-1. 헤더 (Header)

헤더에는 일반적으로 토큰의 유형과 암호화 알고리즘 두가지 정보를 아래와 같이 JSON 의 형태로 담고있다.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

토큰을 사용하는 측에서 토큰의 유형이 JWT 임을 확신할 수 있다면, `typ` 필드는 생략되어도 괜찮다.

`alg` 에 넣어둔 암호화 알고리즘은 주로 HMAC SHA256 또는 RSA 가 사용된다. 이는 후술할 서명 (Signature) 에서 사용된다.

### 2-2. 페이로드 (Payload)

페이로드는 사용자의 정보 혹은 데이터 속성 등을 나타내는 클레임(Claim) 이라는 정보 단위로 구성된다. 클레임도 3가지로 구분할 수 있는데 각각 **등록된 클레임 (Registered Claim), 공개 클레임 (Public Claim), 비공개 클레임 (Private Claim)** 으로 구성되어 있다.

#### 등록된 클레임 (Registered Claim)

JWT 사양에 이미 정의된 클레임이다. 아래의 7개의 등록된 클레임이 정의되어 있다. 모든 클레임은 선택적이다. 토큰 사이즈를 작게 유지하기 위해 이름이 3글자로 축약되어 있는 것을 확인할 수 있다.

- `iss` : Issuer. 토큰 발급자를 나타낸다.
- `sub` : Subject. 토큰 제목을 나타낸다.
- `aud` : Audience. 토큰 대상자를 나타낸다.
- `exp` : Expiration Time. 토큰 만료 시각을 나타낸다. Numeric Date 형식으로 나타낸다.
- `nbf` : Not Before. 토큰의 활성 시각을 나타낸다. 쉽게 말해, 이 시각 전에는 토큰이 유효하지 않다는 의미이다. Numeric Date 형식으로 나타낸다.
- `iat` : Issued At. 토큰이 발급된 시각을 나타낸다. Numeric Date 형식으로 나타낸다. 이 값으로 토큰이 발급된지 얼마나 오래됐는지 확인할 수 있다.
- `jti` JWT ID. JWT 의 식별자를 나타낸다.

#### 공개 클레임 (Public Claim)

공개 클레임은 JWT 를 사용하는 사람들에 의해 정의되는 클레임으로, 충돌 방지를 위해 URI 형태로 이름을 짓거나, [IANA JSON Web Token Claims Registry](https://www.iana.org/assignments/jwt/jwt.xhtml) 라는 곳에 직접 클레임을 등록해야한다.

사실 단순히 서버와 클라이언트 사이에서 사용자를 인증하는 용도로 사용한다면 크게 신경쓰지 않아도 좋다. 서버-클라이언트 사이의 단순 통신을 넘어 제 3자도 JWT 토큰을 사용할 때 충돌이 일어나지 않도록 합의된 클레임이라고 생각하면 된다.

```json
{
  "email": "sample@domain.com",
  "profile": "http://domain.com/image.png",
  "http://domain.com/xxx/yyy/is_admin": true
}
```

위 처럼 등록된 공개 클레임인 `email` , `profile` 등을 사용할수도 있고, `http://domain.com/xxx/yyy/is_admin` 처럼 URI 형태로도 사용할 수 있다.

#### 비공개 클레임 (Private Claim)

서버와 클라이언트 사이에서만 협의된 클레임으로, 공개 클레임과 충돌이 일어나지 않게 사용하면 된다.

```json
{
  "user_id": "123456790",
  "user_age": 25
}
```

### 2-3. 서명 (Signature)

특정 암호화 알고리즘을 사용하여, Base64 인코딩된 헤더와 Base64 인코딩된 페이로드 그리고 비밀키를 이용하여 암호화한다. 서명을 통해 서버는 헤더 혹은 페이로드가 누군가에 의해 변조되었는지 그 무결성을 검증하고 보장할 수 있다.

HMAC SHA256 을 사용한 서명 생성을 아래와 같은 수도코드 (pseudo-code) 로 나타낼 수 있다.

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

## 3. JWT 직접 만들어보기

이제 JWT 의 원리를 알아보았으니, 직접 JWT 를 만들어본다. 개발 환경은 작성 기준 **node.js LTS 버전인 v16.13.2** 을 사용한다.

실습을 통해 아래의 데이터를 JWT 로 만들어보자.

#### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### Payload

```json
{
  "email": "devhudi@gmail.com",
  "name": "Hudi",
  "isAdmin": true
}
```

헤더에 나와있듯 암호화 알고리즘은 **HMAC SHA256 (HS256)** 을 사용한다.

### 3-1. 사전준비

`app.js` 파일을 생성하고, 아래와 같이 `crypto` 모듈을 불러온다. `crypto` 모듈은 node.js 에서 암호화 등의 작업을 할 때 사용되는 모듈이다. 별도의 설치 없어도 불러올 수 있다.

```js
const crypto = require("crypto")
```

또한 아래와 같이 json 형태의 객체를 Base64 로 인코딩 해주는 함수를 작성하자.

```js
function base64(json) {
  const stringified = JSON.stringify(json)
  // JSON을 문자열화
  const base64Encoded = Buffer.from(stringified).toString("base64")
  // 문자열화 된 JSON 을 Base64 로 인코딩
  const paddingRemoved = base64Encoded.replaceAll("=", "")
  // Base 64 의 Padding(= or ==) 을 제거

  return paddingRemoved
}
```

코드의 자세한 설명은 주석을 참고하자.

> Base64 로 문자열을 인코딩 하면, 결과물 마지막에 `=` 혹은 `==` 가 가끔 같이 나오는 경우가 존재한다. 이를 Padding 이라고 하는데, 이를 제거하지 않으면 URL Safe 하지 않게 되므로 반드시 제거하자. 제거해도 Decode 를 정상적으로 할 수 있다.

> 혹시 replaceAll 에서 `replaceAll is not a function` 오류가 발생하는가? node.js 버전이 v15 보다 낮은지 확인해보자. replaceAll 는 ES2021(ES12) 에서 공식 스펙으로 포함되었다.

### 3-2. Header 만들기

```js
const header = {
  alg: "HS256",
  typ: "JWT",
}

const encodedHeader = base64(header)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

단순히 header JSON 을 base64 인코딩 해준다.

### 3-3. Payload 만들기

```js
const payload = {
  email: "devhudi@gmail.com",
  name: "Hudi",
  isAdmin: true,
}

const encodedPayload = base64(payload)
// eyJlbWFpbCI6ImRldmh1ZGlAZ21haWwuY29tIiwibmFtZSI6Ikh1ZGkiLCJpc0FkbWluIjp0cnVlfQ
```

Header 와 마찬가지로 payload JSON 을 base64 인코딩 해준다.

### 3-4. Signature 만들기

```js
const signature = crypto
  .createHmac("sha256", "secret_key")
  .update(`${encodedHeader}.${encodedPayload}`)
  .digest("base64")
  .replaceAll("=", "")

// KeefPR1ixDwoNnBQ77YsBYQxXFkZR1VcAkah6yle5lk
```

인코딩된 header 와 payload 를 점(`.`) 으로 이어 붙인 것을 sha256 알고리즘을 사용하여 HMAC으로 암호화 한다. 이 또한 Base64 로 표현하도록 설정한다. 마찬가지로 Padding 을 제거한다.

> **HMAC (Keyed-hash Message Authentication Code)** 이란, 메시지 인증 코드 (MAC) 의 한 유형으로서 특정 Key 와 함께 특정 Message 를 Hash 값으로 만드는 암호화 방식이다. 공격자로 하여금 레인보우 테이블 기법의 해킹을 어렵게 하기 위해 원문과 함께 비밀키를 더하여 해싱하는 것 이다.

### 3-5. 조합하기

```js
const jwt = `${encodedHeader}.${encodedPayload}.${signature}`
```

이렇게 최종 생성된 JWT 는 아래와 같다.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmh1ZGlAZ21haWwuY29tIiwibmFtZSI6Ikh1ZGkiLCJpc0FkbWluIjp0cnVlfQ.KeefPR1ixDwoNnBQ77YsBYQxXFkZR1VcAkah6yle5lk
```

### 3-6. 검증하기

JWT 토큰을 가장 쉽게 검증하는 방법은 jwt.io 에 접속하는 것 이다. 웹사이트에 접속한 후 먼저 우측 하단 ‘VERIFY SIGNATURE’ 의 `your-256-bit-secret` 를 우리의 비밀키 `secret_key` 로 변경하자. 그 다음 우리가 생성한 JWT 를 좌측에 붙여넣는다.

![](./jwt.io.png)

하단에 Signature Verified 가 표시되면 성공이다.

## 4. JWT 사용 시 주의사항

JWT 는 세션과 달리 **무상태(Stateless)** 한 특징을 가지고 있다. 서버에서는 아무런 정보도 가지고 있지 않으며, 토큰 자체의 만료일자까지 토큰 자신이 가지고 있다. 만약 이런 토큰을 누군가 탈취해간다면? 누구나 토큰을 탈취 당한 사람의 계정에 접근할 수 있게 될 것이다.

하지만, 서버에서는 JWT 가 만료될 때 까지 아무런 조치도 취할 수 없으며, 그저 바라만보고 있어야 한다. **즉, 이미 발행된 토큰에 대해 서버는 아무런 제어도 할 수 없다.**

수 년전 이런 취약점을 악용하여, 페이스북 유저들의 토큰을 피싱사이트를 이용해 탈취하여 악용하는 사례가 굉장히 많이 발생한 적이 있어 시끄러웠던적이 있었다.

이런 취약점을 막기 위해 현재는 많은 서비스들이 **Access Token 과 Refresh Token 을 함께 사용**하는 방식을 채택한다. 이 방식은 Access Token 으로 사용자를 인가하지만, 그 만료기간이 매우 짧다. (5분, 1시간, 24시간 등 다양하지만, 1일을 넘지 않는게 보통)

Access Token 이 만료되면, 클라이언트는 같이 발급된 Refresh Token 을 이용하여 서버에 Access Token 재발급을 요청한다. Refresh Token 은 약 2주가량 만료기간을 길게 잡는다.

하지만, Refresh Token 까지 탈취된다면 공격자는 Access Token 을 발급받아 탈취자인양 행세를 할 수 있으므로, 이에 대한 조치도 추가로 필요하다.

## 5. 마치며

생각보다 JWT 자체를 생성하는 것은 그리 거창한 작업은 아니다. 하지만, 이런 단순 작업은 라이브러리에게 맡기는 것이 훨씬 편할 것 이다. node.js 진영에서는 `jsonwebtoken` 이라는 가장 대중적으로 사용되는 JWT 라이브러리가 존재한다.

본 포스팅에서는 원리를 직접 알아보기 위해 일일히 인코딩, 암호화 하여 JWT 를 생성하였지만, 실제 제품을 개발할 때에는 상용 라이브러리를 쓰는 것을 추천한다.

## 6. 참고하면 좋은 자료

- https://datatracker.ietf.org/doc/html/rfc7519
- https://ko.wikipedia.org/wiki/JSON_%EC%9B%B9_%ED%86%A0%ED%81%B0
- https://jwt.io/introduction
