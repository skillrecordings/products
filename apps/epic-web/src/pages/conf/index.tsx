import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import HeroPlanetImage from '../../../public/assets/conf/conf-hero.jpg'
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
import {getAllConf24Talks, type Talk} from 'lib/talks'
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
  const schedule = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/GridSmart',
  ).then((res) => res.json())
  const talks = await getAllConf24Talks(4)

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
      schedule,
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
      className="bg-foreground text-background dark:bg-background dark:text-foreground"
      meta={{
        title: 'Epic Web Conf 2024',
        titleAppendSiteName: false,
        description:
          'The Full Stack Web Development Conference of Epic proportions.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1705997895/conf-card_2x.jpg',
        },
      }}
    >
      <EventJsonLd
        name="Epic Web Conf 2024"
        startDate="2024-04-10T08:00:00-07:00"
        endDate="2024-04-11T17:00:00-07:00"
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
      />
      <Header />
      {talks && IS_PAST_CONF_24 ? (
        <Talks talks={talks} />
      ) : livestreamData?.showLivestream ? (
        <div className="relative z-10 mx-auto mb-16 w-full max-w-screen-lg px-5 sm:-mt-24">
          <iframe
            src="https://www.youtube.com/embed/8117-JmjgOA?si=KX7jZhIPULbqGZm-"
            title="YouTube video player"
            className="aspect-video w-full rounded border border-white/5"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : null}
      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-screen-lg grid-cols-1 gap-5 px-5 sm:grid-cols-2 sm:gap-10 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-[#D6DEFF]">
          <div>
            <p>
              You are an Epic web developer (or you want to be). You want to be
              involved in the kinds of conversations that start great open
              source projects, web experiences, and companies.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <p>
              Epic Web Conf is your opportunity to join other full stack web
              developers from all over the world to collaborate on the present
              and future state of the art of building the absolute best user and
              developer experiences possible.
            </p>
            <p>
              The highly curated topics and expert speakers provide a fantastic
              environment for conversations before, during, and after the event.
            </p>
          </div>
        </section>
        <section className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pb-16 pt-10 sm:pt-16">
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
                The event is set at the foot of the beautiful Rocky Mountains in{' '}
                <strong>
                  <Link
                    href="https://maps.app.goo.gl/cic8yYJ35ER1JM32A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Park City, Utah
                  </Link>
                </strong>
                {', and the '}
                <strong>
                  <Link
                    href="https://www.youtube.com/watch?v=Q0fwzlwTLWk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    free live stream
                  </Link>
                </strong>
                {
                  ' is there to reach even the most distant Epic web developers.'
                }
              </p>
              <p>
                You'll want to be here in Park City to rub shoulders with some
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
                  src={require('../../../public/assets/conf/venue-map-2.png')}
                  loading="eager"
                  alt=""
                  aria-hidden="true"
                  quality={100}
                />
              </div>
              <Link
                href="https://maps.app.goo.gl/hhuhKHLTbANYyo41A"
                target="_blank"
                onClick={() => {
                  track('clicked venue', {
                    title: 'conf2024',
                    type: 'venue',
                    location: 'map',
                  })
                }}
                rel="noopener noreferrer"
                className="group absolute -bottom-16 flex scale-[0.8] items-center justify-center rounded bg-white text-gray-900 before:absolute before:-top-1.5 before:-ml-7 before:h-3 before:w-3 before:rotate-45 before:bg-white before:content-[''] sm:-bottom-10 sm:scale-100"
              >
                <div className="overflow-hidden rounded-l">
                  <Image
                    src={require('../../../public/assets/conf/venue-photo-2.jpg')}
                    alt="Prospector Square Theatre"
                    width={152}
                    height={152}
                    loading="eager"
                    className="transition duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
                <div className="px-4 py-2 pr-5 sm:px-5 sm:py-5 sm:pr-7">
                  <h3 className="text-lg font-semibold leading-tight sm:text-xl sm:leading-tight">
                    Prospector Square Theatre
                  </h3>
                  <div className="mt-3 inline-flex text-sm hover:underline">
                    2175 Sidewinder Dr
                    <br />
                    Park City, UT, 84060
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        <SpeakersList
          speakers={shuffledSpeakers}
          showingSpeakerDetail={showingSpeakerDetail}
          setShowingSpeakerDetail={setShowingSpeakerDetail}
        />
        {/* <p className="mb-16 block w-full text-center font-mono text-sm uppercase text-[#93A1D7]">
          <span aria-hidden="true">{'//'}</span> Full schedule TBA{' '}
          <span aria-hidden="true">{'//'}</span>
        </p> */}
        <Schedule schedule={schedule} speakers={speakers} />
        <Workshops speakers={speakers} />
        <HotelSection />
        <Sponsors />
        {!CONF_24_TITO_URL && (
          <>
            <h2 className="pb-5 pt-3 text-center text-3xl font-semibold">
              Front Row News
            </h2>
            <SubscribeToConvertkitForm
              onSuccess={(subscriber: any) => {
                if (subscriber) {
                  const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                  router.push(redirectUrl)
                }
              }}
              className="mx-auto mb-3 flex w-full max-w-2xl flex-col items-end gap-3 px-5 sm:flex-row"
              submitButtonElem={<Button size="sm">Follow Epic Web Conf</Button>}
              fields={CK_CONF_2024_FIELD}
              actionLabel="Follow Epic Web Conf"
            />
          </>
        )}
        {!IS_PAST_CONF_24 && <BuyTicketsCTA />}
      </main>
    </Layout>
  )
}

export default ConfPage

