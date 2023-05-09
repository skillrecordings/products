import React from 'react'
import Layout from 'layouts'
import {getAllTips, type Tip} from 'lib/tips'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import Icon from 'components/icons'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'

export async function getStaticProps() {
  const tips = await getAllTips()
  return {
    props: {tips},
    revalidate: 10,
  }
}

type TipsIndex = {
  tips: Tip[]
}

const pageDescription = 'A collection of valuable tips.'

const TipsIndex: React.FC<TipsIndex> = ({tips}) => {
  return (
    <Layout
      meta={{
        title: `ScriptKit Tips by ${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
        description: pageDescription,
      }}
    >
      <header className="relative z-10 flex flex-col items-center px-5 pb-16 text-center">
        <h1 className="font-heading text-center text-4xl font-black sm:text-5xl lg:text-6xl">
          Tips
        </h1>
        <p className="max-w-md pt-8 text-center text-lg text-gray-600 lg:text-xl">
          {pageDescription}
        </p>
      </header>
      <main className="relative z-10 mx-auto grid w-full max-w-screen-lg grid-cols-1 gap-5 px-5 md:grid-cols-2">
        {tips.map((tip) => {
          return <TipCard tip={tip} key={tip.slug} />
        })}
      </main>
    </Layout>
  )
}

export default TipsIndex

const TipCard: React.FC<{tip: Tip}> = ({tip}) => {
  const {title} = tip
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${
    tip?.videoResourceId
  }`
  const router = useRouter()
  const {tipCompleted} = useTipComplete(tip.slug)

  return (
    <article className="flex flex-col items-center overflow-hidden rounded-xl border border-gray-900">
      <header className="relative flex aspect-video w-full flex-shrink-0 items-center justify-center border-b border-gray-900">
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
          <div className="font-heading rounded-full bg-amber-100 px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-amber-500">
            Tip
          </div>
        </div>
        <h2 className="pt-2 text-base font-semibold leading-tight text-white sm:text-xl">
          <Link
            href={{
              pathname: '/tips/[tip]',
              query: {
                tip: tip.slug,
              },
            }}
            className="inline-flex items-start gap-1 hover:underline"
          >
            {title} {tipCompleted && <span className="sr-only">(watched)</span>}
          </Link>
        </h2>
      </div>
    </article>
  )
}

export const TipTeaser: React.FC<{tip: Tip}> = ({tip}) => {
  const {title} = tip
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${
    tip?.videoResourceId
  }`
  const router = useRouter()
  const {tipCompleted} = useTipComplete(tip.slug)

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
          className="group relative flex items-center justify-center overflow-hidden rounded shadow-xl shadow-gray-500/20"
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
              className="brightness-75 transition duration-300 ease-in-out group-hover:scale-110"
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
      <h2 className="font-bold leading-tight text-black sm:text-lg">
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug,
            },
          }}
          className="inline-flex items-start gap-1 hover:underline"
        >
          {title} {tipCompleted && <span className="sr-only">(watched)</span>}
        </Link>
      </h2>
    </article>
  )
}
