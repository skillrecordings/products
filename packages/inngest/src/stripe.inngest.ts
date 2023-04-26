import {inngest} from './inngest.server'

export type StripeCheckoutEvents = {
  'stripe/checkout.session.completed': {
    checkoutSessionId: string
  }
}

export const stripeCheckoutCompleted = inngest.createFunction(
  {name: 'Stripe Checkout Completed'},
  {event: 'stripe/checkout.session.completed'},
  ({event, step}) => {
    step.sleep('1 second')
    return {event, body: 'now you can do stuff!'}
  },
)
