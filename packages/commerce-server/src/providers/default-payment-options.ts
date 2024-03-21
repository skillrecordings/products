import Stripe from 'stripe'

type StripeConfig = {
  stripeSecretKey: string
  apiVersion: '2020-08-27'
}

type StripeProvider = {name: 'stripe'; paymentClient: Stripe}
type StripeProviderFunction = (options: StripeConfig) => StripeProvider

type Paypal = 'paypal-client'
type PaypalProvider = {name: 'paypal'; paymentClient: Paypal}
type PaypalProviderFunction = (options: {
  paypalSecretKey: string
}) => PaypalProvider

type PaymentProviderOptions = StripeProvider | PaypalProvider

export type PaymentOptions = {
  providers: {
    stripe?: StripeProvider
    paypal?: PaypalProvider
  }
}

// define providers here for now,
// but eventually they can go in a `providers/` directory
export const StripeProvider: StripeProviderFunction = (config) => {
  const stripeClient = new Stripe(config.stripeSecretKey, {
    apiVersion: config.apiVersion,
  })

  return {
    name: 'stripe',
    paymentClient: stripeClient,
  }
}

// Two concepts for the providers:
// 1. We have the Payment Provider Functions (factories?) that take a few config values
// 2. We have the Payment Provider Options which are the resulting object of the above function

export const defaultPaymentOptions = (options: {
  stripeProvider?: StripeProvider
  paypalProvider?: PaypalProvider
}): PaymentOptions => {
  return {
    providers: {
      stripe: options.stripeProvider,
      paypal: options.paypalProvider,
    },
  }
}
