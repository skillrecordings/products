import {formatPricesForProduct} from './format-prices-for-product'
import {getCalculatedPrice} from './get-calculated-price'

import {
  MockContext,
  Context,
  createMockContext,
  getSdk,
  UpgradableProducts,
} from '@skillrecordings/database'
import {getBulkDiscountPercent} from './bulk-coupon'
import {first} from 'lodash'
import {MerchantCoupon, Prisma} from '@skillrecordings/database'

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

    const {calculatedPrice, unitPrice, appliedMerchantCoupon} =
      await formatPricesForProduct({
        productId: DEFAULT_PRODUCT_ID,
        quantity,
        merchantCouponId: SITE_SALE_COUPON_ID,
        ctx,
      })

    const expectedPrice = getCalculatedPrice({
      unitPrice,
      percentOfDiscount: appliedMerchantCoupon?.percentageDiscount.toNumber(),
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

test('multiple purchases meeting quantity threshold have bulk discount applied', async () => {
  const userId = 'user-123'
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([
    getMockCoupon('bulk', 0.05),
  ])
  mockCtx.prisma.purchase.findMany.mockResolvedValue([
    getMockExistingBulkPurchase(userId, DEFAULT_PRODUCT_ID, 3),
  ])
  const quantity = 2
  const product = await formatPricesForProduct({
    userId,
    productId: DEFAULT_PRODUCT_ID,
    quantity,
    ctx,
  })
  const expectedPrice = 190 // discounted 5% on 200

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

test('upgrade PPP purchase to unrestricted access', async () => {
  const ORIGINAL_PPP_PURCHASE_ID = 'original-ppp-purchase-id'
  const originalPurchasePrice = 25
  // mock the purchase to be upgraded, which was PPP restricted
  const mockPurchaseToBeUpgraded = {
    id: ORIGINAL_PPP_PURCHASE_ID,
    productId: DEFAULT_PRODUCT_ID,
    userId: 'default-user',
    createdAt: new Date(),
    status: 'Restricted',
    totalAmount: new Prisma.Decimal(originalPurchasePrice),
  }

  mockCtx.prisma.purchase.findFirst.mockResolvedValue(
    // @ts-ignore
    mockPurchaseToBeUpgraded,
  )

  const expectedPrice = mockPrice.unitAmount.toNumber() - originalPurchasePrice

  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    upgradeFromPurchaseId: ORIGINAL_PPP_PURCHASE_ID,
    country: 'US',
    ctx,
  })

  expect(product.calculatedPrice).toBe(expectedPrice)
})

test('upgrade PPP Purchase to Bundle w/ Unrestricted Access', async () => {
  const originalPurchasePrice = 25

  mockPPPPurchaseAndUpgradeProduct()

  const expectedPrice =
    mockUpgradePrice.unitAmount.toNumber() - originalPurchasePrice

  const product = await formatPricesForProduct({
    productId: UPGRADE_PRODUCT_ID,
    upgradeFromPurchaseId: ORIGINAL_PPP_PURCHASE_ID,
    country: 'US',
    ctx,
  })

  expect(product.calculatedPrice).toBe(expectedPrice)
})

test('an applied coupon should calculate the correct price even with ppp applied', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
    MOCK_SITE_SALE_COUPON,
  )
  const {calculatedPrice} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    merchantCouponId: SITE_SALE_COUPON_ID,
    ctx,
  })

  expect(calculatedPrice).toBe(
    mockPrice.unitAmount.toNumber() -
      mockPrice.unitAmount.toNumber() *
        MOCK_SITE_SALE_COUPON.percentageDiscount.toNumber(),
  )
})

test('PPP discount available if greater than sale price', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
    MOCK_SITE_SALE_COUPON,
  )
  const {availableCoupons} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    merchantCouponId: SITE_SALE_COUPON_ID,
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
    merchantCouponId: LARGE_SITE_SALE_COUPON_ID,
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

test('available ppp coupons should have country "IN" set', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    country: 'IN',
    ctx,
  })

  expect(first(product?.availableCoupons)?.country).toBe('IN')
})

