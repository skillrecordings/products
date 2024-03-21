import {getStripeSdk} from '@skillrecordings/stripe-sdk'
import {first} from 'lodash'
import Stripe from 'stripe'
import {z} from 'zod'

type StripeConfig = {
  stripeSecretKey: string
  apiVersion: '2020-08-27'
}

const PurchaseMetadata = z.object({
  country: z.string().optional(),
  appliedPPPStripeCouponId: z.string().optional(), // TODO: make this provider agnostic
  upgradedFromPurchaseId: z.string().optional(),
  usedCouponId: z.string().optional(),
})

const PurchaseInfoSchema = z.object({
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
type StripeProviderFunction = (
  options: StripeConfig | {defaultStripeClient: Stripe},
) => StripeProvider

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

// TODO: this should have a shared PaymentProvider type that all providers conform to
// TODO: this can eventually move to it's own Stripe module in `providers/`
export const StripeProvider: StripeProviderFunction = (config) => {
  const stripeClient =
    'defaultStripeClient' in config
      ? config.defaultStripeClient
      : new Stripe(config.stripeSecretKey, {
          apiVersion: config.apiVersion,
        })

  const getStripePurchaseInfo = async (checkoutSessionId: string) => {
    const {getCheckoutSession} = getStripeSdk({ctx: {stripe: stripeClient}})

    const checkoutSession = await getCheckoutSession(checkoutSessionId)

    const {customer, line_items, payment_intent, metadata} = checkoutSession
    const {email, name, id: stripeCustomerId} = customer as Stripe.Customer
    const lineItem = first(line_items?.data) as Stripe.LineItem
    const stripePrice = lineItem.price
    const quantity = lineItem.quantity || 1
    const stripeProduct = stripePrice?.product as Stripe.Product
    const {charges} = payment_intent as Stripe.PaymentIntent
    const stripeCharge = first<Stripe.Charge>(charges.data)
    const stripeChargeId = stripeCharge?.id as string
    const stripeChargeAmount = stripeCharge?.amount || 0

    // extract MerchantCoupon identifier if used for purchase
    const discount = first(lineItem.discounts)
    const stripeCouponId = discount?.discount.coupon.id

    const parsedMetadata = metadata
      ? PurchaseMetadata.parse(metadata)
      : undefined

    const info: PurchaseInfo = {
      customerIdentifier: stripeCustomerId,
      email,
      name,
      productIdentifier: stripeProduct.id,
      product: stripeProduct,
      chargeIdentifier: stripeChargeId,
      couponIdentifier: stripeCouponId,
      quantity,
      chargeAmount: stripeChargeAmount,
      metadata: parsedMetadata,
    }

    return PurchaseInfoSchema.parse(info)
  }

  return {
    name: 'stripe',
    paymentClient: stripeClient,
    getPurchaseInfo: getStripePurchaseInfo,
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
