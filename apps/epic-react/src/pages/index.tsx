import type {GetServerSideProps} from 'next'
import Image from 'next/image'
import {getToken} from 'next-auth/jwt'
import {motion, useReducedMotion} from 'framer-motion'
import {InView} from 'react-intersection-observer'

import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {getAllActiveProducts} from '@/lib/products'
import Layout from '@/components/app/layout'
import Footer from '@/components/app/footer'
import LandingCopy from '@/components/landing-copy.mdx'
import Divider from '@/components/divider'
import PricingSection from '@/components/pricing-section'

import {VersionTwoCta} from '@/components/version-two-cta'
import * as React from 'react'
import {getAllWorkshops, type Workshop} from '@/lib/workshops'
import {getOgImage} from '@/utils/get-og-image'

const DEFAULT_PRODUCT_ID = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})

  const allowPurchase = query?.allowPurchase === 'true'
  const products = await getAllActiveProducts(!allowPurchase)

  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })

  const v2Modules = await getAllWorkshops()

  return {
    props: {modules: v2Modules, commerceProps},
  }
}
const Home: React.FC<{modules: Workshop[]; commerceProps: CommerceProps}> = ({
  modules,
  commerceProps,
}) => {
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
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-gray-900 pt-10 sm:pt-24">
          <div className="mb-0 w-32 sm:mb-10 sm:w-40">
            <Image
              src="/assets/five-stars@2x.png"
              alt="5 out of 5 stars"
              width={210}
              height={33}
            />
          </div>
          <h1 className="text-balance px-5 pt-8 text-center text-3xl font-bold leading-tight text-white transition-opacity sm:pt-0 sm:leading-tight md:max-w-3xl md:text-4xl lg:text-5xl">
            Get Extremely Good at React
          </h1>
          <h2 className="mt-3 inline-flex flex-wrap items-center justify-center text-balance px-5 text-center text-blue-200 sm:text-xl">
            <span>
              Self-Paced React Training for Professional Developers by{' '}
            </span>
            <span className="inline-flex items-center">
              <Image
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
        <section className="mx-auto mt-12 w-full max-w-screen-lg px-4 py-8 sm:mt-0 sm:px-8">
          <div className="prose mx-auto lg:prose-xl">
            <LandingCopy components={{Image}} />
          </div>
        </section>
        <div className="mx-auto max-w-screen-lg px-5 sm:px-8">
          <h2 className="mt-20 text-center text-4xl font-semibold">
            The Workshops in Epic React Include:
          </h2>
          <Divider className="mb-16 mt-8" />
          <ul>
            {modules.map((module, i) => {
              return (
                <InView key={module.slug.current} threshold={0.2}>
                  {({inView, ref, entry}) => {
                    return (
                      <li
                        ref={ref}
                        className="my-5 grid grid-cols-1 items-center gap-8 rounded-lg px-5 py-10 sm:my-32 sm:grid-cols-3 sm:grid-rows-1 sm:px-0 sm:py-0"
                      >
                        <motion.div
                          animate={inView ? 'visible' : 'hidden'}
                          variants={moduleImageVariants}
                          transition={{mass: 0.7, type: 'spring'}}
                          className="mx-auto flex w-full items-center justify-center px-20 sm:col-span-1 sm:row-start-1 sm:px-5"
                        >
                          {module?.image && module?.slug?.current && (
                            <Image
                              src={module.image}
                              alt={module.slug.current}
                              width={512}
                              height={512}
                            />
                          )}
                        </motion.div>
                        <div className="sm:col-span-2 sm:row-start-1">
                          <h2 className="mb-3 text-center text-4xl font-semibold leading-tight sm:text-left">
                            {module.title}
                          </h2>
                          <h3 className="mb-5 text-center text-lg font-medium leading-normal text-react sm:text-left lg:text-xl">
                            {module.tagline}
                          </h3>
                          <div className="mb-5 text-center text-lg font-medium leading-normal sm:text-left lg:text-lg lg:leading-[1.77]">
                            {module.description}
                          </div>
                        </div>
                      </li>
                    )
                  }}
                </InView>
              )
            })}
          </ul>
        </div>
        <div className="bg-er-gray-100 pb-16 pt-8" id="buy">
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
        </div>
      </main>
    </Layout>
  )
}

export default Home
