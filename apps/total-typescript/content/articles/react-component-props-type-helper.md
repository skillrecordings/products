# ComponentProps: React's Most Useful Type Helper

When you're working with React and TypeScript, you'll often find yourself with many questions:

- How do I figure out the type of a component's props?
- How do I get all the types that a `div` or `span` accepts?

Curiously, you'll find both answers in a single place: `ComponentProps`.

There are various ways to use the `ComponentProps` type. The following are three of the most common use cases:

## Get the Props of Elements

When building a React application, there is a need to use native HTML elements such as buttons, inputs, and forms. With the `ComponentProps` type, developers can extract the props of these elements, making it easier to type-check them and ensure their correctness.

```typescript
import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;
```

In the code above, the `ButtonProps` type extracts the type of props used by the `button` element. These props can then be used in the React component that renders the button.

You can pass in _any_ DOM element, from `span` to `a` - you'll even get autocomplete inside `ComponentProps` itself in case you make a mistake.

This is particularly useful when you want to create a component that accepts all the props of a `div`, but also adds some of its own:

```tsx
import { ComponentProps } from "react";

type MyDivProps = ComponentProps<"div"> & {
  myProp: string;
};

const MyDiv = ({ myProp, ...props }: MyDivProps) => {
  console.log(myProp!);

  return <div {...props} />;
};
```

## Get the Props of a Component

This isn't the only use of `React.ComponentProps`, though. You can also use it to _extract_ props from existing components.

```typescript
const SubmitButton = (props: { onClick: () => void }) => {
  return <button onClick={props.onClick}>Submit</button>;
};

type SubmitButtonProps = ComponentProps<
  typeof SubmitButton
>;
```

In the above code, the `SubmitButtonProps` type extracts the props of the `SubmitButton` component. These props can then be used to type-check the component's usage throughout the application.

This is especially useful for extracting the props from components you don't control, perhaps from third-party libraries.

```tsx
import { ComponentProps } from "react";
import { Button } from "some-external-library";

type MyButtonProps = ComponentProps<typeof Button>;
```

For instance, `some-external-library` (above) might not export a `ButtonProps` type, but you can still get it using `ComponentProps`.

## Get the Props of an Element with the Associated Ref

Refs in React let you access and interact with the properties of an element. Often, it's used with form elements like inputs and buttons to extract their values or set their properties. The `ComponentPropsWithRef` does exactly what it says - provide the component props with its associated ref.

```typescript
type InputProps = ComponentPropsWithRef<"input">;
```

In the example above, the `InputProps` type extracts the props of the `input` element, including the associated ref.

**Want more TypeScript knowledge**? Check out our [Beginners TypeScript tutorial](https://www.totaltypescript.com/tutorials/beginners-typescript) - and watch this space for something interesting on React and TypeScript dropping very soon.
