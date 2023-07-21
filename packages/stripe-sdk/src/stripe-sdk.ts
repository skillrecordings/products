import {Context, defaultContext} from './stripe-client-context'

type SDKOptions = {ctx?: Context}

export function getStripeSdk(
  {ctx = defaultContext}: SDKOptions = {ctx: defaultContext},
) {
  return {
    async getCharge(chargeId: string) {
      return await ctx.stripe.charges.retrieve(chargeId, {
        expand: ['customer', 'invoice.subscription', 'invoice.lines'],
      })
    },
    async getCheckoutSession(checkoutSessionId: string) {
      return await ctx.stripe.checkout.sessions.retrieve(checkoutSessionId, {
        expand: [
          'customer',
          'line_items.data.price.product',
          'line_items.data.discounts',
          'payment_intent.charges',
        ],
      })
    },
  }
}
