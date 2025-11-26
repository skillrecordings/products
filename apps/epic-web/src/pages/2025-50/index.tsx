import * as React from 'react'
import Layout from 'components/app/layout'
import type {GetServerSideProps, NextPage} from 'next'
import AboutKent from 'components/contributor-bio'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {useRouter} from 'next/router'
import {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Sparkles} from '../buy'
import {getAvailableBonuses} from 'lib/available-bonuses'
import {getToken} from 'next-auth/jwt'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import SaleCountdown from '@skillrecordings/skill-lesson/path-to-purchase/sale-countdown'
import {PoweredByStripe} from 'components/powered-by-stripe'
import Testimonials from 'components/testimonials'
import {MoreCompanies} from 'components/more-companies'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getAllWorkshops, type Workshop} from 'lib/workshops'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {cn} from '@skillrecordings/ui/utils/cn'
import {Button} from '@skillrecordings/ui'

type PageProps = {
  products: SanityProduct[]
  workshops: Workshop[]
  bonuses: any[]
  commerceProps: CommerceProps
}

const SalePage: NextPage<PageProps> = ({
  products,
  workshops,
  bonuses,
  commerceProps,
}) => {
  const router = useRouter()
  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const {validCoupon} = useCoupon(commerceProps?.couponFromCode, {
    id: products[0]?.productId,
    image: {
      url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
      width: 132,
      height: 112,
    },
    title: products[0]?.title as string,
    description: products[0]?.description,
  })

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  // Get the megabundle product
  const megabundle = products.find(
    (p) => p.slug === 'megabundle' && p.state === 'active',
  )

  // Only show specific bundles: Testing Bundle and Full Stack Vol 1
  const FEATURED_BUNDLE_SLUGS = ['full-stack', 'testing']
  const bundles = products.filter(
    (p) =>
      p.modules &&
      p.modules.length > 1 &&
      p.state === 'active' &&
      p.slug &&
      FEATURED_BUNDLE_SLUGS.includes(p.slug),
  )
  const individualProducts = products.filter(
    (p) => p.modules && p.modules.length === 1 && p.state === 'active',
  )

  const percentageDiscount =
    Number(commerceProps?.couponFromCode?.percentageDiscount) * 100 || 50

  return (
    <Layout
      meta={{
        titleAppendSiteName: false,
        title: `${percentageDiscount}% Off: Finally Ship Code You're Proud Of`,
        description: `Stop piecing together random tutorials. Epic Web workshops cut years off your learning curve. ${percentageDiscount}% off this week only.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1764079214/50-sale-card.jpg',
        },
      }}
      withContentNav={false}
    >
      <Header
        commerceProps={commerceProps}
        percentageDiscount={percentageDiscount}
      />

      {/* Bridge Section */}
      <section className="relative mx-auto max-w-screen-xl px-5 py-16">
        <div
          className="absolute left-1/2 top-0 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
            You&apos;ve spent years bouncing between docs, tutorials, and Stack
            Overflow—piecing together knowledge that never quite sticks.{' '}
            <span className="text-gray-900 dark:text-white">
              What if you could skip all that and learn the way senior devs
              actually think?
            </span>
          </p>
        </div>

        {/* Testimonials */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Testimonial 1 */}
          <div className="rounded-xl border border-gray-200 bg-white/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <p className="text-gray-600 dark:text-gray-300">
              &ldquo;The workshop format really works for knowledge retention.{' '}
              <strong className="text-gray-900 dark:text-white">
                I learned a lot and I&apos;ve been doing React for about 5
                years!
              </strong>
              &rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Image
                src="/testimonials-images/aaron-mcadam.jpg"
                alt="Aaron McAdam"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Aaron McAdam
              </span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="rounded-xl border border-gray-200 bg-white/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <p className="text-gray-600 dark:text-gray-300">
              &ldquo;Since taking Kent&apos;s Epic React course, I&apos;ve
              introduced exactly{' '}
              <strong className="text-gray-900 dark:text-white">
                zero bugs
              </strong>{' '}
              to prod 👍&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Image
                src="/testimonials-images/imyjimmy.jpg"
                alt="imyjimmy"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                imyjimmy
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="relative">
        {/* Mega Bundle Section */}
        {megabundle && (
          <section className="relative mx-auto max-w-screen-xl px-5 py-16">
            <div className="overflow-hidden rounded-2xl border border-purple-300 bg-gradient-to-br from-purple-50 via-violet-100/50 to-white dark:border-purple-500/20 dark:from-purple-950/50 dark:via-gray-900 dark:to-gray-900">
              <div className="flex flex-col gap-8 p-8 md:p-12">
                <div className="space-y-6">
                  <div className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                    🎯 Everything you need to ship
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    {megabundle.title || 'The Complete Epic Web Mega Bundle'}
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-200">
                    <p>
                      For one low price, you can learn the ins & outs of Epic
                      Web Development, from the basics of React to shipping full
                      scale production web applications—not just the
                      technologies and techniques, you&apos;ll also learn the
                      why, the principles I&apos;ve used to pick the right
                      problems, choose the right tools, architect my projects in
                      a way that lasts.
                    </p>
                    <p>
                      This is not a sit-on-your-butt-and-watch-lectures bundle.
                      This is a learn-with-your-hands-on-the-keyboard bundle.
                      The Epic Way is active learning because the most powerful
                      learning is doing. Every course in this bundle is chock
                      full of challenges and exercises to get you coding (with
                      enough explanation to get you going, of course).
                    </p>
                  </div>
                  <div className="pt-4">
                    <PriceCheckProvider
                      purchasedProductIds={purchasedProductIds}
                    >
                      <div data-pricing-container="">
                        <Pricing
                          bonuses={bonuses}
                          allowPurchase={true}
                          userId={commerceProps?.userId}
                          product={megabundle}
                          purchased={purchasedProductIds.includes(
                            megabundle.productId,
                          )}
                          index={0}
                          couponId={couponId}
                          couponFromCode={commerceProps?.couponFromCode}
                          options={{
                            withGuaranteeBadge: true,
                            saleCountdownRenderer: (props: any) => (
                              <div className="pb-5">
                                <SaleCountdown
                                  data-pricing-product-sale-countdown=""
                                  size="lg"
                                  {...props}
                                />
                              </div>
                            ),
                          }}
                        />
                      </div>
                    </PriceCheckProvider>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bundles Section */}

        {bundles.length > 0 && (
          <section className="relative mx-auto max-w-screen-xl px-5 pt-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                The Complete Systems
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-gray-600 dark:text-gray-400">
                Stop duct-taping tutorials together. Each bundle is a complete
                learning path—start to finish.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {bundles.map((product, i) => (
                  <PriceCheckProvider
                    key={product.slug}
                    purchasedProductIds={purchasedProductIds}
                  >
                    <div data-pricing-container="">
                      <Pricing
                        bonuses={bonuses}
                        allowPurchase={true}
                        userId={commerceProps?.userId}
                        product={product}
                        purchased={purchasedProductIds.includes(
                          product.productId,
                        )}
                        index={i}
                        couponId={couponId}
                        couponFromCode={commerceProps?.couponFromCode}
                        options={{
                          withGuaranteeBadge: true,
                          saleCountdownRenderer: (props: any) => (
                            <div className="pb-5">
                              <SaleCountdown
                                data-pricing-product-sale-countdown=""
                                size="lg"
                                {...props}
                              />
                            </div>
                          ),
                        }}
                      />
                    </div>
                  </PriceCheckProvider>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Bottom CTA */}
        <section className="relative mx-auto flex max-w-screen-xl flex-col items-center justify-center px-5 pb-16">
          <div className="mx-auto flex items-center justify-center">
            <PoweredByStripe />
          </div>
          <Image
            className="mb-8 mt-3"
            src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
            width={130}
            height={130}
            alt="30-Day Money Back Guarantee"
          />
        </section>
        {/* Testing JavaScript Cross-sell */}
        <section className="relative mx-auto max-w-screen-xl px-5 pb-16">
          <div className="overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 via-amber-100/50 to-white dark:border-amber-500/20 dark:from-amber-950/40 dark:via-gray-900 dark:to-gray-900">
            <div className="flex flex-col items-center gap-8 p-8 md:flex-row md:p-12">
              {/* Image */}
              <div className="flex-shrink-0">
                <Image
                  src="https://res.cloudinary.com/epic-web/image/upload/v1764076684/testingjs.png"
                  width={280}
                  quality={100}
                  height={280}
                  alt="Testing JavaScript"
                  className="drop-shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  ✨ Ship code without the anxiety
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Stop Being Afraid to Refactor
                </h2>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  Your test suite is either non-existent, painfully slow, or so
                  flaky that nobody trusts it. You&apos;re manually clicking
                  through your app before every deploy.{' '}
                  <span className="italic text-amber-700 dark:text-amber-400">
                    Sound familiar?
                  </span>
                </p>
                <p className="text-base text-gray-700 dark:text-gray-200">
                  <strong>Testing JavaScript</strong> teaches you exactly what
                  to test (and what not to), so you can ship with confidence and
                  actually go home on time.
                </p>
                <ul className="grid grid-cols-1 gap-2 pt-2 text-sm sm:grid-cols-2">
                  {[
                    'Write tests that catch real bugs',
                    'Refactor without fear',
                    'Stop the "works on my machine" nightmare',
                    'Tests that run in seconds, not minutes',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600 dark:text-gray-900 dark:hover:bg-amber-400"
                  >
                    <Link href="https://testingjavascript.com" target="_blank">
                      Start testing like a pro →
                    </Link>
                  </Button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Save up to $166 with the bundle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Epic React Cross-sell */}
        <section className="relative mx-auto max-w-screen-xl px-5 pb-16">
          <div className="overflow-hidden rounded-2xl border border-cyan-300 bg-gradient-to-br from-cyan-50 via-sky-100/50 to-white dark:border-cyan-500/20 dark:from-cyan-950/50 dark:via-slate-900 dark:to-slate-900">
            <div className="flex flex-col items-center gap-8 p-8 md:flex-row md:p-12">
              {/* Image */}
              <div className="flex-shrink-0">
                <Image
                  src="https://res.cloudinary.com/epic-web/image/upload/v1723149668/React_Performance.png"
                  width={280}
                  quality={100}
                  height={280}
                  alt="Epic React"
                  className="drop-shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                  🚀 Updated for React 19
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Finally Understand What You&apos;re Building
                </h2>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  React 19 dropped. Server Components are everywhere. Your
                  useEffect spaghetti isn&apos;t cutting it anymore. And
                  honestly?{' '}
                  <span className="italic text-cyan-700 dark:text-cyan-400">
                    You&apos;re not sure you fully understand how any of it
                    works.
                  </span>
                </p>
                <p className="text-base text-gray-700 dark:text-gray-200">
                  <strong>Epic React</strong> takes you from copying code off
                  StackOverflow to being the React expert your team asks for
                  help. 7 workshops. 240 lessons. All hands-on, all TypeScript.
                </p>
                <ul className="grid grid-cols-1 gap-2 pt-2 text-sm sm:grid-cols-2">
                  {[
                    'Stop guessing, start understanding',
                    "Build apps that don't tank on load",
                    'Server Components that make sense',
                    'Be the expert, not the one asking',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-600 dark:text-slate-900 dark:hover:bg-cyan-400"
                  >
                    <Link href="https://epicreact.dev#buy" target="_blank">
                      Become the React expert →
                    </Link>
                  </Button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Save 50% this week only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Individual Workshops Section */}
        {/* <section className="relative mx-auto max-w-screen-xl px-5 py-16">
          <div
            className="absolute left-1/2 top-0 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800"
            aria-hidden="true"
          />
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Balancer>Individual Workshops</Balancer>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Deep-dive into specific topics with our standalone workshops
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {individualProducts.map((product, i) => {
              const workshop = workshops.find((w) =>
                w.product?.some((p) => p.productId === product.productId),
              )
              return (
                <WorkshopCard
                  key={product.productId}
                  product={product}
                  workshop={workshop}
                  commerceProps={commerceProps}
                  purchasedProductIds={purchasedProductIds}
                  couponId={couponId}
                  bonuses={bonuses}
                  index={i}
                />
              )
            })}
          </div>
        </section> */}

        <AboutKent />
        <MoreCompanies />
        <Testimonials />
      </main>
    </Layout>
  )
}

const Header: React.FC<{
  commerceProps: CommerceProps
  percentageDiscount: number
}> = ({commerceProps, percentageDiscount}) => {
  const expiresAt = commerceProps?.couponFromCode?.expires

  return (
    <header className="relative mx-auto flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white px-5 pb-8 pt-16 text-center dark:from-amber-950/20 dark:via-background dark:to-background sm:pb-12 sm:pt-24">
      {/* Decorative elements */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl dark:bg-orange-500/10" />
      </div>

      {/* Sale badge */}
      <motion.div
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.5}}
        className="relative mb-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-lg font-bold text-white shadow-lg shadow-amber-500/25 dark:from-amber-400 dark:to-orange-400 dark:text-black">
          <span className="text-2xl">🔥</span>
          LIMITED TIME SALE
          <span className="text-2xl">🔥</span>
        </span>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.1}}
        className="relative z-10 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
      >
        <span className="block text-gray-900 dark:text-white">
          Finally Ship Code
        </span>
        <span className="block text-gray-900 dark:text-white">
          You&apos;re{' '}
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Actually Proud Of
          </span>
        </span>
      </motion.h1>

      {/* Discount callout */}
      <motion.div
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.15}}
        className="relative z-10 mt-6 rounded-lg border border-amber-300 bg-amber-100/50 px-4 py-2 dark:border-amber-500/30 dark:bg-amber-900/20"
      >
        <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
          {percentageDiscount}% OFF everything
        </span>
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          — this week only
        </span>
      </motion.div>

      {/* Subheadline */}
      <motion.p
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.2}}
        className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl"
      >
        <Balancer>
          Stop piecing together random tutorials. These workshops cut years off
          your learning curve—from testing to auth to full-stack architecture.
        </Balancer>
      </motion.p>

      {/* Countdown timer */}
      {expiresAt && (
        <motion.div
          initial={{y: 20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{duration: 0.5, delay: 0.3}}
          className="relative z-10 mt-8"
        >
          <SaleCountdown coupon={{expires: expiresAt}} size="lg" />
        </motion.div>
      )}

      {/* CTA arrow */}
      <motion.div
        initial={{y: 0, opacity: 0}}
        animate={{y: [0, 10, 0], opacity: 1}}
        transition={{
          y: {duration: 1.5, repeat: Infinity, ease: 'easeInOut'},
          opacity: {duration: 0.5, delay: 0.4},
        }}
        className="mt-12 text-gray-400 dark:text-gray-600"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </header>
  )
}

const WorkshopCard: React.FC<{
  product: SanityProduct
  workshop: Workshop | undefined
  commerceProps: CommerceProps
  purchasedProductIds: string[]
  couponId: string | undefined
  bonuses: any[]
  index: number
}> = ({
  product,
  workshop,
  commerceProps,
  purchasedProductIds,
  couponId,
  bonuses,
  index,
}) => {
  const isPurchased = purchasedProductIds.includes(product.productId)
  const instructor = workshop?.instructor

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, delay: index * 0.05}}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900',
        isPurchased &&
          'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900',
      )}
    >
      {/* Image */}
      {workshop?.image && (
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={workshop.image}
            alt={product.title ?? ''}
            fill
            className="object-cover p-10 transition-transform duration-300 group-hover:scale-105"
          />
          {isPurchased && (
            <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-sm font-medium text-white">
              Purchased
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {product.title}
        </h3>

        {/* Instructor */}
        {instructor && (
          <div className="mt-3 flex items-center gap-2">
            {instructor.picture?.url && (
              <Image
                src={instructor.picture.url}
                alt={instructor.name}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {instructor.name}
            </span>
          </div>
        )}

        {/* Description */}
        {(workshop?.description || product.description) && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
            {workshop?.description || product.description}
          </p>
        )}

        {/* Price and CTA */}
        {/* <div className="relative mt-4">
          <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
            <Pricing
              bonuses={bonuses}
              allowPurchase={!isPurchased}
              userId={commerceProps?.userId}
              product={product}
              purchased={isPurchased}
              index={index}
              couponId={couponId}
              couponFromCode={commerceProps?.couponFromCode}
              options={{
                withGuaranteeBadge: false,
                withImage: false,
                isPPPEnabled: false,
                saleCountdownRenderer: () => null,
              }}
            />
          </PriceCheckProvider>
        </div> */}

        {/* Learn more link */}
        <Link
          href={`/workshops/${workshop?.slug?.current || product.slug}`}
          className="mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Learn more →
        </Link>
      </div>
    </motion.div>
  )
}

export default SalePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context
  const token = await getToken({req})

  // Fetch all products
  const allProducts = await getAllProducts()
  const activeProducts = allProducts.filter(
    (product: {type: string; state: string}) =>
      product.type === 'self-paced' && product.state === 'active',
  )

  // Fetch workshops for descriptions
  const workshops = await getAllWorkshops()

  // Fetch bonuses
  const availableBonuses = await getAvailableBonuses()

  // Get commerce props with the active coupon
  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products: activeProducts,
  })

  return {
    props: {
      products: activeProducts,
      workshops,
      bonuses: availableBonuses,
      commerceProps,
    },
  }
}
