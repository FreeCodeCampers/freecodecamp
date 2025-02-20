---
id: 56533eb9ac21ba0edf2244c8
title: Accessing Object Properties with Bracket Notation
challengeType: 1
forumTopicId: 16163
dashedName: accessing-object-properties-with-bracket-notation
---

# --description--

The second way to access the properties of an object is bracket notation (`[]`). If the property of the object you are trying to access has a space in its name, you will need to use bracket notation.

However, you can still use bracket notation on object properties without spaces.

Here is a sample of using bracket notation to read an object's property:

```js
const myObj = {
  "Space Name": "Kirk",
  "More Space": "Spock",
  "NoSpace": "USS Enterprise"
};

myObj["Space Name"];
myObj['More Space'];
myObj["NoSpace"];
```

`myObj["Space Name"]` would be the string `Kirk`, `myObj['More Space']` would be the string `Spock`, and `myObj["NoSpace"]` would be the string `USS Enterprise`.

Note that property names with spaces in them must be in quotes (single or double).

# --instructions--

Read the values of the properties `an entree` and `the drink` of `testObj` using bracket notation and assign them to `entreeValue` and `drinkValue` respectively.

# --hints--

`entreeValue` should be a string

```js
assert(typeof entreeValue === 'string');
```

The value of `entreeValue` should be the string `hamburger`

```js
assert(entreeValue === 'hamburger');
```

`drinkValue` should be a string

```js
assert(typeof drinkValue === 'string');
```

The value of `drinkValue` should be the string `water`

```js
assert(drinkValue === 'water');
```

You should use bracket notation twice

```js
assert(__helpers.removeJSComments(code).match(/testObj\s*?\[('|")[^'"]+\1\]/g).length > 1);
```

# --seed--

## --after-user-code--

```js
(function(a,b) { return "entreeValue = '" + a + "', drinkValue = '" + b + "'"; })(entreeValue,drinkValue);
```

## --seed-contents--

```js
// Setup
const testObj = {
  "an entree": "hamburger",
  "my side": "veggies",
  "the drink": "water"
};

// Only change code below this line
const entreeValue = testObj;   // Change this line
const drinkValue = testObj;    // Change this line
```

# --solutions--

```js
const testObj = {
  "an entree": "hamburger",
  "my side": "veggies",
  "the drink": "water"
};
const entreeValue = testObj["an entree"];
const drinkValue = testObj['the drink'];
```
