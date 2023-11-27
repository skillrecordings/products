import React from 'react'
import Image from 'next/image'
import cx from 'classnames'
import {max} from 'lodash'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import Balancer from 'react-wrap-balancer'

import {Pricing} from 'path-to-purchase/pricing'

const PRODUCTS_RANKS = {
  'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff': 1,
  'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3': 2,
  'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5': 3,
}

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

  const ranksOfPurchasedProducts = purchases.map(
    (purchase) =>
      PRODUCTS_RANKS[purchase.productId as keyof typeof PRODUCTS_RANKS],
  )
  const highestPurchasedProductRank = max(ranksOfPurchasedProducts) || 0

  return (
    <div className={cx(className)}>
      <div className="container max-w-6xl flex flex-col">
        <header>
          <h2 className="text-center font-heading text-4xl sm:text-5xl lg:text-6xl">
            <Balancer>Start testing like a pro</Balancer>
          </h2>
          <h3 className="text-center mb-10 mt-4 font-tt-regular text-xl sm:text-2xl opacity-70">
            Buy once. Forever yours.
          </h3>
        </header>
        <PriceCheckProvider purchasedProductsIds={purchasedProductsIds}>
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div className="flex flex-col items-center lg:flex-row justify-center gap-6 mt-24 md:mt-28 lg:mt-32 lg:items-start">
            {products.map((product, i) => {
              const productRank =
                PRODUCTS_RANKS[product.productId as keyof typeof PRODUCTS_RANKS]
              return (
                <Pricing
                  key={product.name}
                  userId={userId}
                  product={product}
                  purchased={purchasedProductsIds.includes(product.productId)}
                  index={i}
                  couponId={couponId}
                  allowPurchase={allowPurchase}
                  unavailable={productRank < highestPurchasedProductRank}
                />
              )
            })}
          </div>
        </PriceCheckProvider>
        <div className="w-36 top-[50px] md:w-44 relative md:top-[62px] mx-auto">
          <Image
            src="https://res.cloudinary.com/epic-web/image/upload/v1684186307/testingjavascript.com/illos/30-day-money.back.svg"
            width={314}
            height={218}
            alt="30-Day Money-Back Guarantee"
          />
        </div>
      </div>
    </div>
  )
}

export default PricingSection
