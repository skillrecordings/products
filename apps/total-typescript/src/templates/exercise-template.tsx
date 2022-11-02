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
import {ArticleJsonLd} from '@skillrecordings/next-seo'

const ExerciseTemplate: React.FC<{
  exercise: Exercise
  module: SanityDocument
  section?: SanityDocument
  isSolution?: boolean
}> = ({exercise, section, module, isSolution = false}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()

  exercise = ExerciseSchema.parse(isSolution ? exercise.solution : exercise)
  const {title, description: exerciseDescription} = exercise

  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${module._type}s`

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
            className="relative flex w-full lg:absolute lg:pl-[calc(280px+20px)] xl:pl-[calc(320px+20px)]"
            containerClassName="flex h-full justify-between w-full items-stretch"
          />
        }
      >
        <ArticleJsonLd
          url={`${process.env.NEXT_PUBLIC_URL}/${module.slug.current}/${exercise.slug}`}
          title={exercise.title}
          images={[
            `https://image.mux.com/${exercise.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`,
          ]}
          datePublished={exercise._updatedAt || new Date().toISOString()}
          authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
          description={pageDescription}
        />
        <div className="flex flex-col lg:flex-row">
          <ExerciseSidebar
            className="hidden lg:block"
            module={module}
            path={path}
            section={section}
          />
          <main className="relative mx-auto max-w-[1480px] grow items-start border-t border-transparent lg:mt-16 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
            <div className="border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
              <Video
                ref={muxPlayerRef}
                module={module}
                exercise={exercise}
                section={section}
              />
              <MobileLessonNavigator
                module={module}
                section={section}
                path={path}
              />
              <div className="hidden 2xl:block 2xl:bg-black/20">
                <VideoTranscript
                  exercise={exercise}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="relative flex-shrink-0 sm:bg-black/20 2xl:bg-transparent">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-8 2xl:max-w-xl">
                <ExerciseTitle exercise={exercise} />
                <ExerciseDescription exercise={exercise} />
                <GitHubLink exercise={exercise} module={module} />
              </div>
              <div className="relative z-10 block 2xl:hidden">
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
                className="pointer-events-none z-0 select-none"
              />
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

type VideoProps = {
  module: SanityDocument
  section?: SanityDocument
  exercise: Exercise
  ref: any
}

const Video: React.FC<VideoProps> = React.forwardRef(
  ({module, exercise, section}, ref: any) => {
    const {subscriber, loadingSubscriber} = useConvertkit()
    const isExercise = Boolean(exercise._type === 'exercise')
    const {muxPlayerProps, displayOverlay, nextExercise} = useMuxPlayer()

    // TODO: handle section logic and remove !section
    const canShowVideo =
      (subscriber || (!section && exercise._id === module.exercises[0]._id)) &&
      exercise.muxPlaybackId

    return (
      <>
        {displayOverlay && (
          <>
            {nextExercise ? (
              <>{isExercise ? <ExerciseOverlay /> : <DefaultOverlay />}</>
            ) : (
              <FinishedOverlay />
            )}
          </>
        )}
        <div
          className={cx('relative flex w-full items-center justify-center', {
            hidden: displayOverlay,
          })}
        >
          {canShowVideo ? (
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

  if (!github || !exercise.stackblitz) {
    return null
  }

  const openFile = exercise.stackblitz?.split(',')[0]

  return (
    <div className="pt-14">
      <h2 className="pb-4 text-2xl font-semibold sm:text-3xl">Code</h2>
      <div className="flex items-center gap-2">
        <a
          onClick={() => {
            track('clicked github code link', {
              lesson: exercise.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: exercise._type,
            })
          }}
          href={`https://github.com/total-typescript/${github.repo}/blob/main/${openFile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 rounded border border-gray-700/50 bg-gray-800/50 py-5 px-6 text-lg font-medium text-white transition hover:bg-slate-800/90"
        >
          <IconGithub className="h-14 w-14" />
          <div>
            <p className="text-xl font-semibold">
              {module.github.repo}
              <span className="font-medium text-gray-400"></span>
            </p>
            <p className="font-mono text-sm text-gray-400">/{openFile}</p>
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

const ExerciseDescription: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const {body} = exercise
  return (
    <div className="prose max-w-none pt-5 prose-headings:font-semibold prose-headings:text-gray-100 prose-p:text-gray-300 sm:prose-lg xl:pt-8 2xl:pt-5">
      <PortableText value={body} components={PortableTextComponents} />
    </div>
  )
}

export const StackBlitzIframe: React.FC<{
  exercise: Exercise
  module: SanityDocument
  isExpanded?: boolean
}> = ({exercise, module}) => {
  const stackblitz = exercise.stackblitz
  const [isLoading, setIsLoading] = React.useState(true)
  const codeFileNumber = stackblitz?.match(/\d/g)?.join('').substring(0, 2)
  const startCommand = `${exercise._type.substring(0, 1)}-${codeFileNumber}` // e.g. s-01, e-02, etc
  const githubOrg = 'total-typescript'
  const githubRepo = module.github.repo
  const clickToLoad = Number(false)
  const embedUrl = `https://stackblitz.com/github/${githubOrg}/${githubRepo}?file=${stackblitz}&embed=1&view=editor&hideExplorer=1&ctl=${clickToLoad}&terminal=${startCommand}`

  return (
    <>
      <iframe
        key={stackblitz}
        onLoad={() => {
          setIsLoading(false)
        }}
        src={embedUrl}
        title="code editor"
        className={cx('h-full w-full transition-all', {
          invisible: isLoading,
        })}
      />
      {isLoading && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[#070B15]">
          <div className="relative z-10 flex items-center justify-center gap-2">
            <Spinner className="h-8 w-8" />
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

const VideoTranscript: React.FC<{
  exercise: Exercise
  muxPlayerRef: any
}> = ({exercise, muxPlayerRef}) => {
  const transcript = exercise.transcript
  const {handlePlay, video} = useMuxPlayer()
  if (!transcript) {
    return null
  }

  return (
    <div className=" mx-auto max-w-4xl p-5 py-16">
      <h2 className="flex items-baseline text-2xl font-semibold sm:text-3xl">
        Transcript
      </h2>
      <div className="prose max-w-none pt-4 prose-p:text-gray-300 sm:prose-lg">
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

const MobileLessonNavigator: React.FC<{
  module: SanityDocument
  section?: SanityDocument
  path: string
}> = ({module, path, section}) => {
  return (
    <details className="group block border-t-2 border-gray-900 lg:hidden">
      <summary className="no-marker flex cursor-pointer items-center gap-1 bg-black/50 px-4 py-3 font-medium transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-full after:bg-gray-800 after:text-lg after:content-['↑'] group-open:after:rotate-0 hover:bg-gray-800">
        {module.title} {capitalize(module.moduleType)}{' '}
        <span className="opacity-80">
          ({section ? section.exercises.length : module.exercises.length}{' '}
          exercises)
        </span>
      </summary>
      <ExerciseSidebar module={module} path={path} />
    </details>
  )
}

export default ExerciseTemplate
