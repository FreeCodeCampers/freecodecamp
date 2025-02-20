---
id: bd7123c9c448eddfaeb5bdef
title: Find the Length of a String
challengeType: 1
forumTopicId: 18182
dashedName: find-the-length-of-a-string
---

# --description--

You can find the length of a `String` value by writing `.length` after the string variable or string literal.

```js
console.log("Alan Peter".length);
```

The value `10` would be displayed in the console. Note that the space character between "Alan" and "Peter" is also counted.

For example, if we created a variable `const firstName = "Ada"`, we could find out how long the string `Ada` is by using the `firstName.length` property.

# --instructions--

Use the `.length` property to set `lastNameLength` to the number of characters in `lastName`.

# --hints--

You should not change the variable declarations in the `// Setup` section.

```js
assert(
  __helpers.removeJSComments(code).match(/let lastNameLength = 0;/) &&
    __helpers.removeJSComments(code).match(/const lastName = "Lovelace";/)
);
```

`lastNameLength` should be equal to eight.

```js
assert(typeof lastNameLength !== 'undefined' && lastNameLength === 8);
```

You should be getting the length of `lastName` by using `.length` like this: `lastName.length`.

```js
assert(__helpers.removeJSComments(code).match(/=\s*lastName\.length/g) && !__helpers.removeJSComments(code).match(/lastName\s*=\s*8/));
```

# --seed--

## --seed-contents--

```js
// Setup
let lastNameLength = 0;
const lastName = "Lovelace";

// Only change code below this line
lastNameLength = lastName;
```

# --solutions--

```js
let lastNameLength = 0;
const lastName = "Lovelace";
lastNameLength = lastName.length;
```
