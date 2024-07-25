import React from 'react'
import Layout from 'components/app/layout'
import {CalendarFold, MountainSnow} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {cn} from '@skillrecordings/ui/utils/cn'

const TICKETS_URL = 'https://ti.to/epicweb/epicwebcamp24'

const EpicWebCampPage = () => {
  return (
    <Layout
      className="dark:bg-[#080E16] dark:text-[#DDD8DB]"
      meta={{
        title: 'Epic Web Camp 2024',
        description: 'Epic connections with Epic people in Epic mountains.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1721234903/epic-web-camp-24-card_2x.png',
        },
      }}
    >
      <main className="">
        <header className="relative z-0 mx-auto flex w-full max-w-screen-lg flex-col-reverse items-center justify-between px-0 pb-10 pt-0 sm:flex-row sm:px-3 sm:pt-16">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="mb-3 flex flex-col items-center text-center md:items-start md:text-left">
              <span className="text-3xl text-brand-green">Epic Web</span>
              <span className="text-5xl font-semibold">Camp 2024</span>
            </h1>
            <h2 className="mb-10 text-balance text-center text-xl sm:text-left">
              Epic connections with Epic people in Epic mountains.
            </h2>
            <ul className="mb-10 flex flex-col items-center gap-2 sm:items-start">
              <li className="inline-flex items-center gap-2">
                <CalendarFold className="text-brand-green dark:text-[#93D7A6]" />{' '}
                September 11th—12th 2024
              </li>
              <li className="inline-flex items-center gap-2">
                <MountainSnow className="text-brand-green dark:text-[#93D7A6]" />{' '}
                Aspen Grove, Utah
              </li>
            </ul>
            <BookNowButton />
          </div>
          <div className="relative mb-10 flex h-64 items-end justify-center overflow-hidden sm:mb-0 sm:h-auto sm:items-center">
            <div
              className='absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-background before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green dark:before:bg-[#080E16]'
              aria-hidden="true"
            />
            <div
              className='absolute h-full w-full before:absolute before:-bottom-2.5 before:-right-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-background before:content-[""] after:absolute after:-bottom-0.5 after:-right-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green dark:before:bg-[#080E16]'
              aria-hidden="true"
            />
            <Image
              width={662}
              height={441}
              placeholder="blur"
              src={require('../../../public/assets/camp/epic-web-camp-24.jpg')}
              quality={100}
              priority
              alt="Epic Web Camp 2024"
              className=""
            />
          </div>
        </header>
        <section
          aria-label="You are invited!"
          id="about"
          className="mx-auto flex w-full max-w-screen-lg items-center justify-center sm:px-3"
        >
          <div className="relative flex w-full items-center justify-center overflow-hidden bg-white px-6 py-16 dark:bg-[#141A22] sm:py-20">
            <div
              className='absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-background before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green dark:before:bg-[#080E16]'
              aria-hidden="true"
            />
            <div className="flex max-w-2xl flex-col">
              <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-brand-green">
                You are invited
              </h2>
              <div className="prose w-full max-w-none dark:prose-invert sm:prose-lg">
                <p>
                  Epic Web Camp 2024 is <strong>a two day</strong> intimate
                  learning and collaborative <strong>experience</strong> with
                  other skilled web developers{' '}
                  <strong>in the mountains of Utah</strong>. With plenty of time
                  to work in the fresh air and fun physical and mental
                  activities, you'll walk away refreshed and ready to tackle
                  bigger challenges with new friendships and professional
                  relationships.
                </p>
                <p>
                  With <strong>only 30 attendees total</strong> for this first
                  year, it promises to be an intimate experience where deep
                  technical conversations can happen.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          aria-label="Location"
          id="location"
          className="relative mx-auto flex w-full max-w-screen-lg flex-col items-start justify-between gap-8 px-5 py-10 sm:flex-row sm:px-3 sm:py-16"
        >
          <h2 className="top-20 text-3xl font-semibold text-brand-green sm:sticky">
            Location
          </h2>
          <div className="prose w-full max-w-xl dark:prose-invert sm:prose-lg">
            <div className="not-prose relative overflow-hidden">
              <div
                className='darl:before:bg-[#080E16] absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-background before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
                aria-hidden="true"
              />
              <div
                className='absolute h-full w-full before:absolute before:-bottom-2.5 before:-right-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-background before:content-[""] after:absolute after:-bottom-0.5 after:-right-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green dark:before:bg-[#080E16]'
                aria-hidden="true"
              />
              <Image
                src={require('../../../public/assets/camp/aspen-groove.jpg')}
                width={586}
                height={329}
                alt="Aspen Groove"
                className="rounded-none"
              />
            </div>
            <h3>
              Aspen Grove is a beautiful family camp and conference center in
              Provo Canyon, Utah.
            </h3>
            <p>
              When you’re at Aspen Grove, you’re surrounded by trees and other
              wildlife, giving you a new context in which to be inspired and
              have inspiring conversations.
            </p>
            <p>
              If you’re flying in from out of town, you’ll be able to join the
              exclusive Camp channel in Epic Web discord server where you can
              coordinate with other attendees to catch a ~50 minute Uber/Lyft
              from the Salt Lake City Airport to Aspen Grove.
            </p>
            <p>No smoking or alcohol is permitted on the premises.</p>
          </div>
        </section>
        <section
          aria-label="Sponsors"
          id="sponsors"
          className="mx-auto my-8 flex w-full max-w-screen-lg flex-col border-y px-5 py-16 sm:px-3 md:justify-between"
        >
          <h2 className="mb-8 text-center text-3xl font-semibold text-brand-green sm:text-left">
            Sponsors
          </h2>
          <div className="flex flex-col items-center justify-center gap-16">
            <div className="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-10">
              <span className="w-full text-center text-sm font-semibold uppercase tracking-wide sm:w-auto">
                Gold
              </span>
              {sponsors.gold.map(({name, url, logo}) => {
                return (
                  <a
                    className="flex items-center justify-center text-gray-600 transition hover:text-foreground dark:text-gray-300 dark:hover:text-foreground [&_svg]:object-contain"
                    key={url}
                    href={url}
                    rel="noopener"
                    target="_blank"
                  >
                    {logo}
                  </a>
                )
              })}
            </div>
            <div className="flex w-full max-w-screen-sm flex-wrap items-center justify-center gap-x-16 gap-y-10">
              <span className="w-full text-center text-sm font-semibold uppercase tracking-wide sm:w-auto">
                Silver
              </span>
              {sponsors.silver.map(({name, url, logo}) => {
                return (
                  <a
                    className="flex items-center justify-center text-gray-600 transition hover:text-foreground dark:text-gray-300 dark:hover:text-foreground [&_svg]:object-contain"
                    key={url}
                    href={url}
                    rel="noopener"
                    target="_blank"
                  >
                    {logo}
                  </a>
                )
              })}
            </div>
          </div>
        </section>
        <section
          aria-label="Activities"
          id="activities"
          className="relative mx-auto flex w-full max-w-screen-lg flex-col items-start justify-between gap-10 px-5 py-10 sm:flex-row sm:px-3 sm:py-16"
        >
          <h2 className="top-24 text-3xl font-semibold text-brand-green sm:sticky">
            Activities
          </h2>
          <div className="prose max-w-xl dark:prose-invert sm:prose-lg prose-a:text-foreground prose-a:underline dark:prose-a:text-foreground">
            <div className="not-prose relative overflow-hidden">
              <div
                className='absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
                aria-hidden="true"
              />
              {/* <div
                className='absolute h-full w-full before:absolute before:-bottom-2.5 before:-right-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-bottom-0.5 after:-right-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
                aria-hidden="true"
              /> */}
              <Image
                width={662}
                height={441}
                placeholder="blur"
                src={require('../../../public/assets/camp/activities.jpg')}
                alt="Epic Web Camp 2024"
                className=""
              />
            </div>
            <p>
              Aspen Grove has numerous activities like sports, hikes, and crafts
              you can participate in while we're up there. Some are facilitated
              by Aspen Grove staff (like a high adventure ropes course and
              outdoor laser tag) and others are as simple as grab a putter for
              mini-golf or a frisbee for some time on the field.
            </p>
            <p>
              There are also indoor activities like pool, ping-pong, and
              foosball which are a great way to connect and also take a break
              from whatever you’re working on.
            </p>
            <p>
              In addition, “activities” includes time to learn from one another
              with *informal talks you can sign up for and sharing of
              professional and personal experiences*.
            </p>
            <p>
              The professional relationships you build and connections you make
              through the course of these activities (both formal and informal)
              is the primary objective of Epic Web Camp.
            </p>
            <h3>UtahJS Conf</h3>
            <p>
              Another optional add-on is a discounted ticket to{' '}
              <a
                target="_blank"
                rel="noopener"
                href="https://utahjs.com/conference"
              >
                UtahJS Conf
              </a>{' '}
              on September 13th. With speakers both local and visiting, you can
              make the most of your trip to Utah by joining for a great regional
              conference experience in Salt Lake City.
            </p>
          </div>
        </section>
        <section
          aria-label="Schedule"
          id="schedule"
          className="mx-auto w-full max-w-screen-lg px-5 py-10 sm:px-3 sm:py-16"
        >
          <div className="flex w-full flex-col items-start justify-between gap-5 sm:flex-row">
            <h2 className="text-3xl font-semibold text-brand-green">
              Schedule
            </h2>
            <div className="prose w-full max-w-xl dark:prose-invert sm:prose-lg prose-a:text-foreground prose-a:underline dark:prose-a:text-foreground">
              <p>
                This is the tentative schedule to give you an idea of what to
                expect.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col divide-y divide-border border-t sm:mt-16">
            {schedule.map(({date, events}) => (
              <div
                key={date}
                className="relative flex grid-cols-12 flex-col items-start justify-between py-10 sm:grid sm:py-16"
              >
                <h3 className="col-span-5 mb-5 text-2xl font-semibold sm:mb-0">
                  {date}
                </h3>
                <ul className="col-span-7 flex w-full flex-col text-base sm:text-lg lg:text-xl">
                  {events.map(({time, activity}) => {
                    return (
                      <li
                        key={time}
                        className={cn(
                          'grid grid-cols-2 items-center gap-2 py-2',
                          {
                            'grid-cols-1 py-0': time === '',
                          },
                        )}
                      >
                        <span className="">{time}</span>
                        <span>{activity}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section
          aria-label="Accommodations and meals"
          id="accommodation"
          className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between gap-5 px-5 py-10 sm:flex-row sm:px-3 sm:py-16"
        >
          <div className="prose flex max-w-lg flex-col dark:prose-invert sm:prose-xl">
            <h2 className="not-prose mb-5 text-3xl font-semibold text-brand-green">
              Accommodations and meals
            </h2>
            <p className="text-balance">
              Accommodations and meals are included in the price of a ticket.
              Aspen Grove has comfortable lodging options with options for
              single or multi-bed rooms and a common area good for games, chats,
              and hacking late into the night.
            </p>
          </div>
          <div className="not-prose relative overflow-hidden">
            <div
              className='absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
              aria-hidden="true"
            />
            {/* <div
                className='absolute h-full w-full before:absolute before:-bottom-2.5 before:-right-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-bottom-0.5 after:-right-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
                aria-hidden="true"
              /> */}
            <Image
              width={548}
              height={352}
              placeholder="blur"
              src={require('../../../public/assets/camp/accommodations.jpg')}
              alt="Accommodations"
              className=""
            />
          </div>
        </section>
        <div className="flex w-full items-center justify-center bg-gradient-to-t from-gray-100 via-transparent to-transparent pb-16 dark:from-gray-900">
          <section
            aria-label="Book Epic Web Camp"
            id="book"
            className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-5 px-3 py-16 sm:py-24"
          >
            <h3 className="mb-5 flex flex-col items-center gap-2 text-center">
              <span className="text-2xl text-brand-green">
                Experience Epic Web Camp
              </span>
              <span className="text-4xl font-semibold text-black dark:text-white">
                Join the Adventure & Elevate Your Skills!
              </span>
            </h3>
            <BookNowButton>Reserve Your Spot</BookNowButton>
          </section>
        </div>
        <section
          aria-label="Code of Conduct"
          id="code-of-conduct"
          className="relative mx-auto flex w-full max-w-screen-lg items-center justify-center px-3 py-16 before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-border before:to-transparent"
        >
          <div />
          <Link
            href="/conf/code-of-conduct"
            className="text-sm transition hover:text-brand-green"
          >
            Code of Conduct
          </Link>
        </section>
      </main>
    </Layout>
  )
}

export default EpicWebCampPage

const schedule = [
  {
    date: 'September 11th',
    events: [
      {
        time: '10:00am',
        activity: 'Check-in',
      },
      {
        time: '10:00am-12:00pm',
        activity: 'Activities',
      },
      {
        time: '12:00pm',
        activity: 'Lunch',
      },
      {
        time: '1:00pm-4:00pm',
        activity: 'Activities',
      },
      {
        time: '5:00pm',
        activity: 'Dinner',
      },
      {
        time: '6:00pm-8:00pm',
        activity: 'Activities',
      },
      {
        time: '8:00pm-whenever',
        activity: 'Hang out and chat until bedtime',
      },
    ],
  },
  {
    date: 'September 12th',
    events: [
      {
        time: '8:00am',
        activity: 'Breakfast',
      },
      {
        time: '9:00am-12:00pm',
        activity: 'Activities',
      },
      {
        time: '12:00pm',
        activity: 'Lunch',
      },
      {
        time: '12:00pm-4:00pm',
        activity: 'Activities',
      },
      {
        time: '4:00pm',
        activity: 'Checkout',
      },
    ],
  },
  {
    date: 'September 13th',
    events: [
      {
        time: '',
        activity: (
          <>
            Optionally attend{' '}
            <a
              href="https://utahjs.com/conference/"
              target="_blank"
              rel="noopener"
              className="text-brand-green underline"
            >
              UtahJS Conference
            </a>{' '}
            (add-on)
          </>
        ),
      },
    ],
  },
]

const BookNowButton: React.FC<React.PropsWithChildren> = ({
  children = 'Book Now',
}) => {
  return (
    <Link
      href={TICKETS_URL}
      className="relative inline-flex items-center justify-center rounded bg-brand-green px-10 py-3 pr-12 font-semibold text-white dark:text-black"
    >
      {children}
      <svg
        aria-hidden="true"
        className="absolute -right-px top-0 text-background dark:text-[#080E16]"
        width="37"
        height="52"
        viewBox="0 0 37 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.44 0L21.49 14.95H29.18L13.98 30.14H21.23L0 51.37H36.44V0Z"
          fill="currentColor"
        />
      </svg>
    </Link>
  )
}

const sponsors = {
  gold: [
    {
      name: 'Fly.io',
      url: 'https://fly.io',
      logo: (
        <svg
          className="w-full max-w-[200px]"
          viewBox="0 0 300 89"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Fly.io</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M66.522 11.742H77.476C87.219 11.742 95.129 19.652 95.129 29.395V67.912C95.129 77.655 87.219 85.565 77.476 85.565H76.613C71.598 84.781 69.423 83.277 67.743 82.006L53.816 70.555C53.4665 70.274 53.0315 70.1209 52.583 70.1209C52.1345 70.1209 51.6995 70.274 51.35 70.555L46.826 74.276L34.083 63.798C33.7343 63.5161 33.2994 63.3624 32.851 63.3624C32.4026 63.3624 31.9677 63.5161 31.619 63.798L13.915 79.371C10.353 82.269 7.996 81.734 6.468 81.566C2.52 78.326 0 73.411 0 67.912V29.395C0 19.652 7.91 11.742 17.654 11.742H28.584L28.564 11.786L28.196 12.86L28.081 13.228L27.585 15.429L27.517 15.814L27.299 18.018L27.27 18.623L27.265 18.835L27.286 19.845L27.336 20.438L27.459 21.364L27.615 22.199L27.801 22.967L28.042 23.799L28.667 25.56L28.874 26.088L29.963 28.389L30.347 29.096L31.607 31.258L32.089 32.038L33.847 34.626L34.1 34.969L36.388 37.946L37.127 38.862L39.738 41.915L40.275 42.503L42.428 44.819L43.28 45.702L44.689 47.102L44.407 47.338L44.23 47.497C43.752 47.943 43.298 48.417 42.873 48.915C42.668 49.156 42.473 49.405 42.289 49.661C42.0073 50.0528 41.7549 50.4649 41.534 50.894C41.4217 51.117 41.3209 51.3457 41.232 51.579C41.0029 52.1749 40.8651 52.802 40.823 53.439L40.815 53.99C40.835 54.766 40.993 55.532 41.282 56.253C41.574 56.983 42.001 57.652 42.54 58.226C42.932 58.643 43.378 59.007 43.867 59.306C44.2835 59.5611 44.7264 59.7703 45.188 59.93C46.1903 60.27 47.2539 60.3911 48.307 60.285H48.312C49.2107 60.1977 50.0843 59.9383 50.885 59.521C51.23 59.338 51.559 59.126 51.867 58.885C52.7499 58.1985 53.4338 57.2889 53.848 56.25C54.173 55.44 54.332 54.575 54.318 53.704L54.292 53.248C54.2331 52.6466 54.0897 52.0564 53.866 51.495C53.7689 51.2506 53.6587 51.0116 53.536 50.779C53.3077 50.3507 53.048 49.9399 52.759 49.55C52.6271 49.3713 52.4904 49.1963 52.349 49.025C51.8791 48.4636 51.373 47.9335 50.834 47.438L50.452 47.113L51.098 46.476L53.872 43.579L54.831 42.526L56.322 40.848L57.292 39.714L58.675 38.029L59.612 36.852L60.987 35.013L61.681 34.062L62.666 32.589L63.486 31.335L65.032 28.643L65.916 26.877L65.941 26.823L66.618 25.185C66.627 25.1638 66.6347 25.1421 66.641 25.12L67.37 22.846L67.446 22.515L67.763 20.705L67.824 20.215L67.843 19.915L67.865 18.782L67.859 18.571L67.801 17.556L67.729 16.768L67.37 14.496C67.364 14.466 67.358 14.436 67.349 14.406L66.888 12.726L66.729 12.259L66.522 11.742ZM71.729 59.774C70.6259 59.7943 69.5737 60.2415 68.7936 61.0216C68.0135 61.8017 67.5663 62.8539 67.546 63.957C67.579 66.238 69.447 68.105 71.729 68.138C74.01 68.105 75.878 66.238 75.913 63.957C75.8925 62.8539 75.445 61.8016 74.6648 61.0215C73.8845 60.2414 72.8322 59.7943 71.729 59.774Z"
            fill="currentColor"
            fillOpacity="0.35"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M63.4939 85.565H41.9839C40.8819 85.565 40.7279 84.521 41.4369 83.927C51.9359 75.132 51.9109 75.103 51.9109 75.103C52.1187 74.9288 52.3812 74.8331 52.6524 74.8325C52.9235 74.832 53.1863 74.9266 53.3949 75.1C53.3949 75.1 63.2619 83.274 64.0409 83.927C64.7499 84.521 64.5969 85.565 63.4939 85.565ZM47.6249 50.485L47.7369 50.517C47.7719 50.535 47.8029 50.56 47.8349 50.582L47.9279 50.664C48.1569 50.875 48.3799 51.097 48.5939 51.324C48.7449 51.485 48.8919 51.651 49.0329 51.822C49.2129 52.039 49.3809 52.266 49.5339 52.502C49.5999 52.606 49.6609 52.712 49.7189 52.822C49.7689 52.917 49.8139 53.015 49.8529 53.115C49.9229 53.289 49.9749 53.472 49.9909 53.658L49.9879 54.008C49.9647 54.3239 49.8668 54.6297 49.7021 54.9002C49.5375 55.1708 49.3108 55.3983 49.0409 55.564C48.6909 55.776 48.2969 55.906 47.8899 55.943L47.4569 55.956L47.0919 55.924C46.9215 55.8988 46.7538 55.858 46.5909 55.802C46.425 55.7454 46.2657 55.671 46.1159 55.58L45.8309 55.371C45.495 55.0844 45.2662 54.6924 45.1819 54.259C45.1676 54.1858 45.1562 54.1121 45.1479 54.038L45.1379 53.705C45.1434 53.6144 45.1564 53.5244 45.1769 53.436C45.2269 53.241 45.2989 53.052 45.3889 52.873C45.5059 52.648 45.6389 52.431 45.7879 52.225C46.0349 51.892 46.3019 51.574 46.5879 51.274C46.7729 51.079 46.9609 50.89 47.1579 50.709L47.2989 50.582C47.3959 50.517 47.3969 50.517 47.5079 50.485H47.6249ZM46.9079 3.96298L46.9529 3.95898V42.97L46.8559 42.79C45.572 40.4144 44.3765 37.9921 43.2719 35.528C42.3761 33.5333 41.5648 31.5019 40.8399 29.439C40.2609 27.7958 39.7719 26.1223 39.3749 24.426C39.0659 23.078 38.8299 21.711 38.7329 20.33C38.6951 19.7405 38.6837 19.1495 38.6989 18.559C38.7079 18.045 38.7289 17.532 38.7619 17.018C38.8129 16.211 38.8949 15.405 39.0129 14.606C39.1069 13.977 39.2229 13.35 39.3659 12.73C39.4799 12.238 39.6119 11.749 39.7629 11.268C39.9809 10.573 40.2409 9.89398 40.5449 9.23098C40.6559 8.99198 40.7749 8.75498 40.9009 8.52198C41.6539 7.12698 42.6759 5.84198 44.0139 4.98198C44.8836 4.41656 45.8758 4.06719 46.9079 3.96298ZM51.9669 4.06098L54.5909 4.80998C55.8118 5.25501 56.9741 5.84703 58.0519 6.57298C59.5177 7.56194 60.781 8.82187 61.7739 10.285C62.356 11.1549 62.8393 12.087 63.2149 13.064C63.761 14.5085 64.0987 16.0233 64.2179 17.563C64.2529 17.966 64.2729 18.37 64.2809 18.775C64.2899 19.15 64.2879 19.527 64.2579 19.902C64.1829 20.7422 64.0248 21.573 63.7859 22.382C63.5939 23.0439 63.3669 23.6951 63.1059 24.333C62.7818 25.1264 62.4214 25.9046 62.0259 26.665C61.1509 28.355 60.1449 29.971 59.0669 31.534C57.7311 33.4547 56.3072 35.3127 54.7999 37.102C53.1624 39.0543 51.455 40.9469 49.6809 42.776C50.8851 40.5186 52.0088 38.2191 53.0499 35.882C53.6287 34.5802 54.1749 33.2641 54.6879 31.935C55.2527 30.4752 55.7618 28.9945 56.2139 27.496C56.552 26.3735 56.8449 25.2379 57.0919 24.092C57.3009 23.108 57.4659 22.114 57.5679 21.114C57.6529 20.28 57.6849 19.441 57.6639 18.605C57.6559 18.0926 57.6369 17.5805 57.6069 17.069C57.4839 15.012 57.1709 12.961 56.5709 10.988C56.3441 10.2395 56.0678 9.50686 55.7439 8.79498C54.9759 7.12198 53.9039 5.55798 52.4529 4.41698L51.9669 4.06098ZM207.646 74.498L195.189 47.832C194.149 45.61 193.529 44.798 192.488 43.856L191.476 42.943C190.668 42.16 190.138 41.435 190.138 40.574C190.138 39.341 191.114 38.303 192.893 38.303H203.708C205.405 38.303 206.463 39.186 206.463 40.504C206.463 41.24 206.125 41.792 205.697 42.333C205.19 42.976 204.529 43.602 204.529 44.745C204.529 45.461 204.738 46.175 205.14 47.087L212.574 64.495L219.242 47.525C219.652 46.396 219.932 45.402 219.932 44.606C219.932 43.367 219.259 42.862 218.74 42.308C218.288 41.827 217.927 41.319 217.927 40.504C217.927 39.173 219.01 38.303 220.468 38.303H227.128C228.995 38.303 229.883 39.269 229.883 40.504C229.883 41.294 229.428 42.027 228.532 42.817L227.59 43.591C226.278 44.663 225.671 46.213 224.982 47.817L214.883 72.146C213.69 74.99 211.913 78.939 209.2 82.179C206.443 85.469 202.726 88.028 197.692 88.028C193.477 88.028 190.925 86.015 190.925 83.115C190.925 80.458 192.89 78.341 195.472 78.341C196.886 78.341 197.621 79.009 198.367 79.696C198.984 80.262 199.61 80.844 200.844 80.844C201.988 80.844 203.054 80.36 204.021 79.578C205.497 78.384 206.733 76.505 207.646 74.498ZM280.844 74.403C286.451 74.403 291.045 72.482 294.628 68.648C298.209 64.82 300 60.212 300 54.824C300 49.565 298.298 45.244 294.907 41.858C291.516 38.473 287.117 36.773 281.703 36.773C276.002 36.773 271.34 38.624 267.709 42.312C264.077 46.003 262.26 50.474 262.26 55.727C262.26 60.932 263.994 65.345 267.455 68.964C270.919 72.586 275.38 74.403 280.844 74.403ZM233.431 73.986C236.673 73.986 238.978 71.803 238.978 68.656C238.978 65.583 236.597 63.396 233.431 63.396C230.113 63.396 227.739 65.587 227.739 68.656C227.739 71.8 230.115 73.986 233.431 73.986ZM244.975 68.998L245.765 68.164C246.703 67.252 247.005 66.331 247.005 63.791V48.776C247.005 46.58 246.707 45.6 245.775 44.761L244.847 43.929C243.937 43.126 243.638 42.627 243.638 41.825C243.638 40.685 244.522 39.75 245.944 39.426L252.247 37.896C252.85 37.75 253.53 37.608 254.057 37.608C254.782 37.608 255.376 37.846 255.792 38.26C256.209 38.675 256.454 39.271 256.454 40.018V63.791C256.454 66.188 256.745 67.303 257.746 68.145C257.762 68.159 257.777 68.174 257.791 68.19L258.496 69.011C259.381 69.872 259.748 70.443 259.748 71.228C259.748 72.629 258.692 73.43 256.994 73.43H246.322C244.704 73.43 243.638 72.634 243.638 71.228C243.638 70.439 244.006 69.863 244.975 68.998ZM173.641 68.999L174.43 68.164C175.369 67.252 175.671 66.331 175.671 63.791V32.441C175.671 30.315 175.446 29.271 174.451 28.433L173.498 27.511C172.677 26.713 172.377 26.218 172.377 25.42C172.377 24.278 173.265 23.347 174.609 23.021L180.84 21.492C181.444 21.346 182.123 21.203 182.651 21.203C183.371 21.203 183.98 21.42 184.415 21.831C184.851 22.244 185.119 22.857 185.119 23.683V63.791C185.119 66.194 185.418 67.245 186.423 68.154L187.227 69.005C188.118 69.872 188.415 70.439 188.415 71.228C188.415 71.81 188.237 72.279 187.921 72.637C187.475 73.141 186.728 73.43 185.731 73.43H175.06C174.064 73.43 173.316 73.141 172.869 72.637C172.554 72.279 172.377 71.81 172.377 71.228C172.377 70.438 172.67 69.866 173.641 68.999ZM144.583 52.854V63.652C144.583 65.279 144.905 66.781 146.245 68.018L147.112 68.859C148.083 69.801 148.378 70.365 148.378 71.228C148.378 72.547 147.321 73.43 145.623 73.43H133.591C131.893 73.43 130.836 72.547 130.836 71.228C130.836 70.204 131.137 69.719 132.107 68.854L132.971 68.015C133.976 67.105 134.632 65.864 134.632 63.652V34.805C134.632 33.047 134.243 31.609 132.97 30.438L132.102 29.597C131.21 28.731 130.836 28.162 130.836 27.297C130.836 25.899 131.897 25.026 133.591 25.026H165.821C167.052 25.026 168.135 25.3 168.826 25.978C169.307 26.45 169.614 27.115 169.649 28.038L170.151 35.478C170.201 36.408 169.926 37.184 169.39 37.662C169.02 37.991 168.523 38.188 167.897 38.188C167.108 38.188 166.503 37.89 165.963 37.376C165.478 36.914 165.046 36.265 164.558 35.501C163.381 33.62 162.833 32.943 161.578 32.063C159.832 30.775 157.171 30.332 152.141 30.332C149.238 30.332 147.406 30.459 146.252 30.756C145.506 30.949 145.075 31.199 144.845 31.566C144.608 31.942 144.583 32.417 144.583 32.997V47.617H152.141C153.949 47.617 155.221 47.29 156.695 45.276L156.703 45.264C157.294 44.512 157.722 43.958 158.129 43.591C158.602 43.162 159.058 42.959 159.661 42.959C160.241 42.9668 160.794 43.2021 161.202 43.6142C161.611 44.0262 161.841 44.582 161.843 45.162V55.241C161.843 56.591 160.791 57.512 159.661 57.512C159.099 57.512 158.643 57.312 158.168 56.892C157.759 56.533 157.33 55.994 156.774 55.275C155.161 53.187 154.022 52.854 152.141 52.854H144.583ZM272.283 52.599C272.283 48.983 273.071 46.384 274.703 44.821C276.316 43.278 278.049 42.497 279.912 42.497C282.475 42.497 284.785 43.932 286.868 46.752C288.996 49.636 290.049 53.533 290.049 58.438C290.049 62.058 289.259 64.681 287.624 66.289C286.013 67.875 284.281 68.679 282.419 68.679C279.856 68.679 277.548 67.233 275.464 64.391C273.335 61.483 272.283 57.55 272.283 52.599ZM251.193 33.044C254.442 33.044 256.74 31.215 256.74 28.061C256.74 24.982 254.444 23.149 251.193 23.149C247.866 23.149 245.572 24.983 245.572 28.061C245.572 31.139 247.867 33.044 251.193 33.044Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ],
  silver: [
    {
      name: 'Turso',
      url: 'https://turso.tech',
      logo: (
        <svg
          className="w-full max-w-[180px]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 740 170"
        >
          <title>Turso.tech</title>
          <path
            fill="currentColor"
            d="M171.055 0v30.78l-14.54 3.75-9.11-10.97-4.81 9.46c-9.92-2.7-23.58-4.44-42.37-4.44s-32.45 1.75-42.37 4.44l-4.81-9.46-9.11 10.97-14.54-3.75V0S4.905 20.67.235 48.61l32.14 11.12c1.05 19.43 9.79 71.88 12.29 76.64 2.66 5.07 16.78 19.56 27.83 25.13 0 0 4-4.23 6.44-7.96 3.1 3.65 19.11 16.45 21.3 16.45 2.19 0 18.2-12.8 21.3-16.45 2.44 3.73 6.44 7.96 6.44 7.96 11.05-5.57 25.17-20.06 27.83-25.13 2.5-4.76 11.24-57.21 12.29-76.64l32.14-11.12C195.545 20.67 171.055 0 171.055 0Zm-17.04 93.36-21.75 1.94 1.91 26.67s-13.23 10.95-33.96 10.95-33.96-10.95-33.96-10.95l1.91-26.67-21.75-1.94-3.72-30.04 36.05 12.48-2.8 37.39c6.7 1.7 13.75 3.39 24.28 3.39 10.53 0 17.57-1.69 24.27-3.39l-2.8-37.39 36.05-12.48-3.72 30.04h-.01Zm85.5-43.94 31.07 3.82v89.59h27.96V53.24l30.9-3.82V27.17h-89.93v22.25Zm166.28 47.11c0 13.04-6.36 22.23-19.59 22.23s-19.93-9.02-19.93-22.06V27.17h-27.96V96.7c0 28.91 14.9 48.3 47.56 48.3 32.66 0 47.89-20.56 47.89-48.47V27.17h-27.96v69.36h-.01Zm118.05-34.93c0-21.89-12.23-34.43-36.5-34.43h-39.85v115.65h27.8V95.35h7.54l22.77 47.47h29.97l-26.46-52.81c9.38-5.68 14.74-15.54 14.74-28.41h-.01Zm-38.85 11.03h-9.71V51.24h9.71c6.19 0 10.04 4.18 10.04 10.53s-3.68 10.86-10.04 10.86Zm102.98 1.84-14.57-5.68c-7.87-3.01-10.55-6.35-10.55-11.2s3.18-8.69 9.55-8.69c6.37 0 10.21 5.01 10.05 12.2h25.78c1.18-20.56-8.7-36.1-36-36.1-22.6 0-37.34 14.04-37.34 34.26 0 14.04 6.19 25.4 17.92 31.42 6.36 3.18 12.22 5.35 18.08 7.69 7.53 2.84 12.22 6.02 12.22 12.53s-4.69 10.2-11.05 10.2c-9.21 0-12.06-7.19-11.72-14.54h-26.46c-1 16.88 5.02 38.44 38.18 38.44 23.27 0 39.85-13.7 39.85-37.1 0-17.21-8.88-27.24-23.95-33.43h.01ZM678.065 25c-35.66 0-60.11 26.57-60.11 60.17s23.11 59.83 60.95 59.83 60.62-26.57 60.62-60.33S715.915 25 678.065 25Zm.67 93.93c-19.26 0-31.48-14.87-31.48-33.93 0-19.06 10.89-33.93 31.31-33.93 20.42 0 31.65 15.04 31.65 33.93s-11.05 33.93-31.48 33.93Z"
          />
        </svg>
      ),
    },
    {
      name: 'Convex',
      url: 'https://www.convex.dev',
      logo: (
        <svg
          className="w-full max-w-[180px]"
          viewBox="0 0 281 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Convex.dev</title>
          <path
            d="M63.7939 39.6648C60.4539 36.6785 58.7839 32.2644 58.7839 26.434C58.7839 20.6036 60.4869 16.1896 63.8959 13.2033C67.3009 10.217 71.9589 8.72101 77.8649 8.72101C80.3189 8.72101 82.4859 8.89731 84.3719 9.26131C86.2579 9.61971 88.0629 10.2283 89.7859 11.0929V20.5524C87.1059 19.2157 84.0639 18.5445 80.6589 18.5445C77.6599 18.5445 75.4449 19.1417 74.0179 20.3363C72.5859 21.5308 71.8729 23.5615 71.8729 26.434C71.8729 29.2099 72.5749 31.2178 73.9859 32.4578C75.3909 33.7035 77.6169 34.3236 80.6649 34.3236C83.8909 34.3236 86.9549 33.5329 89.8619 31.9573V41.8547C86.6359 43.3849 82.6149 44.1471 77.8009 44.1471C71.7969 44.1471 67.1329 42.6511 63.7939 39.6648Z"
            fill="currentColor"
          />
          <path
            d="M92.77 26.4279C92.77 20.643 94.337 16.246 97.471 13.2312C100.605 10.2165 105.328 8.71478 111.645 8.71478C118.006 8.71478 122.761 10.2222 125.922 13.2312C129.078 16.2403 130.656 20.643 130.656 26.4279C130.656 38.2366 124.318 44.1409 111.645 44.1409C99.06 44.1466 92.77 38.2423 92.77 26.4279ZM116.179 32.4574C117.109 31.2116 117.574 29.2037 117.574 26.4335C117.574 23.7089 117.109 21.7123 116.179 20.4439C115.25 19.1754 113.737 18.544 111.645 18.544C109.603 18.544 108.122 19.1811 107.214 20.4439C106.306 21.7123 105.853 23.7089 105.853 26.4335C105.853 29.2094 106.306 31.2173 107.214 32.4574C108.122 33.7031 109.597 34.3231 111.645 34.3231C113.737 34.3231 115.244 33.6974 116.179 32.4574Z"
            fill="currentColor"
          />
          <path
            d="M133.638 9.43148H145.629L145.97 12.014C147.288 11.0583 148.969 10.2677 151.011 9.64768C153.054 9.02758 155.167 8.71478 157.35 8.71478C161.392 8.71478 164.343 9.76708 166.207 11.8718C168.071 13.9764 169.001 17.2244 169.001 21.627V43.4299H156.194V22.9865C156.194 21.4564 155.864 20.3585 155.205 19.6873C154.546 19.0161 153.443 18.6862 151.898 18.6862C150.947 18.6862 149.968 18.9137 148.969 19.3688C147.969 19.8239 147.131 20.4097 146.445 21.1265V43.4299H133.638V9.43148Z"
            fill="currentColor"
          />
          <path
            d="M169.038 9.4317H182.391L188.524 29.3689L194.658 9.4317H208.011L195.268 43.4301H181.775L169.038 9.4317Z"
            fill="currentColor"
          />
          <path
            d="M212.043 40.5062C208.195 37.4687 206.396 32.1957 206.396 26.5018C206.396 20.9558 207.828 16.3882 211.097 13.2312C214.366 10.0743 219.349 8.71478 225.639 8.71478C231.426 8.71478 235.976 10.1255 239.3 12.9468C242.618 15.7682 244.282 19.6191 244.282 24.4939V30.4494H219.927C220.532 32.2184 221.299 33.4983 223.185 34.289C225.071 35.0796 227.703 35.4721 231.07 35.4721C233.08 35.4721 235.133 35.3071 237.219 34.9715C237.954 34.8521 239.165 34.6644 239.802 34.5222V42.7871C236.619 43.6972 232.377 44.1523 227.595 44.1523C221.159 44.1466 215.89 43.5437 212.043 40.5062ZM230.826 23.1344C230.826 21.4507 228.984 17.8273 225.282 17.8273C221.942 17.8273 219.738 21.3938 219.738 23.1344H230.826Z"
            fill="currentColor"
          />
          <path
            d="M254.338 26.1437L242.346 9.4317H256.245L280.773 43.4301H266.74L261.287 35.825L255.835 43.4301H241.865L254.338 26.1437Z"
            fill="currentColor"
          />
          <path
            d="M266.431 9.4317H280.265L269.647 24.3178L262.622 14.7786L266.431 9.4317Z"
            fill="currentColor"
          />
          <path
            d="M31.2808 40.6517C38.652 39.8381 45.6012 35.9353 49.427 29.4211C47.6156 45.533 29.8853 55.717 15.413 49.4643C14.0795 48.8897 12.9316 47.9339 12.1438 46.705C8.89148 41.6302 7.82239 35.1729 9.35849 29.313C13.7475 36.8399 22.6717 41.4538 31.2808 40.6517Z"
            fill="currentColor"
          />
          <path
            d="M9.08949 24.5852C6.10159 31.4464 5.97219 39.4797 9.63529 46.0906C-3.25581 36.453 -3.11521 15.8294 9.47779 6.28849C10.6425 5.40669 12.0267 4.88329 13.4785 4.80359C19.4486 4.49069 25.5144 6.78348 29.7683 11.0561C21.1254 11.1415 12.7076 16.643 9.08949 24.5852Z"
            fill="currentColor"
          />
          <path
            d="M33.9366 13.1673C29.5757 7.12528 22.7503 3.01187 15.2722 2.88677C29.7277 -3.63313 47.5086 6.93748 49.444 22.5659C49.624 24.0167 49.388 25.4959 48.7409 26.8044C46.04 32.2547 41.032 36.4819 35.1801 38.0464C39.4678 30.144 38.9388 20.4893 33.9366 13.1673Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Nx',
      url: 'https://nx.app',
      logo: (
        <svg
          className="w-full max-w-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1025 383"
        >
          <title>Nx.app</title>
          <path
            fill="currentColor"
            d="m512.321 246.145-77.992-122.052-.117 102.549L299.799.09H205.24v382.456h93.502l.305-226.269 133.026 216.13 80.248-126.262ZM434.353 98.404h93.383l.212-1.083V.09h-93.501l-.118 97.231.024 1.083Zm237.712 106.029c-22.371-.424-42.583 13.308-50.452 34.277 13.1-19.613 38.044-27.494 60.016-18.961 10.151 4.14 23.499 10.821 34.073 7.246a53.677 53.677 0 0 0-43.637-22.562Z"
          />
          <path
            fill="currentColor"
            d="M778.021 250.45c0-11.457-6.227-14.116-19.151-18.821-9.588-3.34-20.468-7.104-28.387-17.456-1.551-2.046-2.984-4.352-4.512-6.799a54.615 54.615 0 0 0-13.652-16.468c-7.543-5.552-17.436-8.257-30.267-8.257-25.744.018-48.938 15.575-58.746 39.405a59.588 59.588 0 0 1 54.117-24.51c21.11 2.049 39.543 15.172 48.407 34.462a19.143 19.143 0 0 0 21.408 8.563c12.619-2.705 11.749 9.246 30.807 13.292l-.024-3.411Z"
          />
          <path
            fill="currentColor"
            d="M819.637 248.003v-.259c-.282-75.847-61.778-140.73-137.585-140.73-46.299-.032-89.502 23.278-114.932 62.013l-.493-.847-38.914-61.166h-93.36l88.707 139.083-86.569 136.449h90.681l39.455-60.673 40.159 60.673h90.705l-82.245-129.579a17.978 17.978 0 0 1-2.162-8.211 69.014 69.014 0 0 1 20.179-48.797 68.854 68.854 0 0 1 48.742-20.203c38.115 0 44.483 22.82 52.708 33.547 16.237 21.173 48.666 11.904 48.666 39.523a18.118 18.118 0 0 0 9.281 15.553 18.078 18.078 0 0 0 18.094-.271 18.121 18.121 0 0 0 8.813-15.823v-.282h.07Zm.094 19.526c.922 6.451.01 13.03-2.631 18.985-5.17 11.975-13.794 7.976-13.794 7.976s-7.426-3.623-2.914-10.563c5.005-7.74 14.898-6.846 19.339-16.398Z"
          />
        </svg>
      ),
    },
    {
      name: 'This Dot Labs',
      url: 'https://thisdot.co',
      logo: (
        <svg
          className="w-full max-w-[200px]"
          xmlns="http://www.w3.org/2000/svg"
          width="152"
          height="30"
          fill="none"
          viewBox="0 0 152 34"
        >
          <title>This Dot Labs</title>
          <path
            fill="currentColor"
            d="M4.854 3.492H0V.312h13.448v3.18H8.595v15.06H4.854V3.492ZM21.753.312h3.738v8.13h6.491V.312h3.738v18.24h-3.738v-6.93h-6.49v6.93h-3.739V.312ZM49.19.312v18.24H45.45V.312h3.738ZM58.012 13.705h3.79c.131 1.304 1.04 1.928 2.31 1.928 1.272 0 2.105-.756 2.105-1.928s-.73-1.851-3.196-2.867c-3.62-1.498-4.905-3.217-4.905-5.89 0-2.996 2.18-4.951 5.686-4.951 3.247 0 5.686 1.927 5.686 5.107h-3.79c0-1.12-.725-1.876-1.948-1.876-1.247 0-1.844.756-1.844 1.667 0 1.096.753 1.734 3.295 2.826 3.634 1.564 4.802 3.204 4.802 5.759 0 3.217-2.284 5.38-5.945 5.38-3.659.008-5.839-2.235-6.046-5.155ZM88.298 18.552h-6.076V.312h6.076c5.894 0 9.866 3.336 9.866 9.122 0 5.81-3.972 9.118-9.866 9.118Zm.024-15.06H85.96v11.881h2.362c3.403 0 6.05-1.98 6.05-5.915 0-3.987-2.647-5.966-6.05-5.966ZM143.405 3.492h-4.854V.312H152v3.18h-4.857v15.06h-3.738V3.492Z"
          />
          <path
            fill="currentColor"
            d="M82.425 25.523h1.603v6.463h3.13v1.366h-4.733v-7.829ZM106.604 32.191h-3.365l-.445 1.165h-1.672l3.154-7.828h1.292l3.154 7.828h-1.672l-.446-1.165Zm-2.854-1.341h2.339l-1.171-3.04-1.168 3.04ZM122.146 25.528h2.708c1.762 0 2.74.96 2.74 2.236 0 .628-.325 1.331-.992 1.633.802.246 1.348.95 1.348 1.779 0 1.421-.892 2.18-2.954 2.18h-2.853v-7.828h.003Zm2.653 1.342h-1.047v1.98h1.047c.871 0 1.192-.368 1.192-.996 0-.627-.321-.984-1.192-.984Zm-1.047 3.321v1.824h1.382c.847 0 1.161-.337 1.161-.905 0-.572-.311-.915-1.161-.915h-1.382v-.004ZM142.766 27.518c0-1.266.891-2.125 2.508-2.125.746 0 1.517.2 2.094.547l-.491 1.276a2.704 2.704 0 0 0-1.447-.437c-.702 0-1.037.257-1.037.66 0 .436.29.7 1.348 1.185 1.364.627 2.017 1.317 2.017 2.493 0 1.442-.981 2.371-2.819 2.371-.812 0-1.682-.236-2.339-.638l.491-1.297a3.279 3.279 0 0 0 1.782.548c.781 0 1.261-.312 1.261-.856 0-.576-.407-.902-1.364-1.318-1.551-.676-2.004-1.397-2.004-2.41ZM118.387 14.946c3.122 0 5.652-2.539 5.652-5.672 0-3.132-2.53-5.672-5.652-5.672-3.121 0-5.651 2.54-5.651 5.672 0 3.133 2.53 5.672 5.651 5.672Z"
          />
          <path
            fill="currentColor"
            d="M127.113.156h-4.653l6.978 9.118-6.978 9.122h4.653l6.979-9.122-6.979-9.118ZM109.661.156h4.653l-6.978 9.118 6.978 9.122h-4.653l-6.978-9.122 6.978-9.118Z"
          />
        </svg>
      ),
    },
    {
      name: 'Prisma',
      url: 'https://prisma.io',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[180px]"
          viewBox="0 0 90 28"
          fill="none"
        >
          <title>Prisma.io</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.209637 19.0073C-0.0659575 18.5726 -0.070121 18.0189 0.198904 17.58L10.3282 1.05707C10.8916 0.138071 12.252 0.218426 12.7033 1.19735L21.9569 21.2706C22.3002 22.0154 21.905 22.8917 21.1194 23.1274L6.72474 27.4458C6.14558 27.6195 5.52155 27.3867 5.19781 26.876L0.209637 19.0073ZM11.4969 5.88824C11.5945 5.40217 12.2605 5.33208 12.4572 5.78717L18.8402 20.5571C18.9603 20.8352 18.8108 21.1559 18.5205 21.2425L8.57492 24.2114C8.20935 24.3205 7.85916 24.0011 7.93428 23.627L11.4969 5.88824ZM48.4948 21.1371H51.3226V10.772H48.4948V21.1371ZM48.3744 8.09277C48.3744 7.17221 48.8878 6.7116 49.9137 6.7116C50.9394 6.7116 51.4527 7.17221 51.4527 8.09277C51.4527 8.53176 51.3244 8.87321 51.068 9.11743C50.8114 9.36165 50.4267 9.48343 49.9137 9.48343C48.8878 9.48343 48.3744 9.01987 48.3744 8.09277ZM87.1709 16.335L86.0768 16.372C85.2548 16.3969 84.6429 16.5455 84.2412 16.8172C83.8392 17.0893 83.6386 17.5031 83.6386 18.0596C83.6386 18.8567 84.0959 19.2555 85.0106 19.2555C85.6656 19.2555 86.1897 19.0672 86.5819 18.6898C86.9744 18.313 87.1709 17.8124 87.1709 17.1878V16.335ZM88.0053 21.1375L87.4583 19.7282H87.384C86.908 20.3279 86.4182 20.7437 85.9144 20.9755C85.4109 21.2072 84.7542 21.3228 83.9446 21.3228C82.9491 21.3228 82.1661 21.0386 81.5941 20.47C81.0226 19.9017 80.7368 19.0918 80.7368 18.0409C80.7368 16.941 81.1214 16.1298 81.8907 15.6073C82.6607 15.0851 83.8209 14.7961 85.3723 14.7404L87.1709 14.6848V14.2304C87.1709 13.1799 86.633 12.6544 85.5576 12.6544C84.7293 12.6544 83.7558 12.9045 82.6371 13.4054L81.7009 11.4955C82.8938 10.8716 84.2167 10.559 85.6689 10.559C87.0596 10.559 88.1258 10.8621 88.8676 11.4677C89.6091 12.0734 89.98 12.9946 89.98 14.2304V21.1375H88.0053ZM72.4802 21.1375H69.6524V15.0834C69.6524 14.3357 69.527 13.775 69.2772 13.4008C69.0265 13.0269 68.6326 12.8397 68.0948 12.8397C67.3719 12.8397 66.8465 13.1058 66.5188 13.6371C66.1911 14.1688 66.0275 15.0435 66.0275 16.261V21.1375H63.1996V10.7723H65.3599L65.74 12.0982H65.8978C66.1757 11.6225 66.5778 11.25 67.1029 10.9812C67.6283 10.7121 68.231 10.5776 68.9109 10.5776C70.4623 10.5776 71.5128 11.0846 72.0631 12.0982H72.3132C72.5915 11.616 73.001 11.2421 73.5419 10.9763C74.0827 10.7105 74.6929 10.5776 75.3728 10.5776C76.5471 10.5776 77.4359 10.8791 78.0382 11.4817C78.6409 12.0844 78.9421 13.0502 78.9421 14.3786V21.1375H76.1051V15.0834C76.1051 14.3357 75.9798 13.775 75.73 13.4008C75.4792 13.0269 75.0854 12.8397 74.5475 12.8397C73.8555 12.8397 73.3379 13.0872 72.9945 13.5815C72.6517 14.0761 72.4802 14.8608 72.4802 15.9362V21.1375ZM60.17 20.4885C60.9088 19.9323 61.2781 19.1227 61.2781 18.0594C61.2781 17.5468 61.1887 17.1045 61.0093 16.7336C60.8299 16.3627 60.5517 16.0353 60.1749 15.7508C59.7981 15.4667 59.2046 15.1609 58.3946 14.8332C57.4862 14.4685 56.8976 14.1932 56.6285 14.0079C56.3601 13.8226 56.2252 13.6033 56.2252 13.3496C56.2252 12.8985 56.6426 12.6729 57.477 12.6729C57.9465 12.6729 58.4071 12.7443 58.8582 12.886C59.3093 13.0284 59.7948 13.2104 60.314 13.4331L61.1668 11.3936C59.9863 10.8498 58.7718 10.5778 57.5232 10.5778C56.2127 10.5778 55.2009 10.8295 54.4872 11.3333C53.7729 11.8371 53.416 12.5495 53.416 13.4701C53.416 14.0079 53.5012 14.461 53.6714 14.8286C53.841 15.1963 54.113 15.5223 54.4872 15.8065C54.8607 16.091 55.4467 16.4 56.2438 16.7336C56.8 16.9686 57.2453 17.1742 57.5788 17.3503C57.9128 17.5265 58.1475 17.6843 58.2837 17.8231C58.4195 17.9622 58.4876 18.1429 58.4876 18.3655C58.4876 18.9587 57.9743 19.2553 56.9483 19.2553C56.4478 19.2553 55.8684 19.1718 55.2103 19.0052C54.5517 18.8382 53.9601 18.6313 53.4347 18.3838V20.7203C53.8983 20.918 54.3959 21.0679 54.9275 21.1701C55.4591 21.2719 56.1014 21.3229 56.8557 21.3229C58.3266 21.3229 59.4314 21.0447 60.17 20.4885ZM46.9948 10.661C46.7414 10.6054 46.4232 10.5776 46.0398 10.5776C45.3969 10.5776 44.8021 10.7553 44.2554 11.1108C43.708 11.4664 43.2739 11.9345 42.9524 12.5152H42.8136L42.3962 10.7723H40.2546V21.1375H43.0824V15.8622C43.0824 15.0278 43.3341 14.3786 43.8376 13.9151C44.3418 13.4515 45.0446 13.2197 45.9472 13.2197C46.2749 13.2197 46.5528 13.2508 46.7817 13.3124L46.9948 10.661ZM31.9317 13.9614H32.8774C33.7613 13.9614 34.4223 13.7869 34.8613 13.4376C35.3003 13.0886 35.5196 12.5799 35.5196 11.9124C35.5196 11.239 35.3356 10.7414 34.968 10.4199C34.6 10.0984 34.0239 9.93766 33.2388 9.93766H31.9317V13.9614ZM38.4214 11.8106C38.4214 13.2694 37.9657 14.385 37.0537 15.1573C36.1423 15.9302 34.8459 16.3162 33.1649 16.3162H31.9317V21.1373H29.0577V7.58296H33.3872C35.0315 7.58296 36.2814 7.93684 37.1375 8.64461C37.9936 9.35238 38.4214 10.4079 38.4214 11.8106Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ],
}
