# ConvertKit Subscribe Form

This form posts to a designated api URL (assumes `/api/convertkit/subscribe` by default)

## Installation

```bash
pnpm add @skillrecordings/convertkit
```

## Requirements

1. API endpoint under `/api/convertkit/subscribe` is required and you can import it from `@skillrecordings/convertkit-react-ui`
2. Following environment variables that are used to drive the form:

```env
NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM=convertkit_form_id
NEXT_PUBLIC_CONVERTKIT_TOKEN=convertkit_public_token
NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY=ck_subscriber_id
CONVERTKIT_API_SECRET=convertkit_api_secret
CONVERTKIT_BASE_URL=https://api.convertkit.com/v3/
```

## Props

| Prop               | Type                                          | Description                                                                          |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `formId`           | `number`                                      | the Convertkit form id, defaults to `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM` |
| `submitButtonElem` | `React.ReactElement`                          | an element to use as the button for the form submit                                  |
| `errorMessage`     | `string \| React.ReactElement`                | A string or element representing the message shown on error                          |
| `successMessage`   | `string \| React.ReactElement`                | A string or element representing the message shown on success                        |
| `actionLabel`      | `string`                                      | Label for the button (not used if submitButtonElem is used)                          |
| `onError`          | `(error?: any) => void`                       | Function to call on error                                                            |
| `onSuccess`        | `(subscriber?: ConvertkitSubscriber) => void` | Function to call on success                                                          |
| `subscribeApiURL`  | `string`                                      | Optional param to override the api url that gets posted to                           |
| `rest`             | `any`                                         | Anything else!                                                                       |

### Example

```tsx
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit-react-ui'

export default (
  <SubscribeToConvertkitForm
    formId={2610221}
    actionLabel="Continue Reading"
    onSuccess={(subscriber: any) => {
      if (subscriber) {
        const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
        router.push(redirectUrl)
      }
    }}
    successMessage="Thanks! A link to access this article just got sent to your email address."
  />
)
```

## Styles

This component can be styled using following attributes:

```scss
[data-sr-convertkit-subscribe-form] {
  [data-sr-input] {
  }
  [data-sr-input-label] {
  }
  [data-sr-button] {
  }
  [data-sr-button][disabled] {
  }
}
[data-sr-convertkit-subscribe-form='success'] {
}
[data-sr-convertkit-subscribe-form='error'] {
}
```

# Redirect URL Builder

## Props

| Arguments     | Type                        | Description                                                           |
| ------------- | --------------------------- | --------------------------------------------------------------------- |
| `subscriber`  | `ConvertkitSubscriber`      | convertkit subscriber object, can be passed from `onSuccess` function |
| `path`        | `string`                    | path to navigate to with `next/router`                                |
| `queryParams` | `{ [key: string]: string }` | additional query params (optional)                                    |
