---
id: 56533eb9ac21ba0edf2244ae
title: Finding a Remainder in JavaScript
challengeType: 1
forumTopicId: 18184
dashedName: finding-a-remainder-in-javascript
---

# --description--

The <dfn>remainder</dfn> operator `%` gives the remainder of the division of two numbers.

**Example**

<pre>
5 % 2 = 1
5 / 2 = 2 remainder 1
2 * 2 = 4
5 - 4 = 1
</pre>

**Usage**  
In mathematics, a number can be checked to be even or odd by checking the remainder of the division of the number by `2`. Even numbers have a remainder of `0`, while odd numbers a remainder of `1`.

<pre>
17 % 2 = 1
48 % 2 = 0
</pre>

**Note:** The <dfn>remainder</dfn> operator is sometimes incorrectly referred to as the modulus operator. It is very similar to modulus, but does not work properly with negative numbers.

# --instructions--

Set `remainder` equal to the remainder of `11` divided by `3` using the <dfn>remainder</dfn> (`%`) operator.

# --hints--

The variable `remainder` should be initialized

```js
assert(/(const|let|var)\s+?remainder/.test(__helpers.removeJSComments(code)));
```

The value of `remainder` should be `2`

```js
assert(remainder === 2);
```

You should use the `%` operator

```js
assert(/\s+?remainder\s*?=\s*?.*%.*;?/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
(function (y) {
  return 'remainder = ' + y;
})(remainder);
```

## --seed-contents--

```js
const remainder = 0;
```

# --solutions--

```js
const remainder = 11 % 3;
```
