import Layout from 'components/layout'
import {SanityDocument} from '@sanity/client'
import {Lesson, LessonSchema} from 'lib/lessons'
import React from 'react'
import {useMuxPlayer, VideoProvider} from 'hooks/use-mux-player'
import Navigation from 'components/navigation'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import capitalize from 'lodash/capitalize'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import Image from 'next/image'
import {useConvertkit} from 'hooks/use-convertkit'
import cx from 'classnames'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {hmsToSeconds} from 'utils/hms-to-seconds'
import PortableTextComponents from 'components/portable-text'
import LessonSidebar from 'components/lesson-sidebar'

const path = '/aprende'

const LessonTemplate: React.FC<{
  lesson: Lesson
  module: SanityDocument
  isSolution?: boolean
}> = ({lesson, module, isSolution = false}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()

  lesson = LessonSchema.parse(isSolution ? lesson.solution : lesson)
  const {title, description: exerciseDescription} = lesson

  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      module={module}
      lesson={lesson as Lesson}
      path={path}
    >
      <Layout
        meta={{title: pageTitle, ...shareCard, description: pageDescription}}
        nav={
          <Navigation
            className="relative flex w-full lg:absolute lg:pl-[calc(280px+20px)] xl:pl-[calc(320px+20px)]"
            containerClassName="flex h-full justify-between w-full items-center"
          />
        }
      >
        <ArticleJsonLd
          url={`${process.env.NEXT_PUBLIC_URL}/${module.slug.current}/${lesson.slug}`}
          title={lesson.title}
          images={[
            `https://image.mux.com/${lesson.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`,
          ]}
          datePublished={lesson._updatedAt || new Date().toISOString()}
          authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
          description={pageDescription}
        />
        <div className="flex flex-col lg:flex-row">
          <LessonSidebar
            className="hidden lg:block"
            module={module}
            path={path}
          />
          <main className="relative mx-auto max-w-[1480px] grow items-start border-t border-transparent lg:mt-16 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
            <div className="border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
              <Video ref={muxPlayerRef} module={module} lesson={lesson} />
              <MobileLessonNavigator module={module} />
              <div className="hidden 2xl:block 2xl:bg-gray-200">
                <VideoTranscript lesson={lesson} muxPlayerRef={muxPlayerRef} />
              </div>
            </div>
            <article className="relative flex-shrink-0 sm:bg-gray-200 2xl:bg-gray-200">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-8 2xl:max-w-xl">
                <ExerciseTitle lesson={lesson} />
                <ExerciseDescription lesson={lesson} />
                <GitHubLink lesson={lesson} module={module} />
              </div>
              <div className="relative z-10 block 2xl:hidden">
                <VideoTranscript lesson={lesson} muxPlayerRef={muxPlayerRef} />
              </div>
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

type VideoProps = {
  module: SanityDocument
  lesson: Lesson
  ref: any
}

const Video: React.FC<VideoProps> = React.forwardRef(
  ({module, lesson}, ref: any) => {
    const {subscriber, loadingSubscriber} = useConvertkit()
    const islesson = Boolean(lesson._type === 'lesson')
    const {muxPlayerProps, displayOverlay, nextLesson} = useMuxPlayer()

    const canShowVideo =
      (subscriber || lesson._id === module.lessons[0]._id) &&
      lesson.muxPlaybackId

    return (
      <>
        {displayOverlay && (
          <>{nextLesson ? <>{islesson ? 'lol' : 'lol'}</> : 'lol'}</>
        )}
        <div
          className={cx('relative flex w-full items-center justify-center', {
            hidden: displayOverlay,
          })}
        >
          {canShowVideo ? (
            <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
          ) : (
            <>{loadingSubscriber ? 'lol' : 'lol'}</>
          )}
        </div>
      </>
    )
  },
)

const GitHubLink: React.FC<{
  lesson: Lesson
  module: SanityDocument
}> = ({lesson, module}) => {
  const {github} = module

  if (!github || !lesson.stackblitz) {
    return null
  }

  const openFile = lesson.stackblitz?.split(',')[0]

  return (
    <div className="pt-14">
      <h2 className="pb-4 text-2xl font-semibold sm:text-3xl">Code</h2>
      <div className="flex items-center gap-2">
        <a
          href={`${github.repo}/tree/main/${openFile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 rounded border border-gray-700/50 bg-gray-800/50 py-5 px-6 text-lg font-medium transition hover:bg-slate-800/90"
        >
          <p className="h-14 w-14" />
          <div>
            <p className="text-xl font-semibold">
              {module.github.repo}
              <span className="font-medium"></span>
            </p>
            <p className="font-mono text-sm">/{openFile}</p>
          </div>
        </a>
      </div>
    </div>
  )
}

const MobileLessonNavigator: React.FC<{module: SanityDocument}> = ({
  module,
}) => {
  return (
    <details className="group block border-t-2 border-gray-900 lg:hidden">
      <summary className="no-marker flex cursor-pointer items-center gap-1 bg-black/50 px-4 py-3 font-medium transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-full after:bg-gray-800 after:text-lg after:content-['↑'] group-open:after:rotate-0 hover:bg-gray-800">
        {module.title} {capitalize(module.moduleType)}{' '}
        <span className="opacity-80">({module.lessons.length} lessons)</span>
      </summary>
      <LessonSidebar module={module} path={path} />
    </details>
  )
}

const VideoTranscript: React.FC<{
  lesson: Lesson
  muxPlayerRef: any
}> = ({lesson, muxPlayerRef}) => {
  const transcript = lesson.transcript
  const {handlePlay, video} = useMuxPlayer()
  if (!transcript) {
    return null
  }

  return (
    <div className=" mx-auto max-w-4xl p-5 py-16">
      <h2 className="flex items-baseline text-2xl font-semibold sm:text-3xl">
        Transcript
      </h2>
      <div className="prose max-w-none pt-4 sm:prose-lg">
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
    </div>
  )
}

const ExerciseTitle: React.FC<{lesson: Lesson}> = ({lesson}) => {
  const {title, _type} = lesson
  return (
    <>
      <span
        className={cx(
          'inline-block rounded-full px-2.5 py-1 font-mono text-xs font-semibold uppercase sm:mt-5 lg:text-sm 2xl:mt-0 2xl:text-xs',
          {
            'bg-cyan-500/20 text-cyan-300': _type === 'solution',
            'bg-orange-500/20 text-orange-300': _type !== 'solution',
          },
        )}
      >
        {_type !== 'exercise' ? _type : 'Problem'}
      </span>
      <h1 className="pb-5 pt-3 text-3xl font-bold tracking-tight sm:text-4xl xl:text-[2.65rem] 2xl:text-4xl">
        {title}
      </h1>
    </>
  )
}

const ExerciseDescription: React.FC<{lesson: Lesson}> = ({lesson}) => {
  const {body} = lesson
  return (
    <div className="prose max-w-none pt-5 prose-headings:font-semibold sm:prose-lg xl:pt-8 2xl:pt-5">
      <PortableText value={body} components={PortableTextComponents} />
    </div>
  )
}

export default LessonTemplate
