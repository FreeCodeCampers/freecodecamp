---
id: 587d7faa367417b2b2512bd6
title: Add a Tooltip to a D3 Element
challengeType: 6
forumTopicId: 301470
dashedName: add-a-tooltip-to-a-d3-element
---

# --description--

A tooltip shows more information about an item on a page when the user hovers over that item. There are several ways to add a tooltip to a visualization. This challenge uses the SVG `title` element.

`title` pairs with the `text()` method to dynamically add data to the bars.

# --instructions--

Append a `title` element under each `rect` node. Then call the `text()` method with a callback function so the text displays the data value.

# --hints--

Your code should have 9 `title` elements.

```js
assert.lengthOf(document.querySelectorAll('title'), 9);
```

The first `title` element should have tooltip text of `12`.

```js
assert.strictEqual(document.querySelectorAll('title')[0]?.textContent, '12');
```

The second `title` element should have tooltip text of `31`.

```js
assert.strictEqual(document.querySelectorAll('title')[1]?.textContent, '31');
```

The third `title` element should have tooltip text of `22`.

```js
assert.strictEqual(document.querySelectorAll('title')[2]?.textContent, '22');
```

The fourth `title` element should have tooltip text of `17`.

```js
assert.strictEqual(document.querySelectorAll('title')[3]?.textContent, '17');
```

The fifth `title` element should have tooltip text of `25`.

```js
assert.strictEqual(document.querySelectorAll('title')[4]?.textContent, '25');
```

The sixth `title` element should have tooltip text of `18`.

```js
assert.strictEqual(document.querySelectorAll('title')[5]?.textContent, '18');
```

The seventh `title` element should have tooltip text of `29`.

```js
assert.strictEqual(document.querySelectorAll('title')[6]?.textContent, '29');
```

The eighth `title` element should have tooltip text of `14`.

```js
assert.strictEqual(document.querySelectorAll('title')[7]?.textContent, '14');
```

The ninth `title` element should have tooltip text of `9`.

```js
assert.strictEqual(document.querySelectorAll('title')[8]?.textContent, '9');
```

# --seed--

## --seed-contents--

```html
<style>
  .bar:hover {
    fill: brown;
  }
</style>
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

    const w = 500;
    const h = 100;

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 30)
      .attr('y', (d, i) => h - 3 * d)
      .attr('width', 25)
      .attr('height', (d, i) => d * 3)
      .attr('fill', 'navy')
      .attr('class', 'bar');
    // Add your code below this line



    // Add your code above this line

    svg
      .selectAll('text')
      .data(dataset)
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', (d, i) => i * 30)
      .attr('y', (d, i) => h - (d * 3 + 3));
  </script>
</body>
```

# --solutions--

```html
<style>
  .bar:hover {
    fill: brown;
  }
</style>
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

    const w = 500;
    const h = 100;

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 30)
      .attr('y', (d, i) => h - 3 * d)
      .attr('width', 25)
      .attr('height', (d, i) => d * 3)
      .attr('fill', 'navy')
      .attr('class', 'bar')
      .append('title')
      .text(d => d);

    svg
      .selectAll('text')
      .data(dataset)
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', (d, i) => i * 30)
      .attr('y', (d, i) => h - (d * 3 + 3));
  </script>
</body>
```
