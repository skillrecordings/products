import {
  bulkCouponHasSeats,
  hasAvailableSeats,
  hasBulkPurchase,
  hasInvoice,
  hasValidPurchase,
} from './purchase-validators'

test('coupon has seats left if used count less than maxUses', () => {
  const coupon = {
    maxUses: 1,
    usedCount: 0,
  }
  expect(bulkCouponHasSeats(coupon)).toBe(true)
})

test('coupon has no seats left if used count equal to maxUses', () => {
  const coupon = {
    maxUses: 1,
    usedCount: 1,
  }
  expect(bulkCouponHasSeats(coupon)).toBe(false)
})

test('coupon has no seats left if used count greater then maxUses', () => {
  const coupon = {
    maxUses: 1,
    usedCount: 66,
  }
  expect(bulkCouponHasSeats(coupon)).toBe(false)
})

// test hasAvailableSeats with jest
test('has available seats if a purchase exists with a bulk coupon with seats', () => {
  const purchases = [
    {
      bulkCoupon: {
        maxUses: 1,
        usedCount: 0,
      },
    },
  ]
  expect(hasAvailableSeats(purchases)).toBe(true)
})

test('has no available seats if a purchase exists with a bulk coupon without seats', () => {
  const purchases = [
    {
      bulkCoupon: {
        maxUses: 1,
        usedCount: 2,
      },
    },
  ]
  expect(hasAvailableSeats(purchases)).toBe(false)
})

test('has a valid purchase', () => {
  const purchases = [{}]
  expect(hasValidPurchase(purchases)).toBe(true)
})

test('has an invalid purchase because it has a bulk coupon', () => {
  const purchases = [
    {
      bulkCoupon: {
        maxUses: 1,
        usedCount: 2,
      },
    },
  ]
  expect(hasValidPurchase(purchases)).toBe(false)
})

test('has a bulk purchase', () => {
  const purchases = [
    {},
    {
      bulkCoupon: {
        maxUses: 1,
        usedCount: 2,
      },
    },
  ]
  expect(hasBulkPurchase(purchases)).toBe(true)
})

test('hasInvoice', () => {
  const purchases = [
    {
      merchantChargeId: '123',
    },
  ]
  expect(hasInvoice(purchases)).toBe(true)
})
