---
id: cf1111c1c11feddfaeb1bdef
title: Iterate with JavaScript While Loops
challengeType: 1
forumTopicId: 18220
dashedName: iterate-with-javascript-while-loops
---

# --description--

You can run the same code multiple times by using a loop.

The first type of loop we will learn is called a `while` loop because it runs while a specified condition is true and stops once that condition is no longer true.

```js
const ourArray = [];
let i = 0;

while (i < 5) {
  ourArray.push(i);
  i++;
}
```

In the code example above, the `while` loop will execute 5 times and append the numbers 0 through 4 to `ourArray`.

Let's try getting a while loop to work by pushing values to an array.

# --instructions--

Add the numbers 5 through 0 (inclusive) in descending order to `myArray` using a `while` loop.

# --hints--

You should be using a `while` loop for this.

```js
assert(__helpers.removeJSComments(code).match(/while/g));
```

`myArray` should equal `[5, 4, 3, 2, 1, 0]`.

```js
assert.deepEqual(myArray, [5, 4, 3, 2, 1, 0]);
```

# --seed--

## --after-user-code--

```js
if(typeof myArray !== "undefined"){(function(){return myArray;})();}
```

## --seed-contents--

```js
// Setup
const myArray = [];

// Only change code below this line

```

# --solutions--

```js
const myArray = [];
let i = 5;
while (i >= 0) {
  myArray.push(i);
  i--;
}
```
