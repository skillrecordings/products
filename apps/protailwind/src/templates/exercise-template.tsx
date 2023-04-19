import * as React from 'react'
import Layout from 'components/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useRouter} from 'next/router'
import {LessonDescription} from '@skillrecordings/skill-lesson/video/lesson-description'
import {LessonTitle} from '@skillrecordings/skill-lesson/video/lesson-title'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {LargeScreenModuleLessonList} from '@skillrecordings/skill-lesson/video/module-lesson-list/large-screen-module-lesson-list'
import {MobileModuleLessonList} from '@skillrecordings/skill-lesson/video/module-lesson-list/mobile-module-lesson-list'
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
} from '@skillrecordings/skill-lesson/video/module-lesson-list/lesson-list'
import ExerciseOverlay from 'components/exercise-overlay'
import Spinner from 'components/spinner'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import GitHubLink from '@skillrecordings/skill-lesson/video/github-link'
import GitpodLink from 'components/gitpod-link'

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
                <LessonDescription
                  productName={module.title}
                  loadingIndicator={<Spinner />}
                />
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

const LessonAssets = () => {
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {data: resources} = trpc.resources.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })
  const figma = resources?.figma
  const github = resources?.github

  return figma || github ? (
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
      <GitHubLink
        exercise={lesson}
        module={module}
        loadingIndicator={<Spinner className="h-7 w-7" />}
        url={github?.url as string}
        repository="Code"
      />
      <GitpodLink />
    </div>
  ) : null
}

export default ExerciseTemplate
