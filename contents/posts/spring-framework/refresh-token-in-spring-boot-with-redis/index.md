---
title: Spring Boot와 Redis를 사용하여 Refresh Token 구현하기
date: 2022-08-26 15:30:00
tags:
  - 학습기록
  - spring
  - redis
  - 인증/인가
---

## 배경

바로 직전에 작성한 **[Access Token의 문제점과 Refresh Token](https://hudi.blog/refresh-token/)** 글에서 Refresh Token이 무엇인지 글로 알아보았다. 하지만, 글만 읽어서는 공부를 끝냈다고 할 수 없다. 실제로 코드를 작성해야 지식을 내재화할 수 있다.

이번글에서는 내가 스프링부트로 Refresh Token을 구현한 과정을 적어보려고 한다. 이때, Refresh Token은 Redis에 저장하여 관리한다. Redis를 처음 사용해본 관계로 깊이가 다소 얕을 수 있다.

## 왜 Redis?

레디스는 key-value 쌍으로 데이터를 관리할 수 있는 데이터 스토리지이다. 데이터베이스라고 표현하지 않은 이유는 기본적으로 레디스는 in-memory로 데이터를 관리하므로, 저장된 데이터가 영속적이지 않기 때문이다.

데이터가 HDD나 SDD가 아니라 RAM에 저장하므로 데이터를 영구적으로 저장할 수 없는 대신, 굉장히 빠른 액세스 속도를 보장받을 수 있다. 빠른 액세스 속도와 휘발성이라는 특징으로 보통 캐시의 용도로 레디스를 사용한다.

Refresh Token의 저장소로 레디스를 선택한 이유도 위와 같다. 빠른 액세스 속도로 사용자 로그인시 (리프레시 토큰 발급시) 병목이 되지 않는다.

또한 리프레시 토큰은 발급된 후 일정 시간 이후 만료되어야 한다. 리프레시 토큰을 RDB등에 저장하면, 스케줄러등을 사용하여 주기적으로 만료된 토큰을 만료 처리하거나 제거해야한다. 하지만, 레디스는 기본적으로 데이터의 유효기간(time to live)을 지정할 수 있다. 이런 특징들은 리프레시 토큰을 저장하기에 적합하다.

그리고 리프레시 토큰은 실수로 제거되어도 다른 데이터에 비해 덜 치명적이다. 최악의 경우가 모든 회원들이 로그아웃 되는 정도이다.

물론 JWT와 같은 클레임 기반 토큰을 사용하면 리프레시 토큰을 서버에 저장할 필요가 없다. 하지만, 사용자 강제 로그아웃 기능, 유저 차단, 토큰 탈취시 대응을 해야한다는 가정으로 서버에서 리프레시 토큰을 저장하도록 구현하였다.

## 사용 기술

아래 기술을 사용하여 실습하였다.

- **Spring Boot**
- **Spring Data Jpa (Hibernate)**
- **Spring Data Redis**
- **Lettuce Core**
- **H2**
- **JJWT**
- **Gradle**

## build.gradle

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'

    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-data-redis:2.3.1.RELEASE'

    implementation 'io.jsonwebtoken:jjwt-api:0.11.2'
    implementation 'io.jsonwebtoken:jjwt-impl:0.11.2'
    implementation 'io.jsonwebtoken:jjwt-jackson:0.11.2'

    runtimeOnly 'com.h2database:h2'
}
```

실습에서 사용된 의존성은 위와 같다.

## 회원 생성/조회

> 클래스의 생성자와 getter 코드, DTO 클래스 코드, Exception 클래스 코드는 생략한다.

> 이 포스팅의 핵심은 Refresh Token과 Redis이므로 그 외의 코드에 대한 자세한 설명은 생략한다.

본 프로젝트에서는 단순히 회원을 생성하고, 로그인한 회원이 자기 자신의 정보를 조회하는 기능만을 구현하였다. 클라이언트는 자신의 정보를 조회할 때 유효한 Access Token을 서버에 제공해야한다.

### Member

```java
@Entity
public class Member {

    @Id
    @GeneratedValue
    private Long id;

    private String email;

    private String name;

    private String password;

