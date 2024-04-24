import React from 'react'
import Layout from 'components/app/layout'
import {GetStaticProps} from 'next'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'
import {Event, getAllEvents} from 'lib/events'
import {format} from 'date-fns'
import {
  CalendarIcon,
  LocationMarkerIcon,
  PlayIcon,
} from '@heroicons/react/outline'
import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'
import {cn} from '@skillrecordings/ui/utils/cn'
import Icon from 'components/icons'
import {IS_PAST_CONF_24} from 'pages/conf'
import {formatInTimeZone} from 'date-fns-tz'
import pluralize from 'pluralize'

export const getStaticProps: GetStaticProps = async (context) => {
  const events = await getAllEvents()

  return {
    props: {events},
    revalidate: 10,
  }
}

const Events: React.FC<{events: Event[]}> = ({events}) => {
  const title = 'Live Events'
  const pageDescription = 'Live Events and Workshops'
  const publishedEvents =
    process.env.NODE_ENV === 'development'
      ? events
      : events.filter(({state}) => state === 'published')
  const hasUpcomingEvents = publishedEvents.some((event) =>
    event.startsAt
      ? new Date(event.startsAt) > new Date()
      : event.events?.[0]?.startsAt
      ? new Date(event.events[0].startsAt) > new Date()
      : false,
  )
  const PT = 'America/Los_Angeles'

  return (
    <Layout
      meta={{
        title,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1706001310/card-events_2x.png',
          alt: title,
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 py-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          Epic Events
        </h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-indigo-200/60">
          <Balancer>{pageDescription}</Balancer>
        </h2>
      </header>
      <main className="mx-auto grid w-full max-w-3xl grid-cols-1 flex-col gap-5 px-5 pb-24">
        <ConfBanner />
        {!hasUpcomingEvents && (
          <>
            <div className="py-5 text-lg">
              There are no scheduled live events at the moment.
            </div>
            <h3 className="text-2xl font-bold">Past Events</h3>
          </>
        )}
        {publishedEvents.map((event) => {
          const {title, image, slug, description, startsAt, endsAt, state} =
            event
          const eventDate =
            startsAt &&
            `${formatInTimeZone(new Date(startsAt), PT, 'MMMM d, yyyy')}`
          const eventTime =
            startsAt &&
            endsAt &&
            `${formatInTimeZone(
              new Date(startsAt),
              PT,
              'h:mm a',
            )} — ${formatInTimeZone(new Date(endsAt), PT, 'h:mm a')}`

          const {data: availability} =
            trpc.products.getQuantityAvailableById.useQuery(
              {
                productId: event?.product?.productId as string,
              },
              {
                enabled: Boolean(event?.product?.productId),
              },
            )

          const isSoldOut = availability?.quantityAvailable === 0

          const isUpcoming = eventDate
            ? new Date(startsAt) > new Date()
            : event.events?.[0]?.startsAt
            ? new Date(event.events[0].startsAt) > new Date()
            : false

          const isPast = !isUpcoming && !isSoldOut

          return (
            <article key={slug}>
              <Link
                href={`/events/${slug}`}
                passHref
                onClick={() => {
                  track('clicked start reading article', {
                    article: slug,
                  })
                }}
                className="group relative flex h-full w-full flex-col overflow-hidden transition hover:bg-gray-100/80 dark:hover:bg-gray-900/40"
              >
                {state === 'draft' && (
                  <div className="absolute right-3 top-3 flex items-center justify-center rounded bg-rose-500/10 px-2 py-1 font-mono text-xs font-medium uppercase text-rose-500 dark:bg-rose-300/20 dark:text-rose-300">
                    draft
                  </div>
                )}
                <div className="flex h-full flex-col justify-between rounded-lg border border-gray-200 px-5 py-8 dark:border-gray-800 md:px-8">
                  {/* {image?.secure_url && (
                    <div>
                      <Image
                        src={image.secure_url}
                        alt={title}
                        width={200}
                        height={200}
                      />
                    </div>
                  )} */}
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {description && (
                      <p className="line-clamp-3 w-full pt-3 text-blue-900/80 dark:text-indigo-200/80 sm:text-lg">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="z-10 flex w-full flex-col items-start justify-between space-y-10 pt-8 md:flex-row md:items-center md:space-y-0">
                    <div className="flex w-full flex-col gap-8 text-sm text-gray-700 dark:text-gray-300 lg:flex-row lg:items-center">
                      {event.host ? (
                        <div className="flex items-center gap-3">
                          {event.host.picture && (
                            <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                              <Image
                                src={event.host.picture.url}
                                width={54}
                                height={54}
                                alt={event.host.name}
                              />
                            </div>
                          )}
                          <div>
                            <div className="block font-bold">Hosted by</div>
                            <div>{event.host.name}</div>
                          </div>
                        </div>
                      ) : null}
                      {eventDate && (
                        <div>
                          <div className="flex items-start gap-1">
                            <CalendarIcon className="w-4 translate-y-0.5 text-blue-900/80 dark:text-indigo-200/80" />
                            <div>
                              <strong>{eventDate}</strong>
                              <div>{eventTime} (PT)</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {event.events && (
                        <div>
                          <div className="flex items-start gap-1">
                            <CalendarIcon className="w-4 translate-y-0.5 text-blue-900/80 dark:text-indigo-200/80" />
                            <div>
                              <strong>
                                {formatInTimeZone(
                                  new Date(event.events[0].startsAt),
                                  PT,
                                  'MMMM d, yyyy',
                                )}
                                {' – '}
                                {formatInTimeZone(
                                  new Date(
                                    event.events[
                                      event.events.length - 1
                                    ].endsAt,
                                  ),
                                  PT,
                                  'MMMM d, yyyy',
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1 font-bold">
                        {isSoldOut ? (
                          'Sold out'
                        ) : isUpcoming ? (
                          <>
                            {availability?.quantityAvailable ? (
                              `${pluralize(
                                'spot',
                                availability.quantityAvailable,
                                true,
                              )} left`
                            ) : (
                              <Spinner className="w-3" />
                            )}
                          </>
                        ) : (
                          <div className="rounded bg-gray-100 px-3 py-1.5 dark:bg-gray-900">
                            Past Event
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </main>
    </Layout>
  )
}

export default Events

export const ConfBanner: React.FC<{className?: string; title?: string}> = ({
  className,
  title = 'Epic Web Conference 2024',
}) => {
  const {data, status} = trpc.conf.livestream.useQuery()
  const showLivestream = status === 'success' && data?.showLivestream
  if (IS_PAST_CONF_24) {
    return null
  }

  return (
    <section aria-label="Epic Web Conference 2024" className={cn(className)}>
      <Link
        href={'/conf'}
        onClick={() => {
          track('clicked epic web conference banner')
        }}
        className="group relative flex flex-col overflow-hidden rounded bg-gray-900 p-8 text-white transition hover:brightness-110"
      >
        <h3 className="relative z-10 max-w-lg text-xl font-bold sm:text-xl lg:text-2xl">
          {title}
        </h3>
        <p className="relative z-10 max-w-xs pt-2 text-indigo-200/80 sm:text-lg">
          The Full Stack Web Development Conference of Epic proportions
        </p>
        <hr className="relative z-0 mb-5 mt-5 max-w-[200px] border-[#202537] sm:max-w-lg lg:max-w-xl" />
        {showLivestream && (
          <div className="absolute right-5 top-3 z-10 flex items-center gap-2">
            <div className="h-3 w-3 animate-heartbeat rounded-full bg-red-500" />
            <div className="text-lg font-semibold">Live</div>
          </div>
        )}
        {data?.showLivestream ? (
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
            <div className="flex items-center gap-2 rounded bg-red-500 px-3 py-1.5">
              <Icon name="Playmark" className="w-3" />
              <div className="text-lg font-semibold">Watch livestream</div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
            <div className="flex items-start gap-1 text-sm">
              <CalendarIcon className="w-4 translate-y-0.5 text-indigo-200/80" />
              <div>
                <strong>April 11th, 2024</strong>
                <div>9am—5pm</div>
              </div>
            </div>
            <div className="flex items-start gap-1 text-sm">
              <LocationMarkerIcon className="w-4 translate-y-0.5 text-indigo-200/80" />
              <div>
                <strong>Park City, UT</strong>
                <div>Prospector Square Theatre</div>
              </div>
            </div>
            <div className="text-sm font-semibold">Tickets on sale!</div>
          </div>
        )}
        <Image
          src={require('../../../public/assets/conf/banner-bg@2x.png')}
          alt=""
          aria-hidden="true"
          width={302}
          height={302}
          quality={100}
          className="absolute -right-24 top-0 z-0 sm:right-0"
        />
        <Image
          src={require('../../../public/assets/conf/banner-ship@2x.png')}
          alt=""
          aria-hidden="true"
          width={515 / 2}
          height={330 / 2}
          quality={100}
          className="absolute -right-5 bottom-10 max-w-[10rem] transition duration-1000 group-hover:-translate-x-5 group-hover:-translate-y-2 sm:-bottom-5 sm:max-w-full"
        />
      </Link>
    </section>
  )
}
