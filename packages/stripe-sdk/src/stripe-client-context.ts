import {mockDeep, DeepMockProxy} from 'jest-mock-extended'

import Stripe from 'stripe'

const stripeClient = new Stripe(process.env.STRIPE_SECRET_TOKEN, {
  apiVersion: '2020-08-27',
})

export const defaultContext: Context = {stripe: stripeClient}

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
