---
id: 56533eb9ac21ba0edf2244c7
title: Accessing Object Properties with Dot Notation
challengeType: 1
forumTopicId: 16164
dashedName: accessing-object-properties-with-dot-notation
---

# --description--

There are two ways to access the properties of an object: dot notation (`.`) and bracket notation (`[]`), similar to an array.

Dot notation is what you use when you know the name of the property you're trying to access ahead of time.

Here is a sample of using dot notation (`.`) to read an object's property:

```js
const myObj = {
  prop1: "val1",
  prop2: "val2"
};

const prop1val = myObj.prop1;
const prop2val = myObj.prop2;
```

`prop1val` would have a value of the string `val1`, and `prop2val` would have a value of the string `val2`.

# --instructions--

Read in the property values of `testObj` using dot notation. Set the variable `hatValue` equal to the object's property `hat` and set the variable `shirtValue` equal to the object's property `shirt`.

# --hints--

`hatValue` should be a string

```js
assert(typeof hatValue === 'string');
```

The value of `hatValue` should be the string `ballcap`

```js
assert(hatValue === 'ballcap');
```

`shirtValue` should be a string

```js
assert(typeof shirtValue === 'string');
```

The value of `shirtValue` should be the string `jersey`

```js
assert(shirtValue === 'jersey');
```

You should use dot notation twice

```js
assert(__helpers.removeJSComments(code).match(/testObj\.\w+/g).length > 1);
```

# --seed--

## --after-user-code--

```js
(function(a,b) { return "hatValue = '" + a + "', shirtValue = '" + b + "'"; })(hatValue,shirtValue);
```

## --seed-contents--

```js
// Setup
const testObj = {
  hat: "ballcap",
  shirt: "jersey",
  shoes: "cleats"
};

// Only change code below this line
const hatValue = testObj;      // Change this line
const shirtValue = testObj;    // Change this line
```

# --solutions--

```js
const testObj = {
  hat: "ballcap",
  shirt: "jersey",
  shoes: "cleats"
};

const hatValue = testObj.hat;
const shirtValue = testObj.shirt;
```
