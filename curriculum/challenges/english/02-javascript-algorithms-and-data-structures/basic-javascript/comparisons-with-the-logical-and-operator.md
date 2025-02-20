---
id: 56533eb9ac21ba0edf2244d8
title: Comparisons with the Logical And Operator
challengeType: 1
forumTopicId: 16799
dashedName: comparisons-with-the-logical-and-operator
---

# --description--

Sometimes you will need to test more than one thing at a time. The <dfn>logical and</dfn> operator (`&&`) returns `true` if and only if the <dfn>operands</dfn> to the left and right of it are true.

The same effect could be achieved by nesting an `if` statement inside another `if`.

```js
if (num > 5) {
  if (num < 10) {
    return "Yes";
  }
}
return "No";
```

This code will return `Yes` if `num` is greater than `5` and less than `10`. The same logic can be written with the <dfn>logical and</dfn> operator.

```js
if (num > 5 && num < 10) {
  return "Yes";
}
return "No";
```

# --instructions--

Replace the two if statements with one statement, using the `&&` operator, which will return the string `Yes` if `val` is less than or equal to `50` and greater than or equal to `25`. Otherwise, will return the string `No`.

# --hints--

You should use the `&&` operator once

```js
assert(__helpers.removeJSComments(code).match(/&&/g).length === 1);
```

You should only have one `if` statement

```js
assert(__helpers.removeJSComments(code).match(/if/g).length === 1);
```

`testLogicalAnd(0)` should return the string `No`

```js
assert(testLogicalAnd(0) === 'No');
```

`testLogicalAnd(24)` should return the string `No`

```js
assert(testLogicalAnd(24) === 'No');
```

`testLogicalAnd(25)` should return the string `Yes`

```js
assert(testLogicalAnd(25) === 'Yes');
```

`testLogicalAnd(30)` should return the string `Yes`

```js
assert(testLogicalAnd(30) === 'Yes');
```

`testLogicalAnd(50)` should return the string `Yes`

```js
assert(testLogicalAnd(50) === 'Yes');
```

`testLogicalAnd(51)` should return the string `No`

```js
assert(testLogicalAnd(51) === 'No');
```

`testLogicalAnd(75)` should return the string `No`

```js
assert(testLogicalAnd(75) === 'No');
```

`testLogicalAnd(80)` should return the string `No`

```js
assert(testLogicalAnd(80) === 'No');
```

# --seed--

## --seed-contents--

```js
function testLogicalAnd(val) {
  // Only change code below this line

  if (val) {
    if (val) {
      return "Yes";
    }
  }

  // Only change code above this line
  return "No";
}

testLogicalAnd(10);
```

# --solutions--

```js
function testLogicalAnd(val) {
  if (val >= 25 && val <= 50) {
    return "Yes";
  }
  return "No";
}
```
