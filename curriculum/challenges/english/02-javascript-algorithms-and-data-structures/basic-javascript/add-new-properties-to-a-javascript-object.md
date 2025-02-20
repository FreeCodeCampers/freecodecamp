---
id: 56bbb991ad1ed5201cd392d2
title: Add New Properties to a JavaScript Object
challengeType: 1
forumTopicId: 301169
dashedName: add-new-properties-to-a-javascript-object
---

# --description--

You can add new properties to existing JavaScript objects the same way you would modify them.

Here's how we would add a `bark` property to `ourDog`:

```js
ourDog.bark = "bow-wow";
```

or

```js
ourDog["bark"] = "bow-wow";
```

Now when we evaluate `ourDog.bark`, we'll get his bark, `bow-wow`.

Example:

```js
const ourDog = {
  "name": "Camper",
  "legs": 4,
  "tails": 1,
  "friends": ["everything!"]
};

ourDog.bark = "bow-wow";
```

# --instructions--

Add a `bark` property to `myDog` and set it to a dog sound, such as "woof". You may use either dot or bracket notation.

# --hints--

You should add the property `bark` to `myDog`.

```js
assert(myDog.bark !== undefined);
```

You should not add `bark` to the initialization of `myDog`.

```js
assert(!/bark[^\n]:/.test(__helpers.removeJSComments(code)));
```

# --seed--

## --after-user-code--

```js
(function(z){return z;})(myDog);
```

## --seed-contents--

```js
const myDog = {
  "name": "Happy Coder",
  "legs": 4,
  "tails": 1,
  "friends": ["freeCodeCamp Campers"]
};


```

# --solutions--

```js
const myDog = {
  "name": "Happy Coder",
  "legs": 4,
  "tails": 1,
  "friends": ["freeCodeCamp Campers"]
};
myDog.bark = "Woof Woof";
```
