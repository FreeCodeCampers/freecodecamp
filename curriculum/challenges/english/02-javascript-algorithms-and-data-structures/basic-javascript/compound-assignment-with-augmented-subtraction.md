---
id: 56533eb9ac21ba0edf2244b0
title: Compound Assignment With Augmented Subtraction
challengeType: 1
forumTopicId: 16660
dashedName: compound-assignment-with-augmented-subtraction
---

# --description--

Like the `+=` operator, `-=` subtracts a number from a variable.

```js
myVar = myVar - 5;
```

will subtract `5` from `myVar`. This can be rewritten as:

```js
myVar -= 5;
```

# --instructions--

Convert the assignments for `a`, `b`, and `c` to use the `-=` operator.

# --hints--

`a` should equal `5`.

```js
assert(a === 5);
```

`b` should equal `-6`.

```js
assert(b === -6);
```

`c` should equal `2`.

```js
assert(c === 2);
```

You should use the `-=` operator for each variable.

```js
assert(__helpers.removeJSComments(code).match(/-=/g).length === 3);
```

You should not modify the code above the specified comment.

```js
assert(
  /let a = 11;/.test(__helpers.removeJSComments(code)) && /let b = 9;/.test(__helpers.removeJSComments(code)) && /let c = 3;/.test(__helpers.removeJSComments(code))
);
```

# --seed--

## --after-user-code--

```js
(function(a,b,c){ return "a = " + a + ", b = " + b + ", c = " + c; })(a,b,c);
```

## --seed-contents--

```js
let a = 11;
let b = 9;
let c = 3;

// Only change code below this line
a = a - 6;
b = b - 15;
c = c - 1;
```

# --solutions--

```js
let a = 11;
let b = 9;
let c = 3;

a -= 6;
b -= 15;
c -= 1;
```
