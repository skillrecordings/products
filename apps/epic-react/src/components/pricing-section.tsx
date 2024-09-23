import * as React from 'react'
import {motion} from 'framer-motion'
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
        specialEffectRenderer: () => <AnimatedTierHeaderEffect />,
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

const AnimatedTierHeaderEffect = () => {
  return (
    <div
      data-pricing-header-effect=""
      className="absolute left-0 top-[-1px] z-10 flex w-full items-center justify-center"
    >
      {new Array(2).fill(null).map((_, i) => {
        const duration = 3.5
        const ease = 'easeOut'
        return (
          <>
            {/* LEFT */}
            <motion.div
              initial={{left: '55%', opacity: 0, width: 100}}
              animate={{
                left: ['55%', '0%'],
                opacity: [0, 1, 0],
                width: [100, 30],
              }}
              transition={{
                repeat: Infinity,
                duration,
                ease,
                delay: i * 1,
              }}
              className="absolute h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent dark:via-white"
            />
            <motion.div
              initial={{left: '55%', opacity: 0, width: 10}}
              animate={{
                left: ['55%', '0%'],
                opacity: [0, 1, 0],
                scale: [1.5, 1],
                width: [10, 32, 10],
              }}
              transition={{
                repeat: Infinity,
                duration,
                ease,
                delay: i * 1,
              }}
              className="absolute h-2 bg-amber-300/50 blur-lg"
            />

            {/* RIGHT */}
            <motion.div
              initial={{right: '55%', opacity: 0, width: 100}}
              animate={{
                right: ['55%', '0%'],
                opacity: [0, 1, 0],
                width: [100, 30],
              }}
              transition={{
                repeat: Infinity,
                duration,
                ease,
                delay: i * 1,
              }}
              className="absolute h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent dark:via-white"
            />
            <motion.div
              initial={{right: '55%', opacity: 0, width: 10}}
              animate={{
                right: ['55%', '0%'],
                opacity: [0, 1, 0],
                scale: [1.5, 1],
                width: [10, 32, 10],
              }}
              transition={{
                repeat: Infinity,
                duration,
                ease,
                delay: i * 1,
              }}
              className="absolute h-2 bg-amber-300/50 blur-lg"
            />
          </>
        )
      })}
    </div>
  )
}
