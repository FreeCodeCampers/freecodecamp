---
id: 56105e7b514f539506016a5e
title: Count Backwards With a For Loop
challengeType: 1
forumTopicId: 16808
dashedName: count-backwards-with-a-for-loop
---

# --description--

A for loop can also count backwards, so long as we can define the right conditions.

In order to decrement by two each iteration, we'll need to change our initialization, condition, and final expression.

We'll start at `i = 10` and loop while `i > 0`. We'll decrement `i` by 2 each loop with `i -= 2`.

```js
const ourArray = [];

for (let i = 10; i > 0; i -= 2) {
  ourArray.push(i);
}
```

`ourArray` will now contain `[10, 8, 6, 4, 2]`. Let's change our initialization and final expression so we can count backwards by twos to create an array of descending odd numbers.

# --instructions--

Push the odd numbers from 9 through 1 to `myArray` using a `for` loop.

# --hints--

You should be using a `for` loop for this.

```js
assert(/for\s*\([^)]+?\)/.test(__helpers.removeJSComments(code)));
```

You should be using the array method `push`.

```js
assert(__helpers.removeJSComments(code).match(/myArray.push/));
```

`myArray` should equal `[9, 7, 5, 3, 1]`.

```js
assert.deepEqual(myArray, [9, 7, 5, 3, 1]);
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
for (let i = 9; i > 0; i -= 2) {
  myArray.push(i);
}
```
