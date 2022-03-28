import {formatPricesForProduct} from './format-prices-for-product'
import {server} from '../mock/setupTests'
import {
  DEFAULT_PRODUCT_ID,
  VALID_INDIA_COUPON_ID,
  SITE_SALE_COUPON_ID,
  LARGE_SITE_SALE_COUPON_ID,
} from '../mock/handlers'
import {getAdminSDK} from '../lib/api'
import {getCalculatedPriced} from './get-calculated-price'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const {getMerchantCoupon} = getAdminSDK()

test('basic product returns product', async () => {
  const product = await formatPricesForProduct({productId: DEFAULT_PRODUCT_ID})
  expect(product).toBeDefined()
})

test('basic product calculatedPrice matches unitPrice', async () => {
  const product = await formatPricesForProduct({productId: DEFAULT_PRODUCT_ID})
  const expectedPrice = product?.unitPrice
  expect(expectedPrice).toBe(product?.calculatedPrice)
})

test('product with quantity under 5 calculatedPrice multiplies unitPrice', async () => {
  const quantity = 2
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
  })
  const expectedPrice = product?.unitPrice * quantity
  expect(expectedPrice).toBe(product?.calculatedPrice)
})

test('applies sale coupon as default', async () => {
  const {expectedPrice, calculatedPrice} = await expectedPriceForDefaultCoupon()
  expect(expectedPrice).toBe(calculatedPrice)
})

for (const quantity of [7, 13, 26, 42]) {
  test(`applies sale coupon when bulk [${quantity}] discount is smaller`, async () => {
    const {expectedPrice, calculatedPrice} =
      await expectedPriceForDefaultCoupon(quantity)
    expect(expectedPrice).toBe(calculatedPrice)
  })
}

for (const quantity of [69, 89, 99]) {
  test(`applies bulk [${quantity}] discount is more than default`, async () => {
    const {calculatedPrice, unitPrice, appliedCoupon} =
      await formatPricesForProduct({
        productId: DEFAULT_PRODUCT_ID,
        quantity,
        couponId: SITE_SALE_COUPON_ID,
      })

    const expectedPrice = getCalculatedPriced({
      unitPrice,
      percentOfDiscount: appliedCoupon?.percentage_discount,
      quantity,
    })

    expect(expectedPrice).toBe(calculatedPrice)
  })
}

test('product with quantity 5 calculatedPrice to have discount applied', async () => {
  const quantity = 5
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
  })
  const expectedPrice = 475

  expect(expectedPrice).toBe(product?.calculatedPrice)
})

test('product no available coupons if country is "US"', async () => {
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'US',
  })

  expect(product?.availableCoupons.length).toBe(0)
})

test('PPP discount available if greater than sale price', async () => {
  const {availableCoupons} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    couponId: SITE_SALE_COUPON_ID,
  })

  expect(availableCoupons.length).toBeGreaterThan(0)
})

test('PPP discount not available if less than sale price', async () => {
  const {availableCoupons} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    couponId: LARGE_SITE_SALE_COUPON_ID,
  })

  expect(availableCoupons.length).toBe(0)
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

  expect(expectedPrice).toBe(product?.calculatedPrice)
})

async function expectedPriceForDefaultCoupon(quantity: number = 1) {
  const appliedCouponId = SITE_SALE_COUPON_ID
  const {merchant_coupons_by_pk: appliedCoupon} = await getMerchantCoupon({
    id: appliedCouponId,
  })
  const {calculatedPrice, unitPrice} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
    couponId: appliedCouponId,
  })

  const expectedPrice = getCalculatedPriced({
    unitPrice: unitPrice,
    percentOfDiscount: appliedCoupon?.percentage_discount,
    quantity,
  })

  return {
    expectedPrice,
    calculatedPrice,
  }
}
