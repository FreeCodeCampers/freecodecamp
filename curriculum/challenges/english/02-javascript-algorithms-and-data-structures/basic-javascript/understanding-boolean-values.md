---
id: bd7123c9c441eddfaeb5bdef
title: Understanding Boolean Values
challengeType: 1
forumTopicId: 301176
dashedName: understanding-boolean-values
---

# --description--

Another data type is the <dfn>Boolean</dfn>. Booleans may only be one of two values: `true` or `false`. They are basically little on-off switches, where `true` is on and `false` is off. These two states are mutually exclusive.

**Note:** Boolean values are never written with quotes. The strings `"true"` and `"false"` are not Boolean and have no special meaning in JavaScript.

# --instructions--

Modify the `welcomeToBooleans` function so that it returns `true` instead of `false`.

# --hints--

The `welcomeToBooleans()` function should return a Boolean (`true` or `false`) value.

```js
assert(typeof welcomeToBooleans() === 'boolean');
```

`welcomeToBooleans()` should return `true`.

```js
assert(welcomeToBooleans() === true);
```

# --seed--

## --after-user-code--

```js
welcomeToBooleans();
```

## --seed-contents--

```js
function welcomeToBooleans() {
  // Only change code below this line

  return false; // Change this line

  // Only change code above this line
}
```

# --solutions--

```js
function welcomeToBooleans() {
  return true; // Change this line
}
```
