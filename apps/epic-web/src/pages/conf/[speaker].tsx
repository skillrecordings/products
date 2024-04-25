import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import slugify from '@sindresorhus/slugify'
import Layout from 'components/app/layout'
import {
  BuyTicketsCTA,
  CONF_24_TITO_URL,
  IS_PAST_CONF_24,
  type Speaker,
} from './index'
import {cn} from '@skillrecordings/ui/utils/cn'
import formatInTimeZone from 'date-fns-tz/formatInTimeZone'
import ReactMarkdown from 'react-markdown'
import {CopyToClipboard, Twitter} from '@skillrecordings/react'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {ChevronLeftIcon} from '@heroicons/react/outline'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import MuxPlayer, {MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import Image from 'next/image'
import {format} from 'date-fns'
import pluralize from 'pluralize'
import {getOgImage} from 'utils/get-og-image'
import {Button} from '@skillrecordings/ui'
import Icon from 'components/icons'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())

  const speaker: Speaker = speakers.find((speaker: Speaker) => {
    return slugify(speaker.fullName) === params?.speaker
  })

  const video = await sanityClient.fetch(
    groq`
    *[_type == "videoResource" && slug.current == $slug][0]{
      _id,
      "_type": "tip",
      "slug": slug.current,
      "muxPlaybackId": muxAsset.muxPlaybackId,
      transcript { text },
      "videoResourceId": _id,
      poster,
    }
  `,
    {
      slug: `conf-interview-${slugify(speaker.fullName)}`, // 'zZ4ErPnSL4ZWs2Du0ONL6z',
    },
  )

  if (!speaker) {
    return {
      notFound: true,
    }
  }

  const sessions = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Sessions',
  ).then((res) => res.json())

  const fullSpeakerSessions = getSessionDetailsForSpeaker(sessions, speaker.id)

  return {
    props: {
      speaker: {...speaker, sessions: fullSpeakerSessions} || null,
      video: video || null,
    },
    revalidate: 60 * 15,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())

  return {
    paths: speakers
      .filter((speaker: Speaker) => !speaker.fullName.includes('DevTools'))
      .map((speaker: Speaker) => ({
        params: {
          speaker: slugify(speaker.fullName),
        },
      })),
    fallback: false,
  }
}

type ConfSpeakerPageProps = {
  speaker: Omit<Speaker, 'sessions'> & {sessions: Session[]}
  video?: {
    _id: string
    muxPlaybackId: string
    transcript: {text: string}
    poster?: string
  }
}

const ConfSpeaker: React.FC<ConfSpeakerPageProps> = ({speaker, video}) => {
  const ogImage = getOgImage({
    title: speaker.fullName,
    type: video?.poster ? 'interview' : 'default',
    image: video?.poster || speaker.profilePicture,
  })

  return (
    <Layout
      className="overflow-x-hidden bg-foreground text-background dark:bg-background dark:text-foreground"
      meta={{
        title: `${speaker.fullName} is speaking at Epic Web Conf 2024`,
        ogImage,
        description: speaker.bio.substring(0, 157) + '...',
      }}
    >
      <LessonProvider
        lesson={
          {
            ...video,
            _type: 'interview',
            slug: slugify(speaker.fullName),
          } as any
        }
        module={
          {
            moduleType: 'interview',
            slug: {current: 'speakers'},
            lessons: [
              {
                ...video,
                slug: slugify(speaker.fullName),
                _type: 'interview',
              },
            ],
          } as any
        }
      >
        <VideoResourceProvider videoResourceId={video?._id as string}>
          <ConfSpeakerTemplate speaker={speaker} video={video} />
        </VideoResourceProvider>
      </LessonProvider>
    </Layout>
  )
}

export default ConfSpeaker

