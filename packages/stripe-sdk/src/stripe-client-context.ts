import {mockDeep, DeepMockProxy} from 'jest-mock-extended'

import Stripe from 'stripe'

export {Stripe}

const eggheadReadOnlyStripeClient = process.env.STRIPE_EGGHEAD_RESTRICTED_TOKEN
  ? new Stripe(process.env.STRIPE_EGGHEAD_RESTRICTED_TOKEN, {
      apiVersion: '2020-08-27',
    })
  : null

const stripeClient = new Stripe(process.env.STRIPE_SECRET_TOKEN, {
  apiVersion: '2020-08-27',
})

export const defaultContext: Context = {stripe: stripeClient}
export const eggheadReadOnlyContext: Context | null =
  eggheadReadOnlyStripeClient ? {stripe: eggheadReadOnlyStripeClient} : null

export type Context = {
  stripe: Stripe
}

export type MockContext = {
  stripe: DeepMockProxy<Stripe>
}

export const createMockContext = (): MockContext => {
  return {
    stripe: mockDeep<Stripe>(),
  }
}
