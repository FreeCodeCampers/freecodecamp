---
id: 587d7fa8367417b2b2512bc9
title: Update the Height of an Element Dynamically
challengeType: 6
forumTopicId: 301493
dashedName: update-the-height-of-an-element-dynamically
---

# --description--

The previous challenges covered how to display data from an array and how to add CSS classes. You can combine these lessons to create a simple bar chart. There are two steps to this:

1. Create a `div` for each data point in the array

2. Give each `div` a dynamic height, using a callback function in the `style()` method that sets height equal to the data value

Recall the format to set a style using a callback function:

```js
selection.style('cssProperty', d => d);
```

# --instructions--

Add the `style()` method to the code in the editor to set the `height` property for each element. Use a callback function to return the value of the data point with the string `px` added to it.

# --hints--

The first `div` should have a `height` of `12` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[0]?.style.height, '12px');
```

The second `div` should have a `height` of `31` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[1]?.style.height, '31px');
```

The third `div` should have a `height` of `22` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[2]?.style.height, '22px');
```

The fourth `div` should have a `height` of `17` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[3]?.style.height, '17px');
```

The fifth `div` should have a `height` of `25` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[4]?.style.height, '25px');
```

The sixth `div` should have a `height` of `18` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[5]?.style.height, '18px');
```

The seventh `div` should have a `height` of `29` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[6]?.style.height, '29px');
```

The eighth `div` should have a `height` of `14` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[7]?.style.height, '14px');
```

The ninth `div` should have a `height` of `9` pixels.

```js
assert.strictEqual(document.querySelectorAll('div')[8]?.style.height, '9px');
```

# --seed--

## --seed-contents--

```html
<style>
  .bar {
    width: 25px;
    height: 100px;
    display: inline-block;
    background-color: blue;
  }
</style>
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

    d3.select('body')
      .selectAll('div')
      .data(dataset)
      .enter()
      .append('div')
      .attr('class', 'bar');
    // Add your code below this line



    // Add your code above this line
  </script>
</body>
```

# --solutions--

```html
<style>
  .bar {
    width: 25px;
    height: 100px;
    display: inline-block;
    background-color: blue;
  }
</style>
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

    d3.select('body')
      .selectAll('div')
      .data(dataset)
      .enter()
      .append('div')
      .attr('class', 'bar')
      .style('height', d => `${d}px`);
  </script>
</body>
```
