import {formatPricesForProduct} from './format-prices-for-product'
import {getCalculatedPriced} from './get-calculated-price'

import {MockContext, Context, createMockContext} from '../lib/context'
import {Decimal} from '@prisma/client/runtime'
import {getSdk} from '../lib/prisma-api'
import {getBulkDiscountPercent} from './bulk-coupon'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
  mockDefaultProduct()
})

test('basic product returns product', async () => {
  await expect(
    formatPricesForProduct({
      productId: DEFAULT_PRODUCT_ID,
      ctx,
    }),
  ).resolves.toBeDefined()
})

test('basic product calculatedPrice matches unitPrice', async () => {
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    ctx,
  })
  const expectedPrice = product?.unitPrice
  expect(expectedPrice).toBe(product?.calculatedPrice)
})

test('product with quantity under 5 calculatedPrice multiplies unitPrice', async () => {
  const quantity = 2
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
    ctx,
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
    mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([
      getMockCoupon('bulk', getBulkDiscountPercent(quantity)),
    ])

    mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
      MOCK_SITE_SALE_COUPON,
    )

    const {expectedPrice, calculatedPrice} =
      await expectedPriceForDefaultCoupon(quantity)
    expect(expectedPrice).toBe(calculatedPrice)
  })
}

for (const quantity of [69, 89, 99]) {
  test(`applies bulk [${quantity}] discount is more than default`, async () => {
    mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([
      getMockCoupon('bulk', getBulkDiscountPercent(quantity)),
    ])

    mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
      MOCK_SITE_SALE_COUPON,
    )

    const {calculatedPrice, unitPrice, appliedCoupon} =
      await formatPricesForProduct({
        productId: DEFAULT_PRODUCT_ID,
        quantity,
        couponId: SITE_SALE_COUPON_ID,
        ctx,
      })

    const expectedPrice = getCalculatedPriced({
      unitPrice,
      percentOfDiscount: appliedCoupon?.percentageDiscount.toNumber(),
      quantity,
    })

    expect(expectedPrice).toBe(calculatedPrice)
  })
}

test('product with quantity 5 calculatedPrice to have discount applied', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([
    getMockCoupon('bulk', 0.05),
  ])
  const quantity = 5
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
    ctx,
  })
  const expectedPrice = 475

  expect(expectedPrice).toBe(product?.calculatedPrice)
})

test('product no available coupons if country is "US"', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'US',
    ctx,
  })

  expect(product?.availableCoupons.length).toBe(0)
})

test('PPP discount available if greater than sale price', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
    MOCK_SITE_SALE_COUPON,
  )
  const {availableCoupons} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    couponId: SITE_SALE_COUPON_ID,
    ctx,
  })

  expect(availableCoupons.length).toBeGreaterThan(0)
})

test('PPP discount not available if less than sale price', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
    MOCK_LARGE_SITE_SALE_COUPON,
  )
  const {availableCoupons} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    couponId: LARGE_SITE_SALE_COUPON_ID,
    ctx,
  })

  expect(availableCoupons.length).toBe(0)
})

test('product should have available coupons if country is "IN"', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    ctx,
  })

  expect(product?.availableCoupons.length).toBeGreaterThan(0)
})

test('product should have applied coupon present if "IN" and valid couponId', async () => {
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    couponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
    ctx,
  })

  expect(product?.appliedCoupon).toBeDefined()
})

test('product should calculate discount if country is "IN" and couponId', async () => {
  mockDefaultProduct()
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)

  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    couponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
    ctx,
  })

  console.log(product)
  const expectedPrice = 25

  expect(expectedPrice).toBe(product?.calculatedPrice)
})

const DEFAULT_PRODUCT_ID = 'cl1e7vgtp0038dr5g5q5ymled'
const VALID_INDIA_COUPON_ID = 'valid-india-coupon-id'
const SITE_SALE_COUPON_ID = 'valid-site-coupon-id'
const LARGE_SITE_SALE_COUPON_ID = 'valid-jumbo-coupon-id'

function mockDefaultProduct() {
  mockCtx.prisma.product.findFirst.mockResolvedValue({
    id: DEFAULT_PRODUCT_ID,
    name: 'professional',
    createdAt: new Date(),
    key: 'hey',
    status: 1,
  })

  mockCtx.prisma.price.findFirst.mockResolvedValue({
    id: 'price-id',
    createdAt: new Date(),
    status: 1,
    productId: DEFAULT_PRODUCT_ID,
    nickname: 'bah',
    unitAmount: new Decimal(100),
  })
}

function getMockCoupon(type: string, percentageDiscount: number) {
  return {
    id: `${type}-coupon`,
    type,
    percentageDiscount: new Decimal(percentageDiscount),
    identifier: 'coupon',
    status: 1,
    merchantAccountId: 'merchant-account',
  }
}

const MOCK_SITE_SALE_COUPON = {
  id: SITE_SALE_COUPON_ID,
  type: 'site',
  percentageDiscount: new Decimal(0.2),
  identifier: 'coupon',
  status: 1,
  merchantAccountId: 'merchant-account',
}

const MOCK_LARGE_SITE_SALE_COUPON = {
  id: LARGE_SITE_SALE_COUPON_ID,
  type: 'site',
  percentageDiscount: new Decimal(0.8),
  identifier: 'coupon',
  status: 1,
  merchantAccountId: 'merchant-account',
}

const MOCK_INDIA_COUPON = {
  id: VALID_INDIA_COUPON_ID,
  type: 'ppp',
  percentageDiscount: new Decimal(0.75),
  identifier: 'coupon',
  status: 1,
  merchantAccountId: 'merchant-account',
}

async function expectedPriceForDefaultCoupon(quantity: number = 1) {
  const {getMerchantCoupon} = getSdk(ctx)
  const appliedCouponId = SITE_SALE_COUPON_ID
  const appliedCoupon = await getMerchantCoupon({
    where: {id: appliedCouponId},
  })
  const {calculatedPrice, unitPrice} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
    couponId: appliedCouponId,
    ctx,
  })

  const expectedPrice = getCalculatedPriced({
    unitPrice: unitPrice,
    percentOfDiscount: appliedCoupon?.percentageDiscount.toNumber() || 0,
    quantity,
  })

  return {
    expectedPrice,
    calculatedPrice,
  }
}
