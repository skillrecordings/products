import {WebClient} from '@slack/web-api'
import {Purchase} from '@prisma/client'
import {PurchaseInfo} from '../utils/record-new-purchase'
import {isEmpty} from 'lodash'
import pluralize from 'pluralize'

const web = new WebClient(process.env.SLACK_TOKEN)

export async function postSaleToSlack(
  purchaseInfo: PurchaseInfo,
  purchase: Purchase,
) {
  try {
    return await web.chat.postMessage({
      text: 'Hello world!',
      attachments: [
        {
          fallback: `Sold (${purchaseInfo.quantity}) ${purchaseInfo.stripeProduct.name}`,
          text: `Somebody bought ${purchaseInfo.quantity} ${pluralize(
            'copy',
            purchaseInfo.quantity,
          )} of ${
            purchaseInfo.stripeProduct.name
          } for ${`$${purchase.totalAmount}`}${
            isEmpty(purchase.upgradedFromId) ? '' : ' as an upgrade'
          }`,
          color: '#eba234',
          title: `Sold (${purchaseInfo.quantity}) ${purchaseInfo.stripeProduct.name}`,
        },
      ],
      channel: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
    })
  } catch (e) {
    console.log(e)
    return false
  }
}
