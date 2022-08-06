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
import config from 'config'

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
      meta={{title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}}`}}
      defaultCoupon={defaultCoupon}
    >
      <main>
        <div className="flex flex-col justify-center items-center pb-32">
          <div className="pb-10 sm:pt-24 pt-16 text-white">
            <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto space-y-4 lg:max-w-none">
                <p className="font-display font-medium pb-6 lg:text-xl sm:text-lg text-base text-[#FFC165]">
                  {process.env.NEXT_PUBLIC_SITE_TITLE} — by {config.author}
                </p>
                <h1 className="font-heading font-bold lg:text-5xl sm:text-5xl text-4xl">
                  For the Rest of Us
                </h1>
                <p className="md:text-xl text-lg max-w-sm mx-auto pt-4 text-sand-100">
                  a book
                </p>
                <Element name="buy" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="px-5">
            <PricingTiers
              products={products}
              userId={userId}
              purchases={purchases}
              couponIdFromCoupon={couponIdFromCoupon}
              couponFromCode={couponFromCode}
            />
          </div>
        </div>
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
