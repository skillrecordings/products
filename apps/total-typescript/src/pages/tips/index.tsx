import React from 'react'
import Layout from 'components/app/layout'
import {getAllTips, Tip} from 'lib/tips'
import Link from 'next/link'
import Image from 'next/image'
import {CheckCircleIcon, PlayIcon} from '@heroicons/react/solid'
import {useRouter} from 'next/router'
import {useTipComplete} from '../../hooks/use-tip-complete'

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
  'A collection of useful tips that you wish you knew when you started using TypeScript.'

const TipsIndex: React.FC<TipsIndex> = ({tips}) => {
  return (
    <Layout
      meta={{
        title: 'TypeScript Tips by Matt Pocock',
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1663921088/tips/card_2x_b9zrcx.png',
          alt: 'TypeScript Tips by Matt Pocock',
        },
      }}
      className="flex flex-col items-center pb-24"
    >
      <header className="relative z-10 flex flex-col items-center pt-28 pb-16 text-center sm:pt-32 lg:pt-40 lg:pb-24">
        <h1 className="text-center font-heading text-4xl font-bold sm:text-5xl">
          TypeScript Tips
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-rose-100/90">
          {pageDescription}
        </p>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-screen-md flex-col divide-y divide-gray-800 rounded-lg bg-black/30 px-3 sm:px-5">
        {tips.map((tip) => {
          return <TipTeaser tip={tip} key={tip.slug} />
        })}
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
    </Layout>
  )
}

export default TipsIndex

export const TipTeaser: React.FC<{tip: Tip}> = ({tip}) => {
  const {title} = tip
  const muxPlaybackId = tip?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=240&height=135&fit_mode=preserve`
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
          className="group relative flex items-center justify-center overflow-hidden rounded border border-gray-800"
        >
          <span className="sr-only">
            Play {title}{' '}
            {tipCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-16 items-center justify-center sm:w-auto">
            <Image
              src={thumbnail}
              alt=""
              width={240 / 2}
              height={135 / 2}
              aria-hidden="true"
            />
          </div>
          <div
            className="absolute left-0 top-0 h-full w-full bg-[#0F172A]/50 mix-blend-color"
            aria-hidden="true"
          />
          <div
            className="absolute left-0 top-0 h-full w-full bg-[#0B111F]/40 mix-blend-overlay transition group-hover:bg-orange-500/10"
            aria-hidden="true"
          />
          <div
            className="absolute flex scale-50 items-center justify-center text-gray-400 opacity-100 transition group-hover:scale-75 group-hover:text-gray-200 group-hover:opacity-100"
            aria-hidden="true"
          >
            {tipCompleted ? (
              <>
                <CheckCircleIcon
                  className="absolute h-12 w-12 text-teal-400 transition group-hover:opacity-0"
                  aria-hidden="true"
                />
                <PlayIcon className="absolute h-12 w-12 text-teal-400 opacity-0 transition group-hover:opacity-100" />
              </>
            ) : (
              <PlayIcon className="h-12 w-12" />
            )}
          </div>
        </button>
      </header>
      <h2 className="text-base font-medium leading-tight sm:text-xl">
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug,
            },
          }}
        >
          <a className="inline-flex items-start gap-1 hover:underline">
            {title} {tipCompleted && <span className="sr-only">(watched)</span>}
          </a>
        </Link>
      </h2>
    </article>
  )
}
