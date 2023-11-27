import * as React from 'react'
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
  allowPurchase,
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  return (
    <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      <div data-pricing-container="">
        {products?.map((product, i) => {
          return (
            <Pricing
              key={product.name}
              userId={userId}
              product={product}
              purchased={purchasedProductIds.includes(product.productId)}
              index={i}
              couponId={couponId}
              allowPurchase={allowPurchase}
            />
          )
        })}
      </div>
    </PriceCheckProvider>
  )
}
