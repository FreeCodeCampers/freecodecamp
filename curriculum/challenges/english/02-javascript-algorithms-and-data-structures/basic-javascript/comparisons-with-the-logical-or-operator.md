---
id: 56533eb9ac21ba0edf2244d9
title: Comparisons with the Logical Or Operator
challengeType: 1
forumTopicId: 16800
dashedName: comparisons-with-the-logical-or-operator
---

# --description--

The <dfn>logical or</dfn> operator (`||`) returns `true` if either of the <dfn>operands</dfn> is `true`. Otherwise, it returns `false`.

The <dfn>logical or</dfn> operator is composed of two pipe symbols: (`||`). This can typically be found between your Backspace and Enter keys.

The pattern below should look familiar from prior waypoints.

```js
if (num > 10) {
  return "No";
}
if (num < 5) {
  return "No";
}
return "Yes";
```

This code will return `Yes` if `num` is between `5` and `10` (`5` and `10` included). The same logic can be written with the <dfn>logical or</dfn> operator.

```js
if (num > 10 || num < 5) {
  return "No";
}
return "Yes";
```

# --instructions--

Combine the two `if` statements into one statement which returns the string `Outside` if `val` is not between `10` and `20`, inclusive. Otherwise, return the string `Inside`.

# --hints--

You should use the `||` operator once

```js
assert(__helpers.removeJSComments(code).match(/\|\|/g).length === 1);
```

You should only have one `if` statement

```js
assert(__helpers.removeJSComments(code).match(/if/g).length === 1);
```

`testLogicalOr(0)` should return the string `Outside`

```js
assert(testLogicalOr(0) === 'Outside');
```

`testLogicalOr(9)` should return the string `Outside`

```js
assert(testLogicalOr(9) === 'Outside');
```

`testLogicalOr(10)` should return the string `Inside`

```js
assert(testLogicalOr(10) === 'Inside');
```

`testLogicalOr(15)` should return the string `Inside`

```js
assert(testLogicalOr(15) === 'Inside');
```

`testLogicalOr(19)` should return the string `Inside`

```js
assert(testLogicalOr(19) === 'Inside');
```

`testLogicalOr(20)` should return the string `Inside`

```js
assert(testLogicalOr(20) === 'Inside');
```

`testLogicalOr(21)` should return the string `Outside`

```js
assert(testLogicalOr(21) === 'Outside');
```

`testLogicalOr(25)` should return the string `Outside`

```js
assert(testLogicalOr(25) === 'Outside');
```

# --seed--

## --seed-contents--

```js
function testLogicalOr(val) {
  // Only change code below this line

  if (val) {
    return "Outside";
  }

  if (val) {
    return "Outside";
  }

  // Only change code above this line
  return "Inside";
}

testLogicalOr(15);
```

# --solutions--

```js
function testLogicalOr(val) {
  if (val < 10 || val > 20) {
    return "Outside";
  }
  return "Inside";
}
```
