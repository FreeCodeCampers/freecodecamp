---
id: 63ee354c0d8d4841c3a70921
title: CSS Foundations Lesson H
challengeType: 19
dashedName: css-foundations-lesson-h
---
# --description--

Inline `CSS` makes it possible to add styles directly to `HTML` elements, though this method isn’t as recommended:

```html
<body>
  <div style="color: white; background-color: black;">...</div>
</body>
```

The first thing to note is that there aren't any selectors here, since the styles are being added directly to the opening `<div>` tag itself. Next, you have the `style` attribute, with its value within the pair of quotation marks being the declarations.

If you need to add a unique style for a single element, this method can work just fine. Generally, though, this isn’t exactly a recommended way for adding CSS to HTML for a few reasons:

It can quickly become pretty messy once you start adding a lot of declarations to a single element, causing your HTML file to become unnecessarily bloated.
If you want many elements to have the same style, you would have to copy + paste the same style to each individual element, causing lots of unnecessary repetition and more bloat.
Any inline CSS will override the other two methods, which can cause unexpected results. (While you won’t dive into it here, this can actually be taken advantage of).

# --questions--    

## --text--

Which of the following is the main disadvantage of using inline CSS?

## --answers--

It can quickly become pretty messy once you start adding a lot of declarations to a single element, causing your HTML file to become unnecessarily bloated.

---

It requires using selectors, which can be complicated for beginners.

---

Any inline CSS will override the other two methods (internal and external), which can cause unexpected results.


## --video-solution--

3
