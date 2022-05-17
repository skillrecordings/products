import {FeedbackContext} from '../core/types'

/**
 * Used to send feedback to support email address from arbitrary locations
 * in the application.
 * @param text The (markdown supported) text of the feedback.
 * @param context Details about the feedback.
 */
export async function sendFeedback(text: string, context: FeedbackContext) {
  return await fetch('/api/skill/send-feedback', {
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
