---
id: 5675e877dbd60be8ad28edc6
title: Iterate Through an Array with a For Loop
challengeType: 1
forumTopicId: 18216
dashedName: iterate-through-an-array-with-a-for-loop
---

# --description--

A common task in JavaScript is to iterate through the contents of an array. One way to do that is with a `for` loop. This code will output each element of the array `arr` to the console:

```js
const arr = [10, 9, 8, 7, 6];

for (let i = 0; i < arr.length; i++) {
   console.log(arr[i]);
}
```

Remember that arrays have zero-based indexing, which means the last index of the array is `length - 1`. Our condition for this loop is `i < arr.length`, which stops the loop when `i` is equal to `length`. In this case the last iteration is `i === 4` i.e. when `i` becomes equal to `arr.length - 1` and outputs `6` to the console. Then `i` increases to `5`, and the loop terminates because `i < arr.length` is `false`.

# --instructions--

Declare and initialize a variable `total` to `0`. Use a `for` loop to add the value of each element of the `myArr` array to `total`.

# --hints--

`total` should be declared and initialized to 0.

```js
assert(__helpers.removeJSComments(code).match(/(var|let|const)\s*?total\s*=\s*0.*?;?/));
```

`total` should equal 20.

```js
assert(total === 20);
```

You should use a `for` loop to iterate through `myArr`.

```js
assert(/for\s*\(/g.test(__helpers.removeJSComments(code)) && /myArr\s*\[/g.test(__helpers.removeJSComments(code)));
```

You should not attempt to directly assign the value 20 to `total`.

```js
assert(!__helpers.removeWhiteSpace(__helpers.removeJSComments(code)).match(/total[=+-]0*[1-9]+/gm));
```

# --seed--

## --after-user-code--

```js
(function(){if(typeof total !== 'undefined') { return "total = " + total; } else { return "total is undefined";}})()
```

## --seed-contents--

```js
// Setup
const myArr = [2, 3, 4, 5, 6];

// Only change code below this line

```

# --solutions--

```js
const myArr = [2, 3, 4, 5, 6];
let total = 0;

for (let i = 0; i < myArr.length; i++) {
  total += myArr[i];
}
```
