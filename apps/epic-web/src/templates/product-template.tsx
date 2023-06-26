import React from 'react'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import Share from 'components/share'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import AboutKent from 'components/about-kent'
import {Product} from 'lib/products'
import {trpc} from 'trpc/trpc.client'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import RemoveMarkdown from 'remove-markdown'

const ProductTemplate: React.FC<{
  product: Product
  mdx: MDXRemoteSerializeResult
}> = ({product, mdx}) => {
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
  const author = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`

  return (
    <Layout meta={{title, description: pageDescription}}>
      <Header title={title} image={image?.url} />
      <main data-event="">
        <article className="mx-auto w-full max-w-screen-md px-10 py-8 md:py-16">
          <Body mdx={mdx} />
        </article>
        <div className="mt-24 flex w-full items-center justify-center pb-16">
          <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
            {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
            <div data-pricing-container="">
              {commerceProps?.products.map((product, i) => {
                return (
                  <Pricing
                    key={product.title}
                    userId={commerceProps?.userId}
                    product={product}
                    purchased={purchasedProductIds.includes(product.productId)}
                    purchases={commerceProps?.purchases || []}
                    index={i}
                    couponId={couponId}
                    allowPurchase={true}
                    options={{
                      withGuaranteeBadge: false,
                      teamQuantityLimit: 10,
                    }}
                  />
                )
              })}
            </div>
          </PriceCheckProvider>
        </div>
      </main>
      {/* <Share contentType="Live Workshop" title={title} /> */}
      <AboutKent title="Hosted by Kent C. Dodds" className="mt-16" />
    </Layout>
  )
}

export default ProductTemplate

type HeaderProps = {
  title: string
  // startsAt: string
  // endsAt: string
  // timezone: string | undefined | null
  image?: string | undefined
}

const Header: React.FC<HeaderProps> = ({title, image}) => {
  return (
    <header className="relative mx-auto w-full max-w-screen-lg">
      <div className="relative flex w-full flex-col items-center justify-center pb-10 pt-10 sm:pb-16 sm:pt-24">
        <div className="flex flex-grow items-center justify-center">
          <h1 className="w-full max-w-screen-xl px-5 text-center font-semibold tracking-tight fluid-2xl sm:fluid-3xl">
            <Balancer>{title}</Balancer>
          </h1>
        </div>
      </div>
      {image && (
        <div className="relative aspect-video h-full w-full overflow-hidden sm:rounded-lg">
          <Image
            src={image}
            priority
            alt=""
            aria-hidden="true"
            quality={100}
            fill
          />
        </div>
      )}
      {/*<div className="flex w-full max-w-screen-lg flex-col justify-center gap-5 px-5 text-base text-gray-700 dark:text-gray-300 sm:flex-row sm:items-center sm:gap-10 sm:text-base md:gap-16 lg:px-0">*/}
      {/*  <div className="flex flex-col items-center justify-center gap-3 text-center font-medium sm:gap-10 sm:text-left lg:flex-row">*/}
      {/*    <div className="flex items-center gap-2">*/}
      {/*      <CalendarIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />{' '}*/}
      {/*      {eventDate}*/}
      {/*    </div>*/}
      {/*    <div className="flex items-center gap-2">*/}
      {/*      <LocationMarkerIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />{' '}*/}
      {/*      Zoom (online remote)*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col items-center gap-2 lg:flex-row">*/}
      {/*      <div className="flex items-center gap-2">*/}
      {/*        <ClockIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />{' '}*/}
      {/*        {eventTime} (Pacific time){' '}*/}
      {/*      </div>*/}
      {/*      {timezone && (*/}
      {/*        <a*/}
      {/*          href={timezone}*/}
      {/*          rel="noopener noreferrer"*/}
      {/*          target="_blank"*/}
      {/*          className="font-normal underline"*/}
      {/*        >*/}
      {/*          Timezones ↗︎*/}
      {/*        </a>*/}
      {/*      )}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </header>
  )
}

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
