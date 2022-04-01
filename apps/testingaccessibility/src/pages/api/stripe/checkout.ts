import type {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../../utils/stripe'
import {add} from 'date-fns'
import {getSdk} from '../../../lib/prisma-api'
import prisma from '../../../db'
import {withSentry} from '@sentry/nextjs'

export default withSentry(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
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

      let merchantCoupon

      if (couponId) {
        try {
          merchantCoupon = await getMerchantCoupon({
            where: {
              id: couponId as string,
            },
          })
        } catch (e) {
          console.error(`failed to lookup coupon [${couponId}]`)
        }
      }

      let discounts = []

      if (merchantCoupon?.identifier) {
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
        throw new Error('No product was found')
      }

      const price =
        loadedProduct.merchantProducts?.[0].merchantPrices?.[0].identifier

      if (!price) {
        throw new Error('No price for product')
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
        success_url: `${req.headers.origin}/thanks/verify?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/buy`,
      })

      if (session.url) {
        res.redirect(303, session.url)
      } else {
        res.status(500).json({error: 'no Stripe session URL'})
      }
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
})