    // ...
}
```

`Member`는 회원의 정보를 담고 있는 JPA 엔티티이다. 당연히 실무에서는 `password`를 해싱해야겠지만, 지금은 학습 목적이므로 그냥 평문으로 저장한다.

### MemberRepository

```java
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmailAndPassword(final String email, final String password);
}
```

`Member`에 대한 레포지토리 도메인이다. Spring Data JPA를 사용하여 인터페이스만 정의했다.

`findByEmailAndPassword()` 메소드는 유저가 이메일과 패스워드를 올바르게 입력했는지 판단하기 위한 메소드이다.

### MemberService

```java
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(final MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Long createMember(final MemberRequest request) {
        Member member = new Member(request.getEmail(), request.getName(), request.getPassword());
        return memberRepository.save(member).getId();
    }

    public MemberResponse getMemberById(final Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(NoSuchMemberException::new);

        return new MemberResponse(member);
    }
}
```

`Member`에 대한 서비스 계층 코드이다. 단순히 `MemberRepository`를 주입받아 컨트롤러에 기능을 제공한다.

### MemberController

```java
@RequestMapping("/members")
@RestController
public class MemberController {

    private final MemberService memberService;

    public MemberController(final MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<Void> createMember(@RequestBody final MemberRequest request) {
        Long memberId = memberService.createMember(request);
        return ResponseEntity.created(URI.create("/members/" + memberId)).build();
    }

    @GetMapping("/me")
    public ResponseEntity<MemberResponse> findMe(@LoginMemberId final Long loginMemberId) {
        MemberResponse memberResponse = memberService.getMemberById(loginMemberId);
        return ResponseEntity.ok(memberResponse);
    }
}
```

위 코드에서 `@LoginMemberId final Long loginMemberId` 는 스프링 Method Argument Resolver를 사용하여 로그인한 사용자의 ID를 Access Token 으로부터 쉽게 추출하도록 만들어둔 코드이다. 이에 관한 더 자세한 내용은 후술하겠다.

> Method Argument Resolver에 대해 더 자세히 알고 싶다면, 예전에 작성한 **[스프링에서 Argument Resolver 사용하기](https://hudi.blog/spring-argument-resolver/)** 포스팅을 참고하자.

## Method Argument Resolver

컨트롤러 계층에서 로그인된 사용자의 `id`를 쉽게 추출할 수 있도록 Method Argument Resolver를 추가하였다.

### LoginMemberIdArgumentResolver

```java
@Component
public class LoginMemberIdArgumentResolver implements HandlerMethodArgumentResolver {

    private final TokenService tokenService;

    public LoginMemberIdArgumentResolver(final TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {
        return parameter.hasParameterAnnotation(LoginMemberId.class)
                && parameter.getParameterType().equals(Long.class);
    }

    @Override
    public Long resolveArgument(final MethodParameter parameter, final ModelAndViewContainer mavContainer,
                                final NativeWebRequest webRequest, final WebDataBinderFactory binderFactory) {
        String accessToken = webRequest.getHeader("Authorization").split("Bearer ")[1];
        return tokenService.extractMemberId(accessToken);
    }
}
```

`supportsParameter()` 에서 Method Argument Resolver가 데이터를 바인딩하기 위한 조건을 설정한다. 후술할 `LoginMemberId` 어노테이션이 붙고, `Long` 타입인 파라미터에 데이터를 바인딩한다.

`resolveArgument()` 에서는 후술할 `TokenService` 를 사용해서 HTTP 요청의 `Authorization` 헤더에서 Access Token을 추출해 회원의 `id`를 가져온다.

### LoginMemberId

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface LoginMemberId {
}
```

위와 같이 `LoginMemberId` 어노테이션을 정의한다.

### WebConfig

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final TokenService tokenService;

    public WebConfig(final TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public void addArgumentResolvers(final List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new LoginMemberIdArgumentResolver(tokenService));
    }
}
```

Method Argument Resolver를 사용하기 위한 Configuration을 추가한다. `LoginMemberIdArgumentResolver`는 `TokenService`에 대한 의존성을 가지고 있으므로, 주입해준다.

## Redis 설정

### Lettuce vs Jedis

Spring Data Redis에서 사용할 수 있는 Redis Client 구현체는 크게 **Lettuce**와 **Jedis**가 있다. 결론부터 이야기하자면, 이번 프로젝트에서는 **Lettuce를 사용**했다.

`spring-boot-starter-data-redis` 을 사용하면 별도의 의존성 설정 없이 Lettuce를 사용할 수 있다. 반면 Jedis는 별도의 설정이 필요하다.

Jedis를 사용하지 않는 이유는 몇가지 더 있다. 이동욱님의 **[Jedis 보다 Lettuce 를 쓰자](https://jojoldu.tistory.com/418)** 포스팅을 읽어보면, Lettuce가 더 높은 성능을 내고, 문서도 더 잘 되어있고, 오픈소스도 더 잘 관리되고 있다고 한다. 이런 여러 이유로 이번 프로젝트에서는 Lettuce를 사용한다.

### application.yml 설정

> 데이터베이스, JPA와 같은 설정은 생략한다.

Spring Boot의 Auto Configuration 덕분에 굳이 로컬에서는 Redis Connection에 대한 내용은 설정하지 않아도 되지만, 일단 명시적으로 아래와 같이 설정한다.

```yml
spring:
  redis:
    host: localhost
    port: 6379

