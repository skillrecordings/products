import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {applyBonuses} from 'inngest/functions/purchase/apply-bonuses-for-user'

export const stripeCheckoutCompleted = inngest.createFunction(
  {id: `stripe-checkout-completed`, name: 'Stripe Checkout Completed'},
  {event: STRIPE_CHECKOUT_COMPLETED_EVENT},
  async ({event, step}) => {
    const {quantity, created, purchaseId} = event.data

    const teamPurchase = quantity > 1

    const purchase = await step.run('load purchase', async () => {
      return prisma.purchase.findUnique({
        where: {
          id: purchaseId,
        },
      })
    })

    if (!purchase) {
      return 'invalid purchase id'
    }

    if (!teamPurchase) {
      const date = new Date(created)
      return await applyBonuses({date, step, user: event.user, purchase})
    }

    return 'yup, here we are'
  },
)
