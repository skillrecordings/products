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

  return (
    <VideoProvider lesson={tip} module={module} muxPlayerRef={muxPlayerRef}>
      <Layout meta={{title: tip.title}}>
        <main className="py-16 max-w-screen-lg w-full mx-auto">
          <Video ref={muxPlayerRef} />
          <article className="pt-5 px-5">
            <h1 className="text-3xl font-bold">{tip.title}</h1>
            <div className="pt-5 prose sm:prose-xl max-w-2xl pb-5 prose-p:text-gray-100 font-medium">
              <PortableText value={tip.body} />
            </div>
            <Transcript video={video} muxPlayerRef={muxPlayerRef} />
          </article>
          <RelatedTips currentTip={tip} tips={tips} />
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
    <>
      <h2 className="text-2xl font-semibold pt-8">Transcript</h2>
      <div className="prose sm:prose-lg max-w-none prose-p:text-gray-200 pt-4">
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
    </>
  )
}

const RelatedTips: React.FC<{tips: Tip[]; currentTip: Tip}> = ({
  currentTip,
  tips,
}) => {
  return (
    <section className="pt-10 px-5">
      <Hr />
      <h2 className="text-2xl font-semibold">More Tips</h2>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-5 pt-5">
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
