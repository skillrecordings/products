import React from 'react'
import Layout from 'components/layout'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {getActiveProducts} from 'server/products.server'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import Image from 'next/image'
import PageHeadline from 'components/page-headline'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context
  const token = await getToken({req})
  const products = await getActiveProducts()

  return await propsForCommerce({query, token, products})
}

const Buy: React.FC<CommerceProps> = ({
  couponFromCode,
  products,
  userId,
  purchases = [],
  couponIdFromCoupon,
  allowPurchase,
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  return (
    <Layout
      meta={{
        title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE} Workshops`,
        ogImage: {
          url: 'https://res.cloudinary.com/pro-tailwind/image/upload/v1673953704/buy-card_2x.png',
          alt: 'Professional Tailwind CSS Workshops',
        },
      }}
      className="py-16"
    >
      <header>
        <PageHeadline>Level Up at Tailwind CSS</PageHeadline>
      </header>
      <main className="mt-8">
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div data-pricing-container="">
            {products.map((product, i) => {
              return (
                <Pricing
                  key={product.title}
                  userId={userId}
                  product={product}
                  purchased={purchasedProductIds.includes(product.productId)}
                  purchases={purchases}
                  index={i}
                  couponId={couponId}
                  allowPurchase={allowPurchase}
                />
              )
            })}
          </div>
        </PriceCheckProvider>
        <div className="flex w-full items-center justify-center pt-16">
          <Image
            src={require('../../public/assets/money-back-guarantee-badge.svg')}
            width={130}
            height={130}
            alt="30-Day Money-Back Guarantee"
          />
        </div>
      </main>
    </Layout>
  )
}

export default Buy
