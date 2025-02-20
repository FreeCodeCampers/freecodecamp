---
title: Learn Lambda Functions by Building an Expense Tracker
block: learn-lambda-functions-by-building-an-expense-tracker
superBlock: scientific-computing-with-python
---

## Learn Lambda Functions by Building an Expense Tracker

Lambda functions in Python, also known as anonymous functions, are small, unnamed functions defined using the `lambda` keyword. They provide a concise way to write simple, throwaway functions directly in your code, typically for use in a single, short-lived context.

If you were to write a function that filters out odd numbers, the function would look like this:

```python
def is_even(x):
    return x % 2 == 0

numbers = [1, 2, 3, 4, 5, 6]
even_numbers = list(filter(is_even, numbers))
print(even_numbers)
# Output: [2, 4, 6]

```

However, if you were to write the same function using a lambda function, it would look like this:

```python
numbers = [1, 2, 3, 4, 5, 6]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)
# Output: [2, 4, 6]
```

Concise, right?

In this project, you'll explore the power of lambda functions by creating an expense tracker that allows you to add, list, total, and filter expenses by category. You'll see how the application leverages lambda functions to streamline certain operations, making the code more concise and easier to read.
