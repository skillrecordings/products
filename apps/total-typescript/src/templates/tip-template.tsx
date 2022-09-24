import React from 'react'
import get from 'lodash/get'
import cx from 'classnames'
import Layout from 'components/app/layout'
import {TipPageProps} from 'pages/tips/[tip]'
import {useMuxPlayer, VideoProvider} from 'hooks/use-mux-player'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import {Tip} from 'lib/tips'
import {SanityDocument} from '@sanity/client'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {hmsToSeconds} from 'utils/hms-to-seconds'
import {TipTeaser} from 'pages/tips'
import {useRouter} from 'next/router'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {XIcon, ChatAltIcon, PlayIcon} from '@heroicons/react/solid'
import {find, indexOf, shuffle, take} from 'lodash'
import {track} from 'utils/analytics'
import Navigation from 'components/app/navigation'
import Image from 'next/image'
import {getOgImage} from 'utils/get-og-image'

const TipTemplate: React.FC<TipPageProps> = ({tip, tips}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()
  const module: any = {
    slug: {
      current: 'tips',
    },
    moduleType: 'tip',
    exercises: tips,
    resources: tips.filter((tip) => tip.slug !== tip.slug),
  }
  const muxPlaybackId = tip?.muxPlaybackId
  const tweet = tip?.tweetId

  const ogImage = getOgImage({
    title: tip.title,
    image: `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=480&height=270&fit_mode=preserve`,
  })

  return (
    <VideoProvider lesson={tip} module={module} muxPlayerRef={muxPlayerRef}>
      <Layout
        meta={{
          title: tip.title,
          ogImage,
        }}
        nav={<Navigation className="flex lg:relative relative" />}
      >
        <main className="w-full mx-auto">
          <div className="bg-gradient-to-b from-black/30 to-gray-900 flex items-center justify-center relative z-10">
            <div className="w-full -mb-1.5 max-w-screen-xl">
              <Video ref={muxPlayerRef} tips={tips} />
            </div>
          </div>
          <div className="relative border-l border-transparent xl:border-gray-800 pb-16 px-5 z-10">
            <article className="pt-10 max-w-screen-xl mx-auto w-full ">
              <div className="flex gap-10 md:flex-row flex-col">
                <div className="w-full">
                  <h1 className="lg:text-4xl text-3xl font-bold w-full max-w-xl">
                    {tip.title}
                  </h1>
                  <Hr />
                </div>
                <div className="w-full">
                  <div className="prose sm:prose-lg lg:prose-xl w-full max-w-none pb-5 prose-p:text-gray-200 font-medium">
                    <PortableText value={tip.body} />
                  </div>
                  <ReplyOnTwitter tweet={tweet} />
                </div>
              </div>
            </article>
            <div className="flex md:flex-row flex-col max-w-screen-xl mx-auto w-full sm:pt-10 pt-4 gap-10">
              {tip.transcript && (
                <div className="max-w-2xl w-full">
                  <Transcript
                    transcript={tip.transcript}
                    muxPlayerRef={muxPlayerRef}
                  />
                </div>
              )}
              <RelatedTips currentTip={tip} tips={tips} />
            </div>
          </div>
          <Image
            src={require('../../public/assets/landing/bg-divider-6.png')}
            alt=""
            aria-hidden="true"
            layout="fill"
            objectPosition="center top"
            className="object-contain pointer-events-none select-none -z-10"
          />
        </main>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(({tips}, ref: any) => {
  const {muxPlayerProps, displayOverlay} = useMuxPlayer()

  return (
    <div className="relative">
      {displayOverlay && <TipOverlay tips={tips} />}
      <div
        className={cx('', {
          hidden: displayOverlay,
        })}
      >
        <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
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
      <h2 className="text-2xl font-semibold">Transcript</h2>
      <div className="prose sm:prose-lg max-w-none prose-p:text-gray-300 pt-4">
        <PortableText
          value={transcript}
          components={
            {
              marks: {
                timestamp: ({value}: any) => {
                  const {timestamp} = value
                  return video ? (
                    <button
                      className="underline inline-block after:inline-block after:content-[' ']"
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
    <section className="mx-auto w-full">
      <h2 className="text-2xl font-semibold">More Tips</h2>
      <div className="pt-4 flex flex-col divide-y divide-gray-800">
        {tips
          .filter((tip) => tip.slug !== currentTip.slug)
          .map((tip) => {
            return <TipTeaser key={tip.slug} tip={tip} />
          })}
      </div>
    </section>
  )
}

const Hr = () => {
  return <hr className="border-cyan-400 w-10 my-8" aria-hidden="true" />
}

const TipOverlay: React.FC<{tips: Tip[]}> = ({tips}) => {
  const router = useRouter()
  const {lesson, module, setDisplayOverlay, handlePlay} = useMuxPlayer()

  const nextTip = getNextTip(lesson as Tip, module.exercises)
  const buttonStyles =
    'py-2 px-3 font-medium rounded flex items-center gap-1 hover:bg-gray-700/50 bg-black/80 transition text-gray-200'
  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex items-center justify-center w-full bg-[#070B16] lg:aspect-video"
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
          Dismiss <XIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <div className="z-20 lg:absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center text-center leading-relaxed text-lg p-5">
        {/* <ShareTip lesson={tip} /> */}
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 h-full ">
          {take(shuffle(tips), 9).map((tip) => {
            const muxPlaybackId = tip?.muxPlaybackId

            const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=288&height=162&fit_mode=preserve`

            return (
              <button
                onClick={() => {
                  router
                    .push({
                      pathname: '/tips/[tip]',
                      query: {tip: tip.slug},
                    })
                    .then(() => {
                      handlePlay()
                    })
                }}
                className="aspect-video w-full z-0 group font-medium text-left text-gray-200 relative leading-tight h-full flex items-end justify-start bg-gray-900/60 rounded-lg p-8"
              >
                <div className="flex flex-col relative z-10">
                  <span className="text-xs font-semibold text-gray-500 pb-1 font-mono uppercase">
                    Tip
                  </span>
                  <span className="font-medium">{tip.title}</span>
                </div>
                <Image
                  src={thumbnail}
                  alt=""
                  aria-hidden="true"
                  layout="fill"
                  className="object-cover opacity-30 blur-xs z-0 group-hover:opacity-40 group-hover:brightness-150 transition"
                  quality={100}
                />
                <div
                  className="absolute w-full h-full left-0 top-0 flex items-start justify-end p-5"
                  aria-hidden="true"
                >
                  <PlayIcon className="w-10 h-10 flex-shrink-0 text-gray-300 group-hover:scale-100 scale-50 group-hover:opacity-100 opacity-0 transition" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const ReplyOnTwitter: React.FC<{tweet: string}> = ({tweet}) => {
  return (
    <a
      href={`https://twitter.com/i/status/${tweet}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-5 mt-2 text-gray-200 px-4 py-3 font-medium rounded bg-gray-800 gap-2 inline-flex items-center justify-center hover:brightness-150 transition brightness-110"
    >
      <ChatAltIcon aria-hidden="true" className="text-gray-400 w-5 h-5" />
      Discuss on Twitter
    </a>
  )
}

const ShareTip: React.FC<{lesson: Tip}> = ({lesson}) => {
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
  const shareMessage = `${get(lesson, 'title')}, TypeScript Tip by @${
    process.env.NEXT_PUBLIC_PARTNER_TWITTER
  }`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-4 py-2 hover:brightness-125 transition font-medium'
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="sm:text-xl text-lg font-semibold">
        Share this Tip with your friends
      </p>
      <div className="flex items-center gap-2 py-8">
        <Twitter
          link={shareUrl}
          message={shareMessage}
          className={cx('bg-[#1B95E0]', shareButtonStyles)}
        >
          Twitter
        </Twitter>
        <LinkedIn
          link={shareUrl}
          message={shareMessage}
          className={cx('bg-[#117AB4]', shareButtonStyles)}
        >
          LinkedIn
        </LinkedIn>
      </div>
    </div>
  )
}

const getNextTip = (currentTip: Tip, tips: Tip[]) => {
  const current = find(tips, {_id: currentTip._id})
  const nextTipIndex = indexOf(tips, current) + 1
  const nextTip = tips[nextTipIndex]
  return nextTip
}

export default TipTemplate
