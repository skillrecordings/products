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
          className="mx-auto my-8 flex w-full max-w-screen-lg flex-col border-y px-5 py-16 sm:px-3  md:justify-between"
        >
          <h2 className="mb-8 text-3xl font-semibold text-brand-green">
            Sponsors
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-16">
            {sponsors.map(({name, url, logo}) => {
              return (
                <a
                  className="flex aspect-[3/2] w-[35%] items-center justify-center text-gray-600 transition hover:text-foreground dark:text-gray-300 dark:hover:text-foreground sm:w-[15%] [&_svg]:object-contain"
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

const sponsors = [
  {
    name: 'Turso',
    url: 'https://turso.tech',
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="740"
        height="170"
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
        width="281"
        height="52"
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
        xmlns="http://www.w3.org/2000/svg"
        width="1025"
        height="383"
        fill="none"
        viewBox="0 0 1025 383"
      >
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
]
