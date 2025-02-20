---
id: 587d7fad367417b2b2512bdf
title: Add Axes to a Visualization
challengeType: 6
forumTopicId: 301472
dashedName: add-axes-to-a-visualization
---

# --description--

Another way to improve the scatter plot is to add an x-axis and a y-axis.

D3 has two methods, `axisLeft()` and `axisBottom()`, to render the y-axis and x-axis, respectively. Here's an example to create the x-axis based on the `xScale` in the previous challenges:

```js
const xAxis = d3.axisBottom(xScale);
```

The next step is to render the axis on the SVG. To do so, you can use a general SVG component, the `g` element. The `g` stands for group. Unlike `rect`, `circle`, and `text`, an axis is just a straight line when it's rendered. Because it is a simple shape, using `g` works. The last step is to apply a `transform` attribute to position the axis on the SVG in the right place. Otherwise, the line would render along the border of the SVG and wouldn't be visible. SVG supports different types of `transforms`, but positioning an axis needs `translate`. When it's applied to the `g` element, it moves the whole group over and down by the given amounts. Here's an example:

```js
const xAxis = d3.axisBottom(xScale);

svg
  .append('g')
  .attr('transform', 'translate(0, ' + (h - padding) + ')')
  .call(xAxis);
```

The above code places the x-axis at the bottom of the SVG. Then it's passed as an argument to the `call()` method. The y-axis works in the same way, except the `translate` argument is in the form `(x, 0)`. Because `translate` is a string in the `attr()` method above, you can use concatenation to include variable values for its arguments.

# --instructions--

The scatter plot now has an x-axis. Create a y-axis in a variable named `yAxis` using the `axisLeft()` method. Then render the axis using a `g` element. Make sure to use a `transform` attribute to translate the axis by the amount of padding units right, and `0` units down. Remember to `call()` the axis.

# --hints--

Your code should use the `axisLeft()` method with `yScale` passed as the argument.

```js
assert.match(code, /\.axisLeft\(yScale\)/g);
```

The y-axis `g` element should have a `transform` attribute to translate the axis by `(60, 0)`.

```js
const yAxis = document.querySelectorAll('g')[10];
assert.match(yAxis?.getAttribute('transform'), /translate\(60\s*?,\s*?0\)/g);
```

Your code should call the `yAxis`.

```js
assert.match(code, /\.call\(\s*yAxis\s*\)/g);
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
    const padding = 60;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[0])])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([h - padding, padding]);

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(d[1]))
      .attr('r', d => 5);

    svg
      .selectAll('text')
      .data(dataset)
      .enter()
      .append('text')
      .text(d => d[0] + ',' + d[1])
      .attr('x', d => xScale(d[0] + 10))
      .attr('y', d => yScale(d[1]));

    const xAxis = d3.axisBottom(xScale);
    // Add your code below this line
    const yAxis = undefined;
    // Add your code above this line

    svg
      .append('g')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis);

    // Add your code below this line



    // Add your code above this line
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
    const padding = 60;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[0])])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([h - padding, padding]);

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(d[1]))
      .attr('r', d => 5);

    svg
      .selectAll('text')
      .data(dataset)
      .enter()
      .append('text')
      .text(d => d[0] + ',' + d[1])
      .attr('x', d => xScale(d[0] + 10))
      .attr('y', d => yScale(d[1]));

    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis);
  </script>
</body>
```
