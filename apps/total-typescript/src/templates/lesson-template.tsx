import React from 'react'
import type {ConvertkitSubscriber} from '@skillrecordings/convertkit/dist/types'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import PortableTextComponents from 'components/portable-text'
import LessonSidebar from 'components/lesson-sidebar'
import Navigation from 'components/app/navigation'
import Layout from 'components/app/layout'
import capitalize from 'lodash/capitalize'
import Spinner from 'components/spinner'
import cx from 'classnames'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {useDeviceDetect} from 'hooks/use-device-detect'
import {hmsToSeconds} from 'utils/hms-to-seconds'
import {useMuxPlayer, VideoProvider} from 'hooks/use-mux-player'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from 'components/icons'
import {
  ExerciseOverlay,
  DefaultOverlay,
  FinishedOverlay,
  BlockedOverlay,
} from 'components/lesson-overlay'
import Image from 'next/image'

const path = '/tutorials'

const LessonTemplate: React.FC<{
  lesson: SanityDocument
  module: SanityDocument
  subscriber: ConvertkitSubscriber
}> = ({lesson, module, subscriber}) => {
  const {title, lessonType, description} = lesson
  const {ogImage} = module
  const muxPlayerRef = React.useRef<HTMLDivElement>()
  const pageTitle = `${title} (${capitalize(lessonType)})`
  const pageDescription = description || module.description
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}

  return (
    <VideoProvider muxPlayerRef={muxPlayerRef} module={module} lesson={lesson}>
      <Layout
        meta={{title: pageTitle, ...shareCard, description: pageDescription}}
        nav={
          <Navigation className="flex relative w-auto justify-between xl:ml-[320px] lg:ml-[280px]" />
        }
      >
        <div className="flex lg:flex-row flex-col">
          <LessonSidebar
            className="lg:block hidden"
            module={module}
            path={path}
          />
          <main className="w-full relative max-w-[1440px] mx-auto 2xl:flex items-start 2xl:max-w-none border-t 2xl:border-gray-800 border-transparent">
            <div className="2xl:w-full 2xl:border-r border-gray-800 2xl:relative">
              <Video ref={muxPlayerRef} module={module} lesson={lesson} />
              <details className="lg:hidden block group">
                <summary className="flex gap-1 items-center px-4 py-3 font-medium bg-black/50 hover:bg-gray-800 transition cursor-pointer no-marker marker:content-[''] group-open:after:rotate-0 after:rotate-180 after:content-['↑'] after:text-lg after:w-6 after:h-6 after:rounded-full after:bg-gray-800 after:flex after:items-center after:justify-center after:absolute after:right-3">
                  {module.title} {capitalize(module.moduleType)}{' '}
                  <span className="opacity-80">
                    ({module.resources.length} lessons)
                  </span>
                </summary>
                <LessonSidebar module={module} path={path} />
              </details>
              <div className="hidden 2xl:block pb-5">
                <LessonTranscript lesson={lesson} muxPlayerRef={muxPlayerRef} />
                <StackblitzEmbed lesson={lesson} module={module} />
              </div>
            </div>
            <article>
              <div className="mx-auto lg:py-8 px-5 py-5 relative max-w-4xl 2xl:max-w-2xl w-full 2xl:flex-grow">
                <LessonTitle lesson={lesson} />
                <LessonDescription lesson={lesson} />
                <GitHubLink lesson={lesson} module={module} />
              </div>
              <div className="2xl:hidden block">
                <StackblitzEmbed lesson={lesson} module={module} />
                <LessonTranscript lesson={lesson} muxPlayerRef={muxPlayerRef} />
              </div>
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(({module, lesson}, ref: any) => {
  const isExercise = Boolean(lesson.lessonType === 'exercise')
  const {muxPlayerProps, handlePlay, displayOverlay, nextLesson} =
    useMuxPlayer()

  return (
    <>
      {displayOverlay && (
        <>
          {nextLesson ? (
            <>
              {isExercise ? (
                <ExerciseOverlay
                  lesson={lesson}
                  nextLesson={nextLesson}
                  module={module}
                  handlePlay={handlePlay}
                  path={path}
                />
              ) : (
                <DefaultOverlay
                  nextLesson={nextLesson}
                  module={module}
                  handlePlay={handlePlay}
                  path={path}
                />
              )}
            </>
          ) : (
            <FinishedOverlay
              module={module}
              handlePlay={handlePlay}
              path={path}
            />
          )}
        </>
      )}
      <div
        className={cx('flex items-center justify-center w-full relative', {
          'opacity-0': displayOverlay,
        })}
      >
        {lesson.video ? (
          <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
        ) : (
          <BlockedOverlay module={module} />
        )}
      </div>
    </>
  )
})

const AutoPlayToggle: React.FC<any> = ({muxPlayerRef}) => {
  const {autoPlay, handlePlay, setAutoPlay, setPlayerPrefs} = useMuxPlayer()
  return (
    <label className="flex items-center gap-1.5 text-gray-200 text-sm absolute sm:right-4 right-0 cursor-pointer sm:top-3 top-0 bg-gray-900 hover:bg-gray-800 transition rounded px-3 py-2">
      <input
        className="accent-cyan-300"
        checked={autoPlay}
        onChange={() => {
          !autoPlay && handlePlay()
          setAutoPlay(!autoPlay)
          setPlayerPrefs({autoplay: !autoPlay})
        }}
        type="checkbox"
      />
      Autoplay{' '}
    </label>
  )
}

const GitHubLink: React.FC<{
  lesson: SanityDocument
  module: SanityDocument
}> = ({lesson, module}) => {
  const {github} = module
  const {stackblitz} = lesson

  if (!github || !stackblitz) {
    return null
  }

  const openFile = stackblitz.openFile.split(',')[0]

  return (
    <div className="pt-14">
      <h2 className="sm:text-3xl text-2xl font-semibold pb-4">Code</h2>
      <div className="flex items-center gap-2">
        <a
          href={`https://github.com/total-typescript/${github.repo}/blob/main/${openFile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800/50 hover:bg-slate-800/90 transition border border-gray-700/50 text-white rounded py-5 px-6 text-lg font-medium inline-flex items-center gap-4"
        >
          <IconGithub className="w-14 h-14" />
          <div>
            <p className="text-xl font-semibold">
              {module.github.repo}
              <span className="text-gray-400 font-medium"></span>
            </p>
            <p className="text-sm font-mono text-gray-400">/{openFile}</p>
          </div>
        </a>
      </div>
    </div>
  )
}

const LessonTitle: React.FC<{lesson: SanityDocument}> = ({lesson}) => {
  const {title, lessonType} = lesson
  return (
    <>
      <h1 className="sm:text-4xl text-3xl font-semibold pb-5">
        {title} <span className="font-light">({capitalize(lessonType)})</span>
      </h1>
    </>
  )
}

const LessonDescription: React.FC<{lesson: SanityDocument}> = ({lesson}) => {
  const {body} = lesson
  return (
    <div className="pt-5 opacity-90 prose sm:prose-lg max-w-none prose-headings:font-semibold">
      {/* TODO: Fix overflowing Pre tag */}
      <PortableText value={body} components={PortableTextComponents} />
    </div>
  )
}

export const StackBlitzIframe: React.FC<{
  lesson: SanityDocument
  module: SanityDocument
  isExpanded?: boolean
}> = ({lesson, module}) => {
  const {stackblitz} = lesson
  const [isLoading, setIsLoading] = React.useState(true)
  const codeFileNumber = stackblitz.openFile
    .match(/\d/g)
    .join('')
    .substring(0, 2)
  const startCommand = `${lesson.lessonType.substring(0, 1)}-${codeFileNumber}` // e.g. s-01, e-02, etc
  const githubOrg = 'total-typescript'
  const githubRepo = module.github.repo
  const clickToLoad = Number(false)
  const embedUrl = `https://stackblitz.com/github/${githubOrg}/${githubRepo}?file=${stackblitz.openFile}&embed=1&view=editor&hideExplorer=1&ctl=${clickToLoad}&terminal=${startCommand}`

  return (
    <>
      <iframe
        onLoad={() => {
          setIsLoading(false)
        }}
        src={embedUrl}
        title="code editor"
        className={cx('w-full transition-all h-full', {
          invisible: isLoading,
        })}
      />
      {isLoading && (
        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-[#070B15]">
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Spinner className="w-8 h-8" />
            <span>Loading editor...</span>
          </div>
          <Image
            src={require('../../public/assets/editor-placeholder.svg')}
            layout="fill"
            className="object-cover object-top"
          />
        </div>
      )}
    </>
  )
}

const StackblitzEmbed: React.FC<{
  lesson: SanityDocument
  module: SanityDocument
}> = ({lesson, module}) => {
  const {stackblitz} = lesson
  const {isSafari, isFirefox} = useDeviceDetect()
  const [isExpanded, setIsExpanded] = React.useState(false)

  if (!stackblitz.openFile) {
    return null
  }

  return (
    <div className="pt-8">
      <h3 className="max-w-4xl mx-auto flex items-baseline sm:text-3xl text-2xl font-semibold pb-4 px-5">
        Editor
        {(isSafari || isFirefox) && (
          <span className="pl-2 text-base font-normal text-gray-400">
            For full experience with working terminal please use Chromium-based
            browser.
          </span>
        )}
      </h3>
      <div className="relative">
        {isExpanded ? (
          <div
            className={cx('w-full transition-all h-full', {
              'sm:h-[800px] h-[400px]': isExpanded,
              'sm:h-[400px] h-[200px]': !isExpanded,
            })}
          >
            <StackBlitzIframe lesson={lesson} module={module} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto 2xl:px-0 px-5 relative">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="overflow-hidden rounded 2xl:h-[200px] sm:h-[400px] h-[200px] w-full  bg-black/50 hover:bg-black/30 transition ease-in-out group flex items-center justify-center cursor-pointer"
            >
              <div className="relative z-10 px-4 py-3 rounded-md border border-cyan-500 group-hover:border-cyan-300 group-hover:bg-cyan-400/10 transition ease-in-out inline-flex font-medium">
                Run Code
              </div>
              <Image
                src={require('../../public/assets/editor-placeholder.svg')}
                layout="fill"
                className="object-cover object-top"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const LessonTranscript: React.FC<{
  lesson: SanityDocument
  muxPlayerRef: any
}> = ({lesson, muxPlayerRef}) => {
  const {transcript, video} = lesson
  const {handlePlay} = useMuxPlayer()
  if (!transcript) {
    return null
  }

  return (
    <div className="prose prose-lg max-w-4xl text-white mx-auto p-5 py-16">
      <h2 className="flex items-baseline sm:text-3xl text-2xl font-semibold">
        Transcript
      </h2>
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
                      muxPlayerRef.current.currentTime = hmsToSeconds(timestamp)
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
  )
}

export default LessonTemplate
