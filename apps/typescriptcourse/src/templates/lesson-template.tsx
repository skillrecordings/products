import * as React from 'react'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import PortableTextComponents from 'components/portable-text'
import ExerciseSidebar from '../components/exercise-sidebar'
import Navigation from 'components/app/navigation'
import Layout from '../components/app/layout'
import capitalize from 'lodash/capitalize'
import {
  useMuxPlayer,
  VideoProvider,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import cx from 'classnames'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {hmsToSeconds} from '@skillrecordings/time'
import {
  DefaultOverlay,
  FinishedOverlay,
  BlockedOverlay,
  LoadingOverlay,
} from '../components/exercise-overlay'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import Icon from 'components/app/icons'
import {track} from '../utils/analytics'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {trpc} from '../utils/trpc'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

const ExerciseTemplate: React.FC<{
  transcript: any[]
  tutorialFiles?: any
}> = ({transcript, tutorialFiles}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()
  const {lesson, module} = useLesson()
  const {videoResourceId} = useVideoResource()
  const {title, description: exerciseDescription} = lesson
  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${module.moduleType}s`

  return (
    <VideoProvider muxPlayerRef={muxPlayerRef} path={path}>
      <Layout
        meta={
          {title: pageTitle, ...shareCard, description: pageDescription} as any
        }
        nav={
          <Navigation
            className="relative flex w-full lg:absolute lg:pl-[calc(280px+20px)] xl:pl-[calc(320px+20px)]"
            containerClassName="flex h-full justify-between w-full items-stretch"
          />
        }
      >
        <ArticleJsonLd
          url={`${process.env.NEXT_PUBLIC_URL}/${module.slug.current}/${lesson.slug}`}
          title={lesson.title}
          images={[
            `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
          ]}
          datePublished={lesson._updatedAt || new Date().toISOString()}
          authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
          description={pageDescription}
        />
        <div className="flex flex-col lg:flex-row">
          <ExerciseSidebar className="hidden lg:block" path={path} />
          <main className="relative mx-auto max-w-[1480px] grow items-start 2xl:flex 2xl:max-w-none">
            <div className="2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r border-gray-800">
              <Video ref={muxPlayerRef} tutorialFiles={tutorialFiles} />
              <MobileLessonNavigator path={path} />
              <div className="hidden 2xl:block ">
                <VideoTranscript
                  transcript={transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="relative flex-shrink-0 shadow-gray-500/10 2xl:h-full 2xl:shadow-xl">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-8 2xl:max-w-xl">
                <ExerciseTitle />
                <GitHubLink />
                <ExerciseDescription />
              </div>
              <div className="relative z-10 block 2xl:hidden">
                <VideoTranscript
                  transcript={transcript}
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
  tutorialFiles?: any
  ref: any
}

const Video: React.FC<VideoProps> = React.forwardRef(
  ({tutorialFiles}, ref: any) => {
    const {module, lesson, section} = useLesson()
    const {videoResource, loadingVideoResource} = useVideoResource()
    const {subscriber, loadingSubscriber} = useConvertkit()
    const {muxPlayerProps, displayOverlay, nextExercise} = useMuxPlayer()

    // TODO: handle section logic and remove !section
    const canShowVideo =
      (subscriber || (!section && lesson._id === module.lessons[0]._id)) &&
      videoResource?.muxPlaybackId

    return (
      <>
        {displayOverlay && (
          <>{nextExercise ? <DefaultOverlay /> : <FinishedOverlay />}</>
        )}
        <div
          className={cx('relative flex w-full items-center justify-center', {
            hidden: displayOverlay,
          })}
        >
          {canShowVideo ? (
            <MuxPlayer
              ref={ref}
              {...(muxPlayerProps as MuxPlayerProps)}
              playbackId={videoResource?.muxPlaybackId}
            />
          ) : (
            <>
              {loadingSubscriber || loadingVideoResource ? (
                <LoadingOverlay />
              ) : (
                <BlockedOverlay />
              )}
            </>
          )}
        </div>
      </>
    )
  },
)

const GitHubLink: React.FC = () => {
  const {lesson, module} = useLesson()
  const {data: resources} = trpc.resource.byExerciseSlug.useQuery({
    slug: lesson.slug,
  })

  if (!resources?.github) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <a
        onClick={() => {
          track('clicked github code link', {
            lesson: lesson.slug,
            module: module.slug.current,
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
        }}
        href={resources.github.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-gray-800 py-2 px-4 text-lg font-medium text-white transition hover:bg-gray-900"
      >
        <Icon name="Github" size="24" />
        <div>
          <p className="font-semibold">Code</p>
          {/* <p className="font-mono text-sm text-gray-400">/{openFile}</p> */}
        </div>
      </a>
    </div>
  )
}

const ExerciseTitle = () => {
  const {lesson} = useLesson()
  const {title, _type} = lesson
  return (
    <>
      <span
        className={cx(
          'inline-block rounded-full px-2.5 py-1 font-mono text-xs font-semibold uppercase sm:mt-5 lg:text-sm 2xl:mt-0 2xl:text-xs',
          {
            'bg-emerald-500/20 text-emerald-600': _type === 'solution',
            'bg-blue-400 text-brand-red': _type === 'lesson',
            'bg-indigo-500/20 text-indigo-600': _type === 'explainer',
          },
        )}
      >
        {_type !== 'lesson' ? _type : 'Lesson'}
      </span>
      <h1 className="pb-5 pt-3 font-heading text-3xl font-black tracking-tight sm:text-4xl xl:text-[2.65rem] 2xl:text-4xl">
        {title}
      </h1>
    </>
  )
}

const ExerciseDescription = () => {
  const {lesson} = useLesson()
  return (
    <div className="prose max-w-none pt-5 prose-headings:font-heading prose-headings:font-black prose-code:text-[90%] xl:pt-8 2xl:pt-5">
      <PortableText value={lesson.body} components={PortableTextComponents} />
    </div>
  )
}

const VideoTranscript: React.FC<{
  transcript?: any[]
  muxPlayerRef: any
}> = ({transcript, muxPlayerRef}) => {
  const {handlePlay, video} = useMuxPlayer()
  if (!transcript) {
    return null
  }

  return (
    <div className=" mx-auto max-w-4xl p-5 py-16">
      <h2 className="flex items-baseline font-heading text-xl font-black sm:text-2xl">
        Transcript
      </h2>
      <div className="prose max-w-none pt-4">
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
  path: string
}> = ({path}) => {
  const {module, section} = useLesson()
  return (
    <details className="group block border-t-2 border-gray-900 lg:hidden">
      <summary className="no-marker flex cursor-pointer items-center gap-1 px-4 py-3 font-medium shadow-2xl transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-full after:text-lg after:content-['↑'] group-open:after:rotate-0">
        {module.title} {capitalize(module.moduleType)}{' '}
        <span className="opacity-80">
          ({section ? section.exercises.length : module.lessons.length}{' '}
          exercises)
        </span>
      </summary>
      <ExerciseSidebar path={path} />
    </details>
  )
}

export default ExerciseTemplate
