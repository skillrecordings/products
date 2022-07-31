import {stripe} from '../utils/stripe'
import {Stripe} from 'stripe'

export async function getCheckoutSession(
  sessionId: string,
  params: Stripe.Checkout.SessionRetrieveParams = {
    expand: ['customer'],
  },
) {
  return await stripe.checkout.sessions.retrieve(sessionId, params)
}
