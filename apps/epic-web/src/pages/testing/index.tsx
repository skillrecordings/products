import React, {useCallback} from 'react'
import Layout from 'components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import AboutKent from 'components/contributor-bio'
import Balancer from 'react-wrap-balancer'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from 'utils/analytics'
import Image from 'next/image'
import TestingLandingCopy from 'components/testing-landing-copy.mdx'
import Particles, {initParticlesEngine} from '@tsparticles/react'
import type {Engine} from '@tsparticles/engine'
import {loadSlim} from '@tsparticles/slim'
import {loadStarsPreset} from 'tsparticles-preset-stars'

import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {trpc} from 'trpc/trpc.client'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {useRouter} from 'next/router'
import {getProduct} from 'lib/products'
import {
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {getPricing} from '@skillrecordings/skill-lesson/lib/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'

import ReactMarkdown from 'react-markdown'
import {useTheme} from 'next-themes'
import Link from 'next/link'
import MuxPlayer from '@mux/mux-player-react'
import '@mux/mux-player/themes/minimal'
import {getAvailableBonuses} from 'lib/available-bonuses'
import {XIconTwitter} from 'components/x-icon'
import path from 'path'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import {Sparkles} from 'pages/buy'

const productId = 'cf54eeca-309b-493d-9628-1c31289a7515'

export const getStaticProps: GetStaticProps = async () => {
  const sanityProduct = await getProduct(productId as string)
  const pricing = await getPricing('epic-testing')
  const products = pricing && pricing.products
  const availableBonuses = await getAvailableBonuses()

  return {
    props: {
      product: sanityProduct,
      products,
      bonuses: availableBonuses,
    },
    revalidate: 10,
  }
}

const Index: NextPage<{
  product: SanityProduct
  products: SanityProduct[]
  bonuses: any[]
}> = ({product, products, bonuses}) => {
  const router = useRouter()
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' ||
    product.state === 'active' ||
    product.state === 'published'
  const {subscriber, loadingSubscriber} = useConvertkit()
  const pricingProduct = products?.[0] // The actual product being sold

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      ...router.query,
      productId: pricingProduct.productId,
    })

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
    {
      id: pricingProduct.productId,
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: pricingProduct.title as string,
      description: pricingProduct.description,
    },
  )

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const hasPurchased = purchasedProductIds.includes(productId)

  return (
    <>
      <Layout
        meta={{
          titleAppendSiteName: false,
          title: 'Master Testing for Better Web Applications Using Vitest',
          description:
            'Learn from the creator and maintainer of Mock Service Worker, Artem Zakharchenko.',
          ogImage: {
            url: 'https://res.cloudinary.com/epic-web/image/upload/v1747163854/testing.jpg',
          },
        }}
        navigationClassName=""
      >
        <Header />
        <main className="">
          <Article workshops={product.modules} />
          <section className="relative mt-16 flex flex-col items-center justify-start ">
            <div className="flex flex-col items-center justify-center px-5 pb-0 pt-0">
              <h2 className="max-w-xl text-balance text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
                Master Testing for Better Web Applications Using Vitest
              </h2>
              <h3 className="max-w-lg text-balance pt-5 text-center text-lg text-blue-600 dark:text-blue-300">
                Learn from the creator and maintainer of Mock Service Worker,
                Artem Zakharchenko.
              </h3>
            </div>
            <div
              id="buy"
              className="relative flex flex-col items-center justify-start"
            >
              {products
                ?.filter((product: any) => product.state !== 'unavailable')
                .map((product, i) => {
                  return (
                    <PriceCheckProvider
                      key={product.slug}
                      purchasedProductIds={purchasedProductIds}
                    >
                      <div
                        id="testing-bundle"
                        data-pricing-container=""
                        key={product.name}
                      >
                        <Pricing
                          bonuses={bonuses}
                          allowPurchase={ALLOW_PURCHASE}
                          userId={commerceProps?.userId}
                          product={pricingProduct}
                          purchased={purchasedProductIds.includes(
                            product.productId,
                          )}
                          index={i}
                          couponId={couponId}
                          couponFromCode={commerceProps?.couponFromCode}
                        />
                      </div>
                    </PriceCheckProvider>
                  )
                })}
            </div>
            {/* {ALLOW_PURCHASE ? ( */}
            <>
              <Image
                className="-mt-16 mb-8 "
                src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
                width={130}
                height={130}
                alt="30-Day Money Back Guarantee"
              />
              <div className="mb-16 flex w-full items-center justify-center pt-3 text-gray-600 dark:text-gray-400">
                <PoweredByStripe />
              </div>
            </>
            {/* ) : null} */}
          </section>
        </main>
      </Layout>
    </>
  )
}

