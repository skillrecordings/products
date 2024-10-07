import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import HeroPlanetImage from '../../../../public/assets/conf/conf-hero.jpg'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
} from '@heroicons/react/solid'
import {AnimatePresence, motion} from 'framer-motion'
import {format, parseISO} from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@skillrecordings/ui'
import {GetStaticProps} from 'next'
import {useKey} from 'react-use'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import {useRouter} from 'next/router'
import {shuffle} from 'lodash'
import {track} from 'utils/analytics'
import {cn} from '@skillrecordings/ui/utils/cn'
import {DocumentIcon, StarIcon} from '@heroicons/react/outline'
import {DialogTrigger} from '@radix-ui/react-dialog'
import {EventJsonLd} from '@skillrecordings/next-seo'
import Balancer from 'react-wrap-balancer'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import slugify from '@sindresorhus/slugify'
import {
  getAllConf24Talks,
  getConfTalkBySpeaker,
  getConfTalkByTitle,
  type Talk,
} from 'lib/talks'
import {trpc} from 'trpc/trpc.client'
import Icon from 'components/icons'

export const IS_PAST_CONF_24 = true
export const CONF_24_TITO_URL = 'https://ti.to/epicweb/epicweb-conf-2024'

const CK_CONF_2024_FIELD = {
  [`conf_2024`]: new Date().toISOString().slice(0, 10),
}
const HOTEL_PROMO_CODE = 'W14'

export const getStaticProps: GetStaticProps = async () => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())
  const schedule: Schedule = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/GridSmart',
  ).then((res) => res.json())
  const talks = await getAllConf24Talks(4)
  const scheduleWithTalks = await Promise.all(
    schedule.map(async (day) => {
      const rooms = await Promise.all(
        day.rooms.map(async (room) => {
          const sessions = await Promise.all(
            room.sessions.map(async (session) => {
              const speakerName = session.speakers[0]?.name
              const talkByTitle = session.title
                ? await getConfTalkByTitle(session.title)
                : null
              const talkBySpeaker = speakerName
                ? await getConfTalkBySpeaker(speakerName)
                : null
              return {...session, talk: talkByTitle || talkBySpeaker || null}
            }),
          )
          return {...room, sessions}
        }),
      )
      return {...day, rooms}
    }),
  )
  let speakersWithVideos = []
  for (const speaker of speakers) {
    const video = await sanityClient.fetch(groq`
    *[_type == "videoResource" && slug.current == 'conf-interview-${slugify(
      speaker.fullName,
    )}'][0] {
      _id,
      "_type": "tip",
      "slug": slug.current,
      "muxPlaybackId": muxAsset.muxPlaybackId,
      transcript { text },
      "videoResourceId": _id,
      poster,
    }
  `)
    const newSpeaker = {...speaker, video}
    speakersWithVideos.push(newSpeaker)
  }

  return {
    props: {
      speakers: speakersWithVideos.filter(
        (speaker) => !speaker.fullName.includes('DevTools'),
      ),
      schedule: scheduleWithTalks,
      talks,
    },
    revalidate: IS_PAST_CONF_24 ? false : 60 * 5,
  }
}

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

const ConfPage: React.FC<{
  speakers: Speaker[]
  schedule: Schedule
  talks: Talk[]
}> = ({speakers, schedule, talks}) => {
  const [showingSpeakerDetail, setShowingSpeakerDetail] = React.useState<
    boolean | Speaker
  >(false)
  const router = useRouter()
  const [shuffledSpeakers, setShuffledSpeakers] = React.useState<Speaker[]>([])
  React.useEffect(() => {
    setShuffledSpeakers(shuffle(speakers))
  }, [])

  const {data: livestreamData, status: livestreamStatus} =
    trpc.conf.livestream.useQuery()

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
    </Layout>
  )
}

export default ConfPage

