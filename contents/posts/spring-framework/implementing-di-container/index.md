---
title: "어노테이션 기반 DI 컨테이너 구현하기"
date: 2022-09-27 22:00:00
tags:
  - Spring
---

> 본 포스팅은 우아한테크코스 4기 백엔드 **[DI 컨테이너 구현하기](https://github.com/woowacourse/jwp-hands-on/tree/main/di)** 실습 수행 과정을 정리한 내용이다.

우리는 객체지향을 왜 사용할까? 많은 이유가 있겠지만, 객체지향의 큰 이점 중 하나는 변화에 유연한 코드를 작성할 수 있다는 점이다. 객체가 구체적인 구현체에 의존하지 않고 인터페이스에 의존하면서(DIP), 의존 대상을 외부에서 주입받는 것, 즉 DI와 IoC는 스프링 프레임워크를 사용하는 가장 큰 이유 중 하나이다.

DI와 IoC를 사용하여 우리는 객체가 주입받는 의존 대상 구현체만 다른 것으로 갈아끼우기만 하여 비즈니스 요구사항 변화에 대응할 수 있다. 또, 테스트가 쉬운 객체를 만들기도 쉽다.

이번 실습 미션에서는 스프링의 `BeanFactory` , `ApplicationContext` 와 같은 IoC Container를 모방한 `DIContainer` 를 만든다. 그 내용을 정리해본다.

## stage0 - Static Service와 Dao

Static을 사용하면 왜 객체지향적이지 않다고 할까? static 메소드를 사용한다면, 변화에 대응할 수 없다. static 메소드를 사용하는 부분에서 요구사항이 변경된다면 모든 코드도 변경되어야 한다. 인터페이스와 객체를 사용하여 DIP 원칙을 지키면 OCP 또한 만족할 수 있게된다. 객체를 생성하지 않는 정적 클래스의 사용은 이를 불가능하게 한다.

실습에서 주어진 `UserService` 와 `UserDao` 는 아래와 같이 모두 static 메소드를 사용하는 정적 클래스이다.

```java
class UserService {

    public static User join(User user) {
        UserDao.insert(user);
        return UserDao.findById(user.getId());
    }
}
```

```java
class UserDao {

    private static final Map<Long, User> users = new HashMap<>();

    public static void insert(User user) {
        users.put(user.getId(), user);
    }

    public static User findById(long id) {
        return users.get(id);
    }
}
```

위는 테스트하기 쉬운 코드인가? `UserService` 에 대한 슬라이스 테스트를 진행하기 위해 우리는 어떻게 해야할까? `UserService` 의 로직만 독립적으로 테스트하고 싶다면, `UserService` 가 의존하는 `UserDao` 를 테스트 코드에서만 테스트 더블로 교체해야한다. 하지만 정적 클래스만 사용하여 `UserService` 와 `UserDao` 간의 결합을 떼어낼 수 없다. 즉, 클래스간의 매우 긴밀한 결합이 발생한다.

이것이 Service, Dao, Repository 등이 싱글턴으로 사용되지만, static 으로 사용되지 않는 이유이다.

## stage1 - 의존 대상 구현체에 직접 의존하는 객체

```java
class UserService {

    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User join(User user) {
        userDao.insert(user);
        return userDao.findById(user.getId());
    }
}
```

```java
class UserDao {

    private static final Map<Long, User>users= new HashMap<>();

    private final JdbcDataSource dataSource;

    public UserDao() {
        // ...
    }

    public void insert(User user) {
        // ...
    }

    public User findById(long id) {
        // ...
    }
}
```

stage0 에서의 단점을 보완하기 위해 `UserService` 가 생성자에서 `UserDao` 를 주입하도록 개선하였다. 하지만 아직 테스트하기 어렵다. `UserService` 가 `UserDao` 라는 구현체를 직접 참조하고 있기 때문이다.

`UserService` 가 다른 객체를 의존할 때에는 `UserService` 생성자 파라미터와 필드 타입을 모두 변경한 뒤에 다른 구현체를 주입해야한다. 아직 변화에 유연하지 못하다. 요구사항이 변경되면 아직 많은 부분의 코드가 변경되어야 한다.

또한 아직 `UserService` 는 테스트하기 어려운 코드이다. `UserService` 가 구현체를 직접 참조하고 있기 때문에 테스트 코드에서 테스트 더블로 의존 객체를 교체하기 어렵다. 이 경우 모킹을 시도해볼 수 있겠으나, `UserService` 를 테스트하는 모든 곳에서 모킹을 하는 것은 번거롭다.

_(개인적으로 모킹은 구현체의 내부 구현에 대해 잘 알아야 하며, 내부 구현 변경에 민감하다는 점에서 꼭 필요한 경우를 제외하고는 선호하지 않는다 🥲)_

## stage2 - 의존 대상을 직접 결정하는 객체

```java
interface UserDao {

    void insert(User user);

    User findById(long id);
}
```

```java
class InMemoryUserDao implements UserDao {

    private static final Logger log = LoggerFactory.getLogger(InMemoryUserDao.class);

    private static final Map<Long, User> users = new HashMap<>();

    private final JdbcDataSource dataSource;

    public InMemoryUserDao() {
        // ...
    }

    public void insert(User user) {
        // ...
    }

    public User findById(long id) {
        // ...
    }
}
```

```java
class UserService {

    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User join(User user) {
        userDao.insert(user);
        return userDao.findById(user.getId());
    }
}
```

stage1의 단점을 극복하기 위해 `UserDao` 라는 인터페이스를 만들고, 이를 구현하는 `InMemoryUserDao` 라는 클래스를 별도로 만들었다. `UserService` 는 구현체를 직접 의존하지 않고, `UserDao` 라는 인터페이스를 의존한다. 바로 DIP이다.

```java
@Test
void testAnonymousClass() {
    // given
    final var userDao = new UserDao() {
        private User user;

        @Override
        public void insert(User user) {
            this.user = user;
        }

        @Override
        public User findById(long id) {
            return user;
        }
    };
    final var userService = new UserService(userDao);
    final var user = new User(1L, "gugu");

    // when
    final var actual = userService.join(user);

    // then
    assertThat(actual.getAccount()).isEqualTo("gugu");
}
```

구현체를 직접 의존하는 대신 인터페이스를 의존하게 함으로써 위와 같이 테스트 전용 익명 클래스를 생성하여 주입할 수 있게 되었다. 하지만 아직 구현 클래스를 누군가가 결정하고, 생성하고, 주입해줘야한다. 객체를 생성하고 연결해주는 역할이 필요하다.

## stage3 - IoC

IoC, 제어의 역전을 사용해보자. 제어의 역전이란 모든 제어의 권한을 자신이 아니라 외부에 위임하는 것을 의미한다. stage2의 코드를 살펴보면, 객체가 `UserService` 가 사용할 객체를 결정하고, 생성하고 주입했다. IoC를 사용하면, 객체 스스로가 자신이 사용할 객체를 결정할 수 없다. 그저 어딘가에 정의된 객체간의 관계에 따라 객체는 자신이 사용할 객체를 주입받아 사용할 뿐이다. 즉, 말 그대로 제어가 외부로 역전된 것이다.

stage3에서는 `DIContainer` 라는 것을 만들것이다. `DIContainer` 에는 객체간의 관계가 정의되어 있다. 쉽게 말해, 객체가 어떤 객체를 사용하는지 모두 정의되어 있는 것이다. 이 `DIContainer` 는 스프링의 `BeanFactory` , `ApplicationContext` 를 모방한 것이다.

```java
class DIContainer {

    private final Set<Object> beans;

    public DIContainer(final Set<Class<?>> classes) {
        Set<Object> beans = new HashSet<>();
        for (Class<?> clazz : classes) {
            Object instance = instantiateClass(clazz);
            beans.add(instance);
        }

        this.beans = beans;
    }

    private Object instantiateClass(final Class<?> clazz) {
        String className = clazz.getSimpleName();
        if (className.equals("UserService")) {
            return new UserService(new InMemoryUserDao());
        }

        if (className.equals("InMemoryUserDao")) {
            return new InMemoryUserDao();
        }

        throw new IllegalArgumentException("해당 클래스로 빈을 등록할 수 없습니다.");
    }

    @SuppressWarnings("unchecked")
    public <T> T getBean(final Class<T> aClass) {
        return (T) beans.stream()
                .filter(it -> it.getClass().equals(aClass))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("빈을 찾을 수 없습니다."));
    }
}
```

`instantiateClass()` 메소드는 객체간의 관계를 정의하는 역할을 수행한다. 타입을 전달받아 해당 타입에 대한 객체를 생성해 반환해준다. 예를 들어 `UserService.class` 를 전달하면, `new UserService(new InMemoryUserDao())` 를 생성해 반환한다.

`DIContainer` 는 빈으로 등록할 타입으로 `Set<Class<?>> classes` 를 생성자를 통해 전달 받는다. 그리고 `classes` 를 순회하며, `instantiateClass()` 를 실행하고, 받아온 인스턴스를 모두 `beans` 필드에 저장한다. 이후 `getBean()` 을 실행하면, 전달된 타입에 맞는 빈을 하나 꺼내 반환해준다.

원래 이정도로 구현하고 끝내려 했으나, 매트와 이야기해보며 위와 같은 구조는 객체간의 관계를 모두 하드코딩으로 지정해줘야 한다는 문제를 느꼈다. 따라서 스프링에서의 필드 주입 비스무리한 구조를 따라해보고 싶다는 생각이 들었다.

그래서 일단 모든 클래스를 기본 생성자로 인스턴스화 한 뒤 (필드가 있다면 일단 모두 null이 저장됨), 각 객체의 필드 타입에 따라 방금 전 인스턴스화 된 객체를 찾아 주입해주는 방식으로 구현해보았다. 쉽게 말하자면, 모든 객체의 필드에 강제로 `@Autowired` 를 붙이는 느낌이다. 본격적으로 리플렉션이 사용된다.

```java
class DIContainer {

    private final Set<Object> beans;

    public DIContainer(final Set<Class<?>> classes) {
        Set<Object> beans = instantiateBeans(classes);

        for (Object bean : beans) {
            Set<Field> fields = extractFields(bean);

            for (Field field : fields) {
                Object fieldValue = findBean(beans, field.getType());

                if (fieldValue != null) {
                    setField(bean, field, fieldValue);
                }
            }
        }

        this.beans = beans;
    }

    private Set<Object> instantiateBeans(final Set<Class<?>> classes) {
        return classes.stream()
                .map(this::instantiateClass)
                .collect(Collectors.toSet());
    }

    private Object instantiateClass(final Class<?> clazz) {
        try {
            Constructor<?> constructor = clazz.getDeclaredConstructor();
            constructor.setAccessible(true);
            Object instance = constructor.newInstance();
            constructor.setAccessible(false);
            return instance;
        } catch (ReflectiveOperationException e) {
            throw new IllegalArgumentException("클래스를 인스턴스화 하는데 실패하였습니다.");
        }
    }

    private Set<Field> extractFields(final Object bean) {
        return Arrays.stream(bean.getClass().getDeclaredFields())
                .collect(Collectors.toSet());
    }

    private void setField(final Object bean, final Field field, final Object fieldValue) {
        try {
            field.setAccessible(true);
            field.set(bean, fieldValue);
            field.setAccessible(false);
        } catch (IllegalAccessException e) {
            throw new IllegalArgumentException("필드를 설정할 수 없습니다.");
        }
    }

    @SuppressWarnings("unchecked")
    public <T> T getBean(final Class<T> aClass) {
        return (T) findBean(beans, aClass);
    }

    private Object findBean(final Set<Object> beans, final Class<?> clazz) {
        return beans.stream()
                .filter(it -> clazz.isAssignableFrom(it.getClass()))
                .findFirst()
                .orElse(null);
    }
}
```

`instantiateBeans()` 메서드는 전달받은 `List<Class<?>> classes` 를 모두 기본 생성자를 사용하여 인스턴스화 하여 `Set<Object>` 으로 반환한다. 반환된 `Set` 은 지역변수 `beans` 에 임시 저장한다. 이렇게 가져온 `Object` 들을 순회하며, 필드를 뽑아와야한다.

`extractFields()` 메소드는 객체의 모든 필드를 리플렉션을 사용하여 가져오고, `Set<Field>` 로 반환한다. 가져온 필드의 타입이 지역변수 `beans` 에 존재하면 (이 작업은 `findBean()` 이 수행한다), `Field` 의 `set()` 메소드를 사용하여 필드에 빈을 주입한다.

이렇게 구현하니 첫번째 방식과 같이 더이상 하드코딩 하지 않아도 된다. 이렇게 구현한 `DIContainer` 는 아래와 같이 사용한다.

```java
var classes = new HashSet<Class<?>>();
classes.add(InMemoryUserDao.class); // 직접 빈으로 등록할 타입을 지정한다.
classes.add(UserService.class);
return new DIContainer(classes);
```

## stage4 - 어노테이션 기반 IoC

stage3에서 만든 `DIContainer` 도 충분히 쓸만하지만, 직접 `DIContainer` 에 빈으로 등록할 타입을 추가해줘야하는 번거로움이 남아있다. MVC 프레임워크 만들기 미션에서 했던 것 처럼 어노테이션을 사용하면 조금 더 사용성이 좋아질 것 같다. 스프링과 같이 어노테이션 기반으로 동작하는 `DIContainer` 를 작성해보자. 빈으로 지정할때 사용하는 어노테이션은 `@Service` 와 `@Repository` 이 두가지이고, 의존성 주입을 사용할 필드에는 `@Inject` 라는 어노테이션을 사용할 것이다. 즉, 아래와 같이 사용하는 것이 목표이다.

```java
@Repository
class InMemoryUserDao implements UserDao {
		// ...
}
```

```java
@Service
class UserService {

    @Inject
    private UserDao userDao;

    // ...
}

```

우선 `ClassPathScanner` 라는 유틸 클래스를 만들것이다. 이 유틸 클래스는 특정 패키지에 존재하는 모든 클래스 목록을 가져오는 역할을 한다. 아래와 같이 `Reflections` 라이브러리를 사용하여 작성했다.

```java
public class ClassPathScanner {

    public static Set<Class<?>> getAllClassesInPackage(final String packageName) {
        Scanners scanners = Scanners.SubTypes.filterResultsBy(c -> true);
        Reflections reflections = new Reflections(packageName, scanners);
        return reflections.getSubTypesOf(Object.class);
    }
}
```

`DIContainer` 코드는 아래와 같다.

```java
class DIContainer {

    private final static Set<Class<? extends Annotation>> BEAN_ANNOTATIONS = Set.of(Repository.class, Service.class);

    private final Set<Object> beans;

    public DIContainer(final Set<Class<?>> classes) {
        Set<Object> beans = instantiateBeans(classes);

        for (Object bean : beans) {
            Set<Field> fields = extractInjectFields(bean);

            for (Field field : fields) {
                Object fieldValue = findBean(beans, field.getType());
                setField(bean, field, fieldValue);
            }
        }

        this.beans = beans;
    }

    public static DIContainer createContainerForPackage(final String rootPackageName) {
        Set<Class<?>> classes = ClassPathScanner.getAllClassesInPackage(rootPackageName);
        return new DIContainer(classes);
    }

    private void setField(final Object bean, final Field field, final Object fieldValue) {
        try {
            field.setAccessible(true);
            field.set(bean, fieldValue);
            field.setAccessible(false);
        } catch (IllegalAccessException e) {
            throw new IllegalArgumentException("필드를 설정할 수 없습니다.");
        }
    }

    private Set<Object> instantiateBeans(final Set<Class<?>> classes) {
        return classes.stream()
                .filter(this::checkBeanSupported)
                .map(this::instantiateClass)
                .collect(Collectors.toSet());
    }

    private boolean checkBeanSupported(final Class<?> clazz) {
        return BEAN_ANNOTATIONS.stream()
                .anyMatch(clazz::isAnnotationPresent);
    }

    private Object instantiateClass(final Class<?> clazz) {
        try {
            Constructor<?> constructor = clazz.getDeclaredConstructor();
            constructor.setAccessible(true);
            Object instance = constructor.newInstance();
            constructor.setAccessible(false);
            return instance;
        } catch (ReflectiveOperationException e) {
            throw new IllegalArgumentException("클래스를 인스턴스화 하는데 실패하였습니다.");
        }
    }

    private Set<Field> extractInjectFields(final Object bean) {
        return Arrays.stream(bean.getClass().getDeclaredFields())
                .filter(it -> it.isAnnotationPresent(Inject.class))
                .collect(Collectors.toSet());
    }

    @SuppressWarnings("unchecked")
    public <T> T getBean(final Class<T> aClass) {
        return (T) findBean(this.beans, aClass);
    }

    private Object findBean(final Set<Object> beans, final Class<?> clazz) {
        return beans.stream()
                .filter(it -> clazz.isAssignableFrom(it.getClass()))
                .findFirst()
                .orElse(null);
    }
}
```

사실 크게 달라진 점은 없다. 단지, 클래스를 불러올 때 `@Service` , `@Repository` 어노테이션이 붙은 클래스만을 인스턴스화 하고, 필드 주입 대상으로 `@Inject` 어노테이션이 붙은 필드만 선택한다. 이 결과 직접 빈으로 등록할 클래스의 타입을 추가하지 않고, 어노테이션만 붙여주어 손쉽게 사용할 수 있게 사용성이 개선되었다.
