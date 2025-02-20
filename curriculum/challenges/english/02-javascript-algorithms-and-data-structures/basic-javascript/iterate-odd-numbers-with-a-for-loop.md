---
id: 56104e9e514f539506016a5c
title: Iterate Odd Numbers With a For Loop
challengeType: 1
forumTopicId: 18212
dashedName: iterate-odd-numbers-with-a-for-loop
---

# --description--

For loops don't have to iterate one at a time. By changing our `final-expression`, we can count by even numbers.

We'll start at `i = 0` and loop while `i < 10`. We'll increment `i` by 2 each loop with `i += 2`.

```js
const ourArray = [];

for (let i = 0; i < 10; i += 2) {
  ourArray.push(i);
}
```

`ourArray` will now contain `[0, 2, 4, 6, 8]`. Let's change our `initialization` so we can count by odd numbers.

# --instructions--

Push the odd numbers from 1 through 9 to `myArray` using a `for` loop.

# --hints--

You should be using a `for` loop for this.

```js
assert(/for\s*\([^)]+?\)/.test(__helpers.removeJSComments(code)));
```

`myArray` should equal `[1, 3, 5, 7, 9]`.

```js
assert.deepEqual(myArray, [1, 3, 5, 7, 9]);
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
for (let i = 1; i < 10; i += 2) {
  myArray.push(i);
}
```
