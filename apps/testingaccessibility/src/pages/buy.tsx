import React from 'react'
import {Pricing} from '../components/pricing'
import {GetServerSideProps} from 'next'
import {serialize} from '../utils/prisma-next-serializer'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../utils/honeycomb-tracer'
import {Purchase, Coupon} from '@prisma/client'
import {getToken} from 'next-auth/jwt'
import {useCoupon} from '../hooks/use-coupon'
import {getCouponForCode} from '../server/get-coupon-for-code'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import Layout from 'components/app/layout'
import groq from 'groq'
import cx from 'classnames'

const ONLY_PRO_TIER_AVAILABLE = true

export type SanityProduct = {
  id: string
  name: string
  action: string
  image: {
    url: string
    alt: string
  }
  modules: {
    title: string
  }[]
  features: {
    value: string
  }[]
}

const Buy: React.FC<{
  couponFromCode?: {isValid: boolean; id: string}
  purchases?: Purchase[]
  userId?: string
  products: SanityProduct[]
}> = ({couponFromCode, purchases = [], userId, products}) => {
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  const {validCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)

  return (
    <Layout>
      {validCoupon ? <RedeemDialogForCoupon /> : null}
      <div className="flex flex-col justify-center items-center bg-green-700 bg-noise pb-32">
        <div className="pb-80 pt-24 text-white">
          <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4 lg:max-w-none">
              <h2 className="text-3xl  font-extrabold sm:text-4xl lg:text-5xl">
                Pricing
              </h2>
              <p className="text-xl max-w-lg mx-auto">
                Learn the skills that will help you level up your career!
              </p>
            </div>
          </div>
        </div>
        <div className="px-5">
          <div className="lg:flex grid lg:gap-5 gap-40">
            {products?.map((product, i) => {
              const isFirst = i === 0
              const isLast = i === products.length - 1
              const isPro = !isFirst && !isLast

              return (
                <div
                  key={product.name}
                  className={cx('hover:opacity-100 transition', {
                    hidden: ONLY_PRO_TIER_AVAILABLE && !isPro,
                    'lg:mt-40 opacity-80 max-w-sm mx-auto': isFirst,
                    'lg:mt-20 opacity-90 max-w-sm mx-auto': isLast,
                    // switch up order when stacked vertically
                    'row-start-1': isPro,
                    'row-start-3': isFirst,
                  })}
                >
                  <Pricing
                    userId={userId}
                    product={product}
                    purchased={purchasedProductIds.includes(product.id)}
                    purchases={purchases}
                    rank={i}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Buy

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, res} = context
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })

  const token = await getToken({req})
  const purchases = token ? (token.purchases as any) : false
  const couponFromCode = await getCouponForCode(query.code as string)
  const products = await sanityClient.fetch(productsQuery)

  return {
    props: {
      ...(token?.id ? {userId: token?.id} : {}),
      ...(couponFromCode && {couponFromCode: serialize(couponFromCode)}),
      ...(purchases && {purchases: [...purchases.map(serialize)]}),
      products,
    },
  }
}

const productsQuery = groq`*[_type == "product"] | order(order asc) {
  "name": title,
  "id": productId,
  action,
  order,
  image {
    url,
    alt
  },
  modules[]->{
    title
  },
  features[]{
    value
  }
  }`
