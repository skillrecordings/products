import React from 'react'
import cx from 'classnames'
import Layout from '@/components/app/layout'
import MuxPlayer, {
  MuxPlayerProps,
  MuxPlayerRefAttributes,
} from '@mux/mux-player-react'
import Balancer from 'react-wrap-balancer'
import {Tip} from '@/lib/tips'
import {TipTeaser} from '@/pages/tips'
import {useRouter} from 'next/router'
import {XIcon, ChatAltIcon, MailIcon} from '@heroicons/react/solid'
import {shuffle, take} from 'lodash'
import {track} from '../utils/analytics'
import Image from 'next/legacy/image'
import {getOgImage} from '@/utils/get-og-image'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import {localProgressDb} from '@skillrecordings/skill-lesson/utils/dexie'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import Icon from '@/components/icons'
import {
  useMuxPlayer,
  VideoProvider,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {trpc} from '@/trpc/trpc.client'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'

const TipTemplate: React.FC<{
  tip: Tip
  tips: Tip[]
  tipBody: MDXRemoteSerializeResult
  tipSummary: MDXRemoteSerializeResult
  transcript: any[]
}> = ({tip, tips, tipBody, tipSummary}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const {tipCompleted} = useTipComplete(tip.slug)
  const {videoResourceId} = useVideoResource()
  const {data: tipResources} = trpc.tipResources.bySlug.useQuery({
    slug: tip.slug,
  })

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
      accentColor="#DC6D53"
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
        description={tip.description || 'Colt Steele Tip'}
      />
      <Layout
        meta={{
          title: tip.title,
          openGraph: {images: [ogImage]},
          description: tip.description ?? '',
        }}
        navigationProps={{className: 'max-w-screen-xl'}}
      >
        <main className="mx-auto w-full">
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex w-full max-w-screen-xl xl:px-5 flex-col">
              <Video ref={muxPlayerRef} tips={tips} />
              {!subscriber && !loadingSubscriber && (
                <SubscribeForm handleOnSuccess={handleOnSuccess} />
              )}
            </div>
          </div>
          <article className="relative z-10 border-l border-transparent px-5 pb-16 pt-8 sm:pt-10 lg:border-gray-800 lg:pt-10">
            <div className="mx-auto w-full max-w-screen-xl pb-5">
              <div className="flex flex-col gap-0 sm:gap-10 lg:grid grid-cols-5">
                <div className="col-span-3 lg:pl-5 flex flex-col items-start">
                  <h1 className="font-heading inline-flex w-full max-w-2xl items-baseline text-4xl font-black sm:text-5xl lg:text-6xl text-gray-800">
                    <Balancer>{tip.title}</Balancer>
                    {tipCompleted && <span className="sr-only">(watched)</span>}
                  </h1>
                  {tipCompleted ? (
                    <div
                      aria-hidden="true"
                      className="inline-flex mt-5 mb-8 items-center gap-1 rounded-sm bg-brand-yellow/10 px-3 py-2 text-xs font-bold uppercase leading-none tracking-wider text-amber-600"
                    >
                      <Icon name="Checkmark" className="h-3 w-3" />
                      Watched
                    </div>
                  ) : (
                    <Hr className="bg-brand-red" />
                  )}
                  {tipBody && (
                    <>
                      <div className="prose w-full max-w-none pb-5 pt-5 lg:prose-lg text-gray-800 lg:prose-h2:text-4xl lg:prose-h3:text-3xl lg:prose-h4:text-2xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl">
                        <MDX contents={tipBody} />
                      </div>
                      <Hr className="bg-brand-red" />
                    </>
                  )}
                  {tip.transcript && tip.body && (
                    <div className="w-full max-w-2xl pt-5">
                      <Transcript
                        transcript={tip.transcript}
                        muxPlayerRef={muxPlayerRef}
                      />
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  {tipSummary && (
                    <div className="prose w-full max-w-none pb-5 font-medium sm:prose-lg">
                      <MDX contents={tipSummary} />
                    </div>
                  )}
                  {tweet && <ReplyOnTwitter tweet={tweet} />}
                  {tip.body && <RelatedTips currentTip={tip} tips={tips} />}
                </div>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-10 sm:pt-10 md:flex-row">
              {tip.transcript && !tip.body && (
                <div className="w-full max-w-2xl pt-5">
                  <Transcript
                    transcript={tip.transcript}
                    muxPlayerRef={muxPlayerRef}
                  />
                </div>
              )}
              {!tip.body && <RelatedTips currentTip={tip} tips={tips} />}
            </div>
          </article>
        </main>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(({tips}, ref: any) => {
  const {muxPlayerProps, displayOverlay} = useMuxPlayer()
  const {videoResource} = useVideoResource()

  return (
    <div className="relative">
      {displayOverlay && <TipOverlay tips={tips} />}
      <div
        className={cx(
          'flex items-center justify-center overflow-hidden shadow-gray-600/40 sm:shadow-2xl xl:rounded-b-md',
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

const Transcript: React.FC<{transcript: string; muxPlayerRef: any}> = ({
  transcript,
  muxPlayerRef,
}) => {
  return (
    <section aria-label="transcript">
      <VideoTranscript transcript={transcript} />
    </section>
  )
}

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

const TipOverlay: React.FC<{tips: Tip[]}> = ({tips}) => {
  const {setDisplayOverlay, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  const buttonStyles =
    'py-2 px-3 font-medium rounded-md flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition'
  return (
    <div
      id="video-overlay"
      className="relative left-0 top-0 flex w-full items-center justify-center shadow-2xl shadow-black/10 bg-white lg:aspect-video xl:rounded-b-md"
    >
      <div className="absolute right-5 top-5 z-50 flex items-center justify-center gap-3">
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
      <div className="top-0 z-20 sm:px-16 px-5 flex h-full w-full sm:p-10 text-center text-lg leading-relaxed">
        {/* <ShareTip lesson={tip} /> */}
        <div className="grid h-full w-full grid-cols-1 place-items-center items-center justify-center gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {take(
            shuffle(
              tips.filter((suggestedTip) => suggestedTip.slug !== lesson.slug),
            ),
            4,
          ).map((tip) => (
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

  const thumbnail = `https://image.mux.com/${suggestedTip.muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve&time=1`

  return (
    <div className="aspect-[16/9] w-full h-full">
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
        className="group relative z-0 flex aspect-video h-full w-full items-end justify-start overflow-hidden rounded-lg border border-gray-200 bg-white text-left font-medium leading-tight text-gray-100"
      >
        <div className="bg-white text-black left-0 bottom-0 p-5 relative z-10 flex flex-col w-full">
          <span className="font-mono pb-1 text-xs font-bold uppercase tracking-wide">
            Tip
          </span>
          <span className="font-medium truncate">
            {tipCompleted && (
              <Icon
                name="Checkmark"
                className="w-4 text-gray-600 inline-block pr-1"
              />
            )}
            {suggestedTip.title}{' '}
            {tipCompleted && <span className="sr-only">(watched)</span>}
          </span>
        </div>
        <Image
          src={thumbnail}
          alt=""
          aria-hidden="true"
          layout="fill"
          className="blur-xs z-0 object-cover brightness-90 transition"
          quality={100}
        />
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
      className="relative mb-5 mt-2 inline-flex flex-shrink-0 items-center justify-center space-x-2 bg-gray-700 px-5 py-4 font-semibold text-white transition-all duration-300 ease-in-out before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-gray-600 before:transition-all before:duration-300 before:ease-in-out  focus-visible:ring-white hover:brightness-110 hover:before:w-full"
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
      className="flex w-full flex-col items-center justify-between gap-5 border-b border-gray-200 px-3 pb-5 pt-4 md:flex-row md:pb-3 md:pt-3 2xl:px-0"
    >
      <div className="inline-flex items-center gap-2 text-lg font-semibold leading-tight md:text-base lg:flex-shrink-0 lg:text-lg">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-red/10"
        >
          <MailIcon className="h-5 w-5 text-brand-red" />
        </div>{' '}
        New Colt Steele tips delivered to your inbox
      </div>
      <SubscribeToConvertkitForm
        actionLabel="Subscribe for Colt Steele tips"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

export default TipTemplate
