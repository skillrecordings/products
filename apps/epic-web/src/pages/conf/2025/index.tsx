import React from 'react'
import Layout from 'components/app/layout'
import {motion, useReducedMotion} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import HeroPlanetImage from '../../../../public/assets/conf/conf-hero.jpg'
import {ChevronRightIcon, PlayIcon} from '@heroicons/react/solid'
import {Button} from '@skillrecordings/ui'
import {track} from 'utils/analytics'
import {DocumentIcon, StarIcon} from '@heroicons/react/outline'
import {type Talk} from 'lib/talks'
import {useMeasure} from 'react-use'
import {cn} from '@skillrecordings/ui/utils/cn'
import MuxPlayer from '@mux/mux-player-react'

export const IS_PAST_CONF_25 = false
const CONF_25_TITO_URL = 'https://ti.to/epicweb/epicweb-conf-2025'
const CONF_25_SESSIONIZE_URL = 'https://sessionize.com/epicweb-conf-2025/'

const CK_CONF_2025_FIELD = {
  [`conf_2025`]: new Date().toISOString().slice(0, 10),
}
// const HOTEL_PROMO_CODE = 'W14'

export type Speaker = {
  video?: {
    _id: string
    _type: 'tip'
    slug: string
    muxPlaybackId: string
    transcript: {text: string}
    videoResourceId: string
    poster: string
  }
  id: string
  bio: string
  firstName: string
  sessions: {
    id: string
    name: string
  }[]
  lastName: string
  fullName: string
  tagLine: string
  profilePicture: string
  isTopSpeaker: boolean
}

type Session = {
  id: string
  title: string
  description: string
  startsAt: string
  endsAt: string
  speakers: {name: string; id: string}[]
  talk?: Talk | null
}

type Room = {
  id: number
  name: string
  sessions: Session[]
}

type Day = {
  date: string
  rooms: Room[]
}

export type Schedule = Day[]

const ConfPage: React.FC = () => {
  return (
    <Layout
      className="bg-foreground pt-16 text-background dark:bg-background dark:text-foreground"
      meta={{
        title: 'Epic Web Conf 2025',
        titleAppendSiteName: false,
        description:
          'The Full Stack Web Development Conference of Epic proportions.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1731634239/ogImage-2025conf.jpg',
        },
      }}
    >
      {/* <EventJsonLd
        name="Epic Web Conf 2025"
        startDate="2025-04-10T08:00:00-07:00"
        endDate="2025-04-11T17:00:00-07:00"
        location={{
          name: 'Hilton Salt Lake City Center',
          address: {
            streetAddress: '2175 Sidewinder Dr',
            addressLocality: 'Park City',
            postalCode: '84060',
            addressRegion: 'UT',
            addressCountry: 'US',
          },
        }}
        offers={[
          {
            seller: {name: 'epicweb.dev'},
            price: '300.00',
            priceCurrency: 'USD',
            url: CONF_24_TITO_URL,
            validFrom: '2024-01-01T08:00',
          },
        ]}
        performer={[
          {
            name: 'Epic Web',
            url: 'https://epic-web.dev',
          },
        ]}
        image="https://res.cloudinary.com/epic-web/image/upload/v1705997895/conf-card_2x.jpg"
        description="The Full Stack Web Development Conference of Epic proportions."
      /> */}
      <EarlyBirdMarquee />
      <Header />
      <Body />

      <Footer />
    </Layout>
  )
}

export default ConfPage

