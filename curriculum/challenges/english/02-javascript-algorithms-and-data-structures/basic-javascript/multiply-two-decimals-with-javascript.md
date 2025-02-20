---
id: bd7993c9c69feddfaeb7bdef
title: Multiply Two Decimals with JavaScript
challengeType: 1
forumTopicId: 301173
dashedName: multiply-two-decimals-with-javascript
---

# --description--

In JavaScript, you can also perform calculations with decimal numbers, just like whole numbers.

Let's multiply two decimals together to get their product.

# --instructions--

Change the `0.0` so that product will equal `5.0`.

# --hints--

The variable `product` should equal `5.0`.

```js
assert(product === 5.0);
```

You should use the `*` operator

```js
assert(/\*/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
(function(y){return 'product = '+y;})(product);
```

## --seed-contents--

```js
const product = 2.0 * 0.0;
```

# --solutions--

```js
const product = 2.0 * 2.5;
```
