# The Structure of a TypeScript Error

Understanding TypeScript errors can be extremely tough. They have a reputation for having complicated wording, and can be extraordinarily long. Let's take this example:

```
Type '() => { something: { excellent: string; awesome: boolean; }; }' is not assignable to type 'ExampleFunction'.
  Call signature return types '{ something: { excellent: string; awesome: boolean; }; }' and '{ something: { excellent: string; awesome: number; }; }' are incompatible.
    The types of 'something.awesome' are incompatible between these types.
      Type 'boolean' is not assignable to type 'number'.
```

Here's the code that's causing this error:

```ts
type ExampleFunction = () => {
  something: {
    excellent: string
    awesome: number
  }
}

const exampleFunc: ExampleFunction = () => {
  //  ^^^^^^^^^^^ Error here!
  return {
    something: {
      excellent: 'str',
      awesome: true,
    },
  }
}
```

You might be able to see immediately what's causing the error - but let's keep the suspense a little longer. If you can understand _why_ TypeScript throws this strange-looking error, you'll feel much more confident when the next one comes along.

What's happening here is that we're saying that `exampleFunc` must be of type `ExampleFunction`, and we're getting an error.

You'll notice that the error is split up into several indented sections:

```
Type '() => { something: { excellent: string; awesome: boolean; }; }' is not assignable to type 'ExampleFunction'.

---

Call signature return types '{ something: { excellent: string; awesome: boolean; }; }' and '{ something: { excellent: string; awesome: number; }; }' are incompatible.

---

The types of 'something.awesome' are incompatible between these types.

---

Type 'boolean' is not assignable to type 'number'.
```

This structure mirrors the structure of the code. Since we're comparing a function (`exampleFunc`) to a type (`ExampleFunction`), it starts with the function:

```
Type '() => { something: { excellent: string; awesome: boolean; }; }' is not assignable to type 'ExampleFunction'.
```

Why isn't my function assignable, TypeScript? Well, it's the return signature.

```
Call signature return types '{ something: { excellent: string; awesome: boolean; }; }' and '{ something: { excellent: string; awesome: number; }; }' are incompatible.
```

Great, that means I know that the return types are incompatible, not the parameters. So, what about the return type is incompatible?

```
The types of 'something.awesome' are incompatible between these types.
```

Aha, the nested property `something.awesome`. What's wrong with it?

```
Type 'boolean' is not assignable to type 'number'.
```

There we go! We've finally got at the root of the problem. To fix it, we'd need to change `awesome: true` to `awesome: 123` or similar.

**TypeScript errors mirror the structure of the code that's being compared**. The more complex the structure, the more complex the error.

## Getting better errors

In the example above, we can see that the actual red line is some distance away from the cause:

```ts
const exampleFunc: ExampleFunction = () => {
  //  ^^^^^^^^^^^ Red line here...
  return {
    something: {
      excellent: 'str',
      awesome: true,
      //^^^^^ ...but this was the cause.
    },
  }
}
```

TypeScript had to produce a long error to explain the entire structure between the error's _site_ its cause. We can reduce the complexity of the error by changing the way we assign the type:

```ts
type ExampleReturnType = {
  something: {
    excellent: string
    awesome: number
  }
}

const example = (): ExampleReturnType => {
  return {
    something: {
      excellent: 'str',
      awesome: true,
      //^^^^^ Type 'boolean' is not assignable to type 'number'.
    },
  }
}
```

Now, we're asking TypeScript to only check the _return type_ of the function, not the entire function. That means it's comparing an object to an object.

Objects are less complex than functions (they can't be overloaded), so TypeScript can actually dispense with a long error and show only the line that matters:

```
Type 'boolean' is not assignable to type 'number'.
```

So, if you're looking to improve your TypeScript errors - aim to always compare **objects to objects**, instead of **functions to functions**. This means you should prefer typing return types and parameters over giving a type to the function itself.
