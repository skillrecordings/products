# Const type parameters bring 'as const' to functions

I got a message from my friend Tom on Twitter the other day:

https://twitter.com/tomus_sherman/status/1644407618016890880

<!-- Embed the tweet if possible! Or copy the text. -->

Turns out he hadn't made it up.

TypeScript 5.0 introduced a brand-new piece of syntax to the language: `const` type parameters.

```ts
const myFunc = <const T>(input: T) => {
  return input;
};
```

To understand why it's useful, let's first take a look at a function that _doesn't_ use a `const` type parameter:

```ts
const myFunc = <T>(input: T) => {
  return input
}
```

Let's say you call `myFunc` using an object:

```ts
const result = myFunc({foo: 'bar'})
```

The type of `result` will be `{ foo: string }`. This is exactly the same as if you'd declared your object as a variable:

```ts
const myObj = {foo: 'bar'} // { foo: string }
```

If you hover over `myObj` in VS Code, you'll see that the type is the same as above - `{ foo: string }`.

But what if we don't want to infer a `string`, but instead the literal `bar`?

On the variable, we can use `as const` to do this:

```ts
const myObj = {foo: 'bar'} as const // { readonly foo: "bar" }
```

But how do we handle it on the function? Enter the `const` type parameter:

```ts
const myFunc = <const T>(input: T) => {
  return input;
};

const result = myFunc({ foo: "bar" }); // { readonly foo: "bar" }
```

This is a really useful way of preserving the literal types of objects passed to your functions.

How are you planning on using const type parameters? Let me know on my [Discord Server](https://mattpocock.com/discord).
