---
summary: "Union types let you express types that could be one of several different things."
---

# Union Types

In TypeScript, union types let you express types that could be one of several different things.

Here's an example of a union type in a function argument:

```typescript
function printId(id: string | number) {
  console.log(`ID is: ${id}`);
}

printId("abc"); // Outputs: ID is: abc
printId(123); // Outputs: ID is: 123
```

In the example above, the `id` parameter can be either a `string` or a `number`.

Union types can be used with any type, including literals:

```typescript
type Status = "success" | "failure";

function printStatus(status: Status) {
  console.log(`Status is: ${status}`);
}

printStatus("success"); // Outputs: Status is: success
printStatus("error"); // Type error!
```

As you can see, union types provide a level of type safety that `any` type lacks. It prevents errors at compile-time, reducing the chances of runtime issues.

You can include as many members as you want in a union type:

```typescript
type MassiveUnionType =
  | "animal"
  | {
      whatever: string;
    }
  | boolean
  | (() => void)
  | 100
  | "other string";
```
