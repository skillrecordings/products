import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'

export const stripeCheckoutCompleted = inngest.createFunction(
  {name: 'Stripe Checkout Completed'},
  {event: STRIPE_CHECKOUT_COMPLETED_EVENT},
  async ({event, step}) => {
    const {quantity} = event.data

    const teamPurchase = quantity > 1

    if (teamPurchase) {
    } else {
    }

    return 'yup, here we are'
  },
)
