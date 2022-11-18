import Stripe from 'stripe'

export const stripe = new Stripe('38743', {
  apiVersion: '2020-08-27',
})
