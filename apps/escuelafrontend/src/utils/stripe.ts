import Stripe from 'stripe'

// if (!process.env.STRIPE_SECRET_TOKEN) {
//   throw new Error('STRIPE_SECRET_TOKEN not found')
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN, {
//   apiVersion: '2020-08-27',
// })

const STRIPE_SECRET = process.env.STRIPE_SECRET_TOKEN

const stripe = () =>
  STRIPE_SECRET
    ? new Stripe(STRIPE_SECRET, {
        apiVersion: '2020-08-27',
      })
    : (() => {
        console.error('STRIPE_SECRET_TOKEN not found')
        return {checkout: {sessions: {retrieve: () => {}}}}
      })()

export const fetchStripeCheckoutSession = async (id: string) => {
  return await stripe().checkout.sessions.retrieve(id, {
    expand: ['customer'],
  })
}
