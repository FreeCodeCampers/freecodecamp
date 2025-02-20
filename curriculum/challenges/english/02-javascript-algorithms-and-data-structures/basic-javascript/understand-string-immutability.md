---
id: 56533eb9ac21ba0edf2244ba
title: Understand String Immutability
challengeType: 1
forumTopicId: 18331
dashedName: understand-string-immutability
---

# --description--

In JavaScript, `String` values are <dfn>immutable</dfn>, which means that they cannot be altered once created.

For example, the following code will produce an error because the letter `B` in the string `Bob` cannot be changed to the letter `J`:

```js
let myStr = "Bob";
myStr[0] = "J";
```

Note that this does *not* mean that `myStr` could not be re-assigned. The only way to change `myStr` would be to assign it with a new value, like this:

```js
let myStr = "Bob";
myStr = "Job";
```

# --instructions--

Correct the assignment to `myStr` so it contains the string value of `Hello World` using the approach shown in the example above.

# --hints--

`myStr` should have a value of the string `Hello World`.

```js
assert(myStr === 'Hello World');
```

You should not change the code above the specified comment.

```js
assert(/myStr = "Jello World"/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
(function(v){return "myStr = " + v;})(myStr);
```

## --seed-contents--

```js
// Setup
let myStr = "Jello World";

// Only change code below this line
myStr[0] = "H"; // Change this line
// Only change code above this line
```

# --solutions--

```js
let myStr = "Jello World";
myStr = "Hello World";
```