const Header = () => {
  const {data: livestreamData, status: livestreamStatus} =
    trpc.conf.livestream.useQuery()

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

export const Schedule: React.FC<{
  schedule: Schedule
  speakers: Speaker[]
  title?: string
}> = ({schedule, speakers, title = 'Schedule'}) => {
  return (
    <section
      id="schedule"
      aria-label="schedule"
      className="mx-auto w-full max-w-screen-lg sm:p-4"
    >
      <div className="item-scenter flex w-full flex-col justify-between gap-5 md:flex-row">
        <h2 className="px-4 pb-10 text-4xl font-bold sm:px-0 sm:text-5xl print:hidden">
          {title}
        </h2>
        <button
          type="button"
          className="hidden h-10 items-center justify-center whitespace-nowrap rounded-md border border-white/10 bg-foreground px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-input dark:bg-background dark:hover:bg-white/5 md:inline-flex print:hidden"
          onClick={() => {
            const scheduleRoute = window.open('/conf/schedule', '_blank')
            scheduleRoute?.print()
          }}
        >
          Save as PDF
        </button>
      </div>
      {schedule.map((day) => (
        <div key={day.date} className="mb-8">
          <h2 className="mb-4 px-4 text-2xl font-bold sm:px-0 print:text-black">
            {format(parseISO(day.date), 'EEEE, dd/MM/yyyy')}
          </h2>
          {day.rooms.map((room) => (
            <div key={room.id} className="mb-6">
              <h3 className="mb-2 px-4 text-lg font-semibold sm:px-0 print:text-black">
                Room: {room.name}
              </h3>
              <Accordion type="multiple" className="w-full">
                <ul className="flex flex-col divide-y divide-white/10">
                  {room.sessions.map((session) => {
                    const hasMultipleSpeakers = session?.speakers?.length > 1
                    const speaker = session?.speakers[0]?.name
                    const talk = session?.talk

                    const Speaker: React.FC<{
                      className?: string
                      speaker: string
                    }> = ({className, speaker}) => {
                      return (
                        <div className={cn('items-center gap-2', className)}>
                          {getProfilePictureForWorkshopInstructor(
                            speaker,
                            speakers,
                          ) && (
                            <Image
                              alt=""
                              aria-hidden="true"
                              src={getProfilePictureForWorkshopInstructor(
                                speaker,
                                speakers,
                              )}
                              width={40}
                              height={40}
                              className="w-8 rounded-full md:w-auto"
                            />
                          )}
                          <span className="text-sm leading-tight">
                            {speaker}
                          </span>
                        </div>
                      )
                    }

                    const AccordionTriggerComp = talk
                      ? 'div'
                      : session.description
                      ? AccordionTrigger
                      : 'div'

                    return (
                      <AccordionItem
                        value={session.id}
                        key={session.id}
                        className="border-b-0"
                        asChild
                      >
                        <li>
                          <AccordionTriggerComp
                            className={cn(
                              'w-full px-2 [&_[data-chevron]]:print:hidden',
                              {
                                'transition hover:bg-white/5':
                                  session.description,
                                'pr-6': !session.description,
                              },
                            )}
                          >
                            <div
                              className={cn(
                                'md:group flex w-full items-start gap-3 py-2 md:items-center',
                                {
                                  '': session.title === 'Break',
                                },
                              )}
                            >
                              <div className="flex w-full max-w-[80px] items-center pt-2 text-[#D6DEFF] md:max-w-[160px] md:pt-0 print:text-black">
                                <p className="whitespace-nowrap text-left text-xs font-semibold tabular-nums leading-none md:text-sm md:font-medium">
                                  {format(
                                    parseISO(session.startsAt),
                                    'hh:mm a',
                                  )}{' '}
                                  {'–'} <br className="block md:hidden" />
                                  {format(
                                    parseISO(session.endsAt),

                                    'hh:mm a',
                                  )}
                                </p>
                              </div>
                              <div className="col-span-4 w-full md:col-span-3">
                                <div className="flex w-full flex-col items-start gap-2 text-left md:flex-row md:items-center">
                                  <h4 className="w-full font-semibold leading-tight sm:text-lg print:text-black">
                                    {session.title}
                                  </h4>
                                  {talk &&
                                    !session.title.includes(
                                      'OPTIONAL WORKSHOP REQUIRES A SEPARATE TICKET',
                                    ) && (
                                      <Button
                                        asChild
                                        size="sm"
                                        variant="secondary"
                                        className="inline-flex font-semibold"
                                      >
                                        <Link href={`/talks/${talk.slug}`}>
                                          Watch{' '}
                                          <Icon
                                            name="Playmark"
                                            className="ml-2 h-3 w-3"
                                          />
                                        </Link>
                                      </Button>
                                    )}
                                  {hasMultipleSpeakers ? (
                                    <div className="flex w-full items-center gap-2 md:hidden">
                                      {session?.speakers?.map((speaker) => {
                                        return (
                                          <Speaker
                                            key={speaker.name}
                                            speaker={speaker.name}
                                            className="mt-2 flex w-full max-w-none md:hidden print:text-black"
                                          />
                                        )
                                      })}
                                    </div>
                                  ) : (
                                    <>
                                      {speaker && (
                                        <Speaker
                                          speaker={speaker}
                                          className="mt-2 flex md:hidden print:text-black"
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                                {/* <p className="text-sm">{session.description}</p> */}
                              </div>
                              {hasMultipleSpeakers ? (
                                <div className="hidden w-full items-center gap-2 md:flex">
                                  {session?.speakers?.map((speaker) => {
                                    return (
                                      <Speaker
                                        key={speaker.name}
                                        speaker={speaker.name}
                                        className="hidden w-full max-w-[200px] md:flex"
                                      />
                                    )
                                  })}
                                </div>
                              ) : (
                                <>
                                  {speaker && (
                                    <Speaker
                                      speaker={speaker}
                                      className="hidden w-full max-w-[200px] md:flex"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </AccordionTriggerComp>
                          <AccordionContent>
                            <p className="px-4 pb-5 text-left text-sm leading-relaxed text-[#D6DEFF] md:ml-[160px] md:px-5 md:text-base print:text-black">
                              {session.description}
                            </p>
                          </AccordionContent>
                        </li>
                      </AccordionItem>
                    )
                  })}
                </ul>
              </Accordion>
            </div>
          ))}
        </div>
      ))}
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
