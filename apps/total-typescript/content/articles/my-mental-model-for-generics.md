# My mental model for Generics

I think that the TypeScript docs are mostly excellent. The [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html) is a shining example of what good docs look like. They're precise, well-maintained, well laid-out, and complete.

However, if there's one section I could rewrite, it would be the section on [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html). I think this section assumes too much knowledge, teaches things in the wrong order, and misses out key information. It leaves users feeling that generics are complicated and mysterious.

Let's rectify that.

## Type Helpers

Let's look at generics first on the type level. Imagine you have a type that looks like this:

```ts
type Name = 'matt'
```

This is a literal string, `matt`, expressed in a type alias. This can't be altered later, so it behaves similarly to a `const` variable declaration in JavaScript:

```ts
const name = 'matt'
```

Using generics, we can change `Name` to be a _function_. Let's add a type argument to it:

```ts
type Name<LastName> = 'matt'
```

This adds a parameter to `Name`, meaning that whenever we use it, we'll need to pass in an argument:

```ts
type User = {
  name: Name<'pocock'>
}
```

This turns the type from a _variable_ to a _function_. Now, its equivalent in JavaScript would be:

```ts
const name = (lastName) => 'matt'
```

Since it's now a function, let's name it something more function-like:

```ts
type GetName<LastName> = 'matt'
```

`LastName` is currently unused, so as an example let's return an object from our type 'function':

```ts
type GetNameObject<LastName> = {
  firstName: 'matt'
  lastName: LastName
}
```

The JavaScript equivalent would be:

```ts
const getNameObject = (lastName) => {
  return {
    firstName: 'matt',
    lastName,
  }
}
```

We can then use our `GetNameObject` type function to create types, by passing it arguments:

```ts
type NameObject = GetNameObject<'pocock'>
// {
//   firstName: "matt";
//   lastName: "pocock";
// }
```

In Total TypeScript's [Type Transformations workshop](https://www.totaltypescript.com/workshops/type-transformations), I call this pattern 'type helpers'. Type helpers are really useful on the type level to create new types to help DRY up your code.

A common example is a `Maybe` type helper:

```ts
type Maybe<T> = T | null | undefined

type MaybeString = Maybe<string>
// string | null | undefined
```

## Generic functions

Now you know how to handle generics on the type level, what about generic functions?

Let's take a simple example, `returnWhatIPassIn`:

```ts
const returnWhatIPassIn = (input: any) => {
  return input
}
```

This function won't return whatever you pass in - it'll actually always return `any` on the type level. This is annoying, because it ruins your autocomplete on the thing you pass in:

```ts
const str = returnWhatIPassIn('matt')

str.touppercase() // No error here!
```

Let's imagine we wanted to create this on the type level. We'd create a type helper called `ReturnWhatIPassIn`:

```ts
type ReturnWhatIPassIn<TInput> = TInput

type Str = ReturnWhatIPassIn<'matt'>
//   "matt"
```

At the type level, we're taking in `TInput` - whatever it is - and returning it.

We can use a very similar syntax to annotate our function:

```ts
const returnWhatIPassIn = <TInput>(input: TInput): TInput => {
  return input
}
```

This is now a generic function. This means that when we call it, the type argument of `TInput` gets inferred from what we pass in:

```ts
const str = returnWhatIPassIn('matt')
// "matt"
```

Let's put this in simple terms. **A generic function is a type helper layered on top of a normal function**. This means that when we call the function, we're also passing a type to the 'type helper'.

Let's build up that function again, piece by piece, to show you what I mean.

Let's start from our JavaScript-only function again:

```ts
const returnWhatIPassIn = (input: any) => {
  return input
}
```

Let's get the structure of the 'type helper' set up first. We'll need to infer an `TInput` argument, and return that.

```ts
const returnWhatIPassIn = <TInput>(input: any): TInput => {
  return input
}
```

If we try and call this now, it'll infer what it returns as `unknown`:

```ts
const str = returnWhatIPassIn('matt')
// unknown
```

That's because we haven't _told the type helper which arguments to infer from_. We need it to infer the type of `TInput` from the `input` argument. Let's fix that.

```ts
const returnWhatIPassIn = <TInput>(input: TInput): TInput => {
  return input
}
```

So inside `(input: TInput)`, we perform a mapping between the runtime argument - `input` - and the type we want it to infer - `TInput`.

## Summary

This is the right way to think about generics - as a type helper laid over your function, with a mapping between them.

Generics get a lot more complex from here - multiple generics, generic constraints, generics hidden deep within other types - but this mental model stays the same.

If you want to dive deeper into generics, my workshop on Generics for Total TypeScript is coming live later this month. You can learn all about type helpers in the [Type Transformations workshop](https://www.totaltypescript.com/workshops/type-transformations).
