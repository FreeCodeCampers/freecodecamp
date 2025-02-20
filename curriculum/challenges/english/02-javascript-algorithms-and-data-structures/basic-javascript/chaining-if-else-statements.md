---
id: 56533eb9ac21ba0edf2244dc
title: Chaining If Else Statements
challengeType: 1
forumTopicId: 16772
dashedName: chaining-if-else-statements
---

# --description--

`if/else` statements can be chained together for complex logic. Here is <dfn>pseudocode</dfn> of multiple chained `if` / `else if` statements:

```js
if (condition1) {
  statement1
} else if (condition2) {
  statement2
} else if (condition3) {
  statement3
. . .
} else {
  statementN
}
```

# --instructions--

Write chained `if`/`else if` statements to fulfill the following conditions:

`num < 5` - return `Tiny`  
`num < 10` - return `Small`  
`num < 15` - return `Medium`  
`num < 20` - return `Large`  
`num >= 20` - return `Huge`

# --hints--

You should have at least four `else` statements

```js
assert(__helpers.removeJSComments(code).match(/else/g).length > 3);
```

You should have at least four `if` statements

```js
assert(__helpers.removeJSComments(code).match(/if/g).length > 3);
```

You should have at least one `return` statement

```js
assert(__helpers.removeJSComments(code).match(/return/g).length >= 1);
```

`testSize(0)` should return the string `Tiny`

```js
assert(testSize(0) === 'Tiny');
```

`testSize(4)` should return the string `Tiny`

```js
assert(testSize(4) === 'Tiny');
```

`testSize(5)` should return the string `Small`

```js
assert(testSize(5) === 'Small');
```

`testSize(8)` should return the string `Small`

```js
assert(testSize(8) === 'Small');
```

`testSize(10)` should return the string `Medium`

```js
assert(testSize(10) === 'Medium');
```

`testSize(14)` should return the string `Medium`

```js
assert(testSize(14) === 'Medium');
```

`testSize(15)` should return the string `Large`

```js
assert(testSize(15) === 'Large');
```

`testSize(17)` should return the string `Large`

```js
assert(testSize(17) === 'Large');
```

`testSize(20)` should return the string `Huge`

```js
assert(testSize(20) === 'Huge');
```

`testSize(25)` should return the string `Huge`

```js
assert(testSize(25) === 'Huge');
```

# --seed--

## --seed-contents--

```js
function testSize(num) {
  // Only change code below this line


  return "Change Me";
  // Only change code above this line
}

testSize(7);
```

# --solutions--

```js
function testSize(num) {
  if (num < 5) {
    return "Tiny";
  } else if (num < 10) {
    return "Small";
  } else if (num < 15) {
    return "Medium";
  } else if (num < 20) {
    return "Large";
  } else {
    return "Huge";
  }
}
```
