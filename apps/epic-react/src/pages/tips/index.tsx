import React from 'react'
import Layout from '@/components/app/layout'
import {getAllTips, Tip} from '@/lib/tips'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {useResourceComplete} from '@skillrecordings/skill-lesson/hooks/use-resource-complete'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import Balancer from 'react-wrap-balancer'
import {Card, CardContent, CardHeader} from '@skillrecordings/ui'
import {CheckIcon} from '@heroicons/react/solid'
import {cn} from '@skillrecordings/ui/utils/cn'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

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
  'A collection of useful tips that you wish you knew when you started using React.'

const TipsIndex: React.FC<TipsIndex> = ({tips}) => {
  const {subscriber} = useConvertkit()
  return (
    <Layout
      meta={{
        title: `Epic React Dev Tips`,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1704808424/card-tips_2x.png',
          alt: 'Epic React Dev Tips',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 py-16 text-center">
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="flex flex-col text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            <span className="mb-2 inline-block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-xl uppercase tracking-widest text-transparent dark:from-blue-300 dark:to-blue-500">
              Free
            </span>{' '}
            Epic React Tips
          </h1>
          <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
            <Balancer>{pageDescription}</Balancer>
          </h2>
        </div>
      </header>
      <main className="relative z-10 flex flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-0 sm:gap-3 sm:px-5">
          {tips
            .filter(({state}) => state === 'published')
            .map((tip, i) => {
              return <TipCard tip={tip} key={tip.slug} i={i} />
            })}
        </div>

        {!subscriber && <PrimaryNewsletterCta className="mt-32" />}
      </main>
    </Layout>
  )
}

export default TipsIndex

const TipCard: React.FC<{tip: Tip; i: number}> = ({tip, i}) => {
  const {title} = tip
  const muxPlaybackId = tip?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  const {resourceCompleted} = useResourceComplete(tip.slug)

  return (
    <Link
      className={cn(
        'group relative flex flex-row items-center overflow-hidden rounded',
        {
          'rounded-md border bg-white shadow-2xl shadow-gray-500/20 transition dark:bg-card dark:shadow-none':
            i % 2 === 0,
        },
      )}
      href={{
        pathname: '/tips/[tip]',
        query: {
          tip: tip.slug,
        },
      }}
    >
      <CardHeader className="relative hidden aspect-video w-full max-w-[100px] items-center justify-center sm:flex sm:max-w-[200px]">
        <div className=" flex items-center justify-center">
          <span className="sr-only">
            Play {title}{' '}
            {resourceCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-full items-center justify-center">
            <Image
              src={thumbnail}
              alt=""
              objectFit="cover"
              layout="fill"
              aria-hidden="true"
              className="brightness-90 transition duration-300 group-hover:brightness-75 dark:brightness-50"
            />
          </div>
          <div
            className="absolute flex items-center justify-center rounded-full text-white opacity-100 drop-shadow-xl duration-500 ease-in-out group-hover:opacity-100"
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" name="Playmark" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full flex-col px-6  py-4">
        <div
          className="absolute right-5 top-5 z-20 flex items-center gap-2"
          aria-hidden="true"
        >
          {resourceCompleted && (
            <CheckIcon className="w-4" aria-label="Watched" />
          )}
        </div>
        <h2 className="text-base font-semibold leading-tight sm:text-lg">
          {title}{' '}
          {resourceCompleted && <span className="sr-only">(watched)</span>}
        </h2>
      </CardContent>
    </Link>
  )
}

export const TipTeaser: React.FC<{tip: Tip}> = ({tip}) => {
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  const {resourceCompleted} = useResourceComplete(tip.slug)

  return (
    <li className="flex w-full flex-col pb-5">
      <Link
        href={{
          pathname: '/tips/[tip]',
          query: {
            tip: tip.slug,
          },
        }}
        className="group"
      >
        <div className="relative flex items-center justify-center overflow-hidden rounded border">
          <span className="sr-only">
            Play {title}{' '}
            {resourceCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-full items-center justify-center">
            <Image
              src={thumbnail}
              alt=""
              width={240 * 2}
              height={135 * 2}
              aria-hidden="true"
              className="brightness-90 transition duration-300 ease-in-out group-hover:brightness-100 dark:brightness-75 "
            />
          </div>
          <div
            className="absolute flex scale-50 items-center justify-center rounded-full bg-white p-4 text-foreground opacity-100 transition dark:bg-background"
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
              <Icon
                name="Playmark"
                className="relative h-6 w-6 translate-x-0.5"
              />
            )}
          </div>
        </div>
        <h3 className="w-full pt-1 font-semibold leading-tight">
          <Balancer>{title}</Balancer>
          {resourceCompleted && <span className="sr-only">(watched)</span>}
        </h3>
      </Link>
    </li>
  )
}