export const PoweredByStripe = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="135"
    height="31"
    viewBox="0 0 135 31"
  >
    <g fill="currentColor">
      <path d="M131.4,0 L3.357,0 C1.50298009,0 0,1.50298009 0,3.357 L0,27.243 C0,29.0970199 1.50298009,30.6 3.357,30.6 L131.4,30.6 C133.388225,30.6 135,28.9882251 135,27 L135,3.6 C135,1.6117749 133.388225,0 131.4,0 Z M134.1,27 C134.1,28.4911688 132.891169,29.7 131.4,29.7 L3.357,29.7 C2.00208619,29.695064 0.904935983,28.5979138 0.9,27.243 L0.9,3.357 C0.904935983,2.00208619 2.00208619,0.904935983 3.357,0.9 L131.4,0.9 C132.891169,0.9 134.1,2.10883118 134.1,3.6 L134.1,27 Z" />
      <path d="M15.363 10.116L11.493 10.116 11.493 19.8 13.221 19.8 13.221 16.056 15.363 16.056C17.523 16.056 18.873 15.012 18.873 13.086 18.873 11.16 17.523 10.116 15.363 10.116zM15.273 14.616L13.221 14.616 13.221 11.646 15.3 11.646C16.542 11.646 17.199 12.177 17.199 13.131 17.199 14.085 16.515 14.571 15.3 14.571L15.273 14.616zM22.59 12.6C21.633243 12.5889275 20.716284 12.9823339 20.0650169 13.683303 19.4137498 14.3842721 19.0887204 15.3276375 19.17 16.281 19.0549476 17.5737429 19.6796144 18.8206607 20.7838979 19.5025546 21.8881815 20.1844484 23.2828185 20.1844484 24.3871021 19.5025546 25.4913856 18.8206607 26.1160524 17.5737429 26.001 16.281 26.0849846 15.3285439 25.7621195 14.385011 25.1122289 13.6836779 24.4623383 12.9823448 23.5460846 12.5886755 22.59 12.6L22.59 12.6zM22.59 18.603C21.492 18.603 20.79 17.703 20.79 16.281 20.79 14.859 21.474 13.959 22.59 13.959 23.706 13.959 24.39 14.859 24.39 16.281 24.39 17.703 23.679 18.594 22.59 18.594L22.59 18.603z" />
      <polygon points="33.102 17.415 31.833 12.717 30.501 12.717 29.241 17.415 27.963 12.717 26.298 12.717 28.431 19.809 29.835 19.809 31.131 15.165 32.427 19.809 33.831 19.809 35.964 12.717 34.362 12.717" />
      <path d="M39.6 12.6C38.6563378 12.617526 37.7611381 13.0212277 37.1232953 13.7169016 36.4854526 14.4125754 36.1607656 15.3393634 36.225 16.281 36.1489391 17.2377463 36.4794681 18.1822674 37.1354919 18.8828254 37.7915157 19.5833835 38.7123251 19.9751481 39.672 19.962 41.0099668 20.0340878 42.2448194 19.2446512 42.741 18L41.4 17.442C41.1832618 18.1582941 40.4994808 18.6290941 39.753 18.576 39.2313133 18.5884561 38.72729 18.3866967 38.3582966 18.0177034 37.9893033 17.64871 37.7875439 17.1446867 37.8 16.623L42.768 16.623 42.768 16.083C42.786 14.139 41.688 12.6 39.6 12.6zM37.863 15.417C37.9934686 14.5623142 38.7355335 13.9355962 39.6 13.95 40.0017649 13.9160442 40.3987373 14.0564539 40.6898051 14.3354657 40.9808729 14.6144775 41.1379399 15.0051587 41.121 15.408L37.863 15.417zM45.621 13.77L45.621 12.717 44.001 12.717 44.001 19.8 45.621 19.8 45.621 16.083C45.5918008 15.5972459 45.7720465 15.1222465 46.1161465 14.7781465 46.4602465 14.4340465 46.9352459 14.2538008 47.421 14.283 47.6187533 14.2690211 47.8172467 14.2690211 48.015 14.283L48.015 12.663C47.889 12.663 47.745 12.663 47.556 12.663 46.7498708 12.6212297 45.9935619 13.0539088 45.621 13.77L45.621 13.77zM51.732 12.6C50.7883378 12.617526 49.8931381 13.0212277 49.2552953 13.7169016 48.6174526 14.4125754 48.2927656 15.3393634 48.357 16.281 48.2809391 17.2377463 48.6114681 18.1822674 49.2674919 18.8828254 49.9235157 19.5833835 50.8443251 19.9751481 51.804 19.962 53.1290406 20.0183528 54.3451582 19.2316654 54.837 18L53.451 17.469C53.2342618 18.1852941 52.5504808 18.6560941 51.804 18.603 51.2932017 18.5983235 50.8056094 18.3890201 50.4503745 18.021944 50.0951396 17.6548679 49.901931 17.1606771 49.914 16.65L54.9 16.65 54.9 16.11C54.9 14.139 53.784 12.6 51.732 12.6zM49.995 15.417C50.1290295 14.5693285 50.8648625 13.9484694 51.723 13.959 52.1247649 13.9250442 52.5217373 14.0654539 52.8128051 14.3444657 53.1038729 14.6234775 53.2609399 15.0141587 53.244 15.417L49.995 15.417zM60.804 13.5C60.2981006 12.9063528 59.5495726 12.5751457 58.77 12.6 56.781 12.6 55.647 14.265 55.647 16.281 55.647 18.297 56.781 19.962 58.77 19.962 59.5503519 19.9908831 60.3005581 19.6589335 60.804 19.062L60.804 19.8 62.424 19.8 62.424 10.116 60.804 10.116 60.804 13.5zM60.804 16.515C60.8774507 17.034297 60.7207587 17.5598035 60.3749061 17.9540755 60.0290534 18.3483475 59.5284404 18.5721688 59.004 18.567 57.825 18.567 57.204 17.667 57.204 16.299 57.204 14.931 57.834 14.031 59.004 14.031 60.003 14.031 60.804 14.76 60.804 16.092L60.804 16.515zM71.379 12.6C70.5846402 12.5652443 69.8182766 12.8970034 69.3 13.5L69.3 10.116 67.68 10.116 67.68 19.8 69.3 19.8 69.3 19.053C69.808699 19.6480752 70.5605694 19.9792956 71.343 19.953 73.323 19.953 74.457 18.279 74.457 16.272 74.457 14.265 73.359 12.6 71.379 12.6zM71.1 18.54C70.5755596 18.5451688 70.0749466 18.3213475 69.7290939 17.9270755 69.3832413 17.5328035 69.2265493 17.007297 69.3 16.488L69.3 16.065C69.3 14.733 70.056 14.004 71.1 14.004 72.27 14.004 72.9 14.904 72.9 16.272 72.9 17.64 72.225 18.54 71.1 18.54zM78.237 17.694L76.5 12.717 74.79 12.717 77.4 19.548 77.13 20.214C77.0346263 20.6882008 76.5814941 21.0022135 76.104 20.925 75.9242392 20.9381242 75.7437608 20.9381242 75.564 20.925L75.564 22.284C75.7814659 22.3163462 76.0011547 22.3313933 76.221 22.329 77.3806394 22.4133147 78.4342973 21.6552874 78.723 20.529L81.639 12.771 79.938 12.771 78.237 17.694zM112.5 11.1869548C111.782332 11.1828508 111.092541 11.4645964 110.583 11.97L110.457 11.349 108.306 11.349 108.306 22.977 110.754 22.446 110.754 19.629C111.240889 20.0367468 111.855927 20.2598173 112.491 20.259 114.237 20.259 115.839 18.828 115.839 15.66 115.839 12.762 114.219 11.1869548 112.5 11.1869548zM111.915 18.054C111.480179 18.079063 111.057149 17.9072067 110.763 17.586L110.763 13.887C111.058407 13.554017 111.488311 13.3721343 111.933 13.392 112.833 13.392 113.445 14.409 113.445 15.714 113.445 17.019 112.824 18.054 111.915 18.054zM120.357 11.187C117.999 11.187 116.568 13.221 116.568 15.786 116.568 18.819 118.26 20.358 120.672 20.358 121.613359 20.3733552 122.542942 20.1471568 123.372 19.701L123.372 17.676C122.619085 18.05589 121.785219 18.2473704 120.942 18.234 119.97 18.234 119.142 17.883 119.016 16.704L123.858 16.704C123.858 16.569 123.858 16.038 123.858 15.804 123.939 13.221 122.715 11.187 120.357 11.187zM119.034 14.85C119.034 13.716 119.727 13.239 120.339 13.239 120.951 13.239 121.599 13.716 121.599 14.85L119.034 14.85zM101.7 12.024L101.547 11.286 99.459 11.286 99.459 20.025 101.871 20.025 101.871 14.103C102.31707 13.5614306 103.052315 13.35341 103.716 13.581L103.716 11.286C102.954056 10.9875127 102.089152 11.3041294 101.7 12.024L101.7 12.024zM89.514 13.914C89.514 13.518 89.838 13.365 90.351 13.365 91.2012028 13.3833007 92.0345748 13.6055333 92.781 14.013L92.781 11.646C92.0092783 11.3339647 91.1833694 11.1779596 90.351 11.187 88.362 11.187 87.039 12.249 87.039 14.031 87.039 16.821 90.765 16.371 90.765 17.568 90.765 18.036 90.369 18.189 89.865 18.189 88.914116 18.1334321 87.9894451 17.8560308 87.165 17.379L87.165 19.8C88.0147232 20.1789884 88.9345908 20.3752268 89.865 20.376 91.899 20.376 93.303 19.341 93.303 17.532 93.258 14.508 89.514 15.048 89.514 13.914zM96.552 9.216L94.167 9.738 94.167 17.775C94.1421519 18.4595208 94.4000466 19.1241102 94.8801201 19.6126956 95.3601935 20.101281 96.0201482 20.370815 96.705 20.358 97.296266 20.3844312 97.885375 20.2703106 98.424 20.025L98.424 18C98.109 18.135 96.57 18.594 96.57 17.1L96.57 13.5 98.424 13.5 98.424 11.394 96.57 11.394 96.552 9.216z" />
      <polygon points="104.625 10.53 107.082 10.017 107.082 8.073 104.625 8.586" />
      <rect width="2.457" height="8.676" x="104.625" y="11.349" />
    </g>
  </svg>
)

