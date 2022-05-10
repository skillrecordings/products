type FeedbackContext = {
  url: string
  category: 'general' | 'help'
  emotion: ':heart_eyes:' | ':unicorn_face:' | ':sob:'
  location: string
}

/**
 * Used to send feedback to support email address from arbitrary locations
 * in the application.
 * @param text The (markdown supported) text of the feedback.
 * @param context Details about the feedback.
 */
export async function sendFeedback(text: string, context: FeedbackContext) {
  return await fetch('/api/feedback', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      context,
    }),
  }).then((response) => response.json())
}
