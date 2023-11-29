import React from 'react'
import cx from 'classnames'
import Layout from 'components/app/layout'
import MuxPlayer, {
  MuxPlayerProps,
  MuxPlayerRefAttributes,
} from '@mux/mux-player-react'
import {Tip} from 'lib/tips'

import {TipTeaser} from 'pages/tips'
import {useRouter} from 'next/router'
import {
  XIcon,
  ChatAltIcon,
  PlayIcon,
  CheckCircleIcon,
  MailIcon,
} from '@heroicons/react/solid'
import {shuffle, take} from 'lodash'
import {track} from '../utils/analytics'
import Image from 'next/legacy/image'
import {getOgImage} from 'utils/get-og-image'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import {localProgressDb} from '@skillrecordings/skill-lesson/utils/dexie'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {ArticleJsonLd, VideoJsonLd} from '@skillrecordings/next-seo'
import Icon from 'components/icons'
import {
  useMuxPlayer,
  VideoProvider,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {trpc} from 'trpc/trpc.client'
import {portableTextComponents} from '@skillrecordings/skill-lesson/portable-text'
import Spinner from 'components/spinner'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import {Talk} from 'lib/talks'
import Link from 'next/link'

const TalkTemplate: React.FC<{
  talk: Talk
  talkBodySerialized: MDXRemoteSerializeResult
  talks: Talk[]
  transcript: string
}> = ({talk, talkBodySerialized, talks}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const {tipCompleted} = useTipComplete(talk.slug)
  const {videoResourceId} = useVideoResource()

  const ogImage = getOgImage({
    title: talk.title,
    type: 'video',
    image: `${process.env.NEXT_PUBLIC_URL}/api/video-thumb?videoResourceId=${videoResourceId}`,
  })

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: talk.slug,
        module: 'talks',
        location: 'below talk video',
        moduleType: 'talk',
        lessonType: 'talk',
      })
      router.push(redirectUrl).then(() => {
        router.reload()
      })
    }
  }

  const handleVideoEnded = async () => {
    await localProgressDb.progress
      .add({
        eventName: 'completed video',
        module: 'talks',
        lesson: talk.slug,
        createdOn: new Date(),
      })
      .then(console.debug)
  }

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      onEnded={handleVideoEnded}
      exerciseSlug={talk.slug}
      path="/talks"
    >
      <ArticleJsonLd
        url={`${process.env.NEXT_PUBLIC_URL}/talks/${talk.slug}`}
        title={talk.title || 'talk'}
        images={[
          `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
        ]}
        datePublished={talk._updatedAt || new Date().toISOString()}
        authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
        description={talk.description || 'Epic Web Talk'}
      />
      <VideoJsonLd
        name={talk.title || 'talk'}
        description={talk.description || 'Epic Web Talk'}
        uploadDate={talk._updatedAt || new Date().toISOString()}
        thumbnailUrls={[
          `https://image.mux.com/${talk.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`,
        ]}
        contentUrl={`https://stream.mux.com/${talk.muxPlaybackId}/medium.mp4`}
      />
      <Layout
        meta={{
          title: talk.title,
          ogImage,
          description: talk.description ?? '',
        }}
        navigationClassName="max-w-screen-xl dark:border-transparent border-transparent"
      >
        <main className="mx-auto w-full pt-0" id="talk">
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex w-full max-w-screen-xl flex-col">
              <Video ref={muxPlayerRef} talks={talks} />
              {!subscriber && !loadingSubscriber && (
                <SubscribeForm handleOnSuccess={handleOnSuccess} />
              )}
            </div>
          </div>
          <article className=" relative z-10 border-l border-transparent px-5 pb-16 pt-8 sm:pt-10 xl:border-gray-800 xl:pt-10">
            <div className="mx-auto w-full max-w-screen-md pb-5">
              <div className="flex w-full flex-col gap-0 sm:gap-10 ">
                <div className="">
                  <Link
                    href="/talks"
                    passHref
                    className="mb-3 block text-sm opacity-75 transition hover:opacity-100"
                  >
                    ← All Talks
                  </Link>
                  <h1 className="font-heading inline-flex w-full max-w-2xl items-baseline text-3xl font-black lg:text-4xl">
                    {talk.title}
                    {tipCompleted && <span className="sr-only">(watched)</span>}
                  </h1>
                  {tipCompleted ? (
                    <div
                      aria-hidden="true"
                      className="flex items-center gap-1 pb-[20px] pt-6"
                    >
                      <Icon
                        name="Checkmark"
                        className="h-5 w-5 text-emerald-600"
                      />
                      <span className="font-heading text-sm font-black uppercase text-emerald-600 opacity-90">
                        Watched
                      </span>
                    </div>
                  ) : (
                    <Hr
                      className={
                        tipCompleted
                          ? 'bg-emerald-400'
                          : 'bg-indigo-500 dark:bg-indigo-400'
                      }
                    />
                  )}
                  {talk.body && (
                    <>
                      <div className="prose w-full max-w-none pb-5 pt-5 dark:prose-invert lg:prose-lg">
                        <MDX contents={talkBodySerialized} />
                      </div>
                    </>
                  )}
                  {talk.transcript && (
                    <div className="w-full pt-8">
                      <VideoTranscript transcript={talk.transcript} />
                    </div>
                  )}
                </div>
                {/* <div className="col-span-2"> */}
                {/* TODO: might want to add summary? */}
                {/* {talk.body && <RelatedTips currentTip={tip} tips={tips} />} */}
                {/* </div> */}
              </div>
            </div>
            {/* <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-10 sm:pt-10 md:flex-row">
              {talk.transcript && !talk.body && (
                <div className="w-full max-w-2xl pt-5">
                  <VideoTranscript transcript={talk.transcript} />
                </div>
              )} */}
            {/* {!tip.body && <RelatedTips currentTip={tip} tips={tips} />} */}
            {/* </div> */}
          </article>
        </main>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(({talks}, ref: any) => {
  const {muxPlayerProps, displayOverlay} = useMuxPlayer()
  const {videoResource} = useVideoResource()

  return (
    <div className="relative">
      {displayOverlay && <TipOverlay talks={talks} />}
      <div
        className={cx(
          'flex items-center justify-center  overflow-hidden shadow-gray-600/40 sm:shadow-2xl xl:rounded-b-md',
          {
            hidden: displayOverlay,
          },
        )}
      >
        <MuxPlayer
          ref={ref}
          {...(muxPlayerProps as MuxPlayerProps)}
          playbackId={videoResource?.muxPlaybackId}
        />
      </div>
    </div>
  )
})

