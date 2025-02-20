---
id: 56533eb9ac21ba0edf2244c2
title: Return a Value from a Function with Return
challengeType: 1
forumTopicId: 18271
dashedName: return-a-value-from-a-function-with-return
---

# --description--

We can pass values into a function with <dfn>arguments</dfn>. You can use a `return` statement to send a value back out of a function.

**Example**

```js
function plusThree(num) {
  return num + 3;
}

const answer = plusThree(5);
```

`answer` has the value `8`.

`plusThree` takes an <dfn>argument</dfn> for `num` and returns a value equal to `num + 3`.

# --instructions--

Create a function `timesFive` that accepts one argument, multiplies it by `5`, and returns the new value.

# --hints--

`timesFive` should be a function

```js
assert(typeof timesFive === 'function');
```

`timesFive(5)` should return `25`

```js
assert(timesFive(5) === 25);
```

`timesFive(2)` should return `10`

```js
assert(timesFive(2) === 10);
```

`timesFive(0)` should return `0`

```js
assert(timesFive(0) === 0);
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
function timesFive(num) {
  return num * 5;
}
timesFive(10);
```
