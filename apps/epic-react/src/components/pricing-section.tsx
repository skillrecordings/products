import React from 'react'
import Image from 'next/image'
import cx from 'classnames'
import {max} from 'lodash'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import Balancer from 'react-wrap-balancer'

import {Pricing} from '@/components/pricing'
// import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'

const PRODUCTS_RANKS = {
  'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714': 1,
  'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61': 2,
  'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38': 3,
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
  console.log({allowPurchase})
  const restrictedToProduct = couponFromCode?.restrictedToProductId
    ? products.find(
        (product) => product.productId === couponFromCode.restrictedToProductId,
      )
    : undefined

  const productMetadata = restrictedToProduct
    ? {
        ...restrictedToProduct,
        id: restrictedToProduct.productId,
        image: {
          ...restrictedToProduct.image,
          width: 132,
          height: 112,
        },
      }
    : undefined

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    couponFromCode,
    productMetadata,
  )

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductsIds = purchases.map((purchase) => purchase.productId)

  const ranksOfPurchasedProducts = purchases.map(
    (purchase) =>
      PRODUCTS_RANKS[purchase.productId as keyof typeof PRODUCTS_RANKS],
  )
  const highestPurchasedProductRank = max(ranksOfPurchasedProducts) || 0

  const basicProduct = products.find(
    (product) =>
      product.productId === 'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714',
  )
  const standardProduct = products.find(
    (product) =>
      product.productId === 'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61',
  )
  const proProduct = products.find(
    (product) =>
      product.productId === 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38',
  )

  return (
    <div className="relative z-0">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <PriceCheckProvider purchasedProductsIds={purchasedProductsIds}>
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div className="mt-24 flex flex-col items-center justify-center gap-6 md:mt-28 lg:mt-32 lg:flex-row lg:items-start">
            <div className="relative grid grid-flow-row-dense grid-cols-1 gap-5 lg:grid-cols-7 lg:grid-rows-1 lg:gap-0">
              {/* Packages start here */}
              <div
                data-product-basic=""
                className="row-start-3 mx-auto max-w-md transform transition-opacity duration-200 ease-in-out hover:opacity-100 lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:mx-0 lg:max-w-none lg:translate-y-56 lg:opacity-50"
              >
                <div className="relative z-10 rounded-lg shadow-xl">
                  {basicProduct && (
                    <Pricing
                      key={basicProduct.name}
                      userId={userId}
                      product={basicProduct}
                      purchased={purchasedProductsIds.includes(
                        basicProduct.productId,
                      )}
                      index={0}
                      couponId={couponId}
                      allowPurchase={true}
                      options={{
                        withGuaranteeBadge: false,
                      }}
                      // allowPurchase={true}
                      // unavailable={productRank < highestPurchasedProductRank}
                    />
                  )}
                </div>
              </div>
              <div
                data-product-pro=""
                className="row-start-1 mx-auto mt-10 max-w-lg lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:mx-0 lg:mt-0 lg:max-w-none"
              >
                <div className="relative z-10 rounded-lg shadow-xl">
                  {proProduct && (
                    <Pricing
                      key={proProduct.name}
                      userId={userId}
                      product={proProduct}
                      purchased={purchasedProductsIds.includes(
                        proProduct.productId,
                      )}
                      index={2}
                      couponId={couponId}
                      allowPurchase={true}
                      options={{
                        withGuaranteeBadge: false,
                      }}
                      // allowPurchase={true}
                      // unavailable={productRank < highestPurchasedProductRank}
                    />
                  )}
                </div>
              </div>
              <div
                data-product-standard=""
                className="row-start-2 mx-auto max-w-md transform transition-opacity duration-200 ease-in-out hover:opacity-100 lg:col-start-6 lg:col-end-8 lg:row-start-1 lg:max-w-none lg:translate-y-32 lg:opacity-75"
              >
                <div className="relative z-10 rounded-lg shadow-xl">
                  {standardProduct && (
                    <Pricing
                      key={standardProduct.name}
                      userId={userId}
                      product={standardProduct}
                      purchased={purchasedProductsIds.includes(
                        standardProduct.productId,
                      )}
                      index={1}
                      couponId={couponId}
                      allowPurchase={true}
                      options={{
                        withGuaranteeBadge: false,
                      }}
                      // allowPurchase={true}
                      // unavailable={productRank < highestPurchasedProductRank}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </PriceCheckProvider>
      </div>
    </div>
  )
}

export default PricingSection
