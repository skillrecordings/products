import React from 'react'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import AuthorBio from 'components/contributor-bio'
import {trpc} from 'trpc/trpc.client'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import cx from 'classnames'
import {useScroll, useTransform} from 'framer-motion'
import {CheckCircleIcon, ChevronLeftIcon} from '@heroicons/react/solid'
import Link from 'next/link'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {ProductPageProps} from 'pages/products/[slug]'

const ProductTemplate: React.FC<ProductPageProps> = ({
  product,
  products,
  mdx,
  userId,
  couponFromCode,
  couponIdFromCoupon,
  availableBonuses,
}) => {
  const router = useRouter()

  const restrictedToProduct = couponFromCode?.restrictedToProductId
    ? products.find(
        (product) => product.productId === couponFromCode.restrictedToProductId,
      )
    : undefined

  const productMetadata = restrictedToProduct
    ? {
        ...restrictedToProduct,
        id: restrictedToProduct.productId,
        image: {
          ...restrictedToProduct.image,
          width: 132,
          height: 112,
        },
      }
    : undefined

  const {title, ogImage} = product

  const {validCoupon} = useCoupon(couponFromCode, productMetadata)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const {data: commerceProps} = trpc.pricing.propsForCommerce.useQuery({
    ...router.query,
    productId: product.productId,
  })

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const hasPurchased = purchasedProductIds.includes(product.productId)
  const cancelUrl = process.env.NEXT_PUBLIC_URL + router.asPath

  return (
    <Layout
      meta={{
        title,
        description: product.description,
        ...(ogImage && {
          ogImage: {
            url: ogImage,
            alt: title,
          },
        }),
      }}
    >
      <Header
        product={product as any}
        title={title}
        hasPurchased={hasPurchased}
      />
      <main id="buy">
        {mdx && (
          <article className="mx-auto w-full max-w-screen-md px-10 py-8 md:py-10">
            <Body mdx={mdx} />
          </article>
        )}
        <div className="mt-10 flex w-full items-center justify-center pb-16">
          <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
            <div data-pricing-container="">
              <Pricing
                bonuses={availableBonuses}
                allowPurchase={product.state === 'active'}
                userId={userId}
                product={product as unknown as SanityProduct}
                purchased={purchasedProductIds.includes(product.productId)}
                couponId={couponId}
                couponFromCode={couponFromCode}
                cancelUrl={cancelUrl}
              />
            </div>
          </PriceCheckProvider>
        </div>

        <Image
          className="mx-auto -mt-24 mb-16"
          src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
          width={130}
          height={130}
          alt="30-Day Money Back Guarantee"
        />
      </main>
      {/* <Share contentType="Live Workshop" title={title} /> */}
      {product.modules
        ?.reduce((instructors: any[], module: any) => {
          if (module.instructors) {
            module.instructors.forEach((instructor: any) => {
              if (!instructors.some((i) => i._id === instructor._id)) {
                instructors.push(instructor)
              }
            })
          }

          console.log({instructors, module})
          return instructors
        }, [])
        .map((instructor) => (
          <AuthorBio {...instructor} className="mt-0 pt-0" />
        ))}
    </Layout>
  )
}

type HeaderProps = {
  title?: string
  hasPurchased: boolean
  product: SanityProduct
}

const Header: React.FC<HeaderProps> = ({title, hasPurchased, product}) => {
  return (
    <header className="relative mx-auto w-full max-w-screen-lg px-2">
      <div className="relative flex w-full flex-col items-center justify-center pt-10 sm:pt-16">
        <Link
          className="inline-flex text-center text-sm text-indigo-300 hover:underline"
          href="/products"
        >
          <ChevronLeftIcon className="w-4" /> All products
        </Link>
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
                'pt-8': !hasPurchased,
                'pt-5': hasPurchased,
              },
            )}
          >
            <Balancer>{title}</Balancer>
          </h1>
        </div>
      </div>
      {/* <motion.div
        style={{
          transformOrigin: 'top center',
          transformPerspective: 300,
          rotateX: headerScrollRotation,
        }}
        className="-my-16 grid scale-75 cursor-default grid-cols-2 gap-2 pb-10 sm:my-0 sm:scale-100 md:grid-cols-4"
      >
        {product.modules.map(({title, image, moduleType}, i) => {
          return (
            <motion.div
              key={title}
              className={cx(
                'flex h-full w-full rounded-lg border border-gray-100 bg-white shadow-xl shadow-gray-500/10 transition hover:brightness-110 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/80',
                {
                  'col-span-1 flex-col sm:items-center md:col-span-2 md:flex-row':
                    true,
                },
              )}
            >
              <Link
                className="flex flex-col items-center gap-8 p-8 md:flex-row"
                href={`/${moduleType === 'bonus' ? 'bonuses' : 'workshops'}/${
                  product.slug
                }`}
              >
                {image && (
                  <Image
                    className="w-[140px] md:w-24 lg:w-auto"
                    src={image.url}
                    alt={title}
                    width={140}
                    height={140}
                    priority
                  />
                )}
                <div>
                  <h2 className="text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
                    {title}
                  </h2>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div> */}
    </header>
  )
}

export default ProductTemplate

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
