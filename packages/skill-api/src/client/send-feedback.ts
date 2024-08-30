import {FeedbackContext} from '../core/types'

export type SendFeedbackOptions = {
  text: string
  context: FeedbackContext
  email?: string
}
/**
 * Used to send feedback to support email address from arbitrary locations
 * in the application.
 */
export async function sendFeedback(options: SendFeedbackOptions) {
  return await fetch('/api/skill/send-feedback', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then((response) => response.json())
}
