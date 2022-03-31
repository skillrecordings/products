import {stripe} from './stripe'
import {Stripe} from 'stripe'
import {first} from 'lodash'
import prisma from '../db'

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
  const {id: stripeProductId} = stripePrice?.product as Stripe.Product
  const {charges} = payment_intent as Stripe.PaymentIntent
  const stripeChargeId = first<Stripe.Charge>(charges.data)?.id as string

  return {
    stripeCustomerId,
    email,
    name,
    stripeProductId,
    stripeChargeId,
  }
}

export async function recordNewPurchase(
  checkoutSessionId: string,
): Promise<{user: any; purchase: any}> {
  const {stripeCustomerId, email, name, stripeProductId, stripeChargeId} =
    await stripeData(checkoutSessionId)

  if (!email) throw new Error(`no-email-${checkoutSessionId}`)

  return await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
      },
      create: {
        email,
        name,
      },
    })

    const merchantProduct = await prisma.merchantProduct.findFirst({
      where: {
        identifier: stripeProductId,
      },
    })

    if (!merchantProduct)
      throw new Error(`no-associated-product-${checkoutSessionId}`)

    const merchantCustomer = await prisma.merchantCustomer.upsert({
      where: {
        identifier: stripeCustomerId,
      },
      update: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        identifier: stripeCustomerId,
        merchantAccountId: merchantProduct.merchantAccountId,
      },
    })

    const merchantCharge = await prisma.merchantCharge.create({
      data: {
        userId: user.id,
        identifier: stripeChargeId,
        merchantAccountId: merchantProduct.merchantAccountId,
        merchantProductId: merchantProduct.id,
        merchantCustomerId: merchantCustomer.id,
      },
    })

    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        productId: merchantProduct.productId,
        merchantChargeId: merchantCharge.id,
      },
    })

    return {purchase, user}
  })
}
