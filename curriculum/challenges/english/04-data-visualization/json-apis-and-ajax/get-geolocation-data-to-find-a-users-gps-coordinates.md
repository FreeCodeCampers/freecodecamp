---
id: 587d7faf367417b2b2512be8
title: Get Geolocation Data to Find A User's GPS Coordinates
challengeType: 6
forumTopicId: 18188
dashedName: get-geolocation-data-to-find-a-users-gps-coordinates
---

# --description--

Another cool thing you can do is access your user's current location. Every browser has a built in navigator that can give you this information.

The navigator will get the user's current longitude and latitude.

You will see a prompt to allow or block this site from knowing your current location. The challenge can be completed either way, as long as the code is correct.

By selecting allow, you will see the text on the output phone change to your latitude and longitude.

Here's code that does this:

```js
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    document.getElementById('data').innerHTML =
      'latitude: ' +
      position.coords.latitude +
      '<br>longitude: ' +
      position.coords.longitude;
  });
}
```

First, it checks if the `navigator.geolocation` object exists. If it does, the `getCurrentPosition` method on that object is called, which initiates an asynchronous request for the user's position. If the request is successful, the callback function in the method runs. This function accesses the `position` object's values for latitude and longitude using dot notation and updates the HTML.

# --instructions--

Add the example code inside the `script` tags to check a user's current location and insert it into the HTML.

# --hints--

Your code should use `navigator.geolocation` to access the user's current location.

```js
assert.match(code, /navigator\.geolocation\.getCurrentPosition/g);
```

Your code should use `position.coords.latitude` to display the user's latitudinal location.

```js
assert.match(code, /position\.coords\.latitude/g);
```

Your code should use `position.coords.longitude` to display the user's longitudinal location.

```js
assert.match(code, /position\.coords\.longitude/g);
```

You should display the user's position within the `div` element with `id="data"`.

```js
assert.match(
  code,
  /document\.getElementById\(\s*?('|")data\1\s*?\)\.innerHTML/g
);
```

# --seed--

## --seed-contents--

```html
<script>
  // Add your code below this line

  // Add your code above this line
</script>
<h4>You are here:</h4>
<div id="data"></div>
```

# --solutions--

```html
<script>
  // Add your code below this line
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      document.getElementById('data').innerHTML = "latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude;
    });
  }
  // Add your code above this line
</script>
<h4>You are here:</h4>
<div id="data">

</div>

</section>
```
