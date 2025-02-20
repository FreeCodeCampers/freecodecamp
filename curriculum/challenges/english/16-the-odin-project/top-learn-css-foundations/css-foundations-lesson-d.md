---
id: 63ee35300d8d4841c3a7091d
title: CSS Foundations Lesson D
challengeType: 19
dashedName: css-foundations-lesson-d
---
# --description--

Another way to use selectors is to chain them as a list without any separation. Let’s say you had the following HTML:

```html
<div>
  <div class="subsection header">Latest Posts</div>
  <p class="subsection preview">This is where a preview for a post might go.</p>
</div>
```

You have two elements with the `subsection` class that have some sort of unique styles, but what if you only want to apply a separate rule to the element that also has `header` as a second class? Well, you could chain both the `class` selectors together in your CSS like so:

```css
.subsection.header {
  color: red;
}
```

What `.subsection.header` does is it selects any element that has both the `subsection` and `header` classes. Notice how there isn’t any space between the `.subsection` and `.header` `class` selectors. This syntax basically works for chaining any combination of selectors, except for chaining more than one type selector.

This can also be used to chain a class and an ID, as shown below:

```html
<div>
  <div class="subsection header">Latest Posts</div>
  <p class="subsection" id="preview">This is where a preview for a post might go.</p>
</div>
```

You can take the two elements above and combine them with the following:

```css
.subsection.header {
  color: red;
}

.subsection#preview {
  color: blue;
}
```

In general, you can’t chain more than one type selector since an element can’t be two different types at once. For example, chaining two type selectors like `div` and `p` would give us the selector `divp`, which wouldn’t work since the selector would try to find a literal `<divp>` element, which doesn’t exist.

# --questions--    

## --text--

Given an element that has an `id` of `title` and a `class` of `primary`, how would you use both attributes for a single rule?

## --answers--

```css
.title.primary {
  ...
}
```

---

```css
.title > primary {
  ...
}
```

---

```css
#title.primary { 
  ...
}
```


## --video-solution--

3
