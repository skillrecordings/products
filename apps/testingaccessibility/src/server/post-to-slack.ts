import {WebClient} from '@slack/web-api'
import {PurchaseInfo} from '../utils/record-new-purchase'
import {isEmpty} from 'lodash'
import pluralize from 'pluralize'
import {getSdk} from '../lib/prisma-api'
import {Purchase} from '@skillrecordings/database'
import {postToSlack} from '@skillrecordings/skill-api'

const web = new WebClient(process.env.SLACK_TOKEN)

export async function postSaleToSlack(
  purchaseInfo: PurchaseInfo,
  purchase: Purchase,
) {
  try {
    return await postToSlack({
      webClient: web,
      channel: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
      text: `Someone purchased ${purchaseInfo.stripeProduct.name}`,
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
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function postRedemptionToSlack(email: string, productId: string) {
  const {getProduct} = getSdk()
  const product = await getProduct({
    where: {id: productId},
  })

  try {
    return await postToSlack({
      webClient: web,
      channel: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
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
