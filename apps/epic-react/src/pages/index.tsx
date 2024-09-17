import type {GetServerSideProps} from 'next'
import Image from 'next/image'
import {getToken} from 'next-auth/jwt'
import FiveStarsRatingImage from '../../public/assets/five-stars@2x.png'
import {useReducedMotion} from 'framer-motion'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {getAllActiveProducts} from '@/lib/products'
import Layout from '@/components/app/layout'
import LandingCopy from '@/components/landing-copy-v2.mdx'
import PricingSection from '@/components/pricing-section'
import {VersionTwoCta} from '@/components/version-two-cta'
import * as React from 'react'
import {getAllWorkshops, type Workshop} from '@/lib/workshops'
import {getUserAndSubscriber} from '@/lib/users'
import {User} from '@skillrecordings/skill-lesson'
import {Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import groq from 'groq'
import {sanityClientNoCdn} from '@/utils/sanity-client'
import {ModulesListWithDescriptions} from '@/components/landing/modules-list'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const token = await getToken({req})
  const {user, subscriber} = await getUserAndSubscriber({req, res, query})
  const pricingActive = await sanityClientNoCdn.fetch(
    groq`*[_type == 'pricing' && active == true][0]`,
  )

  const allowPurchase =
    pricingActive ||
    query?.allowPurchase === 'true' ||
    query?.coupon ||
    query?.code
  const products = await getAllActiveProducts(!allowPurchase)

  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })

  const v2Modules = await getAllWorkshops()

  return {
    props: {
      modules: v2Modules,
      commerceProps,
      user,
      subscriber,
    },
  }
}
const Home: React.FC<{
  modules: Workshop[]
  commerceProps: CommerceProps
  user: User | null
  subscriber: Subscriber | null
}> = ({modules, commerceProps, user, subscriber}) => {
  const shouldReduceMotion = useReducedMotion()

  const moduleImageVariants = {
    visible: {opacity: 1, scale: 1, y: 0},
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
  }

  return (
    <Layout>
      <main>
        <section className="sm:pt-26 relative flex w-full flex-col items-center justify-center overflow-hidden bg-gray-900 pt-16">
          <div className="mb-8 flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#F2BA24] to-[#FFA721] text-xs font-bold uppercase text-[#442D00]">
            <span className="flex items-center justify-center border-r border-black/10 bg-white/10 px-3 py-1.5 pr-2">
              new
            </span>
            <span className="flex items-center justify-center px-3 py-1.5 pl-2">
              updated for react 19
            </span>
          </div>
          <h1 className="text-balance px-5 text-center text-3xl font-bold leading-tight text-white transition-opacity sm:leading-tight md:max-w-3xl md:text-4xl lg:text-5xl">
            Get Extremely Good at React Quickly and Efficiently
          </h1>
          <h2 className="mt-5 inline-flex flex-wrap items-center justify-center text-balance px-5 text-center text-blue-200 sm:text-xl">
            <span>
              Self-Paced Code-First Hands-on React Training for Professional Web
              Developers by{' '}
            </span>
            <span className="inline-flex items-center">
              <Image
                priority
                src={require('../../public/kent-c-dodds.png')}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className="ml-3 mr-1.5 size-8 rounded-full bg-gray-800 sm:size-10"
              />{' '}
              Kent C. Dodds
            </span>
          </h2>
          <div className="mt-14 grid w-full max-w-xl scale-75 grid-cols-2 items-start justify-center gap-5 sm:scale-100 sm:gap-16">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <Image
                priority
                src={FiveStarsRatingImage}
                alt="5 out of 5 stars"
                width={104}
              />
              <p className="italic leading-[1] text-blue-200 sm:text-lg">
                Epic React is a goldmine, years of experience put into minutes.
                I'm blown away.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <Image
                priority
                src={FiveStarsRatingImage}
                alt="5 out of 5 stars"
                width={104}
              />
              <p className="italic leading-[1] text-blue-200 sm:text-lg">
                30 minutes in I'm hooked.
              </p>
            </div>
          </div>
          <Image
            className="mt-14 w-full max-w-[1440px] scale-150 sm:mt-0 sm:scale-100"
            src={require('../../public/assets/hero.png')}
            alt=""
            aria-hidden="true"
            width={2880}
            height={1280}
            quality={100}
            priority
          />
        </section>
        <section className="mx-auto mt-12 w-full max-w-screen-xl px-4 py-8 sm:mt-10 sm:px-8">
          <div className="prose mx-auto max-w-none dark:prose-invert lg:prose-xl prose-headings:mx-auto prose-headings:max-w-3xl prose-headings:text-balance prose-p:mx-auto prose-p:max-w-3xl prose-ol:mx-auto prose-ol:max-w-3xl prose-ul:mx-auto prose-ul:max-w-3xl">
            <LandingCopy
              components={{
                Image,
                ModulesListWithDescriptions: () => (
                  <ModulesListWithDescriptions modules={modules} />
                ),
              }}
            />
          </div>
        </section>
        <section
          className="bg-er-gray-100 pb-16 pt-8"
          aria-label="Enroll in Epic React"
          id="buy"
        >
          {commerceProps.products?.length > 0 ? (
            <>
              <div className="py-8 lg:py-16">
                <div className="mx-auto w-full max-w-screen-lg px-5 text-center">
                  <h1 className="text-balance py-4 text-4xl font-extrabold leading-9 text-text sm:text-[2.75rem] sm:leading-10 lg:text-[3.5rem] lg:leading-none">
                    Join over 7,000 Developers and Get Extremely Good At React
                  </h1>
                  <p className="mx-auto mt-5 max-w-4xl text-xl text-react sm:text-2xl">
                    The beautiful thing about learning is that nobody can take
                    it away from you.
                  </p>
                </div>
                <div className="mt-16 lg:mt-32">
                  <PricingSection
                    commerceProps={commerceProps}
                    className="mb-28 mt-12 md:mt-14 lg:mb-32 lg:mt-16"
                  />
                </div>
              </div>
              <div className="mx-auto h-40 w-40">
                <Image
                  src="/assets/money-back-guarantee-badge.svg"
                  alt="30 day money back guarantee"
                  width={192}
                  height={192}
                />
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-screen-lg px-5 py-16 sm:px-8">
              <VersionTwoCta
                className="[&_[data-sr-button]]:text-white [&_[data-sr-input]]:border-gray-300 dark:[&_[data-sr-input]]:border-white/10"
                id="primary-newsletter-cta"
                title="Epic React is not Available"
                byline="Want to be the first to know when it goes back on sale? Sign up here and we'll let you know!"
                actionLabel="Keep me posted"
              />
            </div>
          )}
        </section>
      </main>
    </Layout>
  )
}

export default Home
