# Explained: 'React' refers to a UMD global

If you're working with TypeScript and React, you've probably come across this error:

```tsx
const Component = () => {
  // React refers to a UMD global, but the current file is a module.
  // Consider adding an import instead.
  return <div>Hello world</div>
}
```

Let's figure out how to fix it.

## Quick Fix

If you're **not using TypeScript to compile your application**, you should change `jsx` to `preserve` in your `tsconfig.json`. Most modern frameworks won't use TypeScript to compile your application. So if you're not sure, choose this option.

```json
{
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```

You should also restart your TS server.

If **you _are_ using TypeScript to compile your application**, you should check if you're working with React 17 or later. If you are, you should change `jsx` to `react-jsx` in your `tsconfig.json`.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

If you're not, then keep `jsx` as `react` in your `tsconfig.json` and add `import React from "react";` to the top of your file.

## Explanation

The error happens when we have `jsx` set to `react` in the `compilerOptions` of our `tsconfig.json`.

The reason is that when TypeScript is set up like this, it assumes that it'll be transforming your JSX into `React.createElement` calls. So the code below:

```tsx
const Component = () => {
  return <div>Hello world</div>
}
```

transforms to:

```tsx
const Component = () => {
  return React.createElement('div', null, 'Hello world')
}
```

And here's the error. We don't have `React` in scope for this module, so this will cause a runtime error.

But since React 17, we haven't needed to import React to use JSX. So this error feels out of step with how React works today.

### Stopping the Error

The thing this error shows is that you've probably misconfigured your `tsconfig.json`. Most React frameworks don't use TypeScript to handle this transformation. They'll use a tool like [`swc`](https://swc.rs/) that runs faster, but doesn't do type checking.

TypeScript throws an error here because it assumes that you're using it to transform your JSX. And, you're probably not.

The safest bet is to change `jsx` to `preserve` in your `tsconfig.json`. This will tell TypeScript to leave your JSX alone and not throw an error when you forget to import React.

### The Exception to the Rule

The only situation where this error would be helpful is if you're using React 16 or earlier. In that case, you'll need to import React to use JSX. So you should keep `jsx` as `react` in your `tsconfig.json` and add `import React from "react";` to the top of your file.

The `UMD Global` is a red herring - it's not the real problem. The real problem is that you're using JSX without importing React.
