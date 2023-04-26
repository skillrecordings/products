import React from 'react'
import RedeemDialog from './redeem-dialog'

type CouponValidator = {isValid: boolean; id: string; isRedeemable: boolean}

export function useCoupon(coupon?: CouponValidator) {
  const [validCoupon, setValidCoupon] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => {
      setValidCoupon(Boolean(coupon && coupon.isValid))
    }, 0)
  }, [])

  return {
    validCoupon,
    redeemableCoupon: validCoupon && coupon?.isRedeemable,
    RedeemDialogForCoupon: () => {
      return coupon ? (
        <RedeemDialog open={validCoupon} couponId={coupon.id} />
      ) : null
    },
  }
}
