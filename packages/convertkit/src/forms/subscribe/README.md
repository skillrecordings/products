Form component with first name and email address fields to subscribe to a form, tag, or sequence in ConvertKit.

## Requirements

1. API endpoint under `/api/convertkit/subscribe` is required and can be imported from `@skillrecordings/convertkit/dist/api/subscribe`
2. Following environment variables are required:
```env
NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM=convertkit_form_id
NEXT_PUBLIC_CONVERTKIT_TOKEN=convertkit_public_token
NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY=ck_subscriber_id
CONVERTKIT_API_SECRET=convertkit_api_secret
CONVERTKIT_BASE_URL=https://api.convertkit.com/v3/
```

## Default settings

```tsx
form: process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM
onSuccessRedirectUrl: '/confirm?ck_subscriber_id=123456&email_address=you@company.com'
onSuccess: () => router.push(onSuccessRedirectUrl)
actionLabel: 'Subscribe'
successMessage: 'Thanks!'
errorMessage: 'Something went wrong.'
```

## Examples

### Subscribe to default form

By default the form will subscribe to form id provided by environment variable and redirect to `/confirm` with email address and subscriber id passed as query params.

```tsx
<SubscribeForm />
```

You can customize onSuccess function or pass `false` if you wish to skip it entirely.

```tsx
<SubscribeForm onSuccess={() => console.log('success!')} />
```

### Subscribe to a custom form

Provide a form id to subscribe to and optionally change the redirect url.

```tsx
<SubscribeForm form={123456} onSuccessRedirectUrl="/confirm/something-else" />
```

### Subscribe and tag

Creates a subscriber and tags them with provided tag id.

```tsx
<SubscribeForm tag={123456} />
```

### Subscribe to a sequence

Subscribe to provided sequence id.

```tsx
<SubscribeForm sequence={123456} />
```

## Styles

This component can be styled using following attributes:

```scss
[data-sr-convertkit-subscribe-form] {
  [data-sr-input] {}
  [data-sr-input-label] {}
  [data-sr-button] {}
  [data-sr-button][disabled] {}
}
[data-sr-convertkit-subscribe-form='submitted'] {}
[data-sr-convertkit-subscribe-form='error'] {}
```

## Improvements

- Currently we're picking an endpoint based on whether `tag`, `form` or `sequence` id is provided. But since ConvertKit let’s us send an arbitrary number of tags to any of these endpoints, we should update the logic to allow that.