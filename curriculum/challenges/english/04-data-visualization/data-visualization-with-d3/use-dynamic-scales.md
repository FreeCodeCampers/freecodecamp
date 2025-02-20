---
id: 587d7fac367417b2b2512bdd
title: Use Dynamic Scales
challengeType: 6
forumTopicId: 301495
dashedName: use-dynamic-scales
---

# --description--

The D3 `min()` and `max()` methods are useful to help set the scale.

Given a complex data set, one priority is to set the scale so the visualization fits the SVG container's width and height. You want all the data plotted inside the SVG so it's visible on the web page.

The example below sets the x-axis scale for scatter plot data. The `domain()` method passes information to the scale about the raw data values for the plot. The `range()` method gives it information about the actual space on the web page for the visualization.

In the example, the domain goes from 0 to the maximum in the set. It uses the `max()` method with a callback function based on the x values in the arrays. The range uses the SVG's width (`w`), but it includes some padding, too. This puts space between the scatter plot dots and the edge of the SVG.

```js
const dataset = [
  [34, 78],
  [109, 280],
  [310, 120],
  [79, 411],
  [420, 220],
  [233, 145],
  [333, 96],
  [222, 333],
  [78, 320],
  [21, 123]
];
const w = 500;
const h = 500;

const padding = 30;
const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset, d => d[0])])
  .range([padding, w - padding]);
```

The padding may be confusing at first. Picture the x-axis as a horizontal line from 0 to 500 (the width value for the SVG). Including the padding in the `range()` method forces the plot to start at 30 along that line (instead of 0), and end at 470 (instead of 500).

# --instructions--

Use the `yScale` variable to create a linear y-axis scale. The domain should start at zero and go to the maximum `y` value in the set. The range should use the SVG height (`h`) and include padding.

**Note:** Remember to keep the plot right-side-up. When you set the range for the y coordinates, the higher value (height minus padding) is the first argument, and the lower value is the second argument.

# --hints--

The text in the `h2` should be `30`.

```js
assert.strictEqual(output, 30);
assert.strictEqual(document.querySelector('h2')?.textContent, '30');
```

The `domain()` of yScale should be equivalent to `[0, 411]`.

```js
assert.deepEqual(yScale.domain(), [0, 411]);
```

The `range()` of yScale should be equivalent to `[470, 30]`.

```js
assert.deepEqual(yScale.range(), [470, 30]);
```

# --seed--

## --seed-contents--

```html
<body>
  <script>
    const dataset = [
      [34, 78],
      [109, 280],
      [310, 120],
      [79, 411],
      [420, 220],
      [233, 145],
      [333, 96],
      [222, 333],
      [78, 320],
      [21, 123]
    ];

    const w = 500;
    const h = 500;

    // Padding between the SVG boundary and the plot
    const padding = 30;

    // Create an x and y scale

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[0])])
      .range([padding, w - padding]);

    // Add your code below this line

    const yScale = undefined;


    // Add your code above this line

    const output = yScale(411); // Returns 30
    d3.select('body').append('h2').text(output);
  </script>
</body>
```

# --solutions--

```html
<body>
  <script>
    const dataset = [
      [34, 78],
      [109, 280],
      [310, 120],
      [79, 411],
      [420, 220],
      [233, 145],
      [333, 96],
      [222, 333],
      [78, 320],
      [21, 123]
    ];

    const w = 500;
    const h = 500;

    const padding = 30;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[0])])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([h - padding, padding]);

    const output = yScale(411);
    d3.select('body').append('h2').text(output);
  </script>
</body>
```
