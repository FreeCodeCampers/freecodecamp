---
id: bd7123c9c441eddfaeb4bdef
title: Comment Your JavaScript Code
challengeType: 1
forumTopicId: 16783
dashedName: comment-your-javascript-code
---

# --description--

Comments are lines of code that JavaScript will intentionally ignore. Comments are a great way to leave notes to yourself and to other people who will later need to figure out what that code does.

There are two ways to write comments in JavaScript:

Using `//` will tell JavaScript to ignore the remainder of the text on the current line. This is an in-line comment:

```js
// This is an in-line comment.
```

You can make a multi-line comment beginning with `/*` and ending with `*/`. This is a multi-line comment:

```js
/* This is a
multi-line comment */
```

**NOTE:** As you write code, you should regularly add comments to clarify the function of parts of your code. Good commenting can help communicate the intent of your code—both for others *and* for your future self.

# --instructions--

Try creating one of each type of comment.

# --hints--

You should create a `//` style comment that contains at least five letters.

```js
assert(code.match(/(\/\/)...../g));
```

You should create a `/* */` style comment that contains at least five letters.

```js
assert(code.match(/(\/\*)([^\/]{5,})(?=\*\/)/gm));
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
// Fake Comment
/* Another Comment */
```
