import React from 'react'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../utils/honeycomb-tracer'
import {useCoupon} from '../hooks/use-coupon'
import Layout from 'components/app/layout'
import {PricingTiers} from '../components/product-tiers'
import {CommerceProps, propsForCommerce} from '../utils/props-for-commerce'

const Buy: React.FC<CommerceProps> = ({
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
}) => {
  return (
    <Layout>
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
          <PricingTiers
            products={products}
            userId={userId}
            purchases={purchases}
            couponIdFromCoupon={couponIdFromCoupon}
            couponFromCode={couponFromCode}
          />
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

  return await propsForCommerce(context)
}
