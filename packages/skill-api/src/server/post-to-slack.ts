import {
  ChatPostMessageResponse,
  MessageAttachment,
  WebClient,
} from '@slack/web-api'
import {User} from '@skillrecordings/database'
import {SlackConfig} from '../next'
import {FeedbackContext} from '../core/types'

export type PostToSlackOptions = {
  attachments: MessageAttachment[]
  channel: string
  webClient: WebClient
  username?: string
  text?: string
}

export async function postToSlack(
  options: PostToSlackOptions,
): Promise<ChatPostMessageResponse> {
  const {
    webClient,
    attachments,
    channel,
    text,
    username = 'Announce Bot',
  } = options
  try {
    return await webClient.chat.postMessage({
      username,
      attachments,
      channel,
      text,
    })
  } catch (e) {
    console.log(e)
    return Promise.reject(e)
  }
}

export async function postFeedbackToSlack(
  feedbackText: string,
  feedbackContext: FeedbackContext = {},
  user: User,
  config: SlackConfig,
) {
  try {
    return await postToSlack({
      webClient: new WebClient(config.token),
      channel: config.feedback.channelId,
      username: config.feedback.botUsername,
      text: `${user.name ? user.name : user.email} said:`,
      attachments: [
        {
          text: `${feedbackContext.url}\n\n${feedbackText}`,
          color: '#4893c9',
          title: `${feedbackContext.emotion} ${
            feedbackContext.category === 'general' ? 'Feedback' : 'Help request'
          } from ${user.name} (${user.email})`,
        },
      ],
    })
  } catch (e) {
    console.log(e)
    return false
  }
}
