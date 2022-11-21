/**
 * handle self redeeming of a seat in bulk purchase
 * @param {string} email current user's email from session
 * @param {string} bulkCouponId current user's bulk coupon id from purchase
 * @param {(params) => void} callback function to be called after attempting coupon redemption
 */
import type {Purchase} from '@skillrecordings/database'
import {redeemFullPriceCoupon} from './redeem-full-price-coupon'

type CallbackParams =
  | {status: 'success'; redeemedPurchase: Purchase}
  | {status: 'failed'; error: string}

export async function handleSelfRedeem(
  email: string,
  bulkCouponId: string,
  callback: (params: CallbackParams) => void,
) {
  const redeemedPurchase = await redeemFullPriceCoupon({
    email,
    couponId: bulkCouponId,
    sendEmail: false,
  })
  if (redeemedPurchase && !redeemedPurchase.error) {
    callback({status: 'success', redeemedPurchase})
  } else {
    callback({status: 'failed', error: redeemedPurchase.message})
  }
}
