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
          className="mx-auto w-full max-w-screen-lg px-5 py-16 sm:px-3"
        >
          <h2 className="mb-10 text-3xl font-semibold text-brand-green">
            Sponsors
          </h2>
          <div className="flex items-center gap-5">
            {new Array(7).fill({}).map(() => (
              <div className="h-12 w-32 bg-gray-100 dark:bg-white/5" />
            ))}
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
              through the course of these activities (both formal and informal) is
              the primary objective of Epic Web Camp.
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
        <section
          aria-label="Book Epic Web Camp"
          id="book"
          className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-5 px-3 py-16 sm:py-24"
        >
          <h3 className="mb-3 flex flex-col items-center text-center">
            <span className="text-3xl text-brand-green">Epic Web</span>
            <span className="text-5xl font-semibold">Camp 2024</span>
          </h3>
          <BookNowButton>Join Us</BookNowButton>
        </section>
        <section
          aria-label="Code of Conduct"
          id="code-of-conduct"
          className="mx-auto flex w-full max-w-screen-lg items-center justify-center border-t px-3 py-16"
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
