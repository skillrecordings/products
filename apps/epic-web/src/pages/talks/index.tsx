import React from 'react'
import Layout from 'components/app/layout'
import {getAllTips, Tip} from 'lib/tips'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import Icon from 'components/icons'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import Balancer from 'react-wrap-balancer'
import {getAllTalks, Talk} from 'lib/talks'
import ResourceAuthor from 'components/resource-author'

export async function getStaticProps() {
  const talks = await getAllTalks()
  return {
    props: {talks},
    revalidate: 10,
  }
}

type TalksIndex = {
  talks: Talk[]
}

const pageDescription = 'A collection of Web Development talks.'

const TalksIndex: React.FC<TalksIndex> = ({talks}) => {
  return (
    <Layout
      meta={{
        title: `Epic Dev Talks`,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1705611435/epicweb.dev/og/card-talks_2x.png',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 py-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          Epic Dev Talks
        </h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-500">
          <Balancer>{pageDescription}</Balancer>
        </h2>
      </header>
      <main className="relative z-10 flex flex-col items-center justify-center pb-8 md:pb-5">
        <div className="mx-auto grid w-full max-w-screen-lg grid-cols-1 gap-5 px-5 md:grid-cols-2">
          {talks.map((talk) => {
            return <TalkCard talk={talk} key={talk.slug} />
          })}
        </div>
      </main>
    </Layout>
  )
}

export default TalksIndex

const TalkCard: React.FC<{talk: Talk}> = ({talk}) => {
  const {title} = talk
  const muxPlaybackId = talk?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve&time=0`
  // const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${
  //   tip?.videoResourceId
  // }`
  const router = useRouter()
  const {tipCompleted} = useTipComplete(talk.slug)

  return (
    <article className="flex flex-col items-center overflow-hidden rounded-xl border border-transparent bg-white shadow-2xl shadow-gray-500/20 dark:border-gray-800 dark:bg-transparent dark:shadow-black/50">
      <header className="relative flex aspect-video w-full flex-shrink-0 items-center justify-center border-b border-transparent dark:border-gray-800">
        <button
          onClick={() => {
            router
              .push({
                pathname: '/talks/[talk]',
                query: {
                  talk: talk.slug,
                },
              })
              .then(() => {
                const videoElement = document.getElementById(
                  'mux-player',
                ) as HTMLVideoElement
                return videoElement?.play()
              })
          }}
          className="group  flex items-center justify-center"
        >
          <span className="sr-only">
            Play {title}{' '}
            {tipCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-full items-center justify-center">
            <Image
              src={thumbnail}
              alt=""
              objectFit="cover"
              layout="fill"
              aria-hidden="true"
              className="brightness-90 transition duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
          <div
            className="absolute flex items-center justify-center rounded-full text-white opacity-100 drop-shadow-xl duration-500 ease-in-out group-hover:opacity-100"
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" name="Playmark" />
          </div>
        </button>
      </header>
      <div className="flex h-full w-full flex-col items-start p-8">
        <div className="flex items-center gap-2" aria-hidden="true">
          {tipCompleted && (
            <div className="font-heading rounded-full bg-gray-100 px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-gray-500">
              Watched
            </div>
          )}
          <div className="font-heading rounded-full bg-sky-400/20 px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-sky-600 dark:text-sky-400">
            Talk
          </div>
        </div>
        <h2 className="pt-2 text-base font-semibold leading-tight sm:text-xl">
          <Link
            href={{
              pathname: '/talks/[talk]',
              query: {
                talk: talk.slug,
              },
            }}
            className="inline-flex items-start gap-1 hover:underline"
          >
            {title} {tipCompleted && <span className="sr-only">(watched)</span>}
          </Link>
        </h2>
        <ResourceAuthor
          name={talk?.author?.name}
          slug={talk?.author?.slug}
          image={talk.author?.image}
          as="div"
          className="mt-3 gap-2 text-sm font-normal opacity-75 [&_img]:w-8"
        />
      </div>
    </article>
  )
}

export const TipTeaser: React.FC<{tip: Tip}> = ({tip}) => {
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  const {tipCompleted} = useTipComplete(tip.slug)
  // const tipCompleted = false

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
            {tipCompleted && <span className="sr-only">(completed)</span>}
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
            {tipCompleted ? (
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
          {tipCompleted && <span className="sr-only">(watched)</span>}
        </Link>
      </h2>
    </article>
  )
}
