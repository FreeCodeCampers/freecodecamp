---
id: cf1111c1c11feddfaeb6bdef
title: Divide One Number by Another with JavaScript
challengeType: 1
forumTopicId: 17566
dashedName: divide-one-number-by-another-with-javascript
---

# --description--

We can also divide one number by another.

JavaScript uses the `/` symbol for division.

**Example**

```js
const myVar = 16 / 2;
```

`myVar` now has the value `8`.
# --instructions--

Change the `0` so that the `quotient` is equal to `2`.

# --hints--

The variable `quotient` should be equal to 2.

```js
assert(quotient === 2);
```

You should use the `/` operator.

```js
assert(/\d+\s*\/\s*\d+/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
(function(z){return 'quotient = '+z;})(quotient);
```

## --seed-contents--

```js
const quotient = 66 / 0;
```

# --solutions--

```js
const quotient = 66 / 33;
```
