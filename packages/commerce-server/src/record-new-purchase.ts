import {Stripe} from 'stripe'
import {first, isEmpty} from 'lodash'
import {type Purchase, prisma, getSdk} from '@skillrecordings/database'
import {
  getStripeSdk,
  Context as StripeContext,
  defaultContext as defaultStripeContext,
} from '@skillrecordings/stripe-sdk'
import {NEW_INDIVIDUAL_PURCHASE} from '@skillrecordings/types'
import {determinePurchaseType, PurchaseType} from './determine-purchase-type'

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

  const {customer, line_items, payment_intent} = checkoutSession
  const {email, name, id: stripeCustomerId} = customer as Stripe.Customer
  const lineItem = first(line_items?.data) as Stripe.LineItem
  const stripePrice = lineItem.price
  const quantity = lineItem.quantity || 1
  const stripeProduct = stripePrice?.product as Stripe.Product
  const {charges} = payment_intent as Stripe.PaymentIntent
  const stripeCharge = first<Stripe.Charge>(charges.data)
  const stripeChargeId = stripeCharge?.id as string
  const stripeChargeAmount = stripeCharge?.amount || 0

  return {
    stripeCustomerId,
    email,
    name,
    stripeProductId: stripeProduct.id,
    stripeProduct,
    stripeChargeId,
    quantity,
    stripeChargeAmount,
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
    quantity,
    stripeChargeAmount,
  } = purchaseInfo

  if (!email) throw new PurchaseError(`no-email`, checkoutSessionId)

  const {user, isNewUser} = await findOrCreateUser(email, name)

  const merchantProduct = await getMerchantProduct(stripeProductId)

  if (!merchantProduct)
    throw new PurchaseError(
      `no-associated-product`,
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

  const [_merchantCharge, purchase] = await createMerchantChargeAndPurchase({
    userId: user.id,
    stripeChargeId,
    merchantAccountId,
    merchantProductId,
    merchantCustomerId,
    productId,
    stripeChargeAmount,
  })

  // Check if this user has already purchased a bulk coupon, in which case,
  // we'll be able to treat this purchase as adding seats.
  const existingBulkCoupon = await prisma.coupon.findFirst({
    where: {
      maxUses: {
        gt: 1,
      },
      bulkCouponPurchases: {
        some: {userId: user.id},
      },
    },
  })

  // Note: if the user already has a bulk purchase/coupon, then if they are
  // only adding 1 seat to the team, then it is still a "bulk purchase" and
  // we need to add it to their existing Bulk Coupon.
  const isBulkPurchase = quantity > 1 || !!existingBulkCoupon

  let purchaseToReturn = purchase

  if (purchase && isBulkPurchase) {
    // Wrap a create and a dependent update in a transaction to be sure
    // that the coupon is created and the purchase points to that coupon.
    const updatedPurchase: Purchase = await prisma.$transaction(
      async (transaction) => {
        // 1. Create or Update Bulk Coupon Record
        let coupon = null
        if (existingBulkCoupon) {
          coupon = await transaction.coupon.update({
            where: {
              id: existingBulkCoupon.id,
            },
            data: {
              maxUses: existingBulkCoupon.maxUses + quantity,
            },
          })
        } else {
          coupon = await transaction.coupon.create({
            data: {
              restrictedToProductId: productId,
              maxUses: quantity,
              percentageDiscount: 1.0,
              status: 1,
            },
          })
        }

        // 2. Update existing purchase with bulkCouponId reference
        const updatedPurchase = await transaction.purchase.update({
          where: {
            id: purchase.id,
          },
          data: {
            bulkCouponId: coupon.id,
          },
        })

        return updatedPurchase
      },
    )

    purchaseToReturn = updatedPurchase
  }

  let purchaseType = await determinePurchaseType({checkoutSessionId})

  if (purchaseType === null) {
    // TODO: report that we did not get a valid purchase type for this checkoutSessionId
    //
    // then fallback to NEW_INDIVIDUAL_PURCHASE
    purchaseType = NEW_INDIVIDUAL_PURCHASE
  }

  return {
    purchase: purchaseToReturn,
    user,
    purchaseInfo,
    purchaseType,
  }
}
