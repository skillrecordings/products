import React from 'react'
import Layout from 'components/app/layout'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import HeroPlanetImage from '../../../../public/assets/conf/conf-hero.jpg'
import {ChevronRightIcon, PlayIcon} from '@heroicons/react/solid'
import {track} from 'utils/analytics'
import {DocumentIcon, StarIcon} from '@heroicons/react/outline'
import {type Talk} from 'lib/talks'
import {useMeasure} from 'react-use'
import {cn} from '@skillrecordings/ui/utils/cn'
import MuxPlayer from '@mux/mux-player-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
} from '@skillrecordings/ui'
import {DialogTrigger} from '@radix-ui/react-dialog'
import {GetStaticProps} from 'next'
import {shuffle} from 'lodash'
// import {TwitterIcon, BlueskyIcon} from '@skillrecordings/react'

import {useRouter} from 'next/router'
import slugify from '@sindresorhus/slugify'

export const IS_PAST_CONF_25 = false
export const CONF_25_TITO_URL = 'https://ti.to/epicweb/epicweb-conf-2025'
const CONF_25_SESSIONIZE_URL = 'https://sessionize.com/epicweb-conf-2025/'
const HOTEL_PROMO_CODE = 'W14'

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

export const getStaticProps: GetStaticProps = async () => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/wyvikoxy/view/Speakers',
  ).then((res) => res.json())

  return {
    props: {speakers: speakers},
    revalidate: 60 * 5,
  }
}

const ConfPage: React.FC<{speakers: Speaker[]}> = ({speakers}) => {
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
      <TicketsMarquee />
      <Header />
      <Body speakers={speakers} />

      <Footer />
    </Layout>
  )
}

export default ConfPage

