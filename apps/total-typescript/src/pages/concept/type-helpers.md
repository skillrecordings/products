---
summary: "TypeScript has built-in utility types that manipulate and create types. Additionally, you can create custom type helpers for their projects."
---

# Type Helpers

A type helper is a type that can accept other types as arguments. It's like a function, but for types. `Record` is a great example:

```typescript
type MyObj = Record<string, string>;

const obj: MyObj = {};

obj.foo = "bar";

obj[1] = "baz"; // Error: Type 'number' is not assignable to type 'string'.
```

Here, we are defining a type `MyObj` that is an object with string keys and string values. We pass in the types `string` and `string` as arguments to the `Record` type helper, and it returns a new type we can use in our applications.

The syntax might look a bit unusual. But it's just like a function, only that it operates on types instead of values. Instead of `()`, we use `<>`.

## Built-In Utility Types

TypeScript comes with a number of built-in utility types that can be used to create and manipulate types. These are globally available throughout your project - no need to import them. Some of the most commonly used ones include:

- `Partial<T>`: Creates a type with all properties of another type set to optional.
- `Pick<T, K>`: Creates a new type by picking a set of properties `K` from another type `T`.
- `Required<T>`: Creates a type with all properties of another type set to required.
- `Readonly<T>`: Creates a type with all properties of another type set to readonly.

## Building Your Own Custom Type Helpers

You'll often need to build your own type helpers for your project. Let's imagine you have lots of values in your app that might be _something_ or `null` or `undefined`. You could keep writing `string` | `null` | `undefined` everywhere, but that would be tedious and error-prone. Instead, you can create a custom type helper:

```typescript
type Maybe<T> = T | null | undefined;
```

Here, we are defining a custom type helper `Maybe` that takes a type `T` as a parameter and returns a new type that can either be `T`, `null`, or `undefined`.

We can use it like so:

```typescript
interface User {
  id: string;
  name: string;
  phoneNumber: Maybe<string>;
}
```