const Body = () => {
  let epicTalkIdeas = [
    'Blow our minds with cool demos',
    'Show off what you’ve learned at scale',
    'Help us be better professionals, team mates, and community members',
    'Help us find a job or build our own company',
    'Show us how you made something fast',
    'Inspire us to do more with AI than build a chatbot',
  ]

  const Section = ({
    title,
    children,
    cta,
    position = 0,
    image,
  }: {
    title: string
    children: React.ReactNode
    position?: number
    image?: string
    cta?: {
      href: string
      label: React.ReactNode
      track?: string
    }
  }) => {
    return (
      <section aria-label={title} className="relative px-5">
        <div
          className={cn('flex flex-col items-start sm:flex-row sm:gap-16', {
            'sm:flex-row-reverse': position % 2 === 1,
          })}
        >
          {image && (
            <div className="mx-auto flex w-full flex-shrink-0 items-center sm:mx-0 sm:max-w-[400px]">
              <Image
                src={image}
                width={500}
                height={500}
                quality={100}
                className="rounded-lg"
                alt=""
                aria-hidden="true"
              />
            </div>
          )}
          <div className="-mt-10 sm:mt-0">
            <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <div className="prose prose-invert w-full max-w-none sm:prose-lg prose-p:text-[#D6DEFF] prose-li:text-[#D6DEFF] sm:prose-p:text-balance">
              {children}
            </div>
            {cta && (
              <Button
                asChild
                className="group relative mt-8 inline-flex h-12 items-center justify-center overflow-hidden border border-white/10 bg-white/10 text-base font-medium shadow-soft-lg transition duration-300 ease-in-out"
                size="lg"
              >
                <Link
                  href={cta.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={() => {
                    track(`clicked ${cta.track || cta.label}`, {
                      title: 'conf2025',
                      type: 'event',
                      location: 'body',
                    })
                  }}
                >
                  {cta.label}
                  <ChevronRightIcon className="-mr-2 ml-2 w-4 text-gray-500 transition duration-300 ease-in-out group-hover:text-white" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }

  const promoVideo = 'deoAaA7OUZDPrLjXc013MQaTcTwC9kAY3Pmf2JmF01TOs'

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-16 sm:gap-32">
      <div className="col-span-4 flex w-full items-center justify-center p-5 sm:p-8 md:pl-0">
        <MuxPlayer
          playbackId={promoVideo}
          className="w-full rounded shadow-xl"
          accentColor="#3b82f6"
          poster={`https://image.mux.com/${promoVideo}/thumbnail.jpg?time=3`}
        />
      </div>
      {!IS_PAST_CONF_25 && <Location />}
      <Section
        position={0}
        title="Become a Speaker"
        image="https://res.cloudinary.com/epic-web/image/upload/v1728472122/conf25/speaker_2x.jpg"
        cta={{href: CONF_25_SESSIONIZE_URL, label: 'Submit a Talk'}}
      >
        <p>
          We want to see how you are making the web{' '}
          <span className="font-bold">EPIC</span>. This conference is about
          inspiring us to do and be more.
        </p>
        <p>
          Here are some general categories of what would make a great talk at
          Epic Web Conf 2025:
        </p>
        <ol className=" ">
          {epicTalkIdeas.map((idea, index) => (
            <li key={index}>{idea}</li>
          ))}
        </ol>
      </Section>
      <Section
        position={1}
        title="Become an Attendee"
        image="https://res.cloudinary.com/epic-web/image/upload/v1728471924/conf25/attendee_2x.jpg"
        cta={{href: CONF_25_TITO_URL, label: 'Buy Early Bird Tickets'}}
      >
        <p>
          Epic Web Conf is your opportunity to join other full stack web
          developers from all over the world to collaborate on the present and
          future state of the art of building the absolute best user and
          developer experiences possible.
        </p>
        <p>
          Right now we are offering early bird tickets, this is{' '}
          <strong>the cheapest</strong> the price will be and the price goes up
          soon.
        </p>
      </Section>
      <Section
        position={2}
        title="Become a Sponsor"
        image="https://res.cloudinary.com/epic-web/image/upload/v1728472065/conf25/sponsors_2x.jpg"
        cta={{
          href: 'mailto:conf@epicweb.dev?subject=Sponsoring Epic Web Conf 2025',
          label: 'Sponsor Epic Web Conf 2025',
          track: 'become a sponsor',
        }}
      >
        <p>Epic Web Conf is made possible by the support of our sponsors.</p>
        <p>
          <Link href="/conf/2024" target="_blank">
            Last year
          </Link>{' '}
          was EPIC and we'd love to parter with you to make 2025 even better.
        </p>
      </Section>
      <Sponsors />
    </div>
  )
}

const Header = () => {
  return (
    <header className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#080B16]">
      <div className="relative z-10 mx-auto w-full max-w-screen-lg px-5 pb-16 pt-16 sm:pb-32 sm:pt-40">
        <h1 className="max-w-xl text-balance text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          <span className="font-normal">Epic Web</span> Conference 2025
        </h1>
        <h2 className="max-w-sm pt-5 text-xl text-[#93A1D7] lg:max-w-full">
          The Full Stack Web Development Conference of Epic proportions
        </h2>
        <hr className="relative z-0 mb-5 mt-12 max-w-[200px] border-[#202537] sm:max-w-lg lg:max-w-xl" />
        <div className="grid max-w-sm grid-cols-1 items-center gap-5 sm:grid-cols-2 lg:flex lg:max-w-lg lg:gap-14">
          <div>
            <div className="font-mono text-sm uppercase tracking-wide text-[#93A1D7]">
              Conference Day
            </div>
            <div className="text-lg text-[#D6DEFF]">March 26, 2025</div>
          </div>
          <div>
            <div className="font-mono text-sm uppercase tracking-wide text-[#93A1D7]">
              Workshop Day
            </div>
            <div className="text-lg text-[#D6DEFF]">March 25, 2025</div>
          </div>
          <div>
            <div className="font-mono text-sm uppercase tracking-wide text-[#93A1D7]">
              Location
            </div>
            <div className="text-lg text-[#D6DEFF]">Salt Lake City, Utah</div>
          </div>
        </div>
        <Button
          asChild
          className="relative mt-10 h-12 overflow-hidden rounded-sm bg-gradient-to-b from-amber-500 to-amber-600 text-base font-semibold tracking-tight text-amber-950 shadow-lg shadow-amber-500/20 brightness-125 transition duration-300 hover:brightness-110"
          size="lg"
        >
          {CONF_25_TITO_URL && (
            <Link
              href={CONF_25_TITO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track('clicked buy early bird tickets', {
                  title: 'conf2024',
                  type: 'event',
                  location: 'top',
                })
              }}
            >
              Buy Early Bird Tickets
              <div
                className="absolute left-0 top-0 h-full w-full"
                aria-hidden="true"
              >
                <motion.div
                  className="absolute left-0 top-0 h-full w-5 -skew-x-12 bg-white/20 blur-sm"
                  animate={{left: ['-10%', '110%'], opacity: [0, 1, 0]}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    // type: 'spring',
                    // make it feel like racing stripe
                    ease: 'circInOut',
                  }}
                />
              </div>
            </Link>
          )}
        </Button>
      </div>
      <div className="absolute -bottom-16 right-[-370px] flex items-center justify-center sm:bottom-auto sm:right-[-690px] xl:right-[-600px] 2xl:right-[-370px]">
        <Image
          priority
          src={HeroPlanetImage}
          alt=""
          aria-hidden="true"
          quality={100}
          width={1561}
          height={842}
        />
        <Image
          priority
          src={require('../../../../public/assets/conf/ship@2x.png')}
          alt=""
          aria-hidden="true"
          quality={100}
          width={326}
          height={209}
          className="absolute z-10 w-48 -translate-x-24 translate-y-20 sm:w-auto sm:-translate-x-48 sm:translate-y-28"
        />
      </div>
      <div
        className="absolute bottom-0 left-0 flex h-20 w-full bg-gradient-to-t from-foreground to-transparent dark:from-background"
        aria-hidden="true"
      />
    </header>
  )
}

const Footer = () => {
  return (
    <section className="flex flex-col items-center justify-center pt-16 sm:pt-0">
      <Button
        asChild
        className="relative z-20 mx-auto h-12 overflow-hidden rounded-sm bg-gradient-to-b from-amber-500 to-amber-600 text-base font-semibold tracking-tight text-amber-950 shadow-lg shadow-amber-500/20 brightness-125 transition duration-300 hover:brightness-110"
        size="lg"
      >
        {CONF_25_TITO_URL && (
          <Link
            href={CONF_25_TITO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track('clicked buy early bird tickets', {
                title: 'conf2024',
                type: 'event',
                location: 'top',
              })
            }}
          >
            Buy Early Bird Tickets
            <div
              className="absolute left-0 top-0 h-full w-full"
              aria-hidden="true"
            >
              <motion.div
                className="absolute left-0 top-0 h-full w-5 -skew-x-12 bg-white/20 blur-sm"
                animate={{left: ['-10%', '110%'], opacity: [0, 1, 0]}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  // type: 'spring',
                  // make it feel like racing stripe
                  ease: 'circInOut',
                }}
              />
            </div>
          </Link>
        )}
      </Button>
      {/* <Link
        href="/conf/code-of-conduct"
        className="inline-flex w-full items-center justify-center gap-1 text-center text-[#93A1D7] transition hover:brightness-125"
      >
        <DocumentIcon
          className="w-4"
          stroke="currentColor"
          aria-hidden="true"
        />
        Code of Conduct
      </Link> */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 sm:-mt-16 sm:pb-16 lg:-mt-24">
        <div className="relative z-10 mx-auto flex h-[240px] w-full max-w-screen-lg flex-col items-center justify-center sm:h-[320px]">
          <Image
            loading="eager"
            src={require('../../../../public/assets/conf/big-planet-bottom@2x.png')}
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 sm:bottom-auto"
            quality={100}
          />
          <Image
            loading="eager"
            width={153}
            height={102}
            src={require('../../../../public/assets/conf/ship2@2x.png')}
            alt=""
            aria-hidden="true"
            className="absolute bottom-24 translate-x-96"
            quality={100}
          />
          <Image
            loading="eager"
            width={255}
            height={170}
            src={require('../../../../public/assets/conf/ship3@2x.png')}
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 -translate-x-96"
            quality={100}
          />
          {/* <div
            className="absolute bottom-0 left-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-20"
            aria-hidden="true"
          /> */}
        </div>
      </div>
    </section>
  )
}

