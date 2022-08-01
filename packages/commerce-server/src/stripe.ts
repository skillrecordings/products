import Stripe from 'stripe'

export * from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN, {
  apiVersion: '2020-08-27',
})
