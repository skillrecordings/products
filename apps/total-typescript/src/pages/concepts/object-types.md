---
summary: "Learn how to define object types in TypeScript using the interface and type keywords to ensure type safety and prevent missing properties."
---

# Object Types

In TypeScript, object types let you define the shape of an object. Alongside `string`, `number` and `boolean`, it's one of the most commonly used annotations in a TypeScript codebase. There are three main ways they're declared.

The first is to use the `interface` keyword:

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}
```

In this example, `User` is an object type with three properties: `name`, `age`, and `email`. You can also define an object type inline:

```typescript
function printUser(user: {
  name: string;
  age: number;
  email: string;
}) {
  console.log(`Name: ${user.name}`);
  console.log(`Age: ${user.age}`);
  console.log(`Email: ${user.email}`);
}
```

In this example, the `printUser` function accepts an object with three properties: `name`, `age`, and `email`. This is equivalent to the `User` interface defined above.

You can also use the `type` keyword:

```typescript
type User = {
  name: string;
  age: number;
  email: string;
};
```

Defining object types will give you a few different kinds of safety. It'll prevent you from passing objects with incorrectly typed or missing properties:

```typescript
const printUser = (user: User) => {};

printUser({
  name: "John Doe",
  age: 42,
}); // Type error - email is missing!

printUser({
  name: "John Doe",
  age: "42",
  email: "john@doe.com",
}); // Type error - age is the wrong type!
```

It'll also give you type safety (and autocomplete!) when accessing properties on objects:

```typescript
const printUser = (user: User) => {
  user.doesNotExist; // doesNotExist is not a property on User!
};
```
