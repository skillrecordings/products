import React from 'react'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import AboutKent from 'components/about-kent'
import {trpc} from 'trpc/trpc.client'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import RemoveMarkdown from 'remove-markdown'
import cx from 'classnames'
import {motion, useScroll, useTransform} from 'framer-motion'
import {CheckCircleIcon} from '@heroicons/react/solid'
import Link from 'next/link'
import {GetServerSideProps} from 'next'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {getProduct, Product} from 'lib/products'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {prisma} from '@skillrecordings/database'

const workshops = [
  {
    title: 'Full Stack Foundations',
    date: 'Tuesday, July 18th & Thursday, July 20th',
    time: '9am-3pm (Mountain)',
    image:
      'https://res.cloudinary.com/epic-web/image/upload/v1688138013/workshop-image-full-stack-foundations_2x.png',
  },
  {
    title: 'Professional Web Forms',
    date: 'Tuesday, July 25th',
    time: '9am-3pm (Mountain)',
    image:
      'https://res.cloudinary.com/epic-web/image/upload/v1688457467/workshop-image-professional-web-forms_2x.png',
  },
  {
    title: 'Data Modeling Deep Dive',
    date: 'Thursday, July 27th',
    time: '9am-3pm (Mountain)',
    image:
      'https://res.cloudinary.com/epic-web/image/upload/v1688138010/workshop-image-data-modeling-deep-dive_2x.png',
  },
  {
    title: 'Authentication Strategies & Implementation',
    date: 'Tuesday, August 1st & Thursday, August 3rd',
    time: '9am-3pm (Mountain)',
    image:
      'https://res.cloudinary.com/epic-web/image/upload/v1688549362/workshop-image-authentication-strategies-and-implementation_2x.png',
  },
  {
    title: 'Web Application Testing',
    date: 'Tuesday, August 8th & Thursday, August 10th',
    time: '9am-3pm (Mountain)',
    image:
      'https://res.cloudinary.com/epic-web/image/upload/v1688457467/workshop-image-web-application-testing_2x.png',
  },
]

export const getServerSideProps: GetServerSideProps = async () => {
  const productId = 'kcd_product-f000186d-78c2-4b02-a763-85b2e5feec7b'
  const sanityProduct = await getProduct(productId)

  const purchaseCount = await prisma.purchase.count({
    where: {
      productId,
      status: {
        in: ['VALID', 'RESTRICTED'],
      },
    },
  })

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      quantityAvailable: true,
    },
  })

  const mdx = sanityProduct.body && (await serializeMDX(sanityProduct.body))
  return {
    props: {
      product: sanityProduct,
      mdx,
      purchaseCount,
      quantityAvailable: product?.quantityAvailable,
    },
  }
}

type ProductPageProps = {
  product: Product
  mdx: MDXRemoteSerializeResult
  purchaseCount?: number
  quantityAvailable?: number
}

