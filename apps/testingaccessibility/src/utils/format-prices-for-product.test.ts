import {graphql} from 'msw'
import {getAdminSDK} from '../lib/api'
import {setupServer} from 'msw/node'
import {formatPricesForProduct} from './format-prices-for-product'

process.env.HASURA_GRAPHQL_ENDPOINT = 'http://localhost:8080/v1/graphql'
process.env.HASURA_ADMIN_SECRET = 'admin_secret'

export const handlers = [
  graphql.query('getCouponsForTypeAndDiscount', (req, res, ctx) => {
    return res(
      ctx.data({
        coupons: [
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
    return res(
      ctx.data({
        merchant_coupons_by_pk: {
          percentage_discount: 0.5,
        },
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
        },
      }),
    )
  }),
]

export const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({
    onUnhandledRequest(req) {
      console.error(
        'Found an unhandled %s request to %s body %s',
        req.method,
        req.url.href,
        req.body,
      )
    },
  })
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('will return a mock result', async () => {
  const {getProduct} = getAdminSDK()
  const id = 'this is my id'

  const product = await formatPricesForProduct({productId: id})
  // const {products_by_pk: product} = await getProduct({
  //   id,
  // })
  expect(product?.id).toBe(id)
})
