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
      const {getProduct, getCouponForCode, getMerchantCoupon} = getAdminSDK()
      const {productId, quantity = 1, couponId} = req.query
      // Create Checkout Sessions from body params.

      // const prices = await stripe.prices.list({
      //   active: true,
      //   product: req.body.product_id,
      //   expand: ['data.tiers'],
      // })
      //
      // const promotionCode = await stripe.promotionCodes.create({
      //   coupon: coupon.identifier,
      // })
      //
      // stripe.coupons.list()

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

      console.log(merchantCoupon)

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
            // TODO: replace this with the `price` of the product you want to sell
            price,
            quantity: Number(quantity),
          },
        ],
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
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

// create_table "coupons", id: :serial, force: :cascade do |t|
// t.string "code", null: false
// t.decimal "percent_off", null: false
// t.datetime "created_at", null: false
// t.datetime "updated_at", null: false
// t.datetime "expires_at"
// t.integer "purchases_count", default: 0
// t.integer "max_uses"
// t.boolean "default", default: false
// t.integer "generated_by_purchase_id"
// t.jsonb "conditions", default: {}, null: false
// t.string "stripe_coupon_id"
// t.string "stripe_promotion_code_id"
// t.string "stripe_charge_id"
// t.index "((conditions ->> 'restricted_to_country'::text))", name: "index_coupons_on_country_condition"
// t.index ["conditions"], name: "index_coupons_on_conditions", using: :gin
// end

// create_table "purchases", id: :serial, force: :cascade do |t|
// t.integer "user_id"
// t.string "guid", null: false
// t.float "price"
// t.string "stripe_id"
// t.datetime "created_at", null: false
// t.datetime "updated_at", null: false
// t.string "ip_address"
// t.string "city"
// t.string "state"
// t.string "country"
// t.integer "coupon_id"
// t.integer "application_id"
// t.integer "upgraded_from_purchase_id"
// t.boolean "bulk", default: false
// t.integer "quantity"
// t.integer "bulk_coupon_id"
// t.string "purchase_state", default: "paid"
// end
