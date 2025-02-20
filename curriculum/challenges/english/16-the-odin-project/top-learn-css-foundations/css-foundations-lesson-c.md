---
id: 63ee352b0d8d4841c3a7091c
title: CSS Foundations Lesson C
challengeType: 19
dashedName: css-foundations-lesson-c
---
# --description--

What if you have two groups of elements that share some of their style declarations?

```css
.read {
  color: white;
  background-color: black;
  /* several unique declarations */
}

.unread {
  color: white;
  background-color: black;
  /* several unique declarations */
}
```

Both our `.read` and `.unread` selectors share the `color: white;` and `background-color: black;` declarations, but otherwise have several of their own unique declarations. To cut down on the repetition, you can group these two selectors together as a comma-separated list:

```css
.read,
.unread {
  color: white;
  background-color: black;
}

.read {
  /* several unique declarations */
}

.unread {
  /* several unique declarations */
}
```

Both of the examples above (with and without grouping) will have the same result, but the second example reduces the repetition of declarations and makes it easier to edit either the `color` or `background-color` for both classes at once.

# --questions--    

## --text--

How would you apply a single rule to two different selectors, `.red-box` and `.yellow-box`?

## --answers--

```css
.red-box,
.yellow-box {
  width: 25px;
  height: 25px;
}
```

---

```css
.red-box {
  width: 25px;
  height: 25px;
}

.yellow-box {
  width: 25px;
  height: 25px;
}
```

---

```css
.red-box { 
  width: 25px;
  .yellow-box {
    height: 25px;
  }
}
```

## --video-solution--

1
