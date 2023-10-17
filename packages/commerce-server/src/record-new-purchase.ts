import {Stripe} from 'stripe'
import {first, isEmpty} from 'lodash'
import {type Purchase, getSdk} from '@skillrecordings/database'
import {
  getStripeSdk,
  Context as StripeContext,
  defaultContext as defaultStripeContext,
} from '@skillrecordings/stripe-sdk'
import {NEW_INDIVIDUAL_PURCHASE} from '@skillrecordings/types'
import {determinePurchaseType, PurchaseType} from './determine-purchase-type'

export const NO_ASSOCIATED_PRODUCT = 'no-associated-product'
export class PurchaseError extends Error {
  checkoutSessionId: string
  email?: string
  productId?: string

  constructor(
    message: string,
    checkoutSessionId: string,
    email?: string,
    productId?: string,
  ) {
    super(message)
    this.name = 'PurchaseError'
    this.checkoutSessionId = checkoutSessionId
    this.email = email
    this.productId = productId
  }
}

type StripeDataOptions = {
  checkoutSessionId: string
  stripeCtx?: StripeContext
}

export async function stripeData(options: StripeDataOptions) {
  const {stripeCtx, checkoutSessionId} = options
  const {getCheckoutSession} = getStripeSdk({ctx: stripeCtx})

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

  return {
    stripeCustomerId,
    email,
    name,
    stripeProductId: stripeProduct.id,
    stripeProduct,
    stripeChargeId,
    stripeCouponId,
    quantity,
    stripeChargeAmount,
    metadata,
  }
}

export type PurchaseInfo = {
  stripeCustomerId: string
  email: string | null
  name: string | null
  stripeProductId: string
  stripeChargeId: string
  quantity: number
  stripeChargeAmount: number
  stripeProduct: Stripe.Product
}

export async function recordNewPurchase(checkoutSessionId: string): Promise<{
  user: any
  purchase: Purchase
  purchaseInfo: PurchaseInfo
  purchaseType: PurchaseType
}> {
  const {
    findOrCreateUser,
    findOrCreateMerchantCustomer,
    createMerchantChargeAndPurchase,
    getMerchantProduct,
  } = getSdk()

  const purchaseInfo = await stripeData({checkoutSessionId})

  const {
    stripeCustomerId,
    email,
    name,
    stripeProductId,
    stripeChargeId,
    stripeCouponId,
    quantity,
    stripeChargeAmount,
    metadata,
  } = purchaseInfo

  if (!email) throw new PurchaseError(`no-email`, checkoutSessionId)

  const {user, isNewUser} = await findOrCreateUser(email, name)

  const merchantProduct = await getMerchantProduct(stripeProductId)

  if (!merchantProduct)
    throw new PurchaseError(
      NO_ASSOCIATED_PRODUCT,
      checkoutSessionId,
      email,
      stripeProductId,
    )
  const {id: merchantProductId, productId, merchantAccountId} = merchantProduct

  const {id: merchantCustomerId} = await findOrCreateMerchantCustomer({
    user: user,
    identifier: stripeCustomerId,
    merchantAccountId,
  })

  const [purchase] = await createMerchantChargeAndPurchase({
    userId: user.id,
    stripeChargeId,
    stripeCouponId,
    merchantAccountId,
    merchantProductId,
    merchantCustomerId,
    productId,
    stripeChargeAmount,
    quantity,
    bulk: metadata?.bulk === 'true',
    country: metadata?.country,
    appliedPPPStripeCouponId: metadata?.appliedPPPStripeCouponId,
    upgradedFromPurchaseId: metadata?.upgradedFromPurchaseId,
    usedCouponId: metadata?.usedCouponId,
    checkoutSessionId,
  })

  let purchaseType = await determinePurchaseType({checkoutSessionId})

  if (purchaseType === null) {
    // TODO: report that we did not get a valid purchase type for this checkoutSessionId
    //
    // then fallback to NEW_INDIVIDUAL_PURCHASE
    purchaseType = NEW_INDIVIDUAL_PURCHASE
  }

  return {
    purchase,
    user,
    purchaseInfo,
    purchaseType,
  }
}
