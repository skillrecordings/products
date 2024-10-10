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
          url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1728407319/epic-web/epic-web-conf-2025-v1.png',
        },
      }}
    >
      {/* <EventJsonLd
        name="Epic Web Conf 2025"
        startDate="2025-04-10T08:00:00-07:00"
        endDate="2025-04-11T17:00:00-07:00"
        location={{
          name: 'Prospector Square Theatre',
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

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-16 sm:gap-32">
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
          Right now we are offering super early bird tickets, this is{' '}
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
            <div className="text-lg text-[#D6DEFF]">Feb/March 2025</div>
          </div>
          {/* <div>
            <div className="font-mono text-sm uppercase tracking-wide text-[#93A1D7]">
              Workshop Day
            </div>
            <div className="text-lg text-[#D6DEFF]">Feb/Mar 2025</div>
          </div> */}
          <div>
            <div className="font-mono text-sm uppercase tracking-wide text-[#93A1D7]">
              Location
            </div>
            <div className="text-lg text-[#D6DEFF]">Utah</div>
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
            .fill('Super Early Bird Tickets OUT NOW')
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