const RelatedTips: React.FC<{tips: Tip[]; currentTip: Tip}> = ({
  currentTip,
  tips,
}) => {
  return (
    <section className="mx-auto h-full w-full md:pl-3">
      <h2 className="font-heading pt-2 text-2xl font-black">More Tips</h2>
      <div className="flex flex-col pt-4">
        {tips
          .filter((tip) => tip.slug !== currentTip.slug)
          .map((tip) => {
            return <TipTeaser key={tip.slug} tip={tip} />
          })}
      </div>
    </section>
  )
}

const Hr: React.FC<{className?: string}> = ({className}) => {
  return <div className={cx('my-8 h-1 w-8', className)} aria-hidden="true" />
}

const TipOverlay: React.FC<{talks: Talk[]}> = ({talks}) => {
  const {setDisplayOverlay, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  const buttonStyles =
    'py-2 px-3 font-medium rounded-md flex items-center gap-1 hover:bg-gray-700 bg-gray-800 transition text-gray-200'
  return (
    <div
      id="video-overlay"
      className="relative left-0 top-0 flex w-full items-center justify-center bg-gray-950 dark:bg-black/40 lg:aspect-video xl:rounded-md"
    >
      <div className="absolute right-8 top-8 z-50 flex items-center justify-center gap-3">
        <button className={buttonStyles} onClick={handlePlay}>
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            track('dismissed video overlay', {
              lesson: lesson.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            setDisplayOverlay(false)
          }}
        >
          Dismiss <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="ft-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center p-2 text-center text-lg leading-relaxed lg:absolute">
        {/* <ShareTip lesson={tip} /> */}
        <div className="grid h-full w-full grid-cols-1 items-center justify-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {take(
            shuffle(
              talks.filter(
                (suggestedTalk) => suggestedTalk.slug !== lesson.slug,
              ),
            ),
            9,
          ).map((talk) => (
            <VideoOverlayTipCard suggestedTip={talk} />
          ))}
        </div>
      </div>
    </div>
  )
}

