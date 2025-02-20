---
id: 672bbeb6eefd7ca9c003ea00
title: What Are Examples of Tree-structural Pseudo-classes?
challengeType: 11
videoId: 7lQACnY4opw
dashedName: what-are-examples-of-tree-structural-pseudo-classes
---

# --description--

Watch the video or read the transcript and answer the questions below.

# --transcript--

What are examples of tree-structural pseudo-classes?

Tree-structural pseudo-classes allow you to target and style elements based on their position within the document tree. The document tree refers to the hierarchical structure of elements in an HTML document.

Here is a list of tree-structural pseudo-classes:

- `:root`
- `:empty`
- `:nth-child(n)`
- `:nth-last-child(n)`
- `:first-child`
- `:last-child`
- `:only-child`
- `:nth-of-type`
- `:first-of-type`
- `:last-of-type`
- `:only-of-type`

Let's take a closer look at each of the tree-structural pseudo-classes, accompanied by examples.

​​The `:root` pseudo-class is usually the root `html` element. It helps you target the highest level in the document so you can apply a common style to the entire document.        

```css
:root {
  background: black;
  color: aliceblue;
}
```

The `:root` pseudo-class is also commonly used in setting CSS variables:

```css
:root {
  --main-font: 'Arial, sans-serif';
  --primary-color: blue; 
  --secondary-color: green; 
}
```

With CSS variables, you get to store values and reuse them in your stylesheet. You will learn more about these later on.

Empty elements, that is, elements with no children other than white space, are also included in the document tree. That's why there's an `:empty` pseudo-class to target empty elements. For example, this HTML code has two empty list items:

```html
<ul>
  <li>Item 1</li>
  <li></li> <!-- This list is empty -->
  <li>Item 2</li>
  <li></li> <!-- Another empty list -->
  <li>Item 3</li>
</ul>
```

With the `:empty` pseudo-class, you can style the empty list items differently:

```css
:empty {
  background: black;
}
```

The most practical thing to do with the empty list items is probably not displaying them at all:

```css
:empty {
  display: none;
}
```

`:nth-child(n)` allows you to select elements based on their position within a parent, while `:nth-last-child(n)` enables you to select elements by counting from the end. The `n` can be a specific number or a keyword like `odd` or `even`. This is incredibly useful in styling table cells based on position: even and odd.

Here's an HTML example of a fruit price list table:

```html
<table>
  <tr>
    <th>Item</th>
    <th>Price</th>
  </tr>
  <tr>
    <td>Apple</td>
    <td>$1.00</td>
  </tr>
  <tr>
    <td>Banana</td>
    <td>$0.50</td>
  </tr>
  <tr>
    <td>Orange</td>
    <td>$0.80</td>
  </tr>
</table>
```

Here's the CSS using the `:nth-child` pseudo-class to target the table cells based on odd and even positions:

```css
th,
td {
  border: 1px solid lightgray;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: orangered;
}

tr:nth-child(odd) {
  background-color: lightgreen;
}
```

The `:first-child`, `:last-child`, and `:only-child` pseudo-classes all act on items within a parent container or the entire document.

- `:first-child` selects the first element in a parent element or the document.
- `:last-child` selects the last element in a parent element or the document.
- `:only-child` selects the only element in a parent element or the document.

Using the `:first-child` and `:last-child` pseudo-classes will select both `Item 1` and `Item 3` in this HTML:

```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

Here's the CSS:

```css
li:first-child {
  background-color: orangered;
}

li:last-child {
  background-color: lightgreen;
}
```

If you have more unordered lists on the page, you have to be more specific with the selection: 

```css
ul li:first-child {
  background-color: orangered;
}

ul li:last-child {
  background-color: lightgreen;
}
```

To show you how the `:only-child` pseudo-class works, here's an HTML example with two separate `div` elements:

```html
<div class="container">
  <div>This is the only item in this container.</div>
</div>

<div class="container">
  <div>This is one of two items in this container.</div>
  <div>Here is the second item.</div>
