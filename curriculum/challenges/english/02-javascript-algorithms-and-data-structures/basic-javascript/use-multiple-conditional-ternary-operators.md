---
id: 587d7b7e367417b2b2512b21
title: Use Multiple Conditional (Ternary) Operators
challengeType: 1
forumTopicId: 301179
dashedName: use-multiple-conditional-ternary-operators
---

# --description--

In the previous challenge, you used a single conditional operator. You can also chain them together to check for multiple conditions.

The following function uses `if`, `else if`, and `else` statements to check multiple conditions:

```js
function findGreaterOrEqual(a, b) {
  if (a === b) {
    return "a and b are equal";
  }
  else if (a > b) {
    return "a is greater";
  }
  else {
    return "b is greater";
  }
}
```

The above function can be re-written using multiple conditional operators:

```js
function findGreaterOrEqual(a, b) {
  return (a === b) ? "a and b are equal" 
    : (a > b) ? "a is greater" 
    : "b is greater";
}
```

It is considered best practice to format multiple conditional operators such that each condition is on a separate line, as shown above. Using multiple conditional operators without proper indentation may make your code hard to read. For example:

```js
function findGreaterOrEqual(a, b) {
  return (a === b) ? "a and b are equal" : (a > b) ? "a is greater" : "b is greater";
}
```

# --instructions--

In the `checkSign` function, use multiple conditional operators - following the recommended format used in `findGreaterOrEqual` - to check if a number is positive, negative or zero. The function should return `positive`, `negative` or `zero`.

# --hints--

`checkSign` should use multiple conditional operators

```js
assert(/.+?\s*?\?\s*?.+?\s*?:\s*?.+?\s*?\?\s*?.+?\s*?:\s*?.+?/gi.test(__helpers.removeJSComments(code)));
```

`checkSign(10)` should return the string `positive`. Note that capitalization matters

```js
assert(checkSign(10) === 'positive');
```

`checkSign(-12)` should return the string `negative`. Note that capitalization matters

```js
assert(checkSign(-12) === 'negative');
```

`checkSign(0)` should return the string `zero`. Note that capitalization matters

```js
assert(checkSign(0) === 'zero');
```

# --seed--

## --seed-contents--

```js
function checkSign(num) {

}

checkSign(10);
```

# --solutions--

```js
function checkSign(num) {
  return (num > 0) ? 'positive' : (num < 0) ? 'negative' : 'zero';
}
```
