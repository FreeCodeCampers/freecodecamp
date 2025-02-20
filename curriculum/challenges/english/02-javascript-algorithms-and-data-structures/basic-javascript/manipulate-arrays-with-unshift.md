---
id: 56bbb991ad1ed5201cd392ce
title: Manipulate Arrays With unshift Method
challengeType: 1
forumTopicId: 18239
dashedName: manipulate-arrays-with-unshift
---

# --description--

Not only can you `shift` elements off of the beginning of an array, you can also `unshift` elements to the beginning of an array i.e. add elements in front of the array.

`.unshift()` works exactly like `.push()`, but instead of adding the element at the end of the array, `unshift()` adds the element at the beginning of the array.

Example:

```js
const ourArray = ["Stimpson", "J", "cat"];
ourArray.shift();
ourArray.unshift("Happy");
```

After the `shift`, `ourArray` would have the value `["J", "cat"]`. After the `unshift`, `ourArray` would have the value `["Happy", "J", "cat"]`.

# --instructions--

Add `["Paul", 35]` to the beginning of the `myArray` variable using `unshift()`.

# --hints--

`myArray` should now have `[["Paul", 35], ["dog", 3]]`.

```js
assert(
  (function (d) {
    if (
      typeof d[0] === 'object' &&
      d[0][0] == 'Paul' &&
      d[0][1] === 35 &&
      d[1][0] != undefined &&
      d[1][0] == 'dog' &&
      d[1][1] != undefined &&
      d[1][1] == 3
    ) {
      return true;
    } else {
      return false;
    }
  })(myArray)
);
```

# --seed--

## --after-user-code--

```js
(function(y, z){return 'myArray = ' + JSON.stringify(y);})(myArray);
```

## --seed-contents--

```js
// Setup
const myArray = [["John", 23], ["dog", 3]];
myArray.shift();

// Only change code below this line

```

# --solutions--

```js
const myArray = [["John", 23], ["dog", 3]];
myArray.shift();
myArray.unshift(["Paul", 35]);
```
