---
title: "스프링에서 HTTP 캐시를 사용하기 위한 여러가지 방법"
date: 2022-09-03 19:30:00
tags:
  - 학습기록
  - spring
  - java
  - http
---

## 학습 배경

이번 우아한테크코스 레벨4 실습 주제는 스프링에서의 HTTP 캐싱이었다. 관련 주제로 공부를 하다보니 스프링에서 캐시를 적용하기 위한 여러 방법을 알게되어 이를 정리하려고 한다.

원래는 WebContentInterceptor에 대해 공부하며, Interceptor 그리고 WebMvcConfigurer에 대해서도 자세히 공부하고 정리해보려고 했다. 그런데, 공부하면 공부할수록 내용이 깊어지고, 야크털을 깎게 될 것 같아 (정신차려보니 Springboot Auto Configuration에 대해 공부하려고 하고 있었다) 학습 깊이는 적절히 타협하고 이번 실습을 통해서 알게된 내용만 정리해보려고 한다.

## 캐싱과 HTTP에서의 캐싱

캐싱은 자주 사용하는 데이터를 어딘가에 **임시로 저장**하고, **빠르게 꺼내 쓰기 위해** 사용되는 기법이다. 보통 캐시는 원본 데이터를 가져오는데 시간이 오래 걸릴 때 빛을 발한다. 우리가 사용하는 컴퓨터에도 캐싱이 사용된다. 예를 들어 저장 장치와 프로세서간의 연산 속도 차이를 극복하기 위해 CPU에는 L1, L2, L3 캐시가 존재한다.

캐싱은 웹 어플리케이션에서도 사용된다. 특히 자주 사용되는 HTML, 이미지, JS, CSS와 같은 정적 리소스를 사용할 때 마다 다운로드 하는 것은 **많은 네트워크 비용**이 발생한다. 이와 같은 리소스를 어딘가에 캐싱해두면, 네트워크 비용이 줄어들고 웹 페이지 로드 속도가 향상될 것이다. 이런 기능을 위해 HTTP에서는 캐시 기능을 지원한다.

HTTP 캐시에 대해서 다루기에는 글이 길어질 것 같아, 이후 별도의 포스팅으로 HTTP 캐시에 대해 다뤄볼 예정이다. HTTP 캐시에 대한 글을 작성하면 현재 포스팅을 수정하여 링크를 추가해놓을테니 참고 바란다.

## 웹 브라우저에서 Cache-Control이 무시되는 현상

