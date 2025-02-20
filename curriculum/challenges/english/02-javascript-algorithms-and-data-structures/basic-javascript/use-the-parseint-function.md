---
id: 587d7b7e367417b2b2512b23
title: Use the parseInt Function
challengeType: 1
forumTopicId: 301183
dashedName: use-the-parseint-function
---

# --description--

The `parseInt()` function parses a string and returns an integer. Here's an example:

```js
const a = parseInt("007");
```

The above function converts the string `007` to the integer `7`. If the first character in the string can't be converted into a number, then it returns `NaN`.

# --instructions--

Use `parseInt()` in the `convertToInteger` function so it converts the input string `str` into an integer, and returns it.

# --hints--

`convertToInteger` should use the `parseInt()` function

```js
assert(/parseInt/g.test(__helpers.removeJSComments(code)));
```

`convertToInteger("56")` should return a number

```js
assert(typeof convertToInteger('56') === 'number');
```

`convertToInteger("56")` should return 56

```js
assert(convertToInteger('56') === 56);
```

`convertToInteger("77")` should return 77

```js
assert(convertToInteger('77') === 77);
```

`convertToInteger("JamesBond")` should return `NaN`

```js
assert.isNaN(convertToInteger('JamesBond'));
```

# --seed--

## --seed-contents--

```js
function convertToInteger(str) {

}

convertToInteger("56");
```

# --solutions--

```js
function convertToInteger(str) {
  return parseInt(str);
}
```
