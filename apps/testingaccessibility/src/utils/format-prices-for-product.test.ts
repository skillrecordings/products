import {formatPricesForProduct} from './format-prices-for-product'
import {server} from '../mock/setupTests'
import {DEFAULT_PRODUCT_ID, VALID_INDIA_COUPON_ID} from '../mock/handlers'
import {getCalculatedPriced} from './get-calculated-price'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('basic product returns product', async () => {
  const product = await formatPricesForProduct({productId: DEFAULT_PRODUCT_ID})
  expect(product).toBeDefined()
})

test('basic product calculatedPrice matches unitPrice', async () => {
  const product = await formatPricesForProduct({productId: DEFAULT_PRODUCT_ID})
  expect(product?.calculatedPrice).toBe(product?.unitPrice)
})

test('product with quantity under 5 calculatedPrice multiplies unitPrice', async () => {
  const quantity = 2
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
  })
  const expectedPrice = product?.unitPrice * quantity
  expect(product?.calculatedPrice).toBe(expectedPrice)
})

test('product with quantity 5 calculatedPrice to have discount applied', async () => {
  const quantity = 5
  const expectedDiscountMultiplier = 0.05
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
  })
  const expectedCalculatedPrice = getCalculatedPriced(
    product?.unitPrice,
    quantity,
    expectedDiscountMultiplier,
  )
  expect(product?.calculatedPrice).toBe(expectedCalculatedPrice)
})

test('product no available coupons if country is "US"', async () => {
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'US',
  })

  expect(product?.availableCoupons.length).toBe(0)
})

test('product should have available coupons if country is "IN"', async () => {
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
  })

  expect(product?.availableCoupons.length).toBeGreaterThan(0)
})

test('product should have applied coupon present if "IN" and valid couponId', async () => {
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    couponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
  })

  expect(product?.appliedCoupon).toBeDefined()
})

test('product should calculate discount if country is "IN" and couponId', async () => {
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    couponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
  })
  const expectedPrice = 25

  expect(product?.calculatedPrice).toBe(expectedPrice)
})
