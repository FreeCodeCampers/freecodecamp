---
id: cf1111c1c11feddfaeb7bdef
title: Nest one Array within Another Array
challengeType: 1
forumTopicId: 18247
dashedName: nest-one-array-within-another-array
---

# --description--

You can also nest arrays within other arrays, like below:

```js
const teams = [["Bulls", 23], ["White Sox", 45]];
```

This is also called a <dfn>multi-dimensional array</dfn>.

# --instructions--

Create a nested array called `myArray`.

# --hints--

`myArray` should have at least one array nested within another array.

```js
assert(Array.isArray(myArray) && myArray.some(Array.isArray));
```

# --seed--

## --after-user-code--

```js
if(typeof myArray !== "undefined"){(function(){return myArray;})();}
```

## --seed-contents--

```js
// Only change code below this line
const myArray = [];
```

# --solutions--

```js
const myArray = [[1, 2, 3]];
```
