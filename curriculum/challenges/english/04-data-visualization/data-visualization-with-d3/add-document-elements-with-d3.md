---
id: 587d7fa6367417b2b2512bc2
title: Add Document Elements with D3
challengeType: 6
forumTopicId: 301474
dashedName: add-document-elements-with-d3
---

# --description--

D3 has several methods that let you add and change elements in your document.

The `select()` method selects one element from the document. It takes an argument for the name of the element you want and returns an HTML node for the first element in the document that matches the name. Here's an example:

```js
const anchor = d3.select('a');
```

The above example finds the first anchor tag on the page and saves an HTML node for it in the variable `anchor`. You can use the selection with other methods. The `d3` part of the example is a reference to the D3 object, which is how you access D3 methods.

Two other useful methods are `append()` and `text()`.

The `append()` method takes an argument for the element you want to add to the document. It appends an HTML node to a selected item, and returns a handle to that node.

The `text()` method either sets the text of the selected node, or gets the current text. To set the value, you pass a string as an argument inside the parentheses of the method.

Here's an example that selects an unordered list, appends a list item, and adds text:

```js
d3.select('ul')?.append('li').text('Very important item');
```

D3 allows you to chain several methods together with periods to perform a number of actions in a row.

# --instructions--

Use the `select` method to select the `body` tag in the document. Then `append` an `h1` tag to it, and add the text `Learning D3` into the `h1` element.

# --hints--

The `body` should have one `h1` element.

```js
const body = document.querySelector('body');
const headers = body?.querySelectorAll('h1');
assert.lengthOf(headers, 1);
```

The `h1` element should have the text `Learning D3` in it.

```js
assert.strictEqual(document.querySelector('h1')?.textContent, 'Learning D3');
```

Your code should access the `d3` object.

```js
assert.match(code, /d3/g);
```

Your code should use the `select` method.

```js
assert.match(code, /\.select/g);
```

Your code should use the `append` method.

```js
assert.match(code, /\.append/g);
```

Your code should use the `text` method.

```js
assert.match(code, /\.text/g);
```

# --seed--

## --seed-contents--

```html
<body>
  <script>
    // Add your code below this line



    // Add your code above this line
  </script>
</body>
```

# --solutions--

```html
<body>
  <script>
    d3.select('body').append('h1').text('Learning D3');
  </script>
</body>
```
