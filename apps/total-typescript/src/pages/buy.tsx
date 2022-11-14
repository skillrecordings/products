import React from 'react'
import {GetServerSideProps} from 'next'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {Element} from 'react-scroll'
import {PricingTiers} from '../path-to-purchase-react/product-tiers'
import Layout from 'components/app/layout'
import {getToken} from 'next-auth/jwt'
import {getActiveProducts} from '../path-to-purchase-react/products.server'

const Buy: React.FC<React.PropsWithChildren<CommerceProps>> = ({
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
  defaultCoupon,
}) => {
  return (
    <Layout
      meta={{title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      defaultCoupon={defaultCoupon}
    >
      <main className="flex flex-col items-center justify-center py-32">
        <h1 className="font-din max-w-[25ch] px-5 pb-10 text-center text-4xl uppercase sm:text-5xl lg:text-6xl">
          Become a TypeScript Wizard
        </h1>
        <section className="flex flex-col items-center justify-center">
          <div className="px-5 pt-8">
            <Element name="buy" aria-hidden="true" />
            <PricingTiers
              products={products}
              userId={userId}
              purchases={purchases}
              couponIdFromCoupon={couponIdFromCoupon}
              couponFromCode={couponFromCode}
            />
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Buy

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context

  const token = await getToken({req})
  const {products = []} = await getActiveProducts()

  return await propsForCommerce({query, token, products})
}
