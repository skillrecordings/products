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
  productLabels?: {[productId: string]: string}
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
  productLabels,
}) => {
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

  const {validCoupon} = useCoupon(couponFromCode, productMetadata)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  console.log(productLabels)

  return (
    <>
      <div data-pricing-container="">
        {products?.map((productWithOptions, i) => {
          const {options, ...product} = productWithOptions
          return (
            <PriceCheckProvider
              key={product.productId}
              purchasedProductIds={purchasedProductIds}
            >
              <Pricing
                key={product.productId}
                userId={userId}
                product={product}
                purchasedProductIds={purchasedProductIds}
                purchased={purchasedProductIds.includes(product.productId)}
                index={i}
                couponId={couponId}
                couponFromCode={
                  couponFromCode &&
                  (!couponFromCode.restrictedToProductId ||
                    couponFromCode.restrictedToProductId === product.productId)
                    ? couponFromCode
                    : undefined
                }
                allowPurchase={allowPurchase}
                options={options}
              />
            </PriceCheckProvider>
          )
        })}
      </div>
    </>
  )
}
