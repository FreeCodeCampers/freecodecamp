---
id: 587d7b7e367417b2b2512b22
title: Use the parseInt Function with a Radix
challengeType: 1
forumTopicId: 301182
dashedName: use-the-parseint-function-with-a-radix
---

# --description--

The `parseInt()` function parses a string and returns an integer. It takes a second argument for the radix, which specifies the base of the number in the string. The radix can be an integer between 2 and 36.

The function call looks like:

```js
parseInt(string, radix);
```

And here's an example:

```js
const a = parseInt("11", 2);
```

The radix variable says that `11` is in the binary system, or base 2. This example converts the string `11` to an integer `3`.

# --instructions--

Use `parseInt()` in the `convertToInteger` function so it converts a binary number to an integer and returns it.

# --hints--

`convertToInteger` should use the `parseInt()` function

```js
assert(/parseInt/g.test(__helpers.removeJSComments(code)));
```

`convertToInteger("10011")` should return a number

```js
assert(typeof convertToInteger('10011') === 'number');
```

`convertToInteger("10011")` should return 19

```js
assert(convertToInteger('10011') === 19);
```

`convertToInteger("111001")` should return 57

```js
assert(convertToInteger('111001') === 57);
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

convertToInteger("10011");
```

# --solutions--

```js
function convertToInteger(str) {
  return parseInt(str, 2);
}
```