</div>
```

Using the `:only-child` pseudo-class ensures only the `div` element with a single child is selected:

```css
.container div:only-child {
  border: 2px solid crimson;
  padding: 10px;
  background-color: lightblue;
}
```

The `:first-of-type` and `:last-of-type` pseudo-classes select the first and last occurrence of a specific element type within its parent. They are useful for applying unique styles to the first or last instance of that element type among its siblings.

In the HTML below, `:first-of-type` and `:last-of-type` applies to the first element and last element within the `section` element:

```html
<section>
  <h2>Introduction</h2>
  <p>This is the first paragraph in the first section</p>
  <p>This is the second paragraph in the first section</p>
</section>
<section>
  <h2>Details</h2>
  <p>This is the first paragraph in the second section.</p>
  <p>This is the second paragraph in the second section.</p>
</section>
```

Here's the CSS:

```css
section p:first-of-type {
  background-color: lightgreen;
}

section p:last-of-type {
  background-color:lightblue;
}
```

`:nth-of-type(n)` allows you to select a specific element within its parent based on its position among siblings of the same type. For instance, in the HTML below, `:nth-of-type(2)` targets the second element in the container:

```html
<div class="container">
  <p>First paragraph</p>
  <h2>First heading</h2>
  <p>Second paragraph</p>
  <p>Third paragraph</p>
  <h2>Second heading</h2>
</div>
```

Here's the CSS:

```css
p:nth-of-type(2) {
  color: red;
  font-weight: bold;
}
```

`:only-of-type` selects an element if it's the only one of its type within its parent. This can be useful for emphasizing single items or ensuring that they are styled differently when they’re not part of a group.

In the HTML below, there are two `div` elements with one having a single element:

```html
<div class="container">
  <p>The only paragraph</p>
</div>

<div class="container">
  <p>The first paragraph</p>
  <p>The second paragraph</p>
</div>
```

Here's the CSS that only applies to the first container:

```css
p:only-of-type {
  border: 4px solid green;
}
```

# --questions--

## --text--

What is the difference between the `:first-of-type` and `:last-of-type` pseudo-classes?

## --answers--

`:first-of-type` targets the first element of a specific type within its parent, while `:last-of-type` targets the last element of a different type.

### --feedback--

Consider how these pseudo-classes help you style the first and last instances of a particular tag, like `p` or `h1`.

---

`:first-of-type` and `:last-of-type` both target the first occurrence of an element but in different sections of the document.

### --feedback--

Consider how these pseudo-classes help you style the first and last instances of a particular tag, like `p` or `h1`.

---

`:first-of-type` selects the first occurrence of a specific element type within its parent, while `:last-of-type` selects the last occurrence of that same element type within its parent.

---

`:last-of-type` applies styles to the first and last elements within the document, while `:last-of-type` applies styles to all elements of a specific type.

### --feedback--

Consider how these pseudo-classes help you style the first and last instances of a particular tag, like `p` or `h1`.

## --video-solution--

3

## --text--

What is the difference between the `:first-child` and `:last-child` pseudo-classes?

## --answers--

`:first-child` targets the first element within its parent, while `:last-child` targets the last element within a different parent.

### --feedback--

Think about how the two pseudo-classes help you style the first and last elements within the same parent container.

---

`:first-child` targets the first element within its parent, while `:last-child` targets the last element within the same parent.

---

`:first-child` targets the first element of a specific type within its parent, while `:last-child` targets the last element of a different type within its parent.

### --feedback--

Think about how the two pseudo-classes help you style the first and last elements within the same parent container.

---

`:first-child` targets the first and last elements within a parent, while `:last-child` targets all other elements.

### --feedback--

Think about how the two pseudo-classes help you style the first and last elements within the same parent container.

## --video-solution--

2

## --text--

Which pseudo-class allows you to target elements that have no children, including those that contain only whitespace?

## --answers--

`:empty`

---

`:first-child`

### --feedback--

Think about how you can style elements that do not have content.

---

`:last-child`

### --feedback--

Think about how you can style elements that do not have content.

---

`:only-of-type`

### --feedback--

Think about how you can style elements that do not have content.

## --video-solution--

1
