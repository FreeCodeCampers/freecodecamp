---
id: 587d7fa7367417b2b2512bc8
title: Add Classes with D3
challengeType: 6
forumTopicId: 301473
dashedName: add-classes-with-d3
---

# --description--

Using a lot of inline styles on HTML elements gets hard to manage, even for smaller apps. It's easier to add a class to elements and style that class one time using CSS rules. D3 has the `attr()` method to add any HTML attribute to an element, including a class name.

The `attr()` method works the same way that `style()` does. It takes comma-separated values, and can use a callback function. Here's an example to add a class of `container` to a selection:

```js
selection.attr('class', 'container');
```

Note that the `class` parameter will remain the same whenever you need to add a class and only the `container` parameter will change.

# --instructions--

Add the `attr()` method to the code in the editor and put a class of `bar` on the `div` elements.

# --hints--

Your `div` elements should have a class of `bar`.

```js
assert.isTrue(document.querySelector('div')?.classList.contains('bar'));
```

Your code should use the `attr()` method.

```js
assert.match(code, /\.attr/g);
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

    d3.select('body')?.selectAll('div').data(dataset).enter().append('div');
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
      // Add your code below this line
      .attr('class', 'bar');
    // Add your code above this line
  </script>
</body>
```
