---
id: 587d7faf367417b2b2512be9
title: Post Data with the JavaScript XMLHttpRequest Method
challengeType: 6
forumTopicId: 301504
dashedName: post-data-with-the-javascript-xmlhttprequest-method
---

# --description--

In the previous examples, you received data from an external resource. You can also send data to an external resource, as long as that resource supports AJAX requests and you know the URL.

JavaScript's `XMLHttpRequest` method is also used to post data to a server. Here's an example:

```js
const xhr = new XMLHttpRequest();
xhr.open('POST', url, true);
xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 201) {
    const serverResponse = JSON.parse(xhr.response);
    document.getElementsByClassName('message')[0].textContent =
      serverResponse.userName + serverResponse.suffix;
  }
};
const body = JSON.stringify({ userName: userName, suffix: ' loves cats!' });
xhr.send(body);
```

You've seen several of these methods before. Here the `open` method initializes the request as a `POST` to the given URL of the external resource, and passes `true` as the third parameter - indicating to perform the operation asynchronously.

The `setRequestHeader` method sets the value of an HTTP request header, which contains information about the sender and the request. It must be called after the `open` method, but before the `send` method. The two parameters are the name of the header and the value to set as the body of that header.

Next, the `onreadystatechange` event listener handles a change in the state of the request. A `readyState` of `4` means the operation is complete, and a `status` of `201` means it was a successful request. Therefore, the document's HTML can be updated.

Finally, the `send` method sends the request with the `body` value. The `body` consists of a `userName` and a `suffix` key.

# --instructions--

Update the code so it makes a `POST` request to the API endpoint. Then type your name in the input field and click `Send Message`. Your AJAX function should replace `Reply from Server will be here.` with data from the server. Format the response to display your name appended with the text ` loves cats`.

# --hints--

Your code should create a new `XMLHttpRequest`.

```js
assert.match(code, /new\s+?XMLHttpRequest\(\s*?\)/g);
```

Your code should use the `open` method to initialize a `POST` request to the server.

```js
assert.match(code, /\.open\(\s*?('|")POST\1\s*?,\s*?url\s*?,\s*?true\s*?\)/g);
```

Your code should use the `setRequestHeader` method.

```js
assert.match(
  code,
  /\.setRequestHeader\(\s*?('|")Content-Type\1\s*?,\s*?('|")application\/json;\s*charset=UTF-8\2\s*?\)/g
);
```

Your code should have an `onreadystatechange` event handler set to a function.

```js
assert.match(code, /\.onreadystatechange\s*?=/g);
```

Your code should get the element with class `message` and change its `textContent` to `userName loves cats`

```js
assert.match(
  code,
  /document\.getElementsByClassName\(\s*?('|")message\1\s*?\)\[0\]\.textContent\s*?=\s*?.+?\.userName\s*?\+\s*?.+?\.suffix/g
);
```

Your code should use the `send` method.

```js
assert.match(code, /\.send\(\s*?body\s*?\)/g);
```

# --seed--

## --seed-contents--

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sendMessage').onclick = function () {
      const userName = document.getElementById('name').value;
      const url = 'https://jsonplaceholder.typicode.com/posts';
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

<h1>Cat Friends</h1>
<p class="message box">Reply from Server will be here</p>
<p>
  <label for="name"
    >Your name:
    <input type="text" id="name" />
  </label>
  <button id="sendMessage">Send Message</button>
</p>
```

# --solutions--

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sendMessage').onclick = function () {
      const userName = document.getElementById('name').value;
      const url = 'https://jsonplaceholder.typicode.com/posts';
      // Add your code below this line
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 201) {
          const serverResponse = JSON.parse(xhr.response);
          document.getElementsByClassName('message')[0].textContent =
            serverResponse.userName + serverResponse.suffix;
        }
      };
      const body = JSON.stringify({
        userName: userName,
        suffix: ' loves cats!'
      });
      xhr.send(body);
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

<h1>Cat Friends</h1>
<p class="message">Reply from Server will be here</p>
<p>
  <label for="name"
    >Your name:
    <input type="text" id="name" />
  </label>
  <button id="sendMessage">Send Message</button>
</p>
```
