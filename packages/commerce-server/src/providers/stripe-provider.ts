import {getStripeSdk} from '@skillrecordings/stripe-sdk'
import {first} from 'lodash'
import Stripe from 'stripe'
import {
  StripeProviderFunction,
  PurchaseMetadata,
  PurchaseInfo,
  PurchaseInfoSchema,
} from './default-payment-options'
import {determinePurchaseType} from '../determine-purchase-type'

export const StripeProvider: StripeProviderFunction = (config) => {
  // TODO: once we're fully migrated to StripeProvider, we can remove the
  // `defaultStripeClient` option and just initialize the Stripe client
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

    const purchaseType = await determinePurchaseType({
      chargeIdentifier: stripeChargeId,
      email,
    })

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
      purchaseType,
    }

    return PurchaseInfoSchema.parse(info)
  }

  return {
    name: 'stripe',
    paymentClient: stripeClient,
    getPurchaseInfo: getStripePurchaseInfo,
  }
}
