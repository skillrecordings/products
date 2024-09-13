import * as React from 'react'
import {GetServerSideProps} from 'next'
import {
  convertToSerializeForNextResponse,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import Balancer from 'react-wrap-balancer'

import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {getAllActiveProducts} from '@/lib/products'
import Layout from '@/components/app/layout'
import PricingSection from '@/components/pricing-section'
import {VersionTwoCta} from '@/components/version-two-cta'
import Image from 'next/image'
import {User} from '@skillrecordings/skill-lesson'
import {Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {getUserAndSubscriber} from '@/lib/users'

type DynamicHeadlines = {
  mainTitle: string
  subTitle: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, res, query} = context
  const token = await getToken({req})
  const {user, subscriber} = await getUserAndSubscriber({req, res, query})

  const allowPurchase = query?.allowPurchase === 'true'
  const products = await getAllActiveProducts(!allowPurchase)

  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })

  return {
    props: {
      commerceProps,
      user,
      subscriber,
    },
  }
}

const Buy: React.FC<{
  commerceProps: CommerceProps
  user: User | null
  subscriber: Subscriber | null
}> = ({commerceProps, user, subscriber}) => {
  return (
    <Layout meta={{title: 'Buy'}}>
      <main className="flex-grow bg-er-gray-100 pb-24 pt-14 sm:pt-20">
        {commerceProps.products?.length > 0 ? (
          <>
            <div className="mx-auto max-w-screen-lg space-y-5 px-5 text-center">
              <h1 className="mb-2 text-balance text-3xl font-extrabold leading-9 text-text sm:mb-4 sm:text-[2.75rem] sm:leading-10 lg:text-[3.5rem] lg:leading-none">
                Join 30,000+ Epic Developers and Get Extremely Good At React
              </h1>
              <h2 className="mx-auto max-w-4xl text-lg text-react sm:text-2xl">
                <Balancer>
                  Master React through self-paced, fully-guided, interactive,
                  in-depth code-first workshops.
                </Balancer>
              </h2>
            </div>
            <div className="mt-16 lg:mt-32">
              <PricingSection
                commerceProps={commerceProps}
                className="mb-28 mt-12 md:mt-14 lg:mb-32 lg:mt-16"
              />
            </div>
            <div className="mx-auto mt-16 h-40 w-40">
              <Image
                src="/assets/money-back-guarantee-badge.svg"
                alt="30 day money back guarantee"
                width={192}
                height={192}
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
