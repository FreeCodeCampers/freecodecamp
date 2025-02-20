---
id: 56533eb9ac21ba0edf2244af
title: Compound Assignment With Augmented Addition
challengeType: 1
forumTopicId: 16661
dashedName: compound-assignment-with-augmented-addition
---

# --description--

In programming, it is common to use assignments to modify the contents of a variable. Remember that everything to the right of the equals sign is evaluated first, so we can say:

```js
myVar = myVar + 5;
```

to add `5` to `myVar`. Since this is such a common pattern, there are operators which do both a mathematical operation and assignment in one step.

One such operator is the `+=` operator.

```js
let myVar = 1;
myVar += 5;
console.log(myVar);
```

`6` would be displayed in the console.

# --instructions--

Convert the assignments for `a`, `b`, and `c` to use the `+=` operator.

# --hints--

`a` should equal `15`.

```js
assert(a === 15);
```

`b` should equal `26`.

```js
assert(b === 26);
```

`c` should equal `19`.

```js
assert(c === 19);
```

You should use the `+=` operator for each variable.

```js
assert(__helpers.removeJSComments(code).match(/\+=/g).length === 3);
```

You should not modify the code above the specified comment.

```js
assert(
  /let a = 3;/.test(__helpers.removeJSComments(code)) &&
    /let b = 17;/.test(__helpers.removeJSComments(code)) &&
    /let c = 12;/.test(__helpers.removeJSComments(code))
);
```

# --seed--

## --after-user-code--

```js
(function(a,b,c){ return "a = " + a + ", b = " + b + ", c = " + c; })(a,b,c);
```

## --seed-contents--

```js
let a = 3;
let b = 17;
let c = 12;

// Only change code below this line
a = a + 12;
b = 9 + b;
c = c + 7;
```

# --solutions--

```js
let a = 3;
let b = 17;
let c = 12;

a += 12;
b += 9;
c += 7;
```
