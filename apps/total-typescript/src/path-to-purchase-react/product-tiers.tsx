import * as React from 'react'
import cx from 'classnames'
import {Pricing} from './pricing'
import {useCoupon} from './use-coupon'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {PriceCheckProvider} from './pricing-check-context'

export const PricingTiers: React.FC<React.PropsWithChildren<CommerceProps>> = ({
  couponFromCode,
  products,
  userId,
  purchases = [],
  couponIdFromCoupon,
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  return (
    <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
      <div className="flex gap-10">
        {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
        {products?.map((product, i) => {
          return (
            <div
              key={product.name}
              className={cx('transition hover:opacity-100')}
            >
              <Pricing
                userId={userId}
                product={product}
                purchased={purchasedProductIds.includes(product.productId)}
                purchases={purchases}
                index={i}
                couponId={couponId}
              />
            </div>
          )
        })}
      </div>
    </PriceCheckProvider>
  )
}
