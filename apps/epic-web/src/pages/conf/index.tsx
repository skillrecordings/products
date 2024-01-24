import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import HeroPlanetImage from '../../../public/assets/conf/conf-hero.jpg'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/solid'
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
import {GetServerSideProps, GetStaticProps} from 'next'
import {useKey} from 'react-use'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import {useRouter} from 'next/router'
import {shuffle} from 'lodash'
import {track} from 'utils/analytics'
import {cn} from '@skillrecordings/ui/utils/cn'

const TITO_URL = 'https://ti.to/epicweb/epicweb-conf-2024'
const CK_CONF_2024_FIELD = {
  [`conf_2024`]: new Date().toISOString().slice(0, 10),
}

export const getStaticProps: GetStaticProps = async () => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())
  // const schedule = await fetch(
  //   'https://sessionize.com/api/v2/epg94f49/view/GridSmart',
  // ).then((res) => res.json())

  return {
    props: {
      speakers,
      // schedule
    },
    revalidate: 60 * 5,
  }
}

type Speaker = {
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

type Schedule = Day[]

const ConfPage: React.FC<{speakers: Speaker[]; schedule: Schedule}> = ({
  speakers,
  schedule,
}) => {
  const [showingSpeakerDetail, setShowingSpeakerDetail] = React.useState<
    boolean | Speaker
  >(false)
  const router = useRouter()
  const [shuffledSpeakers, setShuffledSpeakers] = React.useState<Speaker[]>([])
  React.useEffect(() => {
    setShuffledSpeakers(shuffle(speakers))
  }, [])

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
      <Header />
      <main>
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
                <strong>Park City, Utah</strong>, and the{' '}
                <strong>free live stream</strong> is there to reach even the
                most distant Epic web developers.
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
                  track('clicked platinum sponsor', {
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
        <Workshops speakers={speakers} />
        {/* <Schedule schedule={schedule} speakers={speakers} /> */}
        <p className="mb-16 block w-full text-center font-mono text-sm uppercase text-[#93A1D7]">
          <span aria-hidden="true">{'//'}</span> Full schedule TBA{' '}
          <span aria-hidden="true">{'//'}</span>
        </p>
        <Sponsors />
        {!TITO_URL && (
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
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 pb-16">
          <div className="relative z-10 mx-auto flex h-[240px] w-full max-w-screen-lg flex-col items-center justify-center sm:h-[320px]">
            {TITO_URL && (
              <>
                <h2 className="pb-10 text-center text-2xl font-semibold sm:text-3xl">
                  See you at the Epic Web Conf!
                </h2>
                <Button
                  asChild
                  className="h-12 rounded-sm bg-gradient-to-tr from-gray-50 to-gray-100 font-mono text-base font-bold uppercase tracking-wide text-gray-950 shadow-soft-2xl transition hover:brightness-110"
                  size="lg"
                >
                  <Link
                    href={TITO_URL}
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
        <Button
          asChild
          className="mt-10 h-12 rounded-sm bg-gradient-to-tr from-[#50BBFF] to-[#6397FF] font-mono text-base font-bold uppercase tracking-wide text-gray-950 transition hover:brightness-110"
          size="lg"
        >
          {TITO_URL && (
            <Link
              href={TITO_URL}
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
              <motion.div
                onMouseEnter={() => {
                  setHoveredItem(speaker)
                  setIsHovering(true)
                }}
                onMouseLeave={() => {
                  setIsHovering(false)
                }}
                key={speaker.id}
                className="relative flex flex-col items-center p-2 sm:p-6"
                tabIndex={0}
                role="button"
                aria-haspopup="dialog"
                aria-expanded={showingSpeakerDetail ? 'true' : 'false'}
                onClick={() => {
                  setShowingSpeakerDetail(speaker)
                  track('clicked speaker', {
                    title: 'conf2024',
                    type: 'speaker',
                    location: speaker.fullName,
                  })
                }}
              >
                <motion.div
                  animate={{
                    filter:
                      isHovering && hoveredItem?.id !== speaker.id
                        ? 'saturate(0.5)'
                        : 'saturate(1)',
                  }}
                  className="bg-gray-950"
                >
                  <Image
                    loading="eager"
                    className="rounded opacity-90"
                    src={speaker.profilePicture}
                    alt={speaker.fullName}
                    width={230}
                    height={230}
                  />
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
            )
          })}
        </div>
      </section>
      <SpeakerDetail
        speakers={speakers}
        showingSpeakerDetail={showingSpeakerDetail}
        setShowingSpeakerDetail={setShowingSpeakerDetail}
      />
    </>
  )
}

const workshopsData = [
  {
    title: 'Pixel Perfect Figma to Tailwind',
    description: (
      <>
        <p>
          Getting started with automated testing can be extremely intimidating.
          There’s just so much to learn! What to test, how to test, testing
          setup, assertion libraries, test frameworks… It’s overwhelming, to say
          the least.
        </p>
        <p>
          But it doesn’t have to be. Even a rocket ship can be broken down into
          smaller pieces that make up its foundation. And testing code is not
          rocket science. I am here to teach you the fundamentals, essential
          mental models, and practical skills so you can tackle any test at any
          level.
        </p>
        <p>
          This workshop is aimed at complete beginners as well as developers who
          have already been writing tests for some time but feel that something
          is missing, that each test is still, somehow, a struggle and a
          challenge. A walk in the dark. If you want to turn on the light and
          get confident when testing, you’ve come to the right place.
        </p>
      </>
    ),
    date: 'Wednesday, April 10, 2024',
    time: 'from 10:00 am - 4:00 pm MT and includes lunch',
    instructor: 'Simon Vrachliotis',
  },
  {
    title: 'Testing Fundamentals in TypeScript',
    description: (
      <>
        <p>
          Getting started with automated testing can be extremely intimidating.
          There’s just so much to learn! What to test, how to test, testing
          setup, assertion libraries, test frameworks… It’s overwhelming, to say
          the least.
        </p>

        <p>
          But it doesn’t have to be. Even a rocket ship can be broken down into
          smaller pieces that make up its foundation. And testing code is not
          rocket science. I am here to teach you the fundamentals, essential
          mental models, and practical skills so you can tackle any test at any
          level.
        </p>

        <p>
          This workshop is aimed at complete beginners as well as developers who
          have already been writing tests for some time but feel that something
          is missing, that each test is still, somehow, a struggle and a
          challenge. A walk in the dark. If you want to turn on the light and
          get confident when testing, you’ve come to the right place.
        </p>
      </>
    ),
    date: 'Wednesday, April 10, 2024',
    time: 'from 10:00 am - 4:00 pm MT and includes lunch',
    instructor: 'Artem Zakharchenko',
  },
  {
    title: 'Advanced React Patterns',
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
]

const Workshops: React.FC<{speakers: Speaker[]}> = ({speakers}) => {
  return (
    <section
      id="workshops"
      aria-label="workshops"
      className="relative mx-auto flex w-full max-w-screen-lg flex-col justify-between gap-0 px-5 pb-32 md:flex-row md:gap-20"
    >
      <h2 className="pb-10 text-4xl font-bold sm:text-5xl">Workshops</h2>
      <div className="flex flex-col gap-10 lg:pr-16">
        {workshopsData.map(({title, description, date, time, instructor}) => {
          return (
            <div key={title} className="pt-3 [&_time]:text-[#D6DEFF]">
              <h3 className="pb-2 text-2xl font-semibold">
                <Link
                  href={TITO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
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
              <span className="flex items-center gap-2.5">
                <Image
                  src={getProfilePictureForWorkshopInstructor(
                    instructor,
                    speakers,
                  )}
                  width={60}
                  height={60}
                  alt={instructor}
                  className="rounded-full"
                />{' '}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{instructor}</span>
                  <time dateTime={date} className="text-sm">
                    {date}
                  </time>
                  <time dateTime={time} className="text-sm">
                    {time}
                  </time>
                </div>
              </span>
            </div>
          )
        })}
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
      className="mx-auto flex w-full max-w-screen-lg scale-90 flex-col items-center justify-center gap-10 pb-16 pt-8 lg:scale-100 [&_p]:text-[#93A1D7]"
    >
      <h2 className="text-3xl font-semibold">Sponsors</h2>
      <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:gap-16 sm:px-10">
        <p className="w-20 font-mono text-sm uppercase">Platinum:</p>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-16">
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
      <div className="flex flex-col items-center gap-8 px-5 sm:flex-row sm:px-10 md:gap-16">
        <p className="font-mono text-sm uppercase">Gold:</p>
        <div className="flex items-center gap-5 sm:gap-16">
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
        <p className="font-mono text-sm uppercase">Silver:</p>
        <div className="flex items-center gap-10 sm:gap-16">
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
        <div className="flex flex-wrap items-center justify-center gap-8 sm:justify-start sm:gap-x-16">
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
      <Link
        href="mailto:conf@epicweb.dev?subject=Sponsoring Epic Web Conf 2024"
        className="inline-flex items-center text-center text-[#93A1D7] underline transition hover:brightness-110"
      >
        Become a sponsor
      </Link>
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
          fillRule="evenodd"
          role="img"
          viewBox="0 0 259 84"
        >
          <title>Fly.io</title>
          <g>
            <path
              d="M57.413 10.134h9.454c8.409 0 15.236 6.827 15.236 15.236v33.243c0 8.409-6.827 15.236-15.236 15.236h-.745c-4.328-.677-6.205-1.975-7.655-3.072l-12.02-9.883a1.692 1.692 0 0 0-2.128 0l-3.905 3.211-10.998-9.043a1.688 1.688 0 0 0-2.127 0L12.01 68.503c-3.075 2.501-5.109 2.039-6.428 1.894C2.175 67.601 0 63.359 0 58.613V25.37c0-8.409 6.827-15.236 15.237-15.236h9.433l-.017.038-.318.927-.099.318-.428 1.899-.059.333-.188 1.902-.025.522-.004.183.018.872.043.511.106.8.135.72.16.663.208.718.54 1.52.178.456.94 1.986.332.61 1.087 1.866.416.673 1.517 2.234.219.296 1.974 2.569.638.791 2.254 2.635.463.507 1.858 1.999.736.762 1.216 1.208-.244.204-.152.137c-.413.385-.805.794-1.172 1.224a10.42 10.42 0 0 0-.504.644 8.319 8.319 0 0 0-.651 1.064 6.234 6.234 0 0 0-.261.591 5.47 5.47 0 0 0-.353 1.606l-.007.475a5.64 5.64 0 0 0 .403 1.953 5.44 5.44 0 0 0 1.086 1.703c.338.36.723.674 1.145.932.359.22.742.401 1.14.539a6.39 6.39 0 0 0 2.692.306h.005a6.072 6.072 0 0 0 2.22-.659c.298-.158.582-.341.848-.549a5.438 5.438 0 0 0 1.71-2.274c.28-.699.417-1.446.405-2.198l-.022-.393a5.535 5.535 0 0 0-.368-1.513 6.284 6.284 0 0 0-.285-.618 8.49 8.49 0 0 0-.67-1.061 11.022 11.022 0 0 0-.354-.453 14.594 14.594 0 0 0-1.308-1.37l-.329-.28.557-.55 2.394-2.5.828-.909 1.287-1.448.837-.979 1.194-1.454.808-1.016 1.187-1.587.599-.821.85-1.271.708-1.083 1.334-2.323.763-1.524.022-.047.584-1.414a.531.531 0 0 0 .02-.056l.629-1.962.066-.286.273-1.562.053-.423.016-.259.019-.978-.005-.182-.05-.876-.062-.68-.31-1.961c-.005-.026-.01-.052-.018-.078l-.398-1.45-.137-.403-.179-.446Zm4.494 41.455a3.662 3.662 0 0 0-3.61 3.61 3.663 3.663 0 0 0 3.61 3.609 3.665 3.665 0 0 0 3.611-3.609 3.663 3.663 0 0 0-3.611-3.61Z"
              fill="url(#urb_Radial1)"
              fillOpacity="1"
            ></path>
            <path
              d="M35.639 72.544l-.637.535a3.332 3.332 0 01-2.09.762H15.235a15.176 15.176 0 01-9.654-3.451c1.319.145 3.353.607 6.428-1.894l15.277-13.44a1.693 1.693 0 012.127 0l10.997 9.042 3.904-3.21c.619-.5 1.51-.5 2.128 0l12.019 9.882c1.45 1.097 3.327 2.394 7.654 3.071H58.12a3.394 3.394 0 01-1.963-.654l-.14-.108-.593-.493a1.247 1.247 0 00-.158-.159c-.672-.563-9.187-7.617-9.187-7.617a1 1 0 00-1.281.002s.021.026-9.038 7.615a1.12 1.12 0 00-.121.117zm26.262-20.96a3.678 3.678 0 00-3.61 3.609 3.68 3.68 0 003.61 3.609 3.68 3.68 0 003.61-3.609 3.678 3.678 0 00-3.61-3.609zM38.566 40.648L37.35 39.44l-.736-.762-1.858-1.999-.463-.507-2.253-2.634-.638-.791-1.974-2.569-.219-.296-1.517-2.234-.416-.673-1.087-1.866-.332-.61-.94-1.985-.178-.456-.539-1.52-.208-.718-.16-.663-.135-.72-.106-.8-.043-.511-.018-.872.004-.183.025-.522.188-1.901.059-.333.428-1.899.098-.318.318-.927.102-.24.506-1.112.351-.662.489-.806.487-.718.347-.456.4-.482.44-.484.377-.378.918-.808.671-.549c.016-.014.033-.026.05-.038l.794-.537.631-.402 1.198-.631c.018-.011.039-.02.058-.029l1.698-.705.157-.059 1.51-.442.638-.143.862-.173.572-.087.877-.109.598-.053 1.187-.063.465-.005.881.018.229.013 1.276.106 1.687.238.195.041 1.668.415.49.146.544.188.663.251.524.222.77.363.485.249.872.512.325.2 1.189.868.341.296.828.754.041.041.703.754.242.273.825 1.096.168.262.655 1.106.197.379.369.825.386.963.137.403.398 1.45a.89.89 0 01.018.078l.31 1.961.062.679.05.876.005.182-.019.978-.016.259-.053.423-.273 1.562-.066.286-.629 1.962a.626.626 0 01-.02.056l-.584 1.414-.022.047-.763 1.523-1.334 2.323-.708 1.083-.849 1.271-.599.821-1.187 1.587-.808 1.016-1.194 1.453-.837.979-1.287 1.448-.828.909-2.394 2.5-.556.55.328.28c.465.428.902.885 1.308 1.37.122.148.24.299.354.453.249.336.473.691.67 1.06.106.2.201.407.285.618.191.484.32.996.368 1.513l.022.393c.012.752-.125 1.5-.405 2.198a5.438 5.438 0 01-1.71 2.274c-.266.208-.55.391-.848.549a6.08 6.08 0 01-2.219.659h-.005a6.403 6.403 0 01-2.692-.306 5.882 5.882 0 01-1.14-.539 5.523 5.523 0 01-1.145-.932 5.458 5.458 0 01-1.086-1.703 5.662 5.662 0 01-.403-1.953l.007-.475a5.47 5.47 0 01.353-1.606c.077-.202.164-.399.261-.591.19-.37.408-.725.651-1.063.159-.221.328-.436.504-.644.367-.43.759-.839 1.172-1.224l.152-.137.244-.204z"
              fill="transparent"
            ></path>
            <path
              d="M35.002 73.079l9.796-8.267a1 1 0 011.281-.002l9.938 8.269c.604.492 1.36.761 2.139.762h-25.28c.776 0 1.527-.269 2.126-.762zM41.1 43.568l.096.028c.031.015.057.036.085.055l.08.071c.198.182.39.373.575.569.13.139.257.282.379.43.155.187.3.383.432.587.057.09.11.181.16.276.043.082.082.167.116.253.06.15.105.308.119.469l-.003.302a1.726 1.726 0 01-.817 1.343 2.333 2.333 0 01-.994.327l-.373.011-.315-.028a2.398 2.398 0 01-.433-.105 2.07 2.07 0 01-.41-.192l-.246-.18a1.685 1.685 0 01-.56-.96 2.418 2.418 0 01-.029-.19l-.009-.288c.005-.078.017-.155.034-.232.043-.168.105-.331.183-.486.101-.194.216-.381.344-.559.213-.288.444-.562.691-.821.159-.168.322-.331.492-.488l.121-.109c.084-.055.085-.055.181-.083h.101zM40.481 3.42l.039-.003v33.665l-.084-.155a94.101 94.101 0 01-3.093-6.267 67.257 67.257 0 01-2.099-5.255 41.665 41.665 0 01-1.265-4.326c-.265-1.163-.469-2.343-.553-3.535a16.923 16.923 0 01-.029-1.528c.008-.444.026-.887.054-1.33.044-.696.115-1.391.217-2.081.081-.543.181-1.084.304-1.619.098-.425.212-.847.342-1.262.188-.6.413-1.186.675-1.758.096-.206.199-.411.307-.612.65-1.204 1.532-2.313 2.687-3.054a5.609 5.609 0 012.498-.88zm4.365.085l2.265.646c1.049.387 2.059.891 2.987 1.521a11.984 11.984 0 013.212 3.204c.502.748.918 1.555 1.243 2.398.471 1.247.763 2.554.866 3.882.03.348.047.697.054 1.046.008.324.006.649-.02.973-.064.725-.2 1.442-.407 2.14a17.03 17.03 0 01-.587 1.684c-.28.685-.591 1.357-.932 2.013-.754 1.457-1.623 2.852-2.553 4.201a65.451 65.451 0 01-3.683 4.806 91.02 91.02 0 01-4.417 4.896 93.66 93.66 0 002.907-5.949c.5-1.124.971-2.26 1.414-3.407.487-1.26.927-2.537 1.317-3.83.29-.969.546-1.948.757-2.938.181-.849.323-1.707.411-2.57.074-.72.101-1.444.083-2.166a30.867 30.867 0 00-.049-1.325c-.106-1.775-.376-3.545-.894-5.248a15.341 15.341 0 00-.714-1.892c-.663-1.444-1.588-2.793-2.84-3.778l-.42-.307z"
              fill="#fff"
            ></path>

            <path
              d="M179.213 64.297l-10.751-23.015c-.898-1.917-1.433-2.618-2.331-3.431l-.874-.788c-.697-.676-1.155-1.302-1.155-2.045 0-1.064.843-1.96 2.378-1.96h9.334c1.465 0 2.378.762 2.378 1.9 0 .635-.292 1.111-.661 1.578-.438.555-1.008 1.096-1.008 2.082 0 .618.18 1.234.527 2.021l6.416 15.025 5.755-14.647c.354-.974.596-1.832.596-2.519 0-1.069-.581-1.505-1.029-1.983-.39-.415-.702-.854-.702-1.557 0-1.149.935-1.9 2.193-1.9h5.748c1.612 0 2.378.834 2.378 1.9 0 .682-.393 1.314-1.166 1.996l-.813.668c-1.132.925-1.656 2.263-2.251 3.647l-8.716 20.998c-1.03 2.455-2.563 5.863-4.905 8.659-2.379 2.84-5.587 5.048-9.932 5.048-3.638 0-5.84-1.737-5.84-4.24 0-2.293 1.696-4.12 3.924-4.12 1.22 0 1.855.576 2.499 1.169.532.489 1.072.991 2.137.991.988 0 1.908-.418 2.742-1.093 1.274-1.03 2.341-2.652 3.129-4.384zm63.175-.082c4.839 0 8.804-1.658 11.897-4.967 3.09-3.304 4.636-7.281 4.636-11.931 0-4.539-1.469-8.268-4.396-11.191-2.926-2.921-6.723-4.388-11.396-4.388-4.92 0-8.944 1.597-12.077 4.78-3.135 3.186-4.703 7.045-4.703 11.578 0 4.493 1.496 8.301 4.483 11.425 2.99 3.126 6.84 4.694 11.556 4.694zm-40.921-.36c2.798 0 4.788-1.884 4.788-4.6 0-2.652-2.055-4.54-4.788-4.54-2.863 0-4.912 1.891-4.912 4.54 0 2.713 2.05 4.6 4.912 4.6zm9.964-4.305l.681-.72c.81-.787 1.071-1.582 1.071-3.774V42.097c0-1.895-.258-2.741-1.062-3.465l-.801-.718c-.785-.693-1.043-1.124-1.043-1.816 0-.984.763-1.791 1.99-2.071l5.44-1.32c.52-.126 1.107-.249 1.562-.249.626 0 1.138.206 1.497.563.36.358.572.873.572 1.517v20.518c0 2.069.251 3.031 1.115 3.758a.359.359 0 01.039.039l.608.708c.764.743 1.081 1.236 1.081 1.914 0 1.209-.912 1.9-2.377 1.9h-9.211c-1.396 0-2.316-.687-2.316-1.9 0-.681.317-1.178 1.154-1.925zm-61.567.001l.681-.721c.811-.787 1.071-1.582 1.071-3.774V27.999c0-1.835-.194-2.736-1.053-3.459l-.822-.796c-.709-.689-.968-1.116-.968-1.805 0-.985.767-1.789 1.927-2.07l5.378-1.32c.521-.126 1.107-.249 1.563-.249.621 0 1.147.187 1.522.542.376.356.608.885.608 1.598v34.616c0 2.074.258 2.981 1.125 3.766l.694.734c.769.748 1.025 1.238 1.025 1.919 0 .502-.153.907-.426 1.216-.385.435-1.03.684-1.89.684h-9.21c-.86 0-1.505-.249-1.891-.684-.272-.309-.425-.714-.425-1.216 0-.682.253-1.176 1.091-1.924zm-25.079-13.934v9.319c0 1.404.278 2.701 1.435 3.768l.748.726c.838.813 1.093 1.3 1.093 2.045 0 1.138-.913 1.9-2.378 1.9h-10.385c-1.465 0-2.377-.762-2.377-1.9 0-.884.259-1.303 1.097-2.049l.745-.724c.868-.786 1.434-1.857 1.434-3.766V30.039c0-1.517-.336-2.758-1.435-3.769l-.749-.726c-.77-.747-1.092-1.238-1.092-1.985 0-1.206.915-1.96 2.377-1.96h27.817c1.063 0 1.997.237 2.594.822.415.407.68.981.71 1.778l.433 6.421c.043.803-.194 1.472-.657 1.885-.319.284-.748.454-1.288.454-.681 0-1.203-.257-1.669-.701-.419-.399-.792-.959-1.213-1.618-1.016-1.624-1.489-2.208-2.572-2.967-1.507-1.112-3.803-1.494-8.145-1.494-2.505 0-4.086.109-5.082.366-.644.166-1.016.382-1.215.699-.204.324-.226.734-.226 1.235v12.618h6.523c1.561 0 2.659-.282 3.931-2.021l.007-.01c.51-.649.879-1.127 1.23-1.444.409-.37.802-.545 1.323-.545a1.9 1.9 0 011.883 1.901v8.699c0 1.165-.908 1.96-1.883 1.96-.485 0-.879-.173-1.289-.535-.353-.31-.723-.775-1.203-1.396-1.392-1.802-2.375-2.089-3.999-2.089h-6.523zm110.214-.22c0-3.121.68-5.364 2.089-6.713 1.392-1.332 2.888-2.006 4.496-2.006 2.212 0 4.205 1.238 6.003 3.672 1.837 2.489 2.746 5.853 2.746 10.086 0 3.124-.682 5.388-2.093 6.776-1.391 1.369-2.886 2.063-4.493 2.063-2.212 0-4.204-1.248-6.002-3.701-1.838-2.51-2.746-5.904-2.746-10.177zm-18.202-16.878c2.804 0 4.788-1.578 4.788-4.3 0-2.658-1.982-4.24-4.788-4.24-2.871 0-4.851 1.583-4.851 4.24 0 2.656 1.981 4.3 4.851 4.3z"
              fill="currentColor"
            ></path>
          </g>
          <defs>
            <radialGradient
              id="urb_Radial1"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(43.593 41.714) scale(59.4764)"
            >
              <stop offset="0" stopColor="#ba7bf0" />
              <stop offset=".45" stopColor="#996bec" />
              <stop offset="1" stopColor="#5046e4" />
            </radialGradient>
          </defs>
        </svg>
      ),
    },
    {
      name: 'Sentry.io',
      url: 'https://sentry.io/',
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
      url: 'https://cloudinary.com',
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
  ],
}

const Schedule: React.FC<{schedule: Schedule; speakers: Speaker[]}> = ({
  schedule,
  speakers,
}) => {
  return (
    <section
      id="schedule"
      aria-label="schedule"
      className="mx-auto w-full max-w-screen-lg p-4"
    >
      <h2 className="pb-10 text-4xl font-bold sm:text-5xl">Schedule</h2>
      {schedule.map((day) => (
        <div key={day.date} className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            {format(parseISO(day.date), 'EEEE, dd/MM/yyyy')}
          </h2>
          {day.rooms.map((room) => (
            <div key={room.id} className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Room: {room.name}</h3>
              <Accordion type="single" collapsible className="w-full">
                <ul className="flex flex-col divide-y divide-white/10">
                  {room.sessions.map((session) => {
                    const speaker = session?.speakers[0]?.name

                    const Speaker: React.FC<{className?: string}> = ({
                      className,
                    }) => {
                      return (
                        <div className={cn('items-center gap-2', className)}>
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
                          <span className="text-sm">{speaker}</span>
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
                        asChild
                      >
                        <li>
                          <AccordionTriggerComp className="w-full">
                            <div
                              className={cn(
                                'md:group flex w-full items-start gap-3 py-2 md:items-center',
                                {
                                  '': session.title === 'Break',
                                },
                              )}
                            >
                              <div className="flex w-full max-w-[80px] items-center pt-2 text-[#D6DEFF] md:max-w-[160px] md:pt-0">
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
                                <div className="flex flex-col items-start text-left">
                                  <h4 className="text-lg font-semibold leading-tight">
                                    {session.title}
                                  </h4>
                                  {speaker && (
                                    <Speaker className="flex md:hidden" />
                                  )}
                                </div>
                                {/* <p className="text-sm">{session.description}</p> */}
                              </div>
                              {speaker && (
                                <Speaker className="hidden w-full max-w-[200px] md:flex" />
                              )}
                            </div>
                          </AccordionTriggerComp>
                          <AccordionContent>
                            <p className="pb-5 text-left text-sm leading-relaxed text-[#D6DEFF] md:ml-[160px] md:px-3 md:text-base">
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
