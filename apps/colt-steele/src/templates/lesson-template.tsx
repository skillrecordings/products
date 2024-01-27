import * as React from 'react'
import Layout from '@/components/app/layout'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import GitHubLink from '@skillrecordings/skill-lesson/video/github-link'
import {useRouter} from 'next/router'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LargeScreenModuleLessonList} from '@skillrecordings/skill-lesson/video/module-lesson-list/large-screen-module-lesson-list'
import {MobileModuleLessonList} from '@skillrecordings/skill-lesson/video/module-lesson-list/mobile-module-lesson-list'
import {LessonDescription} from '@skillrecordings/skill-lesson/video/lesson-description'
import {LessonTitle} from '@skillrecordings/skill-lesson/video/lesson-title'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {trpc} from '../trpc/trpc.client'
import LessonCompletionToggle from '@skillrecordings/skill-lesson/video/lesson-completion-toggle'
import {useSession} from 'next-auth/react'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {
  ExerciseLink,
  ExplainerLink,
  ProblemLink,
  SolutionLink,
} from '@skillrecordings/skill-lesson/video/module-lesson-list/lesson-list'
import Spinner from '@/components/spinner'
// import {getExerciseGitHubUrl} from 'exercise/get-exercise-github-url'
import pluralize from 'pluralize'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getOgImage} from '@/utils/get-og-image'
import ExerciseOverlay from '@/components/exercise-overlay'

const LessonTemplate: React.FC<{
  transcript: string
  lessonBody: MDXRemoteSerializeResult
  lessonBodyPreview: MDXRemoteSerializeResult
}> = ({transcript, lessonBody, lessonBodyPreview}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const router = useRouter()
  const {lesson, section, module} = useLesson()
  const {videoResourceId} = useVideoResource()
  const {title, description: exerciseDescription} = lesson

  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${pluralize(module.moduleType)}`
  const {data: session} = useSession()

  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: resources, status: resourcesStatus} =
    trpc.lessonResources.byExerciseSlug.useQuery({
      slug: router.query.lesson as string,
      type: lesson._type,
    })

  const lessonResourceRenderer = (
    path: string,
    module: Module,
    lesson: Lesson,
    section?: Section,
  ) => {
    const hasSandpackResource = resources?.sandpack
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
              hasSandpackResource && (
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
      accentColor="#DC6D53"
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      path={path}
      onModuleEnded={async () => {
        addProgressMutation.mutate({lessonSlug: router.query.lesson as string})
      }}
    >
      <Layout
        meta={{
          title: pageTitle,
          ...shareCard,
          openGraph: {
            description: pageDescription as string,
            images: [getOgImage({title})],
          },
        }}
        navigationProps={{className: 'w-full max-w-none'}}
        withFooter={false}
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
        <div className="flex flex-grow flex-col lg:flex-row">
          <LargeScreenModuleLessonList
            lessonResourceRenderer={lessonResourceRenderer}
            module={module}
            path={path}
          />
          <main className="relative mx-auto w-full max-w-[1480px] items-start border-t border-transparent 2xl:flex 2xl:max-w-none 2xl:border-gray-200">
            <div className="flex flex-col border-gray-200 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
              <Video
                ref={muxPlayerRef}
                product={module.product as SanityProduct}
                exerciseOverlayRenderer={() => <ExerciseOverlay />}
                loadingIndicator={<Spinner />}
              />
              <MobileModuleLessonList
                lessonResourceRenderer={lessonResourceRenderer}
                module={module}
                section={section}
                path={path}
              />
              <div className="relative hidden flex-grow 2xl:block pt-10">
                <VideoTranscript transcript={transcript} />
              </div>
            </div>
            <article className="relative flex-shrink-0 2xl:w-full 2xl:max-w-md">
              <div className="relative z-10 mx-auto max-w-4xl py-5 sm:px-8 px-5 lg:py-6 2xl:max-w-xl">
                <LessonTitle />
                {resources?.github?.repo && (
                  <GitHubLink
                    exercise={lesson}
                    module={module}
                    loadingIndicator={<Spinner className="h-7 w-7" />}
                    url={resources?.github?.repo}
                    repository="Code"
                  />
                )}
                <LessonDescription
                  lessonMDXBody={lessonBody}
                  lessonBodyPreview={lessonBodyPreview}
                  productName={module.title}
                  loadingIndicator={<Spinner />}
                />
                {(lesson._type === 'solution' ||
                  lesson._type === 'explainer') &&
                  session && <LessonCompletionToggle />}
                <div className="relative z-10 block flex-grow 2xl:hidden pt-10">
                  <VideoTranscript transcript={transcript} />
                </div>
              </div>
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

export default LessonTemplate
