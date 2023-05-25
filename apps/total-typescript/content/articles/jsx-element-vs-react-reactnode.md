# `React.ReactNode` vs `JSX.Element`

When the TypeScript team started work on supporting React, JSX was the big stumbling block. Its syntax doesn't exist in JavaScript, so they had to build it into the compiler.

They came up with the idea for `.tsx` files, the `jsx` option in `tsconfig.json`, and suddenly, JSX was supported. But there was an interesting unanswered question: what type should this function infer as?

## `JSX.Element`

```tsx
// When I hover this, what should I get?
const Component = () => {
  return <div>Hello world</div>;
};
```

The answer was a special type called `JSX.Element`. If you hover over a component today, you'll likely see:

```tsx
// const Component: () => JSX.Element
```

`JSX` is something called a global namespace. It's like an object in the global scope. A namespace can contain types, and `Element` is one of those types. This means that if React's type definitions define `JSX.Element`,` it'll be picked up by TypeScript.

Here's how it looks in React's type definitions:

```ts
// Puts it in the global scope
declare global {
  // Puts it in the JSX namespace
  namespace JSX {
    // Defines the Element interface
    interface Element
      extends React.ReactElement<any, any> {}
  }
}
```

We can think of `JSX.Element`, however it's defined, as representing the thing that calling a JSX expression returns. It's the type of the thing that gets created when you write JSX.

### What is `JSX.Element` used for?

Now - why would this knowledge be useful to you? What would you want to use the `JSX.Element` type for?

The most obvious choice would be for typing the `children` property of a component.

```tsx
const Component = ({
  children,
}: {
  children: JSX.Element;
}) => {
  return <div>{children}</div>;
};
```

The issues start to become apparent when you begin using this type. For example, what happens if you want to render a string?

```tsx
// 'Component' components don't accept text as
// child elements. Text in JSX has the type
// 'string', but the expected type of 'children'
// is 'Element'.
<Component>hello world</Component>
```

This is perfectly valid - React can handle various things as children of components, like numbers, strings, and even `undefined`.

But TypeScript isn't happy. We've made the type of `children` `JSX.Element`, which only accepts JSX.

We need a different type definition to use for `children`. We need a type that accepts strings, numbers, undefined, and JSX.

## `React.ReactNode`

This is where `React.ReactNode` comes in. It's a type that accepts everything that React can render.

It lives in the React namespace:

```ts
declare namespace React {
  type ReactNode =
    | ReactElement
    | string
    | number
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;
}
```

We can use it to type our `children` prop:

```tsx
const Component = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};
```

Now we can pass in strings, numbers, undefined, and JSX:

```tsx
<Component>hello world</Component>
<Component>{123}</Component>
<Component>{undefined}</Component>
<Component>
  <div>Hello world</div>
</Component>
```

### When _shouldn't_ we use `React.ReactNode`?

The only time not to use `React.ReactNode` is when we're typing the return type of a component.

```tsx
const Component = (): React.ReactNode => {
  return <div>Hello world</div>;
};
```

It looks okay when defining it, but when we go to use it, it'll freak out:

```tsx
// 'Component' cannot be used as a JSX component.
//   Its return type 'ReactNode' is not a valid JSX element.
<Component />
```

This is because TypeScript uses the definition of `JSX.Element` to check if something _can_ be rendered as JSX. And since `React.ReactNode` contains things that aren't JSX, it can't be used as a JSX element.

I know, confusing.

## Future Changes

TypeScript 5.1 is bringing [some changes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-1-beta/#decoupled-type-checking-between-jsx-elements-and-jsx-tag-types) that will shake things up a bit. Instead of checking for `JSX.Element`, TypeScript will check `JSX.ElementType` to see what can be rendered as an element. This means that the React team can change the definition of `JSX.ElementType` to be a little wider:

```ts
namespace JSX {
  type ElementType =
    // All valid lowercase tags
    | keyof IntrinsicAttributes
    // Function components
    | ((props: any) => Element)
    // Class components
    | (new (props: any) => ElementClass);
}
```

It's unclear to me how this will shake out in terms of `React.ReactNode` - but it's likely that you'll still use it for annotating the children of your React components.

## Conclusion

You should almost never use `JSX.Element` in your code. It's a type used internally by TypeScript to represent the return type of JSX expressions.

Instead, use `React.ReactNode` to type the children of your components. I'd suggest _not_ annotating the return types of your components to avoid confusion.

Once 5.1 drops, remind me to revisit this article, and we can see how things have changed - if at all.
