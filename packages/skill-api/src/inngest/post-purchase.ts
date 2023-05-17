import {
  defaultNextAuthOptions,
  postSaleToSlack,
  sendServerEmail,
} from '../server'
import {recordNewPurchase} from '@skillrecordings/commerce-server'
import {Inngest} from 'inngest'
import {convertkitTagPurchase} from '../core/services/convertkit'
import {getSdk} from '@skillrecordings/database'

type CommercePurchaseCompleted = {
  name: 'commerce/purchase.completed'
  data: {
    stripeCheckoutSessionId: string
  }
}
type CommerceEvents = {
  'commerce/purchase.completed': CommercePurchaseCompleted
}

export const inngest = new Inngest<CommerceEvents>({
  name: process.env.NEXT_PUBLIC_SITE_TITLE || 'Skill Recordings',
})

export const commercePostPurchase = inngest.createFunction(
  {name: 'Commerce: Purchase Completed'},
  {event: 'commerce/purchase.completed'},
  async ({event, step}) => {
    step.sleep('1 second')

    const {user, purchase, purchaseInfo} = await step.run(
      'Record Purchase in DB',
      async () => {
        return await recordNewPurchase(event.data.stripeCheckoutSessionId)
      },
    )

    const purchaseId = purchase.id

    await step.run('Send Post Purchase Email', async () => {
      const nextAuthOptions = defaultNextAuthOptions({
        theme: {
          colorScheme: 'auto',
          brandColor: '#F59E0B',
        },
      })
      if (nextAuthOptions) {
        await sendServerEmail({
          email: user.email,
          callbackUrl: `${process.env.NEXT_PUBLIC_URL}/welcome?purchaseId=${purchase.id}`,
          nextAuthOptions,
          type: 'purchase',
        })
      } else {
        console.warn('⛔️ not sending email: no nextAuthOptions found')
      }
    })

    await step.run('Tag Purchase in ConvertKit', async () => {
      const {getPurchase} = getSdk()
      const purchase = await getPurchase({
        where: {id: purchaseId},
      })
      if (purchase) return await convertkitTagPurchase(user.email, purchase)
    })

    await step.run('Post Sale to Slack', async () => {
      const {getPurchase} = getSdk()
      const purchase = await getPurchase({
        where: {id: purchaseId},
      })
      if (purchase) return await postSaleToSlack(purchaseInfo, purchase)
    })

    return {event, body: 'now you can do stuff!'}
  },
)
