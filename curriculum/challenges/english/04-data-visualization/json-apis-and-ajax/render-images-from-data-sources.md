---
id: 587d7fae367417b2b2512be6
title: Render Images from Data Sources
challengeType: 6
forumTopicId: 18265
dashedName: render-images-from-data-sources
---

# --description--

The last few challenges showed that each object in the JSON array contains an `imageLink` key with a value that is the URL of a cat's image.

When you're looping through these objects, you can use this `imageLink` property to display this image in an `img` element.

Here's the code that does this:

```js
html += "<img src = '" + val.imageLink + "' " + "alt='" + val.altText + "'>";
```

# --instructions--

Add code to use the `imageLink` and `altText` properties in an `img` tag.

# --hints--

You should use the `imageLink` property to display the images.

```js
assert.match(code, /val\.imageLink/g);
```

You should use the `altText` for the `alt` attribute values of the images.

```js
assert.match(code, /val\.altText/g);
```

# --seed--

## --seed-contents--

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getMessage').onclick = function () {
      const req = new XMLHttpRequest();
      req.open('GET', '/json/cats.json', true);
      req.send();
      req.onload = function () {
        const json = JSON.parse(req.responseText);
        let html = '';
        json.forEach(function (val) {
          html += "<div class = 'cat'>";
          // Add your code below this line

          // Add your code above this line
          html += '</div><br>';
        });
        document.getElementsByClassName('message')[0].innerHTML = html;
      };
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
      const req = new XMLHttpRequest();
      req.open('GET', '/json/cats.json', true);
      req.send();
      req.onload = function () {
        const json = JSON.parse(req.responseText);
        let html = '';
        json.forEach(function (val) {
          html += "<div class = 'cat'>";
          // Add your code below this line
          html +=
            "<img src = '" +
            val.imageLink +
            "' " +
            "alt='" +
            val.altText +
            "'>";
          // Add your code above this line
          html += '</div><br>';
        });
        document.getElementsByClassName('message')[0].innerHTML = html;
      };
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
