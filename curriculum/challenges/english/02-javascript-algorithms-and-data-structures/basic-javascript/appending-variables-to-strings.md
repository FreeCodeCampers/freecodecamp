---
id: 56533eb9ac21ba0edf2244ed
title: Appending Variables to Strings
challengeType: 1
forumTopicId: 16656
dashedName: appending-variables-to-strings
---

# --description--

Just as we can build a string over multiple lines out of string <dfn>literals</dfn>, we can also append variables to a string using the plus equals (`+=`) operator.

Example:

```js
const anAdjective = "awesome!";
let ourStr = "freeCodeCamp is ";
ourStr += anAdjective;
```

`ourStr` would have the value `freeCodeCamp is awesome!`.

# --instructions--

Set `someAdjective` to a string of at least 3 characters and append it to `myStr` using the `+=` operator.

# --hints--

`someAdjective` should be set to a string at least 3 characters long.

```js
assert(typeof someAdjective !== 'undefined' && someAdjective.length > 2);
```

You should append `someAdjective` to `myStr` using the `+=` operator.

```js
assert(__helpers.removeJSComments(code).match(/myStr\s*\+=\s*someAdjective\s*/).length > 0);
```

# --seed--

## --after-user-code--

```js
(function(){
  var output = [];
  if(typeof someAdjective === 'string') {
    output.push('someAdjective = "' + someAdjective + '"');
  } else {
    output.push('someAdjective is not a string');
  }
  if(typeof myStr === 'string') {
    output.push('myStr = "' + myStr + '"');
  } else {
    output.push('myStr is not a string');
  }
  return output.join('\n');
})();
```

## --seed-contents--

```js
// Change code below this line
const someAdjective = "";
let myStr = "Learning to code is ";
```

# --solutions--

```js
const someAdjective = "neat";
let myStr = "Learning to code is ";
myStr += someAdjective;
```
