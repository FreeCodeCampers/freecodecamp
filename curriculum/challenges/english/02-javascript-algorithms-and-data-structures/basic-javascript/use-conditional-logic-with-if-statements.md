---
id: cf1111c1c12feddfaeb3bdef
title: Use Conditional Logic with If Statements
challengeType: 1
forumTopicId: 18348
dashedName: use-conditional-logic-with-if-statements
---

# --description--

`if` statements are used to make decisions in code. The keyword `if` tells JavaScript to execute the code in the curly braces under certain conditions, defined in the parentheses. These conditions are known as `Boolean` conditions and they may only be `true` or `false`.

When the condition evaluates to `true`, the program executes the statement inside the curly braces. When the Boolean condition evaluates to `false`, the statement inside the curly braces will not execute.

**Pseudocode**

<blockquote>if (<i>condition is true</i>) {<br>  <i>statement is executed</i><br>}</blockquote>

**Example**

```js
function test(myCondition) {
  if (myCondition) {
    return "It was true";
  }
  return "It was false";
}

test(true);
test(false);
```

`test(true)` returns the string `It was true`, and `test(false)` returns the string `It was false`.

When `test` is called with a value of `true`, the `if` statement evaluates `myCondition` to see if it is `true` or not. Since it is `true`, the function returns `It was true`. When we call `test` with a value of `false`, `myCondition` is *not* `true` and the statement in the curly braces is not executed and the function returns `It was false`.

# --instructions--

Create an `if` statement inside the function to return `Yes, that was true` if the parameter `wasThatTrue` is `true` and return `No, that was false` otherwise.

# --hints--

`trueOrFalse` should be a function

```js
assert(typeof trueOrFalse === 'function');
```

`trueOrFalse(true)` should return a string

```js
assert(typeof trueOrFalse(true) === 'string');
```

`trueOrFalse(false)` should return a string

```js
assert(typeof trueOrFalse(false) === 'string');
```

`trueOrFalse(true)` should return the string `Yes, that was true`

```js
assert(trueOrFalse(true) === 'Yes, that was true');
```

`trueOrFalse(false)` should return the string `No, that was false`

```js
assert(trueOrFalse(false) === 'No, that was false');
```

# --seed--

## --seed-contents--

```js
function trueOrFalse(wasThatTrue) {
  // Only change code below this line



  // Only change code above this line

}
```

# --solutions--

```js
function trueOrFalse(wasThatTrue) {
  if (wasThatTrue) {
    return "Yes, that was true";
  }
  return "No, that was false";
}
```