test('available ppp coupons should have country "IN" set with active sale', async () => {
  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
    MOCK_SITE_SALE_COUPON,
  )
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    merchantCouponId: SITE_SALE_COUPON_ID,
    country: 'IN',
    ctx,
  })

  expect(first(product?.availableCoupons)?.country).toBe('IN')
})

test('sale coupon should have id property when ppp available', async () => {
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
    MOCK_SITE_SALE_COUPON,
  )

  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    merchantCouponId: SITE_SALE_COUPON_ID,
    country: 'IN',
    ctx,
  })

  expect(product.appliedMerchantCoupon?.id).toBeDefined()
})

test('product should have applied coupon present if "IN" and valid couponId', async () => {
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)
  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    merchantCouponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
    ctx,
  })

  expect(product?.appliedMerchantCoupon).toBeDefined()
})

test('product should calculate discount if country is "IN" and couponId', async () => {
  mockDefaultProduct()
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)

  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    merchantCouponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
    ctx,
  })

  const expectedPrice = 25

  expect(expectedPrice).toBe(product?.calculatedPrice)
})

test('PPP should be un-applied if quantity is over 1', async () => {
  mockDefaultProduct()
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)

  const quantity = 3

  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    merchantCouponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
    quantity,
    ctx,
  })

  const expectedPrice = 100 * quantity

  expect(expectedPrice).toBe(product?.calculatedPrice)
})

test('applied ppp coupon should have id property', async () => {
  mockDefaultProduct()
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)

  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    merchantCouponId: VALID_INDIA_COUPON_ID,
    country: 'IN',
    ctx,
  })

  expect(product.appliedMerchantCoupon?.id).toBeDefined()
})

test('applies fixed discount for previous purchase', async () => {
  mockDefaultAndUpgradeProduct()

  const product = await formatPricesForProduct({
    productId: UPGRADE_PRODUCT_ID,
    upgradeFromPurchaseId: UPGRADE_PURCHASE_ID,
    ctx,
  })

  expect(product.fullPrice).toBe(80)
  expect(product.calculatedPrice).toBe(80)
})

test('applies fixed discount for all previous purchases on PPP upgrade', async () => {
  mockTwoPurchasePPPPathToUpgradeProduct()

  // Price differential:
  // 180 - (25 + 20) => 135
  const expectedUpgradedPrice = 135

  const product = await formatPricesForProduct({
    productId: UPGRADE_PRODUCT_ID,
    upgradeFromPurchaseId: UPGRADED_PPP_PURCHASE_ID,
    ctx,
  })

  expect(product.calculatedPrice).toBe(expectedUpgradedPrice)
})

test('applies previous-purchase fixed discount and site-wide discount', async () => {
  // 20% site-wide discount
  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(
    MOCK_SITE_SALE_COUPON,
  )

  mockDefaultAndUpgradeProduct()

  const product = await formatPricesForProduct({
    productId: UPGRADE_PRODUCT_ID,
    upgradeFromPurchaseId: UPGRADE_PURCHASE_ID,
    merchantCouponId: SITE_SALE_COUPON_ID,
    ctx,
  })

  expect(product.fullPrice).toBe(80)
  expect(product.calculatedPrice).toBe(64)
})

test('PPP is auto-applied to upgrade when original purchase was PPP', async () => {
  mockPPPPurchaseAndUpgradeProduct()

  const product = await formatPricesForProduct({
    productId: UPGRADE_PRODUCT_ID,
    upgradeFromPurchaseId: UPGRADE_PURCHASE_ID,
    country: 'IN',
    ctx,
  })

  expect(product.calculatedPrice).toBe(20)
})

