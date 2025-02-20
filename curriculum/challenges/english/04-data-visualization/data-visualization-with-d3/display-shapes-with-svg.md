---
id: 587d7fa8367417b2b2512bcc
title: Display Shapes with SVG
challengeType: 6
forumTopicId: 301485
dashedName: display-shapes-with-svg
---

# --description--

The last challenge created an `svg` element with a given width and height, which was visible because it had a `background-color` applied to it in the `style` tag. The code made space for the given width and height.

The next step is to create a shape to put in the `svg` area. There are a number of supported shapes in SVG, such as rectangles and circles. They are used to display data. For example, a rectangle (`<rect>`) SVG shape could create a bar in a bar chart.

When you place a shape into the `svg` area, you can specify where it goes with `x` and `y` coordinates. The origin point of (0, 0) is in the upper-left corner. Positive values for `x` push the shape to the right, and positive values for `y` push the shape down from the origin point.

To place a shape in the middle of the 500 (width) x 100 (height) `svg` from last challenge, the `x` coordinate would be 250 and the `y` coordinate would be 50.

An SVG `rect` has four attributes. There are the `x` and `y` coordinates for where it is placed in the `svg` area. It also has a `height` and `width` to specify the size.

# --instructions--

Add a `rect` shape to the `svg` using `append()`, and give it a `width` attribute of `25` and `height` attribute of `100`. Also, give the `rect` `x` and `y` attributes each set to `0`.

# --hints--

Your document should have 1 `rect` element.

```js
assert.lengthOf(document.querySelectorAll('rect'), 1);
```

The `rect` element should have a `width` attribute set to `25`.

```js
assert.strictEqual(document.querySelector('rect')?.getAttribute('width'), '25');
```

The `rect` element should have a `height` attribute set to `100`.

```js
assert.strictEqual(
  document.querySelector('rect')?.getAttribute('height'),
  '100'
);
```

The `rect` element should have an `x` attribute set to `0`.

```js
assert.strictEqual(document.querySelector('rect')?.getAttribute('x'), '0');
```

The `rect` element should have a `y` attribute set to `0`.

```js
assert.strictEqual(document.querySelector('rect')?.getAttribute('y'), '0');
```

# --seed--

## --seed-contents--

```html
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
    // Add your code below this line



    // Add your code above this line
  </script>
</body>
```

# --solutions--

```html
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

    const w = 500;
    const h = 100;

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('rect')
      .attr('width', 25)
      .attr('height', 100)
      .attr('x', 0)
      .attr('y', 0);
  </script>
</body>
```
