---
id: 63ee35370d8d4841c3a7091e
title: CSS Foundations Lesson E
challengeType: 19
dashedName: css-foundations-lesson-e
---
# --description--

Combinators allow us to combine multiple selectors differently than either grouping or chaining them, as they show a relationship between the selectors. There are four types of combinators in total, but for right now we’re going to only show you the descendant combinator, which is represented in CSS by a single space between selectors. A descendant combinator will only cause elements that match the last selector to be selected if they also have an ancestor (parent, grandparent, etc) that matches the previous selector.

So something like `.ancestor .child` would select an element with the class `child` if it has an ancestor with the class `ancestor`. Another way to think of it is child will only be selected if it is nested inside of `ancestor`, no matter how deep. Take a quick look at the example below and see if you can tell which elements would be selected based on the CSS rule provided:

```html
<!-- index.html -->

<div class="ancestor"> <!-- A -->
  <div class="contents"> <!-- B -->
    <div class="contents"> <!-- C -->
    </div>
  </div>
</div>

<div class="contents"></div> <!-- D -->
```

```css
/* styles.css */

.ancestor .contents {
  /* some declarations */
}
```

In the above example, the first two elements with the `contents` class (`B` and `C`) would be selected, but that last element (`D`) won’t be. Was your guess correct?

There’s really no limit to how many combinators you can add to a rule, so `.one .two .three .four` would be totally valid. This would just select an element that has a class of `four` if it has an ancestor with a class of `three`, and if that ancestor has its own ancestor with a class of `two`, and so on. You generally want to avoid trying to select elements that need this level of nesting, though, as it can get pretty confusing and long, and it can cause issues when it comes to specificity.

# --questions--    

## --text--

What does the descendant combinator do?

## --answers--

It groups certain classes together which share the same declarations.

---

It gives the ability to select an element that shares the same `class` and `id`.

---

It allows you to select an element based on its relationship with its ancestor (parent, grandparent, and so on).


## --video-solution--

3
