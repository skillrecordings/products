---
summary: "Literal types in TypeScript allow developers to create types that accept only specific values instead of any value of a given type."
---

# Literal Types

In TypeScript, literal types let you create types that express specific values.

For instance, let's say you only wanted to accept `success` or `failure` in a function argument. You could use `string`:

```typescript
function printStatus(status: string) {
  console.log(`Status is: ${status}`);
}

printStatus("error"); // No type error!
```

But as you can see, we can call `printStatus` with any `string` value, which is not what we want.

Instead, we can use a literal type:

```typescript
function printStatus(
  status: "success" | "failure"
) {
  console.log(`Status is: ${status}`);
}

printStatus("success"); // Outputs: Status is: success
printStatus("error"); // Type error!
```

Now, we can only call `printStatus` with the values `success` or `failure`.

We can also use literal types with other basic types:

```typescript
// Numeric literals
type ValidIndexes = 1 | 2 | 3 | 4 | 5;

// Boolean literals
type SuccessState = {
  success: true;
  data: string;
};

type FailureState = {
  success: false;
  error: string;
};
```

In the example above, `ValidIndexes` can only be `1`, `2`, `3`, `4`, or `5`. `SuccessState` can only be `{ success: true, data: string }`, and `FailureState` can only be `{ success: false, error: string }`.
