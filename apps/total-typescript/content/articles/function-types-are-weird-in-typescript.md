# Function types are weird in TypeScript

Let's look at a [question I got asked](https://twitter.com/sverdiy/status/1643552810191945729) the other day:

```typescript
type TakesOneArgument = (a: string) => void

// Why does this not error in TypeScript?
const func: TakesOneArgument = () => {}
```

In the type `TakesOneArgument`, we're saying that the function takes a `string` and returns `void`. But when we use `TakesOneArgument` to annotate a function that doesn't take any arguments, TypeScript doesn't complain.

Why is this?

Let's look at an example that might look less weird:

```typescript
const array = ['a', 'b', 'c']

// No errors!
array.forEach(() => {})
```

Here, we're using a `.forEach` method on an array of strings. The function we pass to `.forEach` _could_ receive several arguments:

```typescript
array.forEach((item, index, array) => {
  // ...
})
```

But we're not using any of those arguments. So why doesn't TypeScript complain?

## Functions with fewer parameters can still be passed

Let's imagine we've ditched TypeScript, and we're living in JavaScript-land again. We've got a function that takes a single argument:

```javascript
function takesOneArg(a) {}
```

What's going to happen if we call it with two arguments?

```javascript
takesOneArg('a', 'b')
```

Well - nothing! The second argument passed to it will be silently ignored, and it's unlikely ever to cause a runtime error (unless you're doing something unsafe with [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)).

This is exactly what's happening in the `.forEach` case:

```typescript
// Both are fine!
array.forEach((item, index, array) => {})
array.forEach(() => {})
```

The function passed to `.forEach` is _always_ passed `item`, `index` and `array` - but it doesn't always need to specify them.

So - when you specify a function type, TypeScript doesn't force you to handle all the parameters. It's perfectly fine to use a function that takes fewer arguments than the specified type.

## Function types _might_ be an anti-pattern

Let's circle back to our first example:

```typescript
type TakesOneArgument = (a: string) => void

// Why does this not error in TypeScript?
const func: TakesOneArgument = () => {}
```

The reason this doesn't error is because, technically, `func` is assignable to `TakesOneArgument`. You could use that function anywhere that `TakesOneArgument` is expected, and it would work.

But as you can see, it's a little unexpected. The cleanest way to annotate this would be:

```typescript
const func = (a: string): void => {}
```

I don't want to dissuade you from typing your functions using `type`. But this behaviour is definitely worth considering.

Plus, I go into depth elsewhere on [why function types can give you worse errors](https://www.totaltypescript.com/structure-of-a-typescript-error).
