---
id: cf1111c1c11feddfaeb9bdef
title: Generate Random Fractions with JavaScript
challengeType: 1
forumTopicId: 18185
dashedName: generate-random-fractions-with-javascript
---

# --description--

Random numbers are useful for creating random behavior.

JavaScript has a `Math.random()` function that generates a random decimal number between `0` (inclusive) and `1` (exclusive). Thus `Math.random()` can return a `0` but never return a `1`.

**Note:** Like <a href="/learn/javascript-algorithms-and-data-structures/basic-javascript/storing-values-with-the-assignment-operator" target="_blank" rel="noopener noreferrer nofollow">Storing Values with the Assignment Operator</a>, all function calls will be resolved before the `return` executes, so we can `return` the value of the `Math.random()` function.

# --instructions--

Change `randomFraction` to return a random number instead of returning `0`.

# --hints--

`randomFraction` should return a random number.

```js
assert(typeof randomFraction() === 'number');
```

The number returned by `randomFraction` should be a decimal.

```js
assert((randomFraction() + '').match(/\./g));
```

You should be using `Math.random` to generate the random decimal number.

```js
assert(__helpers.removeJSComments(code).match(/Math\.random/g).length >= 0);
```

# --seed--

## --after-user-code--

```js
(function(){return randomFraction();})();
```

## --seed-contents--

```js
function randomFraction() {

  // Only change code below this line

  return 0;

  // Only change code above this line
}
```

# --solutions--

```js
function randomFraction() {
  return Math.random();
}
```
