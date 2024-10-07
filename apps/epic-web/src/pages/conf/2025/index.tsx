import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import HeroPlanetImage from '../../../../public/assets/conf/conf-hero.jpg'
import {ChevronRightIcon, PlayIcon} from '@heroicons/react/solid'
import {Button} from '@skillrecordings/ui'
import {track} from 'utils/analytics'
import {DocumentIcon, StarIcon} from '@heroicons/react/outline'
import {type Talk} from 'lib/talks'

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
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1705997895/conf-card_2x.jpg',
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
  return (
    <div className="mx-auto w-full max-w-screen-lg space-y-10">
      <div>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Become an Attendee
        </h2>

        <p className="my-4 ml-4 text-base text-white">
          Epic Web Conf is your opportunity to join other full stack web
          developers from all over the world to collaborate on the present and
          future state of the art of building the absolute best user and
          developer experiences possible.
        </p>
        <p className="my-4 ml-4 text-base text-white">
          Right now we are offering super early bird tickets, this is the
          cheapest the price will be and the price goes up soon.
        </p>
        <Button
          asChild
          className="ml-4 h-12 rounded-sm bg-gradient-to-tr from-gray-50 to-gray-100 font-mono text-sm font-bold uppercase tracking-wide text-gray-950 shadow-soft-2xl transition hover:brightness-110 sm:text-base"
          size="lg"
        >
          <Link
            href={CONF_25_TITO_URL}
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => {
              track('clicked buy tickets', {
                title: 'conf2025',
                type: 'event',
                location: 'bottom',
              })
            }}
          >
            Buy Early Bird Tickets{' '}
            <ChevronRightIcon className="-mr-2 ml-2 w-4" />
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold sm:text-3xl ">
          Become a Speaker
        </h2>
        <p className="ml-4 text-base text-white">
          We want to see how you are making the web{' '}
          <span className="font-bold text-[#93A1D7]">EPIC</span>. This
          conference is about inspiring us to do and be more.
        </p>
        <p className="ml-4 text-base text-white">
          Here are some general categories of what would make a great talk at
          Epic Web Conf 2025:
        </p>
        <ol className="ml-4 list-inside list-decimal text-base text-white">
          {epicTalkIdeas.map((idea, index) => (
            <li key={index}>{idea}</li>
          ))}
        </ol>
        <Button
          asChild
          className="ml-4 h-12 rounded-sm bg-gradient-to-tr from-gray-50 to-gray-100 font-mono text-sm font-bold uppercase tracking-wide text-gray-950 shadow-soft-2xl transition hover:brightness-110 sm:text-base"
          size="lg"
        >
          <Link
            href={CONF_25_SESSIONIZE_URL}
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => {
              track('clicked submit a talk', {
                title: 'conf2025',
                type: 'event',
                location: 'bottom',
              })
            }}
          >
            Submit a Talk <ChevronRightIcon className="-mr-2 ml-2 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold sm:text-3xl">Become a Sponsor</h2>
        <p className="ml-4 text-base text-white">
          Epic Web Conf is made possible by the support of our sponsors.
        </p>
        <p className="ml-4 text-base text-white">
          Last year was EPIC and we'd love to parter with you to make 2025 even
          better.
        </p>
        <Button
          asChild
          className="ml-4 h-12 rounded-sm bg-gradient-to-tr from-gray-50 to-gray-100 font-mono text-sm font-bold uppercase tracking-wide text-gray-950 shadow-soft-2xl transition hover:brightness-110 sm:text-base"
          size="lg"
        >
          <Link
            href="mailto:conf@epicweb.dev?subject=Sponsoring Epic Web Conf 2025"
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => {
              track('clicked become a sponsor', {
                title: 'conf2025',
                type: 'event',
                location: 'bottom',
              })
            }}
          >
            Sponsor Epic Web Conf
            <ChevronRightIcon className="-mr-2 ml-2 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <header className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#080B16]">
      <div className="relative z-10 mx-auto w-full max-w-screen-lg px-5 pb-16 pt-16 sm:pb-48 sm:pt-48">
        <h1 className="max-w-xl text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
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
      </div>
      <div className="absolute bottom-0 right-[-370px] flex items-center justify-center sm:bottom-auto sm:right-[-690px] xl:right-[-600px] 2xl:right-[-370px]">
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
    <section className="mt-20">
      <Link
        href="/conf/code-of-conduct"
        className="inline-flex w-full items-center justify-center gap-1 text-center text-[#93A1D7] transition hover:brightness-125"
      >
        <DocumentIcon
          className="w-4"
          stroke="currentColor"
          aria-hidden="true"
        />
        Code of Conduct
      </Link>
      <div className=" relative flex w-full flex-col items-center justify-center overflow-hidden px-5 pb-16">
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
          <div
            className="absolute bottom-0 left-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-20"
            aria-hidden="true"
          />
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
