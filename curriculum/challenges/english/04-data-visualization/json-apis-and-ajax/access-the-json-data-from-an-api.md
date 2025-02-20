---
id: 587d7fae367417b2b2512be4
title: Access the JSON Data from an API
challengeType: 6
forumTopicId: 301499
dashedName: access-the-json-data-from-an-api
---

# --description--

In the previous challenge, you saw how to get JSON data from the freeCodeCamp Cat Photo API.

Now you'll take a closer look at the returned data to better understand the JSON format. Recall some notation in JavaScript:

<blockquote>[ ] -> Square brackets represent an array.<br>{ } -> Curly brackets represent an object.<br>" " -> Double quotes represent a string. They are also used for key names in JSON.</blockquote>

Understanding the structure of the data that an API returns is important because it influences how you retrieve the values you need.

On the right, click the `Get Message` button to load the freeCodeCamp Cat Photo API JSON into the HTML.

The first and last character you see in the JSON data are square brackets `[ ]`. This means that the returned data is an array. The second character in the JSON data is a curly `{` bracket, which starts an object. Looking closely, you can see that there are three separate objects. The JSON data is an array of three objects, where each object contains information about a cat photo.

You learned earlier that objects contain "key-value pairs" that are separated by commas. In the Cat Photo example, the first object has `"id":0` where `id` is a key and `0` is its corresponding value. Similarly, there are keys for `imageLink`, `altText`, and `codeNames`. Each cat photo object has these same keys, but with different values.

Another interesting "key-value pair" in the first object is `"codeNames":["Juggernaut","Mrs. Wallace","ButterCup"]`. Here `codeNames` is the key and its value is an array of three strings. It's possible to have arrays of objects as well as a key with an array as a value.

Remember how to access data in arrays and objects. Arrays use bracket notation to access a specific index of an item. Objects use either bracket or dot notation to access the value of a given property. Here's an example that prints the `altText` property of the first cat photo - note that the parsed JSON data in the editor is saved in a variable called `json`:

```js
console.log(json[0].altText);
```

The console would display the string `A white cat wearing a green helmet shaped melon on its head.`.

# --instructions--

For the cat with the `id` of 2, print to the console the second value in the `codeNames` array. You should use bracket and dot notation on the object (which is saved in the variable `json`) to access the value.

# --hints--

Your code should use bracket and dot notation to access the proper code name, and print `Loki` to the console.

```js
assert.match(
  code,
  /console\s*\.\s*log\s*\(\s*json\s*\[2\]\s*(\.\s*codeNames|\[\s*('|`|")codeNames\2\s*\])\s*\[\s*1\s*\]\s*\)/g
);
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
        document.getElementsByClassName('message')[0].innerHTML =
          JSON.stringify(json);
        // Add your code below this line

        // Add your code above this line
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
        document.getElementsByClassName('message')[0].innerHTML =
          JSON.stringify(json);
        // Add your code below this line
        console.log(json[2].codeNames[1]);
        // Add your code above this line
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
