---
id: 56533eb9ac21ba0edf2244d6
title: Comparison with the Less Than Operator
challengeType: 1
forumTopicId: 16789
dashedName: comparison-with-the-less-than-operator
---

# --description--

The less than operator (`<`) compares the values of two numbers. If the number to the left is less than the number to the right, it returns `true`. Otherwise, it returns `false`. Like the equality operator, the less than operator converts data types while comparing.

**Examples**

```js
2   < 5 // true
'3' < 7 // true
5   < 5 // false
3   < 2 // false
'8' < 4 // false
```

# --instructions--

Add the less than operator to the indicated lines so that the return statements make sense.

# --hints--

`testLessThan(0)` should return the string `Under 25`

```js
assert(testLessThan(0) === 'Under 25');
```

`testLessThan(24)` should return the string `Under 25`

```js
assert(testLessThan(24) === 'Under 25');
```

`testLessThan(25)` should return the string `Under 55`

```js
assert(testLessThan(25) === 'Under 55');
```

`testLessThan(54)` should return the string `Under 55`

```js
assert(testLessThan(54) === 'Under 55');
```

`testLessThan(55)` should return the string `55 or Over`

```js
assert(testLessThan(55) === '55 or Over');
```

`testLessThan(99)` should return the string `55 or Over`

```js
assert(testLessThan(99) === '55 or Over');
```

You should use the `<` operator at least twice

```js
assert(__helpers.removeJSComments(code).match(/val\s*<\s*('|")*\d+('|")*/g).length > 1);
```

# --seed--

## --seed-contents--

```js
function testLessThan(val) {
  if (val) {  // Change this line
    return "Under 25";
  }

  if (val) {  // Change this line
    return "Under 55";
  }

  return "55 or Over";
}

testLessThan(10);
```

# --solutions--

```js
function testLessThan(val) {
  if (val < 25) {  // Change this line
    return "Under 25";
  }

  if (val < 55) {  // Change this line
    return "Under 55";
  }

  return "55 or Over";
}
```
