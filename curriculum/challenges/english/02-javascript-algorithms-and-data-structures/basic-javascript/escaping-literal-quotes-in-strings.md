---
id: 56533eb9ac21ba0edf2244b5
title: Escaping Literal Quotes in Strings
challengeType: 1
forumTopicId: 17568
dashedName: escaping-literal-quotes-in-strings
---

# --description--

When you are defining a string you must start and end with a single or double quote. What happens when you need a literal quote: `"` or `'` inside of your string?

In JavaScript, you can <dfn>escape</dfn> a quote from considering it as an end of string quote by placing a <dfn>backslash</dfn> (`\`) in front of the quote.

```js
const sampleStr = "Alan said, \"Peter is learning JavaScript\".";
```

This signals to JavaScript that the following quote is not the end of the string, but should instead appear inside the string. So if you were to print this to the console, you would get:

```js
Alan said, "Peter is learning JavaScript".
```

# --instructions--

Use <dfn>backslashes</dfn> to assign a string to the `myStr` variable so that if you were to print it to the console, you would see:

```js
I am a "double quoted" string inside "double quotes".
```

# --hints--

You should use two double quotes (`"`) and four escaped double quotes (`\"`).

```js
assert(__helpers.removeJSComments(code).match(/\\"/g).length === 4 && __helpers.removeJSComments(code).match(/[^\\]"/g).length === 2);
```

Variable `myStr` should contain the string: `I am a "double quoted" string inside "double quotes".`

```js
assert(/I am a "double quoted" string inside "double quotes(\."|"\.)$/.test(myStr));
```

# --seed--

## --after-user-code--

```js
(function(){
  if(typeof myStr === 'string') {
    console.log("myStr = \"" + myStr + "\"");
  } else {
    console.log("myStr is undefined");
  }
})();
```

## --seed-contents--

```js
const myStr = ""; // Change this line
```

# --solutions--

```js
const myStr = "I am a \"double quoted\" string inside \"double quotes\".";
```
