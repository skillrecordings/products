import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'

export const stripeCheckoutCompleted = inngest.createFunction(
  {name: 'Stripe Checkout Completed'},
  {event: STRIPE_CHECKOUT_COMPLETED_EVENT},
  async ({event, step}) => {
    return 'yup, here we are'
  },
)
