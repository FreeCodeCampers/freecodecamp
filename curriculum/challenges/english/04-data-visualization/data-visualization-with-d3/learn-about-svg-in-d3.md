---
id: 587d7fa8367417b2b2512bcb
title: Learn About SVG in D3
challengeType: 6
forumTopicId: 301489
dashedName: learn-about-svg-in-d3
---

# --description--

<dfn>SVG</dfn> stands for <dfn>Scalable Vector Graphics</dfn>.

Here "scalable" means that, if you zoom in or out on an object, it would not appear pixelated. It scales with the display system, whether it's on a small mobile screen or a large TV monitor.

SVG is used to make common geometric shapes. Since D3 maps data into a visual representation, it uses SVG to create the shapes for the visualization. SVG shapes for a web page must go within an HTML `svg` tag.

CSS can be scalable when styles use relative units (such as `vh`, `vw`, or percentages), but using SVG is more flexible to build data visualizations.

# --instructions--

Add an `svg` node to the `body` using `append()`. Give it a `width` attribute set to the provided `w` constant and a `height` attribute set to the provided `h` constant using the `attr()` or `style()` methods for each. You'll see it in the output because there's a `background-color` of pink applied to it in the `style` tag.

**Note:** When using `attr()` width and height attributes do not have units. This is the building block of scaling - the element will always have a 5:1 width to height ratio, no matter what the zoom level is.

# --hints--

Your document should have 1 `svg` element.

```js
assert.lengthOf(document.querySelectorAll('svg'), 1);
```

The `svg` element should have a `width` attribute set to `500` or styled to have a width of `500px`.

```js
const svg = document.querySelector('svg');
assert.exists(svg); 
const width = window.getComputedStyle(svg)['width'];
assert.isTrue(svg?.getAttribute('width') === '500' || width === '500px');
```

The `svg` element should have a `height` attribute set to `100` or styled to have a height of `100px`.

```js
const svg = document.querySelector('svg');
assert.exists(svg); 
const height = window.getComputedStyle(svg)['height'];
assert.isTrue(svg?.getAttribute('height') === '100' || height === '100px');
```

# --seed--

## --seed-contents--

```html
<style>
  svg {
    background-color: pink;
  }
</style>
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

    const w = 500;
    const h = 100;

    const svg = d3.select('body');
    // Add your code below this line



    // Add your code above this line
  </script>
</body>
```

# --solutions--

```html
<style>
  svg {
    background-color: pink;
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
  </script>
</body>
```