const SpeakerDetail: React.FC<{
  speakers: Speaker[]
  showingSpeakerDetail: boolean | Speaker
  setShowingSpeakerDetail: React.Dispatch<
    React.SetStateAction<boolean | Speaker>
  >
}> = ({speakers, showingSpeakerDetail, setShowingSpeakerDetail}) => {
  const {
    firstName,
    fullName,
    bio,
    sessions,
    id,
    isTopSpeaker,
    lastName,
    profilePicture,
    tagLine,
  } = showingSpeakerDetail as Speaker
  const index = speakers.findIndex((speaker) => speaker.id === id)
  const prevSpeaker = speakers[index - 1]
  const nextSpeaker = speakers[index + 1]
  const firstSpeaker = speakers[0]
  const lastSpeaker = speakers[speakers.length - 1]

  const handleViewNextSpeaker = () => {
    if (nextSpeaker) {
      setShowingSpeakerDetail(nextSpeaker)
    } else {
      setShowingSpeakerDetail(firstSpeaker)
    }
  }

  const handleViewPrevSpeaker = () => {
    if (prevSpeaker) {
      setShowingSpeakerDetail(prevSpeaker)
    } else {
      setShowingSpeakerDetail(lastSpeaker)
    }
  }

  useKey(
    'ArrowRight',
    (event) => {
      if (!showingSpeakerDetail) return
      if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
        return
      handleViewNextSpeaker()
    },
    {},
    [nextSpeaker, firstSpeaker],
  )

  useKey(
    'ArrowLeft',
    (event) => {
      if (!showingSpeakerDetail) return
      if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
        return
      handleViewPrevSpeaker()
    },
    {},
    [prevSpeaker, lastSpeaker],
  )

  return (
    <Dialog
      key={id}
      onOpenChange={() => setShowingSpeakerDetail(false)}
      open={Boolean(showingSpeakerDetail)}
    >
      <DialogContent
        onOpenAutoFocus={() => {}}
        className="z-[100] flex h-full max-h-full flex-col items-center border-[#313646] bg-[#1E212C] p-5 sm:max-h-[550px] sm:p-10"
      >
        <DialogHeader className="flex flex-col items-center">
          <Image
            src={profilePicture}
            alt={fullName}
            width={300}
            height={300}
            className="max-w-[240px] rounded sm:-mt-24 sm:max-w-full"
          />
          <DialogTitle className="pt-5 text-2xl">{fullName}</DialogTitle>
          <p className="pb-3 text-[#D6DEFF] sm:text-lg">{tagLine}</p>
          <DialogDescription className="h-[80px] overflow-y-auto text-left text-base leading-relaxed text-[#D6DEFF] opacity-90 scrollbar-thin scrollbar-thumb-foreground/50 sm:h-[150px]">
            {bio}
          </DialogDescription>
        </DialogHeader>
        <div className="absolute bottom-5 flex flex-row-reverse gap-2 sm:-right-12 sm:top-0 sm:flex-col">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              handleViewNextSpeaker()
            }}
            className="border border-[#313646]"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="border border-[#313646]"
            onClick={() => {
              handleViewPrevSpeaker()
            }}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const Header = () => {
  const {data: livestreamData, status: livestreamStatus} =
    trpc.conf.livestream.useQuery()

  return (
    <header className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#080B16]">
      <div className="relative z-10 mx-auto w-full max-w-screen-lg px-5 pb-16 pt-16 sm:pb-48 sm:pt-48">
        <h1 className="max-w-xl text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          <span className="font-normal">Epic Web</span> Conference 2024
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
            <div className="text-lg text-[#D6DEFF]">April 11th, 2024</div>
          </div>
          <div>
            <div className="font-mono text-sm uppercase tracking-wide text-[#93A1D7]">
              Workshop Day
            </div>
            <div className="text-lg text-[#D6DEFF]">April 10th, 2024</div>
          </div>
          <div>
            <div className="font-mono text-sm uppercase tracking-wide text-[#93A1D7]">
              Location
            </div>
            <div className="text-lg text-[#D6DEFF]">Park City, UT</div>
          </div>
        </div>
        {livestreamData?.showLivestream ? (
          <Button
            asChild
            className="mt-10 h-12 gap-2 rounded-sm bg-gradient-to-b from-red-500 to-red-600 font-mono text-base font-bold uppercase tracking-wide text-white transition hover:brightness-110"
            size="lg"
          >
            <Link
              href={livestreamData.livestreamUrl}
              target="_blank"
              onClick={() => {
                track('clicked watch live', {
                  title: 'conf2024',
                  type: 'event',
                  location: 'top',
                })
              }}
            >
              <Icon name="Playmark" className="w-3" />
              {'Watch Live'}
            </Link>
          </Button>
        ) : (
          <>
            {IS_PAST_CONF_24 ? (
              <Button
                asChild
                className="mt-10 h-12 rounded-sm bg-gradient-to-b from-[#50BBFF] to-[#6397FF] font-mono text-base font-bold uppercase tracking-wide text-gray-950 transition hover:brightness-110"
                size="lg"
              >
                <Link
                  href="/talks"
                  onClick={() => {
                    track('clicked watch recordings', {
                      title: 'conf2024',
                      type: 'event',
                      location: 'top',
                    })
                  }}
                >
                  Watch Recordings
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                className="mt-10 h-12 rounded-sm bg-gradient-to-b from-red-500 to-red-600 font-mono text-base font-bold uppercase tracking-wide text-white transition hover:brightness-110"
                size="lg"
              >
                {CONF_24_TITO_URL && (
                  <Link
                    href={CONF_24_TITO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      track('clicked buy tickets', {
                        title: 'conf2024',
                        type: 'event',
                        location: 'top',
                      })
                    }}
                  >
                    Buy Tickets <ChevronRightIcon className="-mr-2 ml-2 w-4" />
                  </Link>
                )}
              </Button>
            )}
          </>
        )}
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
          src={require('../../../public/assets/conf/ship@2x.png')}
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
        className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pb-16 pt-10"
      >
        <h2 className="w-full pb-10 text-4xl font-bold sm:text-5xl">
          Speakers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
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

const workshopsData = [
  {
    title: 'Advanced React Patterns',
    image: (
      <svg
        aria-hidden="true"
        className="w-32"
        // width="152"
        // height="152"
        viewBox="0 0 152 152"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="151"
          height="151"
          rx="5"
          stroke="#2A2E3F"
        />
        <path
          d="M83.5 76C83.5 79.5579 80.399 82.5 76.5 82.5C72.601 82.5 69.5 79.5579 69.5 76C69.5 72.4421 72.601 69.5 76.5 69.5C80.399 69.5 83.5 72.4421 83.5 76Z"
          stroke="#A3ABC6"
        />
        <path
          d="M76.5 94.75C103.286 94.75 125 86.4591 125 76.2318C125 66.0045 103.286 57.7136 76.5 57.7136C49.7142 57.7136 28 66.0045 28 76.2318C28 86.4591 49.7142 94.75 76.5 94.75Z"
          stroke="#A3ABC6"
        />
        <path
          d="M60.4627 85.4909C73.8556 108.688 91.8928 123.348 100.75 118.234C109.607 113.12 105.93 90.1699 92.5372 66.9727C79.1443 43.7755 61.1071 29.1159 52.25 34.2295C43.3928 39.3432 47.0698 62.2937 60.4627 85.4909Z"
          stroke="#A3ABC6"
        />
        <path
          d="M60.4627 66.9723C47.0698 90.1695 43.3928 113.12 52.25 118.234C61.1071 123.347 79.1443 108.688 92.5372 85.4905C105.93 62.2933 109.607 39.3428 100.75 34.2292C91.8928 29.1155 73.8556 43.7751 60.4627 66.9723Z"
          stroke="#A3ABC6"
        />
      </svg>
    ),
    description: (
      <>
        <p>
          Building reusable hooks and components can be tricky. Just like any
          other kind of abstraction, you can easily find yourself captive to its
          maintenance. Whether it's the dreaded "apropcalypse" of a component
          with tons of props, or a custom hook with too many options, it's not
          fun for maintainers or users alike. Inevitably, the
          incidentally-abstracted "reusable" React hooks and components will
          ultimately slow you down or be abandoned for duplication. It doesn't
          have to be like this.
        </p>
        <p>
          By the end of this workshop, you'll have a deep understanding of how
          component libraries work and how to implement your own components and
          hooks that are powerful, flexible, and easy to use. This will
          demystify the patterns that power the libraries you use every day and
          will help you use them more effectively. Beyond that, you'll learn
          important patterns that will help you get your codebase ready for
          React Server Components through the proper use of composition as well
          as ways to deal with real-world scenarios you bump into every day in
          React applications. All taught by one of the top React instructors in
          the world (Kent even created and popularized some of the patterns
          you'll learn).
        </p>
        <p>
          We look forward to you joining and increasing your own skills as a
          React developer.
        </p>
      </>
    ),
    date: 'Wednesday, April 10, 2024',
    time: 'from 10:00 am - 4:00 pm MT and includes lunch',
    instructor: 'Kent C. Dodds',
  },
  {
    title: 'How to Build Epic Commerce Experiences',
    image: (
      <svg
        className="w-32"
        viewBox="0 0 152 152"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="151"
          height="151"
          rx="5"
          stroke="#2A2E3F"
        />
        <path d="M125.404 78.5735V86.4598H121.075V78.5735" fill="#575C6E" />
        <path
          d="M121.075 78.5735L128.401 65.6768H133L125.404 78.5735H121.075Z"
          fill="#6D738B"
        />
        <path
          d="M121.075 78.5735L113.545 65.6768H118.282L123.383 74.5145L121.075 78.5735Z"
          fill="#575C6E"
        />
        <path
          d="M105.778 72.9373V86.4599H101.383V75.2459L105.778 72.9373Z"
          fill="#575C6E"
        />
        <path
          d="M101.383 75.2344L112.525 69.4679L110.643 66.2483L101.383 70.8246V75.2344Z"
          fill="#353A4B"
        />
        <path
          d="M101.383 69.468H94.6683V65.6768H110.308L112.525 69.468H105.778H101.383Z"
          fill="#6D738B"
        />
        <path
          d="M92.1483 65.6768H87.786V86.4635H92.1483V65.6768Z"
          fill="#6D738B"
        />
        <path
          d="M70.0022 71.8664V86.4599H65.8109V65.6768L70.0022 71.8664Z"
          fill="#575C6E"
        />
        <path
          d="M70.6503 65.6768L79.8808 79.8758V86.4599L65.8109 65.6768H70.6503Z"
          fill="#6D738B"
        />
        <path
          d="M79.8807 78.8086V65.6768H84.0721V86.4598H79.8807V78.8086Z"
          fill="#575C6E"
        />
        <path
          d="M46.96 86.8L57.2304 81.3694L55.9641 78.0527L49.2026 81.2415L46.96 86.8Z"
          fill="#353A4B"
        />
        <path
          d="M53.3103 71.0597L46.9599 86.7999L43.6937 83.9565L51.2603 65.6768L53.3103 71.0597Z"
          fill="#575C6E"
        />
        <path
          d="M51.2603 65.6768H55.5897L63.5971 86.4598H59.1656L51.2603 65.6768Z"
          fill="#6D738B"
        />
        <path
          d="M27.4426 68.0752C27.4426 70.9693 29.2414 72.6912 32.8427 73.5993L36.6587 74.4784C40.067 75.2561 42.1425 77.1879 42.1425 80.3352C42.169 81.7064 41.7204 83.0449 40.8717 84.1265C40.8717 80.9864 39.2368 79.2897 35.2933 78.2696L31.5464 77.423C28.546 76.7429 26.2301 75.1548 26.2301 71.7362C26.2143 70.416 26.6409 69.1281 27.4426 68.0752Z"
          fill="#6D738B"
        />
        <path
          d="M38.5268 79.5648C40.1544 80.5995 40.8681 82.0465 40.8681 84.123C39.5209 85.8378 37.154 86.8 34.3721 86.8C29.6894 86.8 26.4122 84.5101 25.684 80.5307H30.1809C30.7599 82.3576 32.2929 83.2042 34.3393 83.2042C36.8372 83.2042 38.4977 81.8801 38.5304 79.5576"
          fill="#575C6E"
        />
        <path
          d="M29.7803 72.3659C29.0371 71.927 28.4273 71.2965 28.0157 70.541C27.6041 69.7856 27.4061 68.9336 27.4426 68.0754C28.7426 66.3751 31.0038 65.3369 33.7603 65.3369C38.5303 65.3369 41.2904 67.8403 41.9714 71.3638H37.6455C37.1685 69.9747 35.9742 68.893 33.7967 68.893C31.4699 68.893 29.8823 70.2387 29.7912 72.3659"
          fill="#575C6E"
        />
      </svg>
    ),
    description: (
      <>
        <p>
          Building a custom storefront with Shopify allows you to build unique
          and stand-out shopping experiences. It lets you integrate immersive
          content with a great checkout experience. But for this to work, you
          must empower content teams with excellent authoring experiences.
        </p>
        <p>
          In this comprehensive 6-hour workshop, Simeon and Knut will take you
          through setting up a Shopify-powered Remix/Hydrogen storefront and
          integrate content from Sanity – the only CMS to be Shopify Plus
          Certified. You will learn how to set up a Hydrogen project connected
          to Shopify, enable embedding live product data inside of content
          presentations, customize content authoring experiences, and more.
        </p>
        <p>
          Transform your web development skills into creating more engaging,
          efficient, and unique e-commerce sites.
        </p>
        <p>
          <strong>Your instructors:</strong>
        </p>
        <p>
          Simeon Griggs (Principal Educator at Sanity) brings a wealth of
          experience as a web developer and educator. Having collaborated with
          leading teams at Spotify, Puma, and AT&T, Simeon specializes in
          tailoring developer resources to enhance team capabilities in creating
          cutting-edge web experiences. @simeongriggs
        </p>
        <p>
          Knut Melvær (Head of Developer Education and Community at Sanity) has
          contributed actively to the web development scene since the early
          2000s. His rich background, from coding to academia as a university
          lecturer, equips him with a unique perspective on technology education
          and community building. @kmelve
        </p>
      </>
    ),
    date: 'Wednesday, April 10, 2024',
    time: 'from 10:00 am - 4:00 pm MT and includes lunch',
    instructor: [
      {
        name: 'Simeon Griggs',
        image:
          'https://res.cloudinary.com/epic-web/image/upload/v1711027557/simeon-griggs.jpg',
      },
      {
        name: 'Knut Melvær',
        image:
          'https://res.cloudinary.com/epic-web/image/upload/v1711027557/knut-melv%C3%A6r.jpg',
      },
    ],
  },
]

const Workshops: React.FC<{speakers: Speaker[]}> = ({speakers}) => {
  return (
    <section
      id="workshops"
      aria-label="workshops"
      className="relative mx-auto flex w-full max-w-screen-lg flex-col justify-between gap-0 px-5 pb-32 pt-16 md:flex-col"
    >
      <h2 className="pb-5 text-center text-3xl font-bold sm:text-left sm:text-4xl">
        Workshops
      </h2>
      <div className="flex flex-col gap-5 lg:flex-row">
        {workshopsData.map(
          ({title, image, description, date, time, instructor}) => {
            return (
              <div
                key={title}
                className="flex flex-col items-start justify-center gap-5 rounded border border-[#313646] bg-[#1E212C]/50 p-5 sm:flex-row sm:justify-start [&_time]:text-[#D6DEFF]"
              >
                <Link
                  href={CONF_24_TITO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-background"
                  onClick={() => {
                    track(`clicked workshop`, {
                      title: 'conf2024',
                      type: 'workshop',
                      location: title,
                    })
                  }}
                >
                  {image}
                </Link>
                <div>
                  <h3 className="w-full pb-4 text-left text-2xl font-bold">
                    <Link
                      href={CONF_24_TITO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-balance hover:underline"
                      onClick={() => {
                        track(`clicked workshop`, {
                          title: 'conf2024',
                          type: 'workshop',
                          location: title,
                        })
                      }}
                    >
                      {title}
                    </Link>
                  </h3>
                  <span className="flex items-start gap-2.5">
                    {typeof instructor === 'string' && (
                      <Image
                        src={getProfilePictureForWorkshopInstructor(
                          instructor,
                          speakers,
                        )}
                        width={48}
                        height={48}
                        alt={instructor}
                        className="mt-1.5 rounded-full"
                      />
                    )}

                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {typeof instructor === 'string' ? (
                          instructor
                        ) : (
                          <div className="mb-2 flex flex-row gap-3">
                            {instructor.map(({name, image}) => {
                              return (
                                <span
                                  key={name}
                                  className="flex items-center gap-2 leading-tight"
                                >
                                  <Image
                                    src={image}
                                    width={48}
                                    height={48}
                                    alt={name}
                                    className="rounded-full"
                                  />
                                  {name}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </span>
                      <time dateTime={date} className="text-sm">
                        {date}
                      </time>
                      <time dateTime={time} className="text-sm">
                        {time}
                      </time>
                    </div>
                  </span>
                </div>
              </div>
            )
          },
        )}
      </div>
      <div
        className="pointer-events-none absolute left-1/3 z-0 hidden h-96 w-96 rounded-full bg-indigo-300/5 blur-3xl lg:block"
        aria-hidden="true"
      />
    </section>
  )
}

const Sponsors = () => {
  const {platinum, gold, silver, community} = sponsorsData
  return (
    <section
      id="sponsors"
      aria-label="sponsors"
      className="mx-auto flex w-full max-w-screen-xl scale-90 flex-col items-center justify-center gap-10 pb-16 pt-8 lg:scale-100 [&_p]:text-[#93A1D7]"
    >
      <h2 className="pb-5 text-3xl font-semibold sm:text-4xl">Sponsors</h2>
      <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16 sm:px-10">
        <p className="w-20 font-mono text-sm uppercase">Platinum:</p>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-12">
          {platinum.map((s) => {
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
                <div>{s.logo}</div>
              </Link>
            )
          })}
        </div>
      </div>
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
                className="flex items-center justify-center opacity-90 transition hover:opacity-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>{s.logo}</div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16">
        <p className="font-mono text-sm uppercase">Silver:</p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:justify-start lg:gap-10">
          {silver.map((s) => {
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
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16 sm:px-10">
        <p className="w-20 font-mono text-sm uppercase">Community:</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:justify-center sm:gap-x-16 sm:gap-y-5">
          {community.map((s) => {
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
          })}
        </div>
      </div>
      <div className="relative mt-5 flex w-full flex-col items-center justify-center gap-10 pb-12 pt-5 sm:flex-row">
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
      </div>
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
          className="w-48"
          viewBox="0 0 300 89"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M66.522 11.742H77.476C87.219 11.742 95.129 19.652 95.129 29.395V67.912C95.129 77.655 87.219 85.565 77.476 85.565H76.613C71.598 84.781 69.423 83.277 67.743 82.006L53.816 70.555C53.4665 70.274 53.0315 70.1209 52.583 70.1209C52.1345 70.1209 51.6995 70.274 51.35 70.555L46.826 74.276L34.083 63.798C33.7343 63.5161 33.2994 63.3624 32.851 63.3624C32.4026 63.3624 31.9677 63.5161 31.619 63.798L13.915 79.371C10.353 82.269 7.996 81.734 6.468 81.566C2.52 78.326 0 73.411 0 67.912V29.395C0 19.652 7.91 11.742 17.654 11.742H28.584L28.564 11.786L28.196 12.86L28.081 13.228L27.585 15.429L27.517 15.814L27.299 18.018L27.27 18.623L27.265 18.835L27.286 19.845L27.336 20.438L27.459 21.364L27.615 22.199L27.801 22.967L28.042 23.799L28.667 25.56L28.874 26.088L29.963 28.389L30.347 29.096L31.607 31.258L32.089 32.038L33.847 34.626L34.1 34.969L36.388 37.946L37.127 38.862L39.738 41.915L40.275 42.503L42.428 44.819L43.28 45.702L44.689 47.102L44.407 47.338L44.23 47.497C43.752 47.943 43.298 48.417 42.873 48.915C42.668 49.156 42.473 49.405 42.289 49.661C42.0073 50.0528 41.7549 50.4649 41.534 50.894C41.4217 51.117 41.3209 51.3457 41.232 51.579C41.0029 52.1749 40.8651 52.802 40.823 53.439L40.815 53.99C40.835 54.766 40.993 55.532 41.282 56.253C41.574 56.983 42.001 57.652 42.54 58.226C42.932 58.643 43.378 59.007 43.867 59.306C44.2835 59.5611 44.7264 59.7703 45.188 59.93C46.1903 60.27 47.2539 60.3911 48.307 60.285H48.312C49.2107 60.1977 50.0843 59.9383 50.885 59.521C51.23 59.338 51.559 59.126 51.867 58.885C52.7499 58.1985 53.4338 57.2889 53.848 56.25C54.173 55.44 54.332 54.575 54.318 53.704L54.292 53.248C54.2331 52.6466 54.0897 52.0564 53.866 51.495C53.7689 51.2506 53.6587 51.0116 53.536 50.779C53.3077 50.3507 53.048 49.9399 52.759 49.55C52.6271 49.3713 52.4904 49.1963 52.349 49.025C51.8791 48.4636 51.373 47.9335 50.834 47.438L50.452 47.113L51.098 46.476L53.872 43.579L54.831 42.526L56.322 40.848L57.292 39.714L58.675 38.029L59.612 36.852L60.987 35.013L61.681 34.062L62.666 32.589L63.486 31.335L65.032 28.643L65.916 26.877L65.941 26.823L66.618 25.185C66.627 25.1638 66.6347 25.1421 66.641 25.12L67.37 22.846L67.446 22.515L67.763 20.705L67.824 20.215L67.843 19.915L67.865 18.782L67.859 18.571L67.801 17.556L67.729 16.768L67.37 14.496C67.364 14.466 67.358 14.436 67.349 14.406L66.888 12.726L66.729 12.259L66.522 11.742ZM71.729 59.774C70.6259 59.7943 69.5737 60.2415 68.7936 61.0216C68.0135 61.8017 67.5663 62.8539 67.546 63.957C67.579 66.238 69.447 68.105 71.729 68.138C74.01 68.105 75.878 66.238 75.913 63.957C75.8925 62.8539 75.445 61.8016 74.6648 61.0215C73.8845 60.2414 72.8322 59.7943 71.729 59.774Z"
            fill="white"
            fillOpacity="0.35"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M63.4939 85.565H41.9839C40.8819 85.565 40.7279 84.521 41.4369 83.927C51.9359 75.132 51.9109 75.103 51.9109 75.103C52.1187 74.9288 52.3812 74.8331 52.6524 74.8325C52.9235 74.832 53.1863 74.9266 53.3949 75.1C53.3949 75.1 63.2619 83.274 64.0409 83.927C64.7499 84.521 64.5969 85.565 63.4939 85.565ZM47.6249 50.485L47.7369 50.517C47.7719 50.535 47.8029 50.56 47.8349 50.582L47.9279 50.664C48.1569 50.875 48.3799 51.097 48.5939 51.324C48.7449 51.485 48.8919 51.651 49.0329 51.822C49.2129 52.039 49.3809 52.266 49.5339 52.502C49.5999 52.606 49.6609 52.712 49.7189 52.822C49.7689 52.917 49.8139 53.015 49.8529 53.115C49.9229 53.289 49.9749 53.472 49.9909 53.658L49.9879 54.008C49.9647 54.3239 49.8668 54.6297 49.7021 54.9002C49.5375 55.1708 49.3108 55.3983 49.0409 55.564C48.6909 55.776 48.2969 55.906 47.8899 55.943L47.4569 55.956L47.0919 55.924C46.9215 55.8988 46.7538 55.858 46.5909 55.802C46.425 55.7454 46.2657 55.671 46.1159 55.58L45.8309 55.371C45.495 55.0844 45.2662 54.6924 45.1819 54.259C45.1676 54.1858 45.1562 54.1121 45.1479 54.038L45.1379 53.705C45.1434 53.6144 45.1564 53.5244 45.1769 53.436C45.2269 53.241 45.2989 53.052 45.3889 52.873C45.5059 52.648 45.6389 52.431 45.7879 52.225C46.0349 51.892 46.3019 51.574 46.5879 51.274C46.7729 51.079 46.9609 50.89 47.1579 50.709L47.2989 50.582C47.3959 50.517 47.3969 50.517 47.5079 50.485H47.6249ZM46.9079 3.96298L46.9529 3.95898V42.97L46.8559 42.79C45.572 40.4144 44.3765 37.9921 43.2719 35.528C42.3761 33.5333 41.5648 31.5019 40.8399 29.439C40.2609 27.7958 39.7719 26.1223 39.3749 24.426C39.0659 23.078 38.8299 21.711 38.7329 20.33C38.6951 19.7405 38.6837 19.1495 38.6989 18.559C38.7079 18.045 38.7289 17.532 38.7619 17.018C38.8129 16.211 38.8949 15.405 39.0129 14.606C39.1069 13.977 39.2229 13.35 39.3659 12.73C39.4799 12.238 39.6119 11.749 39.7629 11.268C39.9809 10.573 40.2409 9.89398 40.5449 9.23098C40.6559 8.99198 40.7749 8.75498 40.9009 8.52198C41.6539 7.12698 42.6759 5.84198 44.0139 4.98198C44.8836 4.41656 45.8758 4.06719 46.9079 3.96298ZM51.9669 4.06098L54.5909 4.80998C55.8118 5.25501 56.9741 5.84703 58.0519 6.57298C59.5177 7.56194 60.781 8.82187 61.7739 10.285C62.356 11.1549 62.8393 12.087 63.2149 13.064C63.761 14.5085 64.0987 16.0233 64.2179 17.563C64.2529 17.966 64.2729 18.37 64.2809 18.775C64.2899 19.15 64.2879 19.527 64.2579 19.902C64.1829 20.7422 64.0248 21.573 63.7859 22.382C63.5939 23.0439 63.3669 23.6951 63.1059 24.333C62.7818 25.1264 62.4214 25.9046 62.0259 26.665C61.1509 28.355 60.1449 29.971 59.0669 31.534C57.7311 33.4547 56.3072 35.3127 54.7999 37.102C53.1624 39.0543 51.455 40.9469 49.6809 42.776C50.8851 40.5186 52.0088 38.2191 53.0499 35.882C53.6287 34.5802 54.1749 33.2641 54.6879 31.935C55.2527 30.4752 55.7618 28.9945 56.2139 27.496C56.552 26.3735 56.8449 25.2379 57.0919 24.092C57.3009 23.108 57.4659 22.114 57.5679 21.114C57.6529 20.28 57.6849 19.441 57.6639 18.605C57.6559 18.0926 57.6369 17.5805 57.6069 17.069C57.4839 15.012 57.1709 12.961 56.5709 10.988C56.3441 10.2395 56.0678 9.50686 55.7439 8.79498C54.9759 7.12198 53.9039 5.55798 52.4529 4.41698L51.9669 4.06098ZM207.646 74.498L195.189 47.832C194.149 45.61 193.529 44.798 192.488 43.856L191.476 42.943C190.668 42.16 190.138 41.435 190.138 40.574C190.138 39.341 191.114 38.303 192.893 38.303H203.708C205.405 38.303 206.463 39.186 206.463 40.504C206.463 41.24 206.125 41.792 205.697 42.333C205.19 42.976 204.529 43.602 204.529 44.745C204.529 45.461 204.738 46.175 205.14 47.087L212.574 64.495L219.242 47.525C219.652 46.396 219.932 45.402 219.932 44.606C219.932 43.367 219.259 42.862 218.74 42.308C218.288 41.827 217.927 41.319 217.927 40.504C217.927 39.173 219.01 38.303 220.468 38.303H227.128C228.995 38.303 229.883 39.269 229.883 40.504C229.883 41.294 229.428 42.027 228.532 42.817L227.59 43.591C226.278 44.663 225.671 46.213 224.982 47.817L214.883 72.146C213.69 74.99 211.913 78.939 209.2 82.179C206.443 85.469 202.726 88.028 197.692 88.028C193.477 88.028 190.925 86.015 190.925 83.115C190.925 80.458 192.89 78.341 195.472 78.341C196.886 78.341 197.621 79.009 198.367 79.696C198.984 80.262 199.61 80.844 200.844 80.844C201.988 80.844 203.054 80.36 204.021 79.578C205.497 78.384 206.733 76.505 207.646 74.498ZM280.844 74.403C286.451 74.403 291.045 72.482 294.628 68.648C298.209 64.82 300 60.212 300 54.824C300 49.565 298.298 45.244 294.907 41.858C291.516 38.473 287.117 36.773 281.703 36.773C276.002 36.773 271.34 38.624 267.709 42.312C264.077 46.003 262.26 50.474 262.26 55.727C262.26 60.932 263.994 65.345 267.455 68.964C270.919 72.586 275.38 74.403 280.844 74.403ZM233.431 73.986C236.673 73.986 238.978 71.803 238.978 68.656C238.978 65.583 236.597 63.396 233.431 63.396C230.113 63.396 227.739 65.587 227.739 68.656C227.739 71.8 230.115 73.986 233.431 73.986ZM244.975 68.998L245.765 68.164C246.703 67.252 247.005 66.331 247.005 63.791V48.776C247.005 46.58 246.707 45.6 245.775 44.761L244.847 43.929C243.937 43.126 243.638 42.627 243.638 41.825C243.638 40.685 244.522 39.75 245.944 39.426L252.247 37.896C252.85 37.75 253.53 37.608 254.057 37.608C254.782 37.608 255.376 37.846 255.792 38.26C256.209 38.675 256.454 39.271 256.454 40.018V63.791C256.454 66.188 256.745 67.303 257.746 68.145C257.762 68.159 257.777 68.174 257.791 68.19L258.496 69.011C259.381 69.872 259.748 70.443 259.748 71.228C259.748 72.629 258.692 73.43 256.994 73.43H246.322C244.704 73.43 243.638 72.634 243.638 71.228C243.638 70.439 244.006 69.863 244.975 68.998ZM173.641 68.999L174.43 68.164C175.369 67.252 175.671 66.331 175.671 63.791V32.441C175.671 30.315 175.446 29.271 174.451 28.433L173.498 27.511C172.677 26.713 172.377 26.218 172.377 25.42C172.377 24.278 173.265 23.347 174.609 23.021L180.84 21.492C181.444 21.346 182.123 21.203 182.651 21.203C183.371 21.203 183.98 21.42 184.415 21.831C184.851 22.244 185.119 22.857 185.119 23.683V63.791C185.119 66.194 185.418 67.245 186.423 68.154L187.227 69.005C188.118 69.872 188.415 70.439 188.415 71.228C188.415 71.81 188.237 72.279 187.921 72.637C187.475 73.141 186.728 73.43 185.731 73.43H175.06C174.064 73.43 173.316 73.141 172.869 72.637C172.554 72.279 172.377 71.81 172.377 71.228C172.377 70.438 172.67 69.866 173.641 68.999ZM144.583 52.854V63.652C144.583 65.279 144.905 66.781 146.245 68.018L147.112 68.859C148.083 69.801 148.378 70.365 148.378 71.228C148.378 72.547 147.321 73.43 145.623 73.43H133.591C131.893 73.43 130.836 72.547 130.836 71.228C130.836 70.204 131.137 69.719 132.107 68.854L132.971 68.015C133.976 67.105 134.632 65.864 134.632 63.652V34.805C134.632 33.047 134.243 31.609 132.97 30.438L132.102 29.597C131.21 28.731 130.836 28.162 130.836 27.297C130.836 25.899 131.897 25.026 133.591 25.026H165.821C167.052 25.026 168.135 25.3 168.826 25.978C169.307 26.45 169.614 27.115 169.649 28.038L170.151 35.478C170.201 36.408 169.926 37.184 169.39 37.662C169.02 37.991 168.523 38.188 167.897 38.188C167.108 38.188 166.503 37.89 165.963 37.376C165.478 36.914 165.046 36.265 164.558 35.501C163.381 33.62 162.833 32.943 161.578 32.063C159.832 30.775 157.171 30.332 152.141 30.332C149.238 30.332 147.406 30.459 146.252 30.756C145.506 30.949 145.075 31.199 144.845 31.566C144.608 31.942 144.583 32.417 144.583 32.997V47.617H152.141C153.949 47.617 155.221 47.29 156.695 45.276L156.703 45.264C157.294 44.512 157.722 43.958 158.129 43.591C158.602 43.162 159.058 42.959 159.661 42.959C160.241 42.9668 160.794 43.2021 161.202 43.6142C161.611 44.0262 161.841 44.582 161.843 45.162V55.241C161.843 56.591 160.791 57.512 159.661 57.512C159.099 57.512 158.643 57.312 158.168 56.892C157.759 56.533 157.33 55.994 156.774 55.275C155.161 53.187 154.022 52.854 152.141 52.854H144.583ZM272.283 52.599C272.283 48.983 273.071 46.384 274.703 44.821C276.316 43.278 278.049 42.497 279.912 42.497C282.475 42.497 284.785 43.932 286.868 46.752C288.996 49.636 290.049 53.533 290.049 58.438C290.049 62.058 289.259 64.681 287.624 66.289C286.013 67.875 284.281 68.679 282.419 68.679C279.856 68.679 277.548 67.233 275.464 64.391C273.335 61.483 272.283 57.55 272.283 52.599ZM251.193 33.044C254.442 33.044 256.74 31.215 256.74 28.061C256.74 24.982 254.444 23.149 251.193 23.149C247.866 23.149 245.572 24.983 245.572 28.061C245.572 31.139 247.867 33.044 251.193 33.044Z"
            fill="white"
          />
        </svg>
      ),
    },
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
  ],
  gold: [
    {
      name: 'Nx',
      url: 'https://nx.dev',
      logo: (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16"
          fill="currentColor"
        >
          <title>Nx</title>
          <path d="M11.987 14.138l-3.132 4.923-5.193-8.427-.012 8.822H0V4.544h3.691l5.247 8.833.005-3.998 3.044 4.759zm.601-5.761c.024-.048 0-3.784.008-3.833h-3.65c.002.059-.005 3.776-.003 3.833h3.645zm5.634 4.134a2.061 2.061 0 0 0-1.969 1.336 1.963 1.963 0 0 1 2.343-.739c.396.161.917.422 1.33.283a2.1 2.1 0 0 0-1.704-.88zm3.39 1.061c-.375-.13-.8-.277-1.109-.681-.06-.08-.116-.17-.176-.265a2.143 2.143 0 0 0-.533-.642c-.294-.216-.68-.322-1.18-.322a2.482 2.482 0 0 0-2.294 1.536 2.325 2.325 0 0 1 4.002.388.75.75 0 0 0 .836.334c.493-.105.46.36 1.203.518v-.133c-.003-.446-.246-.55-.75-.733zm2.024 1.266a.723.723 0 0 0 .347-.638c-.01-2.957-2.41-5.487-5.37-5.487a5.364 5.364 0 0 0-4.487 2.418c-.01-.026-1.522-2.39-1.538-2.418H8.943l3.463 5.423-3.379 5.32h3.54l1.54-2.366 1.568 2.366h3.541l-3.21-5.052a.7.7 0 0 1-.084-.32 2.69 2.69 0 0 1 2.69-2.691h.001c1.488 0 1.736.89 2.057 1.308.634.826 1.9.464 1.9 1.541a.707.707 0 0 0 1.066.596zm.35.133c-.173.372-.56.338-.755.639-.176.271.114.412.114.412s.337.156.538-.311c.104-.231.14-.488.103-.74z"></path>
        </svg>
      ),
    },
    {
      name: 'Sanity',
      url: 'https://sanity.io',
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
  silver: [
    {
      name: 'Prisma',
      url: 'https://www.prisma.io/',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-32"
          viewBox="0 0 90 28"
          fill="none"
        >
          <title>Prisma</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.209637 19.0073C-0.0659575 18.5726 -0.070121 18.0189 0.198904 17.58L10.3282 1.05707C10.8916 0.138071 12.252 0.218426 12.7033 1.19735L21.9569 21.2706C22.3002 22.0154 21.905 22.8917 21.1194 23.1274L6.72474 27.4458C6.14558 27.6195 5.52155 27.3867 5.19781 26.876L0.209637 19.0073ZM11.4969 5.88824C11.5945 5.40217 12.2605 5.33208 12.4572 5.78717L18.8402 20.5571C18.9603 20.8352 18.8108 21.1559 18.5205 21.2425L8.57492 24.2114C8.20935 24.3205 7.85916 24.0011 7.93428 23.627L11.4969 5.88824ZM48.4948 21.1371H51.3226V10.772H48.4948V21.1371ZM48.3744 8.09277C48.3744 7.17221 48.8878 6.7116 49.9137 6.7116C50.9394 6.7116 51.4527 7.17221 51.4527 8.09277C51.4527 8.53176 51.3244 8.87321 51.068 9.11743C50.8114 9.36165 50.4267 9.48343 49.9137 9.48343C48.8878 9.48343 48.3744 9.01987 48.3744 8.09277ZM87.1709 16.335L86.0768 16.372C85.2548 16.3969 84.6429 16.5455 84.2412 16.8172C83.8392 17.0893 83.6386 17.5031 83.6386 18.0596C83.6386 18.8567 84.0959 19.2555 85.0106 19.2555C85.6656 19.2555 86.1897 19.0672 86.5819 18.6898C86.9744 18.313 87.1709 17.8124 87.1709 17.1878V16.335ZM88.0053 21.1375L87.4583 19.7282H87.384C86.908 20.3279 86.4182 20.7437 85.9144 20.9755C85.4109 21.2072 84.7542 21.3228 83.9446 21.3228C82.9491 21.3228 82.1661 21.0386 81.5941 20.47C81.0226 19.9017 80.7368 19.0918 80.7368 18.0409C80.7368 16.941 81.1214 16.1298 81.8907 15.6073C82.6607 15.0851 83.8209 14.7961 85.3723 14.7404L87.1709 14.6848V14.2304C87.1709 13.1799 86.633 12.6544 85.5576 12.6544C84.7293 12.6544 83.7558 12.9045 82.6371 13.4054L81.7009 11.4955C82.8938 10.8716 84.2167 10.559 85.6689 10.559C87.0596 10.559 88.1258 10.8621 88.8676 11.4677C89.6091 12.0734 89.98 12.9946 89.98 14.2304V21.1375H88.0053ZM72.4802 21.1375H69.6524V15.0834C69.6524 14.3357 69.527 13.775 69.2772 13.4008C69.0265 13.0269 68.6326 12.8397 68.0948 12.8397C67.3719 12.8397 66.8465 13.1058 66.5188 13.6371C66.1911 14.1688 66.0275 15.0435 66.0275 16.261V21.1375H63.1996V10.7723H65.3599L65.74 12.0982H65.8978C66.1757 11.6225 66.5778 11.25 67.1029 10.9812C67.6283 10.7121 68.231 10.5776 68.9109 10.5776C70.4623 10.5776 71.5128 11.0846 72.0631 12.0982H72.3132C72.5915 11.616 73.001 11.2421 73.5419 10.9763C74.0827 10.7105 74.6929 10.5776 75.3728 10.5776C76.5471 10.5776 77.4359 10.8791 78.0382 11.4817C78.6409 12.0844 78.9421 13.0502 78.9421 14.3786V21.1375H76.1051V15.0834C76.1051 14.3357 75.9798 13.775 75.73 13.4008C75.4792 13.0269 75.0854 12.8397 74.5475 12.8397C73.8555 12.8397 73.3379 13.0872 72.9945 13.5815C72.6517 14.0761 72.4802 14.8608 72.4802 15.9362V21.1375ZM60.17 20.4885C60.9088 19.9323 61.2781 19.1227 61.2781 18.0594C61.2781 17.5468 61.1887 17.1045 61.0093 16.7336C60.8299 16.3627 60.5517 16.0353 60.1749 15.7508C59.7981 15.4667 59.2046 15.1609 58.3946 14.8332C57.4862 14.4685 56.8976 14.1932 56.6285 14.0079C56.3601 13.8226 56.2252 13.6033 56.2252 13.3496C56.2252 12.8985 56.6426 12.6729 57.477 12.6729C57.9465 12.6729 58.4071 12.7443 58.8582 12.886C59.3093 13.0284 59.7948 13.2104 60.314 13.4331L61.1668 11.3936C59.9863 10.8498 58.7718 10.5778 57.5232 10.5778C56.2127 10.5778 55.2009 10.8295 54.4872 11.3333C53.7729 11.8371 53.416 12.5495 53.416 13.4701C53.416 14.0079 53.5012 14.461 53.6714 14.8286C53.841 15.1963 54.113 15.5223 54.4872 15.8065C54.8607 16.091 55.4467 16.4 56.2438 16.7336C56.8 16.9686 57.2453 17.1742 57.5788 17.3503C57.9128 17.5265 58.1475 17.6843 58.2837 17.8231C58.4195 17.9622 58.4876 18.1429 58.4876 18.3655C58.4876 18.9587 57.9743 19.2553 56.9483 19.2553C56.4478 19.2553 55.8684 19.1718 55.2103 19.0052C54.5517 18.8382 53.9601 18.6313 53.4347 18.3838V20.7203C53.8983 20.918 54.3959 21.0679 54.9275 21.1701C55.4591 21.2719 56.1014 21.3229 56.8557 21.3229C58.3266 21.3229 59.4314 21.0447 60.17 20.4885ZM46.9948 10.661C46.7414 10.6054 46.4232 10.5776 46.0398 10.5776C45.3969 10.5776 44.8021 10.7553 44.2554 11.1108C43.708 11.4664 43.2739 11.9345 42.9524 12.5152H42.8136L42.3962 10.7723H40.2546V21.1375H43.0824V15.8622C43.0824 15.0278 43.3341 14.3786 43.8376 13.9151C44.3418 13.4515 45.0446 13.2197 45.9472 13.2197C46.2749 13.2197 46.5528 13.2508 46.7817 13.3124L46.9948 10.661ZM31.9317 13.9614H32.8774C33.7613 13.9614 34.4223 13.7869 34.8613 13.4376C35.3003 13.0886 35.5196 12.5799 35.5196 11.9124C35.5196 11.239 35.3356 10.7414 34.968 10.4199C34.6 10.0984 34.0239 9.93766 33.2388 9.93766H31.9317V13.9614ZM38.4214 11.8106C38.4214 13.2694 37.9657 14.385 37.0537 15.1573C36.1423 15.9302 34.8459 16.3162 33.1649 16.3162H31.9317V21.1373H29.0577V7.58296H33.3872C35.0315 7.58296 36.2814 7.93684 37.1375 8.64461C37.9936 9.35238 38.4214 10.4079 38.4214 11.8106Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Inngest',
      url: 'https://inngest.com',
      logo: (
        <svg
          className="mt-2 w-28"
          viewBox="0 0 100 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Inngest</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.927856 0.728778C0.309282 1.21463 0 1.89482 0 2.76936C0 3.63418 0.309282 4.3095 0.927856 4.79536C1.54643 5.28121 2.27458 5.52414 3.11234 5.52414C3.94035 5.52414 4.6612 5.27878 5.2749 4.78807C5.8886 4.29736 6.19545 3.62446 6.19545 2.76936C6.19545 1.89482 5.8886 1.21463 5.2749 0.728778C4.6612 0.242924 3.94035 0 3.11234 0C2.27458 0 1.54643 0.242924 0.927856 0.728778ZM5.85938 6.80679H0.336074V21.3095H5.85938V6.80679ZM7.1082 21.3095V6.559H11.974L12.2224 8.17689C12.8166 7.48698 13.5326 6.98169 14.3703 6.66103C15.1594 6.3598 15.9484 6.20919 16.7375 6.20919H16.8836C17.5362 6.21891 18.1378 6.29421 18.6881 6.43511C19.2385 6.57601 19.7621 6.81407 20.2589 7.14931C20.7557 7.48455 21.1795 7.9121 21.5302 8.43196C21.8808 8.95183 22.1585 9.61015 22.363 10.4069C22.5676 11.2038 22.6699 12.1123 22.6699 13.1326V21.3095H17.1612V13.1617C17.1612 12.3163 16.9615 11.6969 16.5621 11.3033C16.1627 10.9098 15.6708 10.713 15.0863 10.713C14.3752 10.713 13.7737 10.9584 13.2817 11.4491C12.7898 11.9398 12.5438 12.6419 12.5438 13.5553V21.3095H7.1082ZM23.7142 6.559V21.3095H29.1498V13.5553C29.1498 12.6419 29.3957 11.9398 29.8877 11.4491C30.3796 10.9584 30.9811 10.713 31.6923 10.713C32.2767 10.713 32.7687 10.9098 33.1681 11.3033C33.5675 11.6969 33.7671 12.3163 33.7671 13.1617V21.3095H39.2758V13.1326C39.2758 12.1123 39.1735 11.2038 38.969 10.4069C38.7644 9.61015 38.4868 8.95183 38.1361 8.43196C37.7854 7.9121 37.3617 7.48455 36.8649 7.14931C36.3681 6.81407 35.8445 6.57601 35.2941 6.43511C34.7437 6.29421 34.1422 6.21891 33.4895 6.20919H33.3434C32.5544 6.20919 31.7653 6.3598 30.9763 6.66103C30.1385 6.98169 29.4225 7.48698 28.8283 8.17689L28.5799 6.559H23.7142ZM40.25 13.6651C40.25 12.1589 40.6177 10.8277 41.3532 9.67137C42.0886 8.51504 43.0774 7.63322 44.3194 7.02591C45.5614 6.41859 46.9471 6.11493 48.4765 6.11493C49.5091 6.11493 50.527 6.29955 51.5304 6.6688L52.7324 5.14933C52.8942 4.94282 53.0244 4.77398 53.1231 4.6428L55.669 5.26499L57.0975 7.48504L55.1833 9.74425C56.1283 10.7937 56.6007 12.0229 56.6007 13.4319V13.7234C56.5812 14.6562 56.3377 15.555 55.8701 16.4199C55.4025 17.2847 54.745 18.0183 53.8975 18.6208C54.5307 18.9803 55.0591 19.3835 55.4829 19.8305C55.9066 20.2775 56.2062 20.7172 56.3815 21.1496C56.5569 21.582 56.6713 21.9391 56.7249 22.2209C56.7785 22.5027 56.8053 22.7845 56.8053 23.0663C56.8053 23.9894 56.6494 24.8251 56.3377 25.5733C56.026 26.3215 55.6047 26.9434 55.0738 27.439C54.5429 27.9345 53.9145 28.3499 53.1888 28.6852C52.4631 29.0204 51.7057 29.2609 50.9167 29.4067C50.1276 29.5524 49.2947 29.6253 48.418 29.6253C45.7781 29.6253 43.7568 28.9791 42.3541 27.6868C41.0877 26.5207 40.4545 24.9611 40.4545 23.008C40.4545 22.8039 40.4594 22.595 40.4691 22.3813H45.6418V22.4833C45.6418 22.9615 45.7006 23.3685 45.8181 23.7043L45.8463 23.7805C45.9827 24.1692 46.1897 24.4607 46.4673 24.655C46.745 24.8494 47.0396 24.9854 47.3514 25.0632C47.6631 25.1409 48.0186 25.1798 48.418 25.1798C49.1876 25.1798 49.8354 24.9976 50.3614 24.6332C50.8874 24.2688 51.1505 23.7465 51.1505 23.0663C51.1505 22.4736 50.9386 21.9974 50.5148 21.6379C50.1074 21.2922 49.4635 21.1127 48.5832 21.0994L48.4765 21.0986C45.9827 21.0986 43.9882 20.4281 42.4929 19.0872C40.9976 17.7462 40.25 15.9389 40.25 13.6651ZM46.4235 15.7343C45.8829 15.2047 45.6125 14.5075 45.6125 13.6427C45.6125 12.6904 45.8804 11.9447 46.4162 11.4054C46.952 10.8661 47.6387 10.5964 48.4765 10.5964C49.2753 10.5964 49.9401 10.8928 50.471 11.4855C51.0019 12.0783 51.2673 12.7973 51.2673 13.6427C51.2673 14.5756 50.9995 15.2898 50.4637 15.7853C49.9279 16.2809 49.2655 16.5287 48.4765 16.5287C47.6485 16.5287 46.9641 16.2639 46.4235 15.7343ZM57.3995 13.9634C57.3995 12.9237 57.5578 11.969 57.8744 11.0993C58.191 10.2296 58.6147 9.49841 59.1456 8.90567C59.6765 8.31292 60.2951 7.81007 61.0013 7.3971C61.7076 6.98412 62.4503 6.6829 63.2296 6.49341C64.0089 6.30393 64.8077 6.20919 65.626 6.20919C66.9411 6.20919 68.1368 6.42053 69.2132 6.84323C70.2896 7.26592 71.1834 7.87566 71.8945 8.67246C72.6056 9.46926 73.0975 10.441 73.3703 11.5876C73.4854 12.0734 73.5442 12.5834 73.5466 13.1174L73.5456 13.2783C73.5456 13.9682 73.4628 14.7067 73.2972 15.4938H62.9666C63.1517 16.0963 63.5754 16.5603 64.2378 16.8858C64.9003 17.2113 65.5773 17.3741 66.2689 17.3741C67.7301 17.3741 68.9964 16.9757 70.068 16.1789L72.7566 19.196C71.8896 20.0025 70.8741 20.6123 69.71 21.0252C68.5459 21.4382 67.3161 21.6447 66.0205 21.6447C64.8223 21.6447 63.7143 21.4941 62.6963 21.1929C61.6783 20.8916 60.77 20.4374 59.9712 19.83C59.1724 19.2227 58.5441 18.4187 58.0862 17.4178C57.6284 16.4169 57.3995 15.2655 57.3995 13.9634ZM68.3584 11.9665H62.9958C63.064 11.5098 63.2905 11.126 63.6753 10.8151C64.0601 10.5041 64.5057 10.3146 65.0123 10.2466C65.2461 10.2175 65.475 10.2029 65.699 10.2029C65.9718 10.2029 66.2397 10.2223 66.5027 10.2612C66.9995 10.3389 67.4257 10.5308 67.7812 10.8369C68.1368 11.143 68.3292 11.5195 68.3584 11.9665ZM73.57 19.7645L75.3672 15.7562C76.0589 16.2032 76.7651 16.5554 77.486 16.8129C78.2068 17.0704 78.7694 17.2259 79.1737 17.2793C79.5779 17.3328 80.0528 17.3741 80.5983 17.4032C81.6017 17.4032 82.1033 17.1652 82.1033 16.689C82.1033 16.2323 81.5822 15.9602 80.5399 15.8728C79.9262 15.8534 79.3344 15.7902 78.7645 15.6833C78.1946 15.5764 77.6272 15.4015 77.0622 15.1586C76.4972 14.9157 76.0077 14.6169 75.5937 14.2622C75.1797 13.9075 74.8437 13.4532 74.5855 12.8994C74.3274 12.3455 74.1983 11.7236 74.1983 11.0337C74.1983 10.1786 74.3883 9.43039 74.7682 8.78906C75.1481 8.14773 75.6644 7.64488 76.317 7.28049C76.9697 6.9161 77.6905 6.64646 78.4796 6.47155C79.2686 6.29664 80.1161 6.20919 81.0221 6.20919C82.2008 6.20919 83.321 6.36952 84.3828 6.69018C85.4446 7.01085 86.3408 7.44811 87.0714 8.00198L84.7335 11.2815C84.3576 11.0437 83.8307 10.8404 83.1528 10.6714L83.0239 10.6402C82.3225 10.4653 81.6845 10.3778 81.1097 10.3778H81.0221C80.1453 10.3778 79.707 10.6207 79.707 11.1066C79.707 11.2815 79.7922 11.4418 79.9627 11.5876C80.1218 11.7236 80.3806 11.8004 80.7391 11.8179L80.8175 11.8208C81.4994 11.8402 82.1326 11.8937 82.717 11.9811C83.3015 12.0686 83.903 12.224 84.5216 12.4475C85.1402 12.671 85.6686 12.9577 86.107 13.3075C86.5454 13.6573 86.9033 14.1213 87.181 14.6995C87.4586 15.2776 87.5974 15.9408 87.5974 16.689C87.5974 17.3984 87.4732 18.0373 87.2248 18.6057C86.9764 19.1742 86.6379 19.6479 86.2093 20.0268C85.7807 20.4058 85.2692 20.724 84.675 20.9815C84.0808 21.239 83.4549 21.4236 82.7974 21.5354C82.1399 21.6471 81.4458 21.703 80.7152 21.703C79.4001 21.703 78.0851 21.5305 76.77 21.1856C75.4549 20.8406 74.3883 20.3669 73.57 19.7645ZM87.8565 6.64645V10.8588H90.2237V15.9457C90.2139 16.7425 90.2967 17.4567 90.4721 18.0883C90.6669 18.7879 90.9299 19.3588 91.2611 19.8009C91.5923 20.243 91.9966 20.6074 92.4739 20.8941C92.9512 21.1807 93.4529 21.3823 93.9789 21.4989C94.505 21.6156 95.0748 21.6739 95.6885 21.6739C97.364 21.6739 98.7814 21.3435 99.9406 20.6827L98.7424 16.6161C98.2164 16.9562 97.6806 17.1263 97.1351 17.1263C96.1804 17.1263 95.6885 16.6502 95.6593 15.6979V10.8588H99.02V6.64645H95.6885V2.39039L90.2237 2.98799V6.64645H87.8565Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Microsoft',
      url: 'https://developer.microsoft.com/',
      logo: (
        <svg
          className="w-40 saturate-0 transition hover:saturate-100"
          viewBox="0 0 800 172"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M800 77.8704V63.8012H782.529V41.9289L781.941 42.11L765.53 47.1309L765.207 47.2292V63.8019H739.306V54.5695C739.306 50.2706 740.267 46.9808 742.161 44.7868C744.043 42.6192 746.733 41.5172 750.166 41.5172C752.633 41.5172 755.187 42.0983 757.758 43.2445L758.403 43.5323V28.7156L758.1 28.6041C755.701 27.742 752.439 27.3079 748.396 27.3079C743.3 27.3079 738.67 28.4168 734.631 30.6147C730.591 32.8156 727.413 35.9576 725.186 39.9524C722.967 43.9425 721.841 48.551 721.841 53.6509V63.8012H709.676V77.8704H721.841V137.141H739.306V77.8704H765.207V115.536C765.207 131.049 772.524 138.91 786.955 138.91C789.326 138.91 791.821 138.632 794.37 138.088C796.964 137.529 798.731 136.971 799.771 136.375L800.001 136.239V122.04L799.29 122.51C798.342 123.141 797.162 123.657 795.778 124.041C794.389 124.432 793.228 124.628 792.328 124.628C788.948 124.628 786.447 123.717 784.895 121.919C783.326 120.105 782.53 116.933 782.53 112.496V77.8704H800ZM670.675 124.63C664.336 124.63 659.339 122.528 655.817 118.388C652.273 114.227 650.478 108.294 650.478 100.756C650.478 92.9797 652.273 86.8931 655.818 82.6584C659.343 78.4516 664.292 76.3164 670.533 76.3164C676.589 76.3164 681.409 78.3556 684.862 82.3806C688.332 86.4264 690.094 92.4643 690.094 100.332C690.094 108.296 688.438 114.413 685.172 118.505C681.928 122.567 677.051 124.63 670.675 124.63ZM671.452 62.0344C659.358 62.0344 649.753 65.578 642.904 72.5669C636.059 79.5567 632.589 89.2295 632.589 101.319C632.589 112.802 635.977 122.038 642.658 128.767C649.34 135.498 658.433 138.908 669.683 138.908C681.406 138.908 690.82 135.315 697.666 128.229C704.511 121.151 707.979 111.57 707.979 99.7628C707.979 88.1004 704.725 78.7952 698.304 72.1111C691.88 65.424 682.844 62.0344 671.452 62.0344ZM604.432 62.0344C596.205 62.0344 589.4 64.1386 584.202 68.2874C578.972 72.4609 576.319 77.9346 576.319 84.5583C576.319 88.0013 576.892 91.0597 578.019 93.6538C579.153 96.2563 580.907 98.5478 583.238 100.471C585.551 102.379 589.122 104.377 593.853 106.41C597.831 108.046 600.797 109.431 602.682 110.522C604.524 111.592 605.831 112.667 606.569 113.714C607.286 114.738 607.65 116.141 607.65 117.871C607.65 122.798 603.96 125.196 596.368 125.196C593.552 125.196 590.339 124.608 586.82 123.448C583.326 122.307 580.029 120.635 577.043 118.491L576.318 117.971V134.785L576.584 134.909C579.055 136.049 582.171 137.011 585.843 137.768C589.508 138.526 592.838 138.911 595.731 138.911C604.658 138.911 611.846 136.797 617.092 132.623C622.37 128.421 625.046 122.818 625.046 115.966C625.046 111.022 623.605 106.783 620.767 103.364C617.947 99.9725 613.054 96.8592 606.229 94.1072C600.792 91.9249 597.309 90.1132 595.872 88.7226C594.486 87.3791 593.783 85.4792 593.783 83.0732C593.783 80.9404 594.651 79.2316 596.433 77.8479C598.23 76.4573 600.73 75.7499 603.866 75.7499C606.776 75.7499 609.753 76.2096 612.714 77.1104C615.672 78.0112 618.271 79.2177 620.44 80.6935L621.154 81.1811V65.2313L620.88 65.1137C618.878 64.2554 616.24 63.521 613.034 62.9251C609.843 62.3331 606.949 62.0344 604.432 62.0344ZM530.791 124.63C524.454 124.63 519.454 122.528 515.933 118.388C512.389 114.227 510.597 108.296 510.597 100.756C510.597 92.9797 512.391 86.8931 515.937 82.6584C519.458 78.4516 524.407 76.3164 530.651 76.3164C536.704 76.3164 541.525 78.3556 544.979 82.3806C548.45 86.4264 550.21 92.4643 550.21 100.332C550.21 108.296 548.553 114.413 545.287 118.505C542.044 122.567 537.169 124.63 530.791 124.63ZM531.57 62.0344C519.473 62.0344 509.867 65.578 503.022 72.5669C496.178 79.5567 492.705 89.2295 492.705 101.319C492.705 112.807 496.095 122.038 502.776 128.767C509.458 135.498 518.551 138.908 529.8 138.908C541.522 138.908 550.938 135.315 557.784 128.229C564.628 121.151 568.097 111.57 568.097 99.7628C568.097 88.1004 564.842 78.7952 558.42 72.1111C551.994 65.424 542.96 62.0344 531.57 62.0344ZM466.195 76.5022V63.8012H448.944V137.14H466.195V99.6243C466.195 93.2451 467.641 88.0044 470.495 84.046C473.313 80.1348 477.068 78.1528 481.652 78.1528C483.206 78.1528 484.951 78.409 486.84 78.9159C488.71 79.4197 490.064 79.9668 490.862 80.5426L491.588 81.0681V63.6758L491.308 63.5558C489.702 62.8733 487.429 62.5289 484.553 62.5289C480.218 62.5289 476.338 63.9219 473.015 66.6645C470.098 69.0752 467.99 72.3804 466.378 76.5022H466.195ZM418.049 62.0344C410.135 62.0344 403.075 63.7315 397.071 67.077C391.054 70.4303 386.4 75.2175 383.235 81.3049C380.082 87.3775 378.482 94.471 378.482 102.382C378.482 109.311 380.034 115.67 383.101 121.274C386.169 126.888 390.512 131.28 396.01 134.326C401.5 137.368 407.845 138.911 414.87 138.911C423.069 138.911 430.068 137.271 435.681 134.039L435.907 133.909V118.104L435.182 118.633C432.64 120.485 429.799 121.963 426.742 123.028C423.693 124.092 420.913 124.63 418.476 124.63C411.707 124.63 406.272 122.512 402.328 118.336C398.375 114.155 396.37 108.283 396.37 100.895C396.37 93.4603 398.461 87.4379 402.58 82.9943C406.687 78.5638 412.131 76.3164 418.76 76.3164C424.431 76.3164 429.956 78.2364 435.184 82.0285L435.907 82.5539V65.9007L435.674 65.7691C433.706 64.6679 431.023 63.7586 427.693 63.0691C424.376 62.3811 421.132 62.0344 418.049 62.0344ZM366.601 63.8019H349.349V137.14H366.601V63.8019ZM358.151 32.5594C355.312 32.5594 352.836 33.526 350.801 35.4414C348.758 37.3622 347.722 39.7806 347.722 42.6346C347.722 45.4438 348.746 47.8181 350.769 49.6878C352.78 51.5521 355.264 52.497 358.152 52.497C361.04 52.497 363.533 51.5521 365.568 49.6909C367.615 47.8181 368.654 45.4446 368.654 42.6346C368.654 39.8804 367.643 37.4868 365.652 35.5188C363.662 33.5547 361.138 32.5594 358.151 32.5594ZM315.108 58.3909V137.14H332.714V34.8045H308.346L277.374 110.816L247.317 34.8045H221.958V137.139H238.503V58.3832H239.071L270.81 137.14H283.296L314.54 58.3909H315.108Z"
            fill="currentColor"
          />
          <path
            d="M81.1557 81.7629H0V0.607178H81.1557V81.7629Z"
            fill="#F1511B"
          />
          <path
            d="M170.761 81.7629H89.6064V0.607178H170.761V81.7629Z"
            fill="#80CC28"
          />
          <path d="M81.1534 171.4H0V90.2446H81.1534V171.4Z" fill="#00ADEF" />
          <path
            d="M170.761 171.4H89.6064V90.2446H170.761V171.4Z"
            fill="#FBBC09"
          />
        </svg>
      ),
    },
    {
      name: 'Netlify',
      url: 'https://netlify.com',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-36"
          // width="512"
          // height="209"
          viewBox="0 0 512 209"
          fill="none"
        >
          <g clipPath="url(#clip0_235_8)">
            <path
              d="M117.436 207.036V154.604L118.529 153.51H129.452L130.545 154.604V207.036L129.452 208.13H118.529L117.436 207.036Z"
              fill="currentColor"
              opacity={0.65}
            />
            <path
              d="M117.436 53.5225V1.09339L118.529 0H129.452L130.545 1.09339V53.5225L129.452 54.6159H118.529L117.436 53.5225Z"
              fill="currentColor"
              opacity={0.65}
            />
            <path
              d="M69.9539 169.238H68.4094L60.6869 161.512V159.967L78.7201 141.938L86.8976 141.942L87.9948 143.031V151.209L69.9539 169.238Z"
              fill="currentColor"
              opacity={0.65}
            />
            <path
              d="M69.9462 38.8917H68.4017L60.6792 46.6181V48.1626L78.7124 66.192L86.8899 66.1882L87.9871 65.0986V56.9212L69.9462 38.8917Z"
              fill="currentColor"
              opacity={0.65}
            />
            <path
              d="M1.09339 97.5104H75.3711L76.4645 98.6038V109.526L75.3711 110.62H1.09339L0 109.526V98.6038L1.09339 97.5104Z"
              fill="currentColor"
              opacity={0.65}
            />
            <path
              d="M440.999 97.5104H510.91L512.004 98.6038V109.526L510.91 110.62H436.633L435.539 109.526L439.905 98.6038L440.999 97.5104Z"
              fill="currentColor"
              opacity={0.65}
            />
            <path
              d="M212.056 108.727L210.963 109.821H177.079L175.986 110.914C175.986 113.101 178.173 119.657 186.916 119.657C190.196 119.657 193.472 118.564 194.566 116.377L195.659 115.284H208.776L209.869 116.377C208.776 122.934 203.313 132.774 186.916 132.774C168.336 132.774 159.589 119.657 159.589 104.357C159.589 89.0576 168.332 75.9408 185.822 75.9408C203.313 75.9408 212.056 89.0576 212.056 104.357V108.731V108.727ZM195.659 97.7971C195.659 96.7037 194.566 89.0538 185.822 89.0538C177.079 89.0538 175.986 96.7037 175.986 97.7971L177.079 98.8905H194.566L195.659 97.7971Z"
              fill="currentColor"
            />
            <path
              d="M242.66 115.284C242.66 117.47 243.753 118.564 245.94 118.564H255.776L256.87 119.657V130.587L255.776 131.681H245.94C236.103 131.681 227.36 127.307 227.36 115.284V91.2368L226.266 90.1434H218.617L217.523 89.05V78.1199L218.617 77.0265H226.266L227.36 75.9332V66.0965L228.453 65.0031H241.57L242.663 66.0965V75.9332L243.757 77.0265H255.78L256.874 78.1199V89.05L255.78 90.1434H243.757L242.663 91.2368V115.284H242.66Z"
              fill="currentColor"
            />
            <path
              d="M283.1 131.681H269.983L268.889 130.587V56.2636L269.983 55.1702H283.1L284.193 56.2636V130.587L283.1 131.681Z"
              fill="currentColor"
            />
            <path
              d="M312.61 68.2871H299.493L298.399 67.1937V56.2636L299.493 55.1702H312.61L313.703 56.2636V67.1937L312.61 68.2871ZM312.61 131.681H299.493L298.399 130.587V78.1237L299.493 77.0304H312.61L313.703 78.1237V130.587L312.61 131.681Z"
              fill="currentColor"
            />
            <path
              d="M363.98 56.2636V67.1937L362.886 68.2871H353.05C350.863 68.2871 349.769 69.3805 349.769 71.5672V75.9408L350.863 77.0342H361.793L362.886 78.1276V89.0576L361.793 90.151H350.863L349.769 91.2444V130.591L348.676 131.684H335.559L334.466 130.591V91.2444L333.372 90.151H325.723L324.629 89.0576V78.1276L325.723 77.0342H333.372L334.466 75.9408V71.5672C334.466 59.5438 343.209 55.1702 353.046 55.1702H362.882L363.976 56.2636H363.98Z"
              fill="currentColor"
            />
            <path
              d="M404.42 132.774C400.046 143.704 395.677 150.261 380.373 150.261H374.906L373.813 149.167V138.237L374.906 137.144H380.373C385.836 137.144 386.929 136.05 388.023 132.77V131.677L370.536 89.05V78.1199L371.63 77.0265H381.466L382.56 78.1199L395.677 115.284H396.77L409.887 78.1199L410.98 77.0265H420.817L421.91 78.1199V89.05L404.424 132.77L404.42 132.774Z"
              fill="currentColor"
            />
            <path
              d="M135.454 131.681L134.361 130.587L134.368 98.9172C134.368 93.4541 132.22 89.2182 125.625 89.0806C122.234 88.9926 118.354 89.0729 114.209 89.2488L113.59 89.8834L113.598 130.587L112.504 131.681H99.3913L98.2979 130.587V77.5388L99.3913 76.4454L128.901 76.1778C143.685 76.1778 149.668 86.3356 149.668 97.8009V130.587L148.575 131.681H135.454Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_235_8">
              <rect width="512" height="208.126" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      name: 'PropelAuth',
      url: 'https://www.propelauth.com/?utm_source=epicwebconf',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="40"
          viewBox="0 0 180 40"
          fill="none"
        >
          <path
            d="M37.5478 16.2914C37.0877 14.0465 36.2174 11.9441 34.9551 10.0321L36.1885 8.0114L31.8367 3.6596L29.816 4.89296C27.9033 3.63068 25.8016 2.76045 23.5567 2.30026L23.0007 0H16.8474L16.2914 2.30026C14.0465 2.76045 11.9441 3.63068 10.0321 4.89296L8.0114 3.6596L3.6596 8.0114L4.89296 10.0321C3.63068 11.9448 2.76045 14.0465 2.30026 16.2914L0 16.8474V23.0007L2.30026 23.5567C2.76045 25.8016 3.63068 27.904 4.89296 29.816L3.6596 31.8367L8.0114 36.1885L10.0321 34.9551C11.9448 36.2174 14.0465 37.0877 16.2914 37.5478L16.8474 39.8481H23.0007L23.5567 37.5478C25.8016 37.0877 27.904 36.2174 29.816 34.9551L31.8367 36.1885L36.1885 31.8367L34.9551 29.816C36.2174 27.9033 37.0877 25.8016 37.5478 23.5567L39.8481 23.0007V16.8474L37.5478 16.2914ZM38.5627 21.9891L36.4366 22.5033L36.362 22.9159C35.9359 25.2721 35.0278 27.4643 33.6626 29.4336L33.4248 29.7768L34.5637 31.6439L31.6433 34.5644L29.7762 33.4255L29.433 33.6633C27.4643 35.0284 25.2714 35.9366 22.9152 36.3627L22.5026 36.4372L21.9891 38.5627H17.859L17.3449 36.4366L16.9322 36.362C14.5761 35.9359 12.3838 35.0278 10.4145 33.6626L10.0713 33.4248L8.20421 34.5637L5.28373 31.6433L6.42261 29.7762L6.18481 29.433C4.81969 27.4643 3.91154 25.2714 3.48542 22.9152L3.41087 22.5026L1.28542 21.9891V17.859L3.41151 17.3449L3.48607 16.9322C3.91218 14.5761 4.82033 12.3838 6.18545 10.4145L6.42326 10.0713L5.28437 8.20421L8.20485 5.28373L10.0719 6.42261L10.4151 6.18481C12.3838 4.81969 14.5767 3.91154 16.9329 3.48542L17.3455 3.41087L17.859 1.28542H21.9891L22.5033 3.41151L22.9159 3.48607C25.2721 3.91218 27.4643 4.82033 29.4336 6.18545L29.7768 6.42326L31.6439 5.28437L34.5644 8.20485L33.4255 10.0719L33.6633 10.4151C35.0284 12.3838 35.9366 14.5767 36.3627 16.9329L36.4372 17.3455L38.5633 17.8597V21.9891H38.5627Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M20.5667 2.57089H19.2812V3.85632H20.5667V2.57089Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M8.10765 7.19905L7.19873 8.10797L8.10765 9.01689L9.01658 8.10797L8.10765 7.19905Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M3.85622 19.2814H2.5708V20.5668H3.85622V19.2814Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M8.10765 30.8313L7.19873 31.7403L8.10765 32.6492L9.01658 31.7403L8.10765 30.8313Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M20.5667 35.9919H19.2812V37.2773H20.5667V35.9919Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M31.74 30.8313L30.8311 31.7402L31.74 32.6491L32.6489 31.7402L31.74 30.8313Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M37.2771 19.2814H35.9917V20.5668H37.2771V19.2814Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M31.74 7.19896L30.8311 8.10788L31.74 9.0168L32.6489 8.10788L31.74 7.19896Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M19.924 5.14169C11.7725 5.14169 5.1416 11.7725 5.1416 19.9241C5.1416 28.0756 11.7725 34.7064 19.924 34.7064C28.0755 34.7064 34.7063 28.0756 34.7063 19.9241C34.7063 11.7725 28.0755 5.14169 19.924 5.14169ZM19.924 33.421C12.482 33.421 6.42702 27.366 6.42702 19.9241C6.42702 12.4821 12.482 6.42712 19.924 6.42712C27.3659 6.42712 33.4209 12.4821 33.4209 19.9241C33.4209 27.366 27.3659 33.421 19.924 33.421Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M25.7082 18.1142V14.7824C25.7082 11.5926 23.1136 8.99799 19.9238 8.99799C16.7341 8.99799 14.1394 11.5926 14.1394 14.7824V18.1142C13.3932 18.3803 12.854 19.0873 12.854 19.9241V23.7803C12.854 27.6784 16.0258 30.8502 19.9238 30.8502C23.8219 30.8502 26.9937 27.6784 26.9937 23.7803V19.9241C26.9937 19.0873 26.4544 18.3803 25.7082 18.1142ZM19.9238 10.2834C22.4041 10.2834 24.4228 12.3022 24.4228 14.7824V17.9959H23.1374V14.7824C23.1374 13.0104 21.6958 11.5688 19.9238 11.5688C18.1519 11.5688 16.7103 13.0104 16.7103 14.7824V17.9959H15.4248V14.7824C15.4248 12.3022 17.4436 10.2834 19.9238 10.2834ZM21.852 17.9959H17.9957V14.7824C17.9957 13.7193 18.8608 12.8543 19.9238 12.8543C20.9869 12.8543 21.852 13.7193 21.852 14.7824V17.9959ZM25.7082 23.7803C25.7082 26.9701 23.1136 29.5648 19.9238 29.5648C16.7341 29.5648 14.1394 26.9701 14.1394 23.7803V19.9241C14.1394 19.5693 14.4274 19.2814 14.7821 19.2814H25.0655C25.4203 19.2814 25.7082 19.5693 25.7082 19.9241V23.7803Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M19.9239 20.5668C18.5061 20.5668 17.353 21.7198 17.353 23.1376C17.353 24.3324 18.1751 25.3299 19.2812 25.6172V28.2793H20.5666V25.6172C21.6727 25.3299 22.4947 24.3324 22.4947 23.1376C22.4947 21.7198 21.3417 20.5668 19.9239 20.5668ZM19.9239 24.423C19.215 24.423 18.6385 23.8465 18.6385 23.1376C18.6385 22.4287 19.215 21.8522 19.9239 21.8522C20.6328 21.8522 21.2093 22.4287 21.2093 23.1376C21.2093 23.8465 20.6328 24.423 19.9239 24.423Z"
            // fill="#3CCF91"
            fill="currentColor"
            opacity="0.75"
          />
          <path
            d="M57.1293 22.7379H55.4217V27.3635C54.9606 27.4499 54.3842 27.4931 53.6926 27.4931C52.9865 27.4931 52.4101 27.4499 51.9634 27.3635V12.7086L52.1147 12.5573C53.3683 12.5285 54.4095 12.5069 55.238 12.4925C56.0666 12.4781 56.697 12.4709 57.1293 12.4709C57.9219 12.4709 58.646 12.5789 59.3016 12.7951C59.9572 13.0112 60.5156 13.3355 60.9767 13.7678C61.4379 14.2001 61.7945 14.7368 62.0467 15.3781C62.2989 16.0193 62.4249 16.7578 62.4249 17.5936C62.4249 18.4293 62.2952 19.1679 62.0359 19.8091C61.7765 20.4503 61.4162 20.9871 60.9551 21.4194C60.494 21.8517 59.9356 22.1795 59.28 22.4029C58.6243 22.6262 57.9074 22.7379 57.1293 22.7379V22.7379ZM55.4217 15.1079V20.1441C55.8252 20.1297 56.1458 20.1189 56.3836 20.1117C56.6214 20.1045 56.7763 20.1009 56.8483 20.1009C57.2374 20.1009 57.5616 20.0324 57.821 19.8956C58.0804 19.7587 58.2893 19.5785 58.4478 19.3552C58.6063 19.1318 58.7216 18.8688 58.7937 18.5662C58.8657 18.2636 58.9017 17.9466 58.9017 17.6152C58.9017 17.2982 58.8657 16.9884 58.7937 16.6858C58.7216 16.3831 58.6099 16.1166 58.4586 15.886C58.3073 15.6554 58.1092 15.4717 57.8642 15.3348C57.6192 15.1979 57.3311 15.1295 56.9996 15.1295H56.1134C56.1134 15.1295 55.8829 15.1223 55.4217 15.1079V15.1079ZM75.2857 17.1613C75.2857 17.6368 75.2137 18.0871 75.0696 18.5122C74.9255 18.9373 74.7346 19.3192 74.4968 19.6578C74.259 19.9964 73.978 20.2918 73.6538 20.544C73.3296 20.7962 72.9946 20.9871 72.6487 21.1168C73.398 21.3906 73.9528 22.0534 74.3131 23.1053L74.9615 24.9426C75.2065 25.6631 75.5667 26.1963 76.0423 26.5421C75.8261 26.8303 75.5019 27.0717 75.0696 27.2662C74.6373 27.4607 74.1618 27.558 73.643 27.558C73.1243 27.558 72.7208 27.4103 72.4326 27.1149C72.1444 26.8195 71.8778 26.3043 71.6328 25.5694L70.8547 23.2999C70.6962 22.8676 70.4837 22.5362 70.2171 22.3056C69.9505 22.075 69.5506 21.9598 69.0174 21.9598H68.1312V27.3635C67.6701 27.4499 67.0937 27.4931 66.4021 27.4931C65.7104 27.4931 65.1412 27.4499 64.6945 27.3635V12.7086L64.8458 12.5573C66.0995 12.5285 67.155 12.5069 68.0124 12.4925C68.8697 12.4781 69.5434 12.4709 70.0333 12.4709C70.8259 12.4709 71.5464 12.5681 72.1948 12.7627C72.8433 12.9572 73.3944 13.249 73.8484 13.6381C74.3023 14.0271 74.6553 14.5171 74.9075 15.1079C75.1597 15.6987 75.2857 16.3831 75.2857 17.1613V17.1613ZM68.1312 15.0646V19.3011C68.7797 19.3011 69.3345 19.2903 69.7956 19.2687C70.2567 19.2471 70.6277 19.1606 70.9087 19.0093C71.1897 18.858 71.4023 18.6455 71.5464 18.3717C71.6905 18.0979 71.7625 17.7016 71.7625 17.1829C71.7625 15.7851 71.0853 15.0863 69.7307 15.0863H68.8337C68.8337 15.0863 68.5996 15.0791 68.1312 15.0646V15.0646ZM80.9056 23.3431C81.2946 24.4671 82.08 25.0291 83.2616 25.0291C83.8524 25.0291 84.3315 24.8814 84.699 24.586C85.0664 24.2906 85.3546 23.9159 85.5636 23.462C85.7725 23.0081 85.913 22.5001 85.9851 21.9381C86.0571 21.3762 86.0931 20.8214 86.0931 20.2738C86.0931 19.7695 86.0751 19.2075 86.0391 18.5879C86.0031 17.9682 85.8986 17.3882 85.7257 16.8479C85.5528 16.3075 85.279 15.8536 84.9043 15.4861C84.5297 15.1187 83.9821 14.935 83.2616 14.935C82.5699 14.935 82.0404 15.1115 81.6729 15.4645C81.3055 15.8176 81.0317 16.2535 80.8515 16.7722C80.6714 17.291 80.5597 17.8421 80.5165 18.4257C80.4733 19.0093 80.4517 19.5245 80.4517 19.9712C80.4517 20.6341 80.4841 21.2249 80.5489 21.7436C80.6138 22.2624 80.7327 22.7955 80.9056 23.3431ZM79.1548 26.326C77.6129 25.0435 76.842 22.9324 76.842 19.9928C76.842 18.7247 76.9897 17.6116 77.2851 16.6533C77.5805 15.6951 78.0056 14.8917 78.5604 14.2433C79.1152 13.5948 79.7888 13.1049 80.5814 12.7735C81.3739 12.4421 82.2673 12.2763 83.2616 12.2763C84.2559 12.2763 85.1529 12.4421 85.9526 12.7735C86.7524 13.1049 87.4296 13.5984 87.9844 14.2541C88.5392 14.9097 88.9643 15.7167 89.2597 16.6749C89.5551 17.6332 89.7028 18.7392 89.7028 19.9928C89.7028 21.2465 89.5551 22.3524 89.2597 23.3107C88.9643 24.2689 88.5392 25.0723 87.9844 25.7207C87.4296 26.3692 86.7524 26.8591 85.9526 27.1905C85.1529 27.522 84.2559 27.6877 83.2616 27.6877C81.6189 27.6877 80.2499 27.2338 79.1548 26.326ZM97.2896 22.7379H95.582V27.3635C95.1209 27.4499 94.5445 27.4931 93.8528 27.4931C93.1468 27.4931 92.5704 27.4499 92.1237 27.3635V12.7086L92.275 12.5573C93.5286 12.5285 94.5697 12.5069 95.3983 12.4925C96.2269 12.4781 96.8573 12.4709 97.2896 12.4709C98.0821 12.4709 98.8062 12.5789 99.4619 12.7951C100.118 13.0112 100.676 13.3355 101.137 13.7678C101.598 14.2001 101.955 14.7368 102.207 15.3781C102.459 16.0193 102.585 16.7578 102.585 17.5936C102.585 18.4293 102.456 19.1679 102.196 19.8091C101.937 20.4503 101.577 20.9871 101.115 21.4194C100.654 21.8517 100.096 22.1795 99.4403 22.4029C98.7846 22.6262 98.0677 22.7379 97.2896 22.7379V22.7379ZM95.582 15.1079V20.1441C95.9855 20.1297 96.3061 20.1189 96.5439 20.1117C96.7816 20.1045 96.9366 20.1009 97.0086 20.1009C97.3977 20.1009 97.7219 20.0324 97.9813 19.8956C98.2406 19.7587 98.4496 19.5785 98.6081 19.3552C98.7666 19.1318 98.8819 18.8688 98.9539 18.5662C99.026 18.2636 99.062 17.9466 99.062 17.6152C99.062 17.2982 99.026 16.9884 98.9539 16.6858C98.8819 16.3831 98.7702 16.1166 98.6189 15.886C98.4676 15.6554 98.2695 15.4717 98.0245 15.3348C97.7795 15.1979 97.4913 15.1295 97.1599 15.1295H96.2737C96.2737 15.1295 96.0431 15.1223 95.582 15.1079V15.1079ZM108.248 22.9973L108.227 24.5535V24.5752C108.89 24.5463 109.423 24.5319 109.826 24.5319H114.841C114.841 25.0651 114.819 25.4758 114.776 25.764C114.603 26.8735 113.868 27.4283 112.571 27.4283H106.822C106.202 27.4283 105.716 27.2482 105.363 26.8879C105.01 26.5277 104.833 26.0378 104.833 25.4181V12.7519L104.984 12.6006H114.3C114.387 13.0184 114.43 13.4724 114.43 13.9623C114.43 14.4522 114.329 14.9638 114.128 15.4969H108.227L108.248 17.0532V18.5662C108.623 18.5518 109.113 18.5446 109.718 18.5446H113.025C113.155 18.9481 113.22 19.4092 113.22 19.928C113.22 20.4467 113.155 20.9223 113.025 21.3545H108.248V22.9973V22.9973ZM122.709 24.4455H126.448C126.448 25.0219 126.412 25.5154 126.34 25.9261C126.268 26.3368 126.037 26.6898 125.648 26.9852C125.259 27.2806 124.748 27.4283 124.114 27.4283H119.229C118.609 27.4283 118.119 27.2482 117.759 26.8879C117.399 26.5277 117.218 26.0378 117.218 25.4181V12.6006L117.37 12.4493H118.645C120 12.4493 120.677 13.1842 120.677 14.654V24.5319C121.311 24.4743 121.988 24.4455 122.709 24.4455V24.4455ZM132.111 24.2725C131.722 24.2725 131.434 24.2653 131.246 24.2509L130.317 27.3851C129.971 27.4715 129.488 27.5148 128.869 27.5148C128.177 27.5148 127.615 27.4355 127.183 27.277L127.075 27.1041L131.83 12.6006C132.392 12.5141 133.048 12.4709 133.797 12.4709C134.647 12.4709 135.324 12.5213 135.829 12.6222L140.498 27.1473C139.993 27.4211 139.424 27.558 138.79 27.558C138.041 27.558 137.515 27.4283 137.212 27.1689C136.91 26.9095 136.65 26.4124 136.434 25.6775L136.023 24.2509C135.836 24.2653 135.555 24.2725 135.18 24.2725H132.111ZM132.046 21.5491L132.911 21.5275H134.489C134.561 21.5275 134.687 21.5311 134.867 21.5383C135.047 21.5455 135.18 21.5491 135.267 21.5491L134.899 20.209C134.553 18.9985 134.157 17.5143 133.711 15.7563H133.581C133.466 16.3759 133.12 17.7521 132.543 19.8847L132.046 21.5491ZM153.791 12.6006V21.9165C153.791 23.761 153.286 25.184 152.278 26.1855C151.269 27.1869 149.828 27.6877 147.955 27.6877C146.081 27.6877 144.637 27.1869 143.621 26.1855C142.605 25.184 142.097 23.761 142.097 21.9165V12.6006L142.248 12.4493H143.524C144.893 12.4493 145.577 13.1842 145.577 14.654V21.9598C145.577 22.9685 145.757 23.7178 146.117 24.2077C146.478 24.6976 147.09 24.9426 147.955 24.9426C148.819 24.9426 149.432 24.6976 149.792 24.2077C150.152 23.7178 150.332 22.9685 150.332 21.9598V12.6006C150.779 12.5141 151.355 12.4709 152.061 12.4709C152.753 12.4709 153.33 12.5141 153.791 12.6006V12.6006ZM162.458 15.4537L162.48 17.0532V27.3635C161.99 27.4499 161.406 27.4931 160.729 27.4931C160.052 27.4931 159.483 27.4499 159.021 27.3635V15.4537L157.638 15.4753H155.412C155.325 15.0574 155.282 14.5783 155.282 14.0379C155.282 13.4976 155.325 13.0184 155.412 12.6006H166.111C166.226 12.9752 166.284 13.4291 166.284 13.9623C166.284 14.4955 166.14 14.8809 165.852 15.1187C165.564 15.3564 165.102 15.4753 164.468 15.4753H163.842L162.48 15.4537H162.458V15.4537ZM175.989 18.3285L175.967 16.729V12.6006C176.414 12.5141 176.994 12.4709 177.707 12.4709C178.421 12.4709 178.994 12.5141 179.426 12.6006V27.3635C178.965 27.4499 178.388 27.4931 177.697 27.4931C177.005 27.4931 176.429 27.4499 175.967 27.3635V22.7811L175.989 21.1816L174.908 21.2032H172.401L171.32 21.1816L171.342 22.7811V27.3635C170.895 27.4499 170.319 27.4931 169.613 27.4931C168.907 27.4931 168.33 27.4499 167.883 27.3635V12.6006C168.33 12.5141 168.907 12.4709 169.613 12.4709C170.319 12.4709 170.895 12.5141 171.342 12.6006V16.729L171.32 18.3285L172.401 18.3069H174.908L175.989 18.3285Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'WordPress',
      url: 'https://developer.wordpress.com',
      logo: (
        <svg
          className="w-48"
          viewBox="0 0 293 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M211.486 25.2553C211.486 23.9787 212.879 23.4854 214.359 23.4854C216.767 23.4854 219.059 24.2398 219.059 24.2398V20.7581C217.492 20.2939 215.896 20.1198 214.039 20.1198C209.977 20.1198 207.134 22.0347 207.134 25.1683C207.134 31.2322 215.519 29.6945 215.519 32.6249C215.519 34.0756 214.214 34.4818 212.299 34.4818C210.935 34.4818 208.788 33.9596 207.221 33.4083V36.861C208.527 37.3832 210.355 37.8475 212.154 37.8475C216.099 37.8475 219.871 36.6869 219.871 32.4508C219.871 26.59 211.486 28.0987 211.486 25.2553ZM233.595 28.8241C233.595 24.8781 235.771 23.5435 238.324 23.5435C240.036 23.5435 241.835 24.0367 243.025 24.5009V20.9612C241.603 20.497 240.355 20.1488 238.237 20.1488C232.667 20.1488 229.214 23.5725 229.214 29.0562C229.214 34.2787 231.709 37.8765 237.976 37.8765C239.978 37.8765 241.516 37.4993 243.228 36.919V33.4373C241.313 34.1917 239.833 34.4818 238.527 34.4818C235.771 34.4238 233.595 33.1472 233.595 28.8241ZM113.012 23.3114H112.867V20.526H108.95V37.4123H113.157V27.3733C114.463 24.8781 116.058 24.0657 118.728 24.0657H119.163V20.4099C119.163 20.4099 118.554 20.3519 118.031 20.3519C115.739 20.3229 114.173 21.2223 113.012 23.3114ZM165.615 23.3114H165.47V20.526H161.553V37.4123H165.731V27.3733C167.036 24.8781 168.632 24.0657 171.302 24.0657H171.737V20.4099C171.737 20.4099 171.127 20.3519 170.605 20.3519C168.342 20.3229 166.775 21.2223 165.615 23.3114ZM286.923 20.1198C285.124 20.1198 283.064 21.1063 281.178 22.3539L280.685 22.673C279.786 20.7871 278.016 20.1198 276.072 20.1198C274.273 20.1198 272.213 21.0482 270.327 22.2959V20.555H266.323V37.4413H270.559V25.3133C272.126 24.2688 273.78 23.6305 274.998 23.6305C276.391 23.6305 277.232 24.3849 277.232 26.764V37.4123H281.439V25.3423C283.006 24.2978 284.66 23.6305 285.879 23.6305C287.271 23.6305 288.113 24.3849 288.113 26.764V37.4123H292.291V25.7485C292.291 22.499 290.347 20.1198 286.923 20.1198ZM254.427 34.4818C251.7 34.4818 250.249 32.712 250.249 28.9981C250.249 25.3424 251.7 23.5145 254.427 23.5145C257.155 23.5145 258.576 25.2843 258.576 28.9981C258.576 32.6539 257.155 34.4818 254.427 34.4818ZM254.427 20.1198C248.624 20.1198 245.897 23.8626 245.897 28.9981C245.897 34.1337 248.624 37.8475 254.427 37.8475C260.172 37.8475 262.957 34.1627 262.957 28.9981C262.957 23.8336 260.172 20.1198 254.427 20.1198ZM196.225 25.2553C196.225 23.9787 197.617 23.4854 199.097 23.4854C201.505 23.4854 203.797 24.2398 203.797 24.2398V20.7581C202.231 20.2939 200.635 20.1198 198.778 20.1198C194.716 20.1198 191.873 22.0347 191.873 25.1683C191.873 31.2322 200.258 29.6945 200.258 32.6249C200.258 34.0756 198.952 34.4818 197.037 34.4818C195.673 34.4818 193.526 33.9596 191.96 33.4083V36.861C193.265 37.3832 195.093 37.8475 196.892 37.8475C200.838 37.8475 204.61 36.6869 204.61 32.4508C204.61 26.59 196.225 28.0987 196.225 25.2553ZM178.033 27.1122C178.294 24.7621 179.571 23.2823 181.66 23.2823C183.894 23.2823 184.561 25.0522 184.561 27.1122H178.033ZM181.689 20.1198C176.292 20.1198 173.478 24.3268 173.478 28.8821C173.478 35.1782 176.785 37.8475 182.153 37.8475C184.329 37.8475 186.186 37.5573 188.391 36.89V33.4083C186.621 34.0466 185.054 34.4528 183.342 34.4528C180.209 34.4528 178.12 33.6114 178.033 29.8976H188.826C188.884 29.2303 188.971 28.5919 188.971 27.4024C188.942 23.8336 187.056 20.1198 181.689 20.1198ZM150.179 25.6615H146.843V17.1313H150.179C152.877 17.1313 154.241 18.611 154.241 21.2804C154.241 23.9207 152.994 25.6615 150.179 25.6615ZM150.15 13.6206H142.374V37.4123H146.843V29.1432H150.121C155.199 29.1432 158.912 26.4159 158.912 21.2804C158.941 16.1448 155.228 13.6206 150.15 13.6206ZM133.003 32.5669C131.639 33.8145 130.362 34.4818 129.028 34.4818C126.707 34.4818 125.227 32.9441 125.227 29.3753C125.227 25.5164 127.084 23.4854 130.275 23.4854C131.262 23.4854 132.306 23.7466 133.003 24.0077V32.5669ZM133.003 20.497C131.755 20.2358 130.885 20.1198 129.84 20.1198C124.037 20.1198 120.875 23.9787 120.875 29.6365C120.875 35.2362 124.037 37.8475 127.78 37.8475C129.637 37.8475 131.871 37.0061 133.206 35.8455V37.4123H137.21V13.6206H133.032V20.497H133.003ZM97.0541 34.4818C94.3268 34.4818 92.8761 32.712 92.8761 28.9981C92.8761 25.3424 94.3268 23.5145 97.0541 23.5145C99.7815 23.5145 101.203 25.2843 101.203 28.9981C101.203 32.6539 99.7815 34.4818 97.0541 34.4818ZM97.0541 20.1198C91.2513 20.1198 88.524 23.8626 88.524 28.9981C88.524 34.1337 91.2513 37.8475 97.0541 37.8475C102.799 37.8475 105.584 34.1627 105.584 28.9981C105.584 23.8336 102.799 20.1198 97.0541 20.1198ZM222.657 37.4123H226.864V33.0891H222.657V37.4123ZM84.7231 13.6206L79.9648 31.8415L75.2354 13.6206H70.4481L71.5506 17.5375L67.3726 32.4798L62.8174 13.6496H58.2041L64.6743 37.4413H69.6937L73.5816 24.704L77.2084 37.4413H82.2279L89.0172 13.6496H84.7231V13.6206Z"
            fill="currentColor"
          />
          <path
            d="M24.693 0.592773C11.5786 0.592773 0.901367 11.27 0.901367 24.3844C0.901367 37.4989 11.5786 48.1761 24.693 48.1761C37.8075 48.1761 48.4847 37.4989 48.4847 24.3844C48.4847 11.27 37.8075 0.592773 24.693 0.592773ZM3.30955 24.3844C3.30955 21.2799 3.97688 18.3495 5.16646 15.6802L15.3795 43.6499C8.24197 40.1682 3.30955 32.8566 3.30955 24.3844ZM24.693 45.7679C22.604 45.7679 20.573 45.4488 18.6581 44.8975L25.0702 26.2413L31.6564 44.2592C31.6855 44.3752 31.7435 44.4623 31.8015 44.5493C29.5674 45.3327 27.1883 45.7679 24.693 45.7679ZM27.6525 14.3455C28.9291 14.2875 30.0897 14.1424 30.0897 14.1424C31.2502 13.9973 31.1052 12.3145 29.9446 12.3725C29.9446 12.3725 26.4919 12.6337 24.2288 12.6337C22.1398 12.6337 18.6 12.3725 18.6 12.3725C17.4395 12.3145 17.3234 14.0554 18.455 14.1424C18.455 14.1424 19.5575 14.2875 20.6891 14.3455L24.0257 23.485L19.3834 37.5279L11.6076 14.3455C12.8842 14.2875 14.0448 14.1424 14.0448 14.1424C15.2054 13.9973 15.0603 12.3145 13.8997 12.3725C13.8997 12.3725 10.447 12.6337 8.21295 12.6337C7.80675 12.6337 7.34252 12.6337 6.84928 12.6047C10.6792 6.80182 17.2364 2.97194 24.722 2.97194C30.2928 2.97194 35.3703 5.08998 39.1711 8.6007C39.0841 8.6007 38.997 8.57168 38.881 8.57168C36.792 8.57168 35.2832 10.3996 35.2832 12.3725C35.2832 14.1424 36.2987 15.6221 37.3722 17.392C38.1846 18.8137 39.1421 20.6416 39.1421 23.2819C39.1421 25.1098 38.4458 27.2278 37.5173 30.1873L35.3703 37.3248L27.6525 14.3455ZM43.4652 14.1134C45.1481 17.1599 46.0765 20.6706 46.0765 24.3844C46.0765 32.2763 41.8114 39.1527 35.4283 42.8665L41.9565 23.9782C43.1751 20.9317 43.5813 18.4945 43.5813 16.3185C43.6103 15.5351 43.5523 14.8097 43.4652 14.1134Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ],
  community: [
    {
      name: 'Google',
      url: 'https://google.com',
      logo: (
        <svg
          className="w-28"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32.3769 26.446H19.8569V30.161H28.7369C28.2969 35.361 23.9639 37.593 19.8719 37.593C18.5756 37.5987 17.2911 37.3461 16.0935 36.8499C14.8958 36.3537 13.809 35.624 12.8965 34.7032C11.984 33.7824 11.2641 32.689 10.7788 31.487C10.2935 30.2849 10.0525 28.9982 10.0699 27.702C10.0699 22.078 14.4239 17.748 19.8839 17.748C24.0959 17.748 26.5779 20.433 26.5779 20.433L29.1779 17.739C29.1779 17.739 25.8379 14.022 19.7479 14.022C11.9929 14.022 5.9939 20.567 5.9939 27.636C5.9939 34.563 11.6369 41.318 19.9439 41.318C27.2509 41.318 32.5999 36.312 32.5999 28.91C32.5999 27.348 32.3729 26.446 32.3729 26.446H32.3769Z"
            fill="currentColor"
            // fill="#4885ED"
          />
          <path
            d="M42.634 23.7549C37.496 23.7549 33.814 27.7719 33.814 32.4549C33.814 37.2089 37.384 41.2999 42.694 41.2999C47.5 41.2999 51.437 37.6269 51.437 32.5569C51.437 26.7569 46.857 23.7539 42.634 23.7539V23.7549ZM42.684 27.2009C45.21 27.2009 47.604 29.2439 47.604 32.5349C47.604 35.7549 45.22 37.8569 42.672 37.8569C39.872 37.8569 37.672 35.6149 37.672 32.5089C37.672 29.4689 39.852 27.2009 42.692 27.2009H42.684Z"
            fill="currentColor"
            // fill="#DB3236"
          />
          <path
            d="M61.8151 23.7549C56.6771 23.7549 52.9951 27.7719 52.9951 32.4549C52.9951 37.2089 56.5651 41.2999 61.8751 41.2999C66.6811 41.2999 70.6181 37.6269 70.6181 32.5569C70.6181 26.7569 66.0381 23.7539 61.8151 23.7539V23.7549ZM61.8651 27.2009C64.3911 27.2009 66.7851 29.2439 66.7851 32.5349C66.7851 35.7549 64.4011 37.8569 61.8531 37.8569C59.0531 37.8569 56.8531 35.6149 56.8531 32.5089C56.8531 29.4689 59.0331 27.2009 61.8731 27.2009H61.8651Z"
            fill="currentColor"
            // fill="#F4C20D"
          />
          <path
            d="M80.6281 23.7649C75.9121 23.7649 72.2061 27.8949 72.2061 32.5309C72.2061 37.8109 76.5031 41.3129 80.5461 41.3129C83.0461 41.3129 84.3761 40.3199 85.3461 39.1809V40.9109C85.3461 43.9379 83.5081 45.7509 80.7341 45.7509C78.0541 45.7509 76.7101 43.7579 76.2341 42.6279L72.8621 44.0279C74.0581 46.5579 76.4661 49.1949 80.7621 49.1949C85.4621 49.1949 89.0241 46.2419 89.0241 40.0479V24.2919H85.3601V25.7779C84.2301 24.5579 82.6821 23.7649 80.6301 23.7649H80.6281ZM80.9681 27.2049C83.2801 27.2049 85.6541 29.1789 85.6541 32.5499C85.6541 35.9769 83.2841 37.8649 80.9171 37.8649C78.4031 37.8649 76.0641 35.8249 76.0641 32.5819C76.0641 29.2139 78.4941 27.2049 80.9681 27.2049Z"
            fill="currentColor"
            // fill="#4885ED"
          />
          <path
            d="M105.4 23.7439C100.952 23.7439 97.217 27.2839 97.217 32.5039C97.217 38.0299 101.38 41.3069 105.817 41.3069C109.529 41.3069 111.817 39.2769 113.167 37.4569L110.134 35.4389C109.347 36.6589 108.031 37.8539 105.836 37.8539C103.37 37.8539 102.236 36.5039 101.533 35.1939L113.296 30.3139L112.696 28.8839C111.56 26.0839 108.908 23.7439 105.4 23.7439ZM105.553 27.1179C107.156 27.1179 108.309 27.9699 108.799 28.9919L100.943 32.2749C100.603 29.7329 103.013 27.1179 105.543 27.1179H105.553Z"
            fill="currentColor"
            // fill="#DB3236"
          />
          <path
            d="M91.6001 40.7869H95.4641V14.9299H91.6001V40.7869Z"
            fill="currentColor"
            // fill="#3CBA54"
          />
        </svg>
      ),
    },
    {
      name: 'Turso',
      url: 'https://turso.tech',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-24"
          viewBox="0 0 1303 326"
          fill="none"
        >
          <title>Turso</title>
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
            // fill="#4FF8D2"
          />
        </svg>
      ),
    },
    {
      name: 'Cloudinary',
      url: 'https://cloudinary.com/developers',
      logo: (
        <svg
          className="w-36"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 96.77"
        >
          <title>Cloudinary</title>
          <g fill="currentColor">
            <path d="M160.53,30.41a17.14,17.14,0,0,1,13.56,6.7.69.69,0,0,0,1,.11l5.71-4.55a.71.71,0,0,0,.11-1,26,26,0,0,0-20.61-10.13c-14.91,0-27,12.85-27,28.65s12.13,28.65,27,28.65A25.85,25.85,0,0,0,180.9,68.72a.69.69,0,0,0-.12-1l-5.7-4.5a.71.71,0,0,0-1,.11A17.26,17.26,0,0,1,160.53,70c-10.19,0-18.16-8.7-18.16-19.79S150.34,30.41,160.53,30.41Z"></path>
            <path d="M188.27,19.91h7.16a.71.71,0,0,1,.71.71V77.4a.7.7,0,0,1-.7.7h-7.16a.71.71,0,0,1-.71-.71V20.62A.7.7,0,0,1,188.27,19.91Z"></path>
            <path d="M220.54,39.55c-9.49,0-19.09,6.72-19.09,19.57,0,11.29,8.21,19.81,19.09,19.81s19.17-8.52,19.17-19.81S231.47,39.55,220.54,39.55Zm10.53,19.57c0,6.52-4.53,11.44-10.53,11.44S210.1,65.64,210.1,59.12s4.49-11.2,10.44-11.2S231.07,52.73,231.07,59.12Z"></path>
            <path d="M278.3,40.37h-7.16a.7.7,0,0,0-.71.7v19c0,7.42-5.12,10.05-9.51,10.05-3.88,0-7.79-2.93-7.79-9.48V41.07a.7.7,0,0,0-.71-.7h-7.16a.7.7,0,0,0-.7.7v20.5c0,11.25,5.09,17.44,14.34,17.44,3.36,0,8.8-1.93,10.84-6.19l.69.14V77.4a.71.71,0,0,0,.71.71h7.16a.71.71,0,0,0,.71-.71V41.07A.7.7,0,0,0,278.3,40.37Z"></path>
            <path d="M322.27,19.91H315.1a.7.7,0,0,0-.7.71V46l-.44-.7c-2.18-3.51-6.87-5.78-11.95-5.78-8.76,0-17.62,6.75-17.62,19.65,0,11.25,7.61,19.73,17.69,19.73,3.84,0,9.25-1.54,11.88-5.86l.44-.72V77.4a.7.7,0,0,0,.7.71h7.17a.7.7,0,0,0,.7-.71V20.62A.7.7,0,0,0,322.27,19.91Zm-8,39.21a11,11,0,0,1-10.75,11.36c-5.86,0-10.45-5-10.45-11.36s4.59-11.2,10.45-11.2A11,11,0,0,1,314.24,59.12Z"></path>
            <path d="M333,40.37h7.16a.7.7,0,0,1,.7.7V77.4a.7.7,0,0,1-.7.7H333a.71.71,0,0,1-.71-.71V41.07A.71.71,0,0,1,333,40.37Z"></path>
            <path d="M336.61,21.06a5.57,5.57,0,0,0-5.69,5.57,5.64,5.64,0,0,0,5.69,5.58,5.54,5.54,0,0,0,5.61-5.58A5.48,5.48,0,0,0,336.61,21.06Z"></path>
            <path d="M370.35,39.55c-3.14,0-8.72,1.69-10.85,6.19l-.69-.14V41.07a.7.7,0,0,0-.71-.7h-7.16a.7.7,0,0,0-.7.7V77.4a.7.7,0,0,0,.7.71h7.16a.71.71,0,0,0,.71-.71v-19c0-7.36,5.12-10,9.51-10,3.88,0,7.79,2.91,7.79,9.4V77.4a.71.71,0,0,0,.71.71H384a.71.71,0,0,0,.71-.71V56.91C384.69,45.72,379.59,39.55,370.35,39.55Z"></path>
            <path d="M427.48,40.37h-7.16a.7.7,0,0,0-.71.7v5l-.43-.7c-2.19-3.51-6.88-5.78-12-5.78-8.75,0-17.62,6.75-17.62,19.65,0,11.25,7.61,19.73,17.7,19.73,3.83,0,9.24-1.54,11.88-5.86l.43-.72V77.4a.71.71,0,0,0,.71.71h7.16a.7.7,0,0,0,.7-.71V41.07A.7.7,0,0,0,427.48,40.37Zm-8,18.75A11,11,0,0,1,408.7,70.48c-5.86,0-10.44-5-10.44-11.36s4.58-11.2,10.44-11.2A11,11,0,0,1,419.46,59.12Z"></path>
            <path d="M460.15,40.5a13.66,13.66,0,0,0-5.14-1c-4.76,0-8.22,2.85-10,8.25l-.64-.09V41.07a.7.7,0,0,0-.71-.7h-7.16a.7.7,0,0,0-.71.7V77.4a.71.71,0,0,0,.71.71h7.24a.7.7,0,0,0,.7-.71V65c0-14.8,5.91-17,9.44-17a11,11,0,0,1,4.33.9.72.72,0,0,0,.61,0,.7.7,0,0,0,.36-.48l1.42-7.11A.71.71,0,0,0,460.15,40.5Z"></path>
            <path d="M499.88,40.68a.69.69,0,0,0-.59-.31h-7.71a.72.72,0,0,0-.66.45L481.59,65l-9.42-24.18a.72.72,0,0,0-.66-.45h-7.86a.69.69,0,0,0-.58.31.7.7,0,0,0-.07.66l14,34.38-7.73,20.09a.71.71,0,0,0,.66,1h7.5a.69.69,0,0,0,.65-.45l21.86-55A.69.69,0,0,0,499.88,40.68Z"></path>
            <path d="M97.91,28.11A40.38,40.38,0,0,0,59.73,0,39.62,39.62,0,0,0,24.6,20.87a29.88,29.88,0,0,0-7.21,56.56l.75.34h.05v-8.5a22.29,22.29,0,0,1,9.29-41.16l2.1-.22L30.5,26A32.15,32.15,0,0,1,59.73,7.57a32.7,32.7,0,0,1,31.55,25L92,35.43l3,0a18.53,18.53,0,0,1,18.15,18.46c0,7.05-4.07,12.82-11,15.74v8.06l.5-.16c11.14-3.65,18.06-12.71,18.06-23.64A26.19,26.19,0,0,0,97.91,28.11Z"></path>
            <path d="M45.07,76.79l1.66,1.66a.33.33,0,0,1-.23.56H33.4a6,6,0,0,1-6-6V47.57a.33.33,0,0,0-.33-.33H24.27a.33.33,0,0,1-.24-.56L35.15,35.56a.33.33,0,0,1,.47,0L46.73,46.68a.33.33,0,0,1-.23.56H43.66a.34.34,0,0,0-.34.33v25A6,6,0,0,0,45.07,76.79Z"></path>
            <path d="M69.64,76.79l1.67,1.66a.33.33,0,0,1-.24.56H58a6,6,0,0,1-6-6V54a.34.34,0,0,0-.33-.34H48.84a.33.33,0,0,1-.23-.56L59.72,42a.33.33,0,0,1,.47,0L71.31,53.08a.33.33,0,0,1-.24.56H68.23a.34.34,0,0,0-.33.34V72.57A6,6,0,0,0,69.64,76.79Z"></path>
            <path d="M94.22,76.79l1.66,1.66a.33.33,0,0,1-.23.56H82.54a6,6,0,0,1-6-6V60.38a.33.33,0,0,0-.33-.33H73.41a.33.33,0,0,1-.23-.57L84.3,48.37a.32.32,0,0,1,.46,0L95.88,59.48a.33.33,0,0,1-.23.57H92.8a.33.33,0,0,0-.33.33V72.57A6,6,0,0,0,94.22,76.79Z"></path>
          </g>
        </svg>
      ),
    },
    {
      name: 'Partykit',
      url: 'https://www.partykit.io/',
      logo: (
        <svg
          className="w-24"
          viewBox="0 0 186 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35.4469 57.6435C35.1812 57.6419 34.9163 57.5957 34.6641 57.5049C34.0073 57.2685 33.4933 56.7555 33.2539 56.0978L26.9207 38.6834C26.8784 38.6005 26.8408 38.5141 26.8081 38.4244C26.775 38.3338 26.7481 38.2424 26.7267 38.1505L20.8476 21.9852C20.5537 21.1774 20.7633 20.5127 20.9147 20.1881C21.1751 19.6294 21.6396 19.2053 22.2223 18.994L32.9048 15.1088C39.6784 12.6457 46.6494 15.2934 48.7747 21.1368C49.8373 24.0585 49.4967 27.2271 47.8155 30.0594C46.2406 32.7126 43.6374 34.805 40.4852 35.9515L32.0554 39.0173L37.6817 54.4869C37.9208 55.144 37.8567 55.8672 37.5059 56.4703C37.2291 56.9459 36.7909 57.3118 36.2717 57.5008C36.0057 57.5975 35.726 57.6452 35.4469 57.6435ZM26.0756 22.575L30.455 34.6165L38.8846 31.5508C43.1752 29.9905 45.5746 26.1235 44.3468 22.7473C43.1188 19.3715 38.7954 17.9488 34.5054 19.5095L26.0756 22.575Z"
            fill="currentColor"
          />
          <path
            d="M53.6432 53.3544C53.4039 53.353 53.162 53.3149 52.9247 53.2366C51.7812 52.8594 51.1249 51.7044 51.38 50.5344L57.3244 22.1867C57.4072 21.7924 57.5934 21.4273 57.8637 21.1288C58.2353 20.719 58.7379 20.4497 59.279 20.3711L60.6081 20.1798C61.1537 20.0998 61.7174 20.2189 62.1929 20.5132C62.5321 20.7229 62.8099 21.0183 62.9987 21.3696L72.8843 39.7765C72.978 39.9133 73.0569 40.06 73.1195 40.2146L76.7027 46.8867C77.2798 47.9395 76.9752 49.234 75.9805 49.9187C74.975 50.6111 73.5895 50.4157 72.8267 49.4736C72.737 49.3627 72.658 49.2437 72.5905 49.1179L69.6451 43.6239L57.2302 45.4115L55.9553 51.5131C55.9254 51.6564 55.8815 51.7966 55.8247 51.9317C55.451 52.8165 54.5695 53.3601 53.6432 53.3544ZM60.9803 27.4617L58.2413 40.5716L67.3089 39.2661L60.9803 27.4617Z"
            fill="currentColor"
          />
          <path
            d="M100.023 48.5096C99.9575 48.5092 99.8919 48.5062 99.8257 48.5004L89.9105 47.5868C86.923 47.3115 84.1929 46.0911 82.2239 44.1502C80.1097 42.0664 79.0871 39.3796 79.3448 36.5847C79.7679 31.9907 83.5393 28.5323 88.4551 27.7878L81.7668 13.8002C81.2159 12.6506 81.7101 11.2629 82.8682 10.707C84.0457 10.1421 85.4573 10.6271 86.0152 11.7877L93.6918 27.8776L99.2763 28.3921L100.572 14.3322C100.69 13.0482 101.844 12.1001 103.139 12.2186C104.436 12.3371 105.396 13.478 105.28 14.7616L102.327 46.3917C102.213 47.6208 101.22 48.5169 100.023 48.5096ZM90.5233 32.304C87.061 32.2828 84.2693 34.2511 84.0147 37.015C83.7411 39.9865 86.5187 42.5902 90.3384 42.9423L97.8717 43.6362L98.8482 33.0371L91.3152 32.3429C91.0479 32.3185 90.7836 32.3056 90.5233 32.304Z"
            fill="currentColor"
          />
          <path
            d="M111.187 50.312C110.96 50.3106 110.729 50.2773 110.5 50.209C110.086 50.0853 109.712 49.8574 109.419 49.5501C108.837 48.9393 108.625 48.0609 108.864 47.2574L119.84 10.3717L109.958 7.43149C109.131 7.18537 108.494 6.52258 108.298 5.70141C108.105 4.89421 108.36 4.03835 108.962 3.46777C109.576 2.88728 110.47 2.68006 111.299 2.92596L123.252 6.48256C123.324 6.49719 123.397 6.51513 123.469 6.53662C123.54 6.55788 123.61 6.58224 123.678 6.60946L135.684 10.1817C136.951 10.5585 137.681 11.8755 137.311 13.1177C137.097 13.838 136.543 14.4149 135.828 14.6608C135.351 14.8252 134.838 14.8342 134.344 14.6872L124.411 11.7316L113.488 48.6316C113.487 48.6334 113.487 48.6352 113.486 48.6367C113.181 49.66 112.224 50.3184 111.187 50.312ZM113.214 48.5498L113.213 48.5533C113.213 48.5522 113.213 48.5509 113.214 48.5498Z"
            fill="currentColor"
          />
          <path
            d="M127.551 56.6581C127.192 56.6559 126.829 56.5708 126.489 56.394C125.35 55.7994 124.904 54.3896 125.496 53.2511L129.667 45.2566L130.35 26.2071C130.351 26.159 130.354 26.1109 130.359 26.0629C130.48 24.8513 131.476 23.9541 132.683 23.9615C132.695 23.9615 132.707 23.9616 132.72 23.9619C133.926 23.9877 134.925 24.9518 134.994 26.1568C134.997 26.2255 134.998 26.2944 134.996 26.3631L134.492 41.0548L146.255 32.2373C146.311 32.1949 146.37 32.1554 146.43 32.1183C147.457 31.4888 148.818 31.7587 149.527 32.7322C150.247 33.7194 150.087 35.0672 149.155 35.8671C149.118 35.8994 149.079 35.9304 149.039 35.9601L133.818 47.392L129.636 55.4076C129.218 56.2075 128.397 56.6633 127.551 56.6581Z"
            fill="currentColor"
          />
          <path
            d="M60.5691 101.007C59.5737 101.001 58.6555 100.353 58.3572 99.3539L53.8042 84.041L48.379 88.0295L46.5654 95.0893C46.3598 95.8901 45.7368 96.5259 44.939 96.7492C44.1249 96.9771 43.243 96.751 42.6389 96.1591C42.0462 95.5785 41.8064 94.7194 42.0132 93.9176L48.7861 67.5512C48.9897 66.7524 49.6133 66.1151 50.4125 65.8913C51.2261 65.6632 52.1083 65.8893 52.7126 66.4814C53.3052 67.062 53.545 67.9211 53.3383 68.723L50.2058 80.9179L64.803 70.1862C65.4463 69.6936 66.3113 69.5695 67.0811 69.8769C67.9464 70.2223 68.5243 71.0409 68.5537 71.9621C68.579 72.7523 68.1954 73.4915 67.5541 73.9325L57.7849 81.1147L62.8139 98.0296C63.018 98.7157 62.8886 99.4702 62.4681 100.049C62.1703 100.458 61.738 100.764 61.2508 100.909C61.0239 100.977 60.7946 101.009 60.5691 101.007ZM46.4081 95.0453C46.4081 95.0451 46.4084 95.0449 46.4084 95.0447L46.4081 95.0453ZM42.1709 93.9597C42.1702 93.9622 42.1695 93.9648 42.1689 93.9672C42.1693 93.9661 42.1695 93.965 42.17 93.9637L42.1709 93.9597ZM65.2818 70.0239C65.2814 70.0241 65.2807 70.0245 65.2803 70.0247C65.2807 70.0243 65.2814 70.0241 65.2818 70.0239ZM53.1808 68.6797L53.179 68.6868C53.1794 68.6846 53.1801 68.6821 53.1808 68.6797ZM48.9433 67.5952C48.9429 67.5965 48.9426 67.5978 48.9422 67.5989L48.9433 67.5952Z"
            fill="currentColor"
          />
          <path
            d="M115.558 96.839C115.438 96.8383 115.318 96.8285 115.199 96.8094C114.376 96.6778 113.683 96.1135 113.39 95.3365L104.592 72.0432L98.8694 74.2042C98.0804 74.5034 97.1891 74.3614 96.5447 73.8346C95.9076 73.3134 95.5945 72.4851 95.7278 71.673C95.8626 70.8512 96.438 70.1555 97.2297 69.8573L104.975 66.932C105.084 66.8811 105.197 66.8386 105.312 66.8045L113.095 63.8653C113.095 63.8651 113.096 63.8649 113.096 63.8647C114.31 63.407 115.666 64.0093 116.118 65.2063C116.57 66.4036 115.952 67.7513 114.739 68.211L108.982 70.3851L117.813 93.6649C117.814 93.6664 117.814 93.668 117.815 93.6698C118.268 94.872 117.644 96.2239 116.424 96.6835C116.145 96.7883 115.851 96.8408 115.558 96.839ZM98.8339 74.1016L98.8313 74.1025C98.8322 74.1023 98.8331 74.1019 98.8339 74.1016ZM97.2679 69.959C97.2668 69.9594 97.2654 69.9598 97.2641 69.9605L97.2679 69.959ZM114.696 68.1106L114.696 68.1108C114.696 68.1108 114.696 68.1106 114.696 68.1106Z"
            fill="currentColor"
          />
          <path
            d="M87.9856 83.9766C88.3496 86.1586 87.3723 88.3638 86.0387 90.1287C84.705 91.8936 83.0129 93.3576 81.6198 95.076C79.8068 97.3121 78.4998 100.061 78.4556 102.94C78.4114 105.818 79.7953 108.799 82.3044 110.21C83.7086 111 85.3628 111.264 86.9726 111.199C91.2332 111.025 95.0918 108.682 98.4693 106.08C103.2 102.433 107.402 98.156 111.859 94.1797C116.682 89.8774 121.903 85.8686 127.912 83.488C138.517 79.2863 150.595 80.5717 161.437 84.1168C168.811 86.5279 175.798 89.9185 182.787 93.31"
            stroke="currentColor"
            strokeWidth="1.48562"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />
          <path
            d="M99.431 49.6409C102.347 60.5223 98.5288 81.5582 87.6474 84.4739C76.766 87.3895 62.9417 71.0808 60.026 60.1994C57.1104 49.318 63.5679 38.1333 74.4492 35.2177C85.3306 32.302 96.5153 38.7595 99.431 49.6409Z"
            fill="currentColor"
            // fill="#FF0000"
          />
        </svg>
      ),
    },
    {
      name: 'Resend',
      url: 'https://resend.com',
      logo: (
        <svg
          className="w-20"
          viewBox="0 0 65 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.820068 15V1.00001H7.02007C7.88674 1.00001 8.6734 1.20001 9.38007 1.60001C10.0867 1.98668 10.6401 2.51334 11.0401 3.18001C11.4534 3.84668 11.6601 4.60668 11.6601 5.46001C11.6601 6.30001 11.4534 7.06668 11.0401 7.76001C10.6401 8.44001 10.0867 8.98001 9.38007 9.38001C8.6734 9.78001 7.88674 9.98001 7.02007 9.98001H3.72007V15H0.820068ZM8.76007 15L5.20007 8.68001L8.28007 8.18001L12.2401 15.02L8.76007 15ZM3.72007 7.54001H6.88007C7.24007 7.54001 7.5534 7.46001 7.82007 7.30001C8.10007 7.12668 8.3134 6.89334 8.46007 6.60001C8.60673 6.29335 8.68007 5.95335 8.68007 5.58001C8.68007 5.18001 8.5934 4.83335 8.42007 4.54001C8.24674 4.24668 7.9934 4.02001 7.66007 3.86001C7.32674 3.68668 6.94007 3.60001 6.50007 3.60001H3.72007V7.54001Z"
            fill="currentColor"
          />
          <path
            d="M18.0534 15.2C16.9067 15.2 15.9 14.9667 15.0333 14.5C14.18 14.0333 13.5134 13.3933 13.0333 12.58C12.5667 11.7667 12.3333 10.8333 12.3333 9.78001C12.3333 8.95335 12.4667 8.20001 12.7333 7.52001C13 6.84001 13.3733 6.25335 13.8533 5.76001C14.3333 5.25335 14.9 4.86668 15.5534 4.60001C16.22 4.32001 16.94 4.18001 17.7134 4.18001C18.4334 4.18001 19.1 4.31335 19.7134 4.58001C20.3267 4.84668 20.8534 5.22001 21.2934 5.70001C21.7467 6.16668 22.0934 6.72668 22.3334 7.38001C22.5734 8.02001 22.68 8.71335 22.6534 9.46001L22.6334 10.34H14.1334L13.6733 8.60001H20.2934L19.9734 8.96001V8.52001C19.9467 8.16001 19.8267 7.84001 19.6133 7.56001C19.4134 7.26668 19.1534 7.04001 18.8334 6.88001C18.5134 6.70668 18.1533 6.62001 17.7533 6.62001C17.1667 6.62001 16.6667 6.73335 16.2533 6.96001C15.8533 7.18668 15.5467 7.52001 15.3333 7.96001C15.12 8.40001 15.0133 8.93335 15.0133 9.56001C15.0133 10.2 15.1467 10.7533 15.4134 11.22C15.6934 11.6867 16.08 12.0533 16.5734 12.32C17.08 12.5733 17.6733 12.7 18.3533 12.7C18.82 12.7 19.2467 12.6267 19.6334 12.48C20.02 12.3333 20.4333 12.08 20.8734 11.72L22.2334 13.62C21.8467 13.9667 21.42 14.26 20.9534 14.5C20.4867 14.7267 20.0067 14.9 19.5133 15.02C19.02 15.14 18.5334 15.2 18.0534 15.2Z"
            fill="currentColor"
          />
          <path
            d="M27.3121 15.2C26.3254 15.2 25.4454 15.04 24.6721 14.72C23.9121 14.3867 23.2988 13.9333 22.8321 13.36L24.6121 11.84C25.0121 12.28 25.4654 12.6 25.9721 12.8C26.4788 12.9867 26.9854 13.08 27.4921 13.08C27.6921 13.08 27.8721 13.06 28.0321 13.02C28.2054 12.9667 28.3521 12.9 28.4721 12.82C28.5921 12.7267 28.6788 12.62 28.7321 12.5C28.7988 12.3667 28.8321 12.2267 28.8321 12.08C28.8321 11.7867 28.7121 11.56 28.4721 11.4C28.3388 11.32 28.1321 11.2333 27.8521 11.14C27.5721 11.0333 27.2121 10.92 26.7721 10.8C26.0921 10.6267 25.5121 10.4267 25.0321 10.2C24.5654 9.96001 24.1921 9.69335 23.9121 9.40001C23.6721 9.12001 23.4854 8.82001 23.3521 8.50001C23.2321 8.16668 23.1721 7.80001 23.1721 7.40001C23.1721 6.92001 23.2788 6.48668 23.4921 6.10001C23.7054 5.70001 23.9988 5.36001 24.3721 5.08001C24.7588 4.80001 25.1988 4.58668 25.6921 4.44001C26.1854 4.28001 26.7054 4.20001 27.2521 4.20001C27.7988 4.20001 28.3321 4.26668 28.8521 4.40001C29.3721 4.53335 29.8521 4.72668 30.2921 4.98001C30.7454 5.22001 31.1388 5.50668 31.4721 5.84001L29.9521 7.52001C29.7121 7.29334 29.4388 7.08668 29.1321 6.90001C28.8388 6.71335 28.5321 6.56668 28.2121 6.46001C27.8921 6.35335 27.6054 6.30001 27.3521 6.30001C27.1254 6.30001 26.9188 6.32001 26.7321 6.36001C26.5588 6.40001 26.4121 6.46668 26.2921 6.56001C26.1721 6.64001 26.0788 6.74001 26.0121 6.86001C25.9588 6.98001 25.9321 7.11334 25.9321 7.26001C25.9321 7.40668 25.9654 7.54668 26.0321 7.68001C26.1121 7.81335 26.2188 7.92668 26.3521 8.02001C26.4988 8.10001 26.7121 8.19335 26.9921 8.30001C27.2854 8.40668 27.6788 8.52668 28.1721 8.66001C28.8121 8.83335 29.3521 9.02668 29.7921 9.24001C30.2454 9.45335 30.6054 9.70001 30.8721 9.98001C31.0988 10.22 31.2654 10.4933 31.3721 10.8C31.4788 11.1067 31.5321 11.4467 31.5321 11.82C31.5321 12.4733 31.3454 13.0533 30.9721 13.56C30.6121 14.0667 30.1121 14.4667 29.4721 14.76C28.8321 15.0533 28.1121 15.2 27.3121 15.2Z"
            fill="currentColor"
          />
          <path
            d="M37.5768 15.2C36.4301 15.2 35.4235 14.9667 34.5568 14.5C33.7035 14.0333 33.0368 13.3933 32.5568 12.58C32.0901 11.7667 31.8568 10.8333 31.8568 9.78001C31.8568 8.95335 31.9901 8.20001 32.2568 7.52001C32.5235 6.84001 32.8968 6.25335 33.3768 5.76001C33.8568 5.25335 34.4235 4.86668 35.0768 4.60001C35.7435 4.32001 36.4635 4.18001 37.2368 4.18001C37.9568 4.18001 38.6235 4.31335 39.2368 4.58001C39.8501 4.84668 40.3768 5.22001 40.8168 5.70001C41.2701 6.16668 41.6168 6.72668 41.8568 7.38001C42.0968 8.02001 42.2035 8.71335 42.1768 9.46001L42.1568 10.34H33.6568L33.1968 8.60001H39.8168L39.4968 8.96001V8.52001C39.4701 8.16001 39.3501 7.84001 39.1368 7.56001C38.9368 7.26668 38.6768 7.04001 38.3568 6.88001C38.0368 6.70668 37.6768 6.62001 37.2768 6.62001C36.6901 6.62001 36.1901 6.73335 35.7768 6.96001C35.3768 7.18668 35.0701 7.52001 34.8568 7.96001C34.6435 8.40001 34.5368 8.93335 34.5368 9.56001C34.5368 10.2 34.6701 10.7533 34.9368 11.22C35.2168 11.6867 35.6035 12.0533 36.0968 12.32C36.6035 12.5733 37.1968 12.7 37.8768 12.7C38.3435 12.7 38.7701 12.6267 39.1568 12.48C39.5435 12.3333 39.9568 12.08 40.3968 11.72L41.7568 13.62C41.3701 13.9667 40.9435 14.26 40.4768 14.5C40.0101 14.7267 39.5301 14.9 39.0368 15.02C38.5435 15.14 38.0568 15.2 37.5768 15.2Z"
            fill="currentColor"
          />
          <path
            d="M43.2755 15V4.42001H45.9955L46.0755 6.58001L45.5155 6.82001C45.6622 6.34001 45.9222 5.90668 46.2955 5.52001C46.6822 5.12001 47.1422 4.80001 47.6755 4.56001C48.2089 4.32001 48.7689 4.20001 49.3555 4.20001C50.1555 4.20001 50.8222 4.36001 51.3555 4.68001C51.9022 5.00001 52.3089 5.48668 52.5755 6.14001C52.8555 6.78001 52.9955 7.57335 52.9955 8.52001V15H50.1555V8.74001C50.1555 8.26001 50.0889 7.86001 49.9555 7.54001C49.8222 7.22001 49.6155 6.98668 49.3355 6.84001C49.0689 6.69334 48.7355 6.62668 48.3355 6.64001C48.0155 6.64001 47.7155 6.69335 47.4355 6.80001C47.1689 6.89334 46.9355 7.03335 46.7355 7.22001C46.5489 7.40668 46.3955 7.62001 46.2755 7.86001C46.1689 8.10001 46.1155 8.36001 46.1155 8.64001V15H44.7155C44.4089 15 44.1355 15 43.8955 15C43.6555 15 43.4489 15 43.2755 15Z"
            fill="currentColor"
          />
          <path
            d="M58.8569 15.2C57.9236 15.2 57.0903 14.9667 56.3569 14.5C55.6369 14.02 55.0636 13.3733 54.6369 12.56C54.2236 11.7333 54.0169 10.78 54.0169 9.70001C54.0169 8.64668 54.2236 7.70668 54.6369 6.88001C55.0636 6.04001 55.6369 5.38668 56.3569 4.92001C57.0903 4.44001 57.9236 4.20001 58.8569 4.20001C59.3503 4.20001 59.8236 4.28001 60.2769 4.44001C60.7436 4.58668 61.1569 4.79335 61.5169 5.06001C61.8903 5.32668 62.1903 5.62668 62.4169 5.96001C62.6436 6.28001 62.7703 6.61335 62.7969 6.96001L62.0769 7.10001V0.200012H64.9369V15H62.2369L62.1169 12.56L62.6769 12.62C62.6503 12.9533 62.5303 13.2733 62.3169 13.58C62.1036 13.8867 61.8169 14.1667 61.4569 14.42C61.1103 14.66 60.7103 14.8533 60.2569 15C59.8169 15.1333 59.3503 15.2 58.8569 15.2ZM59.4969 12.84C60.0303 12.84 60.4969 12.7067 60.8969 12.44C61.2969 12.1733 61.6103 11.8067 61.8369 11.34C62.0636 10.8733 62.1769 10.3267 62.1769 9.70001C62.1769 9.08668 62.0636 8.54668 61.8369 8.08001C61.6103 7.61335 61.2969 7.24668 60.8969 6.98001C60.4969 6.71335 60.0303 6.58001 59.4969 6.58001C58.9636 6.58001 58.4969 6.71335 58.0969 6.98001C57.7103 7.24668 57.4036 7.61335 57.1769 8.08001C56.9636 8.54668 56.8569 9.08668 56.8569 9.70001C56.8569 10.3267 56.9636 10.8733 57.1769 11.34C57.4036 11.8067 57.7103 12.1733 58.0969 12.44C58.4969 12.7067 58.9636 12.84 59.4969 12.84Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Onboardbase',
      url: 'https://onboardbase.com/',
      logo: (
        <svg
          className="w-36"
          // width="1551"
          // height="198"
          viewBox="0 0 1551 198"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 182.74C2.09 174.14 4.38 165.58 6.23 156.92C15.66 112.8 24.98 68.6601 34.27 24.5201C34.8 21.9801 35.46 20.8801 38.51 21.4801C47.28 23.1801 56.13 24.4501 65.55 25.9901C54.05 80.2201 42.66 133.97 31.17 188.18C22.35 186.74 13.88 185.33 5.39 184.01C3.62 183.74 1.8 183.83 0 183.75C0 183.42 0 183.09 0 182.75L0 182.74Z"
            fill="currentColor"
          />
          <path
            d="M464.17 179.19C463.11 184.35 462.22 188.69 461.27 193.35H436.6V0H467.45V71.49C469.34 70.18 470.9 69.14 472.42 68.05C484.96 58.98 498.54 53.81 514.42 56.14C531.44 58.64 544.17 67.57 550.98 82.89C563.89 111.93 563.97 141.36 548 169.32C537.48 187.73 520.98 197.71 498.9 196.69C488.46 196.2 479.79 191.51 471.72 185.42C469.36 183.64 467.14 181.67 464.16 179.21L464.17 179.19ZM467.87 128.23C467.87 136.51 468.27 144.82 467.73 153.07C467.37 158.51 469.62 161.51 473.91 164.2C492.94 176.12 512.86 171.96 521.15 153.36C529.18 135.35 529.08 116.62 522.53 98.15C519.02 88.25 511.49 82.73 500.76 81.81C487.37 80.66 477.62 87.53 468.75 96.21C467.9 97.04 467.91 98.98 467.9 100.4C467.83 109.68 467.86 118.96 467.86 128.23H467.87Z"
            fill="currentColor"
          />
          <path
            d="M1041.92 193.55H1016.28C1015.44 188.91 1014.61 184.29 1013.61 178.74C1011.5 180.52 1010.04 181.75 1008.6 182.99C988.39 200.35 960.73 201.64 941.32 185.86C929.69 176.41 923.72 163.58 920.99 149.22C916.5 125.58 917.72 102.64 931.04 81.6299C944.39 60.5599 968.47 50.5999 990.31 57.7099C997.58 60.0799 1004.1 64.7199 1010.98 68.3299V0.129883H1041.93V193.55H1041.92ZM1010.52 124.42C1010.52 116.63 1009.87 108.77 1010.71 101.07C1011.52 93.6199 1007.93 89.9599 1002.16 86.7299C982.83 75.8999 963.44 82.1999 955.69 102.66C949.29 119.58 949.8 136.86 956.43 153.64C960.6 164.2 968.73 170.2 980.47 170.85C991.69 171.47 1000.41 166.47 1007.78 158.75C1009.3 157.16 1010.33 154.48 1010.4 152.26C1010.69 142.99 1010.52 133.7 1010.52 124.42Z"
            fill="currentColor"
          />
          <path
            d="M1069.42 0.0200195H1100.2V71.48C1103.77 69.01 1106.78 66.77 1109.95 64.78C1141.7 44.8 1177.74 57.86 1188.13 93.75C1195.67 119.81 1194.99 145.71 1180.58 169.65C1169.47 188.11 1152.95 197.96 1130.77 196.62C1120.97 196.03 1112.62 191.59 1104.94 185.8C1102.44 183.91 1100.09 181.82 1096.96 179.24C1095.9 184.18 1094.96 188.57 1093.95 193.33H1069.42V0.0200195ZM1100.6 128.02C1100.6 135.97 1101.17 143.98 1100.43 151.86C1099.8 158.61 1102.81 162.03 1108.15 165.14C1129.18 177.4 1149.36 169.94 1156.47 146.63C1161.22 131.04 1161.07 115.21 1155.95 99.71C1152.34 88.78 1144.55 82.42 1132.74 81.73C1119.86 80.97 1110.22 87.51 1101.66 96.05C1100.71 97 1100.66 99.11 1100.65 100.69C1100.56 109.8 1100.61 118.91 1100.61 128.02H1100.6Z"
            fill="currentColor"
          />
          <path
            d="M697.8 126.4C697.58 147.63 691.61 166.66 675.3 181.25C645.73 207.7 594.12 200.99 576.27 160.33C564.14 132.71 565.38 105.03 583.56 80.1599C598.24 60.0699 619.39 52.5799 643.89 56.5399C667.68 60.3899 684.12 74.3299 692.4 96.7399C693.102 99.0688 700.18 123.417 697.81 126.39L697.8 126.4ZM600.44 126.29C602.19 134.48 603.14 142.95 605.87 150.79C609.83 162.13 617.69 169.87 630.51 170.95C643.34 172.03 653.27 166.75 658.68 155.42C668.22 135.44 668.61 114.82 657.55 95.3999C646.44 75.8999 619.96 76.5899 608.54 95.9799C603.08 105.25 601.68 115.52 600.44 126.29Z"
            fill="currentColor"
          />
          <path
            d="M277.99 131.25C277.72 148.86 271.18 168.68 253.17 183.21C220.69 209.41 165.19 198.54 152.17 148.68C145.54 123.29 148.31 98.74 165.61 77.7C194.58 42.46 252.3 50.55 270.94 92.19C275.84 103.12 277.98 113.54 277.99 131.25ZM180.69 125.69C181.8 136.67 183.24 147.09 188.75 156.57C200.02 175.96 226.82 176.5 237.91 157.05C248.47 138.53 248.02 118.88 240.12 99.56C235.23 87.6 225.76 80.94 212.42 81.42C199.01 81.9 190.38 89.6 186.16 101.65C183.46 109.36 181 115.5 180.69 125.69Z"
            fill="currentColor"
          />
          <path
            d="M816.48 193.51H790.4C789.58 188.81 788.75 184.04 787.77 178.37C785.15 180.37 783.11 181.93 781.06 183.48C767.95 193.38 753.43 198.91 736.81 196.26C720.35 193.64 709.05 182.44 705.84 166.58C702.26 148.87 708.6 133.49 723.63 124.11C736.42 116.13 750.82 112.72 765.45 110.15C771.66 109.06 777.91 108.24 784.08 107.31C785.77 92.71 776.23 81.7 761.87 81.16C749.22 80.68 738.14 85.38 727.33 91.11C725.58 92.04 723.87 93.03 721.82 94.17C717.99 87.22 714.25 80.44 710.27 73.21C723.87 64.54 738.23 58.2 754.14 56.53C762.48 55.65 771.23 55.48 779.42 56.98C800.27 60.8 813.48 76.61 815.37 99.56C816.43 112.42 816.32 125.38 816.43 138.3C816.59 156.52 816.47 174.74 816.47 193.49L816.48 193.51ZM784.65 126.32C773.91 129.03 763.97 130.99 754.44 134.16C749.43 135.83 744.59 139.03 740.65 142.59C734.94 147.75 734.33 154.81 736.8 161.86C739.16 168.58 744.72 171.2 751.45 171.99C764.86 173.57 774.61 166.74 783.61 158.21C784.23 157.62 784.59 156.47 784.6 155.58C784.67 146.35 784.64 137.11 784.64 126.31L784.65 126.32Z"
            fill="currentColor"
          />
          <path
            d="M1279.61 107.32C1278.89 87.4101 1267.13 77.7101 1248.03 81.8501C1239.07 83.7901 1230.63 88.1001 1221.99 91.4201C1220.33 92.0601 1218.81 93.0701 1216.88 94.1001C1213.03 87.0801 1209.32 80.3101 1205.4 73.1701C1219.22 64.5701 1233.55 58.0002 1249.51 56.5802C1258.65 55.7602 1268.28 55.7501 1277.18 57.7101C1297.21 62.1201 1306.51 76.8702 1310.04 95.8702C1310.94 100.73 1311.38 105.74 1311.41 110.69C1311.54 137.04 1311.48 163.4 1311.46 189.75C1311.46 190.88 1311.31 192.01 1311.22 193.41H1285.46C1284.68 188.68 1283.9 184 1282.98 178.42C1280.89 179.98 1279.26 181.19 1277.63 182.41C1265.83 191.32 1253.15 197.24 1237.73 196.81C1217.48 196.25 1201.69 181.72 1200.27 161.52C1198.99 143.27 1206.72 130.22 1222.79 121.81C1238.84 113.42 1256.39 110.56 1274.06 108.13C1275.84 107.89 1277.62 107.62 1279.64 107.33L1279.61 107.32ZM1279.87 126.82C1271.51 128.56 1264.01 129.87 1256.64 131.72C1249.03 133.63 1241.68 136.31 1236.01 142.15C1230.43 147.9 1229.53 154.74 1232.01 161.96C1234.34 168.74 1240.01 171.21 1246.74 172C1260 173.55 1269.63 166.73 1278.6 158.41C1279.34 157.72 1279.8 156.37 1279.81 155.33C1279.9 146.24 1279.86 137.15 1279.86 126.82H1279.87Z"
            fill="currentColor"
          />
          <path
            d="M296.14 59.0499H321.74C322.53 64.9099 323.3 70.6199 324.2 77.2699C326.56 75.3199 328.55 73.7499 330.45 72.0899C339.62 64.1099 349.68 57.9799 362.02 56.1699C387.62 52.4199 405.38 65.0399 409.58 90.3999C410.58 96.4199 411.13 102.59 411.16 108.69C411.33 135.71 411.24 162.73 411.22 189.75C411.22 190.88 411.05 192.02 410.94 193.41H379.58C379.58 191.4 379.58 189.63 379.58 187.85C379.58 163.98 379.62 140.11 379.55 116.23C379.54 111.93 379.2 107.63 378.85 103.34C377.22 83.5399 363.59 79.4599 349.07 84.5099C341.58 87.1099 335.33 93.4099 328.81 98.4099C327.65 99.2999 327.54 102.02 327.54 103.89C327.46 131.57 327.49 159.26 327.49 186.94V193.26H296.14V59.0499Z"
            fill="currentColor"
          />
          <path
            d="M1548.81 134.94H1463.29C1465.22 168.33 1499.51 184.12 1534.26 162.84C1537.74 169.17 1541.21 175.48 1544.91 182.22C1537 187.99 1528.3 191.9 1518.97 194.13C1493.67 200.19 1470.27 197.02 1450.98 178.09C1423.54 151.17 1423.77 89.2398 1463.49 64.3798C1490.73 47.3398 1540.67 51.8198 1548.95 103.52C1550.6 113.85 1550.85 124.2 1548.82 134.94H1548.81ZM1522.47 113.12C1522.62 90.7598 1511.99 79.3598 1492.77 80.1098C1477.48 80.7098 1462.98 96.0498 1463.48 113.12H1522.47Z"
            fill="currentColor"
          />
          <path
            d="M1321.51 179.26C1327.28 171.42 1332.07 164.91 1336.69 158.63C1343.41 162.36 1349.55 166.32 1356.14 169.29C1365.15 173.35 1374.75 174.31 1384.42 171.72C1390.7 170.04 1394.88 166.04 1395.97 159.41C1397.02 153.02 1394.13 148.12 1388.86 145.24C1381.75 141.37 1374.12 138.46 1366.79 134.99C1359.61 131.59 1352.14 128.59 1345.45 124.38C1319.77 108.22 1326.51 73.1998 1349.73 62.1198C1372.72 51.1498 1394.9 54.0298 1416.29 66.7798C1418.7 68.2098 1420.91 69.9598 1423.46 71.7298C1418.55 78.1798 1413.86 84.3598 1409.96 89.4798C1400.67 86.0498 1392.26 82.1098 1383.41 80.0098C1378.59 78.8698 1372.68 79.9198 1367.86 81.6398C1357.62 85.2898 1355.91 98.1098 1364.92 104.14C1370.62 107.95 1377.39 110.19 1383.74 113.01C1391.16 116.3 1398.89 119 1406.06 122.77C1419.76 129.97 1426.95 141.36 1426.15 157.12C1425.36 172.62 1417.58 183.87 1403.81 190.48C1385.27 199.39 1366.01 198.9 1347.08 191.87C1338.47 188.67 1330.51 183.75 1321.55 179.25L1321.51 179.26Z"
            fill="currentColor"
          />
          <path
            d="M868.99 82.6098C874.01 76.7198 878.02 71.2198 882.82 66.5298C892.67 56.9298 904.63 53.7198 918.21 56.3698C922.25 57.1598 924.31 58.4598 923.01 63.2798C921.08 70.4298 919.95 77.7998 918.41 85.3898C915.46 84.8898 912.88 84.4698 910.31 84.0298C899.31 82.1398 890.31 85.8998 883.01 93.9398C876.03 101.63 871.82 110.11 872.17 121.18C872.86 143.37 872.37 165.6 872.37 187.81C872.37 189.59 872.37 191.37 872.37 193.42H840.86V58.9298C848.84 58.9298 856.91 58.7998 864.96 59.1198C865.8 59.1498 867.04 61.7298 867.22 63.2298C867.97 69.4398 868.39 75.6798 868.99 82.6098Z"
            fill="currentColor"
          />
          <path
            d="M99.24 25.4302C109.05 27.0302 118.05 28.5202 127.06 29.9702C130.32 30.4902 129.74 32.5702 129.26 34.8202C124.9 55.2102 120.57 75.6002 116.26 96.0002C109.72 126.92 103.2 157.84 96.66 188.76C96.39 190.05 95.95 191.3 95.42 193.17C85.49 191.55 75.58 189.94 64.74 188.17C76.24 133.92 87.67 79.9902 99.24 25.4402V25.4302Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'Snaplet',
      url: 'https://snaplet.dev/',
      logo: (
        <svg
          className="w-36"
          viewBox="0 0 165 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_148_210)">
            <path
              d="M63.2517 30.2877C65.177 30.2877 66.6919 29.8622 67.7966 29.0112C68.3374 28.5994 68.7703 28.0648 69.0587 27.4525C69.3471 26.8402 69.4825 26.1681 69.4535 25.493C69.4757 24.7969 69.3046 24.1081 68.959 23.5015C68.5642 22.8939 68.0051 22.4083 67.3453 22.1C66.3727 21.6219 65.3464 21.2594 64.2877 21.0202C63.0844 20.7199 62.1783 20.4624 61.5695 20.2479C61.1153 20.1111 60.6949 19.8822 60.3349 19.5757C60.1186 19.3435 60.002 19.037 60.01 18.7212C60.008 18.4395 60.0853 18.1628 60.2332 17.9222C60.3812 17.6816 60.5939 17.4865 60.8475 17.359C61.5088 17.0008 62.2627 16.8452 63.0134 16.912C63.8285 16.9154 64.6231 17.1649 65.2913 17.6271C65.7051 17.9146 66.019 18.3217 66.1902 18.7927C66.2334 18.9355 66.3265 19.0585 66.4528 19.1397C66.579 19.2209 66.7303 19.2551 66.8797 19.2361L68.8471 18.8785C68.9148 18.8687 68.9799 18.8453 69.0381 18.8097C69.0964 18.7741 69.1467 18.727 69.186 18.6714C69.2252 18.6158 69.2525 18.5528 69.2662 18.4864C69.28 18.4199 69.2798 18.3514 69.2658 18.285C69.0048 17.1692 68.3229 16.1945 67.3598 15.5605C66.0663 14.7103 64.5359 14.2838 62.9845 14.3413C61.1916 14.3413 59.7476 14.7573 58.6526 15.5891C58.1311 15.9661 57.7103 16.4634 57.4266 17.0378C57.1429 17.6122 57.0049 18.2465 57.0246 18.8857C57.0046 19.548 57.1708 20.2028 57.5047 20.7771C57.9279 21.3549 58.5002 21.8094 59.1616 22.0928C60.1663 22.5579 61.2146 22.9244 62.2914 23.1869C63.4947 23.5039 64.3864 23.7697 64.9664 23.9842C65.4032 24.107 65.7985 24.3442 66.1107 24.6707C66.3116 24.9371 66.4124 25.2646 66.3959 25.5967C66.4067 25.8997 66.3394 26.2005 66.2005 26.4707C66.0615 26.7409 65.8555 26.9717 65.6017 27.1413C64.9572 27.549 64.1994 27.7454 63.4358 27.7026C62.5327 27.7339 61.6406 27.4987 60.8727 27.0269C60.3526 26.6942 59.9501 26.2093 59.7212 25.6396C59.6743 25.5109 59.5851 25.4014 59.4679 25.3288C59.3508 25.2562 59.2124 25.2246 59.075 25.2392L57.0932 25.5431C57.0218 25.5521 56.9533 25.5759 56.8919 25.6131C56.8306 25.6502 56.7779 25.6998 56.7373 25.7586C56.6967 25.8174 56.6692 25.884 56.6565 25.9541C56.6437 26.0242 56.6462 26.0961 56.6636 26.1652C56.9629 27.3423 57.6839 28.3715 58.6923 29.0613C59.8764 29.8789 61.3962 30.2877 63.2517 30.2877Z"
              fill="white"
            />
            <path
              d="M73.9883 29.3438C73.9892 29.4864 74.0471 29.6228 74.1492 29.7232C74.2513 29.8237 74.3894 29.8801 74.5334 29.8801H76.4466C76.5903 29.8801 76.728 29.8236 76.8295 29.723C76.9311 29.6224 76.9881 29.486 76.9881 29.3438V21.9999C76.9467 21.0195 77.1268 20.0423 77.5152 19.1396C77.8116 18.4877 78.3064 17.9439 78.9303 17.5843C79.525 17.2648 80.1923 17.1011 80.8688 17.1087C81.5635 17.0774 82.2523 17.2476 82.8506 17.5986C83.3525 17.9167 83.7589 18.3625 84.0275 18.8893C84.3028 19.4361 84.4892 20.0226 84.5798 20.6269C84.6804 21.2249 84.7323 21.8299 84.735 22.4361V29.3438C84.735 29.4145 84.7492 29.4846 84.7766 29.5499C84.804 29.6152 84.8442 29.6745 84.8949 29.7243C84.9456 29.7742 85.0057 29.8136 85.0718 29.8403C85.1379 29.8671 85.2087 29.8806 85.2801 29.8801H87.1898C87.2612 29.8806 87.332 29.8671 87.3981 29.8403C87.4642 29.8136 87.5243 29.7742 87.575 29.7243C87.6257 29.6745 87.6659 29.6152 87.6933 29.5499C87.7208 29.4846 87.7349 29.4145 87.7349 29.3438V21.4779C87.7283 20.9335 87.6861 20.3901 87.6085 19.8511C87.5152 19.2058 87.3543 18.5719 87.1284 17.9597C86.8895 17.3092 86.539 16.7044 86.0924 16.172C85.624 15.6004 85.0285 15.144 84.3524 14.8384C83.5138 14.4785 82.6053 14.3064 81.6919 14.3342C80.6783 14.3156 79.6728 14.5169 78.7462 14.9242C78.3391 15.1103 77.9541 15.3405 77.5982 15.6106C77.5139 15.6743 77.4142 15.7149 77.3091 15.7282C77.2039 15.7415 77.0971 15.7271 76.9993 15.6865C76.9016 15.6459 76.8164 15.5805 76.7523 15.4969C76.6882 15.4132 76.6475 15.3144 76.6344 15.2102C76.6344 15.086 76.5845 14.9668 76.4958 14.879C76.4072 14.7911 76.2869 14.7418 76.1615 14.7418H74.5334C74.3888 14.7418 74.2502 14.7987 74.1479 14.8999C74.0457 15.0012 73.9883 15.1385 73.9883 15.2817V29.3438Z"
              fill="white"
            />
            <path
              d="M97.1561 30.3164C98.9322 30.3164 100.388 29.8528 101.524 28.9256C101.928 28.5966 102.665 28.854 102.665 29.3689C102.665 29.5083 102.721 29.642 102.82 29.7406C102.92 29.8391 103.055 29.8945 103.195 29.8945H104.737C104.808 29.895 104.879 29.8814 104.945 29.8547C105.011 29.828 105.071 29.7885 105.122 29.7387C105.173 29.6888 105.213 29.6296 105.24 29.5643C105.268 29.499 105.282 29.4289 105.282 29.3582V20.5555C105.282 19.9227 105.253 19.3292 105.199 18.7678C105.142 18.2221 104.988 17.6907 104.744 17.1982C104.296 16.2203 103.499 15.4409 102.506 15.0101C101.384 14.5159 100.167 14.2718 98.9394 14.295C97.1753 14.295 95.7602 14.6787 94.6941 15.4462C93.7808 16.0934 93.0872 16.9997 92.705 18.0456C92.6819 18.1119 92.6731 18.1823 92.679 18.2523C92.6849 18.3222 92.7056 18.3901 92.7395 18.4517C92.7735 18.5133 92.8201 18.5672 92.8763 18.6099C92.9326 18.6527 92.9972 18.6833 93.066 18.6999L94.8024 19.229C94.9461 19.2676 95.099 19.2525 95.2322 19.1865C95.3653 19.1206 95.4693 19.0085 95.5244 18.8715C95.7747 18.3141 96.1985 17.8505 96.7337 17.5486C97.4063 17.1727 98.1671 16.9791 98.9394 16.9872C100.143 16.9872 101.002 17.2399 101.517 17.7453C102.004 18.2359 102.3 18.8822 102.351 19.5687C102.366 19.7014 102.327 19.8347 102.243 19.9393C102.16 20.0439 102.037 20.1112 101.903 20.1265C100.82 20.2731 99.7733 20.4304 98.7408 20.5913C97.691 20.741 96.6517 20.9559 95.6291 21.2348C94.5877 21.5227 93.6525 22.1026 92.9361 22.9046C92.3027 23.7062 91.9777 24.7049 92.0192 25.722C92.011 26.5166 92.21 27.2998 92.5967 27.996C93.0128 28.6964 93.6162 29.2693 94.3403 29.6514C95.2093 30.0993 96.1765 30.3277 97.1561 30.3164ZM97.6795 27.9173C96.7373 27.9173 96.037 27.7028 95.5858 27.2737C95.3737 27.079 95.2048 26.8427 95.0899 26.5799C94.9749 26.317 94.9163 26.0334 94.9179 25.747C94.9027 25.4797 94.9484 25.2124 95.0515 24.9648C95.1546 24.7173 95.3125 24.4958 95.5136 24.3168C95.9607 23.9469 96.4754 23.6653 97.0297 23.4874C97.7734 23.2784 98.5293 23.1148 99.2932 22.9975C100.015 22.8831 100.817 22.7639 101.697 22.64C101.775 22.6275 101.855 22.6326 101.931 22.6548C102.007 22.677 102.077 22.7158 102.135 22.7683C102.194 22.8209 102.24 22.8858 102.269 22.9582C102.299 23.0307 102.312 23.1089 102.307 23.187C102.307 23.3622 102.282 23.5446 102.268 23.7376C102.237 24.1382 102.156 24.5334 102.026 24.914C101.899 25.4391 101.652 25.9285 101.304 26.3441C100.916 26.8269 100.422 27.2157 99.8599 27.4811C99.1751 27.7845 98.4293 27.9288 97.6795 27.903V27.9173Z"
              fill="white"
            />
            <path
              d="M110.361 36.0727C110.361 36.2159 110.419 36.3532 110.521 36.4545C110.623 36.5557 110.762 36.6126 110.906 36.6126H112.787C112.932 36.6126 113.07 36.5557 113.173 36.4545C113.275 36.3532 113.332 36.2159 113.332 36.0727V30.0231C113.342 29.9136 113.38 29.8083 113.442 29.717C113.504 29.6257 113.588 29.5513 113.686 29.5006C113.785 29.45 113.895 29.4249 114.006 29.4275C114.117 29.43 114.225 29.4603 114.321 29.5154C114.598 29.6709 114.888 29.8025 115.188 29.9087C115.945 30.1804 116.747 30.3137 117.552 30.302C118.867 30.3379 120.16 29.968 121.252 29.2437C122.297 28.5238 123.124 27.5347 123.642 26.3834C124.226 25.1021 124.517 23.7092 124.494 22.3038C124.519 20.8983 124.228 19.5048 123.642 18.2243C123.124 17.0646 122.285 16.0732 121.224 15.3639C120.125 14.6454 118.829 14.2784 117.513 14.3128C116.639 14.3 115.772 14.463 114.964 14.7919C114.533 14.9654 114.124 15.1899 113.747 15.4605C113.681 15.5046 113.604 15.531 113.524 15.5369C113.443 15.5429 113.363 15.5282 113.291 15.4944C113.218 15.4606 113.155 15.4088 113.109 15.3439C113.062 15.2791 113.034 15.2035 113.025 15.1244C113.025 15.021 112.984 14.9219 112.91 14.8488C112.836 14.7757 112.736 14.7346 112.632 14.7346H110.939C110.867 14.7342 110.796 14.7478 110.73 14.7748C110.663 14.8017 110.603 14.8415 110.552 14.8917C110.502 14.942 110.462 15.0017 110.434 15.0674C110.407 15.1331 110.393 15.2035 110.394 15.2745L110.361 36.0727ZM117.141 27.6526C115.697 27.6526 114.64 27.1521 113.971 26.1509C113.302 25.1498 112.976 23.8651 112.993 22.2967C112.993 20.7259 113.319 19.4447 113.971 18.4531C114.623 17.4615 115.647 16.9657 117.043 16.9657C117.907 16.9307 118.759 17.1824 119.462 17.6808C120.107 18.1745 120.595 18.8425 120.866 19.6044C121.186 20.466 121.344 21.3786 121.332 22.2967C121.344 23.2228 121.191 24.1438 120.881 25.0175C120.611 25.7752 120.129 26.4411 119.491 26.9375C118.813 27.4342 117.984 27.6865 117.141 27.6526Z"
              fill="white"
            />
            <path
              d="M129.299 29.3438C129.3 29.4863 129.358 29.6227 129.46 29.7232C129.562 29.8237 129.7 29.8801 129.844 29.8801H131.721C131.792 29.8806 131.863 29.867 131.929 29.8403C131.996 29.8135 132.056 29.7741 132.106 29.7243C132.157 29.6744 132.197 29.6151 132.225 29.5498C132.252 29.4845 132.266 29.4145 132.266 29.3438V9.80771C132.266 9.66453 132.209 9.5272 132.107 9.42595C132.004 9.3247 131.866 9.26782 131.721 9.26782H129.844C129.7 9.26876 129.562 9.32595 129.46 9.427C129.358 9.52804 129.3 9.66482 129.299 9.80771V29.3438Z"
              fill="white"
            />
            <path
              d="M144.717 30.3162C146.141 30.3334 147.541 29.949 148.753 29.2079C149.79 28.5706 150.635 27.6676 151.197 26.5942C151.23 26.5277 151.248 26.4547 151.25 26.3806C151.251 26.3064 151.237 26.2327 151.207 26.1647C151.177 26.0966 151.133 26.0359 151.077 25.9866C151.021 25.9372 150.954 25.9006 150.883 25.8792L149.006 25.2928C148.879 25.256 148.744 25.2628 148.622 25.3122C148.5 25.3615 148.398 25.4505 148.334 25.5645C147.536 26.8946 146.287 27.5632 144.576 27.5632C144.018 27.5921 143.46 27.5046 142.938 27.3063C142.416 27.1079 141.943 26.8032 141.547 26.4119C140.875 25.6662 140.45 24.7338 140.331 23.7411C140.32 23.6676 140.326 23.5927 140.348 23.5216C140.369 23.4506 140.406 23.385 140.456 23.3296C140.506 23.2741 140.567 23.2301 140.636 23.2005C140.705 23.1709 140.779 23.1565 140.854 23.1583H151.143C151.281 23.1602 151.415 23.108 151.515 23.013C151.615 22.918 151.673 22.7878 151.677 22.6506C151.743 21.2231 151.515 19.7971 151.005 18.4602C150.528 17.2179 149.671 16.1542 148.554 15.4175C147.368 14.6757 145.985 14.3022 144.583 14.3449C143.207 14.2984 141.844 14.6287 140.645 15.2995C139.514 15.9712 138.6 16.9486 138.01 18.1169C137.361 19.4542 137.041 20.9243 137.075 22.4074C137.044 23.838 137.371 25.2538 138.024 26.5299C138.64 27.679 139.566 28.6359 140.699 29.2937C141.923 29.9811 143.31 30.334 144.717 30.3162ZM144.692 16.9263C146.819 16.9263 148.099 18.0395 148.533 20.2658C148.546 20.3403 148.542 20.4168 148.522 20.4898C148.502 20.5629 148.466 20.6305 148.416 20.688C148.367 20.7455 148.305 20.7913 148.235 20.8222C148.165 20.853 148.089 20.8681 148.013 20.8664H140.948C140.871 20.8682 140.794 20.8525 140.723 20.8205C140.653 20.7886 140.591 20.7413 140.541 20.6821C140.492 20.6229 140.457 20.5534 140.438 20.4788C140.42 20.4042 140.419 20.3265 140.436 20.2514C140.61 19.3716 141.047 18.5642 141.692 17.9346C142.421 17.2481 143.414 16.912 144.681 16.912L144.692 16.9263Z"
              fill="currentColor"
            />
            <path
              d="M164.545 29.9588C164.669 29.9376 164.781 29.8735 164.862 29.7779C164.943 29.6823 164.986 29.5614 164.985 29.4368V28.0245C164.985 27.9462 164.968 27.8689 164.935 27.7977C164.902 27.7265 164.855 27.663 164.795 27.6113C164.736 27.5596 164.666 27.521 164.591 27.4979C164.515 27.4748 164.436 27.4679 164.357 27.4775C163.695 27.5485 163.027 27.5485 162.365 27.4775C162.034 27.4521 161.715 27.3481 161.434 27.1745C161.154 27.0008 160.919 26.7625 160.751 26.4799C160.56 26.1318 160.459 25.7426 160.455 25.3465C160.455 24.896 160.455 24.3668 160.455 23.759V17.6129C160.455 17.4697 160.512 17.3324 160.615 17.2311C160.717 17.1299 160.855 17.073 161 17.073H164.455C164.599 17.0721 164.737 17.0149 164.839 16.9138C164.941 16.8128 164.999 16.676 165 16.5331V15.2567C165 15.1135 164.942 14.9762 164.84 14.8749C164.738 14.7737 164.599 14.7168 164.455 14.7168H161C160.856 14.7159 160.718 14.6587 160.616 14.5576C160.514 14.4566 160.456 14.3198 160.455 14.1769V11.0484C160.454 10.9055 160.396 10.7688 160.294 10.6677C160.192 10.5667 160.054 10.5095 159.91 10.5085H158.025C157.881 10.5095 157.743 10.5667 157.641 10.6677C157.539 10.7688 157.481 10.9055 157.48 11.0484V14.1769C157.48 14.3195 157.423 14.4563 157.322 14.5574C157.221 14.6586 157.083 14.7159 156.939 14.7168H155.094C155.023 14.7168 154.952 14.7308 154.886 14.758C154.82 14.7851 154.76 14.825 154.71 14.8752C154.66 14.9253 154.62 14.9849 154.593 15.0504C154.566 15.1159 154.552 15.186 154.553 15.2567V16.5331C154.553 16.6757 154.61 16.8125 154.711 16.9136C154.813 17.0148 154.95 17.0721 155.094 17.073H156.939C157.01 17.073 157.081 17.087 157.147 17.1142C157.213 17.1414 157.273 17.1812 157.323 17.2314C157.373 17.2815 157.413 17.3411 157.44 17.4066C157.467 17.472 157.481 17.5422 157.48 17.6129V23.902C157.48 24.7244 157.49 25.4621 157.509 26.1152C157.545 26.7831 157.728 27.435 158.047 28.0245C158.408 28.7088 158.992 29.2519 159.704 29.5655C160.485 29.9053 161.327 30.0865 162.181 30.0982C162.971 30.1269 163.763 30.0802 164.545 29.9588Z"
              fill="currentColor"
            />
            <path
              opacity="0.5"
              d="M12.6978 37.7885C13.9379 37.7885 15.1273 37.3008 16.0045 36.4327C16.8818 35.5646 17.3751 34.387 17.3762 33.1588C17.3762 32.5504 17.2551 31.9481 17.02 31.3861C16.7848 30.8242 16.4402 30.3136 16.0057 29.8837C15.5712 29.4537 15.0554 29.1128 14.4879 28.8803C13.9203 28.6479 13.312 28.5285 12.6978 28.5291C11.4581 28.5291 10.2692 29.0168 9.39254 29.8851C8.51592 30.7533 8.02344 31.9309 8.02344 33.1588C8.02448 34.3863 8.5173 35.5633 9.39369 36.4313C10.2701 37.2993 11.4584 37.7874 12.6978 37.7885Z"
              fill="currentColor"
            />
            <path
              opacity="0.5"
              d="M36.4967 33.819C37.1109 33.8195 37.7191 33.7001 38.2867 33.4677C38.8543 33.2353 39.37 32.8943 39.8045 32.4644C40.239 32.0344 40.5837 31.5238 40.8188 30.9619C41.054 30.3999 41.175 29.7976 41.175 29.1893C41.174 27.961 40.6806 26.7835 39.8034 25.9153C38.9261 25.0472 37.7368 24.5596 36.4967 24.5596C35.2573 24.5606 34.0689 25.0487 33.1925 25.9167C32.3161 26.7847 31.8233 27.9617 31.8223 29.1893C31.8223 30.4171 32.3147 31.5948 33.1914 32.463C34.068 33.3312 35.2569 33.819 36.4967 33.819Z"
              fill="currentColor"
            />
            <path
              d="M1.19056 45.0243C1.04358 45.0249 0.897769 44.9984 0.760589 44.9461C0.614571 44.8908 0.481068 44.8074 0.367791 44.7007C0.254515 44.5939 0.163711 44.4661 0.100625 44.3244C0.0375395 44.1827 0.00342228 44.03 0.000244509 43.8752C-0.00293326 43.7204 0.0248914 43.5665 0.0821112 43.4224C0.109724 43.3443 1.23 40.164 1.74675 29.3887C2.02682 23.5283 2.03471 20.9537 1.55741 15.1988C1.09588 9.69 1.84931 6.45117 3.77824 5.56429C6.48426 4.33361 8.93783 6.31832 11.3125 8.24053C13.9317 10.362 16.6378 12.5382 20.2668 12.0146C22.7401 11.6474 23.6474 9.354 24.748 5.89637C25.6079 3.2045 26.4915 0.426674 29.0871 0.0359811C30.3099 -0.139831 31.655 0.329007 33.083 1.43467C39.9388 6.74418 47.9977 25.56 49.3546 39.4256C49.3699 39.5791 49.3544 39.734 49.3091 39.8815C49.2638 40.029 49.1895 40.1662 49.0906 40.2853C48.9916 40.4043 48.87 40.5028 48.7325 40.5752C48.5951 40.6476 48.4445 40.6924 48.2896 40.7071C47.9773 40.7365 47.6661 40.6419 47.4242 40.4441C47.1823 40.2463 47.0296 39.9615 46.9997 39.6522C45.6072 25.3959 37.3826 7.73656 31.6156 3.27875C30.7438 2.60676 29.9667 2.27465 29.4184 2.3567C28.2784 2.5247 27.6512 4.50162 26.9806 6.59964C25.9708 9.77207 24.7164 13.7181 20.5982 14.3314C15.9317 15.0269 12.5235 12.2686 9.78987 10.0338C7.50593 8.18584 6.03852 7.08409 4.74073 7.68966C4.19243 7.93971 3.4745 10.1432 3.8808 14.9995C4.36994 20.8873 4.3581 23.5127 4.07409 29.4903C3.52578 40.8946 2.30689 44.1218 2.25561 44.2546C2.17519 44.4731 2.03098 44.6629 1.84132 44.7999C1.65167 44.937 1.42514 45.0151 1.19056 45.0243Z"
              fill="currentColor"
            />
            <path
              d="M6.70257 35.8898C6.58688 35.8888 6.47392 35.8548 6.37733 35.7917C6.28074 35.7286 6.20464 35.6392 6.15821 35.5342C6.12575 35.4628 6.10808 35.3857 6.10622 35.3074C6.10437 35.2291 6.11839 35.1512 6.14744 35.0784C6.17649 35.0055 6.21999 34.9392 6.27536 34.8833C6.33074 34.8274 6.39687 34.783 6.46984 34.7528L11.1206 32.7759L6.23711 31.7914C6.16111 31.7765 6.08884 31.7468 6.02446 31.7041C5.96007 31.6614 5.90485 31.6066 5.86196 31.5426C5.81906 31.4787 5.78935 31.4071 5.77453 31.3318C5.75971 31.2564 5.76006 31.1789 5.77558 31.1038C5.7902 31.0281 5.81982 30.9561 5.86273 30.8919C5.90563 30.8277 5.96097 30.7726 6.02554 30.7297C6.09011 30.6868 6.16263 30.6571 6.2389 30.6422C6.31516 30.6272 6.39366 30.6274 6.46984 30.6427L13.2112 32.0024C13.3349 32.0266 13.4475 32.0893 13.5326 32.1814C13.6178 32.2735 13.671 32.39 13.6846 32.5142C13.697 32.6387 13.6693 32.7639 13.6056 32.872C13.5418 32.98 13.4452 33.0654 13.3296 33.1158L6.93531 35.839C6.86251 35.8728 6.783 35.8902 6.70257 35.8898Z"
              fill="currentColor"
            />
            <path
              d="M42.4956 30.1779H42.464L35.5175 29.8068C35.3956 29.8024 35.278 29.7606 35.1812 29.6871C35.0844 29.6135 35.013 29.512 34.9771 29.3965C34.9461 29.2758 34.9551 29.1484 35.0026 29.033C35.0502 28.9177 35.1339 28.8205 35.2414 28.7558L41.0992 25.181C41.2329 25.1009 41.393 25.0761 41.545 25.112C41.697 25.1478 41.8287 25.2413 41.9118 25.3724C41.9928 25.5055 42.0179 25.6647 41.9818 25.8158C41.9456 25.967 41.8511 26.0982 41.7185 26.1811L37.474 28.7675L42.5271 29.0371C42.6838 29.0462 42.8304 29.1161 42.9353 29.2317C43.0402 29.3473 43.0948 29.4992 43.0873 29.6544C43.0708 29.7984 43.0014 29.9314 42.8922 30.0279C42.7831 30.1245 42.6419 30.1779 42.4956 30.1779Z"
              fill="currentColor"
            />
            <path
              d="M23.9951 34.2058C23.0279 34.2468 22.0744 33.9687 21.2841 33.415C20.4938 32.8614 19.9114 32.0635 19.6284 31.1467C19.5683 30.9524 19.5869 30.7425 19.6805 30.5616C19.774 30.3807 19.935 30.243 20.1293 30.1778C20.3265 30.109 20.5433 30.1205 20.7319 30.2099C20.9205 30.2993 21.0655 30.4591 21.1352 30.6544C21.652 32.2172 23.0129 32.897 24.8708 32.5649C26.7287 32.2328 27.7228 31.1037 27.6873 29.4628C27.6873 29.2555 27.7704 29.0568 27.9183 28.9103C28.0663 28.7637 28.267 28.6814 28.4762 28.6814C28.6854 28.6814 28.8861 28.7637 29.034 28.9103C29.182 29.0568 29.2651 29.2555 29.2651 29.4628C29.3164 31.8773 27.7385 33.6666 25.1509 34.1316C24.7686 34.1903 24.3818 34.2151 23.9951 34.2058Z"
              fill="currentColor"
            />
            <path
              opacity="0.5"
              d="M10.7924 27.2477C10.7347 27.2537 10.6765 27.2537 10.6188 27.2477C10.4149 27.202 10.2376 27.078 10.1259 26.9029C10.0142 26.7278 9.97724 26.516 10.0232 26.3139C10.4176 24.6379 12.5754 22.0398 15.2459 21.6256C17.9164 21.2115 20.6421 23.1884 21.0918 24.7082C21.1208 24.8067 21.13 24.9099 21.1187 25.0119C21.1075 25.1139 21.076 25.2127 21.0262 25.3027C20.9764 25.3927 20.9092 25.4721 20.8284 25.5363C20.7476 25.6005 20.6548 25.6484 20.5554 25.6771C20.355 25.7353 20.1396 25.7124 19.9562 25.6136C19.7728 25.5147 19.6365 25.3479 19.5771 25.1497C19.3562 24.3996 17.4233 22.8641 15.4944 23.1689C13.5655 23.4736 11.8338 25.4661 11.5497 26.6851C11.502 26.8474 11.4023 26.99 11.2657 27.0914C11.1292 27.1929 10.9631 27.2477 10.7924 27.2477Z"
              fill="currentColor"
            />
            <path
              opacity="0.4"
              d="M26.1721 24.6456C26.0985 24.6466 26.0253 24.6361 25.9551 24.6143C25.8554 24.5864 25.7622 24.5392 25.6808 24.4756C25.5995 24.412 25.5316 24.3331 25.4811 24.2435C25.4305 24.1539 25.3983 24.0553 25.3862 23.9533C25.3742 23.8513 25.3825 23.748 25.4108 23.6493C25.8052 22.231 27.2371 19.715 29.9905 19.2813C32.4953 18.8906 35.3789 20.5511 36.1875 22.2467C36.231 22.3405 36.2553 22.4419 36.259 22.5451C36.2627 22.6483 36.2457 22.7511 36.2091 22.8478C36.1724 22.9444 36.1167 23.0329 36.0453 23.1081C35.9739 23.1833 35.8882 23.2437 35.7931 23.2859C35.6981 23.3296 35.5954 23.3542 35.4908 23.3582C35.3862 23.3621 35.2819 23.3455 35.1838 23.3091C35.0858 23.2727 34.9961 23.2174 34.9198 23.1464C34.8436 23.0753 34.7824 22.9899 34.7398 22.8952C34.2507 21.8677 32.0851 20.5081 30.2193 20.805C28.247 21.1137 27.1937 23.0672 26.9097 24.0595C26.8672 24.223 26.7724 24.3685 26.6394 24.4741C26.5064 24.5798 26.3425 24.6399 26.1721 24.6456Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30.4359 27.4431C28.7783 27.441 27.1892 26.7879 26.0171 25.6271C24.8555 24.4765 24.1975 22.9203 24.1838 21.2944C23.9498 21.2556 23.7127 21.2357 23.4748 21.235C22.6909 21.2352 21.9267 21.4484 21.2627 21.8452C21.488 22.4887 21.6067 23.1705 21.608 23.8644C21.6059 25.5061 20.9466 27.08 19.7745 28.2408C18.6024 29.4017 17.0133 30.0548 15.3558 30.0568C13.6982 30.0548 12.1091 29.4017 10.9371 28.2408C9.90723 27.2208 9.27319 25.882 9.13306 24.4584L7.90041 24.6809C7.8423 24.6958 7.78284 24.7049 7.7229 24.7082C7.4922 24.7072 7.26916 24.6261 7.09258 24.4791C6.916 24.332 6.79707 24.1283 6.75646 23.9034C6.7331 23.7777 6.73498 23.6487 6.76199 23.5237C6.789 23.3987 6.84061 23.2802 6.91388 23.175C6.98714 23.0697 7.08063 22.9799 7.18899 22.9104C7.29735 22.841 7.41846 22.7934 7.54539 22.7704L9.26997 22.4556C9.5347 21.3417 10.108 20.3124 10.9385 19.4904C12.1104 18.3304 13.6989 17.6778 15.3558 17.6758C17.0126 17.6778 18.6011 18.3304 19.7731 19.4904C19.9735 19.6888 20.159 19.8993 20.3287 20.1201C21.2783 19.5719 22.363 19.278 23.4748 19.2776C23.8136 19.2771 24.1514 19.3042 24.4847 19.3585C24.7865 18.4301 25.308 17.5765 26.0171 16.8741C27.1892 15.7133 28.7783 15.0602 30.4359 15.0581C32.0934 15.0602 33.6825 15.7133 34.8546 16.8741C35.1197 17.1367 35.3586 17.4205 35.5696 17.7214C35.5862 17.7175 35.6029 17.7139 35.6197 17.7108L37.1068 17.4412C37.363 17.3956 37.627 17.4521 37.8413 17.5984C38.0556 17.7448 38.2028 17.9692 38.2507 18.2226C38.298 18.477 38.2415 18.7395 38.0936 18.9526C37.9457 19.1657 37.7185 19.3121 37.4618 19.3595L36.4441 19.544C36.6039 20.0941 36.6874 20.6681 36.6881 21.2506C36.686 22.8923 36.0266 24.4662 34.8546 25.6271C33.6825 26.7879 32.0934 27.441 30.4359 27.4431ZM30.4359 17.0116C29.3011 17.0126 28.213 17.4596 27.4106 18.2543C26.6082 19.049 26.157 20.1267 26.1559 21.2506C26.158 22.3742 26.6096 23.4512 27.4118 24.2458C28.214 25.0403 29.3014 25.4875 30.4359 25.4896C31.5703 25.4875 32.6577 25.0403 33.4599 24.2458C34.2621 23.4512 34.7137 22.3742 34.7158 21.2506C34.7147 20.1267 34.2635 19.049 33.4611 18.2543C32.6587 17.4596 31.5706 17.0126 30.4359 17.0116ZM15.3558 19.6253C14.2213 19.6274 13.1339 20.0747 12.3317 20.8692C11.5295 21.6637 11.0779 22.7407 11.0758 23.8644C11.0779 24.988 11.5295 26.065 12.3317 26.8595C13.1339 27.654 14.2213 28.1013 15.3558 28.1034C16.4902 28.1013 17.5776 27.654 18.3798 26.8595C19.182 26.065 19.6336 24.988 19.6357 23.8644C19.6326 22.7414 19.1805 21.6654 18.3785 20.8717C17.5764 20.078 16.4896 19.6313 15.3558 19.6292V19.6253Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_148_210">
              <rect width="165" height="46" fill="currentColor" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      name: 'Echobind',
      url: 'https://echobind.com/',
      logo: (
        <svg
          className="w-32"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          viewBox="0 0 301 84"
        >
          <defs>
            <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="dyeSf6u7ha">
              <stop stopColor="#fff" offset="0%" />
              <stop stopColor="#f1f1f1" offset="100%" />
            </linearGradient>
            <path
              d="M44.264 83.94h-4.528C17.592 82.764 0 64.436 0 42 0 18.804 18.804 0 42 0a41.997 41.997 0 0129.698 12.302A41.997 41.997 0 0184 42c0 22.436-17.592 40.764-39.736 41.94zM61.75 44.17a9.573 9.573 0 011.16 5.58 9.78 9.78 0 01-9.82 8.69H40.77a.282.282 0 01-.258-.183.281.281 0 01.078-.307 15.002 15.002 0 003.53-4.73.63.63 0 01.56-.38h8.66a4 4 0 004-4.55c-.26-2-1.45-3.49-3.34-3.49h-5.9a.41.41 0 01-.38-.56l2-4.54c.12-.3.42-.5 1.28-.5h7.21a4.12 4.12 0 004.13-3.49 4.001 4.001 0 00-4-4.55h-3.41c-5.63 0-7.87 5.06-10.17 10.84-3.15 7.63-5.92 16.44-16.27 16.44h-2.57A9.8 9.8 0 0116 49.1a9.62 9.62 0 016.22-9.27 9.565 9.565 0 01-1.16-5.58 9.78 9.78 0 019.82-8.69h12.35a.28.28 0 01.18.49 15.002 15.002 0 00-3.53 4.73.63.63 0 01-.56.38h-8.66a4 4 0 00-4 4.55c.26 2 1.45 3.49 3.34 3.49h5.9a.408.408 0 01.38.56l-2 4.54c-.12.3-.42.5-1.28.5h-7.22a4.12 4.12 0 00-4.13 3.49 4.001 4.001 0 004 4.55h3.42c5.63 0 7.87-5.06 10.17-10.84 3.15-7.63 5.92-16.44 16.27-16.44h2.57A9.8 9.8 0 0168 34.9a9.62 9.62 0 01-6.25 9.27zM42 78.4c20.094-.022 36.378-16.306 36.4-36.4C78.4 21.897 62.103 5.6 42 5.6 21.897 5.6 5.6 21.897 5.6 42c0 20.104 16.297 36.4 36.4 36.4z"
              id="dyeSf6u7hb"
            />
          </defs>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path
              d="M106.63 44.22h9.61a.442.442 0 00.46-.46 4.899 4.899 0 00-5.22-5 5 5 0 00-5.31 5 .442.442 0 00.46.46zm4.81 10.21c2.4 0 4.21-1.2 4.76-2.91a.999.999 0 011.06-.79h2.36a.739.739 0 01.79.92c-.55 4-4.16 6.93-9 6.93a9.18 9.18 0 01-9.41-8.77 50.245 50.245 0 010-6.47 9.18 9.18 0 019.47-8.78c5.59 0 9.24 3.47 9.24 9.24V47a.93.93 0 01-.92.92h-13.25a.44.44 0 00-.46.46c-.01 4.2 2.17 6.05 5.36 6.05zm27.86-3.84a.77.77 0 01.88-.79h2.4a.93.93 0 01.92.92c0 4.48-3.74 7.86-8.92 7.86-5.55 0-8.87-3.93-9.24-8.78a50.608 50.608 0 010-6.47c.37-4.85 3.7-8.78 9.24-8.78 5.18 0 8.92 3.37 8.92 7.86a.824.824 0 01-.79.92h-2.5a.792.792 0 01-.88-.74c0-2.17-1.9-3.88-4.76-3.88a4.814 4.814 0 00-5.08 4.62 50.245 50.245 0 000 6.47 4.809 4.809 0 005.08 4.62c2.84.01 4.73-1.651 4.73-3.83m10.44 7.54a.93.93 0 01-.92-.92V26.38a.93.93 0 01.92-.92h2.31a.93.93 0 01.92.92v8.37a1 1 0 001 1c.92 0 2.13-1.16 4.25-1.16a8.78 8.78 0 018.78 8.75V57.2a.93.93 0 01-.92.92h-2.31a.93.93 0 01-.92-.92V43.34a4.8 4.8 0 00-4.94-4.62c-2.87 0-4.95 2-4.95 4.39V57.2a.93.93 0 01-.92.92l-2.3.01m36.1-8.32a50.245 50.245 0 000-6.47 5.37 5.37 0 00-10.63 0 50.608 50.608 0 000 6.47 5.37 5.37 0 0010.63 0zm4.16-6.47a50.245 50.245 0 010 6.47 9.5 9.5 0 01-18.95 0 50.245 50.245 0 010-6.47 9.5 9.5 0 0118.95 0zM196.56 58a.999.999 0 01-1 .69h-1a.869.869 0 01-.74-1.29L207.09 26a.87.87 0 01.88-.69h1a.891.891 0 01.74 1.29L196.56 58m32.36-8.19a50.245 50.245 0 000-6.47 5.37 5.37 0 00-10.63 0 49.887 49.887 0 000 6.47 5.37 5.37 0 0010.63 0zm-10 7.26a1.743 1.743 0 00-1.16.74.879.879 0 01-.65.32h-1.57a.93.93 0 01-.93-.92V26.38a.93.93 0 01.93-.92h2.31a.93.93 0 01.92.92v8.18c0 .88.32 1.16 1 1.16.92 0 2.17-1.16 4.3-1.16 4.85 0 8.41 3.93 8.78 8.78a50.245 50.245 0 010 6.47c-.37 4.85-3.93 8.78-8.78 8.78-3.39 0-3.81-1.52-5.15-1.52zm30.52-27.69a.737.737 0 01-.213.526.733.733 0 01-.527.214h-3.14a.73.73 0 01-.74-.74v-3.19a.759.759 0 01.74-.74h3.14a.76.76 0 01.74.74v3.19zM239 38.95a.93.93 0 01-.92-.92v-2.09A.929.929 0 01239 35h9.38c.51 0 .925.41.93.92v17.82a.443.443 0 00.46.46h5.87a.93.93 0 01.92.92v2.08a.93.93 0 01-.92.92h-17.1a.93.93 0 01-.92-.92v-2.08a.93.93 0 01.92-.92h6.05a.439.439 0 00.46-.46V39.41a.438.438 0 00-.46-.46H239zm31-4.39a8.634 8.634 0 016.254 2.526 8.634 8.634 0 012.526 6.254V57.2a.93.93 0 01-.92.92h-2.31a.93.93 0 01-.92-.92V43.34c0-2.68-2.22-4.62-5.08-4.62s-5.08 1.71-5.08 4.39V57.2a.93.93 0 01-.93.92h-2.34a.93.93 0 01-.92-.92V35.94a.93.93 0 01.92-.92h2c.252.01.488.126.65.32.269.395.688.662 1.16.74 1.37 0 1.74-1.52 4.99-1.52m27.2 15.25a50.245 50.245 0 000-6.47 5.37 5.37 0 00-10.63 0 50.608 50.608 0 000 6.47 5.37 5.37 0 0010.63 0zm-14.56 0a50.608 50.608 0 010-6.47c.37-4.85 3.93-8.78 8.78-8.78 2.13 0 3.37 1.16 4.3 1.16.69 0 1-.28 1-1.16v-8.18a.93.93 0 01.92-.92H300a.93.93 0 01.92.92V57.2a.93.93 0 01-.92.92h-1.6a.882.882 0 01-.65-.32 1.75 1.75 0 00-1.16-.74c-1.34 0-1.76 1.52-5.18 1.52-4.84.01-8.41-3.92-8.77-8.77z"
              fill="#FFF"
            />
            <use fill="url(#dyeSf6u7ha)" xlinkHref="#dyeSf6u7hb" />
          </g>
        </svg>
      ),
    },
    {
      name: 'Envision Imaging',
      url: 'https://www.envrad.com/',
      logo: (
        <svg
          className="w-32"
          viewBox="0 0 422 103"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M376.83 102.96C375.47 102.73 374.1 102.54 372.75 102.26C361.04 99.8302 354.04 89.6502 355.4 77.7202C356.68 66.4402 364.53 58.7602 375.89 57.5902C383.13 56.8502 389.88 58.3702 395.58 63.5102C393.57 65.9302 391.57 68.3502 389.55 70.7802C388.25 69.9202 387.06 68.9902 385.75 68.2802C380.93 65.6402 374.3 65.4202 369.9 69.6302C365.7 73.6402 364.54 78.6102 365.92 84.1002C367.21 89.2502 370.53 92.6102 375.81 93.7102C379.65 94.5102 383.35 93.9102 386.81 92.0102C387.47 91.6502 387.79 91.2102 387.76 90.4102C387.7 88.7402 387.74 87.0602 387.74 85.2402H378.09V76.9202H397.18V78.0602C397.18 83.6502 397.16 89.2302 397.2 94.8202C397.2 95.6302 396.94 96.1302 396.31 96.6202C391.65 100.25 386.42 102.39 380.5 102.79C380.23 102.81 379.98 102.92 379.71 102.99H376.83V102.96Z"
            fill="currentColor"
          />
          <path
            d="M257.13 102.96C255.03 102.56 252.88 102.31 250.83 101.73C242.3 99.2901 236.28 91.8501 235.51 83.0101C234.7 73.7201 237.9 66.2601 245.76 61.0301C250.55 57.8401 255.96 57.1001 261.6 57.5601C266.9 57.9901 271.59 59.8601 275.7 63.5001C273.69 65.9301 271.69 68.3401 269.62 70.8301C268.91 70.3101 268.26 69.8101 267.59 69.3401C263.99 66.7901 259.96 65.7201 255.67 66.7101C250 68.0101 246.91 71.9401 245.76 77.4801C244.61 83.0301 246.95 88.9301 251.42 91.8901C255.75 94.7601 262.97 94.7301 267.23 91.7901C267.52 91.5901 267.84 91.2101 267.85 90.9001C267.91 89.0701 267.88 87.2401 267.88 85.2601H258.21V76.9301H277.27V78.0101C277.27 83.6401 277.25 89.2601 277.29 94.8901C277.29 95.6601 277.05 96.1301 276.46 96.5801C271.8 100.2 266.57 102.36 260.65 102.77C260.43 102.78 260.22 102.9 260.01 102.96H257.13Z"
            fill="currentColor"
          />
          <path
            d="M421.44 45.02C421.44 45.02 421.36 44.99 421.32 45C418.23 45.64 416.49 44.03 414.69 41.69C406.53 31.1 398.18 20.65 389.9 10.15C389.7 9.90002 389.49 9.67002 389.13 9.26002V44.88H384.32V1.09002C385.73 1.09002 387.15 1.04002 388.56 1.13002C388.9 1.15002 389.27 1.59002 389.53 1.91002C398.18 12.88 406.82 23.86 415.47 34.83C415.71 35.14 415.97 35.43 416.42 35.96V1.20002H421.45V45.02H421.44Z"
            fill="currentColor"
          />
          <path
            d="M12.1202 89.0202C3.89023 85.3902 0.350231 78.6102 0.470231 69.6502C0.580231 61.7402 3.32023 54.5902 7.10023 47.8002C12.7102 37.7402 20.3602 29.3702 29.0702 21.9302C35.6102 16.3402 42.5202 11.2802 50.2202 7.35017C50.6002 7.15017 51.0002 6.98017 51.3802 6.80017C51.7802 7.58017 52.1402 8.28017 52.4002 8.80017C48.6302 10.9902 44.6902 12.9702 41.0902 15.4502C31.9802 21.7302 23.5402 28.8102 16.9602 37.8102C10.8702 46.1502 6.81023 55.3902 5.39023 65.6802C4.87023 69.4102 4.77023 73.1502 5.98023 76.8102C6.66023 78.8602 8.07023 80.2102 9.98023 81.2502C10.1302 79.1502 10.1702 77.1302 10.4302 75.1302C11.3702 68.0402 13.9002 61.4602 17.4702 55.3202C28.4002 36.4902 43.6602 22.4002 63.7802 13.8002C70.6402 10.8602 75.0602 10.1502 84.6002 9.83017C84.0902 9.34017 83.7602 8.94017 83.3502 8.65017C78.7402 5.42017 73.5902 4.11017 68.0402 4.69017C64.9602 5.01017 61.9302 5.74017 58.8502 6.29017C58.6402 5.68017 58.3702 4.91017 58.0302 3.95017C59.2502 3.56017 60.5102 3.11017 61.8002 2.76017C67.6402 1.13017 73.5402 0.320169 79.5302 1.91017C84.7502 3.29017 88.7302 6.38017 91.6302 10.9002C91.9302 11.3702 92.3602 11.8602 92.8502 12.1102C99.0302 15.2402 102.14 20.4402 102.89 27.1402C103.82 35.3902 101.48 43.0302 98.0202 50.3602C92.0402 63.0402 83.1502 73.4502 72.4302 82.3502C64.2902 89.1102 55.3602 94.5602 45.2402 97.8502C39.6202 99.6802 33.8602 100.77 27.9102 100.08C21.1702 99.3002 15.7102 96.4902 12.4602 90.2402C12.3102 89.9502 12.2802 89.5902 12.1202 89.0202ZM23.0802 85.1702C23.1002 85.0902 23.1202 85.0202 23.1402 84.9402C24.4102 84.8402 25.6902 84.7902 26.9602 84.6302C33.8502 83.7302 40.0902 81.0402 45.9902 77.5102C55.3802 71.8902 63.5902 64.8202 71.0102 56.8202C77.1102 50.2402 82.2302 43.0202 85.3002 34.5002C87.5902 28.1502 88.4202 21.6702 86.8302 15.0002C86.6402 14.2002 86.2802 13.7302 85.4402 13.6502C83.8902 13.5002 82.3502 13.2002 80.8002 13.1802C72.7602 13.1002 65.4002 15.6602 58.3702 19.2602C47.1902 24.9802 37.7902 32.9402 29.6702 42.4302C23.4702 49.6702 18.4302 57.6202 15.4702 66.7502C13.8402 71.7702 13.0202 76.8902 13.8802 82.1802C14.0302 83.1002 14.4202 83.6102 15.3302 83.7702C17.9102 84.2202 20.4902 84.6902 23.0802 85.1502V85.1702ZM14.1202 90.0002C14.8902 90.1902 15.6502 90.4002 16.4202 90.5702C17.5402 90.8202 18.8002 90.8002 19.7702 91.3302C22.8802 93.0202 26.1902 93.7102 29.6702 93.7302C37.7002 93.7602 45.0702 91.2302 52.0702 87.5902C65.4502 80.6202 76.3902 70.7902 85.2202 58.6402C90.8802 50.8502 95.2202 42.4202 96.5302 32.7302C97.1102 28.4902 96.9302 24.2902 94.9502 20.3502C94.8102 20.0702 94.6102 19.8302 94.4402 19.5702C94.5202 23.5302 94.0402 27.3202 92.9102 31.0102C88.7102 44.7602 80.8202 56.2702 70.7802 66.3302C62.9702 74.1602 53.7302 80.1102 43.7702 84.9002C38.3602 87.5002 32.7302 89.5102 26.7502 90.3902C22.5302 91.0102 18.3302 90.9502 14.1002 90.0102L14.1202 90.0002Z"
            fill="currentColor"
          />
          <path
            d="M145.62 102.05H136.13V58.2402C136.47 58.2202 136.85 58.1902 137.23 58.1902C139.99 58.1902 142.75 58.2202 145.5 58.1702C146.27 58.1602 146.71 58.3902 147.12 59.0602C150.5 64.5602 153.93 70.0302 157.35 75.5202C157.55 75.8502 157.78 76.1602 158.08 76.5802C158.37 76.1702 158.6 75.8602 158.8 75.5402C162.22 70.0602 165.64 64.5802 169.03 59.0902C169.43 58.4402 169.84 58.1602 170.64 58.1702C173.75 58.2202 176.86 58.1902 180.04 58.1902V102.03H170.49V74.1302C170.38 74.0902 170.27 74.0502 170.16 74.0102C166.14 80.0802 162.13 86.1602 157.98 92.4302C153.86 86.2002 149.86 80.1502 145.87 74.1002C145.79 74.1302 145.72 74.1502 145.64 74.1802V102.06L145.62 102.05Z"
            fill="currentColor"
          />
          <path
            d="M317.21 74.8402V102.04H307.72V58.1902C310.58 58.1902 313.4 58.1602 316.23 58.2302C316.56 58.2302 316.93 58.6902 317.18 59.0102C323.5 67.2802 329.81 75.5702 336.13 83.8502C336.35 84.1302 336.58 84.4002 336.99 84.9102V58.2702H346.54V102.11C343.93 102.11 341.31 102.14 338.69 102.07C338.37 102.07 338.02 101.57 337.76 101.24C331.19 92.6502 324.63 84.0502 318.07 75.4602C317.89 75.2202 317.68 75.0002 317.48 74.7602C317.39 74.7902 317.29 74.8102 317.2 74.8402H317.21Z"
            fill="currentColor"
          />
          <path
            d="M186.77 102.12C187.94 99.37 189.02 96.82 190.1 94.26C195.1 82.54 200.11 70.82 205.07 59.08C205.46 58.17 205.91 57.84 206.9 57.87C209.18 57.95 211.46 57.87 213.73 57.93C214.13 57.94 214.72 58.28 214.87 58.62C221.03 72.97 227.14 87.33 233.26 101.69C233.29 101.76 233.28 101.84 233.32 102.11C232.32 102.11 231.34 102.11 230.36 102.11C228.32 102.11 226.28 102.07 224.25 102.13C223.48 102.15 223.12 101.87 222.85 101.18C221.78 98.48 220.65 95.8 219.58 93.09C219.32 92.44 219 92.19 218.28 92.19C212.77 92.22 207.25 92.22 201.74 92.19C200.98 92.19 200.61 92.43 200.33 93.13C199.29 95.8 198.17 98.44 197.12 101.11C196.83 101.84 196.47 102.14 195.64 102.13C192.77 102.07 189.89 102.11 186.76 102.11L186.77 102.12ZM215.73 83.6C213.81 78.93 211.95 74.38 209.99 69.6C208.03 74.37 206.17 78.93 204.26 83.6H215.74H215.73Z"
            fill="currentColor"
          />
          <path
            d="M157.55 1.08006C159.01 1.08006 160.33 1.01006 161.64 1.12006C162.06 1.15006 162.56 1.55006 162.84 1.91006C171.5 12.8701 180.14 23.8501 188.78 34.8301C189.02 35.1401 189.28 35.4401 189.77 36.0401V1.16006H194.65V44.9701C193.41 44.9701 192.22 45.0201 191.04 44.9401C190.72 44.9201 190.37 44.5601 190.14 44.2701C182.96 35.1901 175.79 26.1001 168.63 17.0101C166.63 14.4801 164.63 11.9401 162.45 9.19006V44.8801H157.54V1.08006H157.55Z"
            fill="currentColor"
          />
          <path
            d="M350.85 0.280121C363.81 0.120121 372.87 9.37012 373.66 21.1101C374.56 34.4001 365.39 45.0101 352.67 45.6901C339.83 46.3801 329.58 37.2701 328.9 24.5101C328.23 11.9201 337 0.730121 350.85 0.280121ZM368.55 23.2601C368.66 23.2301 368.77 23.2101 368.88 23.1801C368.32 20.7501 368.04 18.2101 367.15 15.9101C362.61 4.14012 347.61 1.11012 338.95 10.2201C334.67 14.7201 333.48 20.2601 334.37 26.3001C335.89 36.6801 346.12 43.3001 356.18 40.4401C363.53 38.3501 368.42 31.5501 368.55 23.2601Z"
            fill="currentColor"
          />
          <path
            d="M115.49 1.15015H147.2V5.60015H120.52V20.4901H144.36V25.1001H120.54V40.3701H147.48V44.8701H115.49V1.15015Z"
            fill="currentColor"
          />
          <path
            d="M301.21 5.86008C300.21 7.19008 299.27 8.43008 298.44 9.53008C296.45 8.41008 294.66 7.17008 292.69 6.36008C288.58 4.68008 284.33 4.17008 280.15 6.19008C277.74 7.35008 276.37 9.29008 276.29 12.0501C276.21 14.9001 277.54 16.9901 280.1 17.9801C283.06 19.1301 286.17 19.8701 289.2 20.8401C291.55 21.5901 293.95 22.2501 296.18 23.2801C300.05 25.0701 302.37 28.0801 302.5 32.5101C302.64 37.1201 300.84 40.7201 296.9 43.1801C293.92 45.0401 290.6 45.6301 287.16 45.6101C280.71 45.5701 275.06 43.3601 270.18 39.1701C269.97 38.9901 269.74 38.8401 269.44 38.6201C270.55 37.3001 271.54 36.1201 272.53 34.9501C274.03 36.0401 275.42 37.1801 276.93 38.1201C281.33 40.8501 286.12 41.7601 291.18 40.6401C295.8 39.6201 298.23 35.8701 297.24 31.7401C296.79 29.8901 295.65 28.5101 293.97 27.8601C291.27 26.8101 288.46 26.0401 285.7 25.1601C283.12 24.3401 280.46 23.7101 277.98 22.6701C274.1 21.0501 271.64 18.1701 271.32 13.8001C270.98 9.24008 272.63 5.61008 276.45 3.04008C279.74 0.830081 283.45 0.29008 287.32 0.470081C292.52 0.700081 297.12 2.47008 301.22 5.86008H301.21Z"
            fill="currentColor"
          />
          <path
            d="M203.32 1.08005C205.13 1.08005 206.76 1.03005 208.38 1.12005C208.7 1.14005 209.1 1.65005 209.26 2.02005C211.65 7.71005 214 13.42 216.36 19.12C218.93 25.34 221.5 31.56 224.07 37.78C224.16 38 224.27 38.21 224.48 38.64C224.72 38.1 224.9 37.73 225.06 37.36C229.92 25.67 234.79 13.98 239.61 2.27005C239.99 1.35005 240.44 0.980046 241.44 1.05005C242.74 1.14005 244.04 1.07005 245.54 1.07005C244.76 2.92005 244.08 4.56005 243.38 6.19005C237.98 18.82 232.56 31.45 227.19 44.1C226.8 45.02 226.31 45.2 225.37 45.34C222.91 45.7 221.84 44.69 220.9 42.42C215.3 28.96 209.5 15.59 203.77 2.19005C203.65 1.90005 203.54 1.60005 203.33 1.07005L203.32 1.08005Z"
            fill="currentColor"
          />
          <path
            d="M125.09 102.05H115.48V58.28H125.09V102.05Z"
            fill="currentColor"
          />
          <path
            d="M296.61 58.25V102.03H287V58.25H296.61Z"
            fill="currentColor"
          />
          <path
            d="M259.5 44.9102H254.61V1.16016H259.5V44.9102Z"
            fill="currentColor"
          />
          <path
            d="M313.08 1.16016H317.97V44.8702H313.08V1.16016Z"
            fill="currentColor"
          />
          <path
            d="M57.2802 6.33001C57.3202 7.47001 56.3702 8.46001 55.2002 8.49001C54.0202 8.52001 53.0402 7.61001 53.0202 6.45001C52.9902 5.29001 53.9202 4.32001 55.0902 4.29001C56.2502 4.26001 57.2502 5.19001 57.2902 6.33001H57.2802Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: 'appwrite',
      url: 'https://apwr.dev/epicweb',
      logo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-32 py-4"
          fill="none"
          viewBox="0 0 200 37"
        >
          <path
            fill="currentColor"
            d="M58.419 29.39c3.27 0 4.924-1.678 5.643-2.821h.324c.144 1.214 1.006 2.357 2.696 2.357h3.199v-3.571h-.827c-.575 0-.862-.322-.862-.821v-14.32H64.35V12.5h-.324c-.826-1.142-2.552-2.75-5.715-2.75-5.033 0-8.771 4.143-8.771 9.82 0 5.678 3.81 9.82 8.879 9.82m.755-4.07c-2.984 0-5.32-2.179-5.32-5.714 0-3.464 2.264-5.82 5.284-5.82 2.875 0 5.284 2.106 5.284 5.82 0 3.178-2.05 5.713-5.248 5.713M72.785 36.18h4.242v-9.61h.323c.791 1.143 2.48 2.82 5.824 2.82 5.032 0 8.699-4.213 8.699-9.819 0-5.642-3.918-9.82-8.987-9.82-3.235 0-4.817 1.75-5.571 2.714h-.324v-2.25h-4.206v25.967m9.49-10.754c-2.912 0-5.32-2.142-5.32-5.856 0-3.178 2.049-5.856 5.248-5.856 2.984 0 5.32 2.321 5.32 5.856 0 3.464-2.264 5.856-5.248 5.856M94.062 36.18h4.241v-9.61h.324c.79 1.143 2.48 2.82 5.823 2.82 5.033 0 8.35-4.213 8.35-9.819 0-5.642-3.569-9.82-8.637-9.82-3.236 0-4.817 1.75-5.572 2.714h-.324v-2.25h-4.205v25.967m9.489-10.754c-2.911 0-5.32-2.142-5.32-5.856 0-3.178 2.049-5.856 5.249-5.856 2.983 0 5.32 2.321 5.32 5.856 0 3.464-2.265 5.856-5.249 5.856m14.856 3.932h6.003l3.415-14.676h.215l3.415 14.676h5.967l4.779-18.71h-4.275l-3.415 14.71h-.324l-3.415-14.71h-5.643l-3.451 14.71h-.324l-3.379-14.71h-4.529zm25.943 0h4.241v-9.248c0-3.535 1.654-5.713 4.745-5.713h1.869v-4.214h-1.402c-2.408 0-4.241 1.643-4.96 3.214h-.288v-2.75h-4.205zm31.905 0h3.307v-3.75h-3.271c-1.294 0-1.834-.57-1.834-1.892v-9.355h5.32v-3.714h-5.32V5.4h-4.026v5.25h-3.522v3.713h3.271v9.391c0 3.964 2.408 5.606 6.075 5.606m14.686.03c3.919 0 7.369-1.928 8.592-5.82l-3.883-.929c-.683 2.071-2.66 3.142-4.744 3.142-3.092 0-5.141-2-5.177-5.142H200v-1.178c0-5.57-3.487-9.712-9.238-9.712-5.069 0-9.418 3.963-9.418 9.855 0 5.713 3.846 9.784 9.597 9.784m-5.176-11.82c.252-2.249 2.301-4.141 4.997-4.141 2.588 0 4.709 1.606 4.924 4.142h-9.921"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M165.023 29.36h-4.242V14.363h-3.307v-3.714h7.549V29.36"
            clipRule="evenodd"
          />
          <path
            fill="currentColor"
            d="M162.586 8.053c1.546 0 2.696-1.143 2.696-2.643 0-1.464-1.15-2.606-2.696-2.606-1.545 0-2.696 1.142-2.696 2.606 0 1.5 1.151 2.643 2.696 2.643"
          />
          <path
            fill="currentColor"
            d="M37.035 24.772v8.258H16.29c-6.044 0-11.32-3.322-14.144-8.258A16.573 16.573 0 0 1 0 17.631v-2.232a16.469 16.469 0 0 1 .577-3.388C2.515 5.079 8.817 0 16.291 0s13.775 5.079 15.712 12.01h-8.87c-1.456-2.259-3.976-3.753-6.842-3.753-2.867 0-5.387 1.494-6.843 3.754a8.226 8.226 0 0 0-1.014 2.252 8.346 8.346 0 0 0-.307 2.252c0 2.367.984 4.5 2.562 6.005a8.081 8.081 0 0 0 5.602 2.252h20.744"
          />
          <path
            fill="currentColor"
            d="M37.035 14.263v8.257H21.893a8.273 8.273 0 0 0 2.562-6.005c0-.781-.107-1.536-.307-2.252h12.887"
          />
        </svg>
      ),
    },
    {
      name: 'deepgram.com',
      url: 'https://deepgram.com',
      logo: (
        <svg
          className="w-32"
          viewBox="0 0 189 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.6423 4.21755C24.3228 6.93824 25.7643 10.5344 25.7077 14.3425V14.3378C25.5901 22.0056 19.1407 28.2424 11.3346 28.2424H0.367457C0.160174 28.2424 0.0565318 27.9931 0.202572 27.8424L5.54011 22.481C5.62961 22.3915 5.7474 22.3398 5.8746 22.3398H11.4383C15.9137 22.3398 19.6636 18.7624 19.7956 14.3707C19.8615 12.1302 19.0371 10.012 17.4731 8.40215C15.9089 6.79233 13.8126 5.90738 11.5749 5.90738H5.91228V15.0485C5.91228 15.1286 5.85103 15.1897 5.77095 15.1897H0.141329C0.0612427 15.1897 0 15.1286 0 15.0485V0.141201C0 0.0611871 0.0612427 0 0.141329 0H11.5749C15.3861 0 18.9617 1.49685 21.6423 4.21755ZM37.7161 7.57425C30.8192 7.57425 27.6723 12.8556 27.6723 18.0146L27.6676 18.0193C27.6676 23.1405 31.2197 28.5396 38.1166 28.5396C43.0537 28.5396 46.8884 25.7907 47.7646 21.4978C47.7835 21.4084 47.7129 21.3236 47.6232 21.3236H42.4177C42.3564 21.3236 42.3045 21.366 42.2858 21.4272C41.8099 23.0934 40.3307 23.9455 38.1166 23.9455C35.2946 23.9455 33.481 22.1709 33.0758 19.3089H47.548C47.6232 19.3089 47.6845 19.2572 47.6893 19.1819C47.7269 18.7488 47.7599 18.1887 47.7599 17.492C47.7599 12.8556 44.613 7.57425 37.7161 7.57425ZM37.7161 11.6835C40.4203 11.6835 41.9936 13.4957 42.1538 15.7552H33.1559C33.6412 12.9309 35.177 11.6835 37.7161 11.6835ZM50.2187 18.0146C50.2187 12.8556 53.3656 7.57425 60.2625 7.57425C67.1594 7.57425 70.3063 12.8556 70.3063 17.492C70.3063 18.1887 70.2733 18.7488 70.2357 19.1819C70.2309 19.2572 70.1696 19.3089 70.0943 19.3089H55.6221C56.0273 22.1709 57.841 23.9455 60.663 23.9455C62.877 23.9455 64.3563 23.0934 64.8322 21.4272C64.8509 21.366 64.9028 21.3236 64.964 21.3236H70.1696C70.2592 21.3236 70.3298 21.4084 70.311 21.4978C69.4348 25.7907 65.6 28.5396 60.663 28.5396C53.7661 28.5396 50.214 23.1405 50.214 18.0193L50.2187 18.0146ZM64.7002 15.7552C64.54 13.4957 62.9666 11.6835 60.2625 11.6835C57.7232 11.6835 56.1875 12.9309 55.7022 15.7552H64.7002ZM78.8953 7.89904H73.5717V7.88962C73.4918 7.88962 73.4305 7.95082 73.4305 8.03085V36.2874C73.4305 36.3675 73.4918 36.4287 73.5717 36.4287H78.8953C78.9752 36.4287 79.0365 36.3675 79.0365 36.2874V26.3932C80.1247 27.763 82.1034 28.5301 84.4024 28.5301C90.2535 28.5301 94.2059 24.3786 94.2059 18.0522C94.2059 11.7259 90.5737 7.57425 84.8451 7.57425C82.2212 7.57425 80.2472 8.54391 79.0365 10.1161V8.04024C79.0365 7.96023 78.9752 7.89904 78.8953 7.89904ZM88.6375 18.057C88.6375 21.4413 86.6637 23.7008 83.6768 23.7008C80.6948 23.7008 78.7162 21.479 78.7162 18.057C78.7162 14.6348 80.6948 12.3755 83.6768 12.3755C86.659 12.3755 88.6375 14.6725 88.6375 18.057ZM102.402 32.1779C102.492 32.0885 102.61 32.0414 102.737 32.0414H108.456C110.19 32.0414 111.4 30.6716 111.4 28.817V26.1576C110.35 27.6497 108.211 28.5346 105.832 28.5346C99.8208 28.5346 96.2311 24.3829 96.2311 18.0567C96.2311 11.7304 99.8208 7.57872 105.752 7.57872C108.253 7.57872 110.227 8.50602 111.4 9.91814V8.04472C111.4 7.9647 111.462 7.9035 111.542 7.9035H116.865C116.945 7.9035 117.006 7.9647 117.006 8.04472V29.429C117.006 33.623 113.982 36.4425 109.384 36.4425H98.7232C98.5112 36.4425 98.4076 36.1884 98.5583 36.0424L102.402 32.1873V32.1779ZM106.722 23.6958C109.789 23.6958 111.725 21.4787 111.725 18.052C111.725 14.6252 109.789 12.3705 106.722 12.3705C103.656 12.3705 101.762 14.6299 101.762 18.052C101.762 21.474 103.74 23.6958 106.722 23.6958ZM126.744 28.0681V18.3338H126.749C126.749 14.8648 127.998 12.5677 130.782 12.5677H133.99C134.07 12.5677 134.131 12.5064 134.131 12.4265V8.03476C134.131 7.95474 134.07 7.89353 133.99 7.89353H131.87C129.369 7.89353 127.833 8.7361 126.744 11.2779V8.03476C126.744 7.95474 126.683 7.89353 126.603 7.89353H121.28C121.2 7.89353 121.138 7.95474 121.138 8.03476V28.0681C121.138 28.1482 121.2 28.2093 121.28 28.2093H126.603C126.683 28.2093 126.744 28.1482 126.744 28.0681ZM135.926 22.4481C135.926 18.4565 138.913 16.037 143.388 16.037H146.776C147.784 16.037 148.306 15.3923 148.306 14.5449C148.306 12.8504 147.015 11.6831 144.717 11.6831C142.418 11.6831 141.033 13.1375 140.929 14.7756C140.929 14.8509 140.868 14.9074 140.793 14.9074H136.077C135.992 14.9074 135.926 14.8368 135.931 14.7521C136.209 10.751 139.502 7.56905 144.999 7.56905C150.162 7.56905 153.913 10.5533 153.913 15.1475V28.0637C153.913 28.1438 153.852 28.2049 153.771 28.2049H148.448C148.368 28.2049 148.306 28.1438 148.306 28.0637V25.3854C147.619 27.2776 145.362 28.5297 142.578 28.5297C138.663 28.5297 135.921 25.9078 135.921 22.4434L135.926 22.4481ZM144.034 24.4628C146.738 24.4628 148.311 22.4481 148.311 19.8686V19.5862H144.236C142.503 19.5862 141.33 20.6359 141.33 22.2081C141.33 23.5401 142.46 24.4674 144.034 24.4674V24.4628ZM162.797 7.89904H157.474L157.483 7.89434C157.404 7.89434 157.342 7.95554 157.342 8.03555V28.0689C157.342 28.1489 157.404 28.2101 157.483 28.2101H162.806C162.887 28.2101 162.948 28.1489 162.948 28.0689V16.6824C162.948 14.0607 164.436 12.3284 166.778 12.3284C168.954 12.3284 170.368 14.0607 170.368 16.6824V28.0689C170.368 28.1489 170.429 28.2101 170.509 28.2101H175.833C175.912 28.2101 175.973 28.1489 175.973 28.0689V16.6824C175.973 14.0607 177.463 12.3284 179.804 12.3284C181.981 12.3284 183.393 14.0607 183.393 16.6824V28.0689C183.393 28.1489 183.454 28.2101 183.535 28.2101H188.858C188.939 28.2101 189 28.1489 189 28.0689V14.9079C189 10.841 186.135 7.57425 181.74 7.57425C178.476 7.57425 175.931 9.30646 174.924 11.2834C173.953 8.86399 171.894 7.57425 168.71 7.57425C165.964 7.57425 164.027 8.90635 162.939 10.7609V8.04024C162.939 7.96023 162.878 7.89904 162.797 7.89904Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ],
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

                    const AccordionTriggerComp = session.description
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
                                <div className="flex w-full flex-col items-start text-left">
                                  <h4 className="font-semibold leading-tight sm:text-lg print:text-black">
                                    {session.title}
                                  </h4>
                                  {hasMultipleSpeakers ? (
                                    <div className="flex w-full items-center gap-2">
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

const HotelSection = () => {
  return (
    <section className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between gap-8 px-5 pb-0 sm:pb-24 md:flex-row lg:gap-14">
      <div>
        <Link
          href="https://www.marriott.com/en-us/hotels/slcsc-sheraton-park-city/overview/"
          target="_blank"
          onClick={() => {
            track('clicked platinum sponsor', {
              title: 'conf2024',
              type: 'venue',
              location: 'map',
            })
          }}
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center justify-center before:absolute before:-bottom-1.5 before:h-3 before:w-3 before:rotate-45 before:border-b before:border-r before:border-[#E79C33] before:bg-[#FFB753] before:content-[''] md:before:-right-1.5 md:before:top-10 md:before:border-b-0 md:before:border-r md:before:border-t md:before:border-[#313646] md:before:bg-[#1E212C]"
        >
          <div className="flex items-center justify-center rounded-t border border-[#313646] bg-[#1E212C]">
            <div className="flex items-center justify-center overflow-hidden rounded-tl">
              <Image
                src={require('../../../public/assets/conf/sheraton-park-city-hotel@2x.jpg')}
                alt="Sheraton Park City Hotel"
                width={152}
                height={152}
                loading="eager"
                className="transition duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="px-4 py-2 pr-5 sm:px-5 sm:py-5 sm:pr-7">
              <h3 className="text-lg font-semibold leading-tight sm:text-xl sm:leading-tight">
                Sheraton Park City Hotel
              </h3>
              <div className="mt-3 inline-flex text-sm">
                1895 Sidewinder DR
                <br />
                Park City, UT 84060
              </div>
            </div>
          </div>
          <div className="inline-flex w-full items-center gap-3 rounded-b border border-[#E79C33] bg-[#FFB753] px-3 py-2 text-sm font-semibold text-black">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.29 0.715874C12.6812 0.321464 13.3188 0.321464 13.71 0.715875L15.8192 2.84247C16.0466 3.07181 16.3709 3.17715 16.6897 3.12531L19.646 2.6446C20.1943 2.55545 20.7102 2.93025 20.7948 3.47927L21.2512 6.43946C21.3004 6.75869 21.5008 7.03449 21.7892 7.17995L24.4635 8.52874C24.9595 8.77889 25.1565 9.38534 24.9023 9.87926L23.5316 12.5423C23.3837 12.8295 23.3837 13.1705 23.5316 13.4577L24.9023 16.1207C25.1565 16.6147 24.9595 17.2211 24.4635 17.4713L21.7892 18.82C21.5008 18.9655 21.3004 19.2413 21.2512 19.5605L20.7948 22.5207C20.7102 23.0697 20.1943 23.4446 19.646 23.3554L16.6897 22.8747C16.3709 22.8228 16.0466 22.9282 15.8192 23.1575L13.71 25.2841C13.3188 25.6785 12.6812 25.6785 12.29 25.2841L10.1808 23.1575C9.95336 22.9282 9.62914 22.8228 9.31032 22.8747L6.35398 23.3554C5.80568 23.4446 5.2898 23.0697 5.20516 22.5207L4.74879 19.5605C4.69957 19.2413 4.49919 18.9655 4.21079 18.82L1.53651 17.4713C1.04052 17.2211 0.843472 16.6147 1.0977 16.1207L2.46844 13.4577C2.61626 13.1705 2.61626 12.8295 2.46844 12.5423L1.0977 9.87926C0.843472 9.38534 1.04052 8.77889 1.53651 8.52874L4.21079 7.17995C4.49919 7.03449 4.69957 6.75869 4.74879 6.43946L5.20516 3.47927C5.2898 2.93025 5.80568 2.55545 6.35398 2.6446L9.31032 3.12531C9.62914 3.17715 9.95336 3.07181 10.1808 2.84247L12.29 0.715874Z"
                fill="#1E212C"
              />
              <path
                d="M9.98805 13.2138C9.55783 13.2138 9.16794 13.1197 8.81839 12.9314C8.46883 12.7343 8.19098 12.4564 7.98483 12.0979C7.77868 11.7394 7.67561 11.3136 7.67561 10.8207C7.67561 10.3277 7.77868 9.90196 7.98483 9.54344C8.19098 9.18493 8.46883 8.91155 8.81839 8.72333C9.16794 8.52615 9.56231 8.42756 10.0015 8.42756C10.4317 8.42756 10.8171 8.52615 11.1577 8.72333C11.5073 8.91155 11.7851 9.18493 11.9913 9.54344C12.1974 9.90196 12.3005 10.3277 12.3005 10.8207C12.3005 11.3136 12.1974 11.7394 11.9913 12.0979C11.7851 12.4564 11.5073 12.7343 11.1577 12.9314C10.8082 13.1197 10.4183 13.2138 9.98805 13.2138ZM9.47716 18L14.7877 8.58889H16.4683L11.1577 18H9.47716ZM9.98805 12.0172C10.248 12.0172 10.4721 11.9186 10.6603 11.7214C10.8485 11.5153 10.9426 11.215 10.9426 10.8207C10.9426 10.4263 10.8485 10.126 10.6603 9.91989C10.481 9.71374 10.2569 9.61067 9.98805 9.61067C9.71916 9.61067 9.49061 9.71374 9.30239 9.91989C9.12313 10.126 9.0335 10.4263 9.0335 10.8207C9.0335 11.215 9.12313 11.5153 9.30239 11.7214C9.49061 11.9186 9.71916 12.0172 9.98805 12.0172ZM16.0112 18.1613C15.5809 18.1613 15.1911 18.0672 14.8415 17.879C14.4919 17.6818 14.2141 17.404 14.0079 17.0454C13.8018 16.6869 13.6987 16.2612 13.6987 15.7682C13.6987 15.2753 13.8018 14.854 14.0079 14.5044C14.2141 14.1459 14.4919 13.8726 14.8415 13.6843C15.1911 13.4871 15.5854 13.3886 16.0246 13.3886C16.4548 13.3886 16.8402 13.4871 17.1808 13.6843C17.5304 13.8726 17.8082 14.1459 18.0144 14.5044C18.2205 14.854 18.3236 15.2753 18.3236 15.7682C18.3236 16.2612 18.2205 16.6869 18.0144 17.0454C17.8082 17.404 17.5304 17.6818 17.1808 17.879C16.8402 18.0672 16.4504 18.1613 16.0112 18.1613ZM16.0112 16.9648C16.2801 16.9648 16.5041 16.8662 16.6834 16.669C16.8716 16.4629 16.9657 16.1626 16.9657 15.7682C16.9657 15.3739 16.8716 15.0736 16.6834 14.8674C16.5041 14.6613 16.2801 14.5582 16.0112 14.5582C15.7423 14.5582 15.5137 14.6613 15.3255 14.8674C15.1462 15.0736 15.0566 15.3739 15.0566 15.7682C15.0566 16.1626 15.1462 16.4629 15.3255 16.669C15.5137 16.8662 15.7423 16.9648 16.0112 16.9648Z"
                fill="#D1D7EA"
              />
            </svg>
            <span>
              Enter the promo code “{HOTEL_PROMO_CODE}” for a discounted rate.
            </span>
          </div>
        </Link>
      </div>
      <div className="w-full max-w-md text-center md:text-left lg:max-w-lg">
        <h3 className="text-2xl font-semibold sm:text-3xl">
          Looking for a place to stay?
        </h3>
        <p className="mt-3 text-[#D6DEFF] sm:text-lg">
          We’ve partnered with Sheraton Park City Hotel to offer you a
          discounted rate on available rooms. Enter the promo code “W14” for a
          discount.{' '}
          <Dialog>
            <DialogTrigger
              className="underline"
              onClick={() => {
                track('clicked hotel promo code instructions')
              }}
            >
              Instructions
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">Instructions</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <ul className="flex list-inside list-decimal flex-col space-y-2 text-white/90">
                  <li>
                    Go to{' '}
                    <Link
                      href="https://www.marriott.com/en-us/hotels/slcsc-sheraton-park-city/overview/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Sheraton Park City Hotel website
                    </Link>
                  </li>
                  <li>
                    Use the drop-down menu on the right called Special Rates and
                    choose Corp/Promo Code.
                  </li>
                  <li>Enter the Promo Code "W14" and press Done</li>
                  <li>
                    Select the dates for your stay and press "View Rates" to see
                    the available rooms at their discounted rate
                  </li>
                </ul>
                <Link
                  href={`${process.env.NEXT_PUBLIC_URL}/assets/conf/hotel-promo-code.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="mt-3 rounded"
                    src={require('../../../public/assets/conf/hotel-promo-code.jpg')}
                    alt="Hotel promo code instructions"
                    width={978 / 2}
                    height={864 / 2}
                  />
                </Link>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </p>
      </div>
    </section>
  )
}

export const BuyTicketsCTA = () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 pb-16">
      <div className="relative z-10 mx-auto flex h-[240px] w-full max-w-screen-lg flex-col items-center justify-center sm:h-[320px]">
        {CONF_24_TITO_URL && (
          <>
            <h2 className="pb-10 text-center text-2xl font-semibold sm:text-3xl">
              <Balancer>See you at the Epic Web Conf!</Balancer>
            </h2>
            <Button
              asChild
              className="h-12 rounded-sm bg-gradient-to-tr from-gray-50 to-gray-100 font-mono text-sm font-bold uppercase tracking-wide text-gray-950 shadow-soft-2xl transition hover:brightness-110 sm:text-base"
              size="lg"
            >
              <Link
                href={CONF_24_TITO_URL}
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => {
                  track('clicked buy tickets', {
                    title: 'conf2024',
                    type: 'event',
                    location: 'bottom',
                  })
                }}
              >
                Buy Tickets <ChevronRightIcon className="-mr-2 ml-2 w-4" />
              </Link>
            </Button>
          </>
        )}
      </div>
      <Image
        loading="eager"
        src={require('../../../public/assets/conf/big-planet-bottom@2x.png')}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 sm:bottom-auto"
        quality={100}
      />
      <Image
        loading="eager"
        width={153}
        height={102}
        src={require('../../../public/assets/conf/ship2@2x.png')}
        alt=""
        aria-hidden="true"
        className="absolute bottom-24 translate-x-96"
        quality={100}
      />
      <Image
        loading="eager"
        width={255}
        height={170}
        src={require('../../../public/assets/conf/ship3@2x.png')}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 -translate-x-96"
        quality={100}
      />
      <div
        className="absolute bottom-0 left-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-20"
        aria-hidden="true"
      />
    </section>
  )
}

const Talks: React.FC<{talks: Talk[] | null}> = ({talks}) => {
  if (!talks) {
    return null
  }

  return (
    <div className="relative z-0 pb-16">
      {/* <BgGraphic className="pointer-events-none absolute left-0 top-0 z-0 select-none" /> */}
      <div className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col border-b border-white/10 px-5 pb-16">
        <div className="mb-5 flex w-full items-center justify-between">
          <h3 className="text-2xl font-semibold">Talks</h3>
          <Link
            href="/talks"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm font-semibold underline"
          >
            <ChevronRightIcon className="w-5" />
            <span className="sr-only">View All Talks</span>
          </Link>
        </div>
        <ul className="relative flex flex-row gap-3 overflow-x-hidden pr-24 after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-80 after:bg-gradient-to-r after:from-transparent after:to-gray-950 after:content-['']">
          {talks.map((talk, index) => {
            const isLast = index === talks.length - 1
            const thumbnail = `https://image.mux.com/${talk?.muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve&time=0`
            return (
              <li
                key={talk._id}
                className={cn('w-full min-w-[250px]', {
                  '': isLast,
                })}
              >
                <Link
                  href={`/conf/talks/${talk.slug}`}
                  className="flex flex-col"
                >
                  <Image
                    src={thumbnail}
                    width={720 / 2}
                    height={405 / 2}
                    alt={talk.title}
                    aria-hidden="true"
                    className="rounded"
                  />
                  <h4 className="mt-2 text-lg font-semibold">{talk.title}</h4>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export const ConfLogo = () => {
  return (
    <svg
      className="w-40"
      viewBox="0 0 167 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.8026 21.207C22.0236 21.6376 21.1286 22.0975 20.1266 22.5582C16.1459 24.3886 10.4577 26.2417 3.64094 26.3178L2.85578 26.3266L2.71334 25.5544C2.50262 24.4121 2.3795 23.2304 2.3795 22.0106C2.3795 11.1912 11.1806 2.39011 22 2.39011C24.9855 2.39011 27.8193 3.06088 30.3567 4.26001L32.9629 2.9314C29.734 1.06728 25.9905 0 22 0C9.87613 0 0 9.87613 0 22C0 26.8398 1.57384 31.3214 4.23623 34.9595C8.79508 34.1832 11.6552 32.3567 11.6552 32.3567C11.6552 32.3567 9.82899 35.213 9.05254 39.7726C12.6885 42.4296 17.1656 44 22 44C34.1239 44 44 34.1239 44 22C44 18.0164 42.9357 14.277 41.0756 11.05L39.7492 13.651C40.9492 16.1891 41.6205 19.0239 41.6205 22.0106C41.6205 32.83 32.8194 41.6311 22 41.6311C20.7795 41.6311 19.6087 41.5078 18.4577 41.2976L17.684 41.1562L17.6928 40.3697C17.7689 33.5477 19.622 27.8594 21.4525 23.8799C21.9128 22.8791 22.3723 21.9851 22.8026 21.207Z"
        fill="url(#paint0_linear_198_101)"
      />
      <path
        d="M33.4621 17.069L28.4145 15.5956L26.9408 10.5375L43.6857 0.31427L33.4621 17.069Z"
        fill="currentColor"
      />
      <path
        d="M60.6587 16.525V21.25H68.4087V24H57.7837V6.5H68.2837V9.25H60.6587V13.8H67.6587V16.525H60.6587ZM72.0405 6.5H78.4905C80.1405 6.5 81.5155 7.05 82.6155 8.15C83.7405 9.25 84.2905 10.625 84.2905 12.25C84.2905 13.875 83.7405 15.225 82.6155 16.35C81.5155 17.45 80.1405 18 78.4905 18H74.9155V24H72.0405V6.5ZM74.9155 15.3H78.4905C80.1905 15.3 81.4155 14.025 81.4155 12.25C81.4155 10.475 80.1905 9.2 78.4905 9.2H74.9155V15.3ZM87.5366 24V6.5H90.4116V24H87.5366ZM102.684 24.325C100.059 24.325 97.8587 23.45 96.1337 21.725C94.4087 19.975 93.5337 17.825 93.5337 15.25C93.5337 12.675 94.4087 10.525 96.1337 8.8C97.8587 7.05 100.059 6.175 102.684 6.175C105.859 6.175 108.709 7.775 110.209 10.35L107.709 11.8C106.784 10.075 104.884 8.975 102.684 8.975C100.809 8.975 99.3087 9.575 98.1337 10.75C96.9837 11.925 96.4087 13.425 96.4087 15.25C96.4087 17.075 96.9837 18.575 98.1337 19.75C99.3087 20.925 100.809 21.525 102.684 21.525C104.884 21.525 106.809 20.425 107.709 18.7L110.209 20.125C109.484 21.4 108.434 22.425 107.084 23.2C105.759 23.95 104.284 24.325 102.684 24.325ZM120.25 24H116.925L111.975 6.5H115L118.675 20.175L122.65 6.5H125.3L129.25 20.175L132.925 6.5H135.95L131 24H127.675L123.975 11.225L120.25 24ZM142.076 16.525V21.25H149.826V24H139.201V6.5H149.701V9.25H142.076V13.8H149.076V16.525H142.076ZM163.758 14.925C165.283 15.725 166.208 17.175 166.208 19C166.208 20.425 165.708 21.625 164.683 22.575C163.658 23.525 162.433 24 160.958 24H153.458V6.5H160.408C161.833 6.5 163.058 6.975 164.033 7.9C165.033 8.825 165.533 9.975 165.533 11.35C165.533 12.875 164.933 14.05 163.758 14.925ZM160.408 9.2H156.333V13.8H160.408C161.683 13.8 162.658 12.8 162.658 11.5C162.658 10.2 161.683 9.2 160.408 9.2ZM156.333 21.3H160.958C162.283 21.3 163.333 20.225 163.333 18.85C163.333 17.475 162.283 16.4 160.958 16.4H156.333V21.3Z"
        fill="currentColor"
      />
      <path
        d="M63.3612 41.9404C61.507 41.9404 59.9706 41.3223 58.7522 40.0862C57.5337 38.8501 56.9333 37.3314 56.9333 35.5125C56.9333 33.6936 57.5337 32.1573 58.7522 30.9388C59.9706 29.7027 61.507 29.0846 63.3612 29.0846C65.6039 29.0846 67.617 30.2148 68.6766 31.9983L66.5751 33.2168C65.9571 32.1043 64.7739 31.4509 63.3612 31.4509C62.1604 31.4509 61.1891 31.8217 60.4474 32.5811C59.7234 33.3404 59.3526 34.3117 59.3526 35.5125C59.3526 36.6957 59.7234 37.6669 60.4474 38.4262C61.1891 39.1856 62.1604 39.5564 63.3612 39.5564C64.7739 39.5564 65.9924 38.8854 66.5751 37.8082L68.6766 39.0267C67.617 40.8102 65.6215 41.9404 63.3612 41.9404ZM83.8093 40.0862C82.5555 41.3223 81.0368 41.9404 79.2533 41.9404C77.4697 41.9404 75.951 41.3223 74.6972 40.0862C73.4611 38.8324 72.843 37.3137 72.843 35.5125C72.843 33.7113 73.4611 32.1926 74.6972 30.9564C75.951 29.7027 77.4697 29.0846 79.2533 29.0846C81.0368 29.0846 82.5555 29.7027 83.8093 30.9564C85.0631 32.1926 85.6812 33.7113 85.6812 35.5125C85.6812 37.3137 85.0631 38.8324 83.8093 40.0862ZM76.4101 38.4262C77.1695 39.1856 78.1231 39.5564 79.2533 39.5564C80.3834 39.5564 81.337 39.1856 82.0964 38.4262C82.8557 37.6669 83.2442 36.6957 83.2442 35.5125C83.2442 34.3293 82.8557 33.3581 82.0964 32.5987C81.337 31.8394 80.3834 31.4509 79.2533 31.4509C78.1231 31.4509 77.1695 31.8394 76.4101 32.5987C75.6508 33.3581 75.2623 34.3293 75.2623 35.5125C75.2623 36.6957 75.6508 37.6669 76.4101 38.4262ZM97.9011 36.8722V29.3318H100.338V41.6932H98.4839L93.1861 34.1351V41.6932H90.7492V29.3318H92.6034L97.9011 36.8722ZM113.368 29.3318V31.6628H108.423V34.5942H113.227V36.9252H108.423V41.6932H105.986V29.3318H113.368ZM125.916 41.6932H118.057V40.5807L122.507 36.0952C123.779 34.8238 124.415 33.7289 124.415 32.8283C124.415 31.2567 123.284 30.3207 121.925 30.3207C120.653 30.3207 119.735 30.9035 119.152 32.069L118.11 31.4509C118.887 29.9146 120.3 29.1199 121.925 29.1199C122.914 29.1199 123.779 29.4554 124.521 30.1265C125.28 30.7799 125.651 31.6805 125.651 32.8283C125.651 34.2587 124.821 35.5125 123.355 36.9782L119.823 40.4924H125.916V41.6932ZM138.818 40.1745C138.005 41.3223 136.858 41.9051 135.374 41.9051C133.891 41.9051 132.743 41.3223 131.913 40.1745C131.101 39.009 130.695 37.455 130.695 35.5125C130.695 33.57 131.101 32.016 131.913 30.8682C132.743 29.7027 133.891 29.1199 135.374 29.1199C136.858 29.1199 138.005 29.7027 138.818 30.8682C139.648 32.016 140.054 33.57 140.054 35.5125C140.054 37.455 139.648 39.009 138.818 40.1745ZM132.831 39.3445C133.449 40.2451 134.297 40.7043 135.374 40.7043C136.451 40.7043 137.299 40.2451 137.9 39.3445C138.518 38.4439 138.818 37.1548 138.818 35.5125C138.818 33.8702 138.518 32.5811 137.9 31.6805C137.299 30.7799 136.451 30.3207 135.374 30.3207C134.297 30.3207 133.449 30.7799 132.831 31.6805C132.231 32.5811 131.931 33.8702 131.931 35.5125C131.931 37.1548 132.231 38.4439 132.831 39.3445ZM152.682 41.6932H144.824V40.5807L149.274 36.0952C150.545 34.8238 151.181 33.7289 151.181 32.8283C151.181 31.2567 150.051 30.3207 148.691 30.3207C147.42 30.3207 146.502 30.9035 145.919 32.069L144.877 31.4509C145.654 29.9146 147.067 29.1199 148.691 29.1199C149.68 29.1199 150.545 29.4554 151.287 30.1265C152.047 30.7799 152.417 31.6805 152.417 32.8283C152.417 34.2587 151.587 35.5125 150.122 36.9782L146.59 40.4924H152.682V41.6932ZM164.617 38.0554H166.207V39.2209H164.617V41.6932H163.381V39.2209H156.847V38.0554L161.439 29.3318H162.798L158.207 38.0554H163.381V34.2764H164.617V38.0554Z"
        fill="#3F94FF"
      />
      <defs>
        <linearGradient
          id="paint0_linear_198_101"
          x1="31.1115"
          y1="12.8885"
          x2="12.9394"
          y2="31.0708"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F75FF" />
          <stop offset="1" stopColor="#30AFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
