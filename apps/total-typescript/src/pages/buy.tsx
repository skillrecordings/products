import React from 'react'
import {GetServerSideProps} from 'next'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {Element} from 'react-scroll'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import Layout from '@/components/app/layout'
import {getToken} from 'next-auth/jwt'
import Image from 'next/legacy/image'
import {motion, useScroll, useTransform} from 'framer-motion'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import cx from 'classnames'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context

  const token = await getToken({req})
  const products = await getAllProducts()

  return await propsForCommerce({query, token, products})
}

const Buy: React.FC<React.PropsWithChildren<CommerceProps>> = ({
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
  defaultCoupon,
  allowPurchase,
}) => {
  const {scrollYProgress} = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  const sortedProductsByName = products.sort((a, b) => {
    if (a.title === 'Core Volume') {
      return -1
    }
    if (b.title === 'Core Volume + React Bundle') {
      return 0
    }
    if (b.title === 'Advanced React with TypeScript') {
      return 1
    }
    return 0
  })

  return (
    <Layout
      meta={{
        title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
        titleAppendSiteName: false,
        ogImage: couponFromCode
          ? {
              url: 'https://res.cloudinary.com/total-typescript/image/upload/v1669888351/illustrations/golden-ticket_2x_hkd8x3.png',
              alt: 'Golden Ticket',
            }
          : undefined,
      }}
      defaultCoupon={defaultCoupon}
    >
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="select-none object-contain"
        quality={100}
      />
      <main className="relative z-10 flex flex-col items-center justify-center py-28 sm:py-36">
        <h1 className="relative z-10 px-5 text-center font-heading  text-4xl font-bold sm:text-5xl">
          Become a TypeScript Wizard
        </h1>
        <motion.div style={{y}} className="absolute top-0 h-screen w-full">
          <Image
            src={require('../../public/assets/landing/bg-divider-5.png')}
            alt=""
            aria-hidden="true"
            layout="fill"
            className="pointer-events-none z-0 translate-y-80 select-none object-contain object-top"
            quality={100}
          />
        </motion.div>
        <div className="flex justify-center pt-6 align-middle">
          <Image
            src="https://res.cloudinary.com/total-typescript/image/upload/v1689864739/money-back-guarantee-large_l3sikc.png"
            width={400}
            height={150}
            alt="Money Back Guarantee"
          />
        </div>
        <section className="px-5 pt-20">
          <div className="grid gap-40 lg:flex lg:gap-8 xl:gap-16">
            {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
            {sortedProductsByName?.map((product, i) => {
              const isFirst = products.length > 1 && i === 0
              const isLast = products.length > 1 && i === products.length - 1
              const isPro = !isFirst && !isLast

              return (
                <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
                  <div
                    key={product.name}
                    className={cx('transition hover:opacity-100', {
                      'mx-auto max-w-sm origin-top-right opacity-90 lg:mt-16 lg:scale-95':
                        isFirst,
                      'mx-auto max-w-sm origin-top-left opacity-80 lg:mt-28 lg:scale-[80%]':
                        isLast,
                      // switch up order when stacked vertically
                      'row-start-1 origin-top xl:scale-105': isPro,
                      'row-start-3': isLast,
                    })}
                  >
                    <Element name="buy" aria-hidden="true" />
                    <Pricing
                      userId={userId}
                      product={product}
                      purchased={purchasedProductIds.includes(
                        product.productId,
                      )}
                      purchases={purchases}
                      index={i}
                      couponId={couponId}
                      options={{
                        withGuaranteeBadge: false,
                        withImage: true,
                      }}
                    />
                  </div>
                </PriceCheckProvider>
              )
            })}
          </div>
        </section>
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-7.png')}
        objectPosition={'bottom'}
        className="select-none object-contain"
        quality={100}
      />
    </Layout>
  )
}

export default Buy