  # ...
```

### Redis Repository vs Redis Template

스프링부트에서 Redis를 사용하는 방법에는 두가지가 있다. Repository 인터페이스를 정의하는 방법과 Redis Template을 사용하는 방법이다.

#### Repository

Repository 인터페이스를 정의하는 방법은 Spring Data JPA를 사용하는 것과 비슷하다. Redis는 많은 자료구조를 지원하는데, Repository를 정의하는 방법은 Hash 자료구조로 한정하여 사용할 수 있다. Repository를 사용하면 객체를 Redis의 Hash 자료구조로 직렬화하여 스토리지에 저장할 수 있다.

#### Redis Template

Redis Template은 Redis 서버에 커맨드를 수행하기 위한 고수준의 추상화(high-level abstraction)를 제공한다.

> 이번 포스팅에서는 두가지 방법 모두 다룬다.

## Redis Repository를 사용하여 Repository 정의

### RefreshToken

```java
@RedisHash(value = "refreshToken", timeToLive = 60)
public class RefreshToken {

    @Id
    private String refreshToken;
    private Long memberId;

    public RefreshToken(final String refreshToken, final Long memberId) {
        this.refreshToken = refreshToken;
        this.memberId = memberId;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public Long getMemberId() {
        return memberId;
    }
}
```

`RefreshToken` 은 리프레시 토큰과 사용자의 ID정보를 가지고 있는 간단한 객체이다. 이 객체는 레디스에 저장되어 리프레시 토큰을 관리하는데 사용된다.

`@RedisHash` 어노테이션을 레디스 스토리지에 저장할 객체 클래스에 선언한다. `value`는 `refreshToken`으로 설정하였다. 이 `value`와 `@Id` 어노테이션을 붙인 `refreshToken` 필드의 값을 합쳐 레디스의 key로 사용된다. `refreshToken` 필드의 값이 1이라면 레디스 key는 `refreshToken:1` 이된다.

`timeToLive`는 60으로 설정하였다. 단위는 '초' 이다. 데이터가 저장되고 60초가 지나면 레디스에서 데이터가 제거된다. 당연히 실무에서는 2주 가량 긴 기간으로 설정해야겠지만, 만료가 되는 모습을 확인해야하므로 매우 짧게 설정했다.

### RefreshTokenRepository

```java
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
```

`CurdRepository` 를 상속하고 첫번째 제네릭 타입에는 데이터를 저장할 객체의 클래스를, 두번째로는 객체의 ID 값 (`@Id` 어노테이션이 붙은) 타입 클래스를 넣어준다.

`CrudRepository` 가 제공하는 메소드만을 사용해도 충분하므로 별도의 메소드는 추가로 정의하지 않는다.

## Redis Template를 사용하여 Repository 정의

### RedisConfig

`RedisTemplate`을 사용하기 위해서는 아래와 같이 `@Configuration`을 통해서 `redisTemplate`을 빈 등록 해야한다.

```java
@Configuration
public class RedisConfig {

    private final String redisHost;
    private final int redisPort;

    public RedisConfig(@Value("${spring.redis.host}") final String redisHost,
                       @Value("${spring.redis.port}") final int redisPort) {
        this.redisHost = redisHost;
        this.redisPort = redisPort;
    }

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(redisHost, redisPort);
    }

    @Bean
    public RedisTemplate<?, ?> redisTemplate() {
        RedisTemplate<byte[], byte[]> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        return redisTemplate;
    }
}
```

### RefreshToken

위의 코드와 동일하지만 `@RedisHash` 어노테이션만 제거한다.

### RefreshTokenRepository

Redis Template에서는 Repository를 인터페이스로 정의하지 않고, 직접 아래와 같이 구현한다.

```java

@Repository
public class RefreshTokenRepository {

