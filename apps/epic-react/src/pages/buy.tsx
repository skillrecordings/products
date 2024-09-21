import * as React from 'react'
import {GetServerSideProps} from 'next'
import {
  convertToSerializeForNextResponse,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import Balancer from 'react-wrap-balancer'
import {isAfter, isBefore, isEqual, parse} from 'date-fns'

import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {getAllActiveProducts} from '@/lib/products'
import Layout from '@/components/app/layout'
import PricingSection from '@/components/pricing-section'
import {VersionTwoCta} from '@/components/version-two-cta'
import Image from 'next/image'
import {User} from '@skillrecordings/skill-lesson'
import {Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {getUserAndSubscriber} from '@/lib/users'
import groq from 'groq'
import {sanityClientNoCdn} from '@/utils/sanity-client'
import {couponForPurchases, eRv1PurchasedOnDate} from '@/lib/purchases'
import Testimonials from '@/components/landing/testimonials'
import {FaqBody} from '@/pages/faq'
import {Companies} from '@/components/landing/companies'
import {PoweredByStripe} from '@/components/powered-by-stripe'

type DynamicHeadlines = {
  mainTitle: string
  subTitle: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, res, query} = context
  const token = await getToken({req})
  const {user, subscriber} = await getUserAndSubscriber({req, res, query})
  const pricingActive = await sanityClientNoCdn.fetch(
    groq`*[_type == 'pricing' && active == true][0]`,
  )

  const erV1PurchasedOnDate = eRv1PurchasedOnDate(user?.purchases)
  const coupon =
    (await couponForPurchases(erV1PurchasedOnDate)) || query?.coupon

  const allowPurchase =
    pricingActive ||
    query?.allowPurchase === 'true' ||
    query?.coupon ||
    query?.code

  const productLabels = coupon
    ? {
        'kcd_product-clzlrf0g5000008jm0czdanmz': 'Exclusive Upgrade Discount',
      }
    : {}

  const buttonCtaLabels = Boolean(erV1PurchasedOnDate)
    ? {
        'kcd_product-clzlrf0g5000008jm0czdanmz': 'Upgrade to Epic React v2',
      }
    : {}

  const products = await getAllActiveProducts(!allowPurchase)

  const {props: commerceProps} = await propsForCommerce({
    query: {
      ...query,
      coupon,
    },
    token,
    products,
  })

  return {
    props: {
      commerceProps,
      user,
      subscriber,
      productLabels,
      buttonCtaLabels,
      hasPurchasedV1: Boolean(erV1PurchasedOnDate),
    },
  }
}

const Buy: React.FC<{
  commerceProps: CommerceProps
  user: User | null
  subscriber: Subscriber | null
  productLabels?: {[productId: string]: string}
  buttonCtaLabels?: {[productId: string]: string}
  hasPurchasedV1?: boolean
}> = ({
  commerceProps,
  user,
  subscriber,
  productLabels,
  buttonCtaLabels,
  hasPurchasedV1 = false,
}) => {
  return (
    <Layout meta={{title: 'Buy'}}>
      <main className="flex-grow bg-er-gray-100 pb-24 pt-14 sm:pt-20">
        {commerceProps.products?.length > 0 ? (
          <>
            <div className="mx-auto max-w-screen-lg space-y-5 px-5 text-center">
              <h2 className="max-w-6xl text-balance px-5 text-center text-3xl font-bold leading-tight text-white transition-opacity sm:leading-tight md:text-5xl lg:text-6xl">
                {hasPurchasedV1
                  ? 'Upgrade to Epic React v2 for React 19 and TypeScript with an All New Learning Experience'
                  : 'Code Your Way to React Mastery'}
              </h2>
              <h3 className="mx-auto mt-5 max-w-4xl text-balance text-xl font-extrabold text-react sm:text-2xl">
                Epic React is your hands-on code-first at the keyboard cheat
                code to becoming the best React developer you can be.
              </h3>
            </div>
            <div className="mt-16 lg:mt-32">
              <PricingSection
                commerceProps={commerceProps}
                className="mb-28 mt-12 md:mt-14 lg:mb-32 lg:mt-16"
                productLabels={productLabels}
                buttonCtaLabels={buttonCtaLabels}
              />
            </div>
            <div className="mx-auto mt-8 flex items-center justify-center pb-8">
              <PoweredByStripe />
            </div>
            <div className="mx-auto  h-40 w-40">
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
            title="Epic React v2 is Almost Here!"
            byline="It is launching September 23rd at 9am Pacific. Sign up for more details!"
            actionLabel="Keep me posted"
          />
        )}
        <Companies />
        <Testimonials />
        <header className="flex items-center justify-center px-5 pt-20">
          <h1 className="w-full text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
            <Balancer>Frequently Asked Questions</Balancer>
          </h1>
        </header>
        <main className="mx-auto w-full max-w-screen-lg px-5 py-16 lg:py-20">
          <FaqBody />
        </main>
      </main>
    </Layout>
  )
}

export default Buy
