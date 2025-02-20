---
id: 63ee35240d8d4841c3a7091b
title: CSS Foundations Lesson B
challengeType: 19
dashedName: css-foundations-lesson-b
---
# --description--

Class selectors will select all elements with the given `class`, which is just an attribute you place on an HTML element. Here’s how you add a class to an HTML tag and select it in CSS:

```html
<!-- index.html -->

<div class="alert-text">
  Please agree to our terms of service.
</div>
```

```css
/* styles.css */

.alert-text {
  color: red;
}
```

Note the syntax for `class` selectors: a period immediately followed by the case-sensitive value of the class attribute. Classes aren’t required to be unique, so you can use the same `class` on as many elements as you want.

Another thing you can do with the `class` attribute is to add multiple classes to a single element as a space-separated list, such as `class="alert-text severe-alert"`. Since whitespace is used to separate `class` names like this, you should never use spaces for multi-worded names and should use a hyphen instead.

## ID Selectors
ID selectors are similar to `class` selectors. They select an element with the given `id`, which is another attribute you place on an HTML element:

```html
<!-- index.html -->

<div id="title">My Awesome 90's Page</div>
```

```css
/* styles.css */

#title {
  background-color: red;
}
```

Instead of a period, you use a hashtag immediately followed by the case-sensitive value of the `id` attribute. A common pitfall is people overusing the `id` attribute when they don’t necessarily need to, and when classes will suffice. While there are cases where using an `id` makes sense or is needed, such as taking advantage of specificity or having links redirect to a section on the current page, you should use `id`s sparingly (if at all).

The major difference between classes and IDs is that an element can only have one `id`. An `id` cannot be repeated on a single page, and the `id` attribute should not contain any whitespace at all.

# --questions--    

## --text--

What is the syntax for class and ID selectors?

## --answers--

To select a `class` you use `$` and to select an `id` you use `#`

---

To select a `class` you use `.` and to select an `id` you use `*`

---

To select a `class` you use `.` and to select an `id` you use `#`


## --video-solution--

3
