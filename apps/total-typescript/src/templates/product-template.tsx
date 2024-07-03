import React from 'react'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
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
import {Card, CardContent} from '@skillrecordings/ui'
import {Testimonials} from '@/pages/newsletter'
import {Companies} from '@/components/companies'

const ProductTemplate: React.FC<ProductPageProps> = ({
  products,
  product,
  allowPurchase,
  couponFromCode,
  couponIdFromCoupon,
  purchases = [],
  userId,
  workshop,
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
        title: `Buy ${product?.title}`,
        description: workshop ? workshop.description : product.description,
        ogImage: couponFromCode
          ? {
              url: 'https://res.cloudinary.com/total-typescript/image/upload/v1669888351/illustrations/golden-ticket_2x_hkd8x3.png',
              alt: 'Golden Ticket',
            }
          : {
              url: workshop?.ogImage
                ? workshop.ogImage
                : `${
                    process.env.NEXT_PUBLIC_URL
                  }/api/og/og-product?title=${encodeURIComponent(
                    product.title,
                  )}${
                    product?.image?.url ? `&image=${product?.image?.url}` : ''
                  }`,
              alt: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
            },
      }}
    >
      <main className="flex flex-col items-center pt-10">
        <section className="relative z-10 mx-auto flex w-full max-w-screen-xl flex-row items-center justify-center py-24 sm:py-24">
          <div className="">
            <Link
              href="/products"
              className="group relative z-10 inline-flex -translate-y-16 gap-1 text-sm text-gray-400 transition hover:text-primary"
            >
              <span className="transition group-hover:-translate-x-1">←</span>{' '}
              <span>All Products</span>
            </Link>
            <div className="flex w-full flex-col items-start pt-4">
              <p className="pb-2 text-center text-lg">Total TypeScript </p>
              <h1 className="relative z-10 pb-4 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl">
                {product.title}
              </h1>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/matt-pocock.jpg')}
                    alt="Matt Pocock"
                    width={48}
                    height={48}
                    placeholder="blur"
                  />
                </div>
                <span>Matt Pocock</span>
              </div>
              <h2 className="max-w-[65ch] text-balance text-lg font-normal text-foreground">
                {product.description}
              </h2>
            </div>
          </div>
          <div>
            {product.image && (
              <Image
                src={product.image.url}
                alt={product.title}
                width={400}
                height={400}
              />
            )}
          </div>
        </section>

        {/* <section className="w-full bg-gradient-to-b from-background to-black/40">
          <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center justify-center gap-5 px-5 md:grid-cols-3">
            {product?.modules?.map((module) => {
              return (
                <Card
                  key={module._id}
                  className="flex aspect-[63/88] h-full w-full max-w-[400px] flex-col items-center justify-between px-5 pb-5 pt-2 text-center text-foreground lg:px-8"
                >
                  <div className="flex flex-col items-center">
                    <Image
                      src={module.image.url}
                      alt={module.title}
                      width={300}
                      height={300}
                    />
                    <h3 className="pb-4 pt-2 font-text text-2xl font-bold ">
                      {module.title}
                    </h3>
                    <p className="text-balance">{module.description}</p>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <p className="">
                      {module.totalLessons === 0
                        ? `${module.totalInterviews} interviews`
                        : `${module.totalLessons} lessons`}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </section> */}
        <section className="flex w-full flex-col items-center justify-center bg-black/40 px-5 pt-24">
          <h2 className="pb-48 text-center text-2xl font-semibold">
            Get Access Today
          </h2>
          <div className="relative">
            <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
              <Pricing
                userId={userId}
                product={product as unknown as SanityProduct}
                purchased={purchasedProductIds.includes(
                  product.productId as string,
                )}
                couponId={couponId}
                allowPurchase={allowPurchase}
                options={{
                  withDescription: false,
                }}
              />
            </PriceCheckProvider>
          </div>
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div className="flex w-full items-center justify-center py-16">
            <Image
              src="https://res.cloudinary.com/total-typescript/image/upload/v1689864739/money-back-guarantee-large_l3sikc.png"
              alt="30-Day Money Back Guarantee"
              width={700 / 1.7}
              height={252 / 1.7}
              priority
            />
          </div>
        </section>
        <div className="relative flex flex-col items-center pb-5">
          <div
            className="absolute top-0 h-px w-full max-w-screen-md bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-30"
            aria-hidden="true"
          />
          <Testimonials className="border-t-0" />
        </div>
        <Companies />
      </main>
    </Layout>
  )
}

export default ProductTemplate