    private RedisTemplate redisTemplate;

    public RefreshTokenRepository(final RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void save(final RefreshToken refreshToken) {
        ValueOperations<String, Long> valueOperations = redisTemplate.opsForValue();
        valueOperations.set(refreshToken.getRefreshToken(), refreshToken.getMemberId());
        redisTemplate.expire(refreshToken.getRefreshToken(), 60L, TimeUnit.SECONDS);
    }

    public Optional<RefreshToken> findById(final String refreshToken) {
        ValueOperations<String, Long> valueOperations = redisTemplate.opsForValue();
        Long memberId = valueOperations.get(refreshToken);

        if (Objects.isNull(memberId)) {
            return Optional.empty();
        }

        return Optional.of(new RefreshToken(refreshToken, memberId));
    }
}
```

## 인증/인가 구현

### TokenService

```java
@Service
public class TokenService {

    private static final String SECRET_KEY = "abcdefgabcdefgabcdefgabcdefgabcdefgabcdefg";
    private static final int ACCESS_TOKEN_EXPIRES = 30000;

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SecretKey secretKey;

    public TokenService(final MemberRepository memberRepository,
                        final RefreshTokenRepository refreshTokenRepository) {
        this.memberRepository = memberRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public RefreshTokenResponse generateRefreshToken(final RefreshTokenRequest request) {
        Long memberId = memberRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(AuthException::new)
                .getId();

        RefreshToken refreshToken = new RefreshToken(UUID.randomUUID().toString(), memberId);
        refreshTokenRepository.save(refreshToken);

        return new RefreshTokenResponse(refreshToken);
    }

    public AccessTokenResponse generateAccessToken(final AccessTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findById(request.getRefreshToken())
                .orElseThrow(InvalidRefreshTokenException::new);
        Long memberId = refreshToken.getMemberId();

        Date now = new Date();
        Date expiration = new Date(now.getTime() + ACCESS_TOKEN_EXPIRES);

        String accessToken = Jwts.builder()
                .signWith(secretKey)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .setSubject(String.valueOf(memberId))
                .compact();

        return new AccessTokenResponse(accessToken);
    }

    public Long extractMemberId(final String accessToken) {
        try {
            String memberId = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody()
                    .getSubject();
            return Long.parseLong(memberId);
        } catch (final JwtException e) {
            throw new InvalidAccessTokenException();
        }
    }
}
```

`generateRefreshToken()` 메소드는 회원의 이메일과 비밀번호를 전달받아, 올바른 정보라면 유저의 리프레시 토큰을 생성하고 반환한다. 리프레시 토큰은 임의의 UUID 이다.

`generateAccessToken()` 메소드는 리프레시 토큰을 전달받아 액세스 토큰을 발급한다. 액세스 토큰도 실제로는 일반적으로 5분 ~ 30분 정도의 유효 기간을 갖지만, 학습의 용도이므로 30초 가량으로 짧게 설정하였다. JJWT 라이브러리를 사용하여 생성한다.

`extractMemberId()` 메소드는 Method Argument Resolver 에서 사용하기 위한 메소드이며, 액세스 토큰에서 회원의 ID를 추출한다. JJWT 라이브러리를 사용하여 추출한다.

### AuthController

```java
@RequestMapping("/auth")
@RestController
public class AuthController {

    private final TokenService tokenService;

    public AuthController(final TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> generateRefreshToken(@RequestBody final RefreshTokenRequest request) {
        RefreshTokenResponse refreshTokenResponse = tokenService.generateRefreshToken(request);
        return ResponseEntity.ok(refreshTokenResponse);
    }

    @PostMapping("/access-token")
    public ResponseEntity<AccessTokenResponse> generateAccessToken(@RequestBody final AccessTokenRequest request) {
        AccessTokenResponse accessTokenResponse = tokenService.generateAccessToken(request);
        return ResponseEntity.ok(accessTokenResponse);
    }
}
```

## 마치며

이렇게 스프링부트에서 Redis를 사용하여 리프레시 토큰 기반의 인증 기능을 구현해보았다. Redis 자체가 처음이라 처음에는 많이 낯설었는데, 생각보다 구조가 단순해서 금방 익숙해졌다.
