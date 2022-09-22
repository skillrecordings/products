import React from 'react'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {getAllTips, Tip} from 'lib/tips'
import Link from 'next/link'
import Image from 'next/image'
import {SanityDocument} from '@sanity/client'
import {PlayIcon} from '@heroicons/react/solid'

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const tips = await getAllTips()

  return {
    props: {tips},
  }
}

type TipsIndex = {
  tips: Tip[]
}

const pageDescription =
  'A collection of useful tips that you wish you knew when you started using TypeScript.'

const TipsIndex: React.FC<TipsIndex> = ({tips}) => {
  return tips ? (
    <Layout
      meta={{
        title: 'TypeScript Tips by Matt Pocock',
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1663845880/tips/card_2x_m0r0zl.png',
          alt: 'TypeScript Tips by Matt Pocock',
        },
      }}
    >
      <header className="pt-40 text-center flex flex-col items-center relative z-10">
        <h1 className="font-heading sm:text-5xl text-5xl font-bold text-center">
          TypeScript Tips
        </h1>
        <p className="max-w-sm pt-8 text-center text-lg text-rose-100/90">
          {pageDescription}
        </p>
      </header>
      <main className="pt-20 relative z-10 w-full max-w-screen-lg mx-auto grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-5 px-5">
        {tips.map((tip) => {
          return <TipTeaser tip={tip} key={tip.slug.current} />
        })}
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-sea-of-red-lines@2x.png')}
        objectPosition={'top'}
        className="object-cover -z-10"
      />
    </Layout>
  ) : null
}

export default TipsIndex

export const TipTeaser: React.FC<{tip: Tip}> = ({tip}) => {
  const {title} = tip
  const video = tip?.resources.find(
    (resource: SanityDocument) => resource._type === 'videoResource',
  )
  const thumbnail = `https://image.mux.com/${video.muxAsset.muxPlaybackId}/thumbnail.png?width=960&height=540&fit_mode=preserve`

  return (
    <article>
      <header>
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug.current,
            },
          }}
        >
          <a className="group relative flex items-center justify-center rounded-md overflow-hidden border border-gray-800">
            <span className="sr-only">{title}</span>
            <Image
              src={thumbnail}
              alt=""
              width={480}
              height={270}
              aria-hidden="true"
            />
            <div
              className="absolute w-full h-full left-0 top-0 bg-[#0F172A]/50 mix-blend-color"
              aria-hidden="true"
            />
            <div
              className="absolute w-full h-full left-0 top-0 bg-[#0B111F]/40 mix-blend-overlay group-hover:bg-orange-500/10 transition"
              aria-hidden="true"
            />
            <div
              className="absolute group-hover:opacity-100 opacity-0 transition scale-50 group-hover:scale-100 text-teal-400"
              aria-hidden="true"
            >
              <PlayIcon className="w-10 h-10" />
            </div>
          </a>
        </Link>
      </header>
      <h2 className="pt-4 text-lg font-medium leading-tight">
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug.current,
            },
          }}
        >
          <a>{title}</a>
        </Link>
      </h2>
    </article>
  )
}
