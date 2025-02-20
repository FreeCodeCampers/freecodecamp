---
id: 672bbeaa5afdc5a98d5ab8ff
title: What Are Examples of Location Pseudo-classes?
challengeType: 11
videoId: i-J4xVUGY5c
dashedName: what-are-examples-of-location-pseudo-classes
---

# --description--

Watch the video or read the transcript and answer the questions below.

# --transcript--

What are examples of location pseudo-classes?

Location pseudo-classes are used for styling links and elements that are targeted within the current document. They offer a way to apply styles based on whether a link is visited or whether an element is currently in focus.

Examples of location pseudo-classes are:

- `:link`
- `:visited`
- `:any-link`
- `:local-link`
- `:target`
- `:target-within`

Let's take a deeper look at each of these pseudo-classes.

The `:link` pseudo-class allows you to target all unvisited links on a webpage. You can use it to style links differently before the user clicks on them. For example, you might want to make all unvisited links blue or your website's primary color:

```css
a:link {
  color: magenta;
}
```

In this case, any link the user hasn't clicked yet will appear magenta. Once the user clicks the link, the `:link` style no longer applies, and the `:visited` pseudo-class takes over. The `:visited` pseudo-class comes into play after the user clicks the link, so you can use it to target links the user has already clicked. 

Here is an example of changing the visited link state to the color `purple`:

```css
a:visited {
  color: purple;
}
```

The `:visited` pseudo-class helps users distinguish between links they have visited and those they have not.

The `:any-link` pseudo-class is a combination of the `:link` and `:visited` pseudo-classes. So it matches any anchor element with an `href` attribute, regardless of whether it's visited or not.

Here is an example of changing the link color for the `:any-link` pseudo-class to `crimson`:

```css
a:any-link {
  color: crimson;
}
```

The `:local-link` pseudo-class targets links that point to the same document. It can be useful when you want to differentiate internal links from external ones. Currently, no browser supports the `:local-link` pseudo-class.

The `:target` pseudo-class selects an element that matches the current URL fragment identifier, for example, `#section1`. It's very useful for pages with in-page navigation.

Here's an HTML example that represents an in-page navigation:

```html
<nav id="table-of-contents">
  <ul>
    <li><a href="#section1">Introduction</a></li>
    <li><a href="#section2">Features</a></li>
  </ul>
</nav>

<section id="section1">
  <h2>Introduction</h2>
  <p>This is the introduction section.</p>
</section>

<section id="section2">
  <h2>Features</h2>
  <p>This section describes the features.</p>
</section>
```

Here's the CSS that uses the `:target` pseudo-class to style the section that matches where the user navigates to:

```css
section:target {
  background-color: green;
  border: 2px solid green;
  padding: 10px;
}
```

When the user clicks on one of the navigation links, the background color for that respective section will change to green.

# --questions--

## --text--

Which pseudo-class allows you to style an element that matches the current URL fragment identifier, such as `#section1`?

## --answers--

`:hover`

### --feedback--

Think about how you can highlight a specific section when navigating through in-page links.

---

`:focus`

### --feedback--

Think about how you can highlight a specific section when navigating through in-page links.

---

`:target`

---

`:checked`

### --feedback--

Think about how you can highlight a specific section when navigating through in-page links.

## --video-solution--

3

## --text--

When are location pseudo-classes particularly useful?

## --answers--

When styling elements based on their sibling relationships.

### --feedback--

Think about how you can style links and targeted elements depending on user interaction.

---

When applying styles based on whether a link is visited or an element is currently in focus.

---

When styling elements based on their parent element's attributes.

### --feedback--

Think about how you can style links and targeted elements depending on user interaction.

---

When adjusting the layout of a webpage dynamically.

### --feedback--

Think about how you can style links and targeted elements depending on user interaction.

## --video-solution--

2

## --text--

Which pseudo-class is designed to target links that point to the same document but is not currently supported by any browser?

## --answers--

`:any-link`

### --feedback--

Consider the pseudo-class intended for distinguishing internal links from external ones, even though it's not yet supported.

---

`:local-link`

---

`:visited`

### --feedback--

Consider the pseudo-class intended for distinguishing internal links from external ones, even though it's not yet supported.

---

`:target`

### --feedback--

Consider the pseudo-class intended for distinguishing internal links from external ones, even though it's not yet supported.

## --video-solution--

2
