## How to test your types

If you're working on library code, then you definitely want to be testing your types. Types are a crucial part of your API that you're exposing to users, and you want to make sure that your logic on the type level works.

### Vitest

One approach you can take is testing your types with vitest - an extremely powerful and popular test runner based on Vite. Vitest is already widely used for testing runtime code, so why not use it for testing your types too? Vitest ships with several APIs that let you [test types](https://vitest.dev/guide/testing-types.html).

```typescript
import { assertType, expectTypeOf } from "vitest";
import { mount } from "./mount";

test("my types work properly", () => {
  expectTypeOf(mount).toBeFunction();
  expectTypeOf(mount).parameter(0).toMatchTypeOf<{ name: string }>();
});
```

This is pretty cool and having it built into a test runner is really valuable, because it lets you colocate your type tests with your runtime tests.

### Rolling your own

But if you're not using vitest, you can roll your own solution.

Let's say you're testing the type of something. You can use type helpers like `Expect` and `Equal` to be really specific with the type that you're trying to narrow to.

```typescript
type Expect<T extends true> = T;
type Equal<X, Y> = Expect<X extends Y ? (Y extends X ? true : false) : false>;

// Example

const identityFunc = <T>(arg: T) => arg;

it("Should return whatever you pass in", () => {
  const test1 = identityFunc("hello");

  type test = Expect<Equal<typeof test1, "hello">>;
});
```

If you get an error, it'll show up as a red line in your IDE. As part of your test suite, you can then run `tsc` (the TypeScript CLI) on the entire test suite and check if any of your type tests fail.

You can also check that something doesn't work in TypeScript by using `ts-expect-error`. This is a special comment that you can add on a line to look at the next line. It'll fail if it doesn't see an error on the next line. You can use this to check if something is allowed or not and assert that an error is thrown in certain situations.

```typescript
const myFunc = <T extends string>(arg: T) => {};

it("Should not accept a number", () => {
  // @ts-expect-error
  myFunc(123);
});
```

It's not exactly perfect since it doesn't let you be that granular - you can't check that a specific error is thrown, only that _an_ error has been thrown.

### `tsd`

Lastly, there's a really nice library called [tsd](https://github.com/SamVerschueren/tsd) which helps you test your types. It's actually pretty similar to the vitest runner, but it bundles in everything and makes it nice to work with. I don't have as much experience with it, but it's definitely worth a look.

### Summary

Those are three ways that you should be thinking about testing your types. It's worth noting that for application development, you're rarely going to be in a position where testing your types will be worth it.

But if you're working with any kind of library that is going to be consumed by a lot of people, then learning how to test types - and getting good at it - is critical.
