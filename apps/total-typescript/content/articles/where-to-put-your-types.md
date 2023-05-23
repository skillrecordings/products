# Where To Put Your Types in Application Code

Developers love a good folder structure. It helps application code feel organized. JavaScript developers generally have a good idea about where to put their implementation code - but what about types?

In this guide, I'll give you my opinionated take on where to put your types in application code. For most of you, it'll hopefully confirm your existing intuitions. For others, it'll give you some new ideas to try out.

## Colocate (or inline) single-use types

Rule 1: When a type is **used in only one place**, put it in **the same file where it's used**.

Most applications are built from functions and classes. And when you're working on them, you'll often need to make changes to their types to keep moving.

The classic example in applications is component props. If you have a component `MyComponent` that takes props `foo` and `bar`, I recommend putting its types in the same file.

```typescript
// MyComponent.tsx

interface Props {
  foo: string
  bar: number
}

export const MyComponent = (props: Props) => {
  // ...
}
```

Other approaches would see you moving the types to a separate module:

```
|- src
  |- components
    |- MyComponent.tsx
    |- MyComponent.types.ts
```

But I find this approach pretty unintuitive to work with. When I'm working on `MyComponent`, I'll often need to be editing both its implementation and its types. Having them in separate files just makes that harder.

When types are truly single-use, don't be afraid to inline them:

```typescript
// MyComponent.tsx

export const MyComponent = (props: {foo: string; bar: number}) => {
  // ...
}
```

A lot of teams are reluctant to inline types because it feels too "messy". But don't feel that you _always_ need to extract out a type into a separate `type` or `interface` - inlining is absolutely fine, and it's very low-cost to refactor it into a separate type later if you need to.

## Move shared types to a shared location

Rule 2: Types that are **used in more than one place** should be **moved to a shared location**.

You should think of types in your application as functions. If you've got a function that's used in multiple modules, you'll probably want to move it to a shared location. Same goes for types.

For me, this usually means creating a `*.types.ts` file in an appropriate spot in my app. If they're shared across the whole app, I'll put them in the `src` folder.

```
|- src
  |- components
    |- MyComponent.tsx
  |- shared.types.ts
```

If they're only used in the `components` folder, I'll put them there:

```
|- src
  |- components
    |- MyComponent.tsx
    |- components.types.ts
```

In other words, I share the type across the smallest number of modules that need it.

## Move types shared across a monorepo to a shared package

Rule 3: Types that are **used in more than one package** in a monorepo should be **moved to a shared package**.

So far, we've talked about types in the context of a single application. But what if you're working on a monorepo with multiple packages?

In that case, you should move shared types to a shared package.

```
|- apps
  |- app
  |- website
  |- docs
|- packages
  |- types
    |- src
      |- shared.types.ts
```

In the example above, we've got a monorepo with three apps: `app`, `website`, and `docs`. We've also got a `types` package that contains types shared across the whole monorepo.

Depending on how your monorepo is structured, how this package is implemented may vary. When I was at Vercel, I wrote a guide on [internal packages](https://turbo.build/repo/docs/handbook/sharing-code/internal-packages) for the Turborepo docs which might help you get started.

## Conclusion

So, keep these three rules in mind:

1. Colocate (or inline) single-use types
2. Move shared types to a shared location
3. Move types shared across a monorepo to a shared package

And you'll be well on your way to a well-structured codebase.
