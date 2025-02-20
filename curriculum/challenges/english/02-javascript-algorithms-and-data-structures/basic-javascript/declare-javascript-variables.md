---
id: bd7123c9c443eddfaeb5bdef
title: Declare JavaScript Variables
challengeType: 1
forumTopicId: 17556
dashedName: declare-javascript-variables
---

# --description--

In computer science, <dfn>data</dfn> is anything that is meaningful to the computer. JavaScript provides eight different <dfn>data types</dfn> which are `undefined`, `null`, `boolean`, `string`, `symbol`, `bigint`, `number`, and `object`.

For example, computers distinguish between numbers, such as the number `12`, and `strings`, such as `"12"`, `"dog"`, or `"123 cats"`, which are collections of characters. Computers can perform mathematical operations on a number, but not on a string.

<dfn>Variables</dfn> allow computers to store and manipulate data in a dynamic fashion. They do this by using a "label" to point to the data rather than using the data itself. Any of the eight data types may be stored in a variable.

Variables are similar to the x and y variables you use in mathematics, which means they're a simple name to represent the data we want to refer to. Computer variables differ from mathematical variables in that they can store different values at different times.

We tell JavaScript to create or <dfn>declare</dfn> a variable by putting the keyword `var` in front of it, like so:

```js
var ourName;
```

creates a variable called `ourName`. In JavaScript we end statements with semicolons. Variable names can be made up of numbers, letters, and `$` or `_`, but may not contain spaces or start with a number.

# --instructions--

Use the `var` keyword to create a variable called `myName`.

**Hint**  
Look at the `ourName` example above if you get stuck.

# --hints--

You should declare `myName` with the `var` keyword, ending with a semicolon

```js
assert(/var\s+myName\s*;/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
if(typeof myName !== "undefined"){(function(v){return v;})(myName);}
```

## --seed-contents--

```js

```

# --solutions--

```js
var myName;
```
