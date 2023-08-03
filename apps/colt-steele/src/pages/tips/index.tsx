import React from 'react'
import Layout from 'components/app/layout'
import {getAllTips, Tip} from 'lib/tips'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {useTipComplete} from '../../hooks/use-tip-complete'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import Header from 'components/app/header'

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

const pageDescription =
  'A collection of programming tips for your daily workflow.'

const TipsIndex: React.FC<TipsIndex> = ({tips}) => {
  return (
    <Layout
      meta={{
        title: `Colt Steele Tips`,
        description: pageDescription,
        openGraph: {
          images: [
            {
              url: 'https://res.cloudinary.com/dwppkb069/image/upload/v1684185486/ogImages/tips-ogimage_trnnf0.png',
              alt: 'Colt Steele Tips',
            },
          ],
        },
      }}
      className="flex flex-col items-center pb-8 lg:pb-24"
    >
      <Header title="Tips" subtitle={pageDescription} image="quote-2@2x.png" />
      <main className="relative z-10 mx-auto grid w-full max-w-screen-lg grid-cols-1 sm:gap-8 gap-5 px-5 md:grid-cols-2">
        {tips.map((tip) => {
          return <TipCard tip={tip} key={tip.slug} />
        })}
      </main>
    </Layout>
  )
}

export default TipsIndex

const TipCard: React.FC<{tip: Tip}> = ({tip}) => {
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve&time=1`

  const router = useRouter()
  const {tipCompleted} = useTipComplete(tip.slug)

  return (
    <article className="flex flex-col items-center overflow-hidden">
      <header className="relative flex aspect-video rounded overflow-hidden w-full flex-shrink-0 items-center justify-center border-b border-gray-100">
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
              className="brightness-90 transition duration-500 ease-in-out group-hover:scale-105 rounded"
            />
          </div>
          <div
            className="bg-white w-16 h-16 pl-1 group-hover:scale-100 scale-75 absolute flex items-center justify-center rounded-full text-black opacity-100 drop-shadow-xl duration-500 ease-in-out group-hover:opacity-100"
            aria-hidden="true"
          >
            <Icon name="Playmark" size="24" />
          </div>
          <div
            className="flex absolute bottom-3 right-3 items-center gap-2"
            aria-hidden="true"
          >
            {tipCompleted && (
              <div
                aria-hidden="true"
                className="inline-flex items-center gap-1 rounded-sm bg-white px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-gray-600"
              >
                <Icon name="Checkmark" className="h-3 w-3" />
                Watched
              </div>
            )}
          </div>
        </button>
      </header>
      <div className="flex h-full w-full flex-col items-start py-4">
        <h2 className="text-base font-semibold leading-tight sm:text-xl">
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
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve&time=1`

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
              className="brightness-90 transition duration-300 ease-in-out group-hover:scale-110"
            />
          </div>

          <div
            className="absolute w-12 h-12 rounded-full bg-white flex scale-50 items-center justify-center text-gray-900 opacity-100 transition"
            aria-hidden="true"
          >
            {tipCompleted ? (
              <Icon name="Checkmark" className="w-6 h-6 inline-block" />
            ) : (
              <Icon name="Playmark" className="h-5 w-5 ml-0.5" />
            )}
          </div>
        </button>
      </header>
      <h2 className="text-base font-bold leading-tight sm:text-lg">
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug,
            },
          }}
          className="inline-flex items-start leading-tight gap-1 hover:underline"
        >
          <Balancer>{title}</Balancer>{' '}
          {tipCompleted && <span className="sr-only">(watched)</span>}
        </Link>
      </h2>
    </article>
  )
}
