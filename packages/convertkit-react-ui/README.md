# Skill Recordings Convertkit Utils

## Next.js API routes

### POST /api/convertkit/subscribe

Add `/pages/api/convertkit/subscribe.ts` and update it to:

```typescript
import convertkitSubscribeHandler from '@skillrecordings/convertkit-react-ui'

export default convertkitSubscribeHandler

```

#### Environmental Variables

 - `NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`: The Convertkit form ID to use for signup.
 - `NEXT_PUBLIC_CONVERTKIT_TOKEN`: The Convertkit PUBLIC API token to use.
 - `NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY`: The Convertkit subscriber key to use (default value is `ck_subscriber_id`)

## React Components and Hooks

### Subscribe to a convertkit form

This package exports `SubscribeToConvertkitForm`

The form submits to `/api/convertkit/subscribe`

```typescript jsx
import * as React from 'react'

import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useRouter} from 'next/router'

const CallToActionForm: React.FC<any> = ({content}) => {
  const router = useRouter()

  return (
    <SubscribeToConvertkitForm
      actionLabel={content.button}
  onSuccess={(subscriber: any) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
      router.push(redirectUrl)
    }
  }}
  />
  )
}

export default CallToActionForm
```

#### styling the form

You'll need to add CSS to style the form. Internally this is using the `Input` and `Button` components from `@skillrecordings/react`. The form itself exposes `data-sr-convertkit-subscribe-form` and allows you to style the containing for
appropriately.

* `data-sr-convertkit-subscribe-form`: the `form` element
* `data-sr-button`: the submit button
* `data-sr-button-icon`: icon on the button, a spinner while loading
* `data-sr-input-wrapper`: a container around the `input` and `Label`
* `data-sr-input-asterisk`: the "required" indicator
* `data-sr-input`: the actual `input` itself
* `data-sr-input-label`: the `label` associated with the input

Here's an example:

```css
/* ——— subscribe form ——— */

[data-sr-convertkit-subscribe-form] {
  @apply w-full max-w-sm mx-auto flex flex-col;
  [data-sr-input] {
    @apply autofill:text-fill-black dark:autofill:text-fill-white autofill:caret-black dark:autofill:caret-white dark:bg-black w-full text-lg py-2 px-4 leading-7 border-gray-200 rounded-md autofill:border-violet-400 focus:ring-violet-400 focus:ring-2 focus:outline-none focus:border-transparent placeholder-gray-400 mb-4;
  }
  [data-sr-input-label] {
    @apply block text-base pb-1;
  }
  [data-sr-button] {
    @apply self-center font-medium text-lg rounded-full focus:bg-gray-500 focus:ring-2 focus:scale-90 focus:ring-black hover:scale-105 transition-all hover:shadow-xl focus:outline-none mt-4 sm:px-16 px-14 py-4 bg-gradient-to-r dark:from-pink-500 dark:to-purple-500 from-violet-500 to-pink-500 text-white ease-in-out;
  }
  [data-sr-input-asterisk] {
    @apply text-fuchsia-400 dark:text-fuchsia-400;
  }
}
```