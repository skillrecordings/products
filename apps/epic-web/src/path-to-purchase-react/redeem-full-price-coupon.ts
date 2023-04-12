export async function redeemFullPriceCoupon({
  email,
  couponId,
  sendEmail = true,
}: {
  email: string
  couponId: string
  sendEmail?: boolean
}) {
  return await fetch(`/api/skill/redeem/coupon`, {
    method: 'post',
    body: JSON.stringify({
      email,
      couponId,
      sendEmail,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
}
