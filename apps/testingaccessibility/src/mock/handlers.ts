import {graphql} from 'msw'

export const DEFAULT_PRODUCT_ID = 'default-product-id'
export const VALID_INDIA_COUPON_ID = 'valid-coupon-india'

export const handlers = [
  graphql.query('getCouponsForTypeAndDiscount', (req, res, ctx) => {
    return res(
      ctx.data({
        merchant_coupons: [
          {
            id: 'test coupon',
            type: req?.body?.variables.type,
            percentage_discount: req?.body?.variables.percentage_discount,
          },
        ],
      }),
    )
  }),
  graphql.query('getMerchantCoupon', (req, res, ctx) => {
    const {id} = req?.body?.variables
    let coupon

    switch (id) {
      case VALID_INDIA_COUPON_ID:
        coupon = {
          percentage_discount: 0.75,
        }
        break
      default:
        coupon = null
    }

    return res(
      ctx.data({
        merchant_coupons_by_pk: coupon,
      }),
    )
  }),
  graphql.query('getCouponForCode', (req, res, ctx) => {
    return res(
      ctx.data({
        coupons: [
          {
            restricted_to_product_id: 'test',
            percentage_discount: 0.5,
          },
        ],
      }),
    )
  }),
  graphql.query('getProduct', (req, res, ctx) => {
    const {id} = req?.body?.variables
    return res(
      ctx.data({
        products_by_pk: {
          id,
          prices: [
            {
              id: 'test-price',
              unit_amount: 100,
            },
          ],
        },
      }),
    )
  }),
]
