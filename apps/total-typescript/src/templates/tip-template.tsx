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
import {XIcon} from '@heroicons/react/solid'
import {find, indexOf} from 'lodash'
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
    resources: tips.filter((tip) => tip.slug.current !== tip.slug.current),
  }
  const video = tip?.resources.find(
    (resource: SanityDocument) => resource._type === 'videoResource',
  )

  const ogImage = getOgImage({
    title: tip.title,
    image: `https://image.mux.com/${video.muxAsset.muxPlaybackId}/thumbnail.png?width=480&height=270&fit_mode=preserve`,
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
              <Video ref={muxPlayerRef} />
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
                <div className="prose sm:prose-lg lg:prose-xl w-full max-w-none pb-5 prose-p:text-gray-200 font-medium">
                  <PortableText value={tip.body} />
                </div>
              </div>
            </article>
            <div className="flex md:flex-row flex-col max-w-screen-xl mx-auto w-full sm:pt-10 pt-4 gap-10">
              <Transcript video={video} muxPlayerRef={muxPlayerRef} />
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
  const {muxPlayerProps, displayOverlay, handlePlay, setDisplayOverlay} =
    useMuxPlayer()

  return (
    <div className="relative">
      {displayOverlay && <TipOverlay />}
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

const Transcript: React.FC<{video: any; muxPlayerRef: any}> = ({
  video,
  muxPlayerRef,
}) => {
  const {handlePlay} = useMuxPlayer()
  return (
    <section aria-label="transcript" className="max-w-2xl w-full">
      <h2 className="text-2xl font-semibold">Transcript</h2>
      <div className="prose sm:prose-lg max-w-none prose-p:text-gray-300 pt-4">
        <PortableText
          value={video.castingwords.transcript}
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
          .filter((tip) => tip.slug.current !== currentTip.slug.current)
          .map((tip) => {
            return <TipTeaser key={tip.slug.current} tip={tip} />
          })}
      </div>
    </section>
  )
}

const Hr = () => {
  return <hr className="border-cyan-400 w-10 my-8" aria-hidden="true" />
}

const TipOverlay: React.FC = () => {
  const router = useRouter()
  const {lesson, module, setDisplayOverlay, handlePlay} = useMuxPlayer()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
  const shareMessage = `${get(lesson, 'title')}, TypeScript Tip by @${
    process.env.NEXT_PUBLIC_PARTNER_TWITTER
  }`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-4 py-2 hover:brightness-125 transition font-medium'
  const nextTip = getNextTip(lesson as Tip, module.exercises)
  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video"
    >
      <button
        className="absolute top-2 right-2 py-2 px-3 z-50 font-medium rounded flex items-center gap-1 hover:bg-gray-800 transition text-gray-200"
        onClick={() => {
          track('dismissed video overlay', {
            lesson: lesson.slug.current,
            module: module.slug.current,
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
          setDisplayOverlay(false)
        }}
      >
        Dismiss <XIcon className="w-5 h-5" aria-hidden="true" />
      </button>
      <div className="z-20 absolute left-0 top-0 w-full h-full flex flex-col items-center justify-between text-center leading-relaxed text-lg p-10">
        <div className="flex md:flex-row flex-col gap-5 items-center justify-center h-full">
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
            <div className="flex items-center justify-center">
              <button className={shareButtonStyles} onClick={handlePlay}>
                <span aria-hidden="true">↺</span> Replay
              </button>
            </div>
          </div>
          {nextTip && (
            <div className="flex flex-col items-center">
              <p className="sm:text-2xl text-xl font-semibold">Up Next</p>
              <p className="sm:text-xl text-lg font-semibold py-4">
                {nextTip.title}
              </p>
              <button
                className={cx('bg-gray-800', shareButtonStyles)}
                type="button"
                onClick={() => {
                  router
                    .push({
                      pathname: '/tips/[tip]',
                      query: {tip: nextTip.slug.current},
                    })
                    .then(() => {
                      setDisplayOverlay(false)
                      handlePlay()
                    })
                }}
              >
                Continue <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
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
