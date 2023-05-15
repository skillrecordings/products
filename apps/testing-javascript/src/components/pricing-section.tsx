import React from 'react'
import cx from 'classnames'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'

import {Pricing} from 'path-to-purchase/pricing'

const PricingSection: React.FC<{
  commerceProps: CommerceProps
  className?: string
}> = ({
  commerceProps: {
    couponFromCode,
    products,
    userId,
    purchases = [],
    couponIdFromCoupon,
    allowPurchase,
  },
  className,
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductsIds = purchases.map((purchase) => purchase.productId)

  return (
    <div className={cx(className)}>
      <div className="flex flex-col">
        <header>
          <h2 className="px-5 text-center font-heading text-4xl sm:text-5xl lg:text-6xl">
            Start testing like a pro
          </h2>
          <h3 className="text-center mb-10 mt-4 font-tt-regular text-2xl opacity-80">
            Buy once. Forever yours.
          </h3>
        </header>
        <PriceCheckProvider purchasedProductsIds={purchasedProductsIds}>
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div className="flex flex-col lg:flex-row justify-center gap-6 mt-32 items-start">
            {products.map((product, i) => {
              return (
                <Pricing
                  key={product.name}
                  userId={userId}
                  product={product}
                  purchased={purchasedProductsIds.includes(product.productId)}
                  purchases={purchases}
                  index={i}
                  couponId={couponId}
                  allowPurchase={allowPurchase}
                />
              )
            })}
          </div>
        </PriceCheckProvider>
      </div>
    </div>
  )
}

export default PricingSection
