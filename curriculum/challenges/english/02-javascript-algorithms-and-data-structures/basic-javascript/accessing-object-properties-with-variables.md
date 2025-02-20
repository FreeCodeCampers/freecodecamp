---
id: 56533eb9ac21ba0edf2244c9
title: Accessing Object Properties with Variables
challengeType: 1
forumTopicId: 16165
dashedName: accessing-object-properties-with-variables
---

# --description--

Another use of bracket notation on objects is to access a property which is stored as the value of a variable. This can be very useful for iterating through an object's properties or when accessing a lookup table.

Here is an example of using a variable to access a property:

```js
const dogs = {
  Fido: "Mutt",
  Hunter: "Doberman",
  Snoopie: "Beagle"
};

const myDog = "Hunter";
const myBreed = dogs[myDog];
console.log(myBreed);
```

The string `Doberman` would be displayed in the console.

Note that we do *not* use quotes around the variable name when using it to access the property because we are using the *value* of the variable, not the *name*.

# --instructions--

Set the `playerNumber` variable to `16`. Then, use the variable to look up the player's name and assign it to `player`.

# --hints--

`playerNumber` should be a number

```js
assert(typeof playerNumber === 'number');
```

The variable `player` should be a string

```js
assert(typeof player === 'string');
```

The value of `player` should be the string `Montana`

```js
assert(player === 'Montana');
```

You should use bracket notation to access `testObj`

```js
assert(/testObj\s*?\[.*?\]/.test(__helpers.removeJSComments(code)));
```

You should not assign the value `Montana` to the variable `player` directly.

```js
assert(!__helpers.removeJSComments(code).match(/player\s*=\s*"|\'\s*Montana\s*"|\'\s*;/gi));
```

You should be using the variable `playerNumber` in your bracket notation

```js
assert(/testObj\s*?\[\s*playerNumber\s*\]/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
if(typeof player !== "undefined"){(function(v){return v;})(player);}
```

## --seed-contents--

```js
// Setup
const testObj = {
  12: "Namath",
  16: "Montana",
  19: "Unitas"
};

// Only change code below this line
const playerNumber = 42;  // Change this line
const player = testObj;   // Change this line
```

# --solutions--

```js
const testObj = {
  12: "Namath",
  16: "Montana",
  19: "Unitas"
};
const playerNumber = 16;
const player = testObj[playerNumber];
```
