import {
  ChatPostMessageResponse,
  MessageAttachment,
  WebClient,
} from '@slack/web-api'
import {getSdk, Purchase, User} from '@skillrecordings/database'
import {SlackConfig} from '../next'
import {FeedbackContext} from '../core/types'
import {PurchaseInfo} from '@skillrecordings/commerce-server'
import {isEmpty} from 'lodash'
import pluralize from 'pluralize'

export type PostToSlackOptions = {
  attachments: MessageAttachment[]
  channel: string
  webClient: WebClient
  icon_emoji?: string
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
    icon_emoji = ':robot_face:',
    username = 'Announce Bot',
  } = options
  try {
    return await webClient.chat.postMessage({
      icon_emoji,
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
  if (!config.feedback) return false
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

export async function postRedemptionToSlack(
  email: string,
  productId: string,
  config: SlackConfig,
) {
  const {getProduct} = getSdk()
  const product = await getProduct({
    where: {id: productId},
  })

  if (!config.redeem) return false

  try {
    return await postToSlack({
      webClient: new WebClient(config.token),
      channel: config.redeem.channelId,
      text: `${email} redeemed ${product?.name}`,
      attachments: [
        {
          fallback: `Redeemed by ${email}`,
          text: `${email} redeemed a seat!`,
          color: '#5ceb34',
          title: `Redeemed ${product?.name}`,
        },
      ],
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function postSaleToSlack(
  purchaseInfo: PurchaseInfo,
  purchase: Purchase,
) {
  try {
    if (process.env.SLACK_TOKEN) {
      return await postToSlack({
        webClient: new WebClient(process.env.SLACK_TOKEN),
        channel: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
        text:
          process.env.NODE_ENV === 'production'
            ? `Someone purchased ${purchaseInfo.product.name}`
            : `Someone purchased ${purchaseInfo.product.name} in ${process.env.NODE_ENV}`,
        attachments: [
          {
            fallback: `Sold (${purchaseInfo.quantity}) ${purchaseInfo.product.name}`,
            text: `Somebody (${purchaseInfo.email}) bought ${
              purchaseInfo.quantity
            } ${pluralize('copy', purchaseInfo.quantity)} of ${
              purchaseInfo.product.name
            } for ${`$${purchase.totalAmount}`}${
              isEmpty(purchase.upgradedFromId) ? '' : ' as an upgrade'
            }`,
            color:
              process.env.NODE_ENV === 'production' ? '#eba234' : '#5ceb34',
            title: `Sold (${purchaseInfo.quantity}) ${purchaseInfo.product.name}`,
          },
        ],
      })
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function postBulkFormDetailsToSlack(
  postBulkFormDetails: {
    name: string
    email: string
    seats: string
    message: string
  },
  productName: string,
) {
  try {
    if (process.env.SLACK_TOKEN) {
      return await postToSlack({
        webClient: new WebClient(process.env.SLACK_TOKEN),
        channel: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
        username: 'Bulk Purchase Inquiry Bot',
        text:
          process.env.NODE_ENV === 'production'
            ? `Bulk Quote Requested for ${productName || 'product'}`
            : `Bulk Quote Requested for ${productName || 'product'} in ${
                process.env.NODE_ENV
              }`,
        attachments: [
          {
            fallback: `Bulk Quote Request: ${postBulkFormDetails.seats} seats`,
            text: `${postBulkFormDetails.name} (${
              postBulkFormDetails.email
            }) requested a  quote for ${postBulkFormDetails.seats} seats of ${
              productName || 'product'
            }. ${
              postBulkFormDetails.message
                ? `The user added some additional details: ${postBulkFormDetails.message}`
                : 'No additional details provided.'
            }`,
            color:
              process.env.NODE_ENV === 'production' ? '#eba234' : '#5ceb34',
            title: `Quote Requested for ${postBulkFormDetails.seats} seats of ${
              productName || 'product'
            }`,
          },
        ],
      })
    }
  } catch (e) {
    console.log(e)
    return false
  }
}
