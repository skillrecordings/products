import React from 'react'
import Layout from 'components/app/layout'
import {EventJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import Balancer from 'react-wrap-balancer'
import {format} from 'date-fns'
import Image from 'next/image'
import Share from 'components/share'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import AboutKent from 'components/about-kent'
import Script from 'next/script'
import {
  CalendarIcon,
  ClockIcon,
  LocationMarkerIcon,
} from '@heroicons/react/outline'
import {getOgImage} from 'utils/get-og-image'
import {Product} from 'lib/products'
import {trpc} from 'trpc/trpc.client'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'

const ProductTemplate: React.FC<{
  product: Product
  mdx: MDXRemoteSerializeResult
}> = ({product, mdx}) => {
  const router = useRouter()
  const {title, _updatedAt, _createdAt, slug} = product

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

  const image = ''

  const pageDescription = mdx
    ? `${mdx.compiledSource.substring(0, 157)}...`
    : undefined
  const author = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`

  return (
    <Layout meta={{title, description: pageDescription}}>
      <Header title={title} image={image} />
      <main
        data-event=""
        className="mx-auto w-full max-w-3xl px-5 py-8 md:py-16"
      >
        <Body mdx={mdx} />
        <div className="flex w-full items-center justify-center pt-10">
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
                  />
                )
              })}
            </div>
          </PriceCheckProvider>
        </div>
      </main>
      <Share contentType="Live Workshop" title={title} />
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

const Body: React.FC<{mdx: MDXRemoteSerializeResult}> = ({mdx}) => {
  return (
    <article className="invert-svg prose mx-auto w-full max-w-none dark:prose-invert md:prose-xl prose-code:break-words md:prose-code:break-normal">
      <MDX contents={mdx} />
    </article>
  )
}
