# Everything you need to know about TypeScript 5.1 beta

The TypeScript 5.1 [beta is out](https://devblogs.microsoft.com/typescript/announcing-typescript-5-1-beta) - here's everything you need to know:

## It's only a small release

5.1 doesn't bring much in the way of new features. It's not got much in the way of new keywords or new tools for transforming types.

One small improvement is to usability improvements in [functions which return `undefined`](https://devblogs.microsoft.com/typescript/announcing-typescript-5-1-beta/#easier-implicit-returns-for-undefined-returning-functions). If you've got a type that expects `() => undefined`...

```typescript
type FunctionReturningUndefined = () => undefined
```

...in 5.0 you'd need to _explicitly_ return a value of `undefined` for it to work:

```typescript
// Type '() => void' is not assignable to type
// 'FunctionReturningUndefined'.
const myFunc: FunctionReturningUndefined = () => {}

const myFunc2: FunctionReturningUndefined = () => {
  // Now it's happy!
  return undefined
}
```

But in 5.1, both of the above cases will pass.

Another nice feature is [linked cursors in JSX](https://devblogs.microsoft.com/typescript/announcing-typescript-5-1-beta/#linked-cursors-for-jsx-tags). This means when you're editing the opening tag of a `<div>` in JSX, it'll also edit the closing tag. Beautiful.

These are nice usability improvements, but even together they don't feel like enough for a new TS version. So - what's the headline?

## 5.1 unblocks React Server Components

This is why 5.1 is shipping now. React Server Components don't really work in TypeScript.

The reason for that is that React Server Components introduced `async` components:

```tsx
const MyAsyncComponent = async () => {
  return <div></div>
}

const Parent = () => {
  // 'MyAsyncComponent' cannot be used as a JSX
  // component. Its return type 'Promise<Element>'
  // is not a valid JSX element.
  return <MyAsyncComponent />
}
```

Before 5.1, TypeScript hard-coded an idea of what they expected valid JSX elements to be - it was `JSX.Element | null`. Along with blocking Server Components, this meant that perfectly valid React code, like returning strings from components, was not allowed:

```tsx
const MyStringComponent = () => {
  return 'Hello world!'
}

const Parent = () => {
  // 'MyStringComponent' cannot be used as a JSX component.
  // Its return type 'string' is not a valid JSX element.
  return <MyStringComponent />
}
```

Now, TypeScript will consult a global type called `JSX.ElementType` to calculate if a JSX component is valid. This gives frameworks that use JSX (like React, Solid and Qwik) a LOT more control over what constitutes a valid JSX element - opening up the potential for new API's using JSX itself.

## Should I upgrade?

I've tested 5.1 with Total TypeScript so far, and I've seen no breaking changes. I imagine you're safe to upgrade - and if you're using React Server Components, it's an absolute must.

If you've enjoyed this breakdown, check out my [video on Total TypeScript](https://www.totaltypescript.com/tips/typescript-5-1-beta-is-out) to learn more.
