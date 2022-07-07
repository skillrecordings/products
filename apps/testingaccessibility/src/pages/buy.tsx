import React from 'react'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../utils/honeycomb-tracer'
import Layout from 'components/app/layout'
import {PricingTiers} from '../components/product-tiers'
import {CommerceProps, propsForCommerce} from '../utils/props-for-commerce'
import Image from 'next/image'
import FAQ from '../components/content/faq-section'

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
        <div className="pb-80 sm:pt-32 pt-24 text-white">
          <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4 lg:max-w-none">
              <h2 className="font-heading font-bold lg:text-5xl sm:text-5xl text-4xl">
                Start Building Accessible Applications{' '}
                <br className="sm:block hidden" />
                Like a Seasoned Expert
              </h2>
              <p className="text-xl max-w-sm mx-auto pt-4 text-sand-100">
                The beautiful thing about learning is that nobody can take it
                away from you.
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
        <div className="mt-24">
          <Image
            src={require('../../public/assets/icons/guarantee-seal.svg')}
            alt="30 day money back guarantee"
            width={157 * 1.2}
            height={109 * 1.2}
          />
        </div>
      </div>
      <section className="flex flex-col bg-gray-50">
        <div className="max-w-screen-lg mx-auto w-full py-24">
          <h2 className="text-center font-heading lg:text-5xl sm:text-4xl text-3xl font-bold pb-24">
            Frequently Asked Questions
          </h2>
          <FAQ />
        </div>
      </section>
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
