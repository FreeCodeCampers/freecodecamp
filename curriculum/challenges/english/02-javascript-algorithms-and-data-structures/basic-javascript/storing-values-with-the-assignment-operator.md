---
id: 56533eb9ac21ba0edf2244a8
title: Storing Values with the Assignment Operator
challengeType: 1
forumTopicId: 18310
dashedName: storing-values-with-the-assignment-operator
---

# --description--

In JavaScript, you can store a value in a variable with the <dfn>assignment</dfn> operator (`=`).

```js
myVariable = 5;
```

This assigns the `Number` value `5` to `myVariable`.

If there are any calculations to the right of the `=` operator, those are performed before the value is assigned to the variable on the left of the operator.

```js
var myVar;
myVar = 5;
```

First, this code creates a variable named `myVar`. Then, the code assigns `5` to `myVar`. Now, if `myVar` appears again in the code, the program will treat it as if it is `5`.

# --instructions--

Assign the value `7` to variable `a`.

# --hints--

You should not change code above the specified comment.

```js
assert(/var a;/.test(__helpers.removeJSComments(code)));
```

`a` should have a value of 7.

```js
assert(typeof a === 'number' && a === 7);
```

# --seed--

## --before-user-code--

```js
if (typeof a != 'undefined') {
  a = undefined;
}
```

## --after-user-code--

```js
(function(a){return "a = " + a;})(a);
```

## --seed-contents--

```js
// Setup
var a;

// Only change code below this line
```

# --solutions--

```js
var a;
a = 7;
```
