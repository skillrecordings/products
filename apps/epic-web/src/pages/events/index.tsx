import React from 'react'
import Layout from 'components/app/layout'
import {GetStaticProps} from 'next'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'
import {Event, getAllEvents} from 'lib/events'
import {format} from 'date-fns'
import {CalendarIcon, ClockIcon} from '@heroicons/react/outline'
import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'

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
        {publishedEvents.map((event) => {
          const {title, image, slug, description, startsAt, endsAt, state} =
            event
          const eventDate = `${format(new Date(startsAt), 'MMMM d, yyyy')}`
          const eventTime = `${format(new Date(startsAt), 'h:mm a')} — ${format(
            new Date(endsAt),
            'h:mm a',
          )}`

          const {data: availability} =
            trpc.products.getQuantityAvailableById.useQuery(
              {
                productId: event?.product?.productId as string,
              },
              {
                enabled: Boolean(event?.product?.productId),
              },
            )

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
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {description && (
                      <p className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="relative z-10 flex w-full flex-col items-start justify-between space-y-10 pt-8 md:flex-row md:items-center md:space-y-0">
                    <div className="flex w-full flex-col gap-8 text-sm text-gray-700 dark:text-gray-300 lg:flex-row lg:items-center">
                      {event.author ? (
                        <div className="flex items-center gap-3">
                          {event.author.picture && (
                            <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                              <Image
                                src={event.author.picture.url}
                                width={54}
                                height={54}
                                alt={event.author.name}
                              />
                            </div>
                          )}
                          <div>
                            <div className="block font-bold">Hosted by</div>
                            <div>{event.author.name}</div>
                          </div>
                        </div>
                      ) : null}
                      <div>
                        <div className="flex items-start gap-1">
                          <CalendarIcon className="w-5 opacity-80" />
                          <div>
                            <strong>{eventDate}</strong>
                            <div>{eventTime} (PST)</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        {availability?.quantityAvailable ?? (
                          <Spinner className="w-3" />
                        )}{' '}
                        sposts left
                        {/* <ClockIcon className="w-5 opacity-80" /> */}
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
