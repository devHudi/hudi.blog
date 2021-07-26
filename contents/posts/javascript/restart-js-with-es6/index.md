---
title: "ES6 문법으로 다시 시작하는 자바스크립트"
date: 2018-07-05
tags:
  - front-end
  - javascript
---

> 이전 블로그 (https://hudi.kr) 에서 이전해온 글 입니다.

![](./thumb.png)

**ES6 (=ECMAScript 2015)** 가 발표된지도 어언 3년이 다 되어가고 있다. 하지만, 이미 구세대의 기술이 되어버린 Jquery 와 ES5는 아직 많이 사용되고 있다. 현재 자바스크립트 생태계는 Angular, React, Vue 등의 최신 기술이 등장하고, 끊임없이 개선되고, 변화되고 있다. 그리고 그 생태계의 중심은 ES6 (혹은 그 이상 버전) 이다.

아마, React 와 같은 최신 기술을 공부하려다 ES6 라는 벽이 낯설어 선뜻 도전해보지 못한 분들이 많을 것이라고 생각한다. 이 문서는 같은 동작을 하는 ES5와 ES6의 소스코드에서 문법을 비교하며, 모던 자바스크립트 입문자에게 도움을 드리고자한다. 한 문서에서 모든 내용을 다룰 수 없기에, 자주 사용되는 핵심 내용을 서술한다. 그래도 ES6의 여러 내용을 다루기에 깊이 있게 다루지는 않지만, 모던 자바스크립트를 공부하고자 하는 분들께 도움이 되기를 바란다.

## 새로운 변수 선언 키워드, let과 const

ES6 이전의 자바스크립트에서는 `var` 키워드를 통해 변수를 선언했다. `var` 키워드로 선언된 변수는 function scope 이다. 변수의 범위가 함수 전체에 작용한다는 의미이다. ES6 에서는 `let` 과 `const` 키워드가 새로 등장한다. 각각 변수와 상수를 선언할때 사용한다. `let` 과 `const` 키워드로 선언된 변수는 block scope 를 같게 된다. Block scope 는 중괄호 ({ }) 를 기준으로 유효범위를 갖는다. 일단 Scope 에 대한 차이점을 살펴보자.

**ES5**

```js
function foo() {
  if (true) {
    var a = "bar";
  }

  console.log(a);
}

foo()
// bar
```

정상적으로 `bar` 이라는 문자열을 출력하는 모습을 볼 수 있다. 여기서 변수 `a` 는 `foo` 함수에서 전역으로 영향력을 갖게 된다. 그렇기 때문에 if 문의 scope 안에서 선언된 변수도 밖에서 접근이 가능하다.

**ES6**

```js
function foo() {
  if (true) {
    let a = "bar";
  }

  console.log(a);
}

foo()
// Uncaught ReferenceError: a is not defined
```

하지만 `let` 으로 선언한 변수는 if문의 scope 내에서만 유효하기 때문에 해당 scope 밖에서 `a` 에 접근할때, 오류가 발생한다.

`const` 키워드로는 상수를 선언할 수 있다. 값이 변하지 않음을 확신할 수 있는 변수는 `const` 로 선언하는 것이 바람직하다.

```js
let foo = 1;
foo = 2;
// Good

const bar = 1;
bar = 2;
// Uncaught TypeError: Assignment to constant variable.
```

`let` 으로 선언된 변수는 오류가 없지만, `const` 로 선언된 상수는 값을 변경할 수 없다는 오류가 발생한다.

## 화살표 함수 (Arrow Function)

ES6 이전에 함수를 선언하기 위해서 `function` 키워드를 사용했다. ES6 부터는 **화살표 함수 (Arrow Function) 문법**을 지원한다.

**ES5**

```js
var a = function () {
  console.log("function");
}
a();
```

**ES6**

```js
const a = () => {
  console.log("arrow function");
}
a();
```

기본적으로 화살표 함수는 기존 `function` 키워드의 축약형이다.

**ES6**

```js
const print = text => {
  console.log(text);
}
// 파라미터가 1개일땐 괄호 생략 가능

const sum = (a, b) => a + b
// 간단한 표현식만을 반환 할때는 return 생략 가능
```

파라미터를 1개만 받을 때는 괄호를 생략할 수 있고, 간단한 표현식을 반환할때는 괄호와 `return` 을 생략할 수 있다.

이런 간단한 기능도 있지만, `function` 키워드와 가장 큰 차이점은 this 의 바인딩 여부이다.

### this 를 바인딩 하지 않는다

**ES5**

```js
function Foo() {
  this.func1 = function() {
    console.log(this);
    // this === Foo
  }

  this.func2 = function() {
    var func3 = function() {
      console.log(this);
      // this === Window (global)
    }
    func3();
  }
}

var foo = new Foo();
foo.func1();
foo.func2();
```

자바스크립트에서의 `this` 개념은 개발자를 혼란스럽게 한다. 다른 객체지향 언어와 달리 `this` 가 함수 실행 문맥 (Context) 에 따라 달라지기 때문이다. 위 코드에서 `func1` 가 실행될때는 메소드 실행 문맥 이기 때문에, `this` 는 `Foo` 이지만 , `func2` 를 보면, 새로 선언된 func3 함수의 실행은 함수 실행 문맥 이기 때문에 `this` 가 `Window` 객체, 즉 전역 객체가 할당된다.

화살표 함수가 등장하기 이전에는 이런 문제를 해결하기 위해서 보통 that 이라는 변수를 선언하고, 새로운 this 가 바인딩 되기전 this 를 할당시켰다.

```js
...

this.func2 = function() {
  var that = this;
  //...뭔가 좀 이상하다

  var func3 = function() {
    console.log(that);
    // that === Foo
  }
  func3();
}

...
```

이런 헷갈리는 this 의 개념은 직관적이지 못하고, 불편했다. 화살표함수는 새로운 this 를 바인딩 하지 않아 다음과 같이 작성해도 올바르게 작동한다.

**ES6**

```js
function Foo() {
  this.func1 = function() {
    console.log(this);
    // this === Foo
  }

  this.func2 = function() {
    var func3 = () => {
      console.log(this);
      // this === Foo
    }
    func3();
  }
}

var foo = new Foo();
foo.func1();
foo.func2();
```

this 가 동일한 객체를 가리켜, 코드가 조금 더 깔끔해진 모습을 볼 수 있다.

## 템플릿 리터럴 (Template literal)
ES6 에서 새롭게 도입된 문자열 표기법이다. 기존 자바스크립트에서 변수와 문자열을 같이 보여주기 위해서는 문자 결합 연산자인 `+` 를 사용했다. 아래의 코드를 보자.

**ES5**

```js
var name = "Hudi";
var job = "developer";

console.log("제 이름은 " + name + " 이고, 직업은 " + job + " 입니다.");
//제 이름은 Hudi 이고, 직업은 developer 입니다.
```

가독성이 매우 떨어지며, 실수가 발생하기 쉬운 형태이다.

ES6 의 템플릿 리터럴을 사용하면 어떻게 표현될까? ES5 에서 문자열을 표기하기 위해서는 **'** (작은 따옴표) 혹은 **"** (큰 따옴표)로 문자열을 감싸주었다. 템플릿 리터럴은 **`** (백틱) 을 사용해 문자열을 감싼다. 특이점은 변수도 포함해서 같이 감쌀 수 있다는 것이다.

**ES6**

```js
const name = "Hudi";
const job = "developer";

console.log(`제 이름은 ${name} 이고, 직업은 ${job} 입니다.`);
//제 이름은 Hudi 이고, 직업은 developer 입니다.
```

백틱 로 문자열을 감싸고 그 사이에 `${변수명}` 으로 표현해주면, 해당 변수의 값이 그대로 다른 문자열과 같이 출력된다. 템플릿 리터럴은 일반 문자열 리터럴과 다르게 공백과 개행을 그대로 표현해준다.

```js
const name = "Hudi";
const job = "developer";

const msg = `제 이름은 ${name} 이고
직업은 ${job} 입니다.`;

console.log(msg);
/*
  제 이름은 Hudi 이고
  직업은 developer 입니다.
*/
```
더 이상 `+`, `\n`, `\t` 등을 사용하여 복잡한 문자열을 표현할 필요가 없다.

## 비구조화 할당 (destructuring assignment)
비구조화 할당 (번역에 따라 구조분해 할당이라고도 한다) 은 객체안의 필드를 손쉽게 꺼내어 변수로 대입할 수 있는 문법이다. ES6 이전의 문법으로 객체의 필드를 꺼내어 새로운 변수에 대입하려면 다음과 같이 코드를 작성해야 한다.

**ES5**

```js
var hudi = {
  name: "조동현",
  job: "developer",
  skills: ["ES6", "React", "node.js"]
}

var name = hudi.name;
var job = hudi.job;

console.log(name, job); // 조동현 developer
```

새로운 `name`, `job` 두개의 변수를 선언하고, `.` 표현법 (dot notation) 으로 객체의 필드에 직접 접근하여 값을 가져온다. ES6 에서는 이런 복잡한 과정을 거칠 필요가 없다.

**ES6**

```js
const hudi = {
  name: "조동현",
  job: "developer",
  skills: ["ES6", "React", "node.js"]
}

let { name, job } = hudi;
//비구조화 할당

console.log(name, job); // 조동현 developer
```

조금 낯선 문법이 보인다. 변수 선언시에 `{ }` 를 사용한다. 해당 코드는 hudi의 name, job 필드를 같은 이름을 가진 변수에 바로 대입을 해준다.

객체를 비구조화한 후 함수의 인자로 넘길 수도 있다.

```js
const hudi = {
  name: "조동현",
  job: "developer",
  skills: ["ES6", "React", "node.js"]
}

function printSkills({ skills }) {
  skills.map(skill => {
    console.log(skill);
  });
}

printSkills(hudi);
/*
  ES6
  React
  node.js
*/
```
`printSkills` 함수가 받는 인자가 중괄호의 형태를 가지고 있는 것이 보이는가? 어떤 객체를 넣어주면, 해당 객체를 분해하여 `skills` 필드만 가져와서 사용할 수 있는 것이다.

또한 배열에서도 비구조화 할당을 사용할 수 있다.

```js
const languages = ["Javascript", "Python", "Java", "C#"];
const [first, second, third] = languages;

console.log(first, second, third);
//Javascript Python Java
```
이렇게 객체 혹은 배열을 분해하여 필요한 필드만 추출하여, 별개의 변수로 대입하는 방식이 비구조화 할당 이다.

## 향상된 객체 리터럴 (enhanced object literals)
ES6 에서는 다음과 같이 객체의 리터럴이 개선되었다.

### 단축된 프로퍼티 초기화
기존 ES5 에서 객체를 생성할 때, 필드명과 대입할 변수명이 같은 상황에서 다음과 같이 코드를 작성하였다.

**ES5**

```js
var name = "조동현";
var job = "developer";

var hudi = {
  name: name,
  job: job
}

console.log(hudi);
// {name: "조동현", job: "developer"}
```

ES6 에서는 다음과 같이 간결하게 작성할 수 있다.

**ES6**

```js
const name = "조동현";
const job = "developer";

const hudi = {
  name,
  job
}

console.log(hudi);
// {name: "조동현", job: "developer"}
```

**key: value** 형태에서 단순히 변수명만 작성해주면 변수명과 동일한 필드가 생성되며, 그 변수값이 대입된다.

### 간결한 메서드
ES6 에서는 더 이상 객체 메서드를 정의하기 위해 `function` 키워드를 사용하지 않아도 된다. 일단 ES5 문법으로 객체 메서드를 정의해보자.

**ES5**

```js
var person = {
  name: "조동현",
  getName: function() {
    return this.name;
  }
}

console.log(person.getName());
//조동현
```

ES5에서는 `foo: function(...) { ... }` 형태로 객체 메서드를 정의해야 한다. ES6 에서는 어떤 방식으로 객체 메서드를 정의할 수 있을까?

**ES6**

```js
const person = {
  name: "조동현",
  getName() {
    return this.name;
  }
}

console.log(person.getName());
//조동현
```

`function` 키워드가 없어지고, 더욱 간결한 문법을 확인할 수 있다. ES6 에서는 이와 같이 개선된 객체 리터럴을 사용할 수 있다.

## 전개 연산자 (spread operator)
전개 연산자는 점 세개 (`...`) 로 이루어져 있는 연산자이며, 여러가지 역할을 담당하고 있다.

### 배열의 내용 조합
ES5 에서는 여러 배열의 내용을 합쳐 새로운 배열을 만들기 위해 `concat` 메서드를 사용한다.

**ES5**

```js
var a = [1,2,3];
var b = [3,4];
var c = "끝";

var d = a.concat(b, c);

console.log(d);
//[1, 2, 3, 3, 4, "끝"]
```

`a` 배열에서 `concat` 메서드를 사용해서, 배열 b와 문자열 c를 배열에 이어붙였다. ES6 에서는 전개 연산자를 사용해서 직관적이고 간결하게 표현할 수 있다.

**ES6**

```js
const a = [1,2,3];
const b = [3,4];
const c = "끝";

const d = [...a, ...b, c];

console.log(d);
//[1, 2, 3, 3, 4, "끝"]
```

`a` 의 모든요소 `...a` 와 `b` 의 모든요소 `...b` 그리고 `c` 를 넣어 새로운 배열 `d` 를 만든 모습이다. concat 을 사용한 코드보다 훨씬 간결하고, 가독성도 개선되었다.

### 언제 전개 연산자를 사용할까?
배열은 push, reverse 와 같은 여러가지 메서드를 가지고 있다. 하지만 이런 메서드들은 기존 배열을 바꿔버리는 단점이 존재한다. 이를테면 다음과 같다.

**ES5**

```js
var a = [1,2,3,4,5];
a.reverse();
//배열 요소의 순서를 역순으로 바꾼다.

console.log(a);
//[5,4,3,2,1]
```

원본 배열을 수정할 의도였다면 문제있는 코드는 아니지만, 원본 배열은 그대로 두고 배열 요소의 순서를 뒤집은 새로운 배열을 또 하나 만들고 싶다면, 상황이 복잡해진다. 이 상황에서 전개 연산자를 사용한다면 편리해진다.

**ES6**

```js
const a = [1,2,3,4,5];
const b = [...a].reverse();

console.log(`a: ${a}\nb: ${b}`);
/*
  a: 1,2,3,4,5
  b: 5,4,3,2,1
*/
```

이렇게 전개 연산자를 사용해 배열 요소를 복사했기 때문에 원본 배열 a 은 변경하지 않으며, a 를 이용한 새로운 배열을 만들 수 있다.

또한 비구조화 할당과 전개 연산자를 사용하여, 배열의 나머지 요소를 할당받을 수 있다.

```js
const a = [1,2,3,4,5,6];
let [first, second, ...rest] = a;

console.log(first, second, rest);
// 1 2 [3, 4, 5, 6]
```

변수 `first`, `second` 에는 각각 1과 2가 대입되고, `rest` 에는 첫번째, 두번째를 제외한 나머지 요소로 구성된 `[3, 4, 5, 6]` 가 대입된다. 여기서 `...rest` 를 **Rest Element** 라고 부른다.

이것 외로도 React 등에서 **불변함 (Immutable)** 함을 유지하기 위해 여러면으로 유용하게 사용되는 연산자이다.

## 클래스의 등장
자바스크립트의 객체는 프로토타입이 기반이다. 공식적으로 클래스라는 개념이 존재하지 않았으며, 함수를 사용하여 객체를 정의했다. 그리고 객체의 메서드를 정의할때는 `prototype` 안에 직접 정의해준다.

**ES5**

```js
function Person(name, job) {
  this.name = name;
  this.job = job;
}

Person.prototype.print = function() {
  console.log(this.job + " 직업을 가지고 있는 " + this.name + "씨");
}

var donghyun = new Person("조동현", "프론트엔드 개발자");

donghyun.print();
//프론트엔드 개발자 직업을 가지고 있는 조동현씨
```

프로토타입 방식으로 객체를 생성하고 다루는 것은 일반적인 객체지향 언어에 익숙한 개발자들에겐 낯설고 불편한 방식일 것이다. ES6 에서는 Class 문법을 만들어 이런 요구를 반영했다.

**ES6**

```js
class Person {
  constructor(name, job) {
    this.name = name
    this.job = job
  }

  print() {
    console.log(this.job + " 직업을 가지고 있는 " + this.name + "씨");
  }
}

const donghyun = new Person("조동현", "프론트엔드 개발자");

donghyun.print();
//프론트엔드 개발자 직업을 가지고 있는 조동현씨
```

더 익숙한 형태로 클래스와 그 안의 메서드를 정의할 수 있다. 하지만, 자바스크립트의 객체 모델이 바뀐 것은 아니며, 내부에서는 그대로 프로토타입 기반으로 작동한다. 이렇게 내부 동작은 동일하지만, 구현 방식에 맞춘 새로운 문법을 **문법적 설탕** (Syntactic sugar) 라고 한다.

## 기본 파라미터 (Default Parameter)
드디어 자바스크립트에서도 함수의 기본 파라미터 값을 지정할 수 있게 되었다. ES6 이전에서는 파라미터의 값이 들어오지 않으면 무조건 `undefined` 가 됐지만, ES6 부터 그 기본값을 설정할 수 있다.

**ES5**

```js
function foo(a, b, c) {
  console.log(a, b, c);
}

foo('a');
//a undefined undefined
```
파라미터 `a` 의 값은 들어왔지만, `b` 와 `c` 는 값을 할당받지 못해 `undefined` 가 된 모습이다. 기본값을 설정하기 위해 파라미터가 `undefined` 인지 일일히 체크하고, 값을 할당해줘야 했다.

**ES6**

```js
function foo(a, b='b', c='c') {
  console.log(a, b, c);
}

foo('a');
//a b c
```

편하게 기본 파라미터를 설정할 수 있게 되었다. 왜 이런 기본적인 문법이 ES6 에서야 추가된지 모르겠다.

## 모듈
기존의 자바스크립트에서는 모듈화를 통한 분리가 불가능했다. 하지만, ES6 에서는 드디어 `export` 와 `import` 키워드로 모듈화 구현할 수 있게 되었다.

> 이 과정에서 CommonJS, RequireJS 에 대해 이야기가 많지만 이 글에서는 생략하도록 한다. node.js 는 기본적으로 ES6와 다른 CommonJS 방식을 사용한다. 혼동될 수 있으니 주의하자.

모듈화를 하였을때, 각 파일은 각자의 스코프를 갖게 된다. 다른파일에서 어떤 객체에 접근하고 싶다면, `export` 를 통해 외부에 공개한다. Export 하는 방법도 크게 두가지가 있다.

### Named Export
이름을 지정해서 export 하는 방법이다. import 할때도 해당 이름을 사용하여 불러온다.

**초기화와 동시에 export**

```js
export const someConst = 5;
export function sum(a, b) {
  return a + b;
}
```
가장 간단한 방법이다. 별다른 코드 없이 초기화와 동시에 해당 객체를 export 한다.

**선언된 객체의 export**

```js
const someConst = 5;
const sum = function(a, b) {
  return a + b;
};

export { someConst, sum };
```
또한 객체나 함수를 중괄호 로 묶어 한번에 export 해줄 수 있다.

**별명 지정**

원래 존재하는 변수를 다른 이름으로 export 할 수 있다.

```js
const thisConstHasVeryLongName = 5;
export { thisConstHasVeryLongName as five };
```
thisConstHasVeryLongName 상수는 five 라는 이름으로 export 된다.

**다른 모듈의 객체 Export**

```js
export { name1, name2 } from './path/of/module';
```

다른 모듈에서 import 해옴과 동시에 export 해버리는 방식이다. 그다지 자주 사용되진 않지만, 여러 모듈을 한 파일로 번들링 할때 사용된다.

### Default Export
모듈 당 단 한번 만 할 수 있는 Export 이다. Named Export 는 import 할때도 이름을 지정해야하지만, default 로 export 해준 값은 간단하게 import 할 수 있다. 어떻게 import 하는지는 아래에서 설명하겠다.

```js
export default someConst;
export default function () {...}
```

Named Export 와 다르게, 초기화와 동시에 Export 는 불가능하고, 미리 선언된 변수, 함수, 익명함수 따위를 Export 할 수 있다.

```js
export { someObj as default, name1, name2, name3 ... }
```

그리고 위와 같이 as default 를 사용하여, default export 가 아닌 다른값과 함께 export 할 수 있다.

export 하는 방법을 배웠으니 import 하는 방법도 알아야한다.

### Import
> import 코드를 실행해 모듈을 불러오는 파일은 index.js 라고 가정한다.

```js
import { name1, name2 } from './module.js';
```

Named Export 방식으로 export 된 모듈을 불러오는 가장 간단한 방법이다. `module.js` 에서 export 된 `name1` 과 `name2` 를 `index.js` 의 동일한 변수에 할당다.

```js
import { name1 as newName1 } from './module.js';
```

`export ... as ...` 처럼 import 할때도 별명을 설정해 줄 수 있다. `module.js` 의 `name1` 의 값이 `index.js` 의 `newName1` 에 할당된다.

```js
import * as module from './module.js';
module.name1;
```

`module.js` 에서 export 된 모든 멤버들을 `module` 이라는 변수의 하위 멤버로 바인딩한다. `.` 표현법으로 `module.js` 의 모든 멤버에 접근할 수 있다.

```js
import defaultMember from './module.js';
```

`export default ...` 으로 export 된 멤버를 `defaultMember` 에 할당한다.

export 와 import 는 아직 많은 웹브라우저가 지원하지 않는다. babel 등의 트랜스파일러를 사용하여 ES5 코드로 바꾸어 사용하는것이 일반적이므로 주의하자.

## 마무리
사실 위에서 설명한 여러가지를 제외하고도 ES6에서 새롭게 등장한 문법과 기능등은 존재한다. 하지만 위에 서술한 것들만 제대로 숙지하고 있어도 ES6 로의 진입 장벽은 많이 낮아질 것이라 생각한다.
