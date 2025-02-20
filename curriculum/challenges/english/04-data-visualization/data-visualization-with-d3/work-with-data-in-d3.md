---
id: 587d7fa7367417b2b2512bc4
title: Work with Data in D3
challengeType: 6
forumTopicId: 301497
dashedName: work-with-data-in-d3
---

# --description--

The D3 library focuses on a data-driven approach. When you have a set of data, you can apply D3 methods to display it on the page. Data comes in many formats, but this challenge uses a simple array of numbers.

The first step is to make D3 aware of the data. The `data()` method is used on a selection of DOM elements to attach the data to those elements. The data set is passed as an argument to the method.

A common workflow pattern is to create a new element in the document for each piece of data in the set. D3 has the `enter()` method for this purpose.

When `enter()` is combined with the `data()` method, it looks at the selected elements from the page and compares them to the number of data items in the set. If there are fewer elements than data items, it creates the missing elements.

Here is an example that selects a `ul` element and creates a new list item based on the number of entries in the array:

```html
<body>
  <ul></ul>
  <script>
    const dataset = ['a', 'b', 'c'];
    d3.select('ul')
      .selectAll('li')
      .data(dataset)
      .enter()
      .append('li')
      .text('New item');
  </script>
</body>
```

It may seem confusing to select elements that don't exist yet. This code is telling D3 to first select the `ul` on the page. Next, select all list items, which returns an empty selection. Then the `data()` method reviews the dataset and runs the following code three times, once for each item in the array. The `enter()` method sees there are no `li` elements on the page, but it needs 3 (one for each piece of data in `dataset`). New `li` elements are appended to the `ul` and have the text `New item`.

# --instructions--

Select the `body` node, then select all `h2` elements. Have D3 create and append an `h2` tag for each item in the `dataset` array. The text in the `h2` should say `New Title`. Your code should use the `data()` and `enter()` methods.

# --hints--

Your document should have 9 `h2` elements.

```js
assert.lengthOf(document.querySelectorAll('h2'), 9);
```

The text in the `h2` elements should say `New Title`. The capitalization and spacing should match exactly.

```js
const h2Elements = document.querySelectorAll('h2');
for (let i = 0; i < h2Elements.length; i++) {
  assert.match(h2Elements[i]?.textContent, /New Title/g);
}
```

Your code should use the `data()` method.

```js
assert.match(code, /\.data/g);
```

Your code should use the `enter()` method.

```js
assert.match(code, /\.enter/g);
```

# --seed--

## --seed-contents--

```html
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

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

    d3.select('body')
      .selectAll('h2')
      .data(dataset)
      .enter()
      .append('h2')
      .text('New Title');
  </script>
</body>
```
