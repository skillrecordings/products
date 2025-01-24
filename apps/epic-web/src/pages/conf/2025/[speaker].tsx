import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import slugify from '@sindresorhus/slugify'
import Layout from 'components/app/layout'
import {CONF_25_TITO_URL, IS_PAST_CONF_25, type Speaker} from './index'
import BuyTicketsCTA from 'components/conf/buy-tickets-cta'
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
import {getConfTalkBySpeaker, type Talk} from 'lib/talks'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/wyvikoxy/view/Speakers',
  ).then((res) => res.json())

  const speaker: Speaker = speakers.find((speaker: Speaker) => {
    return slugify(speaker.fullName) === params?.speaker
  })

  const talk = await getConfTalkBySpeaker(speaker.fullName)

  const video = await sanityClient.fetch(
    groq`
    *[_type == "videoResource" && slug.current == $slug] | order(_createdAt desc)[0]{
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
      slug: `conf-interview-${slugify(speaker.fullName)}`,
    },
  )

  if (!speaker) {
    return {
      notFound: true,
    }
  }

  const sessions = await fetch(
    'https://sessionize.com/api/v2/wyvikoxy/view/Sessions',
  ).then((res) => res.json())

  const fullSpeakerSessions = getSessionDetailsForSpeaker(sessions, speaker.id)

  return {
    props: {
      speaker: {...speaker, sessions: fullSpeakerSessions},
      video: video || null,
      talk: talk || null,
    },
    revalidate: 60 * 15,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/wyvikoxy/view/Speakers',
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
  talk: Talk | null
  video?: {
    _id: string
    muxPlaybackId: string
    transcript: {text: string}
    poster?: string
  }
}

const ConfSpeaker: React.FC<ConfSpeakerPageProps> = ({
  speaker,
  video,
  talk,
}) => {
  const ogImage = getOgImage({
    title: speaker.sessions[0].title,
    byline: `I'm speaking at Epic Web Conf 2025`,
    authorName: speaker.fullName,
    authorImage: speaker.profilePicture,
    type: 'speaker',
  })

  return (
    <Layout
      className="overflow-x-hidden bg-foreground text-background dark:bg-background dark:text-foreground"
      meta={{
        title: `${speaker.fullName} is speaking at Epic Web Conf 2025`,
        ogImage,
        description: speaker.bio?.substring(0, 157) + '...',
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
          <ConfSpeakerTemplate speaker={speaker} video={video} talk={talk} />
        </VideoResourceProvider>
      </LessonProvider>
    </Layout>
  )
}

export default ConfSpeaker

const ConfSpeakerTemplate: React.FC<ConfSpeakerPageProps> = ({
  speaker,
  video,
  talk,
}) => {
  const router = useRouter()
  const shareUrl = process.env.NEXT_PUBLIC_URL + '/conf/' + router.query.speaker
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const [isTranscriptExpanded, setIsTranscriptExpanded] = React.useState(false)

  const sponsor = getSponsorForSpeaker(slugify(speaker.fullName))

  return (
    <VideoProvider muxPlayerRef={muxPlayerRef}>
      <main className="relative mx-auto w-full max-w-screen-lg px-5 pt-16">
        <BgGraphic className="absolute -right-48 -top-48 z-0" />
        <div className="absolute -right-48 -top-48 h-[300px] w-[300px] rounded-full bg-[#93A1D7] opacity-30 blur-[500px] md:h-[600px] md:w-[600px]" />
        <div className="flex w-full flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="flex items-end gap-8">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <Link
                href="/conf/2025#speakers"
                className="mb-5 flex items-center gap-1 text-sm text-[#93A1D7] opacity-90 transition hover:underline hover:opacity-100"
              >
                <ChevronLeftIcon className="w-4" aria-hidden="true" /> Epic Web
                Conf '25 Speakers
              </Link>
              <h1 className="text-4xl font-bold md:text-5xl">
                {speaker.fullName}
              </h1>
              <h2 className="pt-2 text-xl text-[#93A1D7] md:text-2xl">
                {speaker.tagLine}
              </h2>
            </div>
            {sponsor && (
              <div className="relative z-10 hidden flex-col  gap-3 border-l pl-8 md:flex">
                <span className="text-sm opacity-80">Travel Sponsor</span>
                <div className="transition duration-200 ease-in-out hover:scale-105">
                  {sponsor.logo}
                </div>
              </div>
            )}
          </div>
          {talk && (
            <Button asChild className="relative z-10 font-semibold">
              <Link href={`/talks/${talk?.slug}`}>
                Watch Talk <Icon name="Playmark" className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          )}
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
            {sponsor && (
              <div className="block md:hidden">
                <h3 className="flex border-b border-gray-800 pb-2 text-xl font-semibold dark:border-border">
                  Travel Sponsor
                </h3>
                <div className="pt-5">{sponsor.logo}</div>
              </div>
            )}
            <div className="w-full">
              <h3 className="flex border-b border-gray-800 pb-2 text-xl font-semibold dark:border-border">
                {pluralize('Talk', speaker.sessions.length)}
              </h3>
              <ul className="mt-5">
                {speaker.sessions &&
                  speaker.sessions.map((session) => {
                    return (
                      <li className="flex flex-col pb-2" key={session.id}>
                        {/* TODO: add date once the schedule is finalized */}
                        {/* <div className="text-[#93A1D7]">
                          {format(new Date(session.startsAt), 'EEEE, h:mm a')}—
                          {format(new Date(session.endsAt), 'h:mm a')}
                        </div> */}
                        <p className="text-lg font-semibold">{session.title}</p>
                        {session.description && (
                          <p className="mt-3 text-[#D6DEFF]">
                            {session.description}
                          </p>
                        )}
                      </li>
                    )
                  })}
              </ul>
              {!IS_PAST_CONF_25 && (
                <Link
                  className="mt-5 inline-flex rounded bg-primary px-3 py-1 font-semibold text-primary-foreground transition hover:brightness-125"
                  href={CONF_25_TITO_URL}
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
                  message={`${speaker.fullName} is speaking at Epic Web Conf 2025! Check out their interview`}
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
            <div className="relative z-10 flex items-center justify-center md:block">
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
        {!IS_PAST_CONF_25 && <BuyTicketsCTA />}
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

const travelSponsors = {
  'fly.io': {
    logo: (
      <Link href="https://fly.io" target="_blank">
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
      </Link>
    ),
    speakers: [
      'Annie Sexton',
      'Shruti Kapoor',
      'Mark Techson',
      'Bree Hall',
      'Devon Neill',
      'Madison Kanna',
      'Brooks Lybrand',
      'Dax Raad',
      'Eve Porcello',
      'Kira Corbett',
    ],
  },
  neon: {
    logo: (
      <Link href="https://neon.tech" target="_blank" rel="noopener noreferrer">
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
      </Link>
    ),
    speakers: ['Andre Landgraf'],
  },
  fathom: {
    logo: (
      <Link
        href="https://usefathom.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-32"
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
      </Link>
    ),
    speakers: ['Aaron Francis'],
  },
}
const getSponsorForSpeaker = (speakerSlug: string) => {
  for (const [sponsorKey, sponsor] of Object.entries(travelSponsors)) {
    // Check if any of the sponsor's speakers match when slugified
    if (sponsor.speakers.some((name) => slugify(name) === speakerSlug)) {
      return sponsor
    }
  }
  return null
}