const FullStackWorkshopSeries: React.FC<ProductPageProps> = ({
  product,
  mdx,
  purchaseCount,
  quantityAvailable,
}) => {
  const router = useRouter()
  const {title, image, body, _updatedAt, _createdAt, slug} = product

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      ...router.query,
      productId: product.productId,
    })

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
  )

  const {data: formattedPrice, status: formattedPriceStatus} =
    trpc.pricing.formatted.useQuery({
      productId: product.productId as string,
      quantity: 1,
    })

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  const pageDescription = body
    ? `${RemoveMarkdown(body).substring(0, 157)}...`
    : undefined

  const hasPurchased = purchasedProductIds.includes(product.productId)
  const cancelUrl = process.env.NEXT_PUBLIC_URL + router.asPath

  return (
    <Layout
      meta={{
        title,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1687853482/card-full-stack-workshop-series-vol-1_2x.png',
          alt: title,
        },
      }}
    >
      <Header title={title} hasPurchased={hasPurchased} />
      <main data-event="">
        <article className="mx-auto w-full max-w-screen-md px-10 py-8 md:py-10">
          {mdx && <Body mdx={mdx} />}
        </article>
        {redeemableCoupon ? <RedeemDialogForCoupon /> : null}

        {true ? (
          <div className="mt-10 flex w-full items-center justify-center pb-16">
            <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
              <div data-pricing-container="">
                {image && (
                  <Image
                    className="relative z-10"
                    src={image.url}
                    alt=""
                    aria-hidden="true"
                    width={100}
                    height={100}
                    priority
                  />
                )}
                {commerceProps?.products.map((product, i) => {
                  return (
                    <Pricing
                      cancelUrl={cancelUrl}
                      key={product.productId}
                      userId={commerceProps?.userId}
                      product={product}
                      purchased={purchasedProductIds.includes(
                        product.productId,
                      )}
                      index={i}
                      couponId={couponId}
                      options={{
                        withGuaranteeBadge: false,
                        // teamQuantityLimit:
                        // quantityAvailable && quantityAvailable > 5
                        //   ? 5
                        //   : quantityAvailable,
                      }}
                    />
                  )
                })}
              </div>
            </PriceCheckProvider>
          </div>
        ) : (
          <>
            <div className="mx-auto w-full max-w-screen-md px-20 py-8 md:py-10">
              <div className="col-span-2 flex  items-center justify-center rounded-lg border border-gray-100 bg-white p-5 text-center text-xl font-semibold shadow-xl shadow-gray-500/10 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/80 md:col-span-1">
                <Image
                  className="mr-4"
                  src="https://res.cloudinary.com/epic-web/image/upload/v1687853986/logo-full-stack-workshop-series.png"
                  alt={title}
                  width={70}
                  height={70}
                  priority
                />
                This Workshop Series is Sold Out
              </div>
            </div>
          </>
        )}
      </main>
      {/* <Share contentType="Live Workshop" title={title} /> */}
      <AboutKent title="Hosted by Kent C. Dodds" className="mt-16" />
    </Layout>
  )
}

type HeaderProps = {
  title: string
  hasPurchased: boolean
}

