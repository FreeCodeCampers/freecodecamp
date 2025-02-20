---
id: 672bccae6e556cd81cef6af2
title: What Is Margin Collapsing, and How Does It Work?
challengeType: 11
videoId: MMWBC8duT_0
dashedName: what-is-margin-collapsing
---

# --description--

Watch the video or read the transcript and answer the questions below.

# --transcript--

What is margin collapsing, and how does it work?

Margin collapsing is a fundamental concept in CSS that often confuses newcomers to web development.

This behavior occurs when the vertical margins of adjacent elements overlap, resulting in a single margin equal to the larger of the two.

Understanding margin collapsing is important for precise control over spacing and layout in web design. So, let's get into how margin collapsing works and explore some common scenarios where it occurs.

In CSS when two vertical margins come into contact with each other they'll collapse, this means that instead of adding together the larger margin wins and determines the space between the elements. This behavior applies only to vertical margins top and bottom and not horizontal margins, not the left and right. So, here's an example to illustrate this concept:

```html
<style>
  .box1 {
    margin-bottom: 20px;
    background-color: lightblue;
  }
  .box2 {
    margin-top: 30px;
    background-color: lightgreen;
  }
</style>

<div class="box1">Box 1</div>
<div class="box2">Box 2</div>
```

In this example, you might expect the total space between box one and box two to be 50 pixels, 20 pixels plus 30 pixels. However, due to margin collapsing the actual space will be 30 pixels which is the larger of the two margins.

As we saw in the previous examples, margins of the adjacent sibling elements will collapse. This is the most straight forward case of margin collapsing. Let's explore more cases where margin collapsing can occur. 

Margins can also collapse between a parent element and its first or last child. If there's no border, padding, inline content, or clearance to separate the parent's margin from the child's, they will collapse.

```html
<style>
  .parent {
    margin-top: 40px;
    background-color: lightyellow;
  }
  .child {
    margin-top: 30px;
    background-color: lightpink;
  }
</style>

<div class="parent">
  <div class="child">Child element</div>
</div>
```

In this case you might expect the child to be 70 pixels from the top, 40 pixels plus 30 pixels. However, the margins collapse and the larger margin 40 pixels is used.

If an element has no content, padding, or border, its top and bottom margins can collapse into a single margin. 

```html
<style>
  .empty-block {
    margin-top: 20px;
    margin-bottom: 10px;
    height: 0;
  }
  .next-block {
    background-color: lightgray;
  }
</style>

<div class="empty-block"></div>
<div class="next-block">Next block</div>
```

In this example the empty blocks top and bottom margins collapse into a single 30 pixels margin the larger of the two.

Here's another example of preventing collapse using padding. 

```html
<style>
  .parent {
    margin-top: 40px;
    padding-top: 1px;
    background-color: lightyellow;
  }
  .child {
    margin-top: 30px;
    background-color: lightpink;
  }
</style>

<div class="parent">
  <div class="child">Child element</div>
</div>
```

In this case the one pixel padding on the parent prevents the margin from collapsing resulting in a total space of 71 pixels from the top of the parent to the top of the child content.

Understanding margin collapsing is important for precise control over spacing in CSS. While it can sometimes lead to unexpected results, it's a feature designed to create more aesthetic and consistent spacing in documents. By knowing when margin collapsing occurs and how to prevent it when necessary, you can create more predictable and maintainable layouts in your web designs.

# --questions--

## --text--

In which direction does margin collapsing occur?

## --answers--

Horizontal margins only.

### --feedback--

Think about which margins (top, bottom, left, right) are affected by this behavior.

---

Vertical margins only.

---

Both horizontal and vertical margins.

### --feedback--

Think about which margins (top, bottom, left, right) are affected by this behavior.

---

Diagonal margins.

### --feedback--

Think about which margins (top, bottom, left, right) are affected by this behavior.

## --video-solution--

2

## --text--

What happens when two adjacent elements have different margin values?

## --answers--

The margins add up.

### --feedback--

Consider which margin "wins" when collapsing occurs.

---

The smaller margin is used.

### --feedback--

Consider which margin "wins" when collapsing occurs.

---

The larger margin is used.

---

The average of the two margins is used.

### --feedback--

Consider which margin "wins" when collapsing occurs.

## --video-solution--

3

## --text--

Which of the following will NOT prevent margin collapsing between a parent and its first child?

## --answers--

Adding a `border` to the parent.

### --feedback--

Think about which properties create a separation between the parent and child margins.

---

Setting `padding-top: 1px;` on the parent.

### --feedback--

Think about which properties create a separation between the parent and child margins.

---

Using `display: inline-block;` on the child.

### --feedback--

Think about which properties create a separation between the parent and child margins.

---

Setting `margin-top: 0;` on the child.

## --video-solution--

4
