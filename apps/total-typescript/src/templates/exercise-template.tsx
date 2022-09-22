import * as React from 'react'
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
  LoadingOverlay,
} from 'components/exercise-overlay'
import Image from 'next/image'
import {track} from 'utils/analytics'
import {Exercise, ExerciseSchema} from '../lib/exercises'
import {useConvertkit} from 'hooks/use-convertkit'

const path = '/tutorials'

const ExerciseTemplate: React.FC<{
  exercise: Exercise
  module: SanityDocument
  isSolution?: boolean
}> = ({exercise, module, isSolution = false}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()

  exercise = ExerciseSchema.parse(
    isSolution
      ? exercise.resources.find(
          (resource: SanityDocument) => resource._type === 'solution',
        )
      : exercise,
  )
  const {title, description: exerciseDescription} = exercise

  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      module={module}
      lesson={exercise as Exercise}
      path={path}
    >
      <Layout
        meta={{title: pageTitle, ...shareCard, description: pageDescription}}
        nav={
          <Navigation
            className="flex lg:absolute relative w-full xl:pl-[calc(320px+20px)] lg:pl-[calc(280px+20px)]"
            containerClassName="flex h-full justify-between w-full items-stretch"
          />
        }
      >
        <div className="flex lg:flex-row flex-col">
          <ExerciseSidebar
            className="lg:block hidden"
            module={module}
            path={path}
          />
          <main className="lg:mt-16 w-full relative max-w-[1480px] mx-auto 2xl:flex items-start 2xl:max-w-none border-t 2xl:border-gray-800 border-transparent">
            <div className="2xl:w-full 2xl:border-r border-gray-800 2xl:relative 2xl:h-full">
              <Video ref={muxPlayerRef} module={module} exercise={exercise} />
              <details className="lg:hidden block group border-t-2 border-gray-900">
                <summary className="flex gap-1 items-center px-4 py-3 font-medium bg-black/50 hover:bg-gray-800 transition cursor-pointer no-marker marker:content-[''] group-open:after:rotate-0 after:rotate-180 after:content-['↑'] after:text-lg after:w-6 after:h-6 after:rounded-full after:bg-gray-800 after:flex after:items-center after:justify-center after:absolute after:right-3">
                  {module.title} {capitalize(module.moduleType)}{' '}
                  <span className="opacity-80">
                    ({module.exercises.length} exercises)
                  </span>
                </summary>
                <ExerciseSidebar module={module} path={path} />
              </details>
              <div className="hidden 2xl:block">
                <StackblitzEmbed exercise={exercise} module={module} />
                <VideoTranscript
                  exercise={exercise}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="flex-shrink-0 relative">
              <div className="mx-auto lg:py-8 px-5 py-5 relative max-w-4xl 2xl:max-w-xl z-10">
                <ExerciseTitle exercise={exercise} />
                <ExerciseDescription exercise={exercise} />
                <GitHubLink exercise={exercise} module={module} />
              </div>
              <div className="2xl:hidden block relative z-10">
                <StackblitzEmbed exercise={exercise} module={module} />
                <VideoTranscript
                  exercise={exercise}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
              <Image
                src={require('../../public/assets/landing/bg-divider-6.png')}
                alt=""
                aria-hidden="true"
                layout="fill"
                objectFit="contain"
                objectPosition="center top"
                className="pointer-events-none select-none z-0"
              />
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
    const {muxPlayerProps, handlePlay, displayOverlay, nextExercise} =
      useMuxPlayer()

    const {subscriber, loadingSubscriber} = useConvertkit()

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
            hidden: displayOverlay,
          })}
        >
          {video ? (
            <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
          ) : (
            <>{loadingSubscriber ? <LoadingOverlay /> : <BlockedOverlay />}</>
          )}
        </div>
      </>
    )
  },
)

const GitHubLink: React.FC<{
  exercise: Exercise
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
              lesson: exercise.slug.current,
              module: module.slug.current,
              moduleType: module.moduleType,
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

const ExerciseTitle: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const {title, _type} = exercise
  return (
    <>
      <span
        className={cx(
          '2xl:mt-0 sm:mt-5 inline-block uppercase lg:text-sm text-xs 2xl:text-xs font-semibold font-mono px-2.5 py-1 rounded-full',
          {
            'bg-cyan-500/20 text-cyan-300': _type === 'solution',
            'bg-orange-500/20 text-orange-300': _type !== 'solution',
          },
        )}
      >
        {_type}
      </span>
      <h1 className="xl:text-[2.65rem] 2xl:text-4xl sm:text-4xl text-3xl font-bold tracking-tight pb-5 pt-3">
        {title}
      </h1>
    </>
  )
}

const ExerciseDescription: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const {body} = exercise
  return (
    <div className="xl:pt-8 pt-5 2xl:pt-5 prose-p:text-gray-300 prose-headings:text-gray-100 prose sm:prose-lg max-w-none prose-headings:font-semibold">
      <PortableText value={body} components={PortableTextComponents} />
    </div>
  )
}

export const StackBlitzIframe: React.FC<{
  exercise: Exercise
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
            className="object-cover object-left-top"
          />
        </div>
      )}
    </>
  )
}

const StackblitzEmbed: React.FC<{
  exercise: Exercise
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
    <div
      className={cx('pt-8 2xl:pt-12', {
        '2xl:pt-12': !isExpanded,
      })}
    >
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
              'sm:h-[800px] h-[500px]': isExpanded,
              'sm:h-[400px] h-[200px]': !isExpanded,
            })}
          >
            <StackBlitzIframe exercise={exercise} module={module} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto 2xl:px-0 px-5 relative rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => {
                track('clicked run code', {
                  lesson: exercise.slug.current,
                  module: module.slug.current,
                  moduleType: module.moduleType,
                  lessonType: exercise._type,
                })
                setIsExpanded(true)
              }}
              className="overflow-hidden rounded 2xl:h-[400px] sm:h-[400px] h-[200px] w-full  bg-black/50 hover:bg-black/30 transition ease-in-out group flex items-center justify-center cursor-pointer"
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
  exercise: Exercise
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
    <div className=" max-w-4xl mx-auto p-5 py-16">
      <h2 className="flex items-baseline sm:text-3xl text-2xl font-semibold">
        Transcript
      </h2>
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
    </div>
  )
}

export default ExerciseTemplate
