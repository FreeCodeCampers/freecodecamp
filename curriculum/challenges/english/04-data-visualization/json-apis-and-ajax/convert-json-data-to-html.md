---
id: 587d7fae367417b2b2512be5
title: Convert JSON Data to HTML
challengeType: 6
forumTopicId: 16807
dashedName: convert-json-data-to-html
---

# --description--

Now that you're getting data from a JSON API, you can display it in the HTML.

You can use a `forEach` method to loop through the data since the cat photo objects are held in an array. As you get to each item, you can modify the HTML elements.

First, declare an html variable with `let html = "";`.

Then, loop through the JSON, adding HTML to the variable that wraps the key names in `strong` tags, followed by the value. When the loop is finished, you render it.

Here's the code that does this:

```js
let html = '';
json.forEach(function (val) {
  const keys = Object.keys(val);
  html += "<div class = 'cat'>";
  keys.forEach(function (key) {
    html += '<strong>' + key + '</strong>: ' + val[key] + '<br>';
  });
  html += '</div><br>';
});
```

**Note:** For this challenge, you need to add new HTML elements to the page, so you cannot rely on `textContent`. Instead, you need to use `innerHTML`, which can make a site vulnerable to cross-site scripting attacks.

# --instructions--

Add a `forEach` method to loop over the JSON data and create the HTML elements to display it.

Here is some example JSON:

```json
[
  {
    "id": 0,
    "imageLink": "https://cdn.freecodecamp.org/curriculum/legacy-json-apis-ajax/funny-cat.jpg",
    "altText": "A white cat wearing a green helmet shaped melon on its head. ",
    "codeNames": ["Juggernaut", "Mrs. Wallace", "Buttercup"]
  }
]
```

# --hints--

Your code should store the data in the `html` variable

```js
assert.match(__helpers.removeWhiteSpace(code), /html(\+=|=html\+)/g);
```

Your code should use a `forEach` method to loop over the JSON data from the API.

```js
assert.match(code, /json\.forEach/g);
```

Your code should wrap the key names in `strong` tags.

```js
assert.match(code, /<strong>.+<\/strong>/g);
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
        // Add your code below this line

        // Add your code above this line
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
        // Add your code below this line
        json.forEach(function (val) {
          var keys = Object.keys(val);
          html += "<div class = 'cat'>";
          keys.forEach(function (key) {
            html += '<strong>' + key + '</strong>: ' + val[key] + '<br>';
          });
          html += '</div><br>';
        });
        // Add your code above this line
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
