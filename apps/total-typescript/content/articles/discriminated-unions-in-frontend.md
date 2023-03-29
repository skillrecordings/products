# Discriminated Unions are a frontend dev's best friend

As a frontend developer, your job isn't just pixel-pushing. Most of the complexity in frontend comes from handling all the various states your app can be in.

It might be loading data, waiting for a form to be filled in, or sending a telemetry event - or all three at the same time.

If you aren't handling your states properly, you're likely to come unstuck. And _handling_ states starts with how they're _represented_ in types.

## 'Bag of optionals'

Let's imagine you're building a simple data loader. You might choose to use a type like this to represent its state:

```ts
interface State {
  status: 'loading' | 'error' | 'success'
  error?: Error
  data?: {
    id: string
  }
}

// Some examples:

const example: State = {
  status: 'loading',
}

const example2: State = {
  status: 'error',
  error: new Error('Oh no!'),
}
```

This seems pretty nice - we can check `status` to understand what kind of UI we should display on the screen.

Except - this type lets us declare all sorts of shapes which should be impossible:

```ts
const example3: State = {
  status: 'success',
  // Where's the data?!
}
```

Here, we're in a success state - which should let us access our data. But it doesn't exist!

```ts
const example4: State = {
  status: 'loading',
  // We're loading, but we still have an error?!
  error: new Error('Eek!'),
}
```

An here, we're in a loading state - but there's still an error in our data object!

This is because we've chosen to represent our state using what I call a 'bag of optionals' - an object full of optional properties.

Optional properties are best used when a value might or might not be present. In this case, that isn't right.

- When `status` is `loading`, `data` or `error` are _never_ present.
- When `status` is `success`, `data` is _always_ present.
- When `status` is `error`, `error` is _always_ present.

## Discriminated unions

The more accurate way to represent this is using a discriminated union.

Let's start by changing our state to be a union of object, each containing a status.

```ts
type State =
  | {
      status: 'loading'
    }
  | {
      status: 'success'
    }
  | {
      status: 'error'
    }
```

Now that we've got our scaffolding, we can start adding elements to each branch of the union. Let's re-add our error and data types.

```ts
type State =
  | {
      status: 'loading'
    }
  | {
      status: 'success'
      data: {
        id: string
      }
    }
  | {
      status: 'error'
      error: Error
    }
```

Now, our examples from above will start erroring.

```ts
// Error: Property 'data' is missing
const example3: State = {
  status: 'success',
}

const example4: State = {
  status: 'loading',
  // Error: Object literal may only specify known
  // properties, and 'error' does not exist
  error: new Error('Eek!'),
}
```

Our `State` type now properly represents all the possible states of the feature. That's a big step forward, but we're not done yet.

## Destructuring Discriminated Unions

Let's imagine we're inside a component in our codebase. We've received our piece of state, and we're looking to use it to render some JSX.

I'll use [React](https://react.dev) here, but this could be any frontend framework.

The first instinct of many developers will be to destructure the elements of `State`, but you'll immediately hit errors:

```tsx
const Component = () => {
  const [state, setState] = useState<State>({
    status: 'loading',
  })

  const {
    status,
    // Error: Property 'data' does not exist on type 'State'.
    data,
    // Error: Property 'error' does not exist on type 'State'.
    error,
  } = state
}
```

For many devs, this is going to be tricky to figure out. Both `data` and `error` _can_ exist on `State`, so why am I getting errors?

The reason is that we haven't tried to _discriminate_ the union yet! We don't know which state we're in, so the only properties available are the ones which all the members of the union share. Namely, `status`.

Once we've checked which branch of the union we're in, we can safely destructure `state`!

```ts
if (state.status === 'success') {
  const {data} = state
}
```

This strictness is a _feature_, not a bug. By ensuring you can only access data when the status equals `success`, you're encouraged to think of your app in terms of its states, and only access data in the states it's available.

## Summary

When you start thinking of your app in terms of discriminated states, a lot of things get easier.

Instead of a big optional bag of data, you'll start understanding the connections between data and UI.

Not only that, but you'll be able to think about props in a whole new way.

What if you need to display a component in two slightly different ways? Use a discriminated union:

```ts
type ModalProps =
  | {
      variant: 'with-description-and-button'
      buttonText: string
      description: string
      title: string
    }
  | {
      variant: 'base'
      title: string
    }
```

Here, `buttonText` and `description` will only be required when the variant passed in is `with-description-and-button`. Beautiful.

What are your favourite uses of discriminated unions? What problems have they helped you solve?
