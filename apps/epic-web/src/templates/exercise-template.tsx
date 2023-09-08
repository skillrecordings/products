import * as React from 'react'
import Layout from 'components/app/layout'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {Video} from '@skillrecordings/skill-lesson/video/video'
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
import {trpc} from 'trpc/trpc.client'
import LessonCompletionToggle from '@skillrecordings/skill-lesson/video/lesson-completion-toggle'
import {useSession} from 'next-auth/react'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {
  ExplainerLink,
  ProblemLink,
  SolutionLink,
} from '@skillrecordings/skill-lesson/video/module-lesson-list/lesson-list'
import ExerciseOverlay from 'components/exercise-overlay'
import Spinner from 'components/spinner'
import pluralize from 'pluralize'
import GitHubLink from '@skillrecordings/skill-lesson/video/github-link'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import * as Collection from '@skillrecordings/ui/module/collection'
import {ScrollArea, Skeleton} from '@skillrecordings/ui'
import Image from 'next/image'
import Link from 'next/link'
import {Icon} from '@skillrecordings/skill-lesson/icons'

const ExerciseTemplate: React.FC<{
  transcript: any[]
  lessonBodySerialized: MDXRemoteSerializeResult
  lessonBodyPreviewSerialized: MDXRemoteSerializeResult
}> = ({transcript, lessonBodySerialized, lessonBodyPreviewSerialized}) => {
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
  const {data: lessonResources, status: lessonResourcesStatus} =
    trpc.lessonResources.byLessonSlug.useQuery({slug: lesson.slug})
  const lessonResourceRenderer = (
    path: string,
    module: Module,
    lesson: Lesson,
    section?: Section,
  ) => {
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

  const scrollContainerRef = React.useRef<any>(null)

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      path={path}
      onModuleEnded={async () => {
        addProgressMutation.mutate({lessonSlug: router.query.lesson as string})
      }}
    >
      <Layout
        meta={{title: pageTitle, ...shareCard, description: pageDescription}}
        navigationClassName="max-w-none"
        navigationContainerClassName="relative"
        navigationSize="sm"
        className="pt-0 sm:pt-0"
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
        <div className="relative flex flex-grow flex-col lg:flex-row">
          {/* <LargeScreenModuleLessonList
            lessonResourceRenderer={lessonResourceRenderer}
            module={module}
            path={path}
          /> */}
          <div className="relative z-40 w-full lg:max-w-[300px]">
            <div className="flex items-center space-x-3 border-r bg-gray-50 px-2 py-3 dark:bg-foreground/10">
              {module.image && (
                <Image
                  src={module.image}
                  width={75}
                  height={75}
                  alt={module.title}
                />
              )}
              <div>
                <h3 className="text-lg font-semibold leading-tight">
                  <Link href={`/${path}/${module.slug.current!}`}>
                    {module.title}
                  </Link>
                </h3>
                {module?.github?.repo && (
                  <Link
                    href={module.github.repo + '#setup'}
                    target="_blank"
                    className="mt-2 inline-flex items-center space-x-1 rounded bg-blue-500 px-1.5 py-1 text-xs font-semibold uppercase leading-none text-background transition hover:bg-blue-600 dark:bg-blue-600 dark:text-foreground dark:hover:bg-blue-500"
                  >
                    <Icon name="Github" size="16" />
                    <span>
                      {module.moduleType === 'tutorial'
                        ? 'Code'
                        : 'Connect Workshop App'}
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className="sticky top-0 border-r">
              <ScrollArea className="h-[calc(100vh)]" ref={scrollContainerRef}>
                <Collection.Root
                  module={module}
                  resourcesRenderer={(type) => {
                    return (
                      <>
                        {(type === 'exercise' || type === 'solution') && (
                          <>
                            <Collection.Resource className="text-sm font-medium [&>a[data-active='true']]:border-orange-400 [&>a[data-active='true']]:bg-white/5 [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent">
                              Problem
                            </Collection.Resource>
                            <Collection.Resource
                              path="exercise"
                              className="text-sm font-medium [&>a[data-active='true']]:border-indigo-400 [&>a[data-active='true']]:bg-purple-500 [&>a[data-active='true']]:bg-white/5 [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent"
                            >
                              Exercise
                            </Collection.Resource>
                            <Collection.Resource
                              path="solution"
                              className="text-sm font-medium [&>a[data-active='true']]:border-cyan-400 [&>a[data-active='true']]:bg-teal-500 [&>a[data-active='true']]:bg-white/5 [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent"
                            >
                              Solution
                            </Collection.Resource>
                          </>
                        )}
                        {type === 'explainer' && (
                          <Collection.Resource className="text-sm font-medium [&>a[data-active='true']]:border-indigo-400 [&>a[data-active='true']]:bg-teal-500 [&>a[data-active='true']]:bg-white/5 [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent">
                            Explainer
                          </Collection.Resource>
                        )}
                      </>
                    )
                  }}
                >
                  <Collection.Sections className="space-y-0 [&_[data-state]]:animate-none">
                    {moduleProgressStatus === 'loading' ? (
                      <Skeleton className="h-16 rounded-none bg-gradient-to-br from-gray-700 to-gray-800 opacity-40" />
                    ) : (
                      <Collection.Section
                        className="mb-px font-semibold leading-tight data-[state]:rounded-none [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-blue-500 dark:[&>[data-check-icon]]:text-blue-300 [&>[data-progress]]:bg-gradient-to-r [&>[data-progress]]:from-gray-200 [&>[data-progress]]:to-gray-200/50 [&>[data-progress]]:shadow-lg dark:[&>[data-progress]]:from-gray-800
                      dark:[&>[data-progress]]:to-gray-800/50"
                      >
                        <Collection.Lessons className="py-0">
                          <Collection.Lesson
                            className='font-semibold transition before:hidden data-[active="true"]:bg-white data-[active="true"]:opacity-100 data-[active="true"]:shadow-lg data-[active="true"]:shadow-gray-500/10 dark:data-[active="true"]:bg-gray-800/60 dark:data-[active="true"]:shadow-black/10 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-blue-500 dark:[&_[data-check-icon]]:text-blue-300 [&_[data-item]>div]:leading-tight [&_[data-item]>div]:opacity-90 [&_[data-item]>div]:transition hover:[&_[data-item]>div]:opacity-100 [&_[data-item]]:items-start'
                            scrollContainerRef={scrollContainerRef}
                          >
                            <Collection.Resources className="pb-2" />
                          </Collection.Lesson>
                        </Collection.Lessons>
                      </Collection.Section>
                    )}
                  </Collection.Sections>
                  {/* Used if module has either none or single section so they can be styled differently */}
                  <Collection.Lessons>
                    <Collection.Lesson />
                  </Collection.Lessons>
                </Collection.Root>
              </ScrollArea>
            </div>
          </div>
          <main className="relative mx-auto w-full max-w-[1480px] items-start border-t border-gray-200 dark:border-gray-900 2xl:flex 2xl:max-w-none">
            <div className="flex flex-col border-gray-200 dark:border-gray-900 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
              <Video
                product={module?.product as SanityProduct}
                ref={muxPlayerRef}
                exerciseOverlayRenderer={() => <ExerciseOverlay />}
                loadingIndicator={<Spinner />}
              />
              <MobileModuleLessonList
                lessonResourceRenderer={lessonResourceRenderer}
                module={module}
                section={section}
                path={path}
              />
              <div className="relative hidden flex-grow border-t border-gray-200 dark:border-gray-900 2xl:block">
                <VideoTranscript transcript={transcript} />
              </div>
            </div>
            <article className="relative flex-shrink-0">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-6 2xl:max-w-xl">
                <LessonTitle />
                {lessonResources?.github && (
                  <GitHubLink
                    exercise={lesson}
                    loadingIndicator={<Spinner />}
                    module={module}
                    url={lessonResources.github}
                    repository="Code"
                  />
                )}
                <LessonDescription
                  lessonMDXBody={lessonBodySerialized}
                  lessonBodyPreview={lessonBodyPreviewSerialized}
                  productName={module.title}
                  loadingIndicator={<Spinner />}
                />
                {(lesson._type === 'solution' ||
                  lesson._type === 'explainer' ||
                  lesson._type === 'lesson') &&
                  session && <LessonCompletionToggle />}
              </div>
              <div className="relative z-10 block flex-grow 2xl:hidden">
                <VideoTranscript transcript={transcript} />
              </div>
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

export default ExerciseTemplate
