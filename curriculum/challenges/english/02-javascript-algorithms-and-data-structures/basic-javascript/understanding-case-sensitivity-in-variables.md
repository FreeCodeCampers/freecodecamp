---
id: 56533eb9ac21ba0edf2244ab
title: Understanding Case Sensitivity in Variables
challengeType: 1
forumTopicId: 18334
dashedName: understanding-case-sensitivity-in-variables
---

# --description--

In JavaScript all variables and function names are case sensitive. This means that capitalization matters.

`MYVAR` is not the same as `MyVar` nor `myvar`. It is possible to have multiple distinct variables with the same name but different casing. It is strongly recommended that for the sake of clarity, you *do not* use this language feature.

**Best Practice**

Write variable names in JavaScript in <dfn>camelCase</dfn>. In <dfn>camelCase</dfn>, multi-word variable names have the first word in lowercase and the first letter of each subsequent word is capitalized.

**Examples:**

```js
var someVariable;
var anotherVariableName;
var thisVariableNameIsSoLong;
```

# --instructions--

Modify the existing declarations and assignments so their names use <dfn>camelCase</dfn>.

Do not create any new variables.

# --hints--

`studlyCapVar` should be defined and have a value of `10`.

```js
assert(typeof studlyCapVar !== 'undefined' && studlyCapVar === 10);
```

`properCamelCase` should be defined and have a value of the string `A String`.

```js
assert(
  typeof properCamelCase !== 'undefined' && properCamelCase === 'A String'
);
```

`titleCaseOver` should be defined and have a value of `9000`.

```js
assert(typeof titleCaseOver !== 'undefined' && titleCaseOver === 9000);
```

`studlyCapVar` should use camelCase in both declaration and assignment sections.

```js
assert(__helpers.removeJSComments(code).match(/studlyCapVar/g).length === 2);
```

`properCamelCase` should use camelCase in both declaration and assignment sections.

```js
assert(__helpers.removeJSComments(code).match(/properCamelCase/g).length === 2);
```

`titleCaseOver` should use camelCase in both declaration and assignment sections.

```js
assert(__helpers.removeJSComments(code).match(/titleCaseOver/g).length === 2);
```

# --seed--

## --seed-contents--

```js
// Variable declarations
var StUdLyCapVaR;
var properCamelCase;
var TitleCaseOver;

// Variable assignments
STUDLYCAPVAR = 10;
PRoperCAmelCAse = "A String";
tITLEcASEoVER = 9000;
```

# --solutions--

```js
var studlyCapVar;
var properCamelCase;
var titleCaseOver;

studlyCapVar = 10;
properCamelCase = "A String";
titleCaseOver = 9000;
```
