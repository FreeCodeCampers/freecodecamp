---
id: 56533eb9ac21ba0edf2244df
title: Multiple Identical Options in Switch Statements
challengeType: 1
forumTopicId: 18242
dashedName: multiple-identical-options-in-switch-statements
---

# --description--

If the `break` statement is omitted from a `switch` statement's `case`, the following `case` statement(s) are executed until a `break` is encountered. If you have multiple inputs with the same output, you can represent them in a `switch` statement like this:

```js
let result = "";
switch (val) {
  case 1:
  case 2:
  case 3:
    result = "1, 2, or 3";
    break;
  case 4:
    result = "4 alone";
}
```

Cases for 1, 2, and 3 will all produce the same result.

# --instructions--

Write a switch statement to set `answer` for the following ranges:  
`1-3` - `Low`  
`4-6` - `Mid`  
`7-9` - `High`

**Note:** You will need to have a `case` statement for each number in the range.

# --hints--

`sequentialSizes(1)` should return the string `Low`

```js
assert(sequentialSizes(1) === 'Low');
```

`sequentialSizes(2)` should return the string `Low`

```js
assert(sequentialSizes(2) === 'Low');
```

`sequentialSizes(3)` should return the string `Low`

```js
assert(sequentialSizes(3) === 'Low');
```

`sequentialSizes(4)` should return the string `Mid`

```js
assert(sequentialSizes(4) === 'Mid');
```

`sequentialSizes(5)` should return the string `Mid`

```js
assert(sequentialSizes(5) === 'Mid');
```

`sequentialSizes(6)` should return the string `Mid`

```js
assert(sequentialSizes(6) === 'Mid');
```

`sequentialSizes(7)` should return the string `High`

```js
assert(sequentialSizes(7) === 'High');
```

`sequentialSizes(8)` should return the string `High`

```js
assert(sequentialSizes(8) === 'High');
```

`sequentialSizes(9)` should return the string `High`

```js
assert(sequentialSizes(9) === 'High');
```

You should not use any `if` or `else` statements

```js
assert(!/else/g.test(__helpers.removeJSComments(code)) || !/if/g.test(__helpers.removeJSComments(code)));
```

You should have nine `case` statements

```js
assert(__helpers.removeJSComments(code).match(/case/g).length === 9);
```

# --seed--

## --seed-contents--

```js
function sequentialSizes(val) {
  let answer = "";
  // Only change code below this line



  // Only change code above this line
  return answer;
}

sequentialSizes(1);
```

# --solutions--

```js
function sequentialSizes(val) {
  let answer = "";

  switch (val) {
    case 1:
    case 2:
    case 3:
      answer = "Low";
      break;
    case 4:
    case 5:
    case 6:
      answer = "Mid";
      break;
    case 7:
    case 8:
    case 9:
      answer = "High";
  }

  return answer;
}
```
