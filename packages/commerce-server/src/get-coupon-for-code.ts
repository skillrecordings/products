import {getSdk} from '@skillrecordings/database'
import {validateCoupon} from './validate-coupon'

export async function getCouponForCode(code: string) {
  const {getCoupon} = getSdk()

  let couponFromCode =
    code &&
    (await getCoupon({
      where: {OR: [{id: code as string}, {code: code as string}]},
    }))

  if (couponFromCode) {
    return {
      ...couponFromCode,
      ...validateCoupon(couponFromCode),
    }
  }
}