const Header: React.FC<HeaderProps> = ({title, hasPurchased}) => {
  const {scrollY} = useScroll()
  const headerScrollRotation = useTransform(
    scrollY,
    // Map y from these values:
    [0, 600],
    // Into these values:
    ['0deg', '-3deg'],
  )

  return (
    <header className="relative mx-auto w-full max-w-screen-lg px-2">
      <div className="relative flex w-full flex-col items-center justify-center pb-24 pt-10 sm:pb-24 sm:pt-16">
        <div className="flex flex-grow flex-col items-center justify-center">
          {hasPurchased && (
            <Link
              href="/purchases"
              className="flex items-center gap-1.5 rounded-md bg-teal-400/30 py-0.5 pl-1.5 pr-2 font-medium text-teal-600 transition hover:bg-teal-400/40 dark:bg-teal-400/20 dark:text-teal-300 dark:hover:bg-teal-400/30"
            >
              <CheckCircleIcon className="h-5 w-5 text-teal-500 dark:text-teal-400" />{' '}
              Purchased
            </Link>
          )}
          <h1
            className={cx(
              'w-full max-w-screen-xl px-5 text-center font-semibold tracking-tight fluid-2xl sm:fluid-3xl',
              {
                'pt-12': !hasPurchased,
                'pt-5': hasPurchased,
              },
            )}
          >
            <Balancer>{title}</Balancer>
          </h1>
        </div>
      </div>
      <motion.div
        style={{
          transformOrigin: 'top center',
          transformPerspective: 300,
          rotateX: headerScrollRotation,
        }}
        className="-my-16 grid scale-75 cursor-default grid-cols-2 gap-2 pb-10 sm:my-0 sm:scale-100 md:grid-cols-4"
      >
        <div className="col-span-2 flex h-full w-full items-center justify-center rounded-lg border border-gray-100 bg-white p-5 text-center shadow-xl shadow-gray-500/10 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/80 md:col-span-1">
          Join me for Eight Full-Day Workshops experienced over four weeks. 🔥
        </div>
        {workshops.map(({title, date, time, image}, i) => {
          return (
            <motion.div
              key={title}
              className={cx(
                'flex h-full w-full gap-8 rounded-lg border border-gray-100 bg-white p-8 shadow-xl shadow-gray-500/10 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/80',
                {
                  'col-span-2 flex-row items-center md:col-span-3': i === 0,
                  'col-span-1 flex-col sm:items-center md:col-span-2 md:flex-row':
                    i !== 0,
                },
              )}
            >
              {image && (
                <Image
                  className="w-[140px] md:w-24 lg:w-auto"
                  src={image}
                  alt={title}
                  width={140}
                  height={140}
                  priority
                />
              )}
              <div>
                <h2 className="text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
                  <Balancer>{title}</Balancer>
                </h2>
                <time
                  dateTime={`${date}, ${time}`}
                  className="flex flex-col space-y-1 pt-3 text-sm sm:text-base"
                >
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="flex-shrink-0"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 6H16"
                        stroke="#8F939F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.5 3H2.5C2.10218 3 1.72064 3.15804 1.43934 3.43934C1.15804 3.72064 1 4.10218 1 4.5V13.5C1 13.8978 1.15804 14.2794 1.43934 14.5607C1.72064 14.842 2.10218 15 2.5 15H14.5C14.8978 15 15.2794 14.842 15.5607 14.5607C15.842 14.2794 16 13.8978 16 13.5V4.5C16 4.10218 15.842 3.72064 15.5607 3.43934C15.2794 3.15804 14.8978 3 14.5 3Z"
                        stroke="#8F939F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 1V3"
                        stroke="#8F939F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 1V3"
                        stroke="#8F939F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-gray-800 dark:text-gray-300">
                      {date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="flex-shrink-0"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 16C12.6421 16 16 12.6421 16 8.5C16 4.35786 12.6421 1 8.5 1C4.35786 1 1 4.35786 1 8.5C1 12.6421 4.35786 16 8.5 16Z"
                        stroke="#8F939F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 3.5V8.5H13.5"
                        stroke="#8F939F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="text-gray-800 dark:text-gray-300">
                      {time}
                    </span>
                  </div>
                </time>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </header>
  )
}

export default FullStackWorkshopSeries

const mdxComponents = {
  PictureOfKent: ({children}: {children?: React.ReactElement}) => {
    return (
      <div className="flex flex-col items-center gap-10 py-16 md:flex-row md:items-start">
        <div className="flex flex-shrink-0 flex-col items-center">
          <Image
            width={150}
            height={150}
            placeholder="blur"
            priority
            className="!my-0 rounded-full bg-gray-100 dark:bg-gray-800"
            src={require('../../public/kent-c-dodds.png')}
            alt="Kent C. Dodds"
          />
          <span className="pt-3 font-bold">Kent C. Dodds</span>
        </div>
        <div className="prose w-full dark:prose-invert sm:text-lg">
          {children}
        </div>
      </div>
    )
  },
}

const Body: React.FC<{mdx: MDXRemoteSerializeResult}> = ({mdx}) => {
  return (
    <article className="invert-svg prose mx-auto w-full max-w-none dark:prose-invert md:prose-lg prose-code:break-words md:prose-code:break-normal">
      <MDX contents={mdx} components={mdxComponents} />
    </article>
  )
}

export const useWorkshopCta = () => {
  const router = useRouter()
  const expiresAt = new Date(1689624000000)
  const now = new Date()
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      ...router.query,
    })

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const hasPurchased = purchasedProductIds.includes(
    'kcd_product-f000186d-78c2-4b02-a763-85b2e5feec7b',
  )
  return !(now > expiresAt || hasPurchased)
}

export const WorkshopSeriesNavCta = () => {
  const isCtaActive = useWorkshopCta()
  if (!isCtaActive) return null

  return (
    <Link
      href="/full-stack-workshop-series-vol-1"
      className="flex w-full bg-primary px-3 py-1.5 text-white"
      onClick={() => {
        track('clicked workshop series cta', {
          location: 'nav',
        })
      }}
    >
      <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center space-x-2 px-0 text-xs font-medium sm:space-x-4 sm:px-3 sm:text-sm">
        <p className="w-full sm:w-auto">
          {/* <Balancer> */}
          <strong>Full Stack Workshop Series Vol 1.</strong> now scheduled!
          {/* </Balancer> */}
        </p>
        <div className="flex-shrink-0 underline">Grab your ticket</div>
      </div>
    </Link>
  )
}
