---
id: 56533eb9ac21ba0edf2244bf
title: Local Scope and Functions
challengeType: 1
forumTopicId: 18227
dashedName: local-scope-and-functions
---

# --description--

Variables which are declared within a function, as well as the function parameters, have <dfn>local</dfn> scope. That means they are only visible within that function.

Here is a function `myTest` with a local variable called `loc`.

```js
function myTest() {
  const loc = "foo";
  console.log(loc);
}

myTest();
console.log(loc);
```

The `myTest()` function call will display the string `foo` in the console. The `console.log(loc)` line (outside of the `myTest` function) will throw an error, as `loc` is not defined outside of the function.

# --instructions--

The editor has two `console.log`s to help you see what is happening. Check the console as you code to see how it changes. Declare a local variable `myVar` inside `myLocalScope` and run the tests.

**Note:** The console will still display `ReferenceError: myVar is not defined`, but this will not cause the tests to fail.

# --hints--

The code should not contain a global `myVar` variable.

```js
function declared() {
  myVar;
}

assert.throws(declared, ReferenceError);
```

You should add a local `myVar` variable.

```js
assert(
  /functionmyLocalScope\(\)\{.*(var|let|const)myVar[\s\S]*}/.test(
    __helpers.removeWhiteSpace(__helpers.removeJSComments(code))
  )
);
```

# --seed--

## --seed-contents--

```js
function myLocalScope() {
  // Only change code below this line

  console.log('inside myLocalScope', myVar);
}
myLocalScope();

// Run and check the console
// myVar is not defined outside of myLocalScope
console.log('outside myLocalScope', myVar);
```

# --solutions--

```js
function myLocalScope() {
  // Only change code below this line
  let myVar;
  console.log('inside myLocalScope', myVar);
}
myLocalScope();

// Run and check the console
// myVar is not defined outside of myLocalScope
console.log('outside myLocalScope', myVar);
```