test('PPP can be forced to not auto-apply for upgrade', async () => {
  mockPPPPurchaseAndUpgradeProduct()

  const product = await formatPricesForProduct({
    productId: UPGRADE_PRODUCT_ID,
    upgradeFromPurchaseId: UPGRADE_PURCHASE_ID,
    country: 'IN',
    autoApplyPPP: false, // <-- instructing price formatter to *not* auto-apply PPP
    ctx,
  })

  // by not applying PPP, we are choosing to do an Unrestricted Bundle Upgrade
  // so the difference of the originally paid amount with the bundle price is
  // the calculated price.
  expect(product.calculatedPrice).toBe(155)
})

test('PPP coupon not available for non-ppp purchasers', async () => {
  const mockPurchases = [
    {
      status: 'Valid',
    },
    {
      status: 'Valid',
    },
  ]

  mockCtx.prisma.merchantCoupon.findMany.mockResolvedValue([MOCK_INDIA_COUPON])

  // @ts-ignore
  mockCtx.prisma.purchase.findMany.mockResolvedValue(mockPurchases)

  // @ts-ignore
  mockCtx.prisma.user.findFirst.mockResolvedValue({
    id: 'default-user',
  })

  const product = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    userId: 'default-user',
    country: 'IN',
    ctx,
  })

  expect(product.availableCoupons.length).toBe(0)
})

const UPGRADE_PURCHASE_ID = 'upgrade-product-id'
const DEFAULT_PRODUCT_ID = 'default-product-id'
const UPGRADE_PRODUCT_ID = 'upgrade-product-id'
const VALID_INDIA_COUPON_ID = 'valid-india-coupon-id'
const SITE_SALE_COUPON_ID = 'valid-site-coupon-id'
const LARGE_SITE_SALE_COUPON_ID = 'valid-jumbo-coupon-id'
const ORIGINAL_PPP_PURCHASE_ID = 'original-ppp-purchase-id'
const UPGRADED_PPP_PURCHASE_ID = 'upgraded-ppp-purchase-id'

const mockProduct = {
  id: DEFAULT_PRODUCT_ID,
  name: 'professional',
  createdAt: new Date(),
  key: 'hey',
  status: 1,
  quantityAvailable: -1,
}

const mockUpgradeProduct = {
  id: UPGRADE_PRODUCT_ID,
  name: 'professional',
  createdAt: new Date(),
  key: 'hey',
  status: 1,
  quantityAvailable: -1,
}

const mockPrice = {
  id: 'price-id',
  createdAt: new Date(),
  status: 1,
  productId: DEFAULT_PRODUCT_ID,
  nickname: 'bah',
  unitAmount: new Prisma.Decimal(100),
}

const mockUpgradePrice = {
  id: 'price-id',
  createdAt: new Date(),
  status: 1,
  productId: UPGRADE_PRODUCT_ID,
  nickname: 'bah',
  unitAmount: new Prisma.Decimal(180),
}

function mockDefaultProduct() {
  mockCtx.prisma.product.findFirst.mockResolvedValue(mockProduct)

  mockCtx.prisma.price.findFirst.mockResolvedValue(mockPrice)
}

function mockDefaultAndUpgradeProduct() {
  // can do this, or add a ts-ignore directive to the mock
  const extraPurchaseValues = {
    id: '123',
    ip_address: '127.0.0.1',
    city: 'Chicago',
    state: 'IL',
    country: 'US',
    couponId: null,
    bulkCouponId: null,
    redeemedBulkCouponId: null,
    merchantChargeId: null,
    merchantSessionId: null,
    status: 'Valid',
    upgradedFromId: null,
  }

  // mock the purchase to be upgraded
  const mockPurchaseToBeUpgraded = {
    productId: DEFAULT_PRODUCT_ID,
    userId: 'default-user',
    createdAt: new Date(),
    totalAmount: new Prisma.Decimal(25), // this doesn't line up with the `Price` objects, so may need to get removed or replaced
    ...extraPurchaseValues,
  }

  mockCtx.prisma.purchase.findFirst.mockResolvedValueOnce(
    mockPurchaseToBeUpgraded,
  )

  mockCtx.prisma.upgradableProducts.findMany.mockResolvedValue([
    {
      // @ts-ignore
      upgradableTo: {id: mockUpgradeProduct.id, name: mockUpgradeProduct.name},
      upgradableFrom: {id: mockProduct.id, name: mockProduct.name},
    },
  ])

  // mock the originally purchased product and its price
  // @ts-ignore
  mockCtx.prisma.product.findFirst.mockResolvedValueOnce({
    ...mockProduct,
    prices: [mockPrice],
  })

  // mock all purchases for user
  const mockAllPurchasesForUser = [
    {
      status: 'Valid',
    },
    {
      status: 'Valid',
    },
  ]
  // @ts-ignore
  mockCtx.prisma.purchase.findMany.mockResolvedValue(mockAllPurchasesForUser)

  // mock the product being upgraded to, with price
  // @ts-ignore
  mockCtx.prisma.product.findFirst.mockResolvedValueOnce({
    ...mockUpgradeProduct,
    prices: [mockUpgradePrice],
  })
  mockCtx.prisma.price.findFirst.mockResolvedValueOnce(mockUpgradePrice)

  // fixed discount price lookup
  mockCtx.prisma.price.findFirst.mockResolvedValueOnce(mockPrice)
}