const Body = ({speakers}: {speakers: Speaker[]}) => {
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
  const [showingSpeakerDetail, setShowingSpeakerDetail] = React.useState<
    boolean | Speaker
  >(false)
  const router = useRouter()
  const [shuffledSpeakers, setShuffledSpeakers] = React.useState<Speaker[]>([])
  React.useEffect(() => {
    setShuffledSpeakers(shuffle(speakers))
  }, [])
  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-16 sm:gap-16">
      <div className="px-5">
        <MuxPlayer
          playbackId={promoVideo}
          className="w-full rounded shadow-xl"
          accentColor="#3b82f6"
          poster={`https://image.mux.com/${promoVideo}/thumbnail.jpg?time=3`}
        />
      </div>

      <SpeakersList
        speakers={shuffledSpeakers}
        showingSpeakerDetail={showingSpeakerDetail}
        setShowingSpeakerDetail={setShowingSpeakerDetail}
      />

      {/* <Section
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
      </Section> */}
      <Section
        position={1}
        title="Join us in March 2025"
        image="https://res.cloudinary.com/epic-web/image/upload/v1728471924/conf25/attendee_2x.jpg"
        cta={{href: CONF_25_TITO_URL, label: 'Buy Tickets'}}
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
      <Location />
      {!IS_PAST_CONF_25 && <HotelSection />}
      <Sponsors />
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
      <div className="relative z-10 mx-auto w-full max-w-screen-lg px-5 pb-10 pt-16 sm:pb-16 sm:pt-40">
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
              Buy Tickets
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
    <section className="flex flex-col items-center justify-center pt-16 sm:pt-16">
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
            Buy Tickets
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

const TicketsMarquee = () => {
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
      className="absolute top-12 z-20 flex w-full items-center justify-center overflow-hidden bg-gray-800 sm:top-12"
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
          className={`pointer-events-none flex justify-center space-x-2 py-2 text-xs font-semibold uppercase text-gray-300`}
        >
          {new Array(20).fill('Get Tickets').map((text, index) => (
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
    <section className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pb-16">
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
            href="https://book.passkey.com/event/50932723/owner/1422/home"
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
      className="mx-auto flex w-full max-w-screen-xl scale-90 flex-col items-center justify-center gap-10 pb-10 sm:pb-16 lg:scale-100 [&_p]:text-[#93A1D7]"
    >
      <h2 className="pb-5 text-3xl font-semibold sm:text-4xl">Sponsors</h2>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-16">
        {platinum.length > 0 && (
          <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16 sm:px-10">
            <p className="w-20 font-mono text-sm uppercase">Platinum:</p>
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-16">
              {platinum.map(
                (s: {name: string; url: string; logo: React.JSX.Element}) => {
                  return (
                    <Link
                      href={s.url}
                      onClick={() => {
                        track('clicked platinum sponsor', {
                          title: 'conf2025',
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
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-12">
              {gold.map((s) => {
                return (
                  <Link
                    href={s.url}
                    onClick={() => {
                      track('clicked gold sponsor', {
                        title: 'conf2025',
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
                          title: 'conf2025',
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
                          title: 'conf2025',
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
      </div>
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
  platinum: [
    {
      name: 'Fly.io',
      url: 'https://fly.io',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 89"
          className="w-56"
        >
          <title>Fly.io</title>
          <path
            d="M66.522 11.742h10.954c9.743 0 17.653 7.91 17.653 17.653v38.517c0 9.743-7.91 17.653-17.653 17.653h-.863c-5.015-.784-7.19-2.288-8.87-3.559L53.816 70.555a1.968 1.968 0 00-2.466 0l-4.524 3.721-12.743-10.478a1.96 1.96 0 00-2.464 0L13.915 79.371c-3.562 2.898-5.919 2.363-7.447 2.195C2.52 78.326 0 73.411 0 67.912V29.395c0-9.743 7.91-17.653 17.654-17.653h10.93l-.02.044-.368 1.074-.115.368-.496 2.201-.068.385-.218 2.204-.029.605-.005.212.021 1.01.05.593.123.926.156.835.186.768.241.832.625 1.761.207.528 1.089 2.301.384.707 1.26 2.162.482.78 1.758 2.588.253.343 2.288 2.977.739.916 2.611 3.053.537.588 2.153 2.316.852.883 1.409 1.4-.282.236-.177.159c-.478.446-.932.92-1.357 1.418-.205.241-.4.49-.584.746a9.78 9.78 0 00-.755 1.233 7.336 7.336 0 00-.302.685 6.35 6.35 0 00-.409 1.86l-.008.551c.02.776.178 1.542.467 2.263.292.73.719 1.399 1.258 1.973.392.417.838.781 1.327 1.08a6.76 6.76 0 001.321.624 7.401 7.401 0 003.119.355h.005a7.04 7.04 0 002.573-.764c.345-.183.674-.395.982-.636a6.288 6.288 0 001.981-2.635c.325-.81.484-1.675.47-2.546l-.026-.456a6.43 6.43 0 00-.426-1.753 7.348 7.348 0 00-.33-.716 9.82 9.82 0 00-.777-1.229 12.31 12.31 0 00-.41-.525 16.823 16.823 0 00-1.515-1.587l-.382-.325.646-.637 2.774-2.897.959-1.053 1.491-1.678.97-1.134 1.383-1.685.937-1.177 1.375-1.839.694-.951.985-1.473.82-1.254 1.546-2.692.884-1.766.025-.054.677-1.638a.56.56 0 00.023-.065l.729-2.274.076-.331.317-1.81.061-.49.019-.3.022-1.133-.006-.211-.058-1.015-.072-.788-.359-2.272c-.006-.03-.012-.06-.021-.09l-.461-1.68-.159-.467zm5.207 48.032a4.262 4.262 0 00-4.183 4.183c.033 2.281 1.901 4.148 4.183 4.181 2.281-.033 4.149-1.9 4.184-4.181a4.263 4.263 0 00-4.184-4.183z"
            fill-opacity=".35"
            fill="currentColor"
          />
          <path
            d="M63.494 85.565h-21.51c-1.102 0-1.256-1.044-.547-1.638 10.499-8.795 10.474-8.824 10.474-8.824a1.158 1.158 0 011.484-.003s9.867 8.174 10.646 8.827c.709.594.556 1.638-.547 1.638zm-15.869-35.08l.112.032c.035.018.066.043.098.065l.093.082c.229.211.452.433.666.66.151.161.298.327.439.498.18.217.348.444.501.68.066.104.127.21.185.32.05.095.095.193.134.293.07.174.122.357.138.543l-.003.35a1.997 1.997 0 01-.947 1.556c-.35.212-.744.342-1.151.379l-.433.013-.365-.032a2.795 2.795 0 01-.501-.122 2.419 2.419 0 01-.475-.222l-.285-.209a1.952 1.952 0 01-.649-1.112 2.741 2.741 0 01-.034-.221l-.01-.333a1.63 1.63 0 01.039-.269c.05-.195.122-.384.212-.563.117-.225.25-.442.399-.648.247-.333.514-.651.8-.951.185-.195.373-.384.57-.565l.141-.127c.097-.065.098-.065.209-.097zm-.717-46.522l.045-.004V42.97l-.097-.18a109.393 109.393 0 01-3.584-7.262 77.906 77.906 0 01-2.432-6.089 48 48 0 01-1.465-5.013c-.309-1.348-.545-2.715-.642-4.096a19.74 19.74 0 01-.034-1.771c.009-.514.03-1.027.063-1.541.051-.807.133-1.613.251-2.412.094-.629.21-1.256.353-1.876.114-.492.246-.981.397-1.462.218-.695.478-1.374.782-2.037.111-.239.23-.476.356-.709.753-1.395 1.775-2.68 3.113-3.54a6.509 6.509 0 012.894-1.019zm5.059.098l2.624.749a16.01 16.01 0 013.461 1.763 13.88 13.88 0 013.722 3.712 14.085 14.085 0 011.441 2.779 16.272 16.272 0 011.003 4.499c.035.403.055.807.063 1.212.009.375.007.752-.023 1.127a12.76 12.76 0 01-.472 2.48 19.491 19.491 0 01-.68 1.951 27.983 27.983 0 01-1.08 2.332c-.875 1.69-1.881 3.306-2.959 4.869a75.975 75.975 0 01-4.267 5.568 105.805 105.805 0 01-5.119 5.674 108.121 108.121 0 003.369-6.894 85.38 85.38 0 001.638-3.947 61.629 61.629 0 001.526-4.439 43.79 43.79 0 00.878-3.404c.209-.984.374-1.978.476-2.978.085-.834.117-1.673.096-2.509a35.765 35.765 0 00-.057-1.536c-.123-2.057-.436-4.108-1.036-6.081a17.657 17.657 0 00-.827-2.193c-.768-1.673-1.84-3.237-3.291-4.378zM207.646 74.498l-12.457-26.666c-1.04-2.222-1.66-3.034-2.701-3.976l-1.012-.913c-.808-.783-1.338-1.508-1.338-2.369 0-1.233.976-2.271 2.755-2.271h10.815c1.697 0 2.755.883 2.755 2.201 0 .736-.338 1.288-.766 1.829-.507.643-1.168 1.269-1.168 2.412 0 .716.209 1.43.611 2.342l7.434 17.408 6.668-16.97c.41-1.129.69-2.123.69-2.919 0-1.239-.673-1.744-1.192-2.298-.452-.481-.813-.989-.813-1.804 0-1.331 1.083-2.201 2.541-2.201h6.66c1.867 0 2.755.966 2.755 2.201 0 .79-.455 1.523-1.351 2.313l-.942.774c-1.312 1.072-1.919 2.622-2.608 4.226l-10.099 24.329c-1.193 2.844-2.97 6.793-5.683 10.033-2.757 3.29-6.474 5.849-11.508 5.849-4.215 0-6.767-2.013-6.767-4.913 0-2.657 1.965-4.774 4.547-4.774 1.414 0 2.149.668 2.895 1.355.617.566 1.243 1.148 2.477 1.148 1.144 0 2.21-.484 3.177-1.266 1.476-1.194 2.712-3.073 3.625-5.08zm73.198-.095c5.607 0 10.201-1.921 13.784-5.755C298.209 64.82 300 60.212 300 54.824c0-5.259-1.702-9.58-5.093-12.966-3.391-3.385-7.79-5.085-13.204-5.085-5.701 0-10.363 1.851-13.994 5.539-3.632 3.691-5.449 8.162-5.449 13.415 0 5.205 1.734 9.618 5.195 13.237 3.464 3.622 7.925 5.439 13.389 5.439zm-47.413-.417c3.242 0 5.547-2.183 5.547-5.33 0-3.073-2.381-5.26-5.547-5.26-3.318 0-5.692 2.191-5.692 5.26 0 3.144 2.376 5.33 5.692 5.33zm11.544-4.988l.79-.834c.938-.912 1.24-1.833 1.24-4.373V48.776c0-2.196-.298-3.176-1.23-4.015l-.928-.832c-.91-.803-1.209-1.302-1.209-2.104 0-1.14.884-2.075 2.306-2.399l6.303-1.53c.603-.146 1.283-.288 1.81-.288.725 0 1.319.238 1.735.652.417.415.662 1.011.662 1.758v23.773c0 2.397.291 3.512 1.292 4.354a.478.478 0 01.045.045l.705.821c.885.861 1.252 1.432 1.252 2.217 0 1.401-1.056 2.202-2.754 2.202h-10.672c-1.618 0-2.684-.796-2.684-2.202 0-.789.368-1.365 1.337-2.23zm-71.334.001l.789-.835c.939-.912 1.241-1.833 1.241-4.373v-31.35c0-2.126-.225-3.17-1.22-4.008l-.953-.922c-.821-.798-1.121-1.293-1.121-2.091 0-1.142.888-2.073 2.232-2.399l6.231-1.529c.604-.146 1.283-.289 1.811-.289.72 0 1.329.217 1.764.628.436.413.704 1.026.704 1.852v40.108c0 2.403.299 3.454 1.304 4.363l.804.851c.891.867 1.188 1.434 1.188 2.223 0 .582-.178 1.051-.494 1.409-.446.504-1.193.793-2.19.793H175.06c-.996 0-1.744-.289-2.191-.793-.315-.358-.492-.827-.492-1.409 0-.79.293-1.362 1.264-2.229zm-29.058-16.145v10.798c0 1.627.322 3.129 1.662 4.366l.867.841c.971.942 1.266 1.506 1.266 2.369 0 1.319-1.057 2.202-2.755 2.202h-12.032c-1.698 0-2.755-.883-2.755-2.202 0-1.024.301-1.509 1.271-2.374l.864-.839c1.005-.91 1.661-2.151 1.661-4.363V34.805c0-1.758-.389-3.196-1.662-4.367l-.868-.841c-.892-.866-1.266-1.435-1.266-2.3 0-1.398 1.061-2.271 2.755-2.271h32.23c1.231 0 2.314.274 3.005.952.481.472.788 1.137.823 2.06l.502 7.44c.05.93-.225 1.706-.761 2.184-.37.329-.867.526-1.493.526-.789 0-1.394-.298-1.934-.812-.485-.462-.917-1.111-1.405-1.875-1.177-1.881-1.725-2.558-2.98-3.438-1.746-1.288-4.407-1.731-9.437-1.731-2.903 0-4.735.127-5.889.424-.746.193-1.177.443-1.407.81-.237.376-.262.851-.262 1.431v14.62h7.558c1.808 0 3.08-.327 4.554-2.341l.008-.012c.591-.752 1.019-1.306 1.426-1.673.473-.429.929-.632 1.532-.632a2.212 2.212 0 012.182 2.203v10.079c0 1.35-1.052 2.271-2.182 2.271-.562 0-1.018-.2-1.493-.62-.409-.359-.838-.898-1.394-1.617-1.613-2.088-2.752-2.421-4.633-2.421zm127.7-.255c0-3.616.788-6.215 2.42-7.778 1.613-1.543 3.346-2.324 5.209-2.324 2.563 0 4.873 1.435 6.956 4.255 2.128 2.884 3.181 6.781 3.181 11.686 0 3.62-.79 6.243-2.425 7.851-1.611 1.586-3.343 2.39-5.205 2.39-2.563 0-4.871-1.446-6.955-4.288-2.129-2.908-3.181-6.841-3.181-11.792zm-21.09-19.555c3.249 0 5.547-1.829 5.547-4.983 0-3.079-2.296-4.912-5.547-4.912-3.327 0-5.621 1.834-5.621 4.912s2.295 4.983 5.621 4.983z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Neon',
      url: 'https://neon.tech',
      logo: (
        <svg
          className="w-56"
          viewBox="0 0 158 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 7.61152C0 3.40779 3.44137 0 7.68651 0H36.8952C41.1404 0 44.5817 3.40779 44.5817 7.61152V32.2111C44.5817 36.5601 39.0241 38.4476 36.3287 35.014L27.902 24.2798V37.2964C27.902 41.0798 24.8048 44.1468 20.9842 44.1468H7.68651C3.44137 44.1468 0 40.739 0 36.5353V7.61152ZM7.68651 6.08921C6.83748 6.08921 6.14921 6.77077 6.14921 7.61152V36.5353C6.14921 37.376 6.83748 38.0576 7.68651 38.0576H21.2148C21.6393 38.0576 21.7528 37.7168 21.7528 37.2964V19.8412C21.7528 15.4922 27.3104 13.6047 30.0059 17.0383L38.4325 27.7725V7.61152C38.4325 6.77077 38.5129 6.08921 37.6639 6.08921H7.68651Z"
            fill="currentColor"
          />
          <path
            d="M36.8954 0C41.1406 0 44.5819 3.40779 44.5819 7.61152V32.2111C44.5819 36.5601 39.0243 38.4476 36.3289 35.014L27.9022 24.2798V37.2964C27.9022 41.0798 24.805 44.1468 20.9844 44.1468C21.4089 44.1468 21.753 43.806 21.753 43.3857V19.8412C21.753 15.4922 27.3106 13.6047 30.0061 17.0383L38.4327 27.7725V1.5223C38.4327 0.681558 37.7445 0 36.8954 0Z"
            fill="currentColor"
          />
          <path
            d="M75.1561 13.0033V24.5502L63.8496 13.0033H57.9648V31.8884H63.332V19.4782L75.6465 31.8884H80.5232V13.0033H75.1561Z"
            fill="currentColor"
          />
          <path
            d="M90.4725 27.6797V24.3343H102.487V20.3145H90.4725V17.212H105.048V13.0033H84.9964V31.8884H105.348V27.6797H90.4725Z"
            fill="currentColor"
          />
          <path
            d="M119.61 32.5089C127.157 32.5089 132.061 28.8398 132.061 22.4458C132.061 16.0519 127.157 12.3828 119.61 12.3828C112.063 12.3828 107.187 16.0519 107.187 22.4458C107.187 28.8398 112.063 32.5089 119.61 32.5089ZM119.61 28.0304C115.415 28.0304 112.826 26.007 112.826 22.4458C112.826 18.8847 115.442 16.8613 119.61 16.8613C123.806 16.8613 126.394 18.8847 126.394 22.4458C126.394 26.007 123.806 28.0304 119.61 28.0304Z"
            fill="currentColor"
          />
          <path
            d="M152.632 13.0033V24.5502L141.326 13.0033H135.441V31.8884H140.808V19.4782L153.123 31.8884H157.999V13.0033H152.632Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ],
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
  silver: [
    {
      name: 'Optimize, by Prisma',
      url: 'https://www.prisma.io/blog/prisma-optimize-early-access',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-36"
          viewBox="0 0 90 28"
          fill="none"
        >
          <title>Optimize, by Prisma</title>
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
  community: [
    {
      name: 'Fathom Analytics',
      url: 'https://usefathom.com',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-24"
          viewBox="0 0 523.801 234.398"
        >
          <title>Fathom Analytics</title>
          <path
            d="M28.654 33.217V29.26a3.987 3.987 0 00-3.982-3.988h-7.633v-3.666c-.013-4.285.956-6.852 1.828-7.786l.041-.051a4.462 4.462 0 012.155-1.176 52.035 52.035 0 018.52-.661h1.466a3.987 3.987 0 003.987-3.989V4.371A3.98 3.98 0 0031.811.456 42.91 42.91 0 0030.19.175C29.437.059 25.485 0 24.71 0h3.178-3.232C18.233 0 12.764 1.5 9.102 5.429l-.006.006C5.517 9.378 4.23 14.952 4.212 21.728V96.4a3.987 3.987 0 003.989 3.987h4.85a3.985 3.985 0 003.988-3.987V37.2h7.633a3.985 3.985 0 003.987-3.987M350.483 43.425a25.751 25.751 0 011.469 9.065v43.9a3.987 3.987 0 003.989 3.989h4.725a3.987 3.987 0 003.987-3.989V51.34a35.569 35.569 0 00-2.561-14.153 21.241 21.241 0 00-8.239-9.774 24.218 24.218 0 00-13.067-3.419h-.079a25.5 25.5 0 00-13.832 3.939 26.272 26.272 0 00-7.009 6.616 20.87 20.87 0 00-6.769-7.122 23.642 23.642 0 00-12.893-3.433h-.088a25.254 25.254 0 00-13.7 3.939 24.666 24.666 0 00-3.449 2.7v-1.378a3.987 3.987 0 00-3.985-3.989h-4.723a3.985 3.985 0 00-3.993 3.989v67.14a3.987 3.987 0 003.989 3.989h4.723a3.985 3.985 0 003.988-3.989V55.679a22.417 22.417 0 011.149-6.879 22.265 22.265 0 013.357-6.5 16.707 16.707 0 015.058-4.549 12.376 12.376 0 016.363-1.568c3.243.008 5.378.723 6.868 1.827a11.546 11.546 0 013.882 5.416 25.735 25.735 0 011.469 9.064v43.9a3.987 3.987 0 003.989 3.989h4.723a3.985 3.985 0 003.987-3.989V55.679a22.294 22.294 0 011.147-6.878 22.247 22.247 0 013.358-6.5 16.683 16.683 0 015.05-4.546 12.39 12.39 0 016.364-1.568c3.245.008 5.38.723 6.865 1.827a11.516 11.516 0 013.885 5.415M211.314 96.838a32.875 32.875 0 0017.776 4.694h.077a33.139 33.139 0 0017.48-4.536 29.573 29.573 0 0011.587-13.514c2.634-5.85 3.859-12.759 3.861-20.654a50.228 50.228 0 00-3.781-20.3 30.468 30.468 0 00-11.387-13.749 32.249 32.249 0 00-17.753-4.784h-.081a33.1 33.1 0 00-17.55 4.606 29.514 29.514 0 00-11.58 13.52c-2.594 5.827-3.788 12.783-3.791 20.833a50.622 50.622 0 003.708 20.149 29.551 29.551 0 0011.434 13.735zm3.076-54.253a15.989 15.989 0 016.085-4.774 21.569 21.569 0 018.657-1.629 20.364 20.364 0 018.437 1.656 16.447 16.447 0 016.1 4.916c3.488 4.464 5.471 11.01 5.475 20.071v.013c0 9.34-1.977 15.97-5.342 20.249a15.754 15.754 0 01-6.028 4.758 21.475 21.475 0 01-8.636 1.627c-6.669-.077-11.023-2.143-14.611-6.588-3.527-4.474-5.52-10.964-5.525-19.93v-.019c0-9.418 2-16.08 5.393-20.35M141.098 96.396V55.681a20.21 20.21 0 011.241-6.774 21.428 21.428 0 013.666-6.461 17.776 17.776 0 015.7-4.595 16.041 16.041 0 017.492-1.664c3.818 0 6.519.775 8.354 1.972a11.47 11.47 0 014.427 5.405 23.032 23.032 0 011.608 8.93v43.902a3.985 3.985 0 003.989 3.987h4.85a3.982 3.982 0 003.987-3.987V51.341a32.1 32.1 0 00-2.964-14.338 22.439 22.439 0 00-8.981-9.664 27.569 27.569 0 00-13.981-3.348h-.061a28.352 28.352 0 00-14.7 3.944 27.758 27.758 0 00-4.627 3.456V4.5a3.987 3.987 0 00-3.987-3.989h-4.722A3.985 3.985 0 00128.4 4.5v91.9a3.985 3.985 0 003.989 3.987h4.722a3.985 3.985 0 003.987-3.987M116.041 100.893h.01q1.149 0 2.242-.072a9.274 9.274 0 002.8-.589 3.989 3.989 0 002.52-3.712v-3.57a3.987 3.987 0 00-3.987-3.989h-1.873a18.9 18.9 0 01-5.418-.667 4.47 4.47 0 01-2.163-1.163l-.046-.054c-.873-.937-1.843-3.5-1.828-7.787V37.204h8.266a3.987 3.987 0 003.986-3.984v-3.96a3.987 3.987 0 00-3.987-3.989h-8.266V13.689A3.987 3.987 0 00104.31 9.7h-4.85a3.985 3.985 0 00-3.989 3.989v65.476c.013 6.7 1.319 12.253 4.861 16.208 3.671 4 9.2 5.515 15.7 5.514"
            fill="currentColor"
          />
          <path
            d="M523.065 112.594a3.985 3.985 0 00-3.251-1.68h-4.849a3.987 3.987 0 00-3.767 2.676l-30.251 86.79a3.988 3.988 0 003.767 5.3h4.85a3.985 3.985 0 003.765-2.674l30.249-86.791a3.994 3.994 0 00-.514-3.622"
            fill="currentColor"
          />
          <path
            d="M420.54 180.661zM338.96 114.997h-4.723a3.987 3.987 0 00-3.985 3.989v7.567a3.987 3.987 0 003.989 3.987h4.723a3.985 3.985 0 003.987-3.987v-7.567a3.985 3.985 0 00-3.987-3.989M338.96 142.52h-4.723a3.985 3.985 0 00-3.985 3.989v55.181a3.987 3.987 0 003.989 3.987h4.723a3.985 3.985 0 003.988-3.987v-55.181a3.985 3.985 0 00-3.987-3.989M321.476 194.258h-1.873a18.924 18.924 0 01-5.42-.665 4.484 4.484 0 01-2.162-1.163l-.045-.056c-.874-.937-1.843-3.505-1.83-7.792v-42.08h8.266a3.985 3.985 0 003.987-3.987v-3.958a3.985 3.985 0 00-3.987-3.989h-8.266v-11.582a3.987 3.987 0 00-3.987-3.989h-4.85a3.987 3.987 0 00-3.989 3.989v65.477c.013 6.7 1.319 12.253 4.861 16.206l.006.006c3.673 4 9.2 5.519 15.713 5.515h.063c.743 0 1.468-.026 2.173-.072a9.274 9.274 0 002.8-.592 3.988 3.988 0 002.527-3.708v-3.574a3.985 3.985 0 00-3.987-3.989M289.25 130.568h-4.979a3.981 3.981 0 00-3.706 2.513l-20.289 50.982-20.813-51.014a3.981 3.981 0 00-3.693-2.481h-5.231a3.987 3.987 0 00-3.687 5.512l26.564 64.224-2.581 6.406c-1.675 4.183-3.127 7.432-4.3 9.651a17.929 17.929 0 01-2.937 4.346 3.986 3.986 0 01-2.048 1.134 25 25 0 01-4.727.369h-2.2a3.987 3.987 0 00-3.989 3.989v3.83a3.992 3.992 0 003.215 3.912c.539.105 1.142.2 1.838.3a18.24 18.24 0 002.384.163 31.961 31.961 0 007.813-.825 14.291 14.291 0 006.621-3.789 28.48 28.48 0 004.8-6.9c1.447-2.77 3.02-6.248 4.754-10.493l30.891-76.344a3.987 3.987 0 00-3.7-5.485M217.775 105.807h-4.722a3.987 3.987 0 00-3.989 3.989v91.9a3.985 3.985 0 003.989 3.987h4.722a3.987 3.987 0 003.987-3.987v-91.9a3.987 3.987 0 00-3.987-3.989M102.779 141.48c3.816 0 6.516.775 8.35 1.97a11.471 11.471 0 014.437 5.403 23.006 23.006 0 011.607 8.931v43.9a3.987 3.987 0 003.989 3.987h4.85a3.985 3.985 0 003.989-3.987v-45.046a32.144 32.144 0 00-2.964-14.338 22.447 22.447 0 00-8.982-9.665 27.565 27.565 0 00-13.971-3.342h-.078a28.693 28.693 0 00-14.665 3.86 26.927 26.927 0 00-4.657 3.435v-2.035a3.987 3.987 0 00-3.987-3.989h-4.722a3.985 3.985 0 00-3.989 3.989v67.14a3.985 3.985 0 003.989 3.987h4.722a3.985 3.985 0 003.987-3.987v-40.714a20.252 20.252 0 011.241-6.776 21.4 21.4 0 013.666-6.463 17.776 17.776 0 015.7-4.595 16.065 16.065 0 017.492-1.664M12.864 204.392a33.879 33.879 0 0013.588 2.5 30.98 30.98 0 0010.476-1.959 33.289 33.289 0 0010.3-6.075c.6-.511 1.163-1.056 1.712-1.616a18.809 18.809 0 002.326 6.6 3.959 3.959 0 003.4 1.9h.008l2.326-.025a3.988 3.988 0 003.942-3.987V159a37.382 37.382 0 00-2.9-15.276 23.016 23.016 0 00-9.461-10.687c-4.317-2.545-9.549-3.681-15.492-3.681a35.269 35.269 0 00-15.457 3.14A24.812 24.812 0 007.1 141.909l-.018.029a3.46 3.46 0 00-.515 1.816 3.638 3.638 0 002.446 3.423l3.914 1.393a5.583 5.583 0 006.2-1.753 15.946 15.946 0 011.173-1.301c2.561-2.486 6.361-3.95 12.274-3.973a21.349 21.349 0 017.486 1.166 10.23 10.23 0 014.416 3.1c2.216 2.719 3.61 6.921 3.74 12.944-5.7.089-10.753.327-15.12.735a71.036 71.036 0 00-16.135 3.358h-.018l-.046.014h-.008c-5.147 1.6-9.4 4.092-12.387 7.668A20.779 20.779 0 000 184.189v.129a22.056 22.056 0 003.39 12.215 21.118 21.118 0 009.474 7.859m32.473-20.784a23.505 23.505 0 01-7.875 8.205 19.342 19.342 0 01-10.63 3.019c-5.021-.01-8.387-1.161-10.661-3.039a8.868 8.868 0 01-2.494-3.229 11.531 11.531 0 01-.852-4.552 10.344 10.344 0 011.331-5.239c.675-1.208 2.167-2.62 4.895-3.926 2.594-1.256 6.792-2.415 12.379-3.223a138.8 138.8 0 0116.816-1.181v2.467a20.863 20.863 0 01-2.908 10.7M185.724 133.037c-4.317-2.545-9.549-3.681-15.492-3.681a35.269 35.269 0 00-15.457 3.14 24.812 24.812 0 00-10.53 9.413l-.018.029a3.431 3.431 0 00-.515 1.816 3.638 3.638 0 002.444 3.423l3.914 1.393a5.58 5.58 0 006.2-1.753 15.966 15.966 0 011.182-1.294c2.561-2.486 6.361-3.95 12.274-3.973a21.349 21.349 0 017.486 1.166 10.23 10.23 0 014.416 3.1c2.216 2.719 3.61 6.921 3.74 12.944-5.7.089-10.753.327-15.12.735a71.036 71.036 0 00-16.135 3.358l-.018.006-.046.013h-.008c-5.147 1.6-9.4 4.092-12.387 7.668a20.779 20.779 0 00-4.5 13.646v.129a22.03 22.03 0 003.39 12.215 21.114 21.114 0 009.472 7.859 33.892 33.892 0 0013.59 2.5 30.98 30.98 0 0010.476-1.959 33.289 33.289 0 0010.3-6.075c.6-.511 1.163-1.056 1.712-1.616a18.809 18.809 0 002.326 6.6 3.959 3.959 0 003.4 1.9h.008l2.334-.027a3.987 3.987 0 003.942-3.987v-42.73a37.383 37.383 0 00-2.9-15.276 23.016 23.016 0 00-9.467-10.686m-3.254 50.576a23.505 23.505 0 01-7.875 8.205 19.342 19.342 0 01-10.63 3.019c-5.021-.01-8.387-1.161-10.661-3.039a8.868 8.868 0 01-2.494-3.229 11.5 11.5 0 01-.852-4.552 10.344 10.344 0 011.331-5.239c.675-1.208 2.167-2.62 4.895-3.926 2.594-1.256 6.792-2.415 12.379-3.223a138.8 138.8 0 0116.816-1.181v2.467a20.863 20.863 0 01-2.908 10.7M30.769 91.237a21.121 21.121 0 009.472 7.857 33.892 33.892 0 0013.59 2.5 30.941 30.941 0 0010.476-1.959 33.285 33.285 0 0010.3-6.074c.6-.511 1.163-1.058 1.712-1.616a18.821 18.821 0 002.326 6.6 3.958 3.958 0 003.4 1.9h.008l2.334-.027a3.987 3.987 0 003.931-3.986V53.703a37.4 37.4 0 00-2.9-15.278 23.005 23.005 0 00-9.467-10.685c-4.317-2.545-9.549-3.682-15.492-3.682a35.27 35.27 0 00-15.447 3.141 24.8 24.8 0 00-10.53 9.413l-.018.027a3.449 3.449 0 00-.517 1.817 3.639 3.639 0 002.445 3.423l3.914 1.393a5.519 5.519 0 001.855.321 5.616 5.616 0 004.344-2.072 15.985 15.985 0 011.182-1.3c2.561-2.486 6.361-3.95 12.274-3.973a21.382 21.382 0 017.486 1.168 10.2 10.2 0 014.416 3.1c2.216 2.717 3.61 6.919 3.74 12.942-5.7.089-10.753.329-15.12.735a71.037 71.037 0 00-16.135 3.36h-.018l-.046.014h-.008c-5.147 1.6-9.4 4.091-12.387 7.668a20.779 20.779 0 00-4.5 13.646v.129a22.038 22.038 0 003.39 12.215m41.939-12.914a23.524 23.524 0 01-7.875 8.207 19.354 19.354 0 01-10.63 3.017c-5.021-.008-8.387-1.16-10.661-3.038a8.859 8.859 0 01-2.494-3.231 11.488 11.488 0 01-.852-4.55 10.346 10.346 0 011.329-5.237c.675-1.206 2.167-2.62 4.895-3.926 2.594-1.256 6.792-2.415 12.379-3.221a138.43 138.43 0 0116.816-1.182v2.468a20.857 20.857 0 01-2.908 10.7M397.781 190.866c-3.216 2.572-7.034 3.878-12.106 3.9-6.677-.073-11.042-2.132-14.622-6.535-3.512-4.415-5.512-10.924-5.515-19.981v-.022c0-9.429 1.966-16.114 5.29-20.38a15.612 15.612 0 015.949-4.75 20.986 20.986 0 018.515-1.621 18.214 18.214 0 0112.13 4.062 17.127 17.127 0 014.225 5.3 3.229 3.229 0 003.915 1.616l5.992-2.088a3.214 3.214 0 001.795-4.467 29.734 29.734 0 00-2.467-4.2 28.315 28.315 0 00-10.9-9.263 33.375 33.375 0 00-14.665-3.141h-.081a32.19 32.19 0 00-17.315 4.625 29.766 29.766 0 00-11.422 13.5c-2.6 5.827-3.789 12.784-3.791 20.833a50.163 50.163 0 003.711 20.1 29.983 29.983 0 0011.407 13.71 32.338 32.338 0 0017.666 4.77h.126a32.675 32.675 0 0019.989-6.281 28.651 28.651 0 009.456-13.242 3.183 3.183 0 00-1.958-4.1l-5.865-2.045a3.162 3.162 0 00-4 1.8 18.2 18.2 0 01-5.464 7.905M477.642 171.453a18.27 18.27 0 00-6.117-5.48 19.176 19.176 0 00-2.071-1.021 43.51 43.51 0 00-9.7-2.677q-4.334-.692-8.717-1.222c-.361-.045-.718-.1-1.08-.139a47.73 47.73 0 01-8.186-1.645 9.605 9.605 0 01-4.611-2.779c-.793-.9-1.412-2.364-1.426-5.075a10.228 10.228 0 01.774-4.064 8.947 8.947 0 012.331-3.086c1.98-1.734 5.26-2.907 10.394-2.91 4.841.024 8.311 1.24 11.1 3.547a14.579 14.579 0 014.265 6.8 3.18 3.18 0 004.059 1.974l6.01-2.095a3.189 3.189 0 001.993-4 27.29 27.29 0 00-3.192-6.567 25.077 25.077 0 00-10.308-8.918 32.554 32.554 0 00-13.789-2.794h-.034a30.876 30.876 0 00-14.18 2.99 21.1 21.1 0 00-12 19.33v.075c0 4.427.911 8.387 3.17 11.549a17.923 17.923 0 006.034 5.322 19.329 19.329 0 002.186 1.039 45.5 45.5 0 009.644 2.593c2.133.341 4.268.645 6.4.929 1.109.148 2.216.3 3.325.432a39.317 39.317 0 017.94 1.733 10.551 10.551 0 014.676 2.952c.766.865 1.41 2.392 1.422 5.2a11.592 11.592 0 01-.9 4.644 10.47 10.47 0 01-2.719 3.588c-2.315 2.033-6.109 3.354-11.924 3.357-5.632-.019-9.751-1.412-13-4.024a16.468 16.468 0 01-4.9-6.768 3.158 3.158 0 00-3.974-1.744l-5.844 2.037a3.182 3.182 0 00-1.935 4.162 27.346 27.346 0 008.417 11.54c5.643 4.466 12.834 6.6 21.034 6.6h.112a36.427 36.427 0 0014.136-2.6 24.011 24.011 0 0010.37-8.039 21.652 21.652 0 003.962-12.946v-.07c0-4.513-.9-8.526-3.148-11.738"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Convex',
      url: 'https://convex.dev',
      logo: (
        <svg
          className="w-36"
          viewBox="0 0 382 146"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M114.794 86.6648C111.454 83.6785 109.784 79.2644 109.784 73.434C109.784 67.6036 111.487 63.1896 114.896 60.2033C118.301 57.217 122.959 55.721 128.865 55.721C131.319 55.721 133.486 55.8973 135.372 56.2613C137.258 56.6197 139.063 57.2283 140.786 58.0929V67.5524C138.106 66.2157 135.064 65.5445 131.659 65.5445C128.66 65.5445 126.445 66.1417 125.018 67.3363C123.586 68.5308 122.873 70.5615 122.873 73.434C122.873 76.2099 123.575 78.2178 124.986 79.4578C126.391 80.7035 128.617 81.3236 131.665 81.3236C134.891 81.3236 137.955 80.5329 140.862 78.9573V88.8547C137.636 90.3849 133.615 91.1471 128.801 91.1471C122.797 91.1471 118.133 89.6511 114.794 86.6648Z"
            fill="currentColor"
          />
          <path
            d="M143.77 73.4279C143.77 67.643 145.337 63.246 148.471 60.2312C151.605 57.2165 156.328 55.7148 162.645 55.7148C169.006 55.7148 173.761 57.2222 176.922 60.2312C180.078 63.2403 181.656 67.643 181.656 73.4279C181.656 85.2366 175.318 91.1409 162.645 91.1409C150.06 91.1466 143.77 85.2423 143.77 73.4279ZM167.179 79.4574C168.109 78.2116 168.574 76.2037 168.574 73.4335C168.574 70.7089 168.109 68.7123 167.179 67.4439C166.25 66.1754 164.737 65.544 162.645 65.544C160.603 65.544 159.122 66.1811 158.214 67.4439C157.306 68.7123 156.853 70.7089 156.853 73.4335C156.853 76.2094 157.306 78.2173 158.214 79.4574C159.122 80.7031 160.597 81.3231 162.645 81.3231C164.737 81.3231 166.244 80.6974 167.179 79.4574Z"
            fill="currentColor"
          />
          <path
            d="M184.638 56.4315H196.629L196.97 59.014C198.288 58.0583 199.969 57.2677 202.011 56.6477C204.054 56.0276 206.167 55.7148 208.35 55.7148C212.392 55.7148 215.343 56.7671 217.207 58.8718C219.071 60.9764 220.001 64.2244 220.001 68.627V90.4299H207.194V69.9865C207.194 68.4564 206.864 67.3585 206.205 66.6873C205.546 66.0161 204.443 65.6862 202.898 65.6862C201.947 65.6862 200.968 65.9137 199.969 66.3688C198.969 66.8239 198.131 67.4097 197.445 68.1265V90.4299H184.638V56.4315Z"
            fill="currentColor"
          />
          <path
            d="M220.038 56.4317H233.391L239.524 76.3689L245.658 56.4317H259.011L246.268 90.4301H232.775L220.038 56.4317Z"
            fill="currentColor"
          />
          <path
            d="M263.043 87.5062C259.195 84.4687 257.396 79.1957 257.396 73.5018C257.396 67.9558 258.828 63.3882 262.097 60.2312C265.366 57.0743 270.349 55.7148 276.639 55.7148C282.426 55.7148 286.976 57.1255 290.3 59.9468C293.618 62.7682 295.282 66.6191 295.282 71.4939V77.4494H270.927C271.532 79.2184 272.299 80.4983 274.185 81.289C276.071 82.0796 278.703 82.4721 282.07 82.4721C284.08 82.4721 286.133 82.3071 288.219 81.9715C288.954 81.8521 290.165 81.6644 290.802 81.5222V89.7871C287.619 90.6972 283.377 91.1523 278.595 91.1523C272.159 91.1466 266.89 90.5437 263.043 87.5062ZM281.826 70.1344C281.826 68.4507 279.984 64.8273 276.282 64.8273C272.942 64.8273 270.738 68.3938 270.738 70.1344H281.826Z"
            fill="currentColor"
          />
          <path
            d="M305.338 73.1437L293.346 56.4317H307.245L331.773 90.4301H317.74L312.287 82.825L306.835 90.4301H292.865L305.338 73.1437Z"
            fill="currentColor"
          />
          <path
            d="M317.431 56.4317H331.265L320.647 71.3178L313.622 61.7786L317.431 56.4317Z"
            fill="currentColor"
          />
          <path
            d="M82.2808 87.6517C89.652 86.8381 96.6012 82.9353 100.427 76.4211C98.6156 92.533 80.8853 102.717 66.413 96.4643C65.0795 95.8897 63.9316 94.9339 63.1438 93.705C59.8915 88.6302 58.8224 82.1729 60.3585 76.313C64.7475 83.8399 73.6717 88.4538 82.2808 87.6517Z"
            fill="currentColor"
          />
          <path
            d="M60.0895 71.5852C57.1016 78.4464 56.9722 86.4797 60.6353 93.0906C47.7442 83.453 47.8848 62.8294 60.4778 53.2885C61.6425 52.4067 63.0267 51.8833 64.4785 51.8036C70.4486 51.4907 76.5144 53.7835 80.7683 58.0561C72.1254 58.1415 63.7076 63.643 60.0895 71.5852Z"
            fill="currentColor"
          />
          <path
            d="M84.9366 60.1673C80.5757 54.1253 73.7503 50.0119 66.2722 49.8868C80.7277 43.3669 98.5086 53.9375 100.444 69.5659C100.624 71.0167 100.388 72.4959 99.7409 73.8044C97.04 79.2547 92.032 83.4819 86.1801 85.0464C90.4678 77.144 89.9388 67.4893 84.9366 60.1673Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Remi',
      url: 'https://remihq.com/careers',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20"
          viewBox="0 0 1254 465"
          fill="none"
        >
          <g clip-path="url(#clip0_76_636)">
            <path
              d="M89.9244 190.107V136.156H0V459.861H89.9244V302.503C89.9244 247.262 109.836 210.663 154.153 210.663H207.459V136.156H170.86C131.682 136.156 107.276 149.639 89.9439 190.107H89.9244Z"
              fill="currentColor"
            />
            <path
              d="M1253.45 136.156H1163.53V459.861H1253.45V136.156Z"
              fill="currentColor"
            />
            <path
              d="M1253.45 0H1163.53V89.9244H1253.45V0Z"
              fill="currentColor"
            />
            <path
              d="M1095.37 241.322C1091.38 179.731 1040.15 131.018 977.561 131.018C975.744 131.018 973.926 131.076 972.129 131.154C971.503 131.174 970.898 131.213 970.272 131.252C969.178 131.311 968.103 131.408 967.029 131.487C906.004 136.723 865.107 185.574 865.107 185.574C844.14 152.766 807.385 130.998 765.549 130.998C727.25 130.998 693.211 149.229 671.658 177.484V136.137H581.733V459.822H671.658V267.819C671.658 234.112 698.975 206.775 732.682 206.775C766.389 206.775 793.726 234.112 793.726 267.819V459.822H883.631V267.819C883.631 234.112 910.968 206.775 944.675 206.775C978.382 206.775 1005.7 234.112 1005.7 267.819V459.822H1095.62V249.08C1095.62 246.462 1095.55 243.863 1095.35 241.303L1095.37 241.322Z"
              fill="currentColor"
            />
            <path
              d="M310.339 261.41H453.432C450.833 225.436 425.47 196.536 381.876 196.536C338.281 196.536 312.938 225.436 310.339 261.41ZM310.339 317.92C310.339 323.958 313.407 391.783 388.304 391.783C430.746 391.783 447.746 369.624 453.432 350.045L541.793 350.025C523.035 412.144 470.53 465 385.764 465C277.609 465 221.958 378.925 221.958 297.364C221.958 215.803 272.059 131.018 381.876 131.018C491.692 131.018 541.793 215.158 541.793 297.364V317.92H310.339Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_76_636">
              <rect width="1253.45" height="465" fill="currentColor" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      name: 'Arcjet',
      url: 'https://arcjet.com/?ref=epic-web-2025',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-40"
          fill="none"
          viewBox="0 0 1040 460"
        >
          <path
            fill="currentColor"
            d="M730.356 287.811c-23.741 0-40.79-17.686-40.79-42.064 0-24.219 17.049-41.745 40.152-41.745s40.312 17.526 40.312 41.745c0 1.274-.16 3.186-.319 4.78H707.89c1.752 13.065 10.994 22.147 23.103 22.147 8.604 0 16.571-4.621 20.554-11.472l14.34 9.241c-7.17 10.357-21.032 17.368-35.531 17.368m-21.67-50.827h42.224c-2.868-10.676-10.994-17.846-21.192-17.846-10.197 0-18.164 7.17-21.032 17.846m-54.387 50.558v-81.451h18.477v85.818c0 11.254-2.183 19.485-6.719 24.356-5.207 5.879-12.43 8.735-21.668 8.735l-5.04-16.629q8.316 0 11.591-4.536c2.183-3.191 3.359-8.566 3.359-16.293m20.811-111.867c0 6.411-5.197 11.608-11.609 11.608-6.411 0-11.608-5.197-11.608-11.608s5.197-11.609 11.608-11.609 11.609 5.197 11.609 11.609m117.102-.005h18.482v30.403h16.093v15.137h-16.093v64.529h-18.482V221.21h-13.013v-15.137h13.013z"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m398.096 285.739 14.944-30.251h56.808l14.761 30.251h19.276L441.442 158 379 285.739zm22.686-46.072 20.66-42.1 20.661 42.1z"
            clipRule="evenodd"
          />
          <path
            fill="currentColor"
            d="M636.593 233.276c-5.783-7.374-12.766-13.353-25.807-13.353-13.544 0-23.422 10.846-23.422 25.983 0 14.977 9.878 25.971 23.422 25.971 13.041 0 20.024-6.117 25.807-13.475v20.959c-6.947 5.322-15.795 8.45-25.807 8.45-24.06 0-41.427-17.686-41.427-41.905 0-24.378 17.367-41.904 41.427-41.904 9.978 0 18.872 3.034 25.807 8.324zm-103.542 52.463h-18.436v-79.627h18.436v7.629c3.552-3.979 6.508-6.305 8.909-7.437 2.842-1.339 5.983-2.203 9.67-2.203s9.914 1.508 15.11 4.693l-8.38 16.76c-3.52-2.514-6.872-3.687-10.224-3.687q-15.085 0-15.085 22.626zm-247.787-56.687c12.613 3.223 23.038 5.806 44.736 10.618-21.698 4.812-32.123 7.395-44.736 10.618a11.99 11.99 0 0 0-8.646 8.646c-3.223 12.609-5.807 23.039-10.618 44.736-4.811-21.697-7.395-32.127-10.618-44.736a11.99 11.99 0 0 0-8.646-8.646c-12.613-3.223-23.038-5.806-44.736-10.618 21.698-4.812 32.123-7.395 44.736-10.618a11.99 11.99 0 0 0 8.646-8.646c3.223-12.609 5.807-23.039 10.618-44.736 4.811 21.697 7.395 32.127 10.618 44.736a11.99 11.99 0 0 0 8.646 8.646"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m174.499 236.17 3.501 3.501-3.501 3.501c-32.237-2.368-62.608-2.703-111.542-3.242-7.226-.08-14.856-.164-22.957-.259 7.979-.094 15.502-.177 22.63-.256 49.126-.541 79.56-.877 111.869-3.245M956 230c0 79.642-72.998 145.735-151.51 145.75h-.054q-.593 0-1.185-.005C883.17 375.073 947.75 310.078 947.75 230S883.17 84.927 803.25 84.255q.586-.005 1.172-.005h.082C883.011 84.273 956 150.363 956 230"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
}

const HotelSection = () => {
  return (
    <section className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between gap-8 px-5 pb-0 sm:pb-24 md:flex-row lg:gap-14">
      <div>
        <Link
          href="https://book.passkey.com/event/50932723/owner/1422/home"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center justify-center before:absolute before:-bottom-1.5 before:h-3 before:w-3 before:rotate-45 before:border-b before:border-r before:border-[#313646] before:bg-[#1E212C] before:content-[''] md:before:-right-1.5 md:before:top-10 md:before:border-b-0 md:before:border-r md:before:border-t md:before:border-[#313646] md:before:bg-[#1E212C]"
        >
          <div className="flex items-center justify-center rounded-t border border-[#313646] bg-[#1E212C]">
            <div className="flex items-center justify-center overflow-hidden rounded-tl">
              <Image
                src="/assets/conf/hilton-salt-lake-city-center.jpg"
                alt="Hilton Salt Lake City Center"
                width={180}
                height={180}
                priority
                className="transition duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="px-4 py-2 pr-5 sm:px-5 sm:py-5 sm:pr-7">
              <h3 className="text-lg font-semibold leading-tight sm:text-xl sm:leading-tight">
                Hilton Salt Lake City Center
              </h3>
              <div className="mt-3 inline-flex text-sm">
                255 S W Temple St
                <br />
                Salt Lake City, UT 84101
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="w-full max-w-md text-center md:text-left lg:max-w-lg">
        <h3 className="text-2xl font-semibold sm:text-3xl">
          Looking for a place to stay?
        </h3>
        <div className="mt-3 text-[#D6DEFF] sm:text-lg">
          <span>
            We've partnered with Hilton Salt Lake City Center to offer you a
            discounted rate on available rooms. Visit{' '}
            <a
              href="https://book.passkey.com/event/50932723/owner/1422/home"
              className="underline"
            >
              here
            </a>{' '}
            to find your discounted room and book your stay today.
          </span>
        </div>
      </div>
    </section>
  )
}

const speakerData = [
  {
    id: '1',
    fullName: 'Aaron Francis',
    x: 'https://x.com/aarondfrancis',
    bluesky: 'https://bsky.app/profile/aaronfrancis.com',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734117160/epic-web/conf-2025/aaron-francis.jpg',
  },
  {
    id: '2',
    fullName: 'Alex Anderson',
    x: 'https://x.com/ralex1993',
    bluesky: 'https://bsky.app/profile/ralexanderson.com',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734117159/epic-web/conf-2025/alex-anderson.jpg',
  },
  {
    id: '3',
    fullName: 'Annie Sexton',
    bluesky: 'https://bsky.app/profile/anniesexton.com',
    x: 'https://x.com/_anniebabannie_',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734117159/epic-web/conf-2025/annie-sexton.jpg',
  },
  {
    id: '4',
    fullName: 'Dax Raad',
    x: 'https://x.com/thdxr',
    bluesky: 'https://bsky.app/profile/thdxr.com',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734117159/epic-web/conf-2025/dax-raad.jpg',
  },
  {
    id: '5',
    fullName: 'Kent C. Dodds',
    x: 'https://x.com/kentcdodds',
    bluesky: 'https://bsky.app/profile/kentcdodds.com',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734117159/epic-web/conf-2025/kent.jpg',
  },
  {
    id: '6',
    fullName: 'Madison Kanna',
    x: 'https://x.com/Madisonkanna',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734123802/epic-web/conf-2025/madison.jpg',
  },
  {
    id: '7',
    fullName: 'Ryan Florence',
    x: 'https://x.com/ryanflorence',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734368200/epic-web/conf-2025/ryan-florence.png',
  },
  {
    id: '8',
    fullName: 'Zack Jackson',
    x: 'https://x.com/ScriptedAlchemy',
    bluesky: 'https://bsky.app/profile/scriptedalchemy.bsky.social',
    profilePicture:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1734368200/epic-web/conf-2025/zack-jackson.png',
  },
]

type hardCodedSpeaker = {
  id: string
  fullName: string
  x?: string
  bluesky?: string
  profilePicture: string
}

const SpeakersList: React.FC<{
  speakers: Speaker[]
  showingSpeakerDetail: boolean | Speaker
  setShowingSpeakerDetail: React.Dispatch<
    React.SetStateAction<boolean | Speaker>
  >
}> = ({speakers, showingSpeakerDetail, setShowingSpeakerDetail}) => {
  const [hoveredItem, setHoveredItem] = React.useState<Speaker | null>()
  const [isHovering, setIsHovering] = React.useState(false)

  const router = useRouter()

  return (
    <>
      <section
        id="speakers"
        aria-label="speakers"
        className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center"
      >
        <h2 className="w-full px-5 pb-5 text-3xl font-bold sm:text-4xl">
          Speakers
        </h2>
        <div className="grid grid-cols-2 px-3 sm:grid-cols-3 sm:px-0 lg:grid-cols-4">
          {speakers.map((speaker) => {
            return (
              <Link
                key={speaker.id}
                href={`/conf/${slugify(speaker.fullName)}`}
                onClick={() => {
                  track('clicked speaker', {
                    title: 'conf2024',
                    type: 'speaker',
                    location: speaker.fullName,
                  })
                }}
              >
                <motion.div
                  onMouseEnter={() => {
                    setHoveredItem(speaker)
                    setIsHovering(true)
                  }}
                  onMouseLeave={() => {
                    setIsHovering(false)
                  }}
                  className="relative flex flex-col items-center p-2 sm:p-6"
                  // tabIndex={0}
                  // aria-haspopup={!speaker?.video && 'dialog'}
                  // aria-expanded={showingSpeakerDetail ? 'true' : 'false'}
                >
                  <motion.div
                    animate={{
                      filter:
                        isHovering && hoveredItem?.id !== speaker.id
                          ? 'saturate(0.5)'
                          : 'saturate(1)',
                    }}
                    className="relative bg-gray-950"
                  >
                    {speaker.profilePicture && (
                      <Image
                        loading="eager"
                        className="rounded opacity-90"
                        src={speaker.profilePicture}
                        alt={speaker.fullName}
                        width={230}
                        height={230}
                      />
                    )}
                    {speaker?.video ? (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                        }}
                        animate={{
                          opacity:
                            isHovering && hoveredItem?.id === speaker.id
                              ? 1
                              : 0,
                          scale:
                            isHovering && hoveredItem?.id === speaker.id
                              ? 1
                              : 0.9,
                        }}
                        className="absolute bottom-3 right-3 flex items-center justify-center rounded-full bg-gray-900"
                      >
                        <PlayIcon className="h-5 w-5" />
                      </motion.div>
                    ) : null}
                  </motion.div>
                  <h3 className="w-full pt-4 text-lg font-semibold leading-tight">
                    {speaker.fullName}
                  </h3>
                  <h4 className="w-full pt-1 text-sm text-[#D6DEFF]">
                    {speaker.tagLine}
                  </h4>
                  <AnimatePresence mode="wait">
                    {isHovering && hoveredItem?.id !== speaker.id && (
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        exit={{opacity: 0}}
                        animate={{
                          opacity: [0, 0.4],
                        }}
                        className="absolute h-full w-full bg-foreground dark:bg-background"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </section>
      {/* <SpeakerDetail
        speakers={speakers}
        showingSpeakerDetail={showingSpeakerDetail}
        setShowingSpeakerDetail={setShowingSpeakerDetail}
      /> */}
    </>
  )
}