const getProfilePictureForWorkshopInstructor = (
  name: string,
  speakers: Speaker[],
) => {
  const speaker = speakers.find((s) => s.fullName === name)
  return speaker?.profilePicture as string
}

const EarlyBirdMarquee = () => {
  const GAP = 8

  const [textRef, {x, y, width: textWidth, height, top, right, bottom, left}] =
    useMeasure()

  const shouldReduceMotion = useReducedMotion()

  return (
    <Link
      href={CONF_25_TITO_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track('clicked early bird marquee', {
          title: 'conf2025',
          type: 'event',
          location: 'top',
        })
      }}
      aria-hidden="true"
      className="absolute top-12 z-20 flex w-full items-center justify-center overflow-hidden bg-gray-200 sm:top-12"
    >
      <motion.div
        className=""
        animate={!shouldReduceMotion && {x: [0, -(GAP + textWidth)]}}
        transition={{
          repeat: Infinity,
          duration: 5,
          repeatType: 'loop',
          ease: 'linear',
        }}
      >
        <div
          className={`pointer-events-none flex justify-center space-x-2 py-2 text-xs font-semibold uppercase text-gray-900`}
        >
          {new Array(13)
            .fill('Early Bird Tickets OUT NOW')
            .map((text, index) => (
              <div
                ref={textRef as any}
                className="flex flex-shrink-0 items-center gap-2"
                key={index}
              >
                {text}
                <span className="text-gray-500">✦</span>
              </div>
            ))}
        </div>
      </motion.div>
    </Link>
  )
}