const mockPPPPurchaseAndUpgradeProduct = () => {
  const originalPurchasePrice = 25
  // mock the purchase to be upgraded, which was PPP restricted
  const mockPurchaseToBeUpgraded = {
    id: ORIGINAL_PPP_PURCHASE_ID,
    productId: DEFAULT_PRODUCT_ID,
    userId: 'default-user',
    createdAt: new Date(),
    status: 'Restricted',
    totalAmount: new Prisma.Decimal(originalPurchasePrice),
  }

  mockCtx.prisma.purchase.findFirst.mockResolvedValueOnce(
    // @ts-ignore
    mockPurchaseToBeUpgraded,
  )

  mockCtx.prisma.upgradableProducts.findMany.mockResolvedValue([
    {
      // @ts-ignore
      upgradableTo: {id: mockUpgradeProduct.id, name: mockUpgradeProduct.name},
      upgradableFrom: {id: mockProduct.id, name: mockProduct.name},
    },
  ])

  // mock the originally purchased product and its price
  // @ts-ignore
  mockCtx.prisma.product.findFirst.mockResolvedValueOnce({
    ...mockProduct,
    prices: [mockPrice],
  })

  // mock all purchases for user
  const mockAllPurchasesForUser = [
    {
      status: 'Restricted',
    },
  ]
  // @ts-ignore
  mockCtx.prisma.purchase.findMany.mockResolvedValue(mockAllPurchasesForUser)

  // mock the product being upgraded to, with price
  // @ts-ignore
  mockCtx.prisma.product.findFirst.mockResolvedValueOnce({
    ...mockUpgradeProduct,
    prices: [mockUpgradePrice],
  })
  mockCtx.prisma.price.findFirst.mockResolvedValueOnce(mockUpgradePrice)

  mockCtx.prisma.merchantCoupon.findFirst.mockResolvedValue(MOCK_INDIA_COUPON)

  // fixed discount price lookup
  mockCtx.prisma.price.findFirst.mockResolvedValueOnce(mockPrice)
}

