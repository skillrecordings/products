import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import slugify from '@sindresorhus/slugify'
import Layout from 'components/app/layout'
import {BuyTicketsCTA, type Speaker} from './index'
import {cn} from '@skillrecordings/ui/utils/cn'
import formatInTimeZone from 'date-fns-tz/formatInTimeZone'
import ReactMarkdown from 'react-markdown'
import {CopyToClipboard, Twitter} from '@skillrecordings/react'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {ChevronLeftIcon} from '@heroicons/react/outline'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())

  const speaker: Speaker = speakers.find((speaker: Speaker) => {
    return slugify(speaker.fullName) === params?.speaker
  })

  const sessions = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Sessions',
  ).then((res) => res.json())

  const fullSpeakerSessions = getSessionDetailsForSpeaker(sessions, speaker.id)

  return {
    props: {
      speaker: {...speaker, sessions: fullSpeakerSessions} || null,
    },
    revalidate: 60 * 15,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/epg94f49/view/Speakers',
  ).then((res) => res.json())

  return {
    paths: speakers.map((speaker: Speaker) => ({
      params: {
        speaker: slugify(speaker.fullName),
      },
    })),
    fallback: true,
  }
}

const ConfSpeaker: React.FC<{
  speaker: Omit<Speaker, 'sessions'> & {sessions: Session[]}
}> = ({speaker}) => {
  const router = useRouter()
  const shareUrl = process.env.NEXT_PUBLIC_URL + '/conf/' + router.query.speaker

  return (
    <Layout
      className="overflow-x-hidden"
      meta={{
        title: `${speaker.fullName} is speaking at Epic Web Conf 2024`,
      }}
    >
      <main className="relative mx-auto w-full max-w-screen-lg px-5 pt-20">
        <BgGraphic className="absolute -right-48 -top-48 -z-10" />
        <div className="absolute -right-48 -top-1/2 h-[600px] w-[600px] rounded-full bg-[#93A1D7] opacity-30 blur-[500px]" />
        <div>
          <Link
            href="/conf#speakers"
            className="mb-5 flex items-center gap-1 text-sm opacity-75 transition hover:underline hover:opacity-100"
          >
            <ChevronLeftIcon className="w-4" aria-hidden="true" /> Speakers
          </Link>
          <h1 className="text-5xl font-bold">{speaker.fullName}</h1>
          <h2 className="pt-4 text-2xl text-[#93A1D7]">{speaker.tagLine}</h2>
        </div>
        <div className="mt-14 flex w-full justify-between gap-10">
          <div className="flex w-full max-w-[280px] flex-col gap-16">
            <div>
              <h3 className="flex border-b pb-2 text-xl font-semibold">
                Keynotes
              </h3>
              <ul className="mt-5">
                {speaker.sessions &&
                  speaker.sessions.map((session) => {
                    return (
                      <li className="flex flex-col" key={session.id}>
                        <div className="text-[#93A1D7]">
                          {formatInTimeZone(
                            session.startsAt,
                            'America/Los_Angeles',
                            'h:mm a',
                          )}
                          —
                          {formatInTimeZone(
                            session.endsAt,
                            'America/Los_Angeles',
                            'h:mm a',
                          )}
                        </div>
                        <div>{session.title}</div>
                      </li>
                    )
                  })}
              </ul>
            </div>
            <div>
              <h3 className="flex border-b pb-2 text-xl font-semibold">Bio</h3>
              <ReactMarkdown className="prose prose-sm prose-invert mt-3 prose-p:text-[#D6DEFF]">
                {speaker.bio}
              </ReactMarkdown>
            </div>
            <div>
              <h3 className="flex border-b pb-2 text-xl font-semibold">
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
          <div className="flex h-full w-full flex-col gap-7">
            <div className="aspect-video h-full w-full max-w-[670px] rounded border bg-gray-900"></div>
            <div>
              <h3 className="flex border-b pb-2 text-xl font-semibold">
                Transcript
              </h3>
            </div>
          </div>
        </div>
        <BuyTicketsCTA />
      </main>
    </Layout>
  )
}

export default ConfSpeaker

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

const BgGraphic: React.FC<{className?: string}> = ({className}) => {
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