const Location = () => {
  return (
    <section className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pb-16 pt-10 sm:pt-16">
      <h2 className="w-fit self-start pb-5 text-3xl font-semibold sm:text-4xl">
        Location
      </h2>
      <div className="flex flex-col items-center rounded border border-[#313646] bg-[#1E212C] lg:flex-row">
        <div className="flex max-w-md flex-col gap-5 py-6 pl-6 pr-6 sm:py-8 sm:pl-10 sm:pr-0 lg:py-14 lg:pl-16 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-[#D6DEFF]">
          <svg
            className=""
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.75 8.5C16.75 13.75 10 18.25 10 18.25C10 18.25 3.25 13.75 3.25 8.5C3.25 6.70979 3.96116 4.9929 5.22703 3.72703C6.4929 2.46116 8.20979 1.75 10 1.75C11.7902 1.75 13.5071 2.46116 14.773 3.72703C16.0388 4.9929 16.75 6.70979 16.75 8.5Z"
              stroke="#3FACFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 10.75C11.2426 10.75 12.25 9.74264 12.25 8.5C12.25 7.25736 11.2426 6.25 10 6.25C8.75736 6.25 7.75 7.25736 7.75 8.5C7.75 9.74264 8.75736 10.75 10 10.75Z"
              stroke="#3FACFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>
            The event is set in the heart of{' '}
            <strong>
              <Link
                href="https://maps.app.goo.gl/dpCVp2TtT9iNf6FKA"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Salt Lake City, Utah
              </Link>
            </strong>
            {
              ', and the free livestream will be available to reach even the most distant Epic web developers.'
            }
          </p>
          <p>
            You'll want to be here in Salt Lake City to rub shoulders with some
            of the best developers working on the web, just like you.
          </p>
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative">
            <div
              className="absolute left-0 top-0 hidden h-full w-56 bg-gradient-to-r from-[#1E212C] to-transparent lg:block"
              aria-hidden="true"
            />
            <div
              className="absolute left-0 top-0 block h-40 w-full bg-gradient-to-b from-[#1E212C] to-transparent lg:hidden"
              aria-hidden="true"
            />
            <Image
              width={554}
              height={424}
              src={require('../../../../public/assets/conf/map-venue-2025.png')}
              loading="eager"
              alt="Map showing Hilton Salt Lake City Center location"
              quality={100}
            />
          </div>
          <Link
            href="https://maps.app.goo.gl/dpCVp2TtT9iNf6FKA"
            target="_blank"
            onClick={() => {
              track('clicked venue', {
                title: 'conf2025',
                type: 'venue',
                location: 'map',
              })
            }}
            rel="noopener noreferrer"
            className="group absolute -bottom-16 flex scale-[0.8] items-center justify-center rounded bg-white text-gray-900 before:absolute before:-top-1.5 before:-ml-7 before:h-3 before:w-3 before:rotate-45 before:bg-white before:content-[''] sm:-bottom-10 sm:scale-100"
          >
            <div className="overflow-hidden rounded-l">
              <Image
                src={require('../../../../public/assets/conf/hilton-hotel.png')}
                alt="Hilton Salt Lake City Center"
                width={152}
                height={233}
                loading="eager"
                className="transition duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="px-4 py-2 pr-5 sm:px-5 sm:py-5 sm:pr-7">
              <h3 className="text-lg font-semibold leading-tight sm:text-xl sm:leading-tight">
                Hilton Salt Lake City Center
              </h3>
              <div className="mt-3 inline-flex text-sm hover:underline">
                255 S W Temple St
                <br />
                Salt Lake City, UT 84101
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

const Sponsors = () => {
  const {platinum, gold, silver, community} = sponsorsData
  return (
    <section
      id="sponsors"
      aria-label="sponsors"
      className="mx-auto flex w-full max-w-screen-xl scale-90 flex-col items-center justify-center gap-10 pb-24 pt-8 lg:scale-100 [&_p]:text-[#93A1D7]"
    >
      <h2 className="pb-5 text-3xl font-semibold sm:text-4xl">Sponsors</h2>
      {platinum.length > 0 && (
        <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16 sm:px-10">
          <p className="w-20 font-mono text-sm uppercase">Platinum:</p>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-12">
            {platinum.map(
              (s: {name: string; url: string; logo: React.JSX.Element}) => {
                return (
                  <Link
                    href={s.url}
                    onClick={() => {
                      track('clicked platinum sponsor', {
                        title: 'conf2024',
                        type: 'sponsor',
                        location: s.name,
                      })
                    }}
                    key={s.name}
                    className="flex items-center justify-center opacity-90 transition hover:opacity-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="not-prose">{s.logo}</div>
                  </Link>
                )
              },
            )}
          </div>
        </div>
      )}
      {gold.length > 0 && (
        <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16">
          <p className="font-mono text-sm uppercase">Gold:</p>
          <div className="flex items-center gap-5 sm:gap-12">
            {gold.map((s) => {
              return (
                <Link
                  href={s.url}
                  onClick={() => {
                    track('clicked gold sponsor', {
                      title: 'conf2024',
                      type: 'sponsor',
                      location: s.name,
                    })
                  }}
                  key={s.name}
                  className="not-prose flex items-center justify-center opacity-90 transition hover:opacity-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div>{s.logo}</div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
      {silver.length > 0 && (
        <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16">
          <p className="font-mono text-sm uppercase">Silver:</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:justify-start lg:gap-10">
            {silver.map(
              (s: {name: string; url: string; logo: React.JSX.Element}) => {
                return (
                  <Link
                    href={s.url}
                    key={s.name}
                    onClick={() => {
                      track('clicked silver sponsor', {
                        title: 'conf2024',
                        type: 'sponsor',
                        location: s.name,
                      })
                    }}
                    className="flex items-center justify-center opacity-90 transition hover:opacity-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div>{s.logo}</div>
                  </Link>
                )
              },
            )}
          </div>
        </div>
      )}
      {community.length > 0 && (
        <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16 sm:px-10">
          <p className="w-20 font-mono text-sm uppercase">Community:</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:justify-center sm:gap-x-16 sm:gap-y-5">
            {community.map(
              (s: {name: string; url: string; logo: React.JSX.Element}) => {
                return (
                  <Link
                    href={s.url}
                    key={s.name}
                    onClick={() => {
                      track('clicked community sponsor', {
                        title: 'conf2024',
                        type: 'sponsor',
                        location: s.name,
                      })
                    }}
                    className="flex items-center justify-center opacity-90 transition hover:opacity-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div>{s.logo}</div>
                  </Link>
                )
              },
            )}
          </div>
        </div>
      )}
      {/* <div className="relative mt-5 flex w-full flex-col items-center justify-center gap-10 pb-12 pt-5 sm:flex-row">
        <Link
          href="mailto:conf@epicweb.dev?subject=Sponsoring Epic Web Conf 2024"
          className="inline-flex items-center gap-1 text-center text-[#93A1D7] transition hover:brightness-125"
        >
          <StarIcon className="w-4" stroke="currentColor" aria-hidden="true" />
          Become a sponsor
        </Link>
        <Link
          href="/conf/code-of-conduct"
          className="inline-flex items-center gap-1 text-center text-[#93A1D7] transition hover:brightness-125"
        >
          <DocumentIcon
            className="w-4"
            stroke="currentColor"
            aria-hidden="true"
          />
          Code of Conduct
        </Link>
      </div> */}
    </section>
  )
}

const sponsorsData = {
  platinum: [],
  gold: [
    {
      name: 'Sentry.io',
      url: 'https://sentry.io/welcome',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 222 66"
          className="w-56"
        >
          <title>Sentry.io</title>
          <path
            d="M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z M124.32,28.28,109.56,9.22h-3.68V34.77h3.73V15.19l15.18,19.58h3.26V9.22h-3.73ZM87.15,23.54h13.23V20.22H87.14V12.53h14.93V9.21H83.34V34.77h18.92V31.45H87.14ZM71.59,20.3h0C66.44,19.06,65,18.08,65,15.7c0-2.14,1.89-3.59,4.71-3.59a12.06,12.06,0,0,1,7.07,2.55l2-2.83a14.1,14.1,0,0,0-9-3c-5.06,0-8.59,3-8.59,7.27,0,4.6,3,6.19,8.46,7.52C74.51,24.74,76,25.78,76,28.11s-2,3.77-5.09,3.77a12.34,12.34,0,0,1-8.3-3.26l-2.25,2.69a15.94,15.94,0,0,0,10.42,3.85c5.48,0,9-2.95,9-7.51C79.75,23.79,77.47,21.72,71.59,20.3ZM195.7,9.22l-7.69,12-7.64-12h-4.46L186,24.67V34.78h3.84V24.55L200,9.22Zm-64.63,3.46h8.37v22.1h3.84V12.68h8.37V9.22H131.08ZM169.41,24.8c3.86-1.07,6-3.77,6-7.63,0-4.91-3.59-8-9.38-8H154.67V34.76h3.8V25.58h6.45l6.48,9.2h4.44l-7-9.82Zm-10.95-2.5V12.6h7.17c3.74,0,5.88,1.77,5.88,4.84s-2.29,4.86-5.84,4.86Z"
            transform="translate(11, 11)"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Vercel',
      url: 'https://vercel.com',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 4438 1000"
          className="w-56"
        >
          <title>Vercel</title>
          <path
            d="M2223.75 250C2051.25 250 1926.87 362.5 1926.87 531.25C1926.87 700 2066.72 812.5 2239.38 812.5C2343.59 812.5 2435.47 771.25 2492.34 701.719L2372.81 632.656C2341.25 667.188 2293.28 687.344 2239.38 687.344C2164.53 687.344 2100.94 648.281 2077.34 585.781H2515.16C2518.59 568.281 2520.63 550.156 2520.63 531.094C2520.63 362.5 2396.41 250 2223.75 250ZM2076.09 476.562C2095.62 414.219 2149.06 375 2223.75 375C2298.59 375 2352.03 414.219 2371.41 476.562H2076.09ZM2040.78 78.125L1607.81 828.125L1174.69 78.125H1337.03L1607.66 546.875L1878.28 78.125H2040.78ZM577.344 0L1154.69 1000H0L577.344 0ZM3148.75 531.25C3148.75 625 3210 687.5 3305 687.5C3369.38 687.5 3417.66 658.281 3442.5 610.625L3562.5 679.844C3512.81 762.656 3419.69 812.5 3305 812.5C3132.34 812.5 3008.13 700 3008.13 531.25C3008.13 362.5 3132.5 250 3305 250C3419.69 250 3512.66 299.844 3562.5 382.656L3442.5 451.875C3417.66 404.219 3369.38 375 3305 375C3210.16 375 3148.75 437.5 3148.75 531.25ZM4437.5 78.125V796.875H4296.88V78.125H4437.5ZM3906.25 250C3733.75 250 3609.38 362.5 3609.38 531.25C3609.38 700 3749.38 812.5 3921.88 812.5C4026.09 812.5 4117.97 771.25 4174.84 701.719L4055.31 632.656C4023.75 667.188 3975.78 687.344 3921.88 687.344C3847.03 687.344 3783.44 648.281 3759.84 585.781H4197.66C4201.09 568.281 4203.12 550.156 4203.12 531.094C4203.12 362.5 4078.91 250 3906.25 250ZM3758.59 476.562C3778.13 414.219 3831.41 375 3906.25 375C3981.09 375 4034.53 414.219 4053.91 476.562H3758.59ZM2961.25 265.625V417.031C2945.63 412.5 2929.06 409.375 2911.25 409.375C2820.47 409.375 2755 471.875 2755 565.625V796.875H2614.38V265.625H2755V409.375C2755 330 2847.34 265.625 2961.25 265.625Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ],
  silver: [],
  community: [],
}
