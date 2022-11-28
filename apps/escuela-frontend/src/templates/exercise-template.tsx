import * as React from 'react'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import PortableTextComponents from 'components/portable-text'
import ExerciseSidebar from 'components/exercise-sidebar'

import Layout from 'components/layout'
import capitalize from 'lodash/capitalize'

import cx from 'classnames'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {hmsToSeconds} from '@skillrecordings/time'
import {useMuxPlayer, VideoProvider} from 'hooks/use-mux-player'
import {SanityDocument} from '@sanity/client'
// import {IconGithub} from 'components/icons'
import {
  ExerciseOverlay,
  DefaultOverlay,
  FinishedOverlay,
  BlockedOverlay,
  LoadingOverlay,
} from 'components/exercise-overlay'

import {track} from 'utils/analytics'
import {Exercise, ExerciseSchema} from '../lib/exercises'
import {useConvertkit} from 'hooks/use-convertkit'
import {ArticleJsonLd} from '@skillrecordings/next-seo'

import Icon from 'components/icons'

const ExerciseTemplate: React.FC<{
  exercise: Exercise
  module: SanityDocument
  section?: SanityDocument
  isSolution?: boolean
  tutorialFiles?: any
}> = ({exercise, section, module, isSolution = false, tutorialFiles}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()

  exercise = ExerciseSchema.parse(
    isSolution && exercise.solution ? exercise.solution : exercise,
  )
  const {title, description: exerciseDescription} = exercise
  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/tutoriales`

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      module={module}
      lesson={exercise as Exercise}
      path={path}
    >
      <Layout
        meta={
          {title: pageTitle, ...shareCard, description: pageDescription} as any
        }
        navClassName="mx-auto flex w-full flex-col items-center justify-between gap-2 px-5 sm:flex-row sm:gap-0 z-50"
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
          <main className="relative max-w-[1480px] grow items-start  bg-gray-800 2xl:flex 2xl:max-w-none  2xl:bg-transparent">
            <div className="border border-t-0 border-l-0 border-gray-700 2xl:relative 2xl:h-full 2xl:w-full 2xl:bg-gray-800">
              <Video
                ref={muxPlayerRef}
                module={module}
                exercise={exercise}
                section={section}
                tutorialFiles={tutorialFiles}
              />
              <MobileLessonNavigator
                module={module}
                section={section}
                path={path}
              />
              <div className="hidden 2xl:block ">
                <VideoTranscript
                  exercise={exercise}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="relative flex-shrink-0 shadow-gray-500/10 sm:bg-gray-800 2xl:h-full 2xl:bg-transparent 2xl:shadow-xl">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-8 2xl:max-w-xl">
                <ExerciseTitle exercise={exercise} />
                <ExerciseAssets exercise={exercise} module={module} />
                <ExerciseDescription exercise={exercise} />
              </div>
              <div className="relative z-10 block 2xl:hidden">
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

type VideoProps = {
  module: SanityDocument
  section?: SanityDocument
  exercise: Exercise
  tutorialFiles?: any
  ref: any
}

const Video: React.FC<VideoProps> = React.forwardRef(
  ({module, exercise, section, tutorialFiles}, ref: any) => {
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

export const GitHubLink: React.FC<{
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
      <h2 className="pb-4 text-2xl font-semibold sm:text-3xl">Código</h2>
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
          href={`https://github.com/escuela-frontend/${github.repo}/tree/main/${openFile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 rounded border border-gray-700/50 bg-gray-800/50 py-5 px-6 text-lg font-medium text-white transition hover:bg-gray-800/90"
        >
          <Icon name="Github" size="20" /> Código
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
          'inline-block rounded-md px-2.5 py-1 font-mono text-xs font-semibold uppercase sm:mt-5 lg:text-sm 2xl:mt-0 2xl:text-xs',
          {
            'bg-green-500/20 text-green-500': _type === 'solution',
            'bg-brand/20 text-brand': _type === 'exercise',
            'bg-sky-500/20 text-sky-500': _type === 'explainer',
          },
        )}
      >
        {_type === 'solution'
          ? 'Solución'
          : _type === 'exercise'
          ? 'Ejercicio'
          : 'Presentación'}
      </span>
      <h1 className="pb-5 pt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl xl:text-[2.65rem] 2xl:text-4xl">
        {title}
      </h1>
    </>
  )
}

const ExerciseAssets: React.FC<{
  exercise: Exercise
  module: SanityDocument
}> = ({exercise, module}) => {
  const {figma} = exercise
  return (
    <div className="flex flex-wrap items-center gap-2 pb-8">
      {figma?.url && (
        <a
          href={figma.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/5 bg-indigo-50 px-4 py-2 text-lg font-semibold text-indigo-600 transition hover:bg-indigo-100/80"
        >
          <Icon name="Figma" size="20" className="text-indigo-600" />
          <span>Design assets</span>
        </a>
      )}
      <GitHubLink exercise={exercise} module={module} />
    </div>
  )
}

const ExerciseDescription: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const {body} = exercise
  return (
    <div className="prose prose-invert max-w-none pt-5 prose-headings:font-heading prose-headings:font-bold prose-code:text-[90%] xl:pt-8 2xl:pt-5">
      <PortableText value={body} components={PortableTextComponents} />
    </div>
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
      <h2 className="flex items-baseline font-heading text-xl font-bold sm:text-2xl">
        Transcripción
      </h2>
      <div className="prose prose-invert max-w-none pt-4">
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
    <details className="group block lg:hidden">
      <summary className="no-marker flex cursor-pointer items-center gap-1 bg-gray-900 px-4 py-3 font-medium shadow-2xl shadow-gray-500/10 transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-md after:bg-gray-600 after:text-lg after:content-['↑'] group-open:after:rotate-0 hover:bg-gray-700">
        {module.title}
        <span className="opacity-80">
          ({section ? section.exercises.length : module.exercises.length - 1}{' '}
          Lecciones)
        </span>
      </summary>
      <ExerciseSidebar module={module} path={path} section={section} />
    </details>
  )
}

export default ExerciseTemplate
