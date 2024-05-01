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
        {conf24Talks && (
          <div className="relative flex w-full flex-col overflow-hidden border-y bg-card py-5 sm:p-5 md:rounded md:border">
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 p-5 text-center md:flex-row md:justify-start md:gap-12 md:text-left">
              <Link href="/conf">
                <ConfLogo />
              </Link>
              <h3 className="text-balance text-lg sm:text-xl">
                Talks from{' '}
                <Link href="/conf" className="font-bold hover:underline">
                  Epic Web Conf 2024
                </Link>
              </h3>
            </div>
            <ul className="relative z-10 flex w-full flex-col">
              {conf24Talks.map((confTalk, i) => (
                <TalkItem
                  thumbnailTime={18}
                  withBg={false}
                  talk={confTalk}
                  i={i}
                  key={confTalk.slug}
                />
              ))}
            </ul>
          </div>
        )}
        <ul className="flex w-full flex-col">
          {talks
            .filter(
              (talk) =>
                !conf24Talks?.some((confTalk) => confTalk.slug === talk.slug),
            )
            .map((talk, i) => (
              <TalkItem talk={talk} i={i} key={talk.slug} />
            ))}
        </ul>
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
}> = ({talk, path = 'talks', withBg = true, thumbnailTime = 0, i}) => {
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
          {talk.oneTimeContributor && (
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
