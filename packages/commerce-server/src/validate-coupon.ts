import {isBefore} from 'date-fns'
import {Coupon} from '@skillrecordings/database'

export type CouponValidator = {
  isValid: boolean
  isRedeemable: boolean
  isExpired: boolean
  isUsedUp: boolean
  error?:
    | 'coupon-not-found'
    | 'coupon-not-valid-for-product'
    | 'coupon-used-up'
    | 'coupon-expired'
}
export const validateCoupon = (
  coupon: Coupon | null,
  productIds: string[] = [],
): CouponValidator => {
  if (!coupon) {
    return {
      isValid: false,
      isRedeemable: false,
      isExpired: false,
      isUsedUp: false,
      error: 'coupon-not-found',
    }
  }

  const isUsedUp =
    coupon.maxUses > 0 ? coupon.usedCount >= coupon.maxUses : false

  const isExpired = coupon.expires
    ? isBefore(new Date(coupon.expires), new Date())
    : false

  if (
    coupon.restrictedToProductId &&
    !productIds.includes(coupon.restrictedToProductId)
  ) {
    return {
      isExpired,
      isUsedUp,
      isValid: false,
      isRedeemable: false,
      error: 'coupon-not-valid-for-product',
    }
  }

  if (isUsedUp) {
    return {
      isExpired,
      isUsedUp,
      isValid: false,
      isRedeemable: false,
      error: 'coupon-used-up',
    }
  }

  if (isExpired) {
    return {
      isExpired,
      isUsedUp,
      isValid: false,
      isRedeemable: false,
      error: 'coupon-expired',
    }
  }

  const isValid = !isUsedUp && !isExpired

  return {
    isExpired,
    isUsedUp,
    isRedeemable:
      isValid && coupon.percentageDiscount.toNumber() >= 1 && !coupon.default,
    isValid,
  }
}