크롬과 같은 웹 브라우저에서 같은 탭에서 새로고침을 하거나 같은 URL을 입력해서 같은 리소스를 요청할 경우 `Cache-Control` 의 `max-age` 혹은 `Expires` 가 무시된다고 한다. 캐시가 되어있는지 확인하기 위해서는 새로운 탭을 열어서 리소스를 요청하자. ([참고1](https://stackoverflow.com/questions/11245767/is-chrome-ignoring-cache-control-max-age), [참고2](https://tech.ssut.me/cache-optimization-using-cache-control-immutable/))

## 방법1. ResponseEntity

스프링에서는 HTTP의 `Cache-Control` 헤더를 만들기 위한 `CacheControl` 이라는 빌더 클래스를 제공한다. 아래와 같이 빌더 패턴으로 헤더를 생성할 수 있다.

```java
String headerValue = CacheControl.maxAge(Duration.ofDays(1))
        .cachePrivate()
        .mustRevalidate()
        .getHeaderValue();

System.out.println(headerValue);
// max-age=86400, must-revalidate, private
```

스프링에서는 또한 HTTP 응답 엔티티를 표현하기 위한 `ResponseEntity` 라는 클래스를 제공한다. 이 클래스의 `cacheControl()` 이라는 메소드에 앞서 설명한 `CacheControl` 타입의 객체를 제공하면 캐시를 적용할 수 있다. 이렇게 적용하면 아래와 같이 응답 헤더에 `Cache-Control` 헤더가 추가되어 오는 것을 확인할 수 있다.

```
Cache-Control: max-age=86400, must-revalidate, private
```

실제로 값이 캐싱되는지 확인하기 위해 랜덤한 UUID를 생성하여 응답하도록 코드를 작성하였다.

```java
@GetMapping("/uuid")
public ResponseEntity<String> helloCache() {
    CacheControl cacheControl = CacheControl.maxAge(Duration.ofDays(365));

    return ResponseEntity.ok()
            .cacheControl(cacheControl)
            .body(UUID.randomUUID().toString());
}
```

실제로 값이 캐싱되어 서버로 요청을 보내지 않는지 확인해보자. 최초로 브라우저에 표시된 값은 아래의 값이다.

```
9ae058b7-a1cb-402f-a939-4dff68b1637e
```

탭을 새로 열고 동일한 URL에 접속해보자.

```
9ae058b7-a1cb-402f-a939-4dff68b1637e
```

랜덤한 UUID로 응답하는 코드를 작성했지만, 이전 요청과 동일한 값을 응답해준다. 심지어 서버를 종료해도 리소스에 접근이 되는 것을 확인할 수 있다.

## 방법2. HttpServletResponse

서블릿의 HTTP Response 인터페이스인 `HttpServletResponse` 를 사용해서 HTTP 응답을 제어할 수 있다. 따라서 우리가 원하는 응답 헤더도 추가할 수 있다. 아래와 같이 가능하다.

```java
@GetMapping("/uuid")
public ResponseEntity<String> helloCache(final HttpServletResponse httpServletResponse) {
    httpServletResponse.addHeader("Cache-Control", "max-age=31536000");

    return ResponseEntity.ok()
            .body(UUID.randomUUID().toString());
}
```

사실 이 방법은 캐시를 설정하는 방법이라기 보다는 HTTP 응답 헤더를 직접 조작하는 방법에 가깝다. 개인적으로는 스프링에서 HTTP 캐시를 사용하기 위한 더 추상화된 방법을 제공하기 때문에, 후술할 `WebContentInterceptor` 를 사용하는 것이 좋아보인다.

## 방법3. WebContentInterceptor

앞서 설명한 `ResponseEntity` 와 `HttpServletResponse` 를 사용하는 방식은 각 엔드포인트 마다 설정을 해줘야하므로 중복 코드가 많이 발생하게 될 것이다. Spring MVC의 Interceptor를 사용하여 적용하고 싶은 여러 엔드포인트에 대하여 일괄적으로 캐시를 설정할 수 있다.

### Spring MVC Interceptor란?

Spring MVC에서 제공하는 Interceptor를 사용하면 **컨트롤러 호출 전, 컨트롤러 호출 이후, 뷰 실행 이후** 이 3가지 시점에서 HTTP 요청을 **가로채고(intercept)** 조작하여 추가적인 기능을 구현할 수 있도록 해준다. Interceptor에 대한 더 자세한 내용은 깊이 있게 학습한 이후 별도의 포스팅으로 작성해보겠다.

### Interceptor 설정하기

`WebMvcConfigurer` 인터페이스를 상속하고 `@Configuration` 어노테이션을 붙여 Spring MVC Configuration 을 위한 빈을 아래와 같이 생성하자.

```java
@Configuration
public class CacheWebConfiguration implements WebMvcConfigurer {

    @Override
    public void addInterceptors(final InterceptorRegistry registry) {
        registry.addInterceptor(someInterceptor);
    }
}
```

`addInterceptors()` 라는 메소드를 오버라이드 하고, 파라미터로 들어오는 `registry` 의 `addInterceptor()` 메소드에 인터셉터를 전달하여 인터셉터를 등록할 수 있다.

인터셉터는 `HandlerInterceptor` 라는 인터페이스를 구현해야하는데, 우리는 `WebContentInterceptor` 라는 미리 구현된 인터셉터를 사용할 것이다.

```java
@Override
public void addInterceptors(final InterceptorRegistry registry) {
    CacheControl cacheControl = CacheControl.maxAge(Duration.ofDays(365));

    WebContentInterceptor webContentInterceptor = new WebContentInterceptor();
    webContentInterceptor.addCacheMapping(cacheControl, "/**");

    registry.addInterceptor(webContentInterceptor);
}
```

위와 같이 `CacheControl` 을 먼저 생성해 준뒤, `WebContentInterceptor` 의 `addCacheMapping()` 메소드에 전달해준다. 두번째 파라미터부터는 캐시를 적용할 경로를 적어주면 되는데, Ant-style Path Pattern 으로 적어주면 된다.

개인적으로는 방법1과 방법2를 사용하기보다는 중복 코드를 줄여주는 인터셉터를 활용하는 방식이 가장 좋아보인다.

## 방법4. addResourceHandlers()

> 앞서 설명한 여러 방식과 다르게 방법4 에서 설명할 내용은 정적 리소스만을 캐싱하는 방법이다.

`WebMvcConfigurer` 를 사용하여 정적 리소스를 제공할 수 있다. 아래 코드를 보자.

```java
@Configuration
public class ResourceWebConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("classpath:/static/");
    }
}
```

`addResourceHandlers()` 메소드를 오버라이드하여, `classpath:/static/` 에 있는 정적 메소드를 `/resources/**` 경로에 매핑하였다. 예를 들어, resources 디렉토리에 `index.html` 파일을 추가하고 `http://localhost:8080/resources/index.html` 에 접속하면, 해당 만들어둔 index.html가 서빙되는 것을 확인할 수 있다.

```java
@Override
public void addResourceHandlers(final ResourceHandlerRegistry registry) {
    CacheControl cacheControl = CacheControl.maxAge(Duration.ofDays(365));

    registry.addResourceHandler("/resources/**")
            .addResourceLocations("classpath:/static/")
            .setCacheControl(cacheControl);
}
```

이때, 위 코드처럼 `setCacheControl()` 메소드에 `CacheControl` 를 전달하면, 정적 리소스에 대한 캐싱을 할 수 있다.

## 참고

- [https://www.baeldung.com/spring-mvc-cache-headers](https://www.baeldung.com/spring-mvc-cache-headers)
