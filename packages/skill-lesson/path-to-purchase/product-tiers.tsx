import * as React from 'react'
import {Pricing} from './pricing'
import {useCoupon} from './use-coupon'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {PriceCheckProvider} from './pricing-check-context'

type EnhancedCommerceProps = Omit<CommerceProps, 'products'> & {
  products: Array<SanityProduct & {options?: {allowTeamPurchase: boolean}}>
}

export const PricingTiers: React.FC<
  React.PropsWithChildren<EnhancedCommerceProps>
> = ({
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
        {products?.map((productWithOptions, i) => {
          const {options, ...product} = productWithOptions
          return (
            <Pricing
              key={product.name}
              userId={userId}
              product={product}
              purchased={purchasedProductIds.includes(product.productId)}
              index={i}
              couponId={couponId}
              allowPurchase={allowPurchase}
              options={options}
            />
          )
        })}
      </div>
    </PriceCheckProvider>
  )
}
