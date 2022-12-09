# Writing string.replace in TypeScript

Since 4.1, TypeScript has had the power to manipulate and transform strings using template literal syntax. Take the example below:

```ts
type InternalRoute = `/${string}`

const goToRoute = (route: InternalRoute) => {}
```

You'll be able to call `goToRoute` using anything starting with a `/`. But any other string will be an error.

You can use unions inside template literal types to expand into larger unions:

```ts
type EntityAttributes = `${'post' | 'user'}${'Id' | 'Name'}`
//   ^? 'postId' | 'userId' | 'postName' | 'userName'
```

You can even use `infer` inside template literals.

```ts
type GetLastName<TFullName extends string> =
  TFullName extends `${infer TFirstName} ${infer TLastName}` ? TLastName : never
```

Here, `\`${infer TFirstName} ${infer TLastName}\`` represents any two strings with a space between:

```txt
Matt Pocock
Jimi Hendrix
Charles Barkley
Emmylou Harris
```

And it instantiates `TFirstName` and `TLastName` as type variables which can be used if it matches the string passed in. The `? TLastName` returns the last name, meaning you can use `GetLastName` like so:

```ts
type Pocock = GetLastName<'Matt Pocock'>
//   ^? "Pocock"

type Hendrix = GetLastName<'Jimi Hendrix'>
//   ^? "Hendrix"

type Barkley = GetLastName<'Charles Barkley'>
//   ^? "Barkley"
```

What about more advanced use cases? What if we wanted to replace the space in the name with a dash?

```ts
type ReplaceSpaceWithDash<TFullName extends string> =
  TFullName extends `${infer TFirstName} ${infer TLastName}`
    ? `${TFirstName}-${TLastName}`
    : never

type Name = ReplaceSpaceWithDash<'Emmylou Harris'>
//   ^? "Emmylou-Harris"
```

Very nice - we just change the result to `\`${TFirstName}-${TLastName}\``. Now, our type variables seem a bit misnamed. Let's switch:

- `TFullName` to `TString`
- `TFirstName` to `TPrefix`
- `TLastName` to `TSuffix`

```ts
type ReplaceSpaceWithDash<TString extends string> =
  TString extends `${infer TPrefix} ${infer TSuffix}`
    ? `${TPrefix}-${TSuffix}`
    : never
```

Now it's more generic. But not quite generic enough - let's make this type helper be able to handle replacing _any_ string with another string.

```ts
type Replace<
  TString extends string,
  TToReplace extends string,
  TReplacement extends string,
> = TString extends `${infer TPrefix}${TToReplace}${infer TSuffix}`
  ? `${TPrefix}${TReplacement}${TSuffix}`
  : never
```

We've swapped out the ` ` with `TToReplace`, and `-` with `TReplacement`. This ends up working pretty well:

```ts
type DashName = Replace<'Matt Pocock', ' ', '-'>
//   ^? "Matt-Pocock"
```

Except, there are a couple of bugs. For instance, that `never` looks a bit suspicious. If `Replace` doesn't find any `TToReplace`, it returns `never`:

```ts
type Result = Replace<'Matt', ' ', '-'>
//   ^? never
```

What is the correct behaviour? We want to just return whatever string got passed in:

```ts
type Replace<
  TString extends string,
  TToReplace extends string,
  TReplacement extends string,
> = TString extends `${infer TPrefix}${TToReplace}${infer TSuffix}`
  ? `${TPrefix}${TReplacement}${TSuffix}`
  : TString

type Result = Replace<'Matt', ' ', '-'>
//   ^? "Matt"
```

The second bug is that it only replaces _once_. If there's more than one instance of the `TToReplace`, it ignores the second onwards.

```ts
type DashCaseName = Replace<'Matt Pocock III', ' ', '-'>
//   ^? "Matt-Pocock III"
```

This feels like a tricky bug to fix - until we consider how `\`${infer TPrefix}${TToReplace}${infer TSuffix}\``works. In a string like`Matt Pocock III`, it will infer like so:

- `TPrefix`: "Matt"
- `TSuffix`: "Pocock III"

This means that the rest of the work needs to be performed on `TSuffix`. Again, this feels intractable - until we realise that you can call types _recursively_. This means that we can wrap `TSuffix` in `StringReplace`:

```ts
type StringReplace<
  TString extends string,
  TToReplace extends string,
  TReplacement extends string,
> = TString extends `${infer TPrefix}${TToReplace}${infer TSuffix}`
  ? `${TPrefix}${TReplacement}${StringReplace<
      TSuffix,
      TToReplace,
      TReplacement
    >}`
  : TString

type Result = StringReplace<'Matt Pocock III', ' ', '-'>
//   ^? "Matt-Pocock-III"
```

Whenever you're doing recursion, you need to make sure you don't end up in an infinite loop. So let's track what `StringReplace` gets passed:

First, `StringReplace<"Matt Pocock III", " ", "-">`. This returns `Pocock III`.

Second, `StringReplace<"Pocock III", " ", "-">`. This returns `III`.

Finally, `StringReplace<"III", " ", "-">`. Since it can't find any instances of `" "`, it just returns `TString` (in this case, `"III"`). We found the end of our recursive loop!

Thanks for following along on this deep dive of conditional types, template literals and `infer`. If you enjoyed it, you'll love my [full course](https://totaltypescript.com) where we go _even deeper_, and build up all the knowledge with step-by-step exercises.