const ConfSpeakerTemplate: React.FC<ConfSpeakerPageProps> = ({
  speaker,
  video,
}) => {
  const router = useRouter()
  const shareUrl = process.env.NEXT_PUBLIC_URL + '/conf/' + router.query.speaker
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const [isTranscriptExpanded, setIsTranscriptExpanded] = React.useState(false)
  return (
    <VideoProvider muxPlayerRef={muxPlayerRef}>
      <main className="relative mx-auto w-full max-w-screen-lg px-5 pt-10 md:pt-16">
        <BgGraphic className="absolute -right-48 -top-48 z-0" />
        <div className="absolute -right-48 -top-48 h-[300px] w-[300px] rounded-full bg-[#93A1D7] opacity-30 blur-[500px] md:h-[600px] md:w-[600px]" />
        <div className="flex w-full flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link
              href="/conf#speakers"
              className="mb-5 flex items-center gap-1 text-sm text-[#93A1D7] opacity-90 transition hover:underline hover:opacity-100"
            >
              <ChevronLeftIcon className="w-4" aria-hidden="true" /> Epic Web
              Conf '24 Speakers
            </Link>
            <h1 className="text-4xl font-bold md:text-5xl">
              {speaker.fullName}
            </h1>
            <h2 className="pt-2 text-xl text-[#93A1D7] md:text-2xl">
              {speaker.tagLine}
            </h2>
          </div>
          {/* TODO: Fix link */}
          <Button asChild className="relative z-10 font-semibold">
            <Link href={`/talks`}>
              Watch Talk <Icon name="Playmark" className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div
          className={cn(
            'relative z-10 mt-14 flex w-full flex-col-reverse gap-10 md:flex-row',
            {
              'justify-between': video,
            },
          )}
        >
          <div
            className={cn('flex w-full flex-col gap-12', {
              'md:max-w-[280px]': video,
              'md:max-w-[400px]': !video,
            })}
          >
            <div className="w-full">
              <h3 className="flex border-b border-gray-800 pb-2 text-xl font-semibold dark:border-border">
                {pluralize('Talk', speaker.sessions.length)}
              </h3>
              <ul className="mt-5">
                {speaker.sessions &&
                  speaker.sessions.map((session) => {
                    return (
                      <li className="flex flex-col pb-2" key={session.id}>
                        <div className="text-[#93A1D7]">
                          {format(new Date(session.startsAt), 'EEEE, h:mm a')}—
                          {format(new Date(session.endsAt), 'h:mm a')}
                        </div>
                        <div>{session.title}</div>
                      </li>
                    )
                  })}
              </ul>
              {!IS_PAST_CONF_24 && (
                <Link
                  className="mt-5 inline-flex rounded bg-primary px-3 py-1 font-semibold text-primary-foreground transition hover:brightness-125"
                  href={CONF_24_TITO_URL}
                  target="_blank"
                >
                  Buy {pluralize('Ticket', speaker.sessions.length)}
                </Link>
              )}
            </div>
            <div>
              <h3 className="flex border-b border-gray-800 pb-2 text-xl font-semibold dark:border-border">
                Bio
              </h3>
              <ReactMarkdown className="prose prose-sm prose-invert mt-3 prose-p:text-[#D6DEFF]">
                {speaker.bio}
              </ReactMarkdown>
            </div>
            <div>
              <h3 className="flex border-b border-gray-800 pb-2 text-xl font-semibold dark:border-border">
                Share
              </h3>
              <div className="mt-1 flex items-center">
                <Twitter
                  link={shareUrl}
                  message={`${speaker.fullName} is speaking at Epic Web Conf 2024! Check out their interview`}
                />
                <CopyToClipboard
                  onSuccess={() => {
                    toast.success('Copied to clipboard')
                  }}
                  link={shareUrl}
                />
              </div>
            </div>
          </div>
          {video ? (
            <div className="flex h-full w-full flex-col gap-0">
              <h3 className="flex pb-2 text-xl font-semibold">Interview</h3>
              <div className="flex aspect-video items-center justify-center rounded border border-gray-800 dark:border-border">
                <MuxPlayer
                  accentColor="#93A1D7"
                  ref={muxPlayerRef}
                  playbackId={video.muxPlaybackId}
                  poster={video.poster}
                  className="rounded"
                />
              </div>
              {/* <div className="aspect-video h-full w-full max-w-[670px] rounded border bg-gray-900" /> */}
              {video?.transcript?.text && (
                <div className="relative flex flex-col sm:items-center [&_[data-video-transcript]]:p-0">
                  <div
                    className={cn('relative overflow-y-hidden', {
                      'max-h-[150px] sm:max-h-[300px]': !isTranscriptExpanded,
                      'max-h-[none] pb-10 sm:pb-16': isTranscriptExpanded,
                    })}
                  >
                    <VideoTranscript
                      canShowVideo
                      withTitle={false}
                      transcript={video?.transcript.text}
                      className="!sm:prose-sm prose !prose-sm !prose-invert p-0 dark:prose-invert"
                    />
                  </div>
                  {!isTranscriptExpanded && (
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-foreground via-foreground to-transparent dark:from-background dark:via-background sm:h-40"
                    />
                  )}
                  <button
                    className={cn(
                      'absolute inline-flex rounded border border-gray-800 bg-gray-900 px-2 py-0.5 text-sm font-semibold shadow-soft-xl transition hover:bg-gray-800 sm:px-3 sm:py-1 sm:text-base',
                      {
                        'bottom-10 sm:bottom-10': !isTranscriptExpanded,
                        'bottom-0 sm:bottom-0': isTranscriptExpanded,
                      },
                    )}
                    type="button"
                    onClick={() => {
                      setIsTranscriptExpanded((prev) => !prev)
                    }}
                  >
                    {isTranscriptExpanded ? 'Collapse' : 'Expand'} Transcript
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10">
              <Image
                priority
                quality={100}
                className="rounded shadow-soft-3xl"
                src={speaker.profilePicture}
                alt={speaker.fullName}
                width={300}
                height={300}
              />
            </div>
          )}
        </div>
        {!IS_PAST_CONF_24 && <BuyTicketsCTA />}
      </main>
    </VideoProvider>
  )
}

type Session = {
  questionAnswers?: any[]
  id: string
  title: string
  description: string
  startsAt: string
  endsAt: string
  isServiceSession: boolean
  isPlenumSession: boolean
  speakers: {id: string; name: string}[]
  categories?: any[]
  roomId?: number
  room?: string
  liveUrl?: string | null
  recordingUrl?: string | null
  status: string
  isInformed: boolean
  isConfirmed: boolean
}

type GroupedSessions = {
  groupId?: string | null
  groupName: string
  sessions: Session[]
  isDefault?: boolean
}

function getSessionDetailsForSpeaker(
  sessions: GroupedSessions[],
  speakerId: string,
): Session[] {
  const fullDetails: Session[] = []

  sessions.forEach((group) => {
    group.sessions.forEach((session) => {
      const isSpeakerPresent = session.speakers.some(
        (speaker) => speaker.id === speakerId,
      )
      if (isSpeakerPresent) {
        fullDetails.push(session)
      }
    })
  })

  return fullDetails
}

export const BgGraphic: React.FC<{className?: string}> = ({className}) => {
  return (
    <svg
      className={cn('', className)}
      width="665"
      height="607"
      viewBox="0 0 665 607"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.5"
        d="M290.496 316.503L113.492 606.413L26.102 580.918L0.587129 493.396L290.496 316.503Z"
        stroke="#2E334B"
      />
      <path
        opacity="0.5"
        d="M663.496 245.503L486.492 535.413L399.102 509.918L373.587 422.396L663.496 245.503Z"
        stroke="#2E334B"
      />
      <path
        opacity="0.5"
        d="M610.496 1.50318L433.492 291.413L346.102 265.918L320.587 178.396L610.496 1.50318Z"
        stroke="#2E334B"
      />
    </svg>
  )
}
