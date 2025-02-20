---
id: 587d7fae367417b2b2512be7
title: Pre-filter JSON to Get the Data You Need
challengeType: 6
forumTopicId: 18257
dashedName: pre-filter-json-to-get-the-data-you-need
---

# --description--

If you don't want to render every cat photo you get from the freeCodeCamp Cat Photo API, you can pre-filter the JSON before looping through it.

Given that the JSON data is stored in an array, you can use the `filter` method to filter out the cat whose `id` key has a value of `1`.

Here's the code to do this:

```js
json = json.filter(function (val) {
  return val.id !== 1;
});
```

# --instructions--

Add code to `filter` the json data to remove the cat with the `id` value of `1`.

# --hints--

Your code should use the `filter` method.

```js
assert.match(code, /json\.filter/g);
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
        let json = JSON.parse(req.responseText);
        let html = '';
        // Add your code below this line

        // Add your code above this line
        json.forEach(function (val) {
          html += "<div class = 'cat'>";

          html +=
            "<img src = '" +
            val.imageLink +
            "' " +
            "alt='" +
            val.altText +
            "'>";

          html += '</div>';
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
        let json = JSON.parse(req.responseText);
        let html = '';
        // Add your code below this line
        json = json.filter(function (val) {
          return val.id !== 1;
        });

        // Add your code above this line
        json.forEach(function (val) {
          html += "<div class = 'cat'>";

          html +=
            "<img src = '" +
            val.imageLink +
            "' " +
            "alt='" +
            val.altText +
            "'>";

          html += '</div>';
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