const VideoOverlayTipCard: React.FC<{suggestedTip: Tip}> = ({suggestedTip}) => {
  const router = useRouter()
  const {handlePlay} = useMuxPlayer()
  const {tipCompleted} = useTipComplete(suggestedTip.slug)

  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${
    suggestedTip.videoResourceId
  }`

  return (
    <div className="aspect-video">
      <button
        key={suggestedTip.slug}
        onClick={() => {
          track('clicked suggested tip thumbnail', {
            lesson: suggestedTip.slug,
          })

          router
            .push({
              pathname: '/tips/[tip]',
              query: {tip: suggestedTip.slug},
            })
            .then(() => {
              handlePlay()
            })
        }}
        className="group relative z-0 flex aspect-video h-full w-full items-end justify-start overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-8 text-left font-medium leading-tight text-gray-100"
      >
        <div className="relative z-10 flex flex-col">
          <span className="font-heading pb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
            Tip
          </span>
          <span className="font-medium">
            {suggestedTip.title}{' '}
            {tipCompleted && <span className="sr-only">(watched)</span>}
          </span>
        </div>
        <Image
          src={thumbnail}
          alt=""
          aria-hidden="true"
          layout="fill"
          className="blur-xs z-0 object-cover opacity-50 brightness-50"
          quality={100}
        />
        <div
          className="absolute left-0 top-0 flex h-full w-full items-start justify-end p-5"
          aria-hidden="true"
        >
          {tipCompleted ? (
            <>
              <CheckCircleIcon
                className="absolute h-10 w-10 text-teal-400 transition group-hover:opacity-0"
                aria-hidden="true"
              />
              <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-teal-400 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </>
          ) : (
            <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-gray-300 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
          )}
        </div>
      </button>
    </div>
  )
}

const ReplyOnTwitter: React.FC<{tweet: string}> = ({tweet}) => {
  return (
    <a
      href={`https://twitter.com/i/status/${tweet}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative mb-5 mt-2 inline-flex flex-shrink-0 items-center justify-center space-x-2 bg-gray-700 px-5 py-4 font-semibold text-white transition-all duration-300 ease-in-out before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-gray-600 before:transition-all before:duration-300 before:ease-in-out  hover:brightness-110 hover:before:w-full focus-visible:ring-white"
      onClick={() => {
        track('clicked reply on twitter')
      }}
    >
      <ChatAltIcon
        aria-hidden="true"
        className="relative h-5 w-5 text-sky-500"
      />
      <span>Discuss on Twitter</span>
    </a>
  )
}

const SubscribeForm = ({
  handleOnSuccess,
}: {
  handleOnSuccess: (subscriber: any, email?: string) => void
}) => {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-between gap-5 border-b border-gray-200 px-3 pb-5 pt-4 dark:border-gray-700/80 md:pb-3 md:pt-3 lg:max-w-none lg:flex-row 2xl:px-0">
      <div className="inline-flex items-center gap-2 text-lg font-semibold leading-tight md:text-base lg:flex-shrink-0 lg:text-lg">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-400/10"
        >
          <MailIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>{' '}
        New Epic Talks delivered to your inbox
      </div>
      <SubscribeToConvertkitForm
        actionLabel="Subscribe to EpicWeb.dev"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

export default TalkTemplate
