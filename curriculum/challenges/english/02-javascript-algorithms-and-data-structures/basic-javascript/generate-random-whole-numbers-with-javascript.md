---
id: cf1111c1c12feddfaeb1bdef
title: Generate Random Whole Numbers with JavaScript
challengeType: 1
forumTopicId: 18186
dashedName: generate-random-whole-numbers-with-javascript
---

# --description--

You can generate random decimal numbers with `Math.random()`, but sometimes you need to generate random whole numbers. The following process will give you a random whole number less than `20`:

1. Use `Math.random()` to generate a random decimal number.
2. Multiply that random decimal number by `20`.
3. Use `Math.floor()` to round this number down to its nearest whole number.

Remember that `Math.random()` can never quite return a `1`, so it's impossible to actually get `20` since you are rounding down with `Math.floor()`. This process will give you a random whole number in the range from `0` to `19`.

Putting everything together, this is what your code looks like:

```js
Math.floor(Math.random() * 20);
```

You are calling `Math.random()`, multiplying the result by 20, then passing the value to `Math.floor()` to round the value down to the nearest whole number.

# --instructions--

Use this technique to generate and return a random whole number in the range from `0` to `9`.

# --hints--

The result of `randomWholeNum` should be a whole number.

```js
assert(
  typeof randomWholeNum() === 'number' &&
    (function () {
      var r = randomWholeNum();
      return Math.floor(r) === r;
    })()
);
```

You should use `Math.random` to generate a random number.

```js
assert(__helpers.removeJSComments(code).match(/Math.random/g).length >= 1);
```

You should have multiplied the result of `Math.random` by 10 to make it a number in the range from zero to nine.

```js
assert(
  __helpers.removeJSComments(code).match(/\s*?Math.random\s*?\(\s*?\)\s*?\*\s*?10[\D]\s*?/g) ||
    __helpers.removeJSComments(code).match(/\s*?10\s*?\*\s*?Math.random\s*?\(\s*?\)\s*?/g)
);
```

You should use `Math.floor` to remove the decimal part of the number.

```js
assert(__helpers.removeJSComments(code).match(/Math.floor/g).length >= 1);
```

# --seed--

## --after-user-code--

```js
(function(){return randomWholeNum();})();
```

## --seed-contents--

```js
function randomWholeNum() {
  return Math.random();
}
```

# --solutions--

```js
function randomWholeNum() {
  return Math.floor(Math.random() * 10);
}
```
