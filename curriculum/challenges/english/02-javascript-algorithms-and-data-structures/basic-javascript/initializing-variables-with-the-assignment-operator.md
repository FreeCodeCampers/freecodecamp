---
id: 56533eb9ac21ba0edf2244a9
title: Initializing Variables with the Assignment Operator
challengeType: 1
forumTopicId: 301171
dashedName: initializing-variables-with-the-assignment-operator
---

# --description--

It is common to <dfn>initialize</dfn> a variable to an initial value in the same line as it is declared.

```js
var myVar = 0;
```

Creates a new variable called `myVar` and assigns it an initial value of `0`.

# --instructions--

Define a variable `a` with `var` and initialize it to a value of `9`.

# --hints--

You should initialize `a` to a value of `9`.

```js
assert(/var\s+a\s*=\s*9(\s*;?\s*)$/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
var a = 9;
```
