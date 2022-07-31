import React from 'react'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '@skillrecordings/honeycomb-tracer'
import {CommerceProps, propsForCommerce} from '../utils/props-for-commerce'
import {Element} from 'react-scroll'
import {PricingTiers} from '../components/product-tiers'
import FAQ from '../components/content/faq-section'
import Layout from 'components/app/layout'
import Image from 'next/image'

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
      meta={{title: 'Buy Testing Accessibility'}}
      defaultCoupon={defaultCoupon}
    >
      <main>
        <div className="flex flex-col justify-center items-center bg-green-700 bg-noise pb-32">
          <div className="pb-80 sm:pt-24 pt-16 text-white">
            <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto space-y-4 lg:max-w-none">
                <p className="font-display font-medium pb-6 lg:text-xl sm:text-lg text-base text-[#FFC165]">
                  Testing Accessibility — by Marcy Sutton
                </p>
                <h1 className="font-heading font-bold lg:text-5xl sm:text-5xl text-4xl">
                  Start Building Accessible Applications{' '}
                  <br className="sm:block hidden" />
                  Like a Seasoned Expert
                </h1>
                <p className="md:text-xl text-lg max-w-sm mx-auto pt-4 text-sand-100">
                  The beautiful thing about learning is that nobody can take it
                  away from you.
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
          <div className="mt-24">
            <Image
              src={require('../../public/assets/guarantee-seal@2x.png')}
              alt="30 day money back guarantee"
              width={180}
              height={180}
            />
          </div>
        </div>
        <section
          className="flex flex-col bg-gray-50"
          aria-labelledby="header-faq"
        >
          <div className="max-w-screen-lg mx-auto w-full py-24">
            <h2
              className="text-center font-heading lg:text-5xl sm:text-4xl text-3xl font-bold pb-24"
              id="header-faq"
            >
              Frequently Asked Questions
            </h2>
            <FAQ />
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Buy

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, res} = context
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })

  return await propsForCommerce(context)
}
