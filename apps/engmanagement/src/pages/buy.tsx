import React from 'react'
import {GetServerSideProps} from 'next'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {Element} from 'react-scroll'
import {PricingTiers} from '../components/product-tiers'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {getToken} from 'next-auth/jwt'
import {getActiveProducts} from '../lib/products'

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
        <h1 className="lg:text-6xl sm:text-5xl text-4xl font-din uppercase text-center max-w-[25ch] pb-10 px-5">
          Pre-order Limited Version Of the Book Today!
        </h1>
        <section className="flex flex-col justify-center items-center">
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
  const {products} = await getActiveProducts()

  return await propsForCommerce({query, token, products})
}
