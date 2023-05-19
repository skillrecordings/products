---
summary: "Learn how to extend third-party components and DOM elements with custom props in React using ComponentProps<T>."
---

# ComponentProps<T>

`ComponentProps<T>` is a type helper in React that allows developers to extend third-party and DOM elements with additional props.

## Importing

You can either import it from `react` itself:

```tsx
import { ComponentProps } from "react";
```

Or, grab it off the `React` namespace itself.

```tsx
import React from "react";

type Example = React.ComponentProps<"div">;
```

## Use Cases

### Extending DOM Elements

```typescript
type ButtonProps = React.ComponentProps<"div">;
```

You can use `ComponentProps` to extend DOM elements. This is useful when creating custom components that inherit basic properties from native elements.

For instance:

```tsx
type CustomProps {
  text: string;
}

const Div = ({
  text,
  ...props
}: CustomProps &
  React.ComponentProps<"div">) => {
  // Access text here
  return <div {...props}></div>;
};
```

In this example, the CustomProps type defines a single custom prop, text. The `ComponentProps<T>` helper extends the props of the `div` element with any additional props passed to our custom `Div`.

An alternative approach is to use an interface to extend the native component:

```tsx
interface CustomProps
  extends React.ComponentProps<"div"> {
  text: string;
}

const Div = ({ text, ...props }: CustomProps) => {
  // Access text here
  return <div {...props}></div>;
};
```

In this approach, the CustomProps type extends the props of the `div` element, with the additional definition of a `text` prop. The spread operator passes all props, including the text prop, to the `Div` component.

### Extending Third-Party Components

Another use case for `ComponentProps<T>` is to extend third-party components with custom props. This can be useful when you need to extend a third-party component, but they don't expose the necessary types themselves.

```tsx
import ThirdPartyComponent from "third-party";

type CustomProps {
  foo: string;
  bar: number;
}

const MyComponent = ({
  foo,
  bar,
  ...props
}: CustomProps &
  React.ComponentProps<
    typeof ThirdPartyComponent
  >) => {
  // use foo and bar here as needed
  return <ThirdPartyComponent {...props} />;
};
```

In this example, the `CustomProps` type defines two custom props, `foo` and `bar`. The `ComponentProps<T>` helper grabs the props of the `ThirdPartyComponent` component, then we use the `&` intersection to add our `CustomProps`.

Of course, if the library _does_ expose the correct types, it's often worth using those instead:

```tsx
import ThirdPartyComponent, {
  ThirdPartyComponentProps,
} from "third-party";

type CustomProps {
  foo: string;
  bar: number;
}

const MyComponent = ({
  foo,
  bar,
  ...props
}: CustomProps &
  ThirdPartyComponentProps) => {
  return <ThirdPartyComponent {...props} />;
};
```

But in cases where they don't, `ComponentProps<T>` can be a useful escape hatch.

## ComponentPropsWithRef

If you need to also extract the type of the component's `ref`, you can use `React.ComponentPropsWithRef<T>`. For instance:

```tsx
// | ((instance: HTMLButtonElement | null) => void)
// | React.RefObject<HTMLButtonElement>
// | null
// | undefined
type ButtonRef =
  React.ComponentPropsWithRef<"button">["ref"];
```

This resolves into a pretty complicated type - but it represents anything that can be passed into a `<button>`'s ref.
