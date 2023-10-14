import React from 'react'

const CouponGenerator: React.FC<any> = ({coupons}) => {
  return (
    <div className="flex flex-col">
      <pre>{JSON.stringify(coupons, null, 2)}</pre>
    </div>
  )
}

export default CouponGenerator

export type Coupon = {
  id: string
  code: null | string
  createdAt: string
  expires: null | string
  maxUses: number
  default: boolean
  merchantCouponId: null | string
  status: number
  usedCount: number
  percentageDiscount: string
  restrictedToProductId: string
  bulkPurchaseId: null | string
}
