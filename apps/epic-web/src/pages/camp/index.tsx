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
        viewBox="0 0 1303 326"
        fill="none"
      >
        <title>Turso.tech</title>
        <path
          d="M466.914 121.417V298.41H412.464V121.417H374.643V69.9045H504.408V121.417H466.914Z"
          fill="currentColor"
        />
        <path
          d="M521.683 207.272V69.9045H576.132V207.272C576.132 233.028 588.195 250.859 614.931 250.859C640.691 250.859 653.08 232.697 653.08 206.941V69.9045H707.526V206.942C707.526 262.087 676.228 302.703 614.28 302.703C550.7 302.703 521.683 264.397 521.683 207.272Z"
          fill="currentColor"
        />
        <path
          d="M854.24 194.063L905.754 298.409H847.392L803.054 204.629H788.379V298.409H734.255V69.9045H811.855C859.13 69.9045 882.935 94.671 882.935 137.927C882.935 163.354 872.498 182.836 854.24 194.063ZM788.379 117.454V159.721H807.294C819.682 159.721 826.853 151.136 826.853 138.257C826.853 125.709 819.354 117.454 807.294 117.454H788.379Z"
          fill="currentColor"
        />
        <path
          d="M979.447 152.127L1007.81 163.354C1037.15 175.571 1054.44 195.384 1054.44 229.396C1054.44 275.625 1022.15 302.702 976.838 302.702C912.278 302.702 900.546 260.105 902.498 226.754H954.012C953.362 241.283 958.902 255.483 976.838 255.483C989.227 255.483 998.356 248.548 998.356 235.34C998.356 222.462 989.227 216.188 974.557 210.574C963.141 205.951 951.732 201.658 939.343 195.385C916.517 183.497 904.457 161.043 904.457 133.305C904.457 93.3496 933.145 65.6119 977.16 65.6119C1030.31 65.6119 1049.55 96.3214 1047.26 136.938H997.055C997.377 122.739 990.206 112.832 977.489 112.832C965.1 112.832 958.902 120.426 958.902 130.003C958.902 139.579 964.121 146.183 979.447 152.127Z"
          fill="currentColor"
        />
        <path
          d="M1183.22 65.6119C1256.91 65.6119 1302.89 116.794 1302.89 183.497C1302.89 250.199 1257.23 302.702 1184.85 302.702C1111.17 302.702 1066.18 251.52 1066.18 184.487C1066.18 118.115 1113.78 65.6119 1183.22 65.6119ZM1184.53 251.19C1224.31 251.19 1245.82 221.471 1245.82 184.157C1245.82 146.844 1223 117.125 1184.2 117.125C1144.43 117.125 1123.23 146.844 1123.23 184.157C1123.23 221.801 1147.03 251.19 1184.53 251.19Z"
          fill="currentColor"
        />
        <path
          d="M306.974 10.9017L299.346 5.19527L284.27 21.3339L272.183 3.87493L265.23 7.06744L274.797 31.4735L270.367 36.216L236.028 0L228.245 3.85641L258.782 69.4898L230.169 79.5494H229.487L213.975 61.1026L198.451 79.5652H108.521L92.9966 61.1026L77.4406 79.6031H76.9604L48.1897 69.4885L78.7288 3.85641L70.9454 0L36.6051 36.2151L32.1752 31.4726L41.7435 7.06655L34.7906 3.87401L22.7039 21.333L7.62807 5.19527L0 10.9017L23.4697 50.0686L11.3912 62.8063L15.6141 95.0447L43.5877 105.729L43.5322 119.668H17.043V125.684L27.2966 140.311L43.5322 146.188V240.805L85.03 302.565L94.5406 325.72L109.486 303.924L124.977 325.72L138.539 303.924L153.486 325.72L168.432 303.924L181.995 325.72L197.485 303.924L212.43 325.72L221.941 302.565L263.439 240.805V146.188L279.674 140.311L289.928 125.684V119.668H263.439L263.479 105.693L291.357 95.0454L295.58 62.8072L283.501 50.0695L306.974 10.9017ZM185.788 264.93H99.6503L110.417 243.011L121.185 264.93L131.951 250.24L142.718 264.93L153.486 250.239L164.253 264.93L175.021 250.24L185.788 264.93L196.554 243.011L207.322 264.93H185.788ZM238.521 164.632L193.731 179.355L191.801 220.899L153.438 229.4L115.076 220.899L113.146 179.355L68.3558 164.632V142.455L126.259 158.862L125.553 214.873H181.322L180.617 158.862L238.52 142.455L238.521 164.632Z"
          fill="currentColor"
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
]
