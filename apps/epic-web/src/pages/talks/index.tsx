import React from 'react'
import Layout from 'components/app/layout'
import {Tip} from 'lib/tips'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import Icon from 'components/icons'
import Balancer from 'react-wrap-balancer'
import {getAllConf24Talks, getAllTalks, Talk} from 'lib/talks'
import ResourceContributor from 'components/resource-contributor'
import {ConfLogo, IS_PAST_CONF_24} from 'pages/conf'
import {cn} from '@skillrecordings/ui/utils/cn'

export async function getStaticProps() {
  let conf24Talks = null
  if (IS_PAST_CONF_24) {
    conf24Talks = await getAllConf24Talks()
  }
  const talks = await getAllTalks()
  return {
    props: {talks, conf24Talks},
    revalidate: 10,
  }
}

type TalksIndex = {
  talks: Talk[]
  conf24Talks: Talk[] | null
}

const pageDescription = 'A Collection of Epic Web Development talks.'

const TalksIndex: React.FC<TalksIndex> = ({talks, conf24Talks}) => {
  return (
    <Layout
      meta={{
        title: `Epic Dev Talks`,
        description: pageDescription,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1705611435/epicweb.dev/og/card-talks_2x.png',
        },
      }}
      className="relative mx-auto flex w-full max-w-screen-lg grid-cols-12 flex-col gap-5 pb-0 md:grid md:px-5 md:pb-16 lg:px-0"
    >
      <header className="col-span-3 flex w-full flex-col items-start px-3 py-10">
        <div className="relative flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/epic-web/image/upload/v1711021972/talks-h1_2x.png"
            width={200}
            height={200}
            className="rounded"
          />
          <h1 className="absolute text-4xl font-bold text-white">Talks</h1>
        </div>
        <h2 className="text-balance pt-3 text-sm font-medium">
          {pageDescription}
        </h2>
      </header>
      <main className="relative z-10 col-span-9 flex w-full flex-col items-center gap-5 py-10">
        {conf24Talks && (
          <div className="relative flex w-full flex-col overflow-hidden rounded border bg-card p-5">
            <div className="relative z-10 flex w-full items-center gap-4 p-5 md:gap-12">
              <Link href="/conf">
                <ConfLogo />
              </Link>
              <h2 className="text-xl">
                Talks from{' '}
                <Link href="/conf" className="font-bold hover:underline">
                  Epic Web Conf 2024
                </Link>
              </h2>
            </div>
            <ul className="relative z-10 flex w-full flex-col">
              {conf24Talks.map((talk, i) => {
                return (
                  <TalkItem withBg={false} talk={talk} i={i} key={talk.slug} />
                )
              })}
            </ul>
          </div>
        )}
        <ul className="flex w-full flex-col">
          {talks.map((talk, i) => {
            return <TalkItem talk={talk} i={i} key={talk.slug} />
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default TalksIndex

const TalkItem: React.FC<{
  talk: Talk
  path?: string
  i: number
  withBg?: boolean
}> = ({talk, path = 'talks', withBg = true, i}) => {
  const {title, slug} = talk
  const muxPlaybackId = talk?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=480&height=270&fit_mode=preserve&time=0`

  const {tipCompleted} = useTipComplete(talk.slug)

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
        <div className="relative flex items-center justify-center overflow-hidden rounded border">
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
          <h3 className="text-xl font-semibold">{talk.title}</h3>
          <ResourceContributor
            name={talk?.author?.name}
            slug={talk?.author?.slug}
            image={talk.author?.image}
            as="div"
            className="mt-3 gap-2 text-sm font-normal [&_img]:w-8"
          />
        </div>
      </Link>
    </li>
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
