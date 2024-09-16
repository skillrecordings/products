import * as React from 'react'
import type {
  CommerceProps,
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'

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
  const sortedProducts = [...products].sort(
    (a, b) => Number(a.sortOrder) - Number(b.sortOrder),
  )
  const filteredProducts = removeModuleBySlug(
    sortedProducts,
    'welcome-to-epic-react',
  ).filter(({state}) => state !== 'unavailable')

  const productsWithOptions = filteredProducts.map((product) => {
    console.log({product})
    return {
      ...product,
      options: {
        allowTeamPurchase:
          'allowTeamPurchase' in product
            ? Boolean(product.allowTeamPurchase)
            : true,
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
        />
      </div>
    </div>
  )
}

export default PricingSection
