---
id: 66edc25ae5ea80bf6f785552
title: JavaScript Variables and Data Types Quiz
challengeType: 8
dashedName: quiz-javascript-variables-and-data-types
---

# --description--

To pass the quiz, you must correctly answer at least 18 of the 20 questions below.

# --quizzes--

## --quiz--

### --question--

#### --text--

Which of the following best describes JavaScript?

#### --distractors--

A markup language used to design websites.

---

A server-side programming language.

---

A database management system.

#### --answer--

A programming language used for web development.

### --question--

#### --text--

Which of the following is NOT a JavaScript data type?

#### --distractors--

`Number`

---

`Undefined`

---

`Object`

#### --answer--

`Double`

### --question--

#### --text--

Which of the following is NOT a valid JavaScript variable declaration?

#### --distractors--

`const x = 0;`

---

`let x;`

---

`var x;`

#### --answer--

`public Int x;`

### --question--

#### --text--

Which of the following is a common naming convention for variables in JavaScript?

#### --distractors--

JavaScript case.

---

Lightning case.

---

Giraffe case.

#### --answer--

Camel case.

### --question--

#### --text--

What is the difference between `let` and `const` variable declarations in JavaScript?

#### --distractors--

`const` cannot be re-assigned nor re-declared. `let` can be re-assigned and re-declared.

---

`const` can be re-assigned and re-declared. `let` cannot be re-assigned nor re-declared.

---

`const` can be re-assigned but not re-declared. `let` can be re-declared, but not re-assigned.

#### --answer--

`const` cannot be re-assigned or re-declared. `let` can be re-assigned, but not re-declared.

### --question--

#### --text--

Why are strings considered immutable in JavaScript?

#### --distractors--

You cannot create strings using variables.

---

Strings can only be created using literals.

---

You can change strings, but only through global variables.

#### --answer--

Once a string is created, you cannot change its characters directly.

### --question--

#### --text--

How would you print out the string `Hello, world!` in the console in JavaScript?

#### --distractors--

`print("Hello, world!")`

---

`alert("Hello, world");`

---

`System.out.println("Hello, world!");`

#### --answer--

`console.log("Hello, world!");`

### --question--

#### --text--

What does the code below do?

```js
let hello = "Hello";
hello += " world";
console.log(hello);
```

#### --distractors--

Reassigns `" world"` to the variable `hello`, and prints it out in the console.

---

Prints out the number of characters in `Hello world` in the console.

---

Combines `"Hello"` and `" world"` into a new string and prints it, but the value of `hello` remains `"Hello"`.

#### --answer--

Combines the current value of `hello` with the string `" world"`, reassigns it to `hello`, and prints it to the console.

### --question--

#### --text--

Which JavaScript character is used to mark the end of a statement?

#### --distractors--

`:`

---

`,`

---

`.`

#### --answer--

`;`

### --question--

#### --text--

Which of the following is a valid single line comment syntax in JavaScript?

#### --distractors--

`# This is a single line comment`

---

`-- This is a single line comment`

---

`/* This is a single line comment */`

#### --answer--

`// This is a single line comment`

### --question--

#### --text--

Dynamic typing in JavaScript means that:

#### --distractors--

You need to declare the data type of a variable before using it.

---

You cannot assign a value of one data type to a variable of a different type.

---

JavaScript performs type checking before execution, meaning type related errors will be thrown before the code is run.

#### --answer--

JavaScript infers the type based on the value assigned to the variable.

### --question--

#### --text--

Which of the following prints out the type of the variable `x` in the console?

#### --distractors--

`console.log(x.type);`

---

`console.log(typeOf(x));`

---

`console.log(isNaN(x));`

#### --answer--

`console.log(typeof x);`

### --question--

#### --text--

What will be the output of `console.log(typeof null);`?

#### --distractors--

`"undefined"`

---

`"null"`

---

`"NaN"`

#### --answer--

`"object"`

### --question--

#### --text--

Which of the following is a valid multi-line comment in JavaScript?

#### --distractors--

```js
// This is a
// multi-line
// comment
```

---

```py
'''
This is a
multi-line
comment
'''
```

---

```html
<!--
This is a
multi-line
comment
-->
```

#### --answer--

```js
/*
This is a
multi-line
comment
*/
```

### --question--

#### --text--

Which of the following declares a variable in JavaScript that cannot be changed?

#### --distractors--

`var x = 0;`

---

`let x = 0;`

---

`final x = 0;`

#### --answer--

`const x = 0;`

### --question--

#### --text--

Which of the following is a valid variable name in JavaScript?

#### --distractors--

`tart@n`

---

`4cats`

---

`!!dogs`

#### --answer--

`$number`

### --question--

#### --text--

Which of the following is NOT a valid string concatenation method in JavaScript?

#### --distractors--

`console.log(string1 + " " + string2);`

---

`console.log("string1 " + string2);`

---

`console.log(string1.concat(" ", string2));`

#### --answer--

`console.log(string1 string2);`

### --question--

#### --text--

Which of the following variable names uses camel case correctly?

#### --distractors--

`a_long_variable_name`

---

`alongvariableName`

---

`ALongVariableName`

#### --answer--

`aLongVariableName`

### --question--

#### --text--

Why is it beneficial to use semicolons explicitly even though JavaScript has Automatic Semicolon Insertion?

#### --distractors--

To increase the execution speed of the code.

---

To maintain consistency with other programming languages.

---

To allow for better debugging and error tracing.

#### --answer--

To improve code readability and reliability.

### --question--

#### --text--

Which of the following is NOT a JavaScript data type?

#### --distractors--

`Symbol`

---

`Boolean`

---

`Null`

#### --answer--

`Float`
