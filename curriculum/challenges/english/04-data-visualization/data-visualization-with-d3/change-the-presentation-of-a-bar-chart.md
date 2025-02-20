---
id: 587d7fa8367417b2b2512bca
title: Change the Presentation of a Bar Chart
challengeType: 6
forumTopicId: 301481
dashedName: change-the-presentation-of-a-bar-chart
---

# --description--

The last challenge created a bar chart, but there are a couple of formatting changes that could improve it:

1. Add space between each bar to visually separate them, which is done by adding a margin to the CSS for the `bar` class

2. Increase the height of the bars to better show the difference in values, which is done by multiplying the value by a number to scale the height

# --instructions--

First, add a `margin` of `2px` to the `bar` class in the `style` tag. Next, change the callback function in the `style()` method so it returns a value `10` times the original data value (plus the `px`).

**Note:** Multiplying each data point by the _same_ constant only alters the scale. It's like zooming in, and it doesn't change the meaning of the underlying data.

# --hints--

The first `div` should have a `height` of `120` pixels and a `margin` of `2` pixels.

```js
const firstDiv = document.querySelector('div');
assert.exists(firstDiv); 
const height = window.getComputedStyle(firstDiv)['height'];
const margin = window.getComputedStyle(firstDiv)['margin-right'];
assert.strictEqual(height, '120px');
assert.strictEqual(margin, '2px');
```

The second `div` should have a `height` of `310` pixels and a `margin` of `2` pixels.

```js
const secondDiv = document.querySelectorAll('div')[1];
assert.exists(secondDiv); 
const height = window.getComputedStyle(secondDiv)['height'];
const margin = window.getComputedStyle(secondDiv)['margin-right'];
assert.strictEqual(height, '310px');
assert.strictEqual(margin, '2px');
```

The third `div` should have a `height` of `220` pixels and a `margin` of `2` pixels.

```js
const thirdDiv = document.querySelectorAll('div')[2];
assert.exists(thirdDiv); 
const height = window.getComputedStyle(thirdDiv)['height'];
const margin = window.getComputedStyle(thirdDiv)['margin-right'];
assert.strictEqual(height, '220px');
assert.strictEqual(margin, '2px');
```

The fourth `div` should have a `height` of `170` pixels and a `margin` of `2` pixels.

```js
const fourthDiv = document.querySelectorAll('div')[3];
assert.exists(fourthDiv); 
const height = window.getComputedStyle(fourthDiv)['height'];
const margin = window.getComputedStyle(fourthDiv)['margin-right'];
assert.strictEqual(height, '170px');
assert.strictEqual(margin, '2px');
```

The fifth `div` should have a `height` of `250` pixels and a `margin` of `2` pixels.

```js
const fifthDiv = document.querySelectorAll('div')[4];
assert.exists(fifthDiv); 
const height = window.getComputedStyle(fifthDiv)['height'];
const margin = window.getComputedStyle(fifthDiv)['margin-right'];
assert.strictEqual(height, '250px');
assert.strictEqual(margin, '2px');
```

The sixth `div` should have a `height` of `180` pixels and a `margin` of `2` pixels.

```js
const sixthDiv = document.querySelectorAll('div')[5];
assert.exists(sixthDiv); 
const height = window.getComputedStyle(sixthDiv)['height'];
const margin = window.getComputedStyle(sixthDiv)['margin-right'];
assert.strictEqual(height, '180px');
assert.strictEqual(margin, '2px');
```

The seventh `div` should have a `height` of `290` pixels and a `margin` of `2` pixels.

```js
const seventhDiv = document.querySelectorAll('div')[6];
assert.exists(seventhDiv); 
const height = window.getComputedStyle(seventhDiv)['height'];
const margin = window.getComputedStyle(seventhDiv)['margin-right'];
assert.strictEqual(height, '290px');
assert.strictEqual(margin, '2px');
```

The eighth `div` should have a `height` of `140` pixels and a `margin` of `2` pixels.

```js
const eighthDiv = document.querySelectorAll('div')[7];
assert.exists(eighthDiv); 
const height = window.getComputedStyle(eighthDiv)['height'];
const margin = window.getComputedStyle(eighthDiv)['margin-right'];
assert.strictEqual(height, '140px');
assert.strictEqual(margin, '2px');
```

The ninth `div` should have a `height` of `90` pixels and a `margin` of `2` pixels.

```js
const ninthDiv = document.querySelectorAll('div')[8];
assert.exists(ninthDiv); 
const height = window.getComputedStyle(ninthDiv)['height'];
const margin = window.getComputedStyle(ninthDiv)['margin-right'];
assert.strictEqual(height, '90px');
assert.strictEqual(margin, '2px');
```

# --seed--

## --seed-contents--

```html
<style>
  .bar {
    width: 25px;
    height: 100px;
    /* Add your code below this line */

    
    /* Add your code above this line */
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
      .style('height', d => d + 'px'); // Change this line
  </script>
</body>
```

# --solutions--

```html
<style>
  .bar {
    width: 25px;
    height: 100px;
    margin: 2px;
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
      .style('height', d => d * 10 + 'px');
  </script>
</body>
```
