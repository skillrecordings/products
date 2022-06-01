import {Purchase} from '@prisma/client'

/**
 * handle self redeeming of a seat in bulk purchase
 * @param {string} email current user's email from session
 * @param {string} bulkCouponId current user's bulk coupon id from purchase
 * @param {(redeemPurchase) => void} onSuccess callback to be called when purchase is redeemed
 */
export async function handleSelfRedeem(
  email: string,
  bulkCouponId: string,
  onSuccess: (redeemedPurchase: Purchase) => void,
) {
  const redeemedPurchase = await fetch(`/api/redeem`, {
    method: 'post',
    body: JSON.stringify({
      email,
      couponId: bulkCouponId,
      sendEmail: false,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
  if (redeemedPurchase && !redeemedPurchase.error) {
    onSuccess(redeemedPurchase)
  }
}
