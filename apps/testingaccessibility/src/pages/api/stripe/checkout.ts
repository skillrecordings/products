import type {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../../utils/stripe'
import {getAdminSDK} from '../../../lib/api'
import shortid from 'short-uuid'
import {add} from 'date-fns'
import {nanoid} from 'nanoid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const {getProduct, getMerchantCoupon} = getAdminSDK()
      const {productId, quantity = 1, couponId} = req.query

      const {products_by_pk: loadedProduct} = await getProduct({id: productId})

      let merchantCoupon

      if (couponId) {
        try {
          const {merchant_coupons_by_pk} = await getMerchantCoupon({
            id: couponId,
          })
          merchantCoupon = merchant_coupons_by_pk
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
        loadedProduct.merchant_products?.[0].merchant_prices?.[0].identifier

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
}
