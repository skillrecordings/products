# Create Next App

If you don't want to publish and use current package version `npm link` in `packages/create-skill-app` folder and then run `create-skill-app` command from anywhere.

The easiest way to get started with Next.js is by using `create-skill-app`. This CLI tool enables you to quickly start building a new Next.js application, with everything set up for you. You can create a new app using the default Next.js template, or by using one of the [official Next.js examples](https://github.com/vercel/next.js/tree/canary/examples). To get started, use the following command:

```bash
npx create-skill-app@latest
# or
yarn create next-app
# or
pnpm create next-app
```

Or, for a [TypeScript project](https://github.com/vercel/next.js/blob/canary/docs/basic-features/typescript.md):

```bash
npx create-skill-app@latest --typescript
# or
yarn create next-app --typescript
# or
pnpm create next-app --typescript
```

To create a new app in a specific folder, you can send a name as an argument. For example, the following command will create a new Next.js app called `blog-app` in a folder with the same name:

```bash
npx create-skill-app@latest blog-app
# or
yarn create next-app blog-app
# or
pnpm create next-app blog-app
```

## Options

`create-skill-app` comes with the following options:
- 
- none yet

## Why use Create Next App?

`create-skill-app` allows you to create a new Next.js app within seconds. It is officially maintained by the creators of Next.js, and includes a number of benefits:

- **Interactive Experience**: Running `npx create-skill-app` (with no arguments) launches an interactive experience that guides you through setting up a project.
- **Zero Dependencies**: Initializing a project is as quick as one second. Create Next App has zero dependencies.
- **Offline Support**: Create Next App will automatically detect if you're offline and bootstrap your project using your local package cache.
- **Support for Examples**: Create Next App can bootstrap your application using an example from the Next.js examples collection (e.g. `npx create-skill-app --example api-routes`).
- **Tested**: The package is part of the Next.js monorepo and tested using the same integration test suite as Next.js itself, ensuring it works as expected with every release.
