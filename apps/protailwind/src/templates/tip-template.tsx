import React from 'react'
import cx from 'classnames'
import Layout from 'components/layout'
import {TipPageProps} from 'pages/tips/[tip]'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import {Tip} from 'lib/tips'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {hmsToSeconds} from '@skillrecordings/time'
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
import {useTipComplete} from '../hooks/use-tip-complete'
import {localProgressDb} from '../utils/dexie'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import PortableTextComponents from 'video/portable-text'
import Icon from 'components/icons'
import {
  useMuxPlayer,
  VideoProvider,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {trpc} from '../utils/trpc'

const TipTemplate: React.FC<{
  tip: Tip
  tips: Tip[]
  transcript: any[]
}> = ({tip, tips}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()
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
    image: `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
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
        description={tip.description || 'Tailwind Tip'}
      />
      <Layout
        meta={{
          title: tip.title,
          ogImage,
          description: tip.description ?? '',
        }}
      >
        <main className="mx-auto w-full">
          <div className="relative z-10 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50">
            <div className="flex w-full max-w-screen-xl flex-col">
              <Video ref={muxPlayerRef} tips={tips} />
              {!subscriber && !loadingSubscriber && (
                <SubscribeForm handleOnSuccess={handleOnSuccess} />
              )}
            </div>
          </div>
          <article className="relative z-10 border-l border-transparent px-5 pb-16 pt-8 sm:pt-10 xl:border-gray-800 xl:pt-16">
            <div className="mx-auto w-full max-w-screen-xl pb-5">
              <div className="flex flex-col gap-0 sm:gap-10 md:flex-row">
                <div className="w-full">
                  <h1 className="inline-flex w-full max-w-2xl items-baseline font-heading text-3xl font-black lg:text-4xl">
                    {tip.title}
                    {tipCompleted && <span className="sr-only">(watched)</span>}
                  </h1>
                  {tipCompleted ? (
                    <div
                      aria-hidden="true"
                      className="flex items-center gap-1 pt-6 pb-[20px]"
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
                        tipCompleted ? 'bg-emerald-400' : 'bg-brand-red'
                      }
                    />
                  )}
                  {tip.body && (
                    <>
                      <div className="prose w-full max-w-none pb-5 pt-5 prose-headings:font-medium prose-p:text-gray-200 lg:prose-lg">
                        <PortableText
                          value={tip.body}
                          components={PortableTextComponents}
                        />
                      </div>
                      <Hr
                        className={
                          tipCompleted ? 'bg-emerald-400' : 'bg-cyan-400'
                        }
                      />
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
                <div className="w-full">
                  <div className="prose w-full max-w-none pb-5 font-medium prose-p:text-gray-800 sm:prose-lg">
                    <PortableText
                      value={tip.summary}
                      components={PortableTextComponents}
                    />
                  </div>
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
          'flex items-center justify-center  overflow-hidden shadow-gray-600/40 sm:shadow-2xl xl:rounded-b-xl',
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

const Transcript: React.FC<{transcript: any[]; muxPlayerRef: any}> = ({
  transcript,
  muxPlayerRef,
}) => {
  const {handlePlay, video} = useMuxPlayer()
  return (
    <section aria-label="transcript">
      <h2 className="font-heading text-2xl font-black">Transcript</h2>
      <div className="prose prose-sm max-w-none pt-4 prose-p:text-gray-700 sm:prose">
        <PortableText
          value={transcript}
          components={
            {
              marks: {
                timestamp: ({value}: any) => {
                  const {timestamp} = value
                  return video ? (
                    <button
                      className="after:content-[' '] inline-block underline after:inline-block"
                      onClick={() => {
                        muxPlayerRef.current.currentTime =
                          hmsToSeconds(timestamp)
                        handlePlay()
                        window.scrollTo({top: 80})
                      }}
                    >
                      {timestamp}
                    </button>
                  ) : null
                },
              },
            } as PortableTextComponentsType
          }
        />
      </div>
    </section>
  )
}

const RelatedTips: React.FC<{tips: Tip[]; currentTip: Tip}> = ({
  currentTip,
  tips,
}) => {
  return (
    <section className="mx-auto h-full w-full rounded-xl bg-white p-5 shadow-2xl shadow-gray-500/20 sm:p-10">
      <h2 className="pt-3 font-heading text-2xl font-black">More Tips</h2>
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
  return (
    <div
      className={cx('my-8 h-1 w-8 rounded-full', className)}
      aria-hidden="true"
    />
  )
}

const TipOverlay: React.FC<{tips: Tip[]}> = ({tips}) => {
  const {setDisplayOverlay, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  const buttonStyles =
    'py-2 px-3 font-medium rounded-full flex items-center gap-1 hover:bg-gray-100 bg-white transition text-gray-900'
  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex w-full items-center justify-center border-t border-gray-50 bg-gray-900 shadow-2xl shadow-gray-500/20 lg:aspect-video xl:rounded-b-xl"
    >
      <div className="absolute top-8 right-8 z-50 flex items-center justify-center gap-3">
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
      <div className="ft-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center p-5 text-center text-lg leading-relaxed lg:absolute">
        {/* <ShareTip lesson={tip} /> */}
        <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 ">
          {take(
            shuffle(
              tips.filter((suggestedTip) => suggestedTip.slug !== lesson.slug),
            ),
            9,
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

  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${
    suggestedTip.videoResourceId
  }`

  return (
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
      className="group relative z-0 flex aspect-video h-full w-full items-end justify-start overflow-hidden rounded-lg bg-gray-900 p-8 text-left font-medium leading-tight text-gray-100"
    >
      <div className="relative z-10 flex flex-col">
        <span className="pb-1 font-heading text-xs font-bold uppercase tracking-wide text-gray-400">
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
  )
}

const ReplyOnTwitter: React.FC<{tweet: string}> = ({tweet}) => {
  return (
    <a
      href={`https://twitter.com/i/status/${tweet}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-5 mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-gray-700 shadow-2xl shadow-gray-500/30 transition"
      onClick={() => {
        track('clicked reply on twitter')
      }}
    >
      <ChatAltIcon aria-hidden="true" className="h-5 w-5 text-sky-500" />
      Discuss on Twitter
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
      className="flex w-full flex-col items-center justify-between gap-5 border-b border-gray-200 px-3 pt-4 pb-5 md:flex-row md:pb-3 md:pt-3 2xl:px-0"
    >
      <div className="inline-flex items-center gap-2 text-lg font-semibold leading-tight md:text-base lg:flex-shrink-0 lg:text-lg">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-red/10"
        >
          <MailIcon className="h-5 w-5 text-brand-red" />
        </div>{' '}
        New Tailwind tips delivered to your inbox
      </div>
      <SubscribeToConvertkitForm
        actionLabel="Subscribe for Tailwind tips"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

export default TipTemplate
