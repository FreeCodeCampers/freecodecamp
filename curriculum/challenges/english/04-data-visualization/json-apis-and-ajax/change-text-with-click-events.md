---
id: 587d7fad367417b2b2512be2
title: Change Text with click Events
challengeType: 6
forumTopicId: 301500
dashedName: change-text-with-click-events
---

# --description--

When the click event happens, you can use JavaScript to update an HTML element.

For example, when a user clicks the `Get Message` button, it changes the text of the element with the class `message` to say `Here is the message`.

This works by adding the following code within the click event:

```js
document.getElementsByClassName('message')[0].textContent =
  'Here is the message';
```

# --instructions--

Add code inside the `onclick` event handler to change the text inside the `message` element to say `Here is the message`.

# --hints--

Your code should use the `document.getElementsByClassName` method to select the element with class `message` and set its `textContent` to the given string.

```js
assert.match(
  code,
  /document\s*\.getElementsByClassName\(\s*?('|")message\1\s*?\)\[0\]\s*\.textContent\s*?=\s*?('|")Here is the message\2/g
);
```

# --seed--

## --seed-contents--

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getMessage').onclick = function () {
      // Add your code below this line
      // Add your code above this line
    };
  });
</script>

<style>
  body {
    text-align: center;
    font-family: 'Helvetica', sans-serif;
  }
  h1 {
    font-size: 2em;
    font-weight: bold;
  }
  .box {
    border-radius: 5px;
    background-color: #eee;
    padding: 20px 5px;
  }
  button {
    color: white;
    background-color: #4791d0;
    border-radius: 5px;
    border: 1px solid #4791d0;
    padding: 5px 10px 8px 10px;
  }
  button:hover {
    background-color: #0f5897;
    border: 1px solid #0f5897;
  }
</style>

<h1>Cat Photo Finder</h1>
<p class="message box">The message will go here</p>
<p>
  <button id="getMessage">Get Message</button>
</p>
```

# --solutions--

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getMessage').onclick = function () {
      // Add your code below this line
      document.getElementsByClassName('message')[0].textContent =
        'Here is the message';
      // Add your code above this line
    };
  });
</script>

<style>
  body {
    text-align: center;
    font-family: 'Helvetica', sans-serif;
  }
  h1 {
    font-size: 2em;
    font-weight: bold;
  }
  .box {
    border-radius: 5px;
    background-color: #eee;
    padding: 20px 5px;
  }
  button {
    color: white;
    background-color: #4791d0;
    border-radius: 5px;
    border: 1px solid #4791d0;
    padding: 5px 10px 8px 10px;
  }
  button:hover {
    background-color: #0f5897;
    border: 1px solid #0f5897;
  }
</style>

<h1>Cat Photo Finder</h1>
<p class="message">The message will go here</p>
<p>
  <button id="getMessage">Get Message</button>
</p>
```
