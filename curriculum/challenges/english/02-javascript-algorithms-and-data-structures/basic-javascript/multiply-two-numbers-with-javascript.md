---
id: cf1231c1c11feddfaeb5bdef
title: Multiply Two Numbers with JavaScript
challengeType: 1
forumTopicId: 18243
dashedName: multiply-two-numbers-with-javascript
---

# --description--

We can also multiply one number by another.

JavaScript uses the `*` symbol for multiplication of two numbers.

**Example**

```js
const myVar = 13 * 13;
```

`myVar` would have the value `169`.

# --instructions--

Change the `0` so that product will equal `80`.

# --hints--

The variable `product` should be equal to 80.

```js
assert(product === 80);
```

You should use the `*` operator.

```js
assert(/\*/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
(function(z){return 'product = '+z;})(product);
```

## --seed-contents--

```js
const product = 8 * 0;
```

# --solutions--

```js
const product = 8 * 10;
```
