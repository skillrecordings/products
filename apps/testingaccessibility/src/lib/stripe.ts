import {stripe, Stripe} from '@skillrecordings/commerce-server'

export async function getCheckoutSession(
  sessionId: string,
  params: Stripe.Checkout.SessionRetrieveParams = {
    expand: ['customer', 'line_items'],
  },
) {
  return await stripe.checkout.sessions.retrieve(sessionId, params)
}
