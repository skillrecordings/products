import {SendFeedbackFromUserOptions} from '../types'
import {OutgoingResponse} from '../index'
export declare function sendFeedbackFromUser({
  userId,
  feedbackText,
  context,
  prisma,
}: SendFeedbackFromUserOptions): Promise<OutgoingResponse>
