import * as React from 'react'
import type {
  CommerceProps,
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'

const PRODUCT_BASIC_ID = 'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714'
const PRODUCT_STANDARD_ID = 'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61'
const PRODUCT_PRO_ID = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'

const productsSortOrder: {[key: string]: number} = {
  [PRODUCT_BASIC_ID]: 1,
  [PRODUCT_PRO_ID]: 2,
  [PRODUCT_STANDARD_ID]: 3,
}

const productOptions: {[key: string]: {allowTeamPurchase: boolean}} = {
  [PRODUCT_BASIC_ID]: {
    allowTeamPurchase: false,
  },
  [PRODUCT_PRO_ID]: {
    allowTeamPurchase: true,
  },
  [PRODUCT_STANDARD_ID]: {
    allowTeamPurchase: false,
  },
}

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
    (a, b) => productsSortOrder[a.productId] - productsSortOrder[b.productId],
  )
  const filteredProducts = removeModuleBySlug(
    sortedProducts,
    'welcome-to-epic-react',
  )

  const productsWithOptions = filteredProducts.map((product) => {
    return {
      ...product,
      options: productOptions[product.productId],
    }
  })

  return (
    <div className="relative z-0">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
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
