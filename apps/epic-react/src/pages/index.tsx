import type {GetServerSideProps} from 'next'
import Image from 'next/image'
import {getToken} from 'next-auth/jwt'
import {Companies} from '@/components/landing/companies'
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
import Sparkle from 'react-sparkle'
import {useTheme} from 'next-themes'
import Testimonials from '@/components/landing/testimonials'
import {PlayIcon} from '@heroicons/react/solid'
import {GrPlayFill} from 'react-icons/gr'
import Link from 'next/link'
import {track} from '@/utils/analytics'
import {getAllBonuses, type Bonus} from '@/lib/bonuses'
import Faq, {FaqBody} from '@/pages/faq'
import {Projects} from '@/components/landing/projects'
import Balancer from 'react-wrap-balancer'
import {couponForPurchases, eRv1PurchasedOnDate} from '@/lib/purchases'
import KentImage from '../../public/kent-c-dodds.png'

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

  const erV1PurchasedOnDate = eRv1PurchasedOnDate(user?.purchases)
  const coupon =
    (await couponForPurchases(erV1PurchasedOnDate)) || query?.coupon

  const allowPurchase =
    pricingActive ||
    query?.allowPurchase === 'true' ||
    query?.coupon ||
    query?.code

  const products = await getAllActiveProducts(!allowPurchase)

  const {props: commerceProps} = await propsForCommerce({
    query: {
      ...query,
      coupon,
    },
    token,
    products,
  })

  const v2Modules = await getAllWorkshops()
  const bonuses = await getAllBonuses()
  const productLabels = coupon
    ? {
        'kcd_product-clzlrf0g5000008jm0czdanmz': 'Exclusive Upgrade Discount',
      }
    : {}

  return {
    props: {
      modules: v2Modules,
      bonuses,
      commerceProps,
      user,
      subscriber,
      productLabels,
      hasPurchasedV1: Boolean(erV1PurchasedOnDate),
    },
  }
}
const Home: React.FC<{
  modules: Workshop[]
  bonuses: Bonus[]
  commerceProps: CommerceProps
  user: User | null
  subscriber: Subscriber | null
  productLabels?: {[productId: string]: string}
  hasPurchasedV1?: boolean
}> = ({
  modules,
  commerceProps,
  bonuses,
  user,
  subscriber,
  productLabels,
  hasPurchasedV1 = false,
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

  const {theme} = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Layout
      meta={{
        title: 'Learn React 19 with Epic React by Kent C. Dodds',
      }}
    >
      <main>
        <section className="sm:pt-26 relative flex w-full flex-col items-center justify-center overflow-hidden bg-gray-900 pt-12">
          <div className="relative mb-8 flex items-center justify-center rounded-full">
            <div className="flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#F2BA24] to-[#FFA721] text-xs font-bold uppercase text-[#442D00]">
              <span className="flex items-center justify-center border-r border-black/10 bg-white/10 px-3 py-1.5 pr-2">
                new
              </span>
              <span className="flex items-center justify-center px-3 py-1.5 pl-2">
                {hasPurchasedV1 ? 'upgraded' : 'updated'} for react 19
              </span>
            </div>
            {!shouldReduceMotion && (
              <Sparkle
                flickerSpeed="slowest"
                count={10}
                color="rgb(253, 224, 71)"
                flicker={false}
                fadeOutSpeed={20}
                overflowPx={15}
              />
            )}
          </div>
          <h1 className="max-w-6xl text-balance px-5 text-center text-3xl font-bold leading-tight text-white transition-opacity sm:leading-tight md:text-5xl lg:text-6xl">
            {hasPurchasedV1
              ? 'Master React 19 with Fully Updated TypeScript Code Focused Workshops'
              : 'Master React 19 with Code Focused Workshops'}
          </h1>
          <h2 className="mt-5 inline-flex max-w-2xl flex-wrap items-center justify-center gap-x-3 text-balance px-5 text-center font-bold text-blue-200 sm:text-xl">
            <span>
              Self-paced, code-first, hands-on, React training for professional
              web developers by{' '}
            </span>
            <span className="inline-flex items-center font-normal">
              <Image
                priority
                src={require('../../public/kent-c-dodds.png')}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className="mr-1.5 size-8 rounded-full bg-gray-800 sm:size-10"
              />{' '}
              Kent C. Dodds
            </span>
          </h2>
          <div className="mt-10 grid w-full scale-[0.8] grid-cols-2 items-start justify-center gap-5 sm:mt-14 sm:max-w-xl sm:scale-100 sm:gap-16">
            <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
              <Image
                priority
                src={FiveStarsRatingImage}
                alt="5 out of 5 stars"
                width={104}
              />
              <p className="text-balance text-sm italic leading-[1.1] text-blue-200 sm:text-lg sm:leading-[1.2]">
                Epic React is a goldmine, years of experience put into minutes.
                I'm blown away.
              </p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
              <Image
                priority
                src={FiveStarsRatingImage}
                alt="5 out of 5 stars"
                width={104}
              />
              <p className="text-balance text-sm italic leading-[1.1] text-blue-200 sm:text-lg sm:leading-[1.2]">
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
        <section className="mx-auto mt-12 w-full max-w-screen-xl px-4 py-8 pb-16 sm:mt-10 sm:px-8 sm:pb-24">
          <div className="prose mx-auto max-w-none dark:prose-invert lg:prose-xl prose-headings:mx-auto prose-headings:max-w-3xl prose-h3:text-2xl  prose-p:mx-auto prose-p:max-w-3xl prose-ol:mx-auto prose-ol:max-w-3xl prose-ul:mx-auto prose-ul:max-w-3xl">
            <LandingCopy
              hasPurchasedV1={hasPurchasedV1}
              components={{
                Image,
                ModulesListWithDescriptions: () => (
                  <ModulesListWithDescriptions
                    modules={[...modules, ...bonuses]}
                  />
                ),
                RocketFlyBy: () => {
                  return isMounted ? (
                    <Image
                      className="mx-auto !-mt-10 w-full max-w-3xl"
                      src={
                        theme === 'light'
                          ? require(`../../public/assets/rocket-flyby-light@2x.png`)
                          : require(`../../public/assets/rocket-flyby-dark@2x.png`)
                      }
                      alt=""
                      aria-hidden="true"
                      quality={100}
                      loading="eager"
                    />
                  ) : null
                },
                TutorialWidget,
                Projects,
                AboutKent: ({children}: any) => {
                  return (
                    <div className="px-8 sm:px-10">
                      <Image
                        src={KentImage}
                        width={150}
                        height={150}
                        alt="Kent C. Dodds"
                        className="float-right ml-5 aspect-square w-32 rounded-full bg-white/5 sm:ml-10 sm:w-auto"
                        style={{
                          shapeOutside: 'circle()',
                        }}
                      />
                      <div className="pt-2">{children}</div>
                    </div>
                  )
                },
              }}
            />
          </div>
        </section>
        <section
          className="bg-er-gray-100 pb-24 pt-8"
          aria-label="Enroll in Epic React"
          id="buy"
        >
          {commerceProps.products?.length > 0 ? (
            <>
              <div className="py-8 lg:py-16">
                <div className="mx-auto w-full max-w-screen-lg px-5 text-center">
                  <h2 className="max-w-6xl text-balance px-5 text-center text-3xl font-bold leading-tight text-white transition-opacity sm:leading-tight md:text-5xl lg:text-6xl">
                    {hasPurchasedV1
                      ? 'Upgrade to Epic React v2 for React 19 and TypeScript with an All New Learning Experience'
                      : 'Code Your Way to React Mastery'}
                  </h2>
                  <h3 className="mx-auto mt-5 max-w-4xl text-balance text-xl font-extrabold text-react sm:text-2xl">
                    Epic React is your hands-on, code-first, at the keyboard,
                    cheat code to becoming the best React developer you can be.
                  </h3>
                </div>
                <Companies />
                <div className="mt-16 lg:mt-32">
                  <PricingSection
                    commerceProps={commerceProps}
                    className="mb-28 mt-12 md:mt-14 lg:mb-32 lg:mt-16"
                    productLabels={productLabels}
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
            <div className="mx-auto max-w-screen-lg px-5 py-10">
              <VersionTwoCta
                className="[&_[data-sr-button]]:text-white [&_[data-sr-input]]:border-gray-300 dark:[&_[data-sr-input]]:border-white/10"
                id="primary-newsletter-cta"
                title="Epic React v2 is Almost Here!"
                byline="It is launching September 23rd at 9am Pacific. Sign up for more details!"
                actionLabel="Keep me posted"
              />
            </div>
          )}
          <Testimonials />
          <header className="flex items-center justify-center px-5 pt-20">
            <h1 className="w-full text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
              <Balancer>Frequently Asked Questions</Balancer>
            </h1>
          </header>
          <main className="mx-auto w-full max-w-screen-lg px-5 py-16 lg:py-20">
            <FaqBody />
          </main>
        </section>
      </main>
    </Layout>
  )
}

