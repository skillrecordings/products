TODO: Write better readme explaining where the data gets send and how to configure it.

### Usage

1. Import and use `FeedbackProvider`

```jsx
// _app.tsx

import {FeedbackProvider} from '@skillrecordings/feedback-widget'

const MyApp = () => {
  return (
    <FeedbackProvider>
      <Component {...pageProps} />
    </FeedbackProvider>
  )
}
```

2. Add a button to open feedback dialog

```jsx
// navigation.tsx

import {useFeedback} from '@skillrecordings/feedback-widget'

const FeedbackButton = () => {
  const {setIsFeedbackDialogOpen} = useFeedback()

  return (
    <button
      onClick={() => {
        setIsFeedbackDialogOpen(true, 'navigation')
      }}
    >
      Send Feedback
    </button>
  )
}
```

3. Import styles

```css
/* globals.css */

@import '@skillrecordings/feedback-widget/dist/styles.css';
```
