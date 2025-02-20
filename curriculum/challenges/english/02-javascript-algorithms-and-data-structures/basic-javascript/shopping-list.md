---
id: 56533eb9ac21ba0edf2244bc
title: Shopping List
challengeType: 1
forumTopicId: 18280
dashedName: shopping-list
---

# --description--

Create a shopping list in the variable `myList`. The list should be a multi-dimensional array containing several sub-arrays.

The first element in each sub-array should contain a string with the name of the item. The second element should be a number representing the quantity i.e.

```js
["Chocolate Bar", 15]
```

There should be at least 5 sub-arrays in the list.

# --hints--

`myList` should be an array.

```js
assert(isArray);
```

The first elements in each of your sub-arrays should all be strings.

```js
assert(hasString);
```

The second elements in each of your sub-arrays should all be numbers.

```js
assert(hasNumber);
```

You should have at least 5 items in your list.

```js
assert(count > 4);
```

# --seed--

## --after-user-code--

```js
var count = 0;
var isArray = false;
var hasString = false;
var hasNumber = false;
(function(list){
  if(Array.isArray(myList)) {
    isArray = true;
    if(myList.length > 0) {
      hasString = true;
      hasNumber = true;
      for (var elem of myList) {
        if(!elem || !elem[0] || typeof elem[0] !== 'string') {
          hasString = false;
        }
        if(!elem || typeof elem[1] !== 'number') {
          hasNumber = false;
        }
      }
    }
    count = myList.length;
    return JSON.stringify(myList);
  } else {
    return "myList is not an array";
  }

})(myList);
```

## --seed-contents--

```js
const myList = [];
```

# --solutions--

```js
const myList = [
  ["Candy", 10],
  ["Potatoes", 12],
  ["Eggs", 12],
  ["Catfood", 1],
  ["Toads", 9]
];
```
