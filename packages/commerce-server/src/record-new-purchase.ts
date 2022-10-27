import {Stripe} from 'stripe'
import {first} from 'lodash'
import {type Purchase, prisma, getSdk} from '@skillrecordings/database'
import {stripe} from './stripe'

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

export async function stripeData(checkoutSessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    checkoutSessionId,
    {
      expand: [
        'customer',
        'line_items.data.price.product',
        'payment_intent.charges',
      ],
    },
  )

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
}> {
  const {
    findOrCreateUser,
    findOrCreateMerchantCustomer,
    createMerchantChargeAndPurchase,
  } = getSdk()

  const purchaseInfo = await stripeData(checkoutSessionId)

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

  const merchantProduct = await prisma.merchantProduct.findFirst({
    where: {
      identifier: stripeProductId,
    },
  })

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

  if (purchase && quantity > 1) {
    // we need to detect and handle the scenario where the Coupon already
    // exists and we are just tying a new purchase to it. Eventually.

    // Wrap a create and a dependent update in a transaction to be sure
    // that the coupon is created and the purchase points to that coupon.
    const updatedPurchase: Purchase = await prisma.$transaction(
      async (transaction) => {
        // 1. Create bulk coupon record
        const coupon = await transaction.coupon.create({
          data: {
            restrictedToProductId: productId,
            maxUses: quantity,
            percentageDiscount: 1.0,
            status: 1,
          },
        })

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

    return {purchase: updatedPurchase, user, purchaseInfo}
  } else {
    return {purchase, user, purchaseInfo}
  }
}