export default Home

const TutorialWidget = () => {
  return (
    <div className="not-prose block sm:my-10">
      <Link
        href="/tutorials/get-started-with-react/get-started-with-react-intro"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track('clicked free preview', {
            location: 'home page',
            tutorial: 'get started with react',
          })
        }}
        id="free-preview"
        className="not-prose mx-auto flex w-full max-w-lg flex-col items-center overflow-hidden rounded border transition ease-in-out hover:bg-gray-100 dark:hover:bg-card sm:flex-row"
      >
        <div className="relative flex aspect-video h-full max-h-[200px] w-full items-center justify-center overflow-hidden border-r ">
          <Image
            src="https://res.cloudinary.com/epic-web/image/upload/v1726811725/free-preview-thumbnail_2x.jpg"
            className="object-cover opacity-75"
            fill
            // width={340}
            // height={190}
            alt="Get Started With React"
          />
          <GrPlayFill className="absolute h-5 w-5 text-foreground drop-shadow-md" />
        </div>
        <div className="w-full p-5 pt-3">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase text-react">
            Free Preview
          </div>
          <h3 className="mt-1 text-xl font-semibold">Get Started With React</h3>
          <p className="mt-1 text-sm opacity-75">20 lessons</p>
        </div>
      </Link>
    </div>
  )
}
