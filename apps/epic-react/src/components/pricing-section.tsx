import * as React from 'react'
import type {
  CommerceProps,
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'
import SaleCountdown from '@skillrecordings/skill-lesson/path-to-purchase/sale-countdown'

const removeModuleBySlug = (
  products: any[],
  slugToRemove: string,
): SanityProduct[] => {
  return products.map((product) => {
    return {
      ...product,
      modules:
        product?.modules &&
        product.modules.filter(
          (module: SanityProductModule) => module.slug !== slugToRemove,
        ),
    }
  })
}

const PricingSection: React.FC<{
  commerceProps: CommerceProps
  className?: string
  productLabels?: {[productId: string]: string}
  buttonCtaLabels?: {[productId: string]: string}
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
  productLabels,
  buttonCtaLabels,
}) => {
  const sortedProducts = [...products].sort(
    (a, b) => Number(a.sortOrder) - Number(b.sortOrder),
  )
  const filteredProducts = removeModuleBySlug(
    sortedProducts,
    'welcome-to-epic-react',
  ).filter(({state}) => state !== 'unavailable')

  const productsWithOptions = filteredProducts.map((product) => {
    return {
      ...product,
      options: {
        buttonCtaLabel: buttonCtaLabels?.[product.productId] || 'Enroll Now',
        specialPricingLabel: productLabels?.[product.productId],
        allowTeamPurchase:
          'allowTeamPurchase' in product
            ? Boolean(product.allowTeamPurchase)
            : true,
        saleCountdownRenderer: (props: any) => {
          return (
            <SaleCountdown
              data-pricing-product-sale-countdown=""
              size="lg"
              {...props}
            />
          )
        },
      },
    }
  })

  return (
    <div className="relative z-30">
      <div
        className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8"
        id="pricing-tiers"
      >
        <PricingTiers
          products={productsWithOptions}
          userId={userId}
          purchases={purchases}
          couponIdFromCoupon={couponIdFromCoupon}
          couponFromCode={couponFromCode}
          allowPurchase={allowPurchase}
          productLabels={productLabels}
        />
      </div>
    </div>
  )
}

export default PricingSection
