# Testing with TypeScript is Painful: Here's a Solution

As an industry, we've started to agree that TypeScript is a good idea. It's a great way to catch bugs in your application code before they get to production.

But in many codebases, a huge part of your code _isn't_ your application code. It's your tests. And in those tests, using TypeScript can be pretty painful.

## Test code doesn't need to be typed so strictly

Tests don't need to live up to the same level of strictness as the rest of your application code.

If you've got a broken type in your app, that'll likely end up in your users finding a bug. But what happens if your tests are passing, but you've got a broken type?

That broken type _might_ be an indication that your tests are wrong - so you should probably check it. But once you've verified that it's all OK, it can feel like meaningless busywork.

## You need to be able to pass the WRONG type

Sometimes, your tests will need to test that when a function receives the _wrong_ thing, it behaves in the right way.

Often the only way to achieve this is with an `as any`:

```typescript
const func = (a: string): void => {
  if (typeof a !== "string") {
    throw new Error("Oh dear!");
  }
};

it("Throws an error when passed a number", () => {
  expect(() => func(123 as any)).toThrow();
});
```

You might have an ESLint rule enabled to prevent 'any' from your tests. If you do, you might look for the `as unknown as string` pattern:

```typescript
it("Throws an error when passed a number", () => {
  expect(() =>
    func(123 as unknown as string)
  ).toThrow();
});
```

This is extremely un-ergonomic - a DOUBLE assertion, just to be able to do something extremely common. If you've got experience with heavily tested codebases, you'll know how common these assertions are.

## Mocking BIG types

Another extremely common pattern is testing a function which receives a _lot_ of properties, but you only care about a few of them. This can happen often with external libraries, such as `express` endpoints:

```typescript
import { Request, Response } from "express";

const handler = (
  req: Request,
  res: Response
): void => {};
```

In this case, you might only care about the `req.body` property. But you still need to pass the entire `Request` type to the function. So, you'll end up doing `as unknown as Request` a lot.

Not only is this annoying, but you also need to import the type you want to use _everywhere_ you perform the test. A thousand tiny cuts.

## A first-class solution: `shoehorn`

I've been through dozens of open-source application codebases, and all of them who used a large test suite had this problem. So, I've created a solution.

I've released a library, [`shoehorn`](https://github.com/total-typescript/shoehorn), for easing the pain of working with tests in TypeScript.

It gives you a first-class way to pass the wrong type to a function.

```typescript
import { fromPartial } from "@total-typescript/shoehorn";

it("Should get the user", () => {
  handler(
    // Mock the request!
    fromPartial({
      body: {
        id: "123",
      },
    }),
    // Mock the response!
    fromPartial({})
  );
});
```

You can install `shoehorn` from [npm](https://www.npmjs.com/package/@total-typescript/shoehorn), and check out the [GitHub repo](https://github.com/total-typescript/shoehorn).

I can't wait to see how you use it!
