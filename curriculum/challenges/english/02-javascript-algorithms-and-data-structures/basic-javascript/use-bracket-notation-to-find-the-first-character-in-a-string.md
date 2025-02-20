---
id: bd7123c9c549eddfaeb5bdef
title: Use Bracket Notation to Find the First Character in a String
challengeType: 1
forumTopicId: 18341
dashedName: use-bracket-notation-to-find-the-first-character-in-a-string
---

# --description--

<dfn>Bracket notation</dfn> is a way to get a character at a specific index within a string.

Most modern programming languages, like JavaScript, don't start counting at 1 like humans do. They start at 0. This is referred to as <dfn>Zero-based</dfn> indexing.

For example, the character at index 0 in the word `Charles` is `C`. So if `const firstName = "Charles"`, you can get the value of the first letter of the string by using `firstName[0]`.

Example:

```js
const firstName = "Charles";
const firstLetter = firstName[0];
```

`firstLetter` would have a value of the string `C`.

# --instructions--

Use bracket notation to find the first character in the `lastName` variable and assign it to `firstLetterOfLastName`.

**Hint:** Try looking at the example above if you get stuck.

# --hints--

The `firstLetterOfLastName` variable should have the value of `L`.

```js
assert(firstLetterOfLastName === 'L');
```

You should use bracket notation.

```js
assert(__helpers.removeJSComments(code).match(/firstLetterOfLastName\s*=\s*lastName\s*\[\s*\d\s*\]/));
```

# --seed--

## --after-user-code--

```js
(function(v){return v;})(firstLetterOfLastName);
```

## --seed-contents--

```js
// Setup
let firstLetterOfLastName = "";
const lastName = "Lovelace";

// Only change code below this line
firstLetterOfLastName = lastName; // Change this line
```

# --solutions--

```js
let firstLetterOfLastName = "";
const lastName = "Lovelace";

// Only change code below this line
firstLetterOfLastName = lastName[0];
```
