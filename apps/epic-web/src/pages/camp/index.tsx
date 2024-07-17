import React from 'react'
import Layout from 'components/app/layout'
import {CalendarFold, MountainSnow} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {cn} from '@skillrecordings/ui/utils/cn'

const EpicWebCampPage = () => {
  return (
    <Layout className="bg-[#080E16] text-[#DDD8DB]">
      <main className="">
        <header className="relative mx-auto flex w-full max-w-screen-lg items-center justify-between px-3 pb-10 pt-16">
          <div>
            <h1 className="mb-3 flex flex-col items-center text-center md:items-start md:text-left">
              <span className="text-3xl text-brand-green">Epic Web</span>
              <span className="text-5xl font-semibold">Camp 2024</span>
            </h1>
            <h2 className="mb-10 text-balance text-xl">
              Epic connections with Epic people in Epic mountains.
            </h2>
            <ul className="mb-10 flex flex-col gap-2">
              <li className="inline-flex items-center gap-2">
                <CalendarFold className="text-[#93D7A6]" /> September 11th—12th
                2024
              </li>
              <li className="inline-flex items-center gap-2">
                <MountainSnow className="text-[#93D7A6]" /> Aspen Grove, Utah
              </li>
            </ul>
            <Link
              href="/"
              className="relative inline-flex items-center justify-center rounded bg-brand-green px-10 py-3 pr-12 font-semibold text-black"
            >
              Book Now{' '}
              <svg
                aria-hidden="true"
                className="absolute -right-px top-0"
                width="37"
                height="52"
                viewBox="0 0 37 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.44 0L21.49 14.95H29.18L13.98 30.14H21.23L0 51.37H36.44V0Z"
                  fill="#080E16"
                />
              </svg>
            </Link>
          </div>
          <div className="relative overflow-hidden ">
            <div
              className='absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
              aria-hidden="true"
            />
            <div
              className='absolute h-full w-full before:absolute before:-bottom-2.5 before:-right-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-bottom-0.5 after:-right-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
              aria-hidden="true"
            />
            <Image
              width={662}
              height={441}
              placeholder="blur"
              src={require('../../../public/assets/camp/epic-web-camp-24.jpg')}
              alt="Epic Web Camp 2024"
              className=""
            />
          </div>
        </header>
        <section
          aria-label="You are invited!"
          id="about"
          className="mx-auto flex w-full max-w-screen-lg items-center justify-center px-3 "
        >
          <div className="relative flex w-full items-center justify-center overflow-hidden bg-[#141A22] py-20">
            <div
              className='absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
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
          className="relative mx-auto flex w-full max-w-screen-lg items-start justify-between gap-8 px-3 py-16"
        >
          <h2 className="sticky top-20 text-3xl font-semibold text-brand-green">
            Location
          </h2>
          <div className="prose w-full max-w-xl dark:prose-invert sm:prose-lg">
            <div className="not-prose relative overflow-hidden">
              <div
                className='absolute h-full w-full before:absolute before:-left-2.5 before:-top-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-left-0.5 after:-top-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
                aria-hidden="true"
              />
              <div
                className='absolute h-full w-full before:absolute before:-bottom-2.5 before:-right-2.5 before:h-5 before:w-5 before:rotate-45 before:bg-[#080E16] before:content-[""] after:absolute after:-bottom-0.5 after:-right-0.5 after:h-1 after:w-1 after:rotate-45 after:bg-brand-green'
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
          className="mx-auto w-full max-w-screen-lg px-3 py-16"
        >
          <h2 className="mb-10 text-3xl font-semibold text-brand-green">
            Sponsors
          </h2>
          <div className="flex items-center gap-5">
            {new Array(7).fill({}).map(() => (
              <div className="h-12 w-32 bg-white/5" />
            ))}
          </div>
        </section>
        <section
          aria-label="Workshop"
          id="workshop"
          className="mx-auto w-full max-w-screen-lg px-3 py-16"
        >
          <div className="flex items-start justify-between gap-10">
            <div className="prose max-w-xl dark:prose-invert sm:prose-lg prose-a:text-foreground prose-a:underline dark:prose-a:text-foreground">
              <h2 className="not-prose mb-10 text-3xl text-brand-green">
                Workshop
              </h2>
              <p>
                As an optional add-on, join Kent C. Dodds for 6 hours of his{' '}
                <a
                  target="_blank"
                  rel="noopener"
                  href="https://advanced-react-patterns.epicweb.dev/"
                >
                  Advanced React Patterns workshop
                </a>
                .
              </p>
              <p>
                You’re at the stage in your React experience where people turn
                to you for the abstractions you need in your application. You’ve
                got a set of UI elements in your designs that are unique to your
                application and you either need to build it or customize an off
                the shelf UI library. You may think you’re free and clear if you
                just customize a UI library, but just like with everything, if
                you don’t understand how it works, you’re doomed to “hold it
                wrong.”
              </p>
              <p>
                And if you can’t find something that fits your use case, I’m
                afraid to say you’re doomed to make a lot of mistakes without
                the right tools and patterns.
              </p>
              <p>
                And you’ll likely have a chance to do a bit of both building and
                customizing in your apps. So this workshop will be invaluable to
                you.
              </p>
              <p>
                Oh, and this isn’t just about abstractions either. We’ll also
                cover good patterns you can use in your regular app code as
                well.
              </p>
              <p>In this workshop we’ll cover topics like:</p>
              <ul>
                <li>Improve perf and reduce prop drilling with composition</li>
                <li>Managing user focus with flushSync</li>
                <li>Make components work together with compound components</li>
                <li>Handle common use cases for hooks with prop getters</li>
                <li>Invert control with state reducers and control props</li>
                <li>
                  Granting ultimate layout flexibility and behavior reuse with
                  slots
                </li>
              </ul>
              <h3>Prerequisites:</h3>
              <ul>
                <li>
                  Read my blog post{' '}
                  <a
                    target="_blank"
                    rel="noopener"
                    href="https://kentcdodds.com/blog/inversion-of-control"
                  >
                    Inversion of Control
                  </a>
                </li>
              </ul>
              <p>
                Note: actual covered material may vary depending on time
                constraints and questions asked.
              </p>
            </div>
            <div className="sticky top-20 border-t-2 border-brand-green bg-white/5">
              <div className="flex items-center gap-5 p-8 pt-6">
                <svg
                  width="72"
                  height="76"
                  className="flex-shrink-0"
                  viewBox="0 0 72 76"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M36 44.9272C39.6024 44.9272 42.5227 41.9773 42.5227 38.3384C42.5227 34.6995 39.6024 31.7495 36 31.7495C32.3976 31.7495 29.4772 34.6995 29.4772 38.3384C29.4772 41.9773 32.3976 44.9272 36 44.9272Z"
                    fill="#61DAFB"
                  />
                  <path
                    d="M36 51.8377C55.33 51.8377 71 45.7939 71 38.3386C71 30.8833 55.33 24.8395 36 24.8395C16.67 24.8395 1 30.8833 1 38.3386C1 45.7939 16.67 51.8377 36 51.8377Z"
                    stroke="#61DAFB"
                  />
                  <path
                    d="M24.4267 45.0881C34.0917 61.998 47.1083 72.6844 53.5 68.9567C59.8917 65.229 57.2382 48.499 47.5732 31.5891C37.9083 14.6791 24.8917 3.99282 18.5 7.72049C12.1083 11.4482 14.7618 28.1782 24.4267 45.0881Z"
                    stroke="#61DAFB"
                  />
                  <path
                    d="M24.4267 31.5891C14.7618 48.499 12.1083 65.229 18.5 68.9567C24.8917 72.6844 37.9083 61.998 47.5732 45.0881C57.2382 28.1782 59.8917 11.4482 53.5 7.72049C47.1083 3.99282 34.0917 14.6791 24.4267 31.5891Z"
                    stroke="#61DAFB"
                  />
                </svg>

                <h3 className="text-2xl font-semibold text-foreground">
                  Advanced React Patterns Workshop
                </h3>
              </div>
              <div className="pr-8">
                <Image
                  src={require('../../../public/assets/camp/kent-workshop.jpg')}
                  width={381}
                  height={508}
                  alt="Kent C. Dodds"
                  className="rounded-none"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          aria-label="Activities"
          id="activities"
          className="relative mx-auto flex w-full max-w-screen-lg items-start justify-between px-3 py-16"
        >
          <h2 className="sticky top-24 text-3xl font-semibold text-brand-green">
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
            <h3>UtahJS Conf</h3>
            <p>
              Another optional add-on is a discounted ticket to{' '}
              <a
                target="_blank"
                rel="noopener"
                href="https://advanced-react-patterns.epicweb.dev/"
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
          className="mx-auto w-full max-w-screen-lg px-3 py-16"
        >
          <div className="flex w-full items-start justify-between">
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
          <div className="mt-16 flex flex-col divide-y divide-border border-t">
            {schedule.map(({date, events}) => (
              <div
                key={date}
                className="relative grid grid-cols-12 items-start justify-between py-16"
              >
                <h3 className="col-span-5 text-2xl font-semibold">{date}</h3>
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
          className="mx-auto flex w-full max-w-screen-lg items-center justify-between px-3 py-16"
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
          className="mx-auto flex w-full max-w-screen-lg items-center justify-center px-3 py-16"
        >
          <h3 className="mb-3 flex flex-col items-center text-center">
            <span className="text-3xl text-brand-green">Epic Web</span>
            <span className="text-5xl font-semibold">Camp 2024</span>
          </h3>
        </section>
        <section aria-label="Code of Conduct" id="code-of-conduct">
          https://www.epicweb.dev/conf/code-of-conduct
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
        activity: 'Activities until lunch',
      },
      {
        time: '12:00pm',
        activity: 'Lunch',
      },
      {
        time: '1:00pm-4:00pm',
        activity: 'Workshop part 1 / Activities',
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
        activity: 'Workshop part 2 / Activities',
      },
      {
        time: '12:00pm',
        activity: 'Lunch',
      },
      {
        time: '12:00pm-4:00pm',
        activity: 'Activities until checkout',
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
