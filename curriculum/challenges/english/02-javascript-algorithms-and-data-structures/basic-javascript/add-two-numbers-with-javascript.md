---
id: cf1111c1c11feddfaeb3bdef
title: Add Two Numbers with JavaScript
challengeType: 1
forumTopicId: 16650
dashedName: add-two-numbers-with-javascript
---

# --description--

`Number` is a data type in JavaScript which represents numeric data.

Now let's try to add two numbers using JavaScript.

JavaScript uses the `+` symbol as an addition operator when placed between two numbers.

**Example:**

```js
const myVar = 5 + 10;
```

`myVar` now has the value `15`.

# --instructions--

Change the `0` so that sum will equal `20`.

# --hints--

`sum` should equal `20`.

```js
assert(sum === 20);
```

You should use the `+` operator.

```js
assert(/\+/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
(function(z){return 'sum = '+z;})(sum);
```

## --seed-contents--

```js
const sum = 10 + 0;
```

# --solutions--

```js
const sum = 10 + 10;
```
