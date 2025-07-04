import React from 'react'
import Layout from 'components/app/layout'
import {Tip} from 'lib/tips'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {useResourceComplete} from '@skillrecordings/skill-lesson/hooks/use-resource-complete'
import Icon from 'components/icons'
import Balancer from 'react-wrap-balancer'
import {getAllConf24Talks, getAllTalks, Talk} from 'lib/talks'
import ResourceContributor from 'components/resource-contributor'
import {ConfLogo} from 'components/conf/conference-logo'
import {IS_PAST_CONF_24} from 'pages/conf/2024'
import {cn} from '@skillrecordings/ui/utils/cn'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {ConfLogo2025} from 'components/conf/conf-log-2025'

export async function getStaticProps() {
  const talks = await getAllTalks()

  // Filter talks by year based on _createdAt
  const conf24Talks = talks.filter((talk) => {
    const date = new Date(talk._createdAt || '')
    return date.getFullYear() === 2024
  })

  const conf25Talks = talks
    .filter((talk) => {
      const date = new Date(talk._createdAt || '')
      return date.getFullYear() === 2025
    })
    .sort((a, b) => {
      // Put 'of-things-epic' talk first
      if (a.slug === 'of-things-epic') return -1
      if (b.slug === 'of-things-epic') return 1

      // Sort remaining talks in ascending order (oldest to newest)
      return (
        new Date(a._createdAt || '').getTime() -
        new Date(b._createdAt || '').getTime()
      )
    })

  // Get remaining talks (not from 2024 or 2025)
  const otherTalks = talks.filter((talk) => {
    const date = new Date(talk._createdAt || '')
    return date.getFullYear() !== 2024 && date.getFullYear() !== 2025
  })

  return {
    props: {conf24Talks, conf25Talks, otherTalks},
    revalidate: 10,
  }
}

type TalksIndex = {
  conf24Talks: Talk[]
  conf25Talks: Talk[]
  otherTalks: Talk[]
}

const pageDescription = 'A Collection of Epic Web Development talks.'

