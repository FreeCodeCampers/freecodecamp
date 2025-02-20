---
id: 672bccc8ea33bad87abb3c56
title: What Is the Difference Between content-box and border-box?
challengeType: 11
videoId: eKqNs2XXG14
dashedName: what-is-the-difference-between-content-box-and-border-box
---

# --description--

Watch the video or read the transcript and answer the questions below.

# --transcript--

What is the difference between `content-box` and `border-box` in CSS?

The `box-sizing` property can be set to either `content-box` or `border-box` to control how the width and height of elements are calculated. Here you can see the `box-sizing` property and the two possible values. 

```css
  box-sizing: content-box;
```

```css
  box-sizing: border-box;
```

This property is usually set on the root element HTML to apply to all the elements within the document. Here you can see how `border-box` is applied to all the elements within the HTML element.

```css
  html {
    box-sizing: border-box;
  }
```

The value of the `box-sizing` property is `content-box` by default, but you can choose `border-box` if you need to. We will explore `content-box` first and then we will go into `border-box`.

To understand how this models work, you need to be familiar with the four core concepts from the CSS box model. Let's review them quickly. The content area is the space occupied by the element's content. The padding is the space between the content area and the border. The border is the outline that sorrounds the content area and the padding. The margin is the space outside the border that separates the element from other elements.

In the `content-box` model, the width and height that you set for an element determines the dimensions of the content area but they don't include the padding, border or margin. You should use content box when you need to have precise control over the dimensions of the content area. So, when you set the width and height of an element with `width` and `height` properties, you are only setting the dimensions of the content area. Width is the width of the content, height is the height of the content. 

To find the total width of the element, what you will really see on the screen, you will still need to add the left and right padding, and the left and right borders. So, the total width equals the total width plus the padding left, plus padding right, plus border left, plus border right. 

Likewise, the total height of an element can be found by adding the content height, the top and bottom border padding, and the top and bottom borders. So, the total height equals the content height plus padding top, plus padding bottom, plus border top, plus border bottom. 

For example, here we have a CSS type selector for all the `div` elements. 

```css
div {
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 4px solid black;
}
```

In this case, if `content-box` is used the content area will have a width of 300 pixels and a height of 200 pixels. However, the total width, what you will see on the screen, will be the result of adding the width of the content area which is 300 pixels, plus the padding on both sides 40 pixels, and the borders on both sides 8 pixels. 

Likewise, the total height will be the result of adding the height of the content area 200 pixels, plus the top and bottom padding 40 pixels, plus the top and bottom borders 8 pixels.

Great! Now let's explore `border-box`. They are a bit different, with `border-box` the width and height of an element include the content area, the padding, and the border, but they don't include the margin. You should use `border-box` when you need to keep a fixed element size regardless of changes in padding or borders. It's also helpful for responsive web design since the content area will adjust automatically to fit the dimensions.

The padding and border are inside the box, so when you set the width and height properties of an element, you're really setting the width and height of the inner part of the box. Here's our `div` example with the same properties and values that we had before. 

```css
div {
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 4px solid black;
}
```

With `border-box` the value of the `width` property will be the result of adding the width of the content area, the left and right padding, and the left and right border. So, the width equals the width of the content,plus the left padding, plus the right padding, plus the left border, plus the right border.

Likewise, the value of the `height` property is the result of adding the height of the content area, the top and bottom padding, and the top and bottom border. Height equals the height of the content, plus top padding, plus bottom padding, plus top border, plus bottom border. The margin is not included in the width or height.

If you check the size of the div in the browser using the `content-box` and `border-box` you will notice that there's a very important difference. These are the two divs in HTML:

```html
<div id="red-div"></div>
<div id="blue-div"></div>
```

We assign them `IDs` to select them individually in CSS. These are the CSS rules for the red div and the blue div:

```css
#red-div {
  box-sizing: content-box;
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 4px solid black;
  margin: 10px;
  background-color: red;
}

#blue-div {
  box-sizing: border-box;
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 4px solid black;
  margin: 10px;
  background-color: blue;
}
```

You can see that they both have the same `width`, `height`, `border` and `margin`. The only differences are the colors and the value of the `box-sizing` property. This small difference has a very important impact on the final dimensions. 

Choosing between `content-box` and `border-box` really depends on the specific needs of your project. While `border-box` is becoming increasingly popular for its simplicity and flexibility, understanding both models is important for implementing effective CSS layouts.

# --questions--

## --text--

Which of the following is the default value for the `box-sizing` property in most browsers?

## --answers--

`content-box`

---

`border-box`

### --feedback--

Think about the default behavior for element sizing.

---

`padding-box`

### --feedback--

Think about the default behavior for element sizing.

---

`margin-box`

### --feedback--

Think about the default behavior for element sizing.

## --video-solution--

1

## --text--

What is the primary advantage of using `border-box` for creating responsive layouts?

## --answers--

It makes the calculations more complicated.

### --feedback--

Think about how the `border-box` model handles `padding` and `border` within the specified `width` and `height`.

---

It allows for more precise control over element dimensions.

### --feedback--

Think about how the `border-box` model handles `padding` and `border` within the specified `width` and `height`.

---

It ensures that elements maintain their specified dimensions regardless of changes in `padding` or `border`.

---

It improves browser compatibility.

### --feedback--

Think about how the `border-box` model handles `padding` and `border` within the specified `width` and `height`.

## --video-solution--

3

## --text--

In the `content-box` model, what does the specified `width` of an element represent?

## --answers--

The total `width` of the element, including `padding`, `border`, and `margin`.

### --feedback--

Think about the relationship between the content area and the overall element dimensions in the `content-box` model.

---

The `width` of the content area only.

---

The `width` of the `border`.

### --feedback--

Think about the relationship between the content area and the overall element dimensions in the `content-box` model.

---

The `width` of the `padding`.

### --feedback--

Think about the relationship between the content area and the overall element dimensions in the `content-box` model.

## --video-solution--

2
