import React from 'react'
import type {ConvertkitSubscriber} from '@skillrecordings/convertkit/dist/types'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import PortableTextComponents from 'components/portable-text'
import ExerciseSidebar from 'components/exercise-sidebar'
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
} from 'components/exercise-overlay'
import Image from 'next/image'
import {track} from 'utils/analytics'
import {Subscriber} from 'pages/api/progress/[exercise]'

const path = '/tutorials'

const ExerciseTemplate: React.FC<{
  exercise: SanityDocument
  module: SanityDocument
  subscriber: Subscriber
  isSolution?: boolean
}> = ({exercise, module, subscriber, isSolution = false}) => {
  exercise = isSolution
    ? exercise.resources.find(
        (resource: SanityDocument) => resource._type === 'solution',
      )
    : exercise
  const {label, description: exerciseDescription} = exercise

  const {ogImage, description: moduleDescription} = module
  const muxPlayerRef = React.useRef<HTMLDivElement>()
  const pageTitle = `${label}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      module={module}
      exercise={exercise}
      subscriber={subscriber}
      path={path}
    >
      <Layout
        meta={{title: pageTitle, ...shareCard, description: pageDescription}}
        nav={
          <Navigation className="flex relative w-auto justify-between xl:ml-[320px] lg:ml-[280px]" />
        }
      >
        <div className="flex lg:flex-row flex-col">
          <ExerciseSidebar
            className="lg:block hidden"
            module={module}
            path={path}
          />
          <main className="w-full relative max-w-[1440px] mx-auto 2xl:flex items-start 2xl:max-w-none border-t 2xl:border-gray-800 border-transparent">
            <div className="2xl:w-full 2xl:border-r border-gray-800 2xl:relative">
              <Video ref={muxPlayerRef} module={module} exercise={exercise} />
              <details className="lg:hidden block group">
                <summary className="flex gap-1 items-center px-4 py-3 font-medium bg-black/50 hover:bg-gray-800 transition cursor-pointer no-marker marker:content-[''] group-open:after:rotate-0 after:rotate-180 after:content-['↑'] after:text-lg after:w-6 after:h-6 after:rounded-full after:bg-gray-800 after:flex after:items-center after:justify-center after:absolute after:right-3">
                  {module.title} {capitalize(module.moduleType)}{' '}
                  <span className="opacity-80">
                    ({module.exercises.length} exercises)
                  </span>
                </summary>
                <ExerciseSidebar module={module} path={path} />
              </details>
              <div className="hidden 2xl:block pb-5">
                <VideoTranscript
                  exercise={exercise}
                  muxPlayerRef={muxPlayerRef}
                />
                <StackblitzEmbed exercise={exercise} module={module} />
              </div>
            </div>
            <article>
              <div className="mx-auto lg:py-8 px-5 py-5 relative max-w-4xl 2xl:max-w-2xl w-full 2xl:flex-grow">
                <ExerciseTitle exercise={exercise} />
                <ExerciseDescription exercise={exercise} />
                <GitHubLink exercise={exercise} module={module} />
              </div>
              <div className="2xl:hidden block">
                <StackblitzEmbed exercise={exercise} module={module} />
                <VideoTranscript
                  exercise={exercise}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(
  ({module, exercise}, ref: any) => {
    const isExercise = Boolean(exercise._type === 'exercise')
    const {
      muxPlayerProps,
      handlePlay,
      displayOverlay,
      nextExercise,
      subscriber,
    } = useMuxPlayer()

    const video =
      (subscriber || exercise._id === module.exercises[0]._id) &&
      exercise.resources.find(
        (resource: SanityDocument) => resource._type === 'muxVideo',
      )

    return (
      <>
        {displayOverlay && (
          <>
            {nextExercise ? (
              <>
                {isExercise ? (
                  <ExerciseOverlay handlePlay={handlePlay} />
                ) : (
                  <DefaultOverlay handlePlay={handlePlay} />
                )}
              </>
            ) : (
              <FinishedOverlay handlePlay={handlePlay} />
            )}
          </>
        )}
        <div
          className={cx('flex items-center justify-center w-full relative', {
            'opacity-0': displayOverlay,
          })}
        >
          {video ? (
            <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
          ) : (
            <BlockedOverlay />
          )}
        </div>
      </>
    )
  },
)

const GitHubLink: React.FC<{
  exercise: SanityDocument
  module: SanityDocument
}> = ({exercise, module}) => {
  const {github} = module
  const stackblitz = exercise.resources.find(
    (resource: SanityDocument) => resource._type === 'stackblitz',
  )

  if (!github || !stackblitz) {
    return null
  }

  const openFile = stackblitz.openFile.split(',')[0]

  return (
    <div className="pt-14">
      <h2 className="sm:text-3xl text-2xl font-semibold pb-4">Code</h2>
      <div className="flex items-center gap-2">
        <a
          onClick={() => {
            track('clicked github code link', {
              lesson: exercise.slug,
              module: module.slug,
              moduleType: module._type,
              lessonType: exercise._type,
            })
          }}
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

const ExerciseTitle: React.FC<{exercise: SanityDocument}> = ({exercise}) => {
  const {label, _type} = exercise
  return (
    <>
      <h1 className="sm:text-4xl text-3xl font-semibold pb-5">
        {label} <span className="font-light">({capitalize(_type)})</span>
      </h1>
    </>
  )
}

const ExerciseDescription: React.FC<{exercise: SanityDocument}> = ({
  exercise,
}) => {
  const {body} = exercise
  return (
    <div className="pt-5 opacity-90 prose sm:prose-lg max-w-none prose-headings:font-semibold">
      {/* TODO: Fix overflowing Pre tag */}
      <PortableText value={body} components={PortableTextComponents} />
    </div>
  )
}

export const StackBlitzIframe: React.FC<{
  exercise: SanityDocument
  module: SanityDocument
  isExpanded?: boolean
}> = ({exercise, module}) => {
  const stackblitz = exercise.resources.find(
    (resource: SanityDocument) => resource._type === 'stackblitz',
  )
  const [isLoading, setIsLoading] = React.useState(true)
  const codeFileNumber = stackblitz.openFile
    .match(/\d/g)
    .join('')
    .substring(0, 2)
  const startCommand = `${exercise._type.substring(0, 1)}-${codeFileNumber}` // e.g. s-01, e-02, etc
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
  exercise: SanityDocument
  module: SanityDocument
}> = ({exercise, module}) => {
  const stackblitz = exercise.resources?.find(
    (resource: SanityDocument) => resource._type === 'stackblitz',
  )
  const {isSafari, isFirefox} = useDeviceDetect()
  const [isExpanded, setIsExpanded] = React.useState(false)

  if (!stackblitz?.openFile) {
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
            <StackBlitzIframe exercise={exercise} module={module} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto 2xl:px-0 px-5 relative">
            <button
              type="button"
              onClick={() => {
                track('clicked run code', {
                  lesson: exercise.slug,
                  module: module.slug,
                  moduleType: module._type,
                  lessonType: exercise._type,
                })
                setIsExpanded(true)
              }}
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

const VideoTranscript: React.FC<{
  exercise: SanityDocument
  muxPlayerRef: any
}> = ({exercise, muxPlayerRef}) => {
  const video = exercise.resources.find(
    (resource: SanityDocument) => resource._type === 'muxVideo',
  )
  const transcript = video?.transcript
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

export default ExerciseTemplate
