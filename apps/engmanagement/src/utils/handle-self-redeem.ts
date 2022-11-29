/**
 * handle self redeeming of a seat in bulk purchase
 * @param {string} email current user's email from session
 * @param {string} bulkCouponId current user's bulk coupon id from purchase
 * @param {(redeemPurchase) => void} onSuccess callback to be called when purchase is redeemed
 */
import type {Purchase} from '@skillrecordings/database'
import {redeemFullPriceCoupon} from './redeem-full-price-coupon'

export async function handleSelfRedeem(
  email: string,
  bulkCouponId: string,
  onSuccess: (redeemedPurchase: Purchase) => void,
) {
  const {purchase: redeemedPurchase} = await redeemFullPriceCoupon({
    email,
    couponId: bulkCouponId,
    sendEmail: false,
  })
  if (redeemedPurchase && !redeemedPurchase.error) {
    await fetch('/api/auth/session?update')
    onSuccess(redeemedPurchase)
  }
}
