import React from 'react'
import Layout from 'components/layout'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {Pricing} from 'path-to-purchase-react/pricing'
import {getActiveProducts} from 'path-to-purchase-react/products.server'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from 'path-to-purchase-react/use-coupon'
import {PriceCheckProvider} from 'path-to-purchase-react/pricing-check-context'
import Image from 'next/image'

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
      meta={{title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE} Workshops`}}
      className="py-16"
    >
      <header>
        <h1 className="px-5 pb-10 text-center font-heading text-4xl font-black tracking-tight sm:text-5xl">
          Level Up at Tailwind CSS
        </h1>
      </header>
      <main>
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div data-pricing-container="">
            {products.map((product, i) => {
              return (
                <Pricing
                  key={product.name}
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
