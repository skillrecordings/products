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
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1722259847/epic-web-camp-24-card_2x.png',
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
      name: 'Tigris',
      url: 'https://tigrisdata.com',
      logo: (
        <svg
          className="w-full max-w-[180px]"
          xmlns="http://www.w3.org/2000/svg"
          width="130"
          height="54"
          fill="none"
          viewBox="0 0 130 54"
        >
          <mask
            id="a"
            width="130"
            height="54"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
            style={{maskType: 'luminance'}}
          >
            <path fill="currentColor" d="M130 .598H.815v52.804H130V.598Z" />
          </mask>
          <g mask="url(#a)">
            <path
              fill="currentColor"
              d="M60.441 3.924V1.227h6.823v26.56a14.97 14.97 0 0 1-1.489 6.733 10.921 10.921 0 0 1-4.433 4.689 14.079 14.079 0 0 1-7.149 1.7 15.117 15.117 0 0 1-9.463-2.771 11.451 11.451 0 0 1-4.344-7.58H47.1a5.555 5.555 0 0 0 2.272 3.184 7.448 7.448 0 0 0 4.345 1.147 6.787 6.787 0 0 0 4.88-1.776 7.094 7.094 0 0 0 1.857-5.413v-5.273a8.885 8.885 0 0 1-3.466 4.33 10.327 10.327 0 0 1-5.855 1.623 11.67 11.67 0 0 1-6.138-1.645 11.197 11.197 0 0 1-4.27-4.797 18.36 18.36 0 0 1 0-14.726 11.141 11.141 0 0 1 4.27-4.786A11.58 11.58 0 0 1 51.133.78c2.272.108 7.496.108 9.31 3.141l-.002.003ZM48.1 8.959a9.36 9.36 0 0 0-1.955 5.722 9.36 9.36 0 0 0 1.955 5.722 7.396 7.396 0 0 0 10.31-.054 8.957 8.957 0 0 0 0-11.366 6.81 6.81 0 0 0-5.138-2.112 6.728 6.728 0 0 0-5.172 2.09v-.002Z"
            />
            <path
              fill="currentColor"
              d="M55.01 53.252a34.48 34.48 0 0 1-4.878-.347C38.702 51.25 29.772 44.17 27.37 34.87a43.19 43.19 0 0 1-.62-9.616V12.487h6.845v12.82a41.035 41.035 0 0 0 .403 7.86c1.705 6.636 8.432 11.737 17.111 12.992 6.66.963 15.21-.445 19.383-7.243l1.085-2.112c3.422-6.95 10.93-7.017 14.95-7.058h2.497a6.975 6.975 0 0 0 2.085-.649 7.279 7.279 0 0 0 2.972-2.667 7.234 7.234 0 0 0 1.113-3.829v-10.07h6.845v10.07a14.06 14.06 0 0 1-3.525 9.286 14.137 14.137 0 0 1-8.797 4.66h-3.129c-5.432.053-7.702.866-8.876 3.246l-1.25 2.49c-4.227 6.94-12.18 10.969-21.458 10.969h.005Z"
            />
            <path
              fill="currentColor"
              d="M79.692 4.606V1.1h-6.877v25.606c0 .1.025.2.071.288a.577.577 0 0 0 .776.243 24.9 24.9 0 0 1 5.553-1.83.602.602 0 0 0 .48-.575v-9.745c0-4.669 2.534-7.005 7.605-7.005h2V.753c-2.108-.044-7.617.346-9.606 3.853h-.002Z"
            />
            <path
              className="text-[#00BF78] dark:text-[#50FFAB]"
              fill="currentColor"
              d="m30.302 9.553-.708-1.547a3.956 3.956 0 0 0-1.999-1.96l-1.564-.66 1.542-.706a3.896 3.896 0 0 0 1.967-2.004l.673-1.56.708 1.538a3.847 3.847 0 0 0 2.008 1.96l1.555.67-1.542.705a3.896 3.896 0 0 0-1.968 2.004l-.672 1.56Z"
            />
            <path
              fill="currentColor"
              d="M13.746 13.895v-7.08h6.714V1.032H.904v5.781h5.855v7.049c0 7.21 3.062 15.622 13.7 15.622v-5.597c-5.434.032-6.716-4.146-6.716-9.993h.003Z"
            />
            <path
              className="text-[#00BF78] dark:text-[#50FFAB]"
              fill="currentColor"
              d="m98.617 9.553-.707-1.547a3.938 3.938 0 0 0-2.009-1.96l-1.564-.66 1.552-.706a3.952 3.952 0 0 0 1.967-2.004l.673-1.56.695 1.538a3.858 3.858 0 0 0 2.009 1.96l1.565.67-1.543.705a3.894 3.894 0 0 0-1.967 2.004l-.673 1.56h.002Z"
            />
            <path
              fill="currentColor"
              d="M128.399 16.44a8.61 8.61 0 0 0-3.672-2.285 37.582 37.582 0 0 0-5.433-1.19 25.13 25.13 0 0 1-4.921-1.224 2.263 2.263 0 0 1-1.152-.823 2.264 2.264 0 0 1-.435-1.343 2.562 2.562 0 0 1 1.476-2.262 8.961 8.961 0 0 1 4.345-.855 15.49 15.49 0 0 1 7.974 2.078l2.5-4.927a15.858 15.858 0 0 0-4.693-1.743 25.818 25.818 0 0 0-5.725-.649 15.142 15.142 0 0 0-8.942 2.36 7.398 7.398 0 0 0-3.259 6.312 6.56 6.56 0 0 0 1.478 4.689 8.462 8.462 0 0 0 3.748 2.36 37.33 37.33 0 0 0 5.607 1.191c1.621.211 3.218.575 4.77 1.083a2.055 2.055 0 0 1 1.478 2.024c0 2.05-1.945 3.072-5.835 3.065a27.03 27.03 0 0 1-10.342-1.808v5.413a26.381 26.381 0 0 0 9.929 1.656c3.891 0 6.965-.776 9.225-2.329a7.268 7.268 0 0 0 2.505-2.68 7.228 7.228 0 0 0 .872-3.555 6.384 6.384 0 0 0-1.498-4.559Z"
            />
          </g>
        </svg>
      ),
    },
    // {
    //   name: 'Fly.io',
    //   url: 'https://fly.io',
    //   logo: (
    //     <svg
    //       className="w-full max-w-[200px]"
    //       viewBox="0 0 300 89"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <title>Fly.io</title>
    //       <path
    //         fillRule="evenodd"
    //         clipRule="evenodd"
    //         d="M66.522 11.742H77.476C87.219 11.742 95.129 19.652 95.129 29.395V67.912C95.129 77.655 87.219 85.565 77.476 85.565H76.613C71.598 84.781 69.423 83.277 67.743 82.006L53.816 70.555C53.4665 70.274 53.0315 70.1209 52.583 70.1209C52.1345 70.1209 51.6995 70.274 51.35 70.555L46.826 74.276L34.083 63.798C33.7343 63.5161 33.2994 63.3624 32.851 63.3624C32.4026 63.3624 31.9677 63.5161 31.619 63.798L13.915 79.371C10.353 82.269 7.996 81.734 6.468 81.566C2.52 78.326 0 73.411 0 67.912V29.395C0 19.652 7.91 11.742 17.654 11.742H28.584L28.564 11.786L28.196 12.86L28.081 13.228L27.585 15.429L27.517 15.814L27.299 18.018L27.27 18.623L27.265 18.835L27.286 19.845L27.336 20.438L27.459 21.364L27.615 22.199L27.801 22.967L28.042 23.799L28.667 25.56L28.874 26.088L29.963 28.389L30.347 29.096L31.607 31.258L32.089 32.038L33.847 34.626L34.1 34.969L36.388 37.946L37.127 38.862L39.738 41.915L40.275 42.503L42.428 44.819L43.28 45.702L44.689 47.102L44.407 47.338L44.23 47.497C43.752 47.943 43.298 48.417 42.873 48.915C42.668 49.156 42.473 49.405 42.289 49.661C42.0073 50.0528 41.7549 50.4649 41.534 50.894C41.4217 51.117 41.3209 51.3457 41.232 51.579C41.0029 52.1749 40.8651 52.802 40.823 53.439L40.815 53.99C40.835 54.766 40.993 55.532 41.282 56.253C41.574 56.983 42.001 57.652 42.54 58.226C42.932 58.643 43.378 59.007 43.867 59.306C44.2835 59.5611 44.7264 59.7703 45.188 59.93C46.1903 60.27 47.2539 60.3911 48.307 60.285H48.312C49.2107 60.1977 50.0843 59.9383 50.885 59.521C51.23 59.338 51.559 59.126 51.867 58.885C52.7499 58.1985 53.4338 57.2889 53.848 56.25C54.173 55.44 54.332 54.575 54.318 53.704L54.292 53.248C54.2331 52.6466 54.0897 52.0564 53.866 51.495C53.7689 51.2506 53.6587 51.0116 53.536 50.779C53.3077 50.3507 53.048 49.9399 52.759 49.55C52.6271 49.3713 52.4904 49.1963 52.349 49.025C51.8791 48.4636 51.373 47.9335 50.834 47.438L50.452 47.113L51.098 46.476L53.872 43.579L54.831 42.526L56.322 40.848L57.292 39.714L58.675 38.029L59.612 36.852L60.987 35.013L61.681 34.062L62.666 32.589L63.486 31.335L65.032 28.643L65.916 26.877L65.941 26.823L66.618 25.185C66.627 25.1638 66.6347 25.1421 66.641 25.12L67.37 22.846L67.446 22.515L67.763 20.705L67.824 20.215L67.843 19.915L67.865 18.782L67.859 18.571L67.801 17.556L67.729 16.768L67.37 14.496C67.364 14.466 67.358 14.436 67.349 14.406L66.888 12.726L66.729 12.259L66.522 11.742ZM71.729 59.774C70.6259 59.7943 69.5737 60.2415 68.7936 61.0216C68.0135 61.8017 67.5663 62.8539 67.546 63.957C67.579 66.238 69.447 68.105 71.729 68.138C74.01 68.105 75.878 66.238 75.913 63.957C75.8925 62.8539 75.445 61.8016 74.6648 61.0215C73.8845 60.2414 72.8322 59.7943 71.729 59.774Z"
    //         fill="currentColor"
    //         fillOpacity="0.35"
    //       />
    //       <path
    //         fillRule="evenodd"
    //         clipRule="evenodd"
    //         d="M63.4939 85.565H41.9839C40.8819 85.565 40.7279 84.521 41.4369 83.927C51.9359 75.132 51.9109 75.103 51.9109 75.103C52.1187 74.9288 52.3812 74.8331 52.6524 74.8325C52.9235 74.832 53.1863 74.9266 53.3949 75.1C53.3949 75.1 63.2619 83.274 64.0409 83.927C64.7499 84.521 64.5969 85.565 63.4939 85.565ZM47.6249 50.485L47.7369 50.517C47.7719 50.535 47.8029 50.56 47.8349 50.582L47.9279 50.664C48.1569 50.875 48.3799 51.097 48.5939 51.324C48.7449 51.485 48.8919 51.651 49.0329 51.822C49.2129 52.039 49.3809 52.266 49.5339 52.502C49.5999 52.606 49.6609 52.712 49.7189 52.822C49.7689 52.917 49.8139 53.015 49.8529 53.115C49.9229 53.289 49.9749 53.472 49.9909 53.658L49.9879 54.008C49.9647 54.3239 49.8668 54.6297 49.7021 54.9002C49.5375 55.1708 49.3108 55.3983 49.0409 55.564C48.6909 55.776 48.2969 55.906 47.8899 55.943L47.4569 55.956L47.0919 55.924C46.9215 55.8988 46.7538 55.858 46.5909 55.802C46.425 55.7454 46.2657 55.671 46.1159 55.58L45.8309 55.371C45.495 55.0844 45.2662 54.6924 45.1819 54.259C45.1676 54.1858 45.1562 54.1121 45.1479 54.038L45.1379 53.705C45.1434 53.6144 45.1564 53.5244 45.1769 53.436C45.2269 53.241 45.2989 53.052 45.3889 52.873C45.5059 52.648 45.6389 52.431 45.7879 52.225C46.0349 51.892 46.3019 51.574 46.5879 51.274C46.7729 51.079 46.9609 50.89 47.1579 50.709L47.2989 50.582C47.3959 50.517 47.3969 50.517 47.5079 50.485H47.6249ZM46.9079 3.96298L46.9529 3.95898V42.97L46.8559 42.79C45.572 40.4144 44.3765 37.9921 43.2719 35.528C42.3761 33.5333 41.5648 31.5019 40.8399 29.439C40.2609 27.7958 39.7719 26.1223 39.3749 24.426C39.0659 23.078 38.8299 21.711 38.7329 20.33C38.6951 19.7405 38.6837 19.1495 38.6989 18.559C38.7079 18.045 38.7289 17.532 38.7619 17.018C38.8129 16.211 38.8949 15.405 39.0129 14.606C39.1069 13.977 39.2229 13.35 39.3659 12.73C39.4799 12.238 39.6119 11.749 39.7629 11.268C39.9809 10.573 40.2409 9.89398 40.5449 9.23098C40.6559 8.99198 40.7749 8.75498 40.9009 8.52198C41.6539 7.12698 42.6759 5.84198 44.0139 4.98198C44.8836 4.41656 45.8758 4.06719 46.9079 3.96298ZM51.9669 4.06098L54.5909 4.80998C55.8118 5.25501 56.9741 5.84703 58.0519 6.57298C59.5177 7.56194 60.781 8.82187 61.7739 10.285C62.356 11.1549 62.8393 12.087 63.2149 13.064C63.761 14.5085 64.0987 16.0233 64.2179 17.563C64.2529 17.966 64.2729 18.37 64.2809 18.775C64.2899 19.15 64.2879 19.527 64.2579 19.902C64.1829 20.7422 64.0248 21.573 63.7859 22.382C63.5939 23.0439 63.3669 23.6951 63.1059 24.333C62.7818 25.1264 62.4214 25.9046 62.0259 26.665C61.1509 28.355 60.1449 29.971 59.0669 31.534C57.7311 33.4547 56.3072 35.3127 54.7999 37.102C53.1624 39.0543 51.455 40.9469 49.6809 42.776C50.8851 40.5186 52.0088 38.2191 53.0499 35.882C53.6287 34.5802 54.1749 33.2641 54.6879 31.935C55.2527 30.4752 55.7618 28.9945 56.2139 27.496C56.552 26.3735 56.8449 25.2379 57.0919 24.092C57.3009 23.108 57.4659 22.114 57.5679 21.114C57.6529 20.28 57.6849 19.441 57.6639 18.605C57.6559 18.0926 57.6369 17.5805 57.6069 17.069C57.4839 15.012 57.1709 12.961 56.5709 10.988C56.3441 10.2395 56.0678 9.50686 55.7439 8.79498C54.9759 7.12198 53.9039 5.55798 52.4529 4.41698L51.9669 4.06098ZM207.646 74.498L195.189 47.832C194.149 45.61 193.529 44.798 192.488 43.856L191.476 42.943C190.668 42.16 190.138 41.435 190.138 40.574C190.138 39.341 191.114 38.303 192.893 38.303H203.708C205.405 38.303 206.463 39.186 206.463 40.504C206.463 41.24 206.125 41.792 205.697 42.333C205.19 42.976 204.529 43.602 204.529 44.745C204.529 45.461 204.738 46.175 205.14 47.087L212.574 64.495L219.242 47.525C219.652 46.396 219.932 45.402 219.932 44.606C219.932 43.367 219.259 42.862 218.74 42.308C218.288 41.827 217.927 41.319 217.927 40.504C217.927 39.173 219.01 38.303 220.468 38.303H227.128C228.995 38.303 229.883 39.269 229.883 40.504C229.883 41.294 229.428 42.027 228.532 42.817L227.59 43.591C226.278 44.663 225.671 46.213 224.982 47.817L214.883 72.146C213.69 74.99 211.913 78.939 209.2 82.179C206.443 85.469 202.726 88.028 197.692 88.028C193.477 88.028 190.925 86.015 190.925 83.115C190.925 80.458 192.89 78.341 195.472 78.341C196.886 78.341 197.621 79.009 198.367 79.696C198.984 80.262 199.61 80.844 200.844 80.844C201.988 80.844 203.054 80.36 204.021 79.578C205.497 78.384 206.733 76.505 207.646 74.498ZM280.844 74.403C286.451 74.403 291.045 72.482 294.628 68.648C298.209 64.82 300 60.212 300 54.824C300 49.565 298.298 45.244 294.907 41.858C291.516 38.473 287.117 36.773 281.703 36.773C276.002 36.773 271.34 38.624 267.709 42.312C264.077 46.003 262.26 50.474 262.26 55.727C262.26 60.932 263.994 65.345 267.455 68.964C270.919 72.586 275.38 74.403 280.844 74.403ZM233.431 73.986C236.673 73.986 238.978 71.803 238.978 68.656C238.978 65.583 236.597 63.396 233.431 63.396C230.113 63.396 227.739 65.587 227.739 68.656C227.739 71.8 230.115 73.986 233.431 73.986ZM244.975 68.998L245.765 68.164C246.703 67.252 247.005 66.331 247.005 63.791V48.776C247.005 46.58 246.707 45.6 245.775 44.761L244.847 43.929C243.937 43.126 243.638 42.627 243.638 41.825C243.638 40.685 244.522 39.75 245.944 39.426L252.247 37.896C252.85 37.75 253.53 37.608 254.057 37.608C254.782 37.608 255.376 37.846 255.792 38.26C256.209 38.675 256.454 39.271 256.454 40.018V63.791C256.454 66.188 256.745 67.303 257.746 68.145C257.762 68.159 257.777 68.174 257.791 68.19L258.496 69.011C259.381 69.872 259.748 70.443 259.748 71.228C259.748 72.629 258.692 73.43 256.994 73.43H246.322C244.704 73.43 243.638 72.634 243.638 71.228C243.638 70.439 244.006 69.863 244.975 68.998ZM173.641 68.999L174.43 68.164C175.369 67.252 175.671 66.331 175.671 63.791V32.441C175.671 30.315 175.446 29.271 174.451 28.433L173.498 27.511C172.677 26.713 172.377 26.218 172.377 25.42C172.377 24.278 173.265 23.347 174.609 23.021L180.84 21.492C181.444 21.346 182.123 21.203 182.651 21.203C183.371 21.203 183.98 21.42 184.415 21.831C184.851 22.244 185.119 22.857 185.119 23.683V63.791C185.119 66.194 185.418 67.245 186.423 68.154L187.227 69.005C188.118 69.872 188.415 70.439 188.415 71.228C188.415 71.81 188.237 72.279 187.921 72.637C187.475 73.141 186.728 73.43 185.731 73.43H175.06C174.064 73.43 173.316 73.141 172.869 72.637C172.554 72.279 172.377 71.81 172.377 71.228C172.377 70.438 172.67 69.866 173.641 68.999ZM144.583 52.854V63.652C144.583 65.279 144.905 66.781 146.245 68.018L147.112 68.859C148.083 69.801 148.378 70.365 148.378 71.228C148.378 72.547 147.321 73.43 145.623 73.43H133.591C131.893 73.43 130.836 72.547 130.836 71.228C130.836 70.204 131.137 69.719 132.107 68.854L132.971 68.015C133.976 67.105 134.632 65.864 134.632 63.652V34.805C134.632 33.047 134.243 31.609 132.97 30.438L132.102 29.597C131.21 28.731 130.836 28.162 130.836 27.297C130.836 25.899 131.897 25.026 133.591 25.026H165.821C167.052 25.026 168.135 25.3 168.826 25.978C169.307 26.45 169.614 27.115 169.649 28.038L170.151 35.478C170.201 36.408 169.926 37.184 169.39 37.662C169.02 37.991 168.523 38.188 167.897 38.188C167.108 38.188 166.503 37.89 165.963 37.376C165.478 36.914 165.046 36.265 164.558 35.501C163.381 33.62 162.833 32.943 161.578 32.063C159.832 30.775 157.171 30.332 152.141 30.332C149.238 30.332 147.406 30.459 146.252 30.756C145.506 30.949 145.075 31.199 144.845 31.566C144.608 31.942 144.583 32.417 144.583 32.997V47.617H152.141C153.949 47.617 155.221 47.29 156.695 45.276L156.703 45.264C157.294 44.512 157.722 43.958 158.129 43.591C158.602 43.162 159.058 42.959 159.661 42.959C160.241 42.9668 160.794 43.2021 161.202 43.6142C161.611 44.0262 161.841 44.582 161.843 45.162V55.241C161.843 56.591 160.791 57.512 159.661 57.512C159.099 57.512 158.643 57.312 158.168 56.892C157.759 56.533 157.33 55.994 156.774 55.275C155.161 53.187 154.022 52.854 152.141 52.854H144.583ZM272.283 52.599C272.283 48.983 273.071 46.384 274.703 44.821C276.316 43.278 278.049 42.497 279.912 42.497C282.475 42.497 284.785 43.932 286.868 46.752C288.996 49.636 290.049 53.533 290.049 58.438C290.049 62.058 289.259 64.681 287.624 66.289C286.013 67.875 284.281 68.679 282.419 68.679C279.856 68.679 277.548 67.233 275.464 64.391C273.335 61.483 272.283 57.55 272.283 52.599ZM251.193 33.044C254.442 33.044 256.74 31.215 256.74 28.061C256.74 24.982 254.444 23.149 251.193 23.149C247.866 23.149 245.572 24.983 245.572 28.061C245.572 31.139 247.867 33.044 251.193 33.044Z"
    //         fill="currentColor"
    //       />
    //     </svg>
    //   ),
    // },
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
      url: 'https://convex.dev/c/epicwebcamp',
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
      url: 'https://nx.dev',
      logo: (
        <svg
          className="w-full max-w-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1025 383"
        >
          <title>Nx.dev</title>
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
          className="w-full max-w-[180px]"
          xmlns="http://www.w3.org/2000/svg"
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
      name: 'Prisma Optimize',
      url: 'https://pris.ly/optimize-epicweb',
      logo: (
        <svg
          className="w-full max-w-[230px]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 330 53"
        >
          <title>Prisma Optimize</title>
          <path
            fill="currentColor"
            d="M67.956 9.954c1.759 0 3.304.36 4.637 1.079a7.448 7.448 0 0 1 3.078 3.078c.746 1.306 1.12 2.811 1.12 4.517 0 1.679-.387 3.158-1.16 4.437-.746 1.28-1.812 2.279-3.198 2.998-1.359.693-2.931 1.04-4.717 1.04H62.04c-.133 0-.2.066-.2.2v10.193a.497.497 0 0 1-.16.36.432.432 0 0 1-.32.12h-4.677a.584.584 0 0 1-.36-.12.585.585 0 0 1-.12-.36V10.433c0-.133.04-.24.12-.32a.497.497 0 0 1 .36-.16h11.273Zm-.84 12.631c1.226 0 2.213-.346 2.959-1.039.746-.72 1.119-1.652 1.119-2.798 0-1.173-.373-2.119-1.12-2.838-.745-.72-1.732-1.08-2.957-1.08H62.04c-.133 0-.2.067-.2.2v7.356c0 .133.067.2.2.2h5.077ZM89.33 17.15c.96 0 1.72.186 2.28.56.212.106.292.306.239.6l-.84 4.556c-.026.32-.213.413-.56.28-.399-.133-.865-.2-1.398-.2-.213 0-.507.027-.88.08-.96.08-1.772.44-2.438 1.08-.666.612-1 1.439-1 2.478v10.913a.497.497 0 0 1-.16.36.432.432 0 0 1-.32.12h-4.676a.584.584 0 0 1-.36-.12.584.584 0 0 1-.12-.36V17.908c0-.133.04-.24.12-.32a.497.497 0 0 1 .36-.16h4.677a.38.38 0 0 1 .32.16.38.38 0 0 1 .16.32v1.52c0 .08.026.133.08.16.053.026.093.013.12-.04 1.092-1.6 2.558-2.4 4.396-2.4Zm7.309-2.039c-.907 0-1.666-.293-2.28-.88-.585-.612-.879-1.372-.879-2.278 0-.932.294-1.692.88-2.278.586-.587 1.346-.88 2.279-.88.932 0 1.692.293 2.278.88.586.586.88 1.346.88 2.278 0 .906-.307 1.666-.92 2.279-.586.586-1.333.88-2.239.88ZM94.24 37.976a.584.584 0 0 1-.36-.12.584.584 0 0 1-.12-.36V17.869c0-.133.04-.24.12-.32a.497.497 0 0 1 .36-.16h4.677a.38.38 0 0 1 .32.16.38.38 0 0 1 .16.32v19.628a.497.497 0 0 1-.16.36.432.432 0 0 1-.32.12H94.24Zm16.944.28c-1.785 0-3.344-.253-4.677-.76-1.332-.506-2.371-1.212-3.118-2.118a4.821 4.821 0 0 1-1.079-3.078v-.4c0-.133.04-.24.12-.32a.499.499 0 0 1 .36-.16h4.437a.38.38 0 0 1 .32.16c.106.08.16.187.16.32v.04c0 .587.319 1.093.959 1.52.666.4 1.492.599 2.478.599.906 0 1.639-.173 2.199-.52.56-.373.839-.826.839-1.359 0-.48-.239-.84-.719-1.08-.48-.239-1.266-.492-2.359-.759-1.252-.32-2.238-.626-2.958-.919-1.705-.586-3.064-1.306-4.077-2.159-1.013-.852-1.519-2.078-1.519-3.677 0-1.972.759-3.531 2.279-4.677 1.545-1.173 3.584-1.76 6.116-1.76 1.705 0 3.197.28 4.477.84 1.279.533 2.265 1.293 2.958 2.279.719.986 1.079 2.105 1.079 3.358a.496.496 0 0 1-.16.36.432.432 0 0 1-.32.12h-4.277a.587.587 0 0 1-.36-.12.584.584 0 0 1-.12-.36c0-.587-.306-1.08-.919-1.48-.586-.4-1.372-.599-2.358-.599-.88 0-1.599.16-2.159.48-.56.32-.84.76-.84 1.319 0 .533.267.933.8 1.2.56.266 1.479.545 2.758.839.293.08.626.173 1 .28.373.08.772.186 1.199.32 1.892.559 3.384 1.278 4.477 2.158 1.092.88 1.639 2.158 1.639 3.837 0 1.972-.786 3.518-2.359 4.637-1.545 1.093-3.637 1.64-6.276 1.64ZM145.04 17.11c2.079 0 3.705.626 4.877 1.879 1.173 1.252 1.759 3.011 1.759 5.276v13.232a.496.496 0 0 1-.16.36.43.43 0 0 1-.319.12h-4.677a.582.582 0 0 1-.36-.12.584.584 0 0 1-.12-.36V25.503c0-1.092-.28-1.958-.84-2.598-.559-.64-1.305-.96-2.238-.96s-1.692.32-2.279.96c-.586.64-.879 1.493-.879 2.558v12.033a.496.496 0 0 1-.16.36.433.433 0 0 1-.32.12h-4.637a.586.586 0 0 1-.36-.12.583.583 0 0 1-.119-.36V25.503c0-1.066-.294-1.918-.88-2.558-.586-.666-1.346-1-2.278-1-.853 0-1.573.254-2.159.76-.56.507-.893 1.213-.999 2.119v12.672a.5.5 0 0 1-.16.36.433.433 0 0 1-.32.12h-4.677a.586.586 0 0 1-.36-.12.584.584 0 0 1-.12-.36V17.908c0-.133.04-.24.12-.32a.499.499 0 0 1 .36-.16h4.677a.38.38 0 0 1 .32.16c.106.08.16.187.16.32v1.56c0 .08.026.133.08.16.053.026.106 0 .159-.08 1.093-1.626 2.785-2.44 5.077-2.44 1.333 0 2.492.28 3.478.84a5.593 5.593 0 0 1 2.318 2.399c.08.16.174.16.28 0 .587-1.093 1.373-1.906 2.359-2.439 1.012-.533 2.145-.8 3.397-.8Zm17.987 0c1.732 0 3.278.306 4.637.92 1.359.586 2.412 1.398 3.158 2.438a5.687 5.687 0 0 1 1.159 3.478v13.55a.496.496 0 0 1-.16.36.431.431 0 0 1-.32.12h-4.677a.581.581 0 0 1-.359-.12.584.584 0 0 1-.12-.36v-1.318c0-.08-.027-.134-.08-.16-.054-.027-.107 0-.16.08-1.119 1.465-2.918 2.198-5.397 2.198-2.078 0-3.757-.506-5.036-1.519-1.28-1.013-1.919-2.505-1.919-4.477 0-2.052.719-3.637 2.158-4.757 1.44-1.146 3.492-1.719 6.156-1.719h4.078c.133 0 .2-.066.2-.2v-.879c0-.88-.267-1.559-.8-2.039-.533-.506-1.332-.76-2.398-.76-.826 0-1.519.147-2.079.44-.533.294-.879.707-1.039 1.24-.08.293-.253.426-.52.4l-4.837-.64c-.32-.053-.466-.173-.439-.36.106-1.12.546-2.132 1.319-3.038.799-.906 1.839-1.612 3.118-2.119 1.306-.506 2.758-.76 4.357-.76Zm-.8 16.989c1.146 0 2.119-.306 2.918-.92.8-.612 1.2-1.399 1.2-2.358v-1.439c0-.133-.067-.2-.2-.2h-2.878c-1.2 0-2.146.227-2.838.68-.667.453-1 1.092-1 1.918 0 .72.253 1.293.76 1.72.506.4 1.186.599 2.038.599Zm30.441 4.317c-2.078 0-3.917-.426-5.516-1.279-1.572-.853-2.798-2.039-3.678-3.558-.879-1.545-1.319-3.318-1.319-5.316v-8.555c0-1.972.44-3.717 1.319-5.236a9.002 9.002 0 0 1 3.678-3.518c1.599-.853 3.438-1.28 5.516-1.28 2.106 0 3.944.427 5.517 1.28 1.599.826 2.838 1.999 3.717 3.518.88 1.519 1.32 3.264 1.32 5.236v8.555c0 1.998-.44 3.77-1.32 5.316-.879 1.546-2.118 2.745-3.717 3.598-1.573.826-3.411 1.24-5.517 1.24Zm0-4.837c1.466 0 2.652-.466 3.558-1.399.906-.933 1.359-2.172 1.359-3.717v-8.795c0-1.545-.453-2.785-1.359-3.717-.879-.96-2.065-1.44-3.558-1.44-1.465 0-2.651.48-3.557 1.44-.88.932-1.319 2.172-1.319 3.717v8.795c0 1.545.439 2.785 1.319 3.717.906.933 2.092 1.4 3.557 1.4Zm32.064-10.633c.479 1.36.719 2.958.719 4.797 0 1.839-.253 3.505-.759 4.997-.613 1.705-1.586 3.065-2.918 4.077-1.306.986-2.932 1.48-4.877 1.48-1.919 0-3.411-.667-4.477-2-.054-.08-.107-.106-.16-.08-.054.027-.08.08-.08.16v8.555c0 .133-.054.24-.16.32a.38.38 0 0 1-.32.16h-4.677a.499.499 0 0 1-.36-.16.432.432 0 0 1-.12-.32V17.908c0-.133.04-.24.12-.32a.499.499 0 0 1 .36-.16h4.677a.38.38 0 0 1 .32.16c.106.08.16.187.16.32v1.32c0 .08.026.133.08.16.053 0 .106-.027.16-.08 1.119-1.466 2.665-2.2 4.637-2.2 1.838 0 3.424.52 4.757 1.56 1.359 1.013 2.331 2.438 2.918 4.277Zm-6.116 8.954c.666-1.039.999-2.451.999-4.237 0-1.679-.28-3.011-.84-3.997-.612-1.146-1.598-1.72-2.958-1.72-1.225 0-2.145.574-2.758 1.72-.559.96-.839 2.305-.839 4.037 0 1.786.293 3.171.879 4.157.613 1.066 1.519 1.6 2.718 1.6 1.2 0 2.132-.52 2.799-1.56Zm21.48-10.433a.5.5 0 0 1-.16.36.433.433 0 0 1-.32.12h-3.838c-.133 0-.199.066-.199.2v8.474c0 .88.173 1.533.519 1.959.373.426.96.64 1.759.64h1.319a.38.38 0 0 1 .32.16.38.38 0 0 1 .16.32v3.797c0 .293-.16.466-.48.52a58.18 58.18 0 0 1-2.398.08c-2.212 0-3.864-.36-4.957-1.08-1.093-.746-1.652-2.132-1.679-4.157V22.146c0-.134-.066-.2-.2-.2h-2.278a.585.585 0 0 1-.36-.12.584.584 0 0 1-.12-.36v-3.558c0-.133.04-.24.12-.32a.497.497 0 0 1 .36-.16h2.278c.134 0 .2-.066.2-.2v-4.756c0-.133.04-.24.12-.32a.499.499 0 0 1 .36-.16h4.477a.38.38 0 0 1 .32.16c.106.08.16.187.16.32v4.757c0 .133.066.2.199.2h3.838a.38.38 0 0 1 .32.16c.106.08.16.186.16.32v3.557Zm5.631-6.356c-.906 0-1.665-.293-2.278-.88-.586-.612-.88-1.372-.88-2.278 0-.932.294-1.692.88-2.278.586-.587 1.346-.88 2.278-.88.933 0 1.693.293 2.279.88.586.586.879 1.346.879 2.278 0 .906-.306 1.666-.919 2.279-.586.586-1.333.88-2.239.88Zm-2.398 22.865a.586.586 0 0 1-.36-.12.584.584 0 0 1-.12-.36V17.869c0-.133.04-.24.12-.32a.499.499 0 0 1 .36-.16h4.677a.38.38 0 0 1 .32.16c.106.08.16.187.16.32v19.628a.5.5 0 0 1-.16.36.433.433 0 0 1-.32.12h-4.677Zm31.535-20.866c2.079 0 3.704.626 4.877 1.879 1.172 1.252 1.759 3.011 1.759 5.276v13.232a.5.5 0 0 1-.16.36.433.433 0 0 1-.32.12h-4.677a.586.586 0 0 1-.36-.12.584.584 0 0 1-.12-.36V25.503c0-1.092-.28-1.958-.839-2.598-.56-.64-1.306-.96-2.239-.96-.933 0-1.692.32-2.278.96-.587.64-.88 1.493-.88 2.558v12.033a.496.496 0 0 1-.16.36.43.43 0 0 1-.319.12h-4.637a.582.582 0 0 1-.36-.12.584.584 0 0 1-.12-.36V25.503c0-1.066-.293-1.918-.88-2.558-.586-.666-1.345-1-2.278-1-.853 0-1.572.254-2.159.76-.559.507-.892 1.213-.999 2.119v12.672a.496.496 0 0 1-.16.36.431.431 0 0 1-.32.12h-4.677a.581.581 0 0 1-.359-.12.584.584 0 0 1-.12-.36V17.908c0-.133.04-.24.12-.32a.495.495 0 0 1 .359-.16h4.677a.38.38 0 0 1 .32.16.38.38 0 0 1 .16.32v1.56c0 .08.027.133.08.16.053.026.106 0 .16-.08 1.092-1.626 2.785-2.44 5.077-2.44 1.332 0 2.491.28 3.477.84a5.595 5.595 0 0 1 2.319 2.399c.08.16.173.16.28 0 .586-1.093 1.372-1.906 2.358-2.439 1.013-.533 2.145-.8 3.398-.8Zm12.83-1.999c-.906 0-1.665-.293-2.278-.88-.587-.612-.88-1.372-.88-2.278 0-.932.293-1.692.88-2.278.586-.587 1.345-.88 2.278-.88s1.692.293 2.279.88c.586.586.879 1.346.879 2.278 0 .906-.306 1.666-.919 2.279-.587.586-1.333.88-2.239.88Zm-2.398 22.865a.586.586 0 0 1-.36-.12.584.584 0 0 1-.12-.36V17.869c0-.133.04-.24.12-.32a.499.499 0 0 1 .36-.16h4.677a.38.38 0 0 1 .32.16.38.38 0 0 1 .159.32v19.628a.498.498 0 0 1-.159.36.433.433 0 0 1-.32.12h-4.677Zm8.11 0a.586.586 0 0 1-.36-.12.584.584 0 0 1-.12-.36V33.22c0-.214.08-.414.24-.6l8.994-9.874c.133-.16.107-.24-.08-.24h-8.434a.584.584 0 0 1-.36-.12.584.584 0 0 1-.12-.36v-4.117c0-.133.04-.24.12-.32a.497.497 0 0 1 .36-.16h14.95a.38.38 0 0 1 .32.16c.106.08.16.187.16.32v4.238c0 .186-.08.386-.24.6l-9.274 9.873c-.107.16-.08.24.08.24h9.154a.38.38 0 0 1 .32.16c.106.08.16.186.16.32v4.157a.5.5 0 0 1-.16.36.433.433 0 0 1-.32.12h-15.39Zm36.415-12.392c.16 1.013.213 2.146.16 3.398-.027.32-.2.48-.52.48h-12.352c-.16 0-.213.067-.16.2.08.533.227 1.066.44 1.599.693 1.492 2.105 2.238 4.237 2.238 1.706-.026 3.052-.72 4.038-2.078.106-.16.226-.24.359-.24.08 0 .174.053.28.16l2.878 2.838c.134.133.2.253.2.36 0 .053-.053.16-.16.32-.879 1.092-2.012 1.945-3.397 2.558-1.386.586-2.905.88-4.557.88-2.292 0-4.238-.52-5.837-1.56-1.572-1.04-2.705-2.491-3.398-4.357-.559-1.332-.839-3.078-.839-5.237 0-1.465.2-2.758.6-3.877.613-1.892 1.679-3.398 3.198-4.517 1.545-1.12 3.371-1.679 5.476-1.679 2.665 0 4.797.773 6.396 2.319 1.626 1.545 2.612 3.61 2.958 6.195Zm-9.314-3.637c-1.679 0-2.785.786-3.318 2.358-.106.347-.2.773-.28 1.28 0 .133.067.2.2.2h6.916c.16 0 .213-.067.16-.2-.134-.773-.2-1.146-.2-1.12-.24-.8-.666-1.412-1.279-1.839-.587-.453-1.32-.68-2.199-.68Z"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M.382 32.961a2.59 2.59 0 0 0 .02 2.74L9.98 50.81a2.59 2.59 0 0 0 2.932 1.094l27.638-8.292a2.59 2.59 0 0 0 1.608-3.565L24.391 1.506c-.867-1.88-3.479-2.034-4.56-.27L.38 32.961Zm23.537-22.644c-.378-.874-1.657-.74-1.844.194l-6.84 34.059a.971.971 0 0 0 1.23 1.122l19.095-5.7a.971.971 0 0 0 .614-1.316L23.92 10.316Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Sanity',
      url: 'https://www.sanity.io/',
      logo: (
        <svg
          className="w-40"
          viewBox="0 0 314 63"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M291.14 38.6545V61.6792H278.499V38.6545" fill="#C8C8C8" />
          <path
            d="M278.499 38.6545L299.889 1.00171H313.316L291.14 38.6545H278.499Z"
            fill="white"
          />
          <path
            d="M278.499 38.6545L256.515 1.00171H270.345L285.239 26.8042L278.499 38.6545Z"
            fill="#C8C8C8"
          />
          <path
            d="M233.839 22.1992V61.6793H221.007V28.9395L233.839 22.1992Z"
            fill="#C8C8C8"
          />
          <path
            d="M221.007 28.9059L253.538 12.0704L248.042 2.67041L221.007 16.0311V28.9059Z"
            fill="#A8A8A8"
          />
          <path
            d="M221.007 12.0705H201.404V1.00171H247.064L253.538 12.0705H233.839H221.007Z"
            fill="white"
          />
          <path
            d="M194.047 1.00171H181.311V61.6898H194.047V1.00171Z"
            fill="white"
          />
          <path
            d="M129.39 19.0729V61.6793H117.153V1.00171L129.39 19.0729Z"
            fill="#C8C8C8"
          />
          <path
            d="M131.282 1.00171L158.231 42.4568V61.6793L117.153 1.00171H131.282Z"
            fill="white"
          />
          <path
            d="M158.231 39.341V1.00171H170.468V61.6792H158.231V39.341Z"
            fill="#C8C8C8"
          />
          <path
            d="M62.1167 62.6721L92.1019 46.8169L88.4049 37.1338L68.6642 46.4437L62.1167 62.6721Z"
            fill="#A8A8A8"
          />
          <path
            d="M80.6569 16.7177L62.1166 62.6721L52.5806 54.3705L74.6717 1.00171L80.6569 16.7177Z"
            fill="#C8C8C8"
          />
          <path
            d="M74.6719 1.00171H87.3119L110.69 61.6792H97.7519L74.6719 1.00171Z"
            fill="white"
          />
          <path
            d="M5.1346 8.00415C5.1346 16.4537 10.3863 21.481 20.9003 24.132L32.0416 26.6986C41.9922 28.9694 48.0518 34.6093 48.0518 43.7981C48.1292 47.8012 46.8193 51.7091 44.3416 54.8669C44.3416 45.6992 39.5683 40.7457 28.055 37.7673L17.1157 35.2958C8.35579 33.3102 1.5945 28.6736 1.5945 18.6927C1.5484 14.8383 2.7938 11.0783 5.1346 8.00415Z"
            fill="white"
          />
          <path
            d="M37.4954 41.5484C42.2475 44.5691 44.3311 48.7938 44.3311 54.8563C40.3977 59.8626 33.4875 62.672 25.3655 62.672C11.6941 62.672 2.1262 55.9864 0 44.3684H13.1292C14.8196 49.7021 19.2952 52.1736 25.2698 52.1736C32.5626 52.1736 37.4104 48.308 37.506 41.5273"
            fill="#C8C8C8"
          />
          <path
            d="M11.9596 20.5305C9.78965 19.2493 8.00945 17.4083 6.80775 15.2028C5.60605 12.9974 5.02795 10.5098 5.13455 8.00423C8.92985 3.04023 15.5316 0.0090332 23.5793 0.0090332C37.5058 0.0090332 45.5641 7.31773 47.5521 17.6049H34.9225C33.5298 13.5492 30.0429 10.3912 23.6856 10.3912C16.8924 10.3912 12.2573 14.3202 11.9915 20.5305"
            fill="#C8C8C8"
          />
        </svg>
      ),
    },
  ],
}
