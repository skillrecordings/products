import {Context, defaultContext} from './stripe-client-context'

type SDKOptions = {ctx?: Context}

export function getStripeSdk(
  {ctx = defaultContext}: SDKOptions = {ctx: defaultContext},
) {
  return {
    async getCheckoutSession(checkoutSessionId: string) {
      return await ctx.stripe.checkout.sessions.retrieve(checkoutSessionId, {
        expand: [
          'customer',
          'line_items.data.price.product',
          'payment_intent.charges',
        ],
      })
    },
  }
}
