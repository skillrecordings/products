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

export const getStaticProps: GetStaticProps = async (context) => {
  const events = await getAllEvents()

  return {
    props: {events},
    revalidate: 10,
  }
}

const Events: React.FC<{events: Event[]}> = ({events}) => {
  const title = 'Live Events'
  const pageDescription = 'Live Events and Workshops with Kent C. Dodds'
  const publishedEvents =
    process.env.NODE_ENV === 'development'
      ? events
      : events.filter(({state}) => state === 'active')

  return (
    <Layout
      meta={{
        title,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1683189692/epicweb.dev/events/card-events_2x.png',
          alt: title,
        },
      }}
    >
      <header className="mx-auto w-full max-w-3xl px-5 pb-3 pt-28 sm:pb-10 sm:pt-32">
        <h1 className="text-lg font-semibold">
         <span className="font-normal">Epic Web</span> {title}
        </h1>
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
                    <div className="flex w-full items-center gap-10 text-sm text-gray-700 dark:text-gray-300">
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
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-5 opacity-80" />
                        {eventDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-5 opacity-80" />
                        {eventTime} (Pacific time)
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
