import Stripe from 'stripe'
import {z} from 'zod'
import {purchaseTypeSchema} from '../determine-purchase-type'

type StripeConfig = {
  stripeSecretKey: string
  apiVersion: '2020-08-27'
}

export const PurchaseMetadata = z.object({
  country: z.string().optional(),
  appliedPPPStripeCouponId: z.string().optional(), // TODO: make this provider agnostic
  upgradedFromPurchaseId: z.string().optional(),
  usedCouponId: z.string().optional(),
})

export const PurchaseInfoSchema = z.object({
  customerIdentifier: z.string(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  productIdentifier: z.string(),
  product: z.object({name: z.string().nullable()}), // TODO: does this need to surface any other values?
  chargeIdentifier: z.string(),
  couponIdentifier: z.string().optional(),
  quantity: z.number(),
  chargeAmount: z.number(),
  metadata: PurchaseMetadata.passthrough().optional(),
  purchaseType: purchaseTypeSchema,
})
export type PurchaseInfo = z.infer<typeof PurchaseInfoSchema>

type PaymentProviderFunctionality = {
  getPurchaseInfo: (checkoutSessionId: string) => Promise<PurchaseInfo>
}

// This is the main type that represents payment providers to the outside world
export type PaymentProvider = PaymentProviderFunctionality &
  (
    | {name: 'stripe'; paymentClient: Stripe}
    | {name: 'paypal'; paymentClient: Paypal}
  )

type StripeProvider = {
  name: 'stripe'
  paymentClient: Stripe
} & PaymentProviderFunctionality
export type StripeProviderFunction = (
  options: StripeConfig | {defaultStripeClient: Stripe},
) => StripeProvider

type Paypal = 'paypal-client'
type PaypalProvider = {
  name: 'paypal'
  paymentClient: Paypal
} & PaymentProviderFunctionality
type PaypalProviderFunction = (options: {
  paypalSecretKey: string
}) => PaypalProvider

type PaymentProviderOptions = StripeProvider | PaypalProvider

type SupportedProviders = {
  stripe?: StripeProvider
  paypal?: PaypalProvider
}
export type PaymentOptions = {
  getProvider: (providerName: string) => PaymentProvider | undefined
  providers: SupportedProviders
}

type ProviderNames = Readonly<Array<keyof PaymentOptions['providers']>>

// Two concepts for the providers:
// 1. We have the Payment Provider Functions (factories?) that take a few config values
// 2. We have the Payment Provider Options which are the resulting object of the above function

export const defaultPaymentOptions = (options: {
  stripeProvider?: StripeProvider
  paypalProvider?: PaypalProvider
}): PaymentOptions => {
  const supportedProviderNames: ProviderNames = ['stripe', 'paypal'] as const

  const providers: SupportedProviders = {
    stripe: options.stripeProvider,
    paypal: options.paypalProvider,
  }

  return {
    getProvider: (providerName: string) => {
      for (const supportedProviderName of supportedProviderNames) {
        if (providerName === supportedProviderName) {
          return providers[supportedProviderName]
        }
      }

      return undefined
    },
    providers,
  }
}