const Article: React.FC<{
  workshops: SanityProductModule[]
}> = ({workshops}) => {
  return (
    <article className="prose prose-lg mx-auto max-w-none pt-0 dark:prose-invert lg:prose-xl prose-headings:mx-auto prose-headings:max-w-3xl prose-headings:font-bold prose-p:mx-auto prose-p:max-w-3xl prose-p:text-gray-900 prose-ul:mx-auto prose-ul:max-w-3xl prose-ul:pl-0 prose-li:text-gray-900 dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 sm:pt-5">
      <TestingLandingCopy
        components={{
          // ...linkedHeadingComponents,
          Image,
          Testimonial: ({children, author, url}: any) => {
            return (
              <blockquote className="!mt-0 flex h-full flex-col border-l-0 !p-0 not-italic">
                <div className="text-lg font-normal">{children}</div>
                <div className="mt-5 flex w-full items-center justify-between gap-1.5 text-base">
                  <div className="flex items-center gap-2">
                    {author.image ? (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={40}
                        height={40}
                        className="!my-0 rounded-full"
                      />
                    ) : (
                      <span className="opacity-75">—</span>
                    )}
                    <span className="opacity-75">{author.name}</span>
                  </div>
                  {/* {url && (
                    <a
                      href={url}
                      className=""
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <XIconTwitter className="h-5 w-5 text-foreground opacity-50 transition hover:opacity-100" />
                    </a>
                  )} */}
                </div>
              </blockquote>
            )
          },
          PromoVideo: () => {
            return (
              <MuxPlayer
                metadata={{
                  video_title: 'Epic Testing Product Video',
                }}
                theme="minimal"
                playbackId="cqjuBzq74nu4ZlksxTXz7IKqxfaWaR1KjyGQLAc4nQ4"
                accentColor="#3b82f6"
                className="w-full rounded"
                poster="https://res.cloudinary.com/epic-web/image/upload/v1697358228/promo-video-poster.jpg"
              />
            )
          },
          WorkshopAppScreenshot,
          AboutArtem: ({children}: any) => {
            return (
              <div className="not-prose relative mx-auto flex max-w-3xl flex-col items-center gap-10 px-5 py-16 sm:flex-row">
                <div
                  className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800"
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800"
                  aria-hidden="true"
                />
                <Image
                  src={
                    'https://cdn.sanity.io/images/i1a93n76/production/0755d7dcfea0aae93b123d1687d02ee05af13dbe-1149x1149.jpg'
                  }
                  width={300}
                  height={300}
                  alt="Artem Zakharchenko"
                  className="rounded-lg"
                />
                <div className="space-y-5 text-center text-gray-700 dark:text-gray-300 sm:text-left [&_p]:text-base">
                  <h3 className="text-center text-2xl font-semibold sm:text-left sm:text-2xl lg:text-3xl">
                    Your Instructor
                  </h3>
                  <p>
                    Hi! My name is Artem, and I love automated testing. So much
                    so that I've built open-source software to promote the
                    testing practices I believe in that's now used in Google,
                    Microsoft, Amazon, Netflix, and by hundreds of thousands of
                    developers out there.
                  </p>
                  <p>
                    But it wasn't always like that. I used to be afraid of
                    testing. I didn't know if the tests I was writing made any
                    sense. Until pattern after pattern, concept after concept,
                    things "clicked". Almost a decade later, I am here to make
                    testing click for you.
                  </p>
                  <p>
                    I am honored to be your guide in the vast land of automated
                    testing. Let's go!
                  </p>
                </div>
              </div>
            )
          },
          Workshop: ({
            slug,
            title,
            image,
            meta,
            features,
            path = 'workshops',
          }: any) => {
            return (
              <li
                id={slug}
                key={slug}
                className="not-prose flex flex-col items-center gap-0 px-5 pb-16 sm:gap-10 lg:flex-row lg:items-start"
              >
                {image && (
                  <Link
                    href={`/${path}/${slug}`}
                    target="_blank"
                    className="flex-shrink-0 sm:-mt-8"
                  >
                    <Image src={image} width={300} height={300} alt={title} />
                  </Link>
                )}
                <div className="flex flex-col items-center sm:items-start">
                  <h3 className="text-center text-2xl font-bold lg:text-left lg:text-3xl">
                    <Link
                      href={`/workshops/${slug}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {title}
                    </Link>
                  </h3>
                  <p className="pt-2 text-center opacity-80 lg:text-left ">
                    {meta}
                  </p>
                  <ul className="pt-8">
                    {features.map((feature: any) => {
                      return (
                        <li
                          className='py-1 pl-7 before:-ml-7 before:pr-3 before:text-emerald-500 before:content-["✓"] dark:before:text-emerald-300'
                          key={feature}
                        >
                          <ReactMarkdown
                            unwrapDisallowed
                            disallowedElements={['p']}
                          >
                            {feature}
                          </ReactMarkdown>
                        </li>
                      )
                    })}
                  </ul>
                  <Link
                    href={`/workshops/${slug}`}
                    target="_blank"
                    className="mt-3 inline-flex w-full gap-1 py-2 pl-8 text-lg font-medium text-emerald-600 transition hover:underline hover:opacity-100 dark:text-emerald-300"
                  >
                    Learn more
                  </Link>
                </div>
              </li>
            )
          },
          CheckList: ({children}: any) => {
            return (
              <ul className=' pl-0 [&_li]:relative [&_li]:list-none [&_li]:pl-9 [&_li]:font-medium [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-1.5 [&_li]:before:flex [&_li]:before:h-6 [&_li]:before:w-6 [&_li]:before:items-center [&_li]:before:justify-center [&_li]:before:rounded-full [&_li]:before:bg-emerald-300/20 [&_li]:before:text-xs [&_li]:before:font-bold [&_li]:before:text-emerald-500 [&_li]:before:content-["✓"] [&_li]:dark:before:text-emerald-300 '>
                {children}
              </ul>
            )
          },
          CrossList: ({children}: any) => {
            return (
              <ul className=' pl-0 [&_li]:relative [&_li]:list-none [&_li]:pl-9 [&_li]:font-medium [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-1.5 [&_li]:before:flex [&_li]:before:h-6 [&_li]:before:w-6 [&_li]:before:items-center [&_li]:before:justify-center [&_li]:before:rounded-full [&_li]:before:bg-rose-300/20 [&_li]:before:pb-0.5 [&_li]:before:text-xl [&_li]:before:font-medium [&_li]:before:text-rose-500 [&_li]:before:content-["×"] [&_li]:dark:before:text-rose-300 '>
                {children}
              </ul>
            )
          },
        }}
      />
    </article>
  )
}

const Header = () => {
  return (
    <header className="relative mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#FFF6E7_0%,transparent_65%)] px-5 pb-16 pt-5 text-center dark:bg-[radial-gradient(ellipse_at_top,#1a1e2c_0%,transparent_65%)]">
      <div className="relative flex items-center justify-center">
        <Image
          src="https://res.cloudinary.com/epic-web/image/upload/v1728625797/vitest_2x.png"
          alt=""
          aria-hidden="true"
          width={200}
          height={200}
        />
        <Sparkles className="left-1/3 top-3" />
      </div>
      <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
        <span className="inline-flex pb-4 text-xs font-semibold uppercase tracking-wider text-amber-600  dark:text-orange-300 sm:text-sm">
          Everything You Need to Know to
        </span>
        <div className="text-balance text-gray-900 dark:text-white">
          Master Testing for Better Web Applications with{' '}
          <svg
            className="inline-block w-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 165 165"
            fill="none"
          >
            <path
              d="M120.831 57.2543L84.693 109.505C84.3099 110.059 83.7558 110.474 83.1148 110.687C82.4738 110.9 81.7809 110.898 81.1412 110.684C80.5015 110.469 79.95 110.052 79.5702 109.497C79.1905 108.941 79.0032 108.277 79.037 107.606L80.4833 78.7582L57.1343 73.8064C56.6353 73.7007 56.1704 73.474 55.7807 73.1465C55.391 72.8191 55.0885 72.4009 54.9001 71.929C54.7117 71.4571 54.6432 70.9461 54.7006 70.4412C54.758 69.9364 54.9395 69.4532 55.2291 69.0345L91.3675 16.7837C91.7507 16.2294 92.3048 15.8145 92.9458 15.6018C93.5869 15.3891 94.2798 15.3902 94.9196 15.6051C95.5593 15.8199 96.1109 16.2367 96.4906 16.7923C96.8703 17.3478 97.0575 18.0117 97.0236 18.6833L95.5773 47.5314L118.926 52.4828C119.425 52.5885 119.89 52.8152 120.28 53.1426C120.67 53.4701 120.972 53.8883 121.16 54.3602C121.349 54.8321 121.417 55.3431 121.36 55.8479C121.303 56.3528 121.121 56.836 120.831 57.2547L120.831 57.2543Z"
              fill="#FCC72B"
            />
            <path
              d="M82.9866 153.343C82.0254 153.344 81.0735 153.156 80.1855 152.788C79.2975 152.42 78.4909 151.88 77.8122 151.2L43.6658 117.056C42.2998 115.683 41.5341 113.824 41.5366 111.887C41.5392 109.95 42.3098 108.092 43.6796 106.723C45.0493 105.353 46.9064 104.582 48.8435 104.579C50.7807 104.577 52.6399 105.342 54.0134 106.708L82.9866 135.678L146.105 72.5626C147.481 71.2088 149.336 70.4536 151.266 70.4615C153.197 70.4693 155.046 71.2396 156.41 72.6045C157.775 73.9695 158.546 75.8184 158.554 77.7487C158.561 79.679 157.806 81.5342 156.452 82.9101L88.1597 151.2C87.4811 151.881 86.6747 152.42 85.7869 152.788C84.8992 153.156 83.9475 153.344 82.9866 153.343Z"
              fill="#929292"
            />
            <path
              d="M82.9572 153.343C83.9184 153.344 84.8703 153.156 85.7583 152.788C86.6463 152.42 87.4528 151.88 88.1316 151.2L122.278 117.056C123.644 115.683 124.41 113.824 124.407 111.887C124.405 109.95 123.634 108.092 122.264 106.723C120.894 105.353 119.037 104.582 117.1 104.579C115.163 104.577 113.304 105.342 111.93 106.708L82.9572 135.678L19.8389 72.5626C18.4629 71.2088 16.6077 70.4536 14.6775 70.4615C12.7472 70.4693 10.8982 71.2396 9.53331 72.6045C8.16839 73.9695 7.39811 75.8184 7.39025 77.7487C7.38239 79.679 8.13759 81.5342 9.49135 82.9101L77.784 151.2C78.4627 151.881 79.2691 152.42 80.1568 152.788C81.0446 153.156 81.9963 153.344 82.9572 153.343Z"
              fill="#A1A1A1"
              fill-opacity="0.5"
            />
          </svg>
          Vitest
        </div>
      </h1>
    </header>
  )
}

export default Index

const WorkshopAppScreenshot = () => {
  const {theme} = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="mx-auto aspect-[1060/617] h-full w-full max-w-3xl">
      {mounted ? (
        <Image
          src={
            theme === 'light'
              ? 'https://res.cloudinary.com/epic-web/image/upload/v1728627998/artem-workshop-app-video-poster-light.png'
              : 'https://res.cloudinary.com/epic-web/image/upload/v1728627998/artem-workshop-app-video-poster.png'
          }
          width={1060}
          height={617}
          quality={100}
          alt=""
          aria-hidden
          priority
        />
      ) : null}
    </div>
  )
}
