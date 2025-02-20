---
id: cf1111c1c11feddfaeb4bdef
title: Subtract One Number from Another with JavaScript
challengeType: 1
forumTopicId: 18314
dashedName: subtract-one-number-from-another-with-javascript
---

# --description--

We can also subtract one number from another.

JavaScript uses the `-` symbol for subtraction.

**Example**

```js
const myVar = 12 - 6;
```

`myVar` would have the value `6`.
# --instructions--

Change the `0` so the difference is `12`.

# --hints--

The variable `difference` should be equal to `12`.

```js
assert(difference === 12);
```

You should only subtract one number from `45`.

```js
assert(/difference=45-33;?/.test(__helpers.removeWhiteSpace(__helpers.removeJSComments(code))));
```

# --seed--

## --after-user-code--

```js
(function(z){return 'difference = '+z;})(difference);
```

## --seed-contents--

```js
const difference = 45 - 0;
```

# --solutions--

```js
const difference = 45 - 33;
```
