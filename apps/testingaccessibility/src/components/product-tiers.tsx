import * as React from 'react'
import cx from 'classnames'
import {Pricing} from './pricing'
import {Purchase} from '@prisma/client'
import {useCoupon} from '../hooks/use-coupon'
import {CouponForCode, SanityProduct} from '../utils/props-for-commerce'

export const PricingTiers: React.FC<{
  products: SanityProduct[]
  userId?: string
  purchases?: Purchase[]
  couponIdFromCoupon?: string
  couponFromCode?: CouponForCode
}> = ({
  couponFromCode,
  products,
  userId,
  purchases = [],
  couponIdFromCoupon,
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  return (
    <div className="lg:flex grid lg:gap-5 gap-40">
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      {products?.map((product, i) => {
        const isFirst = i === 0
        const isLast = i === products.length - 1
        const isPro = !isFirst && !isLast

        return (
          <div
            key={product.name}
            className={cx('hover:opacity-100 transition', {
              'lg:mt-40 opacity-80 max-w-sm mx-auto': isFirst,
              'lg:mt-20 opacity-90 max-w-sm mx-auto': isLast,
              // switch up order when stacked vertically
              'row-start-1': isPro,
              'row-start-3': isFirst,
            })}
          >
            <Pricing
              userId={userId}
              product={product}
              purchased={purchasedProductIds.includes(product.productId)}
              purchases={purchases}
              index={i}
              couponId={couponIdFromCoupon}
            />
          </div>
        )
      })}
    </div>
  )
}
