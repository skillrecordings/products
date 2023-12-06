import React, {RefObject} from 'react'
import cx from 'classnames'
import Layout from '@/components/app/layout'
import ReactMarkdown from 'react-markdown'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import MuxPlayer, {
  MuxPlayerProps,
  MuxPlayerRefAttributes,
} from '@mux/mux-player-react'
import {Tip} from '@/lib/tips'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {useRouter} from 'next/router'
import {
  XIcon,
  ChatAltIcon,
  PlayIcon,
  CheckCircleIcon,
  MailIcon,
} from '@heroicons/react/solid'
import {shuffle, take} from 'lodash'
import Image from 'next/legacy/image'
import {getOgImage} from '@/utils/get-og-image'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import {localProgressDb} from '@skillrecordings/skill-lesson/utils/dexie'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {ArticleJsonLd, VideoJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {
  useMuxPlayer,
  VideoProvider,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {trpc} from '@/trpc/trpc.client'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getTranscriptComponents} from '@skillrecordings/skill-lesson/markdown/transcript-components'
import Link from 'next/link'
import Container from '@/components/app/container'
import {AnimatedThingy} from '@/pages'
import Balancer from 'react-wrap-balancer'

const TipTemplate: React.FC<{
  tip: Tip
  tipBody: MDXRemoteSerializeResult
  tips: Tip[]
  transcript: any[]
}> = ({tip, tipBody, tips}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const {tipCompleted} = useTipComplete(tip.slug)
  const {videoResourceId} = useVideoResource()
  const {data: tipResources} = trpc.tipResources.bySlug.useQuery({
    slug: tip.slug,
  })
  const moreTips = tips.filter((otherTip) => otherTip._id !== tip._id)

  const tweet = tipResources?.tweetId

  const ogImage = getOgImage({
    title: tip.title,
  })

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: tip.slug,
        module: 'tips',
        location: 'below tip video',
        moduleType: 'tip',
        lessonType: 'tip',
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
        module: 'tips',
        lesson: tip.slug,
        createdOn: new Date(),
      })
      .then(console.debug)
  }

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      onEnded={handleVideoEnded}
      exerciseSlug={tip.slug}
      path="/tips"
    >
      <ArticleJsonLd
        url={`${process.env.NEXT_PUBLIC_URL}/tips/${tip.slug}`}
        title={tip.title}
        images={[
          `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
        ]}
        datePublished={tip._updatedAt || new Date().toISOString()}
        authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
        description={tip.description || 'DevRel Tip'}
      />
      <VideoJsonLd
        name={tip.title}
        description={
          tip.description || `${process.env.NEXT_PUBLIC_SITE_TITLE} Tip`
        }
        uploadDate={tip._updatedAt || new Date().toISOString()}
        thumbnailUrls={[
          `https://image.mux.com/${tip.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`,
        ]}
        contentUrl={`https://stream.mux.com/${tip.muxPlaybackId}/medium.mp4`}
      />
      <Layout
        meta={{
          title: tip.title,
          description: tip.description ?? '',
          openGraph: {
            images: [ogImage],
          },
        }}
      >
        <main>
          <Container className="px-0 sm:px-0 lg:px-0">
            <Video ref={muxPlayerRef} tips={moreTips} />
          </Container>
          {!subscriber && !loadingSubscriber && (
            <Container className="border-t px-0 sm:px-0 lg:px-0">
              <SubscribeForm handleOnSuccess={handleOnSuccess} />
            </Container>
          )}
          <Container
            as="article"
            className="relative flex grid-cols-3 flex-col gap-10 border-t lg:grid "
          >
            <div className="col-span-2 border-b pt-10 lg:border-b-0">
              <h1 className="inline-flex w-full items-baseline text-3xl font-semibold lg:text-5xl">
                <Balancer>{tip.title}</Balancer>
                {tipCompleted && <span className="sr-only">(watched)</span>}
              </h1>
              {tipCompleted && (
                <div aria-hidden="true">
                  <span className="absolute right-10 top-10 font-mono text-xs font-bold uppercase text-primary">
                    Watched
                  </span>
                </div>
              )}

              {tipBody && (
                <div className="prose w-full max-w-none pt-10 sm:prose-lg">
                  <MDX contents={tipBody} />
                </div>
              )}

              {tip.transcript && (
                <Transcript
                  transcript={tip.transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              )}
            </div>

            {moreTips && moreTips.length > 0 && (
              <div className="relative pb-10 lg:border-l lg:pl-10">
                <Link
                  href="https://x.com/t3dotgg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mb-10 flex items-center gap-4 border-b border-dashed py-10"
                >
                  <Image
                    className="inline-flex rounded-[2px]"
                    src={require('../../public/theo.jpg')}
                    alt="Theo"
                    width={64}
                    height={64}
                  />
                  <div className="flex flex-col opacity-75 transition group-hover:opacity-100">
                    <span className="font-sans text-base font-medium leading-tight">
                      Theo - t3.gg
                    </span>
                    <span className="flex items-center gap-1 font-sans text-sm font-light opacity-75">
                      <span>Author & Instructor</span>
                    </span>
                  </div>
                </Link>
                <MoreTips currentTip={tip} tips={moreTips} />
                <AnimatedThingy className="absolute bottom-10 right-0 opacity-50" />
              </div>
            )}

            {tweet && <ReplyOnTwitter tweet={tweet} />}
          </Container>
        </main>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(({tips}, ref: any) => {
  const {muxPlayerProps, displayOverlay} = useMuxPlayer()
  const {videoResource} = useVideoResource()

  return (
    <div>
      {displayOverlay && <TipOverlay tips={tips} />}
      <div
        className={cx('flex items-center justify-center overflow-hidden', {
          hidden: displayOverlay,
        })}
      >
        <MuxPlayer
          ref={ref}
          {...(muxPlayerProps as MuxPlayerProps)}
          playbackId={videoResource?.muxPlaybackId}
          accentColor="#9D9CD7"
          primaryColor="#fff"
        />
      </div>
    </div>
  )
})

const Transcript: React.FC<{
  transcript: string
  muxPlayerRef: RefObject<MuxPlayerRefAttributes | null>
}> = ({transcript}) => {
  const {handlePlay, canShowVideo, muxPlayerRef} = useMuxPlayer()
  const markdownComponents = getTranscriptComponents({
    handlePlay,
    canShowVideo,
    muxPlayerRef,
  })
  return (
    <section aria-label="transcript" className="group py-16">
      <h2 className="font-mono text-lg font-bold uppercase sm:text-xl">
        Transcript
      </h2>
      <div className="prose max-w-none pt-5 opacity-80 transition group-hover:opacity-100">
        <ReactMarkdown components={markdownComponents}>
          {transcript}
        </ReactMarkdown>
      </div>
    </section>
  )
}

const MoreTips: React.FC<{tips: Tip[]; currentTip: Tip}> = ({
  currentTip,
  tips,
}) => {
  return (
    <section className="transition hover:opacity-100">
      <h2 className="font-mono text-base font-bold uppercase">More Tips</h2>
      <ul className="flex flex-col gap-5 pt-4">
        {tips
          .filter((tip) => tip._id !== currentTip._id)
          .map((tip) => {
            return (
              <li key={tip._id}>
                <Link
                  className="text-lg text-primary hover:underline"
                  href={{
                    pathname: '/tips/[tip]',
                    query: {
                      tip: tip.slug,
                    },
                  }}
                >
                  {tip.title}
                </Link>
              </li>
            )
          })}
      </ul>
    </section>
  )
}

const TipOverlay: React.FC<{tips: Tip[]}> = ({tips}) => {
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
          {take(shuffle(tips), 9).map((tip) => (
            <VideoOverlayTipCard suggestedTip={tip} />
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
          <span className="pb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
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
    <div
      id="tip"
      className="flex w-full flex-col items-center justify-between lg:flex-row lg:gap-5"
    >
      <div className="inline-flex w-full flex-shrink-0 items-center gap-5 text-primary lg:w-auto">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center bg-primary/10"
        >
          <MailIcon className="h-5 w-5 text-primary" />
        </div>
        New DevRel Tips delivered to your inbox:
      </div>
      <SubscribeToConvertkitForm
        actionLabel={`Subscribe for more tips`}
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

export default TipTemplate
