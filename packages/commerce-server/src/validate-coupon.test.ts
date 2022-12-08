import {Prisma} from '@skillrecordings/database'
import {validateCoupon} from './validate-coupon'
import {Coupon} from '@prisma/client'

test('if no coupon is passed it is invalid', async () => {
  const coupon = null
  const result = validateCoupon(coupon)
  expect(result.isValid).toEqual(false)
  expect(result.isRedeemable).toEqual(false)
})

test('if a coupon is passed that is expired it is invalid', async () => {
  const coupon = {
    id: 'expired-coupon-id',
    expires: new Date('2020-01-01'),
    type: 'special',
    percentageDiscount: new Prisma.Decimal(0.2),
  } as Prisma.CouponUncheckedCreateInput
  const result = validateCoupon(coupon as Coupon)
  expect(result.isValid).toEqual(false)
  expect(result.isRedeemable).toEqual(false)
})

test('if a coupon is passed that is used up it is invalid', async () => {
  const coupon = {
    id: 'used-up-coupon-id',
    maxUses: 1,
    usedCount: 1,
    type: 'special',
    percentageDiscount: new Prisma.Decimal(0.2),
  } as Prisma.CouponUncheckedCreateInput
  const result = validateCoupon(coupon as Coupon)
  expect(result.isValid).toEqual(false)
  expect(result.isRedeemable).toEqual(false)
})

test('if a coupon is passed that is valid it is valid', async () => {
  const coupon = {
    id: 'valid-coupon-id',
    type: 'special',
    percentageDiscount: new Prisma.Decimal(0.2),
  } as Prisma.CouponUncheckedCreateInput
  const result = validateCoupon(coupon as Coupon)

  expect(result.isValid).toEqual(true)
  expect(result.isRedeemable).toEqual(false)
})

test('if a coupon is passed that is valid and has a 100% discount it is redeemable', async () => {
  const coupon = {
    id: 'valid-coupon-id',
    type: 'special',
    percentageDiscount: new Prisma.Decimal(1),
  } as Prisma.CouponUncheckedCreateInput
  const result = validateCoupon(coupon as Coupon)

  expect(result.isValid).toEqual(true)
  expect(result.isRedeemable).toEqual(true)
})

test('if a default coupon is passed that is valid and has a 100% discount it is not redeemable', async () => {
  const coupon = {
    id: 'valid-coupon-id',
    type: 'special',
    percentageDiscount: new Prisma.Decimal(1),
    default: true,
  } as Prisma.CouponUncheckedCreateInput
  const result = validateCoupon(coupon as Coupon)

  expect(result.isValid).toEqual(true)
  expect(result.isRedeemable).toEqual(false)
})
