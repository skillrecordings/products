import React from 'react'
import RedeemDialog from '../components/redeem-dialog'

type Coupon = {isValid: boolean; id: string}

export function useCoupon(coupon?: Coupon) {
  const [validCoupon, setValidCoupon] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => {
      setValidCoupon(Boolean(coupon && coupon.isValid))
    }, 0)
  }, [])

  return {
    validCoupon,
    RedeemDialogForCoupon: () => {
      return coupon ? (
        <RedeemDialog open={validCoupon} couponId={coupon.id} />
      ) : null
    },
  }
}
