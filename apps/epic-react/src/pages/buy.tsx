import * as React from 'react'
import {GetServerSideProps} from 'next'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import Balancer from 'react-wrap-balancer'

import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {getAllActiveProducts} from '@/lib/products'
import Layout from '@/components/app/layout'
import PricingSection from '@/components/pricing-section'
import {SubscribeToConvertkitForm} from '@skillrecordings/skill-lesson/convertkit'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import {VersionTwoCta} from '@/components/version-two-cta'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context
  const token = await getToken({req})
  const products = await getAllActiveProducts()
  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })

  return {
    props: {
      commerceProps,
    },
  }
}

const Buy: React.FC<{commerceProps: CommerceProps}> = ({commerceProps}) => {
  return (
    <Layout meta={{title: 'Buy'}}>
      <main className="bg-er-gray-100 pb-24 pt-20 sm:pt-28 md:pt-32 lg:pt-40 xl:pt-[211px]">
        {commerceProps.products?.length > 0 ? (
          <>
            <div className="space-y-5 text-center">
              <h1 className="pb-4 text-4xl font-extrabold leading-9 text-text sm:text-[2.75rem] sm:leading-10 lg:text-[3.5rem] lg:leading-none">
                <Balancer>Get Really Good At React</Balancer>
              </h1>
              <h2 className="mx-auto max-w-4xl text-xl text-react sm:text-2xl">
                <Balancer>
                  The beautiful thing about learning is that nobody can take it
                  away from you.
                </Balancer>
              </h2>
            </div>
            <div className="mt-16 lg:mt-32">
              <PricingSection
                commerceProps={commerceProps}
                className="mb-28 mt-12 md:mt-14 lg:mb-32 lg:mt-16"
              />
            </div>
          </>
        ) : (
          <VersionTwoCta
            title="Epic React is not Available"
            byline="Want to be the first to know when it goes back on sale? Sign up here and we'll let you know!"
            actionLabel="Keep me posted"
          />
        )}
      </main>
    </Layout>
  )
}

export default Buy
