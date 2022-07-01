import {Coupon} from '@prisma/client'
import {getSdk} from '../lib/prisma-api'
import {defaultContext} from '../lib/context'
import {SpanContext} from '@vercel/tracing-js'

function couponIsValid(coupon?: Coupon | null) {
  if (!coupon) return false
  if (coupon.usedCount >= coupon.maxUses) return false
  if (coupon.expires && coupon.expires < new Date()) return false
  return true
}

export async function getActiveCouponId({
  productId,
  siteCouponId,
  code,
  spanContext,
  coupon,
}: {
  coupon: string
  productId: string
  siteCouponId: string
  code: string
  spanContext?: SpanContext
}) {
  const {getDefaultCoupon, couponForIdOrCode} = getSdk({
    ctx: defaultContext,
    spanContext,
  })

  let couponId = null

  const activeDefaultSiteSaleCoupon = await getDefaultCoupon(productId)

  const incomingCoupon = await couponForIdOrCode({
    couponId: siteCouponId,
    code,
  })

  if (
    // compare the discounts if there is a coupon and site/sale running
    incomingCoupon?.merchantCoupon &&
    couponIsValid(incomingCoupon) &&
    activeDefaultSiteSaleCoupon
  ) {
    const {merchantCoupon} = incomingCoupon
    if (
      merchantCoupon.percentageDiscount >
      activeDefaultSiteSaleCoupon.percentageDiscount
    ) {
      couponId = merchantCoupon.id
    } else {
      couponId = activeDefaultSiteSaleCoupon.id
    }
  } else if (
    // if it's a coupon, use it
    incomingCoupon?.merchantCoupon &&
    couponIsValid(incomingCoupon)
  ) {
    couponId = incomingCoupon.merchantCoupon.id
  } else if (
    // if a sale is running, use that
    activeDefaultSiteSaleCoupon
  ) {
    couponId = activeDefaultSiteSaleCoupon.id
  }

  return coupon ? coupon : couponId
}
