import type {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../../utils/stripe'
import {add} from 'date-fns'
import {getSdk} from '../../../lib/prisma-api'
import prisma from '../../../db'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

export class CheckoutError extends Error {
  couponId?: string
  productId: string

  constructor(message: string, productId: string, couponId?: string) {
    super(message)
    this.name = 'CheckoutError'
    this.couponId = couponId
    this.productId = productId
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}

export default withSentry(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      Sentry.addBreadcrumb({
        category: 'checkout',
        level: Sentry.Severity.Info,
      })
      const {getMerchantCoupon} = getSdk()
      const {productId, quantity = 1, couponId} = req.query

      const loadedProduct = await prisma.product.findFirst({
        where: {id: productId as string},
        include: {
          merchantProducts: {
            include: {
              merchantPrices: true,
            },
          },
        },
      })

      const merchantCoupon = couponId
        ? await getMerchantCoupon({
            where: {
              id: couponId as string,
            },
          })
        : false

      let discounts = []

      if (merchantCoupon && merchantCoupon.identifier) {
        const {id} = await stripe.promotionCodes.create({
          coupon: merchantCoupon.identifier,
          max_redemptions: 1,
          expires_at: Math.floor(
            add(new Date(), {minutes: 30}).getTime() / 1000,
          ),
        })
        discounts.push({
          promotion_code: id,
        })
      }

      if (!loadedProduct) {
        throw new CheckoutError('No product was found', productId as string)
      }

      const price =
        loadedProduct.merchantProducts?.[0].merchantPrices?.[0].identifier

      if (!price) {
        throw new CheckoutError(
          'no-pricing-available',
          loadedProduct.id,
          couponId as string,
        )
      }

      const session = await stripe.checkout.sessions.create({
        discounts,
        line_items: [
          {
            price,
            quantity: Number(quantity),
          },
        ],
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.headers.origin}/thanks/purchase?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/buy`,
      })

      if (session.url) {
        res.redirect(303, session.url)
      } else {
        throw new CheckoutError(
          'no-stripe-session',
          loadedProduct.id,
          couponId as string,
        )
      }
    } catch (err: any) {
      Sentry.captureException(err)
      res
        .status(err.statusCode || 500)
        .json({error: true, message: err.message})
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
})
