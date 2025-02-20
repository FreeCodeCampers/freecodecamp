---
id: bd7993c9c69feddfaeb8bdef
title: Store Multiple Values in one Variable using JavaScript Arrays
challengeType: 1
forumTopicId: 18309
dashedName: store-multiple-values-in-one-variable-using-javascript-arrays
---

# --description--

With JavaScript `array` variables, we can store several pieces of data in one place.

You start an array declaration with an opening square bracket, end it with a closing square bracket, and put a comma between each entry, like this:

```js
const sandwich = ["peanut butter", "jelly", "bread"];
```

# --instructions--

Modify the new array `myArray` so that it contains both a string and a number (in that order).

# --hints--

`myArray` should be an array.

```js
assert(typeof myArray == 'object');
```

The first item in `myArray` should be a string.

```js
assert(typeof myArray[0] !== 'undefined' && typeof myArray[0] == 'string');
```

The second item in `myArray` should be a number.

```js
assert(typeof myArray[1] !== 'undefined' && typeof myArray[1] == 'number');
```

# --seed--

## --after-user-code--

```js
(function(z){return z;})(myArray);
```

## --seed-contents--

```js
// Only change code below this line
const myArray = [];
```

# --solutions--

```js
const myArray = ["The Answer", 42];
```
