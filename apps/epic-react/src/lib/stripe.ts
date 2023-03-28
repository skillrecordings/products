import {Stripe, stripe} from '@skillrecordings/commerce-server'

export async function getCheckoutSession(
  sessionId: string,
  params: Stripe.Checkout.SessionRetrieveParams = {
    expand: ['customer'],
  },
) {
  return await stripe.checkout.sessions.retrieve(sessionId, params)
}
