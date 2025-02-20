---
id: 587d7fa7367417b2b2512bc5
title: Work with Dynamic Data in D3
challengeType: 6
forumTopicId: 301498
dashedName: work-with-dynamic-data-in-d3
---

# --description--

The last two challenges cover the basics of displaying data dynamically with D3 using the `data()` and `enter()` methods. These methods take a data set and, together with the `append()` method, create a new DOM element for each entry in the data set.

In the previous challenge, you created a new `h2` element for each item in the `dataset` array, but they all contained the same text, `New Title`. This is because you have not made use of the data that is bound to each of the `h2` elements.

The D3 `text()` method can take a string or a callback function as an argument:

```js
selection.text(d => d);
```

In the example above, the parameter `d` refers to a single entry in the dataset that a selection is bound to.

Using the current example as context, the first `h2` element is bound to 12, the second `h2` element is bound to 31, the third `h2` element is bound to 22, and so on.

# --instructions--

Change the `text()` method so that each `h2` element displays the corresponding value from the `dataset` array with a single space and the string `USD`. For example, the first heading should be `12 USD`.

# --hints--

The first `h2` should have the text `12 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[0]?.textContent, '12 USD');
```

The second `h2` should have the text `31 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[1]?.textContent, '31 USD');
```

The third `h2` should have the text `22 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[2]?.textContent, '22 USD');
```

The fourth `h2` should have the text `17 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[3]?.textContent, '17 USD');
```

The fifth `h2` should have the text `25 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[4]?.textContent, '25 USD');
```

The sixth `h2` should have the text `18 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[5]?.textContent, '18 USD');
```

The seventh `h2` should have the text `29 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[6]?.textContent, '29 USD');
```

The eighth `h2` should have the text `14 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[7]?.textContent, '14 USD');
```

The ninth `h2` should have the text `9 USD`.

```js
assert.strictEqual(document.querySelectorAll('h2')[8]?.textContent, '9 USD');
```

# --seed--

## --seed-contents--

```html
<body>
  <script>
    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

    d3.select('body')
      .selectAll('h2')
      .data(dataset)
      .enter()
      .append('h2')
      // Add your code below this line

      .text('New Title');

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
      .text(d => `${d} USD`);
  </script>
</body>
```
