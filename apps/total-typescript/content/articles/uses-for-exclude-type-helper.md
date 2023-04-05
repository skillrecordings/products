# 9 ways to use Exclude in TypeScript

As part of my work as a TypeScript educator, I get asked a _lot_ about the TypeScript utility types - especially about how to use them in application code. So, I'm starting a series on them - built around real-world examples.

Let's start with the [`Exclude`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers) type helper.

## 1. Remove a member of a union

```ts
type Fruit = 'apple' | 'banana' | 'orange'

type Result = Exclude<Fruit, 'orange'> // 'apple' | 'banana'
```

We can use `Exclude` to remove a single member of a union. The first argument represents the full union, and the second argument represents the member to remove.

Technically, the second argument can be any type - TypeScript won't warn you if you try to remove a member that doesn't exist. It'll just return the original union.

```ts
type Result = Exclude<Fruit, 'pear'> // 'apple' | 'banana' | 'orange'
```

## 2. Remove multiple members from a union

```ts
type Event = 'click' | 'focus' | 'change' | 'abort'

type ClickAndFocusEvent = Exclude<Event, 'change' | 'abort'> // 'click' | 'focus'
```

We can also use `Exclude` to remove multiple members from a union. By passing a union to the second argument, we can remove multiple members at once.

Just like above, not all of those members need to exist in the original union:

```ts
type ClickAndFocusEvent = Exclude<Event, 'change' | 'abort' | 'blur'> // 'click' | 'focus'
```

## 3. Remove a member of a discriminated union

```ts
type Event =
  | {
      type: 'click'
    }
  | {
      type: 'focus'
    }
  | {
      type: 'change'
    }
```

A discriminated union is a union, usually of objects, which have a common property that can be used to discriminate between them. In the example above, the `type` property is used to discriminate between the different events.

We can extract a subset of the union by using `Exclude` to remove all members that don't have a specific value for the `type` property.

```ts
type ClickAndFocusEvent = Exclude<Event, {type: 'change'}> // { type: 'click' } | { type: 'focus' }
```

This works even if the members of the union have other properties attached to them.

```ts
type Event =
  | {
      type: 'click'
      x: number
      y: number
    }
  | {
      type: 'focus'
    }
  | {
      type: 'change'
      value: string
    }

type ClickAndFocusEvent = Exclude<Event, {type: 'click'}> // { type: 'focus' } | { type: 'change', value: string }
```

In the example above, the `x` and `y` properties don't need to be passed to `Exclude` in order to remove the `click` event.

## 4. Remove multiple members of a discriminated union

```ts
type Event =
  | {
      type: 'click'
    }
  | {
      type: 'focus'
    }
  | {
      type: 'change'
    }
  | {
      type: 'abort'
    }

type ClickAndFocusEvent = Exclude<Event, {type: 'change'} | {type: 'abort'}> // { type: 'click' } | { type: 'focus' }
```

You can also remove multiple members of a discriminated union by passing a union to the second argument. This can either be a union of the members of the union, or a union of the `type` property:

```ts
type ClickAndFocusEvent = Exclude<Event, {type: 'change' | 'abort'}> // { type: 'click' } | { type: 'focus' }
```

## 5. Exclude members of a discriminated union by shape

```ts
type Routes =
  | {
      route: '/user'
      search: {
        id: string
      }
    }
  | {
      route: '/user/create'
    }
  | {
      route: '/user/edit'
      search: {
        id: string
      }
    }

type RoutesWithoutSearch = Exclude<
  Routes,
  {
    search: any
  }
> // { route: '/user/create' }
```

You don't need to include the 'discriminator' (in this case, `route`) in the second argument to `Exclude`. You can just pass the shape of the members you want to remove.

In the example above, we're removing all members of the `Routes` union that have a `search` property.

## 6. Remove all strings/numbers/booleans from a union

```ts
type PossibleTypes = 'admin' | 'user' | 0 | 1 | 2

type StringTypes = Exclude<PossibleTypes, number>
//                 ^? 'admin' | 'user'
```

Exclude also works on basic types. In the example above, we're removing all literals that match `number` from the `PossibleTypes` union.

This can be useful if you want to remove all strings from a union, or all numbers, or all booleans.

## 7. Remove strings containing a substring from a union

```ts
type ObjectKey = 'userId' | 'postId' | 'userName' | 'postName'

type PostKey = Exclude<ObjectKey, `${string}${'user'}${string}`> // 'postName' | 'postId'
```

You can use `Exclude` to remove all strings from a union that contain a specific substring.

In the example above, we're removing all strings that contain the substring `user` from the `ObjectKey` union.

We use a template literal to represent the string we want to remove - in this case, `user`. We then use the `${string}` syntax to represent any string that comes before or after the substring we want to remove.

## 8. Remove strings with one of several possible values from a union

```ts
type ObjectKey = 'userId' | 'postId' | 'id' | 'userName' | 'postName'

type NonIdKey = Exclude<ObjectKey, `${string}${'id' | 'Id'}${string}`> // 'postName' | 'userName'
```

You can also use `Exclude` to remove all strings from a union that contain one of several possible substrings.

In the example above, we're removing all strings that contain either `id` or `Id` from the `ObjectKey` union. By passing a union to the template literal, we can remove multiple substrings at once.

## 9. Remove strings with a certain prefix/suffix from a union

```ts
type ObjectKey = 'userId' | 'postId' | 'id' | 'userName' | 'postName'

type NonNameKey = Exclude<ObjectKey, `${string}Name`> // 'userId' | 'postId' | 'id'
```

You can use `Exclude` to remove all strings from a union that have a certain prefix or suffix.

In the example above, we're removing all strings that end with `Name` from the `ObjectKey` union.

Here, `${string}` is used to represent a string of any length that comes before the substring we want to remove.

To switch this over to match a certain prefix, we can move `${string}` to the end of the template literal instead.

## What did I miss?

`Exclude` is a very powerful utility type that can be used in a variety of ways. If you have other examples of how you've used `Exclude`, let me know on my [TypeScript Wizards Discord](https://mattpocock.com/discord)!
