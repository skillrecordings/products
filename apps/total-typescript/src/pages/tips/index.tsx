import React from 'react'
import Layout from '@/components/app/layout'
import {getAllTips, type Tip} from '@/lib/tips'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import {useSearchBar} from '@/search-bar/use-search-bar'
import {SearchIcon} from '@heroicons/react/outline'
import Heading from '@/components/heading'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {CheckIcon} from 'lucide-react'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {formatDuration} from '@/utils/format-duration'
import {cn} from '@skillrecordings/ui/utils/cn'
import {formatDistance} from 'date-fns'

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
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1702041879/ts-tips-card_2x_i7sjje.png',
          alt: 'TypeScript Tips by Matt Pocock',
        },
      }}
      className="flex flex-col items-center pb-24"
    >
      <Heading title="TypeScript Tips" description={pageDescription} />
      <main className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col px-0 sm:px-5">
        <SearchBar totalCount={tips.length} />
        <div className="mt-16 flex flex-col divide-y divide-border border-y sm:border-x">
          {tips.map((tip) => {
            return <TipTeaser tip={tip} key={tip.slug} />
          })}
        </div>
      </main>
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
  const timeAgo =
    tip._createdAt && formatDistance(new Date(tip._createdAt), new Date())

  return (
    <Link
      href={{
        pathname: '/tips/[tip]',
        query: {
          tip: tip.slug,
        },
      }}
      onClick={() => {
        track('tip_clicked', {
          tip: tip.slug,
        })
      }}
      className="group"
    >
      <article className="flex items-center gap-5 transition ease-in-out group-hover:bg-white/5">
        <header className="flex-shrink-0">
          <div className="group relative flex items-center justify-center">
            <span className="sr-only">
              Play {title}{' '}
              {tipCompleted && <span className="sr-only">(completed)</span>}
            </span>
            <div className="relative flex h-full items-center justify-center border-r sm:w-auto">
              <Image
                src={thumbnail}
                alt=""
                width={240 / 1.5}
                height={135 / 1.5}
                aria-hidden="true"
                className="aspect-video"
              />
            </div>
            <div
              className="absolute left-0 top-0 h-full w-full bg-[#0F172A]/50  px-5 py-4 mix-blend-color"
              aria-hidden="true"
            />
            <div
              className="absolute left-0 top-0 h-full w-full bg-[#0B111F]/40 mix-blend-overlay transition group-hover:bg-orange-500/10"
              aria-hidden="true"
            />
            <div
              className="absolute flex scale-50 items-center justify-center text-gray-400 opacity-100 transition duration-300 ease-in-out group-hover:scale-[0.6] group-hover:text-gray-200 group-hover:opacity-100"
              aria-hidden="true"
            >
              {tipCompleted ? (
                <>
                  <CheckIcon
                    className="absolute h-8 w-8 text-teal-400 transition group-hover:opacity-0"
                    aria-hidden="true"
                  />
                  <Icon
                    name="Playmark"
                    className="absolute h-8 w-8 text-teal-400 opacity-0 transition group-hover:opacity-100"
                  />
                </>
              ) : (
                <Icon name="Playmark" className="h-8 w-8" />
              )}
            </div>
          </div>
        </header>
        <div className="flex w-full flex-col justify-between py-2 sm:flex-row sm:py-4 md:items-center">
          <h2 className="flex w-full pr-3 text-base font-medium leading-tight sm:pr-16 sm:text-lg lg:text-xl">
            <span className="text-balance">{title}</span>
            {tipCompleted && <span className="sr-only">(watched)</span>}
          </h2>
          {tip.duration && (
            <p className="flex flex-shrink-0 pr-10 text-xs opacity-50 transition ease-in-out group-hover:opacity-100 sm:text-sm">
              {formatDuration(tip.duration)}
              {/* ・ {timeAgo} ago */}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}

const SearchBar: React.FC<{totalCount: number}> = ({totalCount}) => {
  const {
    open: isSearchBarOpen,
    setOpen: setOpenSearchBar,
    setResourceType,
  } = useSearchBar()

  return (
    <button
      className="group relative mx-auto flex w-full max-w-sm items-center justify-between rounded-md border border-gray-800 bg-gray-950 px-4 py-3 before:absolute before:-top-px before:left-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-cyan-300 before:to-transparent before:opacity-50 before:content-['']"
      onClick={() => {
        setOpenSearchBar(!isSearchBarOpen)
        setResourceType('tip')
      }}
    >
      <div className="flex items-center gap-2">
        <SearchIcon
          className="h-3.5 w-3.5 opacity-80 transition group-hover:opacity-100"
          aria-hidden="true"
        />
        <span
          className={cn(
            'block opacity-50 transition group-hover:opacity-75 md:block lg:block',
            {},
          )}
        >
          Search through {totalCount} tips
        </span>
      </div>
      <kbd
        className="-mb-0.5 hidden items-center gap-0.5 rounded px-1 font-mono text-xs font-semibold text-gray-300 md:flex"
        aria-label="shortcut"
      >
        <span>⌘</span>
        <span>K</span>
      </kbd>
    </button>
  )
}
