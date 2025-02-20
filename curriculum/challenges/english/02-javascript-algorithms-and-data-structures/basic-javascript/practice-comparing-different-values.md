---
id: 599a789b454f2bbd91a3ff4d
title: Practice comparing different values
challengeType: 1
forumTopicId: 301174
dashedName: practice-comparing-different-values
---

# --description--

In the last two challenges, we learned about the equality operator (`==`) and the strict equality operator (`===`). Let's do a quick review and practice using these operators some more.

If the values being compared are not of the same type, the equality operator will perform a type conversion, and then evaluate the values. However, the strict equality operator will compare both the data type and value as-is, without converting one type to the other.

**Examples**

`3 == '3'` returns `true` because JavaScript performs type conversion from string to number. `3 === '3'` returns `false` because the types are different and type conversion is not performed.

**Note:** In JavaScript, you can determine the type of a variable or a value with the `typeof` operator, as follows:

```js
typeof 3
typeof '3'
```

`typeof 3` returns the string `number`, and `typeof '3'` returns the string `string`.

# --instructions--

The `compareEquality` function in the editor compares two values using the equality operator. Modify the function so that it returns the string `Equal` only when the values are strictly equal.

# --hints--

`compareEquality(10, "10")` should return the string `Not Equal`

```js
assert(compareEquality(10, '10') === 'Not Equal');
```

`compareEquality("20", 20)` should return the string `Not Equal`

```js
assert(compareEquality('20', 20) === 'Not Equal');
```

You should use the `===` operator

```js
assert(__helpers.removeJSComments(code).match(/===/g));
```

# --seed--

## --seed-contents--

```js
// Setup
function compareEquality(a, b) {
  if (a == b) { // Change this line
    return "Equal";
  }
  return "Not Equal";
}

compareEquality(10, "10");
```

# --solutions--

```js
function compareEquality(a,b) {
  if (a === b) {
    return "Equal";
  }
  return "Not Equal";
}
```
