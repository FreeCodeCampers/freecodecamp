---
id: 56533eb9ac21ba0edf2244c4
title: Return Early Pattern for Functions
challengeType: 1
forumTopicId: 18272
dashedName: return-early-pattern-for-functions
---

# --description--

When a `return` statement is reached, the execution of the current function stops and control returns to the calling location.

**Example**

```js
function myFun() {
  console.log("Hello");
  return "World";
  console.log("byebye")
}
myFun();
```

The above will display the string `Hello` in the console, and return the string `World`. The string `byebye` will never display in the console, because the function exits at the `return` statement.

# --instructions--

Modify the function `abTest` so that if `a` or `b` are less than `0` the function will immediately exit with a value of `undefined`.

**Hint**  
Remember that <a href="https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/understanding-uninitialized-variables" target="_blank" rel="noopener noreferrer nofollow"><code>undefined</code> is a keyword</a>, not a string.

# --hints--

`abTest(2, 2)` should return a number

```js
assert(typeof abTest(2, 2) === 'number');
```

`abTest(2, 2)` should return `8`

```js
assert(abTest(2, 2) === 8);
```

`abTest(-2, 2)` should return `undefined`

```js
assert(abTest(-2, 2) === undefined);
```

`abTest(2, -2)` should return `undefined`

```js
assert(abTest(2, -2) === undefined);
```

`abTest(2, 8)` should return `18`

```js
assert(abTest(2, 8) === 18);
```

`abTest(3, 3)` should return `12`

```js
assert(abTest(3, 3) === 12);
```

`abTest(0, 0)` should return `0`

```js
assert(abTest(0, 0) === 0);
```

# --seed--

## --seed-contents--

```js
// Setup
function abTest(a, b) {
  // Only change code below this line



  // Only change code above this line

  return Math.round(Math.pow(Math.sqrt(a) + Math.sqrt(b), 2));
}

abTest(2,2);
```

# --solutions--

```js
function abTest(a, b) {
  if(a < 0 || b < 0) {
    return undefined;
  }
  return Math.round(Math.pow(Math.sqrt(a) + Math.sqrt(b), 2));
}
```
