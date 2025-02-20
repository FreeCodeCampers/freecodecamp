---
id: 56533eb9ac21ba0edf2244b1
title: Compound Assignment With Augmented Multiplication
challengeType: 1
forumTopicId: 16662
dashedName: compound-assignment-with-augmented-multiplication
---

# --description--

The `*=` operator multiplies a variable by a number.

```js
myVar = myVar * 5;
```

will multiply `myVar` by `5`. This can be rewritten as:

```js
myVar *= 5;
```

# --instructions--

Convert the assignments for `a`, `b`, and `c` to use the `*=` operator.

# --hints--

`a` should equal `25`.

```js
assert(a === 25);
```

`b` should equal `36`.

```js
assert(b === 36);
```

`c` should equal `46`.

```js
assert(c === 46);
```

You should use the `*=` operator for each variable.

```js
assert(__helpers.removeJSComments(code).match(/\*=/g).length === 3);
```

You should not modify the code above the specified comment.

```js
assert(
  /let a = 5;/.test(__helpers.removeJSComments(code)) &&
    /let b = 12;/.test(__helpers.removeJSComments(code)) &&
    /let c = 4\.6;/.test(__helpers.removeJSComments(code))
);
```

# --seed--

## --after-user-code--

```js
(function(a,b,c){ return "a = " + a + ", b = " + b + ", c = " + c; })(a,b,c);
```

## --seed-contents--

```js
let a = 5;
let b = 12;
let c = 4.6;

// Only change code below this line
a = a * 5;
b = 3 * b;
c = c * 10;
```

# --solutions--

```js
let a = 5;
let b = 12;
let c = 4.6;

a *= 5;
b *= 3;
c *= 10;
```
