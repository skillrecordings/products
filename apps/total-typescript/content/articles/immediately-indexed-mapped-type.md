# Transform Any Union in TypeScript with the IIMT

Since I first got into advanced TypeScript, I've been in love with a particular pattern. It formed the basis for one of my first-ever TypeScript tips, and it's been extraordinarily useful to me ever since.

I call it the **IIMT** (rhymes with 'limped'): the **Immediately Indexed Mapped Type**.

Here's what it looks like:

```typescript
type SomeObject = {
  a: string;
  b: number;
};

/**
 * | {
 *   key: 'a';
 * }
 * | {
 *   key: 'b';
 * }
 */
export type Example = {
  [K in keyof SomeObject]: {
    key: K;
  };
}[keyof SomeObject];
```

Before we discuss what's happening, let's look at the structure. We first create a mapped type:

```typescript
/**
 * {
 *   a: {
 *     key: 'a';
 *   },
 *   b: {
 *     key: 'b';
 *   }
 * }
 */
export type Example = {
  [K in keyof SomeObject]: {
    key: K;
  };
};
```

This mapped type iterates over the keys of `SomeObject` and creates a new object type for each key. In this example, we're creating a new object type with a single property, `key`, whose value is the key of the object.

We then immediately index into this mapped type with `keyof SomeObject`, which is `a | b`. This means that the resulting type is the union of all the _values_ of the mapped type.

```typescript
/**
 * | {
 *   key: 'a';
 * }
 * | {
 *   key: 'b';
 * }
 */
export type Example = {
  [K in keyof SomeObject]: {
    key: K;
  };
}[keyof SomeObject];
```

There you have it - we first create the mapped type, then immediately index into it: an IIMT.

## Iterating over unions

IIMTs give us a really clear model for iterating over members of a union while _also_ preserving the context of the entire union. Let's say we want to create a discriminated union based on a union of strings:

```typescript
type Fruit = "apple" | "banana" | "orange";

/**
 * | {
 *   thisFruit: 'apple';
 *   allFruit: 'apple' | 'banana' | 'orange';
 * }
 * | {
 *   thisFruit: 'banana';
 *   allFruit: 'apple' | 'banana' | 'orange';
 * }
 * | {
 *   thisFruit: 'orange';
 *   allFruit: 'apple' | 'banana' | 'orange';
 * }
 */
export type FruitInfo = {
  [F in Fruit]: {
    thisFruit: F;
    allFruit: Fruit;
  };
}[Fruit];
```

We can see that the resulting type is a union of three objects, each with a `thisFruit` property and an `allFruit` property. The `thisFruit` property is the _specific_ member of the union, and the `allFruit` property is the _entire_ union.

This lets us do really smart things within the scope where `F` is defined. What if we wanted to capture the _other_ fruit?

```typescript
/**
 * | {
 *   thisFruit: 'apple';
 *   allFruit: 'banana' | 'orange';
 * }
 * | {
 *   thisFruit: 'banana';
 *   allFruit: 'apple' | 'orange';
 * }
 * | {
 *   thisFruit: 'orange';
 *   allFruit: 'apple' | 'banana';
 * }
 */
export type FruitInfo = {
  [F in Fruit]: {
    thisFruit: F;
    allFruit: Exclude<Fruit, F>;
  };
}[Fruit];
```

Because `F` and `Fruit` are available in the same closure, we can use `Exclude` to remove the current fruit from the union. Very nice - and once you're used to the IIMT structure, pretty clear to read.

## Transforming unions of objects

IIMTs are also useful for transforming unions of objects. Let's say we have a union of objects, and we want to change a property to each object:

```typescript
type Event =
  | {
      type: "click";
      x: number;
      y: number;
    }
  | {
      type: "hover";
      element: HTMLElement;
    };
```

This might look like it doesn't fit our IIMT model. If we try to create a mapped type with `Event`, we'll get an error:

```typescript
type Example = {
  // Type 'Event' is not assignable to
  // type 'string | number | symbol'.
  [E in Event]: {};
};
```

That's because we can't create a mapped type out of something that isn't a key. But, fortunately, we can use `as` inside our mapped type to make it work:

```typescript
/**
 * PrefixType takes an object with a 'type' property
 * and prefixes the type with 'PREFIX_'.
 */
type PrefixType<E extends { type: string }> = {
  type: `PREFIX_${E["type"]}`;
} & Omit<E, "type">;

/**
 * | {
 *   type: 'PREFIX_click';
 *   x: number;
 *   y: number;
 * }
 * | {
 *   type: 'PREFIX_hover';
 *   element: HTMLElement;
 * }
 */
type Example = {
  [E in Event as E["type"]]: PrefixType<E>;
}[Event["type"]];
```

Here, we insert the `as E['type']` to remap the key to the type we want. We then use `PrefixType` to prefix the `type` property of each object.

Finally, we immediately index into the mapped type using `Event['type']`, which is `click | hover` - so we end up with a union of the prefixed objects.

## Examples

Let's tie this off by looking at a couple of examples:

### Object of CSS Units

```typescript
type CSSUnits = "px" | "em" | "rem" | "vw" | "vh";

/**
 * | {
 *   length: number;
 *   unit: 'px';
 * }
 * | {
 *   length: number;
 *   unit: 'em';
 * }
 * | {
 *   length: number;
 *   unit: 'rem';
 * }
 * | {
 *   length: number;
 *   unit: 'vw';
 * }
 * | {
 *   length: number;
 *   unit: 'vh';
 * }
 */
export type CSSLength = {
  [U in CSSUnits]: {
    length: number;
    unit: U;
  };
}[CSSUnits];
```

### HTTP Response Codes

```typescript
type SuccessResponseCode = 200;

type ErrorResponseCode = 400 | 500;

type ResponseCode =
  | SuccessResponseCode
  | ErrorResponseCode;

/**
 * | {
 *   code: 200;
 *   body: {
 *     success: true;
 *   };
 * }
 * | {
 *   code: 400;
 *   body: {
 *     success: false;
 *     error: string;
 *   };
 * }
 * | {
 *   code: 500;
 *   body: {
 *     success: false;
 *     error: string;
 *   };
 * }
 */
type ResponseShape = {
  [C in ResponseCode]: {
    code: C;
    body: C extends SuccessResponseCode
      ? { success: true }
      : { success: false; error: string };
  };
}[ResponseCode];
```
