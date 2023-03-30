import * as React from 'react'
import Layout from 'components/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useRouter} from 'next/router'
import {LessonDescription} from 'video/lesson-description'
import {LessonTitle} from 'video/lesson-title'
import LessonAssets from 'video/lesson-assets'
import {VideoTranscript} from 'video/video-transcript'
import {Video} from 'video/video'
import {LargeScreenModuleLessonList} from 'video/module-lesson-list/large-screen-module-lesson-list'
import {MobileModuleLessonList} from 'video/module-lesson-list/mobile-module-lesson-list'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react/*'
import {trpc} from 'trpc/trpc.client'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {
  ExerciseLink,
  ExplainerLink,
  ProblemLink,
  SolutionLink,
} from 'video/module-lesson-list/lesson-list'
import ExerciseOverlay from 'components/exercise-overlay'
import Spinner from 'components/spinner'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

const ExerciseTemplate: React.FC<{
  transcript: any[]
  tutorialFiles?: any
}> = ({transcript, tutorialFiles}) => {
  const router = useRouter()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {lesson, section, module} = useLesson()
  const {videoResourceId} = useVideoResource()
  const {title, description: exerciseDescription} = lesson
  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${module.moduleType}s`
  const {data: resources, status: resourcesStatus} =
    trpc.resources.byExerciseSlug.useQuery({
      slug: router.query.lesson as string,
      type: lesson._type,
    })
  const lessonResourceRenderer = (
    path: string,
    module: Module,
    lesson: Lesson,
    section?: Section,
  ) => {
    const hasResources = resources?.sandpack || resources?.gitpod
    return (
      <>
        {lesson._type === 'exercise' && (
          <>
            <ProblemLink
              module={module}
              exercise={lesson}
              section={section}
              path={path}
            />
            {resourcesStatus === 'loading' ? (
              <li data-exercise-is-loading="">Exercise</li>
            ) : (
              hasResources && (
                <ExerciseLink
                  module={module}
                  lesson={lesson}
                  section={section}
                  path={path}
                />
              )
            )}
            <SolutionLink
              module={module}
              lesson={lesson}
              section={section}
              path={path}
            />
          </>
        )}
        {lesson._type === 'explainer' && (
          <ExplainerLink
            lesson={lesson}
            module={module}
            section={section}
            path={path}
          />
        )}
      </>
    )
  }
  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      path={path}
      exerciseSlug={router.query.lesson as string}
    >
      <Layout
        meta={
          {title: pageTitle, ...shareCard, description: pageDescription} as any
        }
        navClassName="mx-auto flex w-full items-center justify-between px-5"
      >
        <ArticleJsonLd
          url={`${process.env.NEXT_PUBLIC_URL}/${module.slug.current}/${lesson.slug}`}
          title={lesson.title}
          images={[
            `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
          ]}
          datePublished={lesson._updatedAt || new Date().toISOString()}
          authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
          description={pageDescription || ''}
        />
        <div className="flex flex-col lg:flex-row">
          <LargeScreenModuleLessonList
            lessonResourceRenderer={lessonResourceRenderer}
            module={module}
            path={path}
          />
          <main className="relative mx-auto max-w-[1480px] grow items-start sm:bg-gray-100 2xl:flex 2xl:max-w-none 2xl:bg-transparent">
            <div className="border-gray-100 2xl:relative 2xl:h-full 2xl:w-full">
              <Video
                ref={muxPlayerRef}
                product={module.product as SanityProduct}
                exerciseOverlayRenderer={() => (
                  <ExerciseOverlay tutorialFiles={tutorialFiles} />
                )}
                loadingIndicator={<Spinner />}
              />
              <MobileModuleLessonList
                lessonResourceRenderer={lessonResourceRenderer}
                module={module}
                section={section}
                path={path}
              />
              <div className="hidden 2xl:block">
                <VideoTranscript
                  transcript={transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="relative flex-shrink-0 border-gray-200/60 sm:bg-gray-100 2xl:h-full 2xl:border-l 2xl:bg-transparent 2xl:shadow-2xl 2xl:shadow-gray-300/40">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-8 2xl:max-w-xl">
                <LessonTitle />
                <LessonAssets />
                <LessonDescription />
                {/* <GitHubLink exercise={exercise} module={module} /> */}
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

export default ExerciseTemplate
