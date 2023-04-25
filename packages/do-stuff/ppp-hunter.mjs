/**
 * This script is used to find PPP coupons that were used to purchase
 * courses and then update the purchase with the country that was
 * used to purchase the course.
 */

import * as dotenv from 'dotenv'
dotenv.config()

import Stripe from "stripe";
import {prisma} from '@skillrecordings/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_TOKEN, {
  apiVersion: "2020-08-27",
})

const merchantCharges = await prisma.merchantCharge.findMany({
  orderBy: [
    {
      createdAt: 'desc',
    }
  ],
  where: {
    merchantAccountId: 'tt_e730adb6-7be7-4841-9767-1671c1858534'
  },
  include: {
    purchase: true,
  }
})

for (const merchantCharge of merchantCharges) {
  const charge = await stripe.charges.retrieve(merchantCharge.identifier, {
    expand: ['payment_intent'],
  })
  const checkoutSession = await stripe.checkout.sessions.list({
    payment_intent: charge.payment_intent.id,
    expand: [
      'data.line_items.data.discounts',
    ],
  })

  const {line_items, metadata} = checkoutSession.data[0]
  const lineItem = line_items?.data[0]
  const discount = lineItem?.discounts?.[0]
  const stripeCouponId = discount?.discount.coupon.id

  if(stripeCouponId) {
    const stripeCoupon = await stripe.coupons.retrieve(stripeCouponId)
    if(stripeCoupon.metadata?.type === 'ppp') {
      if(metadata.country && !merchantCharge.purchase[0].country){
        const purchase = await prisma.purchase.update({
          where: {
            id: merchantCharge.purchase[0].id,
          },
          data: {
            country: metadata.country,
          }
        })
      }
    }
  }

  // await stripe.paymentIntents.update(
  //   intent.id,
  //   {metadata: session.data[0].metadata}
  // )
}