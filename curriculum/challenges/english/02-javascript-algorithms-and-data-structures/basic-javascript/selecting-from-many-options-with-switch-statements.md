---
id: 56533eb9ac21ba0edf2244dd
title: Selecting from Many Options with Switch Statements
challengeType: 1
forumTopicId: 18277
dashedName: selecting-from-many-options-with-switch-statements
---

# --description--

If you need to match one value against many options, you can use a <dfn>switch</dfn> statement. A `switch` statement compares the value to the <dfn>case</dfn> statements which define various possible values. Any valid JavaScript statements can be executed inside a <dfn>case</dfn> block and will run from the first matched `case` value until a `break` is encountered.

Here is an example of a `switch` statement:

```js
switch (fruit) {
  case "apple":
    console.log("The fruit is an apple");
    break;
  case "orange":
    console.log("The fruit is an orange");
    break;
}
```

`case` values are tested with strict equality (`===`). The `break` tells JavaScript to stop executing statements. If the `break` is omitted, the next statement will be executed.

# --instructions--

Write a switch statement which tests `val` and sets `answer` for the following conditions:  
`1` - `alpha`  
`2` - `beta`  
`3` - `gamma`  
`4` - `delta`

# --hints--

`caseInSwitch(1)` should have a value of the string `alpha`

```js
assert(caseInSwitch(1) === 'alpha');
```

`caseInSwitch(2)` should have a value of the string `beta`

```js
assert(caseInSwitch(2) === 'beta');
```

`caseInSwitch(3)` should have a value of the string `gamma`

```js
assert(caseInSwitch(3) === 'gamma');
```

`caseInSwitch(4)` should have a value of the string `delta`

```js
assert(caseInSwitch(4) === 'delta');
```

You should not use any `if` or `else` statements

```js
assert(!/else/g.test(__helpers.removeJSComments(code)) || !/if/g.test(__helpers.removeJSComments(code)));
```

You should have at least 3 `break` statements

```js
assert(__helpers.removeJSComments(code).match(/break/g).length > 2);
```

# --seed--

## --seed-contents--

```js
function caseInSwitch(val) {
  let answer = "";
  // Only change code below this line



  // Only change code above this line
  return answer;
}

caseInSwitch(1);
```

# --solutions--

```js
function caseInSwitch(val) {
  let answer = "";

  switch (val) {
    case 1:
      answer = "alpha";
      break;
    case 2:
      answer = "beta";
      break;
    case 3:
      answer = "gamma";
      break;
    case 4:
      answer = "delta";
  }
  return answer;
}
```
