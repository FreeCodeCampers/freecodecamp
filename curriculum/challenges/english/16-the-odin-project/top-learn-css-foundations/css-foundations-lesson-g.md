---
id: 63ee35450d8d4841c3a70920
title: CSS Foundations Lesson G
challengeType: 19
dashedName: css-foundations-lesson-g
---
# --description--

Internal CSS (or embedded CSS) involves adding the CSS within the HTML file itself instead of creating a completely separate file. With the internal method, you place all the rules inside of a pair of opening and closing `<style>` tags, which are then placed inside of the opening and closing `<head>` tags of your HTML file. Since the styles are being placed directly inside of the `<head>` tags, you no longer need a `<link>` element that the external method requires.

Besides these differences, the syntax is exactly the same as the external method (selector, curly braces, declarations):

```html
<head>
  <style>
    div {
      color: white;
      background-color: black;
    }

    p {
      color: red;
    }
  </style>
</head>
<body>...</body>
```

This method can be useful for adding unique styles to a single page of a website, but it doesn’t keep things separate like the external method, and depending on how many rules and declarations there are it can cause the HTML file to get pretty big.

# --questions--    

## --text--

Which of the following is a difference between internal and external CSS methods?

## --answers--

The external method places CSS rules in a separate file, while the internal method places CSS rules within the HTML file itself.

---

The internal method keeps CSS separate from HTML, while the external method embeds CSS directly in HTML.

---

The internal method uses `<link>` element to link CSS to HTML, while the external method embeds CSS directly in HTML.


## --video-solution--

1
