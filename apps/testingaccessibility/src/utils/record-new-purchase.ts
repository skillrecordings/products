import {stripe} from './stripe'
import {Stripe} from 'stripe'
import {first} from 'lodash'
import prisma from '../db'
import * as Sentry from '@sentry/nextjs'
import {getSdk} from '../lib/prisma-api'

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

async function stripeData(checkoutSessionId: string) {
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
  const {id: stripeProductId} = stripePrice?.product as Stripe.Product
  const {charges} = payment_intent as Stripe.PaymentIntent
  const stripeCharge = first<Stripe.Charge>(charges.data)
  const stripeChargeId = stripeCharge?.id as string
  const stripeChargeAmount = stripeCharge?.amount || 0

  return {
    stripeCustomerId,
    email,
    name,
    stripeProductId,
    stripeChargeId,
    quantity,
    stripeChargeAmount,
  }
}

export async function recordNewPurchase(
  checkoutSessionId: string,
): Promise<{user: any; purchase: any}> {
  const {
    findOrCreateUser,
    findOrCreateMerchantCustomer,
    createMerchantChargeAndPurchase,
  } = getSdk()

  const {
    stripeCustomerId,
    email,
    name,
    stripeProductId,
    stripeChargeId,
    quantity,
    stripeChargeAmount,
  } = await stripeData(checkoutSessionId)

  Sentry.addBreadcrumb({
    category: 'commerce',
    level: Sentry.Severity.Info,
    message: `recording a new purchase ${checkoutSessionId} ${email}`,
  })

  if (!email) throw new PurchaseError(`no-email`, checkoutSessionId)

  const {user} = await findOrCreateUser(email, name)

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
    userId: user.id,
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
    Sentry.addBreadcrumb({
      category: 'commerce',
      level: Sentry.Severity.Info,
      message: `creating a bulk coupon ${checkoutSessionId} ${purchase.id}`,
    })
    await prisma.coupon.create({
      data: {
        bulkPurchaseId: purchase.id,
        restrictedToProductId: productId,
        maxUses: quantity,
        percentageDiscount: 1.0,
        status: 1,
      },
    })
  }

  return {purchase, user}
}
