import React from 'react'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {getAllTips, Tip} from 'lib/tips'
import Link from 'next/link'
import Image from 'next/image'
import {SanityDocument} from '@sanity/client'
import {PlayIcon} from '@heroicons/react/solid'
import {useRouter} from 'next/router'

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
      <header className="lg:pt-40 sm:pt-32 pt-28 lg:pb-24 pb-16 text-center flex flex-col items-center relative z-10">
        <h1 className="font-heading sm:text-5xl text-4xl font-bold text-center">
          TypeScript Tips
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-rose-100/90">
          {pageDescription}
        </p>
      </header>
      <main className="rounded-lg relative z-10 w-full max-w-screen-md mx-auto flex flex-col divide-y divide-gray-800 sm:px-5 px-3 bg-black/30">
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
        className="object-contain -z-10"
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

  return (
    <article className="flex items-center py-4 gap-5">
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
          className=" group relative flex items-center justify-center rounded overflow-hidden border border-gray-800"
        >
          <span className="sr-only">Play {title}</span>
          <div className="flex items-center justify-center sm:w-auto w-16">
            <Image
              src={thumbnail}
              alt=""
              width={240 / 2}
              height={135 / 2}
              aria-hidden="true"
            />
          </div>
          <div
            className="absolute w-full h-full left-0 top-0 bg-[#0F172A]/50 mix-blend-color"
            aria-hidden="true"
          />
          <div
            className="absolute w-full h-full left-0 top-0 bg-[#0B111F]/40 mix-blend-overlay group-hover:bg-orange-500/10 transition"
            aria-hidden="true"
          />
          <div
            className="absolute group-hover:opacity-100 opacity-100 transition scale-50 group-hover:scale-75 text-gray-400 group-hover:text-gray-200"
            aria-hidden="true"
          >
            <PlayIcon className="w-10 h-10" />
          </div>
        </button>
      </header>
      <h2 className="sm:text-xl text-base font-medium leading-tight">
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug,
            },
          }}
        >
          <a className="hover:underline">{title}</a>
        </Link>
      </h2>
    </article>
  )
}
