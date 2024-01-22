import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import HeroPlanetImage from '../../../public/assets/conf/conf-hero.jpg'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/solid'
import {AnimatePresence, motion} from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
} from '@skillrecordings/ui'
import {GetServerSideProps} from 'next'
import {useKey} from 'react-use'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import {useRouter} from 'next/router'
import {shuffle} from 'lodash'

const TITO_URL = undefined // 'https://ti.to/epic-web/epic-web-conf-2024'
const CK_CONF_2024_FIELD = {
  [`conf_2024`]: new Date().toISOString().slice(0, 10),
}

export const getServerSideProps: GetServerSideProps = async () => {
  const speakersWall = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())

  return {
    props: {speakers: shuffle(speakersWall)},
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

const ConfPage: React.FC<{speakers: Speaker[]}> = ({speakers}) => {
  const [showingSpeakerDetail, setShowingSpeakerDetail] = React.useState<
    boolean | Speaker
  >(false)
  const router = useRouter()

  return (
    <Layout
      className="bg-foreground text-background dark:bg-background dark:text-foreground"
      meta={{
        title: 'Epic Web Conf 2024',
        titleAppendSiteName: false,
        description:
          'The Full Stack Web Development Conference of Epic proportions.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1705933051/conf-card_2x.jpg',
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
                <strong>Salt Lake City, Utah</strong>, and the{' '}
                <strong>free live stream</strong> is there to reach even the
                most distant Epic web developers.
              </p>
              <p>
                You'll want to be here in Salt Lake City to rub shoulders with
                some of the best developers working on the web, just like you.
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
                  src={require('../../../public/assets/conf/venue-map.png')}
                  loading="eager"
                  alt=""
                  aria-hidden="true"
                  quality={100}
                />
              </div>
              <Link
                href="https://maps.app.goo.gl/qESDjrkiiaTJ99zY7"
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute -bottom-16 flex scale-[0.8] items-center justify-center rounded bg-white text-gray-900 before:absolute before:-top-1.5 before:-ml-7 before:h-3 before:w-3 before:rotate-45 before:bg-white before:content-[''] sm:-bottom-10 sm:scale-100"
              >
                <div className="overflow-hidden rounded-l">
                  <Image
                    src={require('../../../public/assets/conf/venue-photo.jpg')}
                    alt="Venue 6SIX9"
                    width={152}
                    height={152}
                    loading="eager"
                    className="transition duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
                <div className="p-5 pr-7">
                  <h3 className="text-xl font-semibold">Venue 6SIX9</h3>
                  <div className="mt-3 inline-flex text-sm hover:underline">
                    669 S W Temple
                    <br />
                    Salt Lake City, UT, 84101
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        <SpeakersList
          speakers={speakers}
          showingSpeakerDetail={showingSpeakerDetail}
          setShowingSpeakerDetail={setShowingSpeakerDetail}
        />
        <p className="my-10 block w-full text-center font-mono text-sm uppercase text-[#93A1D7]">
          <span aria-hidden="true">{'//'}</span> Full schedule TBA{' '}
          <span aria-hidden="true">{'//'}</span>
        </p>
        <h2 className="pb-5 pt-3 text-center text-2xl font-semibold">
          Front Row News
        </h2>
        {!TITO_URL && (
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
        )}
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 pb-16">
          <div className="relative z-10 mx-auto flex h-[200px] w-full max-w-screen-lg flex-col items-center justify-center sm:h-[320px]">
            {TITO_URL && (
              <Button
                asChild
                className="h-12 rounded-sm bg-gradient-to-tr from-gray-50 to-gray-100 font-mono text-base font-bold uppercase tracking-wide text-gray-950 shadow-soft-2xl transition hover:brightness-110"
                size="lg"
              >
                <Link href={TITO_URL} rel="noopener noreferrer" target="_blank">
                  Buy Tickets <ChevronRightIcon className="-mr-2 ml-2 w-4" />
                </Link>
              </Button>
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
      if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return
      }
      handleViewNextSpeaker()
    },
    {},
    [nextSpeaker, firstSpeaker],
  )

  useKey(
    'ArrowLeft',
    (event) => {
      if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return
      }
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
          Epic Web Dev Conference 2024
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
            <div className="text-lg text-[#D6DEFF]">Salt Lake City, UT</div>
          </div>
        </div>
        <Button
          asChild
          className="mt-10 h-12 rounded-sm bg-gradient-to-tr from-[#50BBFF] to-[#6397FF] font-mono text-base font-bold uppercase tracking-wide text-gray-950 transition hover:brightness-110"
          size="lg"
        >
          {TITO_URL && (
            <Link href={TITO_URL} target="_blank" rel="noopener noreferrer">
              Buy Tickets <ChevronRightIcon className="-mr-2 ml-2 w-4" />
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
      <section className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pb-16 pt-10">
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
                onClick={() => setShowingSpeakerDetail(speaker)}
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