const mockTwoPurchasePPPPathToUpgradeProduct = () => {
  const originalPurchasePrice = 25
  // mock the purchase to be upgraded, which was PPP restricted
  const originalPPPPurchase = {
    id: ORIGINAL_PPP_PURCHASE_ID,
    productId: DEFAULT_PRODUCT_ID,
    userId: 'default-user',
    createdAt: new Date(),
    status: 'Restricted',
    totalAmount: new Prisma.Decimal(originalPurchasePrice),
  }

  const upgradePurchasePrice = 20

  const upgradedPPPPurchase = {
    id: UPGRADED_PPP_PURCHASE_ID,
    productId: UPGRADE_PRODUCT_ID,
    userId: 'default-user',
    createdAt: new Date(),
    status: 'Restricted',
    totalAmount: new Prisma.Decimal(upgradePurchasePrice),
    upgradedFromId: ORIGINAL_PPP_PURCHASE_ID,
  }

  mockCtx.prisma.purchase.findFirst.mockResolvedValueOnce(
    // @ts-ignore
    upgradedPPPPurchase,
  )

  // mock product originally upgraded from
  // @ts-ignore
  mockCtx.prisma.product.findFirst.mockResolvedValueOnce({
    ...mockUpgradeProduct,
    prices: [mockUpgradePrice],
  })

  // mock the previously purchased product and its price
  // @ts-ignore
  mockCtx.prisma.product.findFirst.mockResolvedValueOnce({
    ...mockUpgradeProduct,
    prices: [mockUpgradePrice],
  })
  mockCtx.prisma.price.findFirst.mockResolvedValueOnce(mockUpgradePrice)

  // mock all purchases for user
  const mockAllPurchasesForUser = [
    {
      status: 'Restricted',
    },
    {
      status: 'Restricted',
    },
  ]
  // @ts-ignore
  mockCtx.prisma.purchase.findMany.mockResolvedValue(mockAllPurchasesForUser)

  // Purchase chain lookup
  mockCtx.prisma.purchase.findFirst.mockResolvedValueOnce(
    // @ts-ignore
    originalPPPPurchase,
  )
}

function getMockCoupon(
  type: string,
  percentageDiscount: number,
): MerchantCoupon {
  return {
    id: `${type}-coupon`,
    type,
    percentageDiscount: new Prisma.Decimal(percentageDiscount),
    identifier: 'coupon',
    status: 1,
    merchantAccountId: 'merchant-account',
  }
}

function getMockExistingBulkPurchase(
  userId: string,
  productId: string,
  quantity: number,
) {
  const inconsequentialValues = {
    createdAt: new Date(),
    totalAmount: new Prisma.Decimal(300),
    ip_address: '',
    city: '',
    state: '',
    country: '',
    couponId: null,
    redeemedBulkCouponId: null,
    merchantChargeId: 'ch-123',
    upgradedFromId: null,
    status: 'Valid',
    bulkCouponId: 'coupon-123',
    merchantSessionId: 'ms-123',
  }

  return {
    id: 'purchase-123',
    userId,
    productId,
    bulkCoupon: {maxUses: quantity},
    ...inconsequentialValues,
  }
}

const MOCK_SITE_SALE_COUPON = {
  id: SITE_SALE_COUPON_ID,
  type: 'special',
  percentageDiscount: new Prisma.Decimal(0.2),
  identifier: 'coupon',
  status: 1,
  merchantAccountId: 'merchant-account',
}

const MOCK_LARGE_SITE_SALE_COUPON = {
  id: LARGE_SITE_SALE_COUPON_ID,
  type: 'special',
  percentageDiscount: new Prisma.Decimal(0.8),
  identifier: 'coupon',
  status: 1,
  merchantAccountId: 'merchant-account',
}

const MOCK_INDIA_COUPON = {
  id: VALID_INDIA_COUPON_ID,
  type: 'ppp',
  percentageDiscount: new Prisma.Decimal(0.75),
  identifier: 'coupon',
  status: 1,
  merchantAccountId: 'merchant-account',
}

async function expectedPriceForDefaultCoupon(quantity: number = 1) {
  const {getMerchantCoupon} = getSdk({ctx})
  const appliedMerchantCouponId = SITE_SALE_COUPON_ID
  const appliedMerchantCoupon = await getMerchantCoupon({
    where: {id: appliedMerchantCouponId},
  })
  const {calculatedPrice, unitPrice} = await formatPricesForProduct({
    productId: DEFAULT_PRODUCT_ID,
    quantity,
    merchantCouponId: appliedMerchantCouponId,
    ctx,
  })

  const expectedPrice = getCalculatedPrice({
    unitPrice: unitPrice,
    percentOfDiscount:
      appliedMerchantCoupon?.percentageDiscount.toNumber() || 0,
    quantity,
  })

  return {
    expectedPrice,
    calculatedPrice,
  }
}
