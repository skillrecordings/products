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
        title: `Save ${percentageDiscount}% on Everything at Epic Web`,
        description: `Get ${percentageDiscount}% off all Epic Web workshops. Master full-stack web development with Kent C. Dodds.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1764066820/50-sale-card.jpg',
        },
      }}
      withContentNav={false}
    >
      <Header
        commerceProps={commerceProps}
        percentageDiscount={percentageDiscount}
      />

      <main className="relative">
        {/* Bundles Section */}

        {bundles.length > 0 && (
          <section className="relative mx-auto max-w-screen-xl px-5 py-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Workshop Bundles
              </h2>
              {/* <Sparkles /> */}
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                Save even more with our curated workshop bundles
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

        {/* Bottom CTA */}
        <section className="relative mx-auto flex max-w-screen-xl flex-col items-center justify-center px-5 py-16">
          <div
            className="absolute left-1/2 top-0 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800"
            aria-hidden="true"
          />
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
        <span className="block text-gray-900 dark:text-white">Save</span>
        <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-6xl text-transparent sm:text-7xl lg:text-8xl">
          {percentageDiscount}%
        </span>
        <span className="block text-gray-900 dark:text-white">
          on Every Bundle
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.2}}
        className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl"
      >
        <Balancer>
          Master full-stack web development with professional workshops from
          Kent C. Dodds and other industry experts.
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
