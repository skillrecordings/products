# Don't use `Function`

Let's imagine you're creating a function which sums up an array of objects. Here's one, taken from the Excalidraw codebase:

```ts
const sum = <T>(array: readonly T[], mapper: (item: T) => number): number =>
  array.reduce((acc, item) => acc + mapper(item), 0)
```

Let's look at the type definition. This function takes in:

- An array of something: `readonly T[]`
- A mapper function: `(item: T) => number`

and returns `number`.

In the body, it calls `array.reduce(func, 0)`. This means the `acc` in the function begins as `0`.

For each member of the array, it then adds `acc` and `mapper(item)` together. So, you end up with the sum of all of the members of the array.

## What's the function declaration doing?

The `mapper` function is the key. Let's strip it out to take a look at it:

```ts
type Mapper<T> = (item: T) => number
```

Let's imagine a use case for this:

```ts
interface YouTubeVideo {
  name: string
  views: number
}

const youTubeVideos: YouTubeVideo[] = [
  {
    name: 'My favourite cheese',
    views: 100,
  },
  {
    name: "My second favourite cheese (you won't believe it)",
    views: 67,
  },
]

const mapper: Mapper<YouTubeVideo> = (video) => {
  return video.views
}

const result = sum(youTubeVideos, mapper) // 167
```

Here, `mapper` represents the function that extracts the number from the object. The powerful thing about the `sum` function is that you can discard most of these type declarations:

```ts
const youTubeVideos = [
  {
    name: 'My favourite cheese',
    views: 100,
  },
  {
    name: "My second favourite cheese (you won't believe it)",
    views: 67,
  },
]

const result = sum(youTubeVideos, (video) => {
  return video.views
}) // 167
```

We've actually discarded _all_ of the type declarations, but `video` is still inferred as `{ name: string; views: number }`. This is possible because of the _specificity_ of our function definition: `(item: T) => number`.

## What about `Function`?

The big mistake I see a lot of beginner devs making is declaring a function like `mapper` with the `Function` type:

```ts
const sum = <T>(array: readonly T[], mapper: Function): number =>
  array.reduce((acc, item) => acc + mapper(item), 0)
```

This keyword basically stands for 'any function'. It means that `sum` can technically receive any function.

When used in `sum`, we lose a lot of the safety that `(item: T) => number` provided:

```ts
const result = sum(
  youTubeVideos,
  // Parameter 'item' implicitly has an 'any' type.
  (item) => {
    // We can return anything from here, not just
    // a number!
    return item.name
  },
)
```

TypeScript now can't infer what `item` is supposed to be, or what our mapper function is supposed to return.

The lesson here is 'don't use `Function`' - there's always a more specific option available.

## Alternatives

### Expressing 'any function'

Sometimes, you'll want to express 'any function' in TypeScript. For this, let's look at some of TypeScript's built-in types, `Parameters` and `ReturnType`.

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

You'll notice that both of these utility types use the same constraint: `(...args: any) => any`.

`(...args: any)` specifies that the function can take _any_ number of arguments, and `=> any` indicates that it can return anything.

### Expressing a function with no args

For expressing a function with no arguments (but that returns anything), you'll want to use `() => any`:

```ts
const wrapFuncWithNoArgs = (func: () => any) => {
  try {
    return func()
  } catch (e) {}
}

// Argument of type '(a: string) => void' is not
// assignable to parameter of type '() => any'.
wrapFuncWithNoArgs((a: string) => {})
```

## Summary

`Function` should never be used when expressing types.

`(a: string, b: number) => any` syntax can be used when you want to specify only the arguments, but not the return type.

`(...args: any) => any` can be used to represent _any_ function type.
