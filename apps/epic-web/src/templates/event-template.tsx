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
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {trpc} from 'trpc/trpc.client'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'

const EventTemplate: React.FC<
  {
    event: Event
    mdx: MDXRemoteSerializeResult
  } & CommerceProps
> = (props) => {
  const {event, mdx, products, ...commerceProps} = props
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
  } = event
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
  const author =
    event.author?.name ??
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
      title: products[0].title as string,
      description: products[0]?.description,
    },
  )
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  return (
    <Layout meta={{title, description: pageDescription, ogImage}}>
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
      <Header
        title={title}
        startsAt={startsAt}
        endsAt={endsAt}
        image={image}
        timezone={timezone}
      />
      <main className="mx-auto w-full max-w-3xl px-5 py-8 md:py-16">
        <Body mdx={mdx} />
        <div className="flex w-full items-center justify-center pb-16 pt-24 text-lg font-semibold">
          {/* @ts-ignore-next-line */}
          {/*<tito-widget event={`epic-web/${slug}`} />*/}
          {/*  show the buy widget for an associated product that gives access to the event */}
          {products
            ?.filter((product: any) => product.state !== 'unavailable')
            .map((product, i) => {
              const ALLOW_PURCHASE =
                router.query.allowPurchase === 'true' ||
                product.state === 'active'
              return (
                <PriceCheckProvider
                  key={product.slug}
                  purchasedProductIds={purchasedProductIds}
                >
                  <div data-pricing-container="" key={product.name}>
                    <Pricing
                      allowPurchase={ALLOW_PURCHASE}
                      userId={commerceProps.userId}
                      product={product}
                      purchased={purchasedProductIds.includes(
                        product.productId,
                      )}
                      index={i}
                      couponId={couponId}
                      couponFromCode={commerceProps.couponFromCode}
                    />
                  </div>
                </PriceCheckProvider>
              )
            })}
        </div>
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
        className=""
      />
    </Layout>
  )
}

export default EventTemplate

type HeaderProps = {
  title: string
  startsAt: string
  endsAt: string
  timezone: string | undefined | null
  image: string | undefined
}

const Header: React.FC<HeaderProps> = ({
  title,
  startsAt,
  endsAt,
  image,
  timezone,
}) => {
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
      <div className="flex w-full max-w-screen-lg flex-col justify-center gap-5 px-5 text-base text-gray-700 dark:text-gray-300 sm:flex-row sm:items-center sm:gap-10 sm:text-base md:gap-16 lg:px-0">
        <div className="flex flex-col items-center justify-center gap-3 text-center font-medium sm:gap-10 sm:text-left lg:flex-row">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />{' '}
            {eventDate}
          </div>
          <div className="flex items-center gap-2">
            <LocationMarkerIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />{' '}
            Zoom (online remote)
          </div>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />{' '}
              {eventTime} (Pacific time){' '}
            </div>
            {timezone && (
              <a
                href={timezone}
                rel="noopener noreferrer"
                target="_blank"
                className="font-normal underline"
              >
                Timezones ↗︎
              </a>
            )}
          </div>
        </div>
      </div>
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
