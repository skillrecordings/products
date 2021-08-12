import Stripe from 'stripe'
const STRIPE_SECRET = process.env.STRIPE_SECRET_TOKEN

const noopRetrieve = {retrieve: () => {}}
const stripe = () =>
  STRIPE_SECRET
    ? new Stripe(STRIPE_SECRET, {
        apiVersion: '2020-08-27',
      })
    : (() => {
        console.error('STRIPE_SECRET_TOKEN not found')
        return {
          checkout: {
            sessions: noopRetrieve,
          },
          prices: noopRetrieve,
        }
      })()

export const fetchStripeCheckoutSession = async (id: string) => {
  return await stripe().checkout.sessions.retrieve(id, {
    expand: ['customer'],
  })
}

export const fetchStripePrice = (id: string) =>
  stripe().prices.retrieve(id, {expand: ['product']})
