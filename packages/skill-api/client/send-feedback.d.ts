import {FeedbackContext} from '../core/types'
/**
 * Used to send feedback to support email address from arbitrary locations
 * in the application.
 * @param text The (markdown supported) text of the feedback.
 * @param context Details about the feedback.
 */
export declare function sendFeedback(
  text: string,
  context: FeedbackContext,
): Promise<any>
