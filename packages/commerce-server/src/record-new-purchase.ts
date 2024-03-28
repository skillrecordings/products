import {Stripe} from 'stripe'
import {first} from 'lodash'
import {type Purchase, getSdk} from '@skillrecordings/database'
import {
  getStripeSdk,
  Context as StripeContext,
} from '@skillrecordings/stripe-sdk'
import {PurchaseType} from './determine-purchase-type'
import {
  PaymentProvider,
  PurchaseInfo,
} from './providers/default-payment-options'

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

export async function recordNewPurchase(
  checkoutSessionId: string,
  options: {paymentProvider: PaymentProvider},
): Promise<{
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

  const purchaseInfo = await options.paymentProvider.getPurchaseInfo(
    checkoutSessionId,
  )

  const {
    customerIdentifier,
    email,
    name,
    productIdentifier,
    chargeIdentifier,
    couponIdentifier,
    quantity,
    chargeAmount,
    metadata,
    purchaseType,
  } = purchaseInfo

  if (!email) throw new PurchaseError(`no-email`, checkoutSessionId)

  const {user, isNewUser} = await findOrCreateUser(email, name)

  const merchantProduct = await getMerchantProduct(productIdentifier)

  if (!merchantProduct)
    throw new PurchaseError(
      NO_ASSOCIATED_PRODUCT,
      checkoutSessionId,
      email,
      productIdentifier,
    )
  const {id: merchantProductId, productId, merchantAccountId} = merchantProduct

  const {id: merchantCustomerId} = await findOrCreateMerchantCustomer({
    user: user,
    identifier: customerIdentifier,
    merchantAccountId,
  })

  const purchase = await createMerchantChargeAndPurchase({
    userId: user.id,
    stripeChargeId: chargeIdentifier,
    stripeCouponId: couponIdentifier,
    merchantAccountId,
    merchantProductId,
    merchantCustomerId,
    productId,
    stripeChargeAmount: chargeAmount,
    quantity,
    bulk: metadata?.bulk === 'true',
    country: metadata?.country,
    appliedPPPStripeCouponId: metadata?.appliedPPPStripeCouponId,
    upgradedFromPurchaseId: metadata?.upgradedFromPurchaseId,
    usedCouponId: metadata?.usedCouponId,
    checkoutSessionId,
  })

  return {
    purchase,
    user,
    purchaseInfo,
    purchaseType,
  }
}
