import React from 'react'
import Layout from 'components/app/layout'
import {EventJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import Balancer from 'react-wrap-balancer'
import {format} from 'date-fns'
import {formatInTimeZone} from 'date-fns-tz'
import Image from 'next/image'
import Share from 'components/share'
import {Event} from 'lib/events'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import AuthorBio from 'components/author-bio'
import {
  CalendarIcon,
  ClockIcon,
  LocationMarkerIcon,
} from '@heroicons/react/outline'
import {getOgImage} from 'utils/get-og-image'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {trpc} from 'trpc/trpc.client'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'

const EventTemplate: React.FC<
  {
    event: Event
    mdx: MDXRemoteSerializeResult
    quantityAvailable: number
    purchaseCount: number
  } & CommerceProps
> = (props) => {
  const {
    event,
    mdx,
    products,
    quantityAvailable,
    purchaseCount,
    ...commerceProps
  } = props

  const router = useRouter()
  const {
    title,
    description,
    _updatedAt,
    _createdAt,
    startsAt,
    endsAt,
    slug,
    timezone,
    ogImage: _ogImage,
    author,
  } = event
  const product = products[0]
  const image = event?.image?.secure_url
  const ogImage = _ogImage?.secure_url
    ? {url: _ogImage.secure_url, alt: title}
    : getOgImage({
        title: title,
        authorImage: event.author?.picture?.url,
        authorName: event.author?.name,
      })
  const pageDescription =
    description ||
    (mdx ? `${mdx.compiledSource.substring(0, 157)}...` : undefined)
  const authorName =
    author?.name ??
    `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchase = purchasedProductIds.length > 0

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps.couponFromCode,
    {
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: product.title as string,
      description: product?.description,
    },
  )

  const isSoldOut = purchaseCount === quantityAvailable
  return (
    <Layout meta={{title, description: pageDescription, ogImage}}>
      {redeemableCoupon && <RedeemDialogForCoupon />}
      <EventJsonLd
        name={title}
        startDate={startsAt}
        endDate={endsAt}
        location={{name: 'Zoom'} as any}
        title={title}
        images={image ? [image] : []}
        authorName={author}
        datePublished={_createdAt}
        dateModified={_updatedAt}
        description={pageDescription}
        url={url}
      />
      <main
        data-event={slug}
        className="mx-auto flex w-full max-w-screen-lg flex-col gap-12 px-5 py-10 md:flex-row md:py-16"
      >
        <div className="w-full">
          <h1 className="w-full font-semibold tracking-tight fluid-3xl">
            <Balancer>{title}</Balancer>
          </h1>
          <h2 className="pt-4 text-xl text-gray-700 dark:text-sky-200 sm:text-2xl">
            Live Workshop with{' '}
            <Link
              href={`/authors/${author?.slug}`}
              target="_blank"
              className="hover:underline"
            >
              {author?.picture?.url && (
                <Image
                  src={author?.picture?.url}
                  alt={authorName}
                  width={48}
                  height={48}
                  className="ml-1 mr-2 inline-block rounded-full"
                />
              )}
              {authorName}
            </Link>
          </h2>
          <hr className="my-10 flex h-px w-full bg-border" />
          <article className="invert-svg prose mx-auto w-full max-w-none dark:prose-invert md:prose-xl prose-code:break-words md:prose-code:break-normal">
            <MDX contents={mdx} />
          </article>
        </div>
        <aside className="relative mx-auto w-full max-w-xs">
          <div className="flex w-full flex-col items-center rounded-xl bg-white pb-5 shadow-soft-xl dark:bg-foreground/5">
            {image && (
              <div className="relative flex h-full w-full items-center justify-center px-3">
                <Image
                  src={image}
                  priority
                  alt=""
                  width={250}
                  height={250}
                  aria-hidden="true"
                  quality={100}
                />
              </div>
            )}
            {isSoldOut ? (
              <div className="-mb-5 flex w-[105%] items-center justify-center rounded-sm bg-foreground px-4 py-3 text-center text-lg font-semibold text-background">
                Sold Out
              </div>
            ) : (
              <>
                {product && product.state !== 'unavailable' && (
                  <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
                    <EventPricingWidget
                      commerceProps={{...commerceProps, products}}
                      product={product as SanityProduct}
                      quantityAvailable={quantityAvailable}
                    />
                  </PriceCheckProvider>
                )}
              </>
            )}
            <EventDetails event={event} />
          </div>
        </aside>
      </main>
      <Share contentType="Live Workshop" title={title} />
      <AuthorBio
        slug={event.author?.slug}
        name={event.author?.name}
        picture={
          event.author?.picture && {
            url: event.author.picture.url,
            alt: event.author.picture.alt || event.author.name,
          }
        }
        title={(name) => `Hosted by ${name}`}
        bio={event.author?.bio}
      />
    </Layout>
  )
}

export default EventTemplate

export const EventDetails: React.FC<{
  event: Event
}> = ({event}) => {
  const {startsAt, endsAt, timezone, image} = event
  const eventDate = `${formatInTimeZone(
    new Date(startsAt),
    'America/Los_Angeles',
    'MMMM d, yyyy',
  )}`
  const eventTime = `${formatInTimeZone(
    new Date(startsAt),
    'America/Los_Angeles',
    'h:mm a',
  )} — ${formatInTimeZone(new Date(endsAt), 'America/Los_Angeles', 'h:mm a')}`

  return (
    <div className="mt-5 flex flex-col border-t pt-5">
      <h2 className="px-5 pb-4 text-xl font-semibold">Event Details</h2>
      <div className="flex flex-col text-base font-semibold opacity-90">
        <div className="flex items-center gap-2 px-5 py-2">
          <CalendarIcon className="h-5 w-5 flex-shrink-0 text-gray-600 dark:text-blue-300" />{' '}
          {eventDate}
        </div>
        <div className="flex items-baseline gap-2 px-5 py-2">
          <ClockIcon className="relative h-5 w-5 flex-shrink-0 translate-y-1 text-gray-600 dark:text-blue-300" />{' '}
          <div>
            {eventTime} (Pacific time){' '}
            {timezone && (
              <a
                href={timezone}
                rel="noopener noreferrer"
                target="_blank"
                className="font-normal underline"
              >
                timezones
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-2">
          <LocationMarkerIcon className="h-5 w-5 text-gray-600 dark:text-blue-300" />{' '}
          Zoom (online remote)
        </div>
      </div>
    </div>
  )
}

const EventPricingWidget: React.FC<{
  product: SanityProduct
  quantityAvailable: number
  commerceProps: CommerceProps
}> = ({product, quantityAvailable, commerceProps}) => {
  const router = useRouter()
  const couponFromCode = commerceProps?.couponFromCode
  const {validCoupon} = useCoupon(commerceProps?.couponFromCode)
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? couponFromCode?.id : undefined)
  const purchases = commerceProps?.purchases || []
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || product.state === 'active'
  const cancelUrl = process.env.NEXT_PUBLIC_URL + router.asPath
  const hasPurchased = purchasedProductIds.includes(product.productId)
  return (
    <div data-pricing-container="" id="buy" key={product.name}>
      {!hasPurchased && (
        <div className="flex w-full items-center justify-center text-center">
          <strong className="font-semibold">
            {quantityAvailable <= 5
              ? `Only ${quantityAvailable}`
              : quantityAvailable}{' '}
            spots left.
          </strong>
        </div>
      )}
      <Pricing
        cancelUrl={cancelUrl}
        allowPurchase={ALLOW_PURCHASE}
        userId={commerceProps?.userId}
        product={product}
        options={{
          withImage: false,
          withGuaranteeBadge: true,
          teamQuantityLimit:
            quantityAvailable && quantityAvailable > 5 ? 5 : quantityAvailable,
        }}
        purchased={hasPurchased}
        couponId={couponId}
        couponFromCode={couponFromCode}
      />
    </div>
  )
}