const TalksIndex: React.FC<TalksIndex> = ({
  conf24Talks,
  conf25Talks,
  otherTalks,
}) => {
  return (
    <Layout
      meta={{
        title: `Epic Dev Talks`,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1711085322/talks-card_2x.png',
        },
      }}
      className="relative mx-auto flex w-full max-w-screen-lg grid-cols-12 flex-col gap-5 pb-0 md:grid md:px-5 md:pb-16 lg:px-0"
    >
      <header className="col-span-3 flex w-full flex-col items-center px-3 py-10 sm:items-start">
        <div className="relative flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/epic-web/image/upload/v1711021972/talks-h1_2x.png"
            width={200}
            height={200}
            className="rounded"
          />
          <h1 className="absolute text-4xl font-bold text-white">Talks</h1>
        </div>
        <h2 className="text-balance pt-3 font-medium sm:text-sm">
          {pageDescription}
        </h2>
      </header>
      <main className="relative z-10 col-span-9 flex w-full flex-col items-center gap-5 sm:py-10">
        {conf25Talks.length > 0 && (
          <div className="relative flex w-full flex-col overflow-hidden border-y bg-card py-5 sm:p-5 md:rounded md:border">
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 p-5 text-center md:flex-row md:justify-start md:gap-12 md:text-left">
              <Link href="/conf/2025">
                <ConfLogo2025 />
              </Link>
              <h3 className="text-balance text-lg sm:text-xl">
                Talks from{' '}
                <Link href="/conf/2025" className="font-bold hover:underline">
                  Epic Web Conf 2025
                </Link>
              </h3>
            </div>
            <ul className="relative z-10 flex w-full flex-col">
              {conf25Talks.map((talk, i) => (
                <TalkItem
                  thumbnailTime={18}
                  withBg={false}
                  talk={talk}
                  i={i}
                  key={talk.slug}
                />
              ))}
            </ul>
          </div>
        )}

        {conf24Talks.length > 0 && (
          <div className="relative flex w-full flex-col overflow-hidden border-y bg-card py-5 sm:p-5 md:rounded md:border">
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 p-5 text-center md:flex-row md:justify-start md:gap-12 md:text-left">
              <Link href="/conf/2024">
                <ConfLogo />
              </Link>
              <h3 className="text-balance text-lg sm:text-xl">
                Talks from{' '}
                <Link href="/conf/2024" className="font-bold hover:underline">
                  Epic Web Conf 2024
                </Link>
              </h3>
            </div>
            <ul className="relative z-10 flex w-full flex-col">
              {conf24Talks.map((talk, i) => (
                <TalkItem
                  thumbnailTime={18}
                  withBg={false}
                  talk={talk}
                  i={i}
                  key={talk.slug}
                />
              ))}
            </ul>
          </div>
        )}

        {otherTalks.length > 0 && (
          <div className="relative flex w-full flex-col overflow-hidden border-y bg-card py-5 sm:p-5 md:rounded md:border">
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 p-5 text-center md:flex-row md:justify-start md:gap-12 md:text-left">
              <h3 className="text-balance text-lg font-bold sm:text-xl">
                More Talks
              </h3>
            </div>
            <ul className="relative z-10 flex w-full flex-col">
              {otherTalks.map((talk, i) => (
                <TalkItem
                  thumbnailTime={18}
                  withBg={false}
                  talk={talk}
                  i={i}
                  key={talk.slug}
                />
              ))}
            </ul>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default TalksIndex

export const TalkItem: React.FC<{
  talk: Talk
  path?: string
  i: number
  withBg?: boolean
  thumbnailTime?: number
}> = ({talk, path = 'talks', withBg = true, thumbnailTime = 20, i}) => {
  const {title, slug} = talk
  const muxPlaybackId = talk?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=480&height=270&fit_mode=preserve&time=${thumbnailTime}`

  const {resourceCompleted} = useResourceComplete(talk.slug)

  return (
    <li key={slug}>
      <Link
        href={`/${path}/${talk.slug}`}
        className={cn(
          'group flex items-center gap-5 p-3.5 sm:p-5 md:gap-8 md:rounded',
          {
            'bg-card': i % 2 === 1 && withBg,
          },
        )}
        tabIndex={-1}
      >
        <div className="relative flex w-[100px] flex-shrink-0 items-center justify-center overflow-hidden rounded border sm:w-auto">
          <Image
            src={thumbnail}
            alt=""
            width={720 / 4}
            height={405 / 4}
            aria-hidden="true"
            className="rounded brightness-90 transition duration-300 group-hover:brightness-75 dark:brightness-50"
          />
          <div
            className="absolute flex items-center justify-center rounded-full text-white opacity-0 drop-shadow-xl duration-150 ease-in-out group-hover:opacity-100"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4 drop-shadow-md" name="Playmark" />
          </div>
        </div>
        <div>
          <h4 className="text-balance text-base font-semibold leading-tight sm:text-xl sm:leading-tight">
            {talk.title}
          </h4>
          {talk.presenter && (
            <ResourceContributor
              as="div"
              className="mt-3 gap-2 text-sm font-normal [&_img]:w-8"
              name={talk.presenter?.name}
              slug={talk.presenter?.slug}
              image={talk.presenter?.picture?.url}
            />
          )}
          {talk.oneTimeContributor && !talk.presenter && (
            <ResourceContributor
              name={talk.oneTimeContributor?.name as string}
              image={talk.oneTimeContributor?.picProfile as string}
              disableLink={true}
              as="div"
              className="mt-3 gap-2 text-sm font-normal [&_img]:w-8"
            />
          )}
        </div>
      </Link>
    </li>
  )
}

export const TipTeaser: React.FC<{tip: Tip}> = ({tip}) => {
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  const {resourceCompleted} = useResourceComplete(tip.slug)

  return (
    <article className="flex items-center gap-5 py-4">
      <header className="flex-shrink-0">
        <button
          onClick={() => {
            router
              .push({
                pathname: '/tips/[tip]',
                query: {
                  tip: tip.slug,
                },
              })
              .then(() => {
                const videoElement = document.getElementById(
                  'mux-player',
                ) as HTMLVideoElement
                return videoElement?.play()
              })
          }}
          className="group relative flex items-center justify-center overflow-hidden"
        >
          <span className="sr-only">
            Play {title}{' '}
            {resourceCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-16 items-center justify-center sm:w-auto">
            <Image
              src={thumbnail}
              alt=""
              width={240 / 1.5}
              height={135 / 1.5}
              aria-hidden="true"
              className="rounded brightness-75 transition duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
          <div
            className="absolute flex scale-50 items-center justify-center text-white opacity-100 transition"
            aria-hidden="true"
          >
            {resourceCompleted ? (
              <>
                <Icon
                  name="Checkmark"
                  className="absolute h-10 w-10 text-white transition group-hover:opacity-0"
                  aria-hidden="true"
                />
                <Icon
                  name="Playmark"
                  className="absolute h-8 w-8 text-white opacity-0 transition group-hover:opacity-100"
                />
              </>
            ) : (
              <Icon name="Playmark" className="h-8 w-8" />
            )}
          </div>
        </button>
      </header>
      <h2 className="font-bold leading-tight sm:text-lg">
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug,
            },
          }}
          className="inline-flex items-start gap-1 hover:underline"
        >
          <Balancer>{title}</Balancer>{' '}
          {resourceCompleted && <span className="sr-only">(watched)</span>}
        </Link>
      </h2>
    </article>
  )
}
