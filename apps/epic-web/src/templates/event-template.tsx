import React from 'react'
import Layout from 'components/app/layout'
import MuxPlayer from '@mux/mux-player-react'
import {EventJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import Balancer from 'react-wrap-balancer'
import {formatInTimeZone} from 'date-fns-tz'
import Image from 'next/image'
import Share from 'components/share'
import {Event} from 'lib/events'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import AuthorBio from 'components/contributor-bio'
import {
  CalendarIcon,
  ClockIcon,
  LocationMarkerIcon,
} from '@heroicons/react/outline'
import {getOgImage} from 'utils/get-og-image'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import Link from 'next/link'
import pluralize from 'pluralize'
import {Button} from '@skillrecordings/ui'

const EventTemplate: React.FC<
  {
    event: Event
    mdx: MDXRemoteSerializeResult
    quantityAvailable: number
    purchaseCount: number
    totalQuantity: number
  } & CommerceProps
> = (props) => {
  const {
    event,
    mdx,
    products,
    quantityAvailable,
    purchaseCount,
    totalQuantity,
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
    host,
  } = event
  const product = products && products[0]
  const image = event?.image?.secure_url
  const ogImage = _ogImage?.secure_url
    ? {url: _ogImage.secure_url, alt: title}
    : getOgImage({
        title: title,
        authorImage: event.host?.picture?.url,
        authorName: event.host?.name,
      })

  const pageDescription =
    description ||
    (mdx ? `${mdx.compiledSource.substring(0, 157)}...` : undefined)
  const hostName =
    host?.name ??
    `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchase = purchasedProductIds.length > 0

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps.couponFromCode,
    {
      id: product?.productId,
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: product?.title as string,
      description: product?.description,
    },
  )

  const isUpcoming = event.startsAt
    ? new Date(event.startsAt) > new Date()
    : event.events?.[0]?.startsAt
    ? new Date(event.events[0].startsAt) > new Date()
    : false

  const selfPacedWorkshop =
    event.resources &&
    event.resources.length > 0 &&
    event.resources.filter((r) => r.moduleType === 'workshop')?.[0]

  return (
    <Layout meta={{title, description: pageDescription, ogImage}}>
      {redeemableCoupon && <RedeemDialogForCoupon />}
      <EventJsonLd
        name={title}
        startDate={startsAt as string}
        endDate={endsAt as string}
        location={{name: 'Zoom'} as any}
        title={title}
        images={image ? [image] : []}
        authorName={hostName}
        datePublished={_createdAt}
        dateModified={_updatedAt}
        description={pageDescription}
        url={url}
      />
      <main
        data-event={slug}
        className="mx-auto flex w-full max-w-screen-lg flex-col gap-8 px-5 py-5 md:flex-row md:py-16"
      >
        {image && (
          <div className="relative flex h-full w-full items-center justify-center px-3 sm:hidden">
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
        <div className="w-full">
          <h1 className="w-full font-semibold tracking-tight fluid-3xl">
            <Balancer>{title}</Balancer>
          </h1>
          <h2 className="pt-4 text-xl text-gray-700 dark:text-sky-200 sm:text-2xl">
            Live {pluralize('Workshop', event.events?.length || 1)}{' '}
            <br className="block sm:hidden" />
            with{' '}
            <Link
              href={`/contributors/${host?.slug}`}
              target="_blank"
              className="hover:underline"
            >
              {host?.picture?.url && (
                <Image
                  src={host?.picture?.url}
                  alt={hostName}
                  width={48}
                  height={48}
                  className="ml-1 mr-2 inline-block rounded-full"
                />
              )}
              {hostName}
            </Link>
          </h2>
          {selfPacedWorkshop && (
            <div className="mt-5 flex flex-col items-start gap-5 border-t pt-8 md:hidden">
              <p className="text-balance text-center text-xl font-medium">
                Self-Paced Workshop Now Available!
              </p>
              <Button asChild className="font-semibold" size="lg">
                <Link href={`/workshops/${selfPacedWorkshop.slug}`}>
                  Start Learning
                </Link>
              </Button>
            </div>
          )}
          <hr className="my-10 flex h-px w-full bg-border" />
          <article className="invert-svg prose mx-auto w-full max-w-none dark:prose-invert md:prose-xl prose-code:break-words md:prose-code:break-normal">
            <MDX components={{Image, MuxPlayer}} contents={mdx} />
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
            {selfPacedWorkshop && (
              <div className="flex flex-col items-center gap-5 px-5">
                <p className="text-balance text-center text-lg font-semibold">
                  Self-Paced Workshop Now Available!
                </p>
                <Button asChild className="font-semibold" size="lg">
                  <Link href={`/workshops/${selfPacedWorkshop.slug}`}>
                    Start Learning
                  </Link>
                </Button>
              </div>
            )}
            {product && product.state !== 'unavailable' && isUpcoming && (
              <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
                <EventPricingWidget
                  commerceProps={{...commerceProps, products}}
                  product={product as SanityProduct}
                  quantityAvailable={quantityAvailable}
                />
              </PriceCheckProvider>
            )}
            <EventDetails event={event} />
          </div>
        </aside>
      </main>
      <Share contentType="Live Workshop" title={title} />
      <AuthorBio
        slug={event.host?.slug}
        name={event.host?.name}
        picture={
          event.host?.picture && {
            url: event.host.picture.url,
            alt: event.host.picture.alt || event.host.name,
          }
        }
        title={(name) => `Hosted by ${name}`}
        bio={event.host?.bio}
      />
    </Layout>
  )
}

export default EventTemplate

export const EventDetails: React.FC<{
  event: Event
}> = ({event}) => {
  const {startsAt, endsAt, timezone, events, image} = event
  const PT = 'America/Los_Angeles'
  const eventDate =
    startsAt && `${formatInTimeZone(new Date(startsAt), PT, 'MMMM d, yyyy')}`

  const eventTime =
    startsAt &&
    endsAt &&
    `${formatInTimeZone(new Date(startsAt), PT, 'h:mm a')} — ${formatInTimeZone(
      new Date(endsAt),
      PT,
      'h:mm a',
    )}`

  interface GroupedEvents {
    [title: string]: {
      dates: string[]
      time: string
    }
  }

  const groupedEvents: GroupedEvents =
    events &&
    events.reduce((acc: any, event) => {
      const {title, startsAt, endsAt} = event

      const formattedDate = `${formatInTimeZone(
        new Date(startsAt),
        PT,
        'MMMM d, yyyy',
      )}`

      const timeRange = `${formatInTimeZone(
        new Date(startsAt),
        PT,
        'ha',
      )}-${formatInTimeZone(new Date(endsAt), PT, 'ha')}`
      if (!acc[title]) {
        acc[title] = {dates: [formattedDate], time: timeRange}
      } else {
        acc[title].dates.push(formattedDate)
        // Assuming the time range is the same for all events with the same title
      }
      return acc
    }, {})

  return (
    <div className="mt-5 flex flex-col border-t pt-5">
      <h2 className="px-5 pb-4 text-xl font-semibold">
        {pluralize('Event', events?.length || 1)} Details
      </h2>

      {events && groupedEvents ? (
        <ul className="flex flex-col gap-4 px-5">
          <li className="flex items-center gap-1 font-semibold">
            <LocationMarkerIcon className="h-5 w-5 text-gray-600 dark:text-blue-300" />{' '}
            Location: Zoom (online remote)
          </li>
          {Object.entries(groupedEvents).map(([title, {dates, time}]) => {
            const uniqueDates = Array.from(dates) // Ensure dates are unique
            const formattedDates =
              uniqueDates.length > 1
                ? `${uniqueDates.slice(0, -1).join(', ')} & ${uniqueDates.slice(
                    -1,
                  )}`
                : uniqueDates[0]

            return (
              <li key={title}>
                <strong className="text-lg font-semibold leading-tight">
                  {title}
                </strong>
                <div className="mt-2 flex items-baseline gap-1 text-sm">
                  <CalendarIcon className="relative h-5 w-5 flex-shrink-0 translate-y-1.5 text-gray-600 dark:text-blue-300" />{' '}
                  <div>{formattedDates} (Pacific time)</div>
                </div>
                <div className="flex items-center gap-1 pt-1 text-sm">
                  <ClockIcon className="relative h-5 w-5 flex-shrink-0 text-gray-600 dark:text-blue-300" />{' '}
                  <div>{time} (Pacific time)</div>
                </div>
              </li>
            )
          })}
          {timezone && (
            <div className="flex items-center gap-1 pt-1 text-sm">
              <a
                href={timezone}
                rel="noopener noreferrer"
                target="_blank"
                className="font-normal underline"
              >
                timezones
              </a>
            </div>
          )}
        </ul>
      ) : (
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
      )}
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
      <Pricing
        cancelUrl={cancelUrl}
        allowPurchase={ALLOW_PURCHASE}
        userId={commerceProps?.userId}
        product={product}
        options={{
          withImage: false,
          withGuaranteeBadge: false,
          isLiveEvent: true,
          teamQuantityLimit:
            quantityAvailable && quantityAvailable > 5 ? 5 : quantityAvailable,
          isPPPEnabled: false,
        }}
        purchased={hasPurchased}
        couponId={couponId}
        couponFromCode={couponFromCode}
      />
    </div>
  )
}
