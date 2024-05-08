import React from 'react'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {Element} from 'react-scroll'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import {motion, useScroll, useTransform} from 'framer-motion'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'
import {ProductPageProps} from '@/pages/products/[slug]'
import Link from 'next/link'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'

const ProductTemplate: React.FC<ProductPageProps> = ({
  products,
  allowPurchase,
  couponFromCode,
  couponIdFromCoupon,
  purchases = [],
  userId,
  workshop,
}) => {
  const {scrollYProgress} = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

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

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  return (
    <Layout
      meta={{
        title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
        titleAppendSiteName: false,
        description: workshop ? workshop.description : undefined,
        ogImage: couponFromCode
          ? {
              url: 'https://res.cloudinary.com/total-typescript/image/upload/v1669888351/illustrations/golden-ticket_2x_hkd8x3.png',
              alt: 'Golden Ticket',
            }
          : {
              url: workshop
                ? workshop.ogImage
                : 'https://res.cloudinary.com/total-typescript/image/upload/v1670407830/pricing/card_2x_isoiaa.png',
              alt: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
            },
      }}
    >
      <Image
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        fill
        className="select-none object-contain object-top"
        quality={100}
      />
      <main className="relative z-10 flex flex-col items-center justify-center py-24 sm:py-28">
        <Link
          href="/products"
          className="group relative z-10 mb-10 inline-flex gap-1 text-gray-400 transition hover:text-gray-200"
        >
          <span className="transition group-hover:-translate-x-1">←</span>{' '}
          <span>All Products</span>
        </Link>
        <h1 className="relative z-10 px-5 text-center font-heading  text-4xl font-bold sm:text-5xl">
          Become a TypeScript Wizard
        </h1>
        <motion.div style={{y}} className="absolute top-0 h-screen w-full">
          <Image
            src={require('../../public/assets/landing/bg-divider-5.png')}
            alt=""
            aria-hidden="true"
            fill
            className="pointer-events-none z-0 translate-y-80 select-none object-contain object-top"
            quality={100}
          />
        </motion.div>
        <section className="px-5 pt-40">
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
            <Element name="buy" aria-hidden="true" />
            <Pricing
              userId={userId}
              product={products[0]}
              purchased={purchasedProductIds.includes(products[0].productId)}
              couponId={couponId}
              allowPurchase={allowPurchase}
            />
          </PriceCheckProvider>
        </section>
        <div className="flex w-full items-center justify-center pt-16">
          <Image
            src="https://res.cloudinary.com/total-typescript/image/upload/v1689864739/money-back-guarantee-large_l3sikc.png"
            alt="30-Day Money Back Guarantee"
            width={700 / 1.7}
            height={252 / 1.7}
            priority
          />
        </div>
      </main>
      <Image
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-7.png')}
        fill
        className="select-none object-contain object-bottom"
        quality={100}
      />
    </Layout>
  )
}

export default ProductTemplate
