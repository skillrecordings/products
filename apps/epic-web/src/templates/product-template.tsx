import React from 'react'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'
import {ProductPageProps} from 'pages/products/[slug]'
import Link from 'next/link'

const ProductTemplate: React.FC<ProductPageProps> = ({
  products,
  allowPurchase,
  couponFromCode,
  couponIdFromCoupon,
  defaultCoupon,
  purchases = [],
  userId,
  workshop,
}) => {
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
      // defaultCoupon={defaultCoupon}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-24 sm:py-28">
        <Link
          href="/products"
          className="group relative z-10 mb-10 inline-flex gap-1 text-gray-400 transition hover:text-gray-200"
        >
          <span className="transition group-hover:-translate-x-1">←</span>{' '}
          <span>All Products</span>
        </Link>
        <h1 className="font-heading relative z-10 px-5 text-center  text-4xl font-bold sm:text-5xl">
          Become a TypeScript Wizard
        </h1>
        <section className="px-5">
          <PricingTiers
            products={products}
            userId={userId}
            purchases={purchases}
            couponIdFromCoupon={couponIdFromCoupon}
            couponFromCode={couponFromCode}
            allowPurchase={allowPurchase}
          />
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
    </Layout>
  )
}

export default ProductTemplate
