---
id: 672bbec3b86dbdaa07a5a5be
title: What Are Examples of Functional Pseudo-classes?
challengeType: 11
videoId: eQwf6Y3N_kY
dashedName: what-are-examples-of-functional-pseudo-classes
---

# --description--

Watch the video or read the transcript and answer the questions below.

# --transcript--

What are examples of functional pseudo-classes?

Functional pseudo-classes allow you to select elements based on more complex conditions or relationships. Unlike regular pseudo-classes which target elements based on a state, for example, `:hover`, `:focus`, functional pseudo-classes accept arguments within parentheses, hence the name "functional pseudo-classes".

Examples of functional pseudo-classes are:

- `:is()`
- `:where()`
- `:has()`
- `:not()`

Let's take a deeper look at each of these functional pseudo-classes with examples.

The `:is()` pseudo-class is useful when you want to style a group of elements that share some, but not all, characteristics. For example, you might want to style different types of buttons on your website, including `button` elements, links styled as buttons, and `input` elements with types `submit` and `reset`. Here's an HTML example representing that:

```html
<button>Click Me</button>
<a href="#" class="button">Click Me Too</a>
<input type="submit" value="Submit" />
<input type="reset" value="Reset" />
```

Without the `:is()` function, you would have to write a complex selector like this:

```css
button,
a.button,
input[type='submit'],
input[type='reset'] {
  background-color: darkblue;
  color: white;
  border: 1px solid darkblue;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  font-size: 16px;
  text-align: center;
}

button:hover,
a.button:hover,
input[type='submit']:hover,
input[type='reset']:hover {
  background-color: lightblue;
  border-color: lightblue;
}
```

With the `:is()` function, you can write a more compact and understandable selector like this:

```css
:is(button, a.button, input[type='submit'], input[type='reset']) {
  background-color: darkblue;
  color: white;
  border: 1px solid darkblue;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  font-size: 16px;
  text-align: center;
}

:is(button, a.button, input[type='submit'], input[type='reset']):hover {
  background-color: blue;
  border-color: blue;
}
```

The `:where()` pseudo-class functions similarly to `:is()`, but it doesn't increase the specificity of your selectors. This makes it ideal for applying styles without affecting the specificity of other rules.

For example, you can use the `:where()` function to apply zero `margin` and `padding` to heading elements. This ensures that the reset won't interfere with more specific styles you might apply later. Here's the HTML for that:

```html
<h1>Page Title</h1>
<h2>Subtitle</h2>
<h3>A point</h3>
```

And this is the CSS:

```css
:where(h1, h2, h3) {
  margin: 0;
  padding: 0;
}
```

Styling a parent element based on its children's states was previously challenging until the `:has()` pseudo-class was introduced. It allows you to apply styles to a parent element based on the presence or state of its child elements.

For example, the CSS below will only apply to any `article` element that has an `h2` in it:

```css
article:has(h2) {
  border: 2px solid hotpink;
}
```

Here's the HTML for that:

```html
<article>
  <h2>Subheading</h2>
  <p>Lorem ipsum dolor sit amet.</p>
</article>

<article>
  <h3>A point</h3>
  <p>Lorem ipsum dolor sit amet.</p>
  <p>Lorem ipsum dolor sit amet.</p>
</article>
```

The `:not()` pseudo-class is ideal for situations where you want to apply styles to a group of elements, excluding one or more specific exceptions. In the CSS below, any button that is not a primary button will have a grey background:

```css
button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  border: none;
  color: white;
}

button.primary {
  background-color: deepskyblue;
}

button:not(.primary) {
  background-color: grey;
}
```

Here's the HTML for the buttons:

```html
<button class="primary">Primary Button</button>
<button class="secondary">Secondary Button</button>
<button class="danger">Another Secondary Button</button>
```

# --questions--

## --text--

Which pseudo-class works like `:is()`, but doesn't add any specificity to your selectors?

## --answers--

`:not()`

### --feedback--

This pseudo-class is great for applying broad, non-invasive styles.

---

`:has()`

### --feedback--

This pseudo-class is great for applying broad, non-invasive styles.

---

`:where()`

---

`:empty`

### --feedback--

This pseudo-class is great for applying broad, non-invasive styles.

## --video-solution--

3

## --text--

Which of these is not a functional pseudo-class?

## --answers--

`:is()`

### --feedback--

Functional pseudo-classes use parentheses and accept arguments inside them.

---

`:first-child`

### --feedback--

Functional pseudo-classes use parentheses and accept arguments inside them.

---

`:has()`

### --feedback--

Functional pseudo-classes use parentheses and accept arguments inside them.

---

`:where()`

### --feedback--

Functional pseudo-classes use parentheses and accept arguments inside them.

## --video-solution--

2

## --text--

Which pseudo-class is perfect for a situation in which you want to apply styles to a group of elements without one or two exceptions?

## --answers--

`:has()`

### --feedback--

Think about how you can exclude specific elements from being styled.

---

`:is()`

### --feedback--

Think about how you can exclude specific elements from being styled.

---

`:not()`

---

`:where()`

### --feedback--

Think about how you can exclude specific elements from being styled.

## --video-solution--

3
