---
id: 56533eb9ac21ba0edf2244de
title: Adding a Default Option in Switch Statements
challengeType: 1
forumTopicId: 16653
dashedName: adding-a-default-option-in-switch-statements
---

# --description--

In a `switch` statement you may not be able to specify all possible values as `case` statements. Instead, you can add the `default` statement which will be executed if no matching `case` statements are found. Think of it like the final `else` statement in an `if/else` chain.

A `default` statement should be the last case.

```js
switch (num) {
  case value1:
    statement1;
    break;
  case value2:
    statement2;
    break;
...
  default:
    defaultStatement;
    break;
}
```

# --instructions--

Write a switch statement to set `answer` for the following conditions:  
`a` - `apple`  
`b` - `bird`  
`c` - `cat`  
`default` - `stuff`

# --hints--

`switchOfStuff("a")` should return the string `apple`

```js
assert(switchOfStuff('a') === 'apple');
```

`switchOfStuff("b")` should return the string `bird`

```js
assert(switchOfStuff('b') === 'bird');
```

`switchOfStuff("c")` should return the string `cat`

```js
assert(switchOfStuff('c') === 'cat');
```

`switchOfStuff("d")` should return the string `stuff`

```js
assert(switchOfStuff('d') === 'stuff');
```

`switchOfStuff(4)` should return the string `stuff`

```js
assert(switchOfStuff(4) === 'stuff');
```

You should not use any `if` or `else` statements

```js
assert(!/else/g.test(__helpers.removeJSComments(code)) || !/if/g.test(__helpers.removeJSComments(code)));
```

You should use a `default` statement

```js
assert(switchOfStuff('string-to-trigger-default-case') === 'stuff');
```

You should have at least 3 `break` statements

```js
assert(__helpers.removeJSComments(code).match(/break/g).length > 2);
```

# --seed--

## --seed-contents--

```js
function switchOfStuff(val) {
  let answer = "";
  // Only change code below this line



  // Only change code above this line
  return answer;
}

switchOfStuff(1);
```

# --solutions--

```js
function switchOfStuff(val) {
  let answer = "";

  switch(val) {
    case "a":
      answer = "apple";
      break;
    case "b":
      answer = "bird";
      break;
    case "c":
      answer = "cat";
      break;
    default:
      answer = "stuff";
  }
  return answer;
}
```
