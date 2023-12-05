import * as React from 'react'
import Layout from '@/components/app/layout'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {ArticleJsonLd, CourseJsonLd} from '@skillrecordings/next-seo'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {useRouter} from 'next/router'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonDescription} from '@skillrecordings/skill-lesson/video/lesson-description'
import {LessonTitle} from '@skillrecordings/skill-lesson/video/lesson-title'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {trpc} from '@/trpc/trpc.client'
import LessonCompletionToggle from '@skillrecordings/skill-lesson/video/lesson-completion-toggle'
import {useSession} from 'next-auth/react'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import Balancer from 'react-wrap-balancer'
import {useMeasure, useSize} from 'react-use'
import ExerciseOverlay from '@/components/exercise-overlay'
import Spinner from '@/components/spinner'
import pluralize from 'pluralize'
import GitHubLink from '@skillrecordings/skill-lesson/video/github-link'
import GitpodLink from '@/components/gitpod-link'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import {Button, ScrollArea, Skeleton} from '@skillrecordings/ui'
import Image from 'next/image'
import Link from 'next/link'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {capitalize} from 'lodash'
import {cn} from '@skillrecordings/ui/utils/cn'
import {isBrowser} from '@/utils/is-browser'
import {getOgImage} from '@/utils/get-og-image'

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
  const ogImage = getOgImage({
    title,
    byline: module.title,
    // image: module.image,
  })
  const {ogImage: moduleOGImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? ogImage : moduleOGImage
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${pluralize(module.moduleType)}`
  const {data: session} = useSession()

  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: lessonResources, status: lessonResourcesStatus} =
    trpc.lessonResources.byLessonSlug.useQuery({
      slug: lesson.slug,
      type: lesson._type,
    })

  const exerciseCount = section
    ? section.lessons && section.lessons.length
    : module.lessons && module.lessons.length

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
        meta={{
          title: pageTitle,
          openGraph: {
            images: [{url: shareCard as string}],
            description: pageDescription as string,
          },
        }}
        className="px-3 pt-5 sm:px-5 sm:pt-0"
        navigationProps={{
          linksClassName: 'absolute',
        }}
        // navigationClassName="w-full max-w-none"
        // navigationContainerClassName="relative dark:shadow-none"
        // navigationSize="sm"
      >
        <CourseJsonLd
          courseName={title}
          description={pageDescription || ''}
          provider={{
            name: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
            type: 'Person',
            url: isBrowser()
              ? document.location.href
              : process.env.NEXT_PUBLIC_URL,
          }}
        />
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
        <div className="relative flex flex-grow flex-col gap-3 lg:flex-row">
          <div className="relative z-40 hidden w-full flex-shrink-0 lg:block lg:max-w-[300px]">
            <LessonList module={module} path={path} />
          </div>
          <main className="relative mx-auto w-full max-w-[1480px] items-start gap-3 2xl:flex 2xl:max-w-none">
            <div className="flex flex-col overflow-hidden rounded-t border bg-card 2xl:relative 2xl:h-full 2xl:w-full">
              <Video
                product={module?.product as SanityProduct}
                ref={muxPlayerRef}
                exerciseOverlayRenderer={() => <ExerciseOverlay />}
                loadingIndicator={<Spinner />}
              />
              <details data-mobile-module-lesson-list="">
                <summary>
                  <Balancer>
                    {section ? `${section.title}` : module.title}{' '}
                    {section ? null : capitalize(module.moduleType)}{' '}
                  </Balancer>
                  <span data-byline="">{exerciseCount || 0} exercises</span>
                </summary>
                <div className="mt-2">
                  <LessonList
                    className="block max-h-[300px] pt-2 lg:hidden"
                    scrollAreaClassName="h-[300px] p-0"
                    module={module}
                    path={path}
                  />
                </div>
              </details>
              <div className="relative hidden flex-grow 2xl:block">
                <VideoTranscript transcript={transcript} />
              </div>
            </div>
            <article className="relative flex-shrink-0 border-x bg-card 2xl:rounded-t 2xl:border">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:px-10 lg:py-6 2xl:max-w-xl">
                <LessonTitle />
                {lessonResources?.github || lessonResources?.gitpod ? (
                  <div className="flex flex-wrap items-center gap-2 pb-8">
                    {lessonResources?.github && (
                      <GitHubLink
                        exercise={lesson}
                        loadingIndicator={<Spinner />}
                        module={module}
                        url={lessonResources.github}
                        repository="Code"
                      />
                    )}
                    {lessonResources?.gitpod && <GitpodLink />}
                  </div>
                ) : null}
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

const LessonList: React.FC<{
  module: Module
  className?: string
  scrollAreaClassName?: string
  path: string
}> = ({module, className, scrollAreaClassName, path}) => {
  const scrollContainerRef = React.useRef<any>(null)

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  const [ref, {height}] = useMeasure<HTMLDivElement>()

  return (
    <div className="top-3 overflow-hidden sm:sticky">
      <div ref={ref} className="rounded border bg-card">
        <div className="relative z-10 flex items-center space-x-3 px-2 py-3">
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
              <Link href={`${path}/${module.slug.current!}`}>
                {module.title}
              </Link>
            </h3>

            {module?.github?.repo && (
              <Button
                asChild
                size="sm"
                className="mt-2 inline-flex h-auto items-center space-x-1 rounded-sm px-1.5 py-1 text-xs font-semibold uppercase leading-none"
              >
                <Link href={module?.github?.repo} target="_blank">
                  <Icon name="Github" size="16" />
                  <span>
                    {module.moduleType === 'tutorial'
                      ? 'Code'
                      : 'Connect Workshop App'}
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className={cn('h-screen  bg-background', className)}>
        <ScrollArea
          className={cn(
            `h-[calc(100vh - pt-3 ${height + 76}px)]`,
            scrollAreaClassName,
          )}
          ref={scrollContainerRef}
        >
          <Collection.Root
            module={module}
            resourcesRenderer={(type) => {
              return (
                <>
                  {(type === 'exercise' || type === 'solution') && (
                    <>
                      <Collection.Resource className="text-sm font-medium [&>a[data-active='true']]:border-purple-400 [&>a[data-active='true']]:bg-card [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent">
                        Problem
                      </Collection.Resource>
                      <Collection.Resource
                        path="exercise"
                        className="text-sm font-medium [&>a[data-active='true']]:border-blue-400 [&>a[data-active='true']]:bg-card [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent"
                      >
                        Exercise
                      </Collection.Resource>
                      <Collection.Resource
                        path="solution"
                        className="text-sm font-medium [&>a[data-active='true']]:border-teal-400 [&>a[data-active='true']]:bg-card [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent"
                      >
                        Solution
                      </Collection.Resource>
                    </>
                  )}
                  {type === 'explainer' && (
                    <Collection.Resource className="text-sm font-medium [&>a[data-active='true']]:border-purple-400 [&>a[data-active='true']]:bg-card [&>a]:flex [&>a]:border-l-2 [&>a]:border-transparent">
                      Explainer
                    </Collection.Resource>
                  )}
                </>
              )
            }}
          >
            <Collection.Sections className="space-y-1 [&_[data-state]]:animate-none">
              {moduleProgressStatus === 'loading' ? (
                <Skeleton className="h-14 rounded border bg-gradient-to-r from-white to-gray-200 opacity-75" />
              ) : (
                <Collection.Section className="mb-px border font-semibold leading-tight data-[state='close']:rounded data-[state='open']:rounded-t [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-blue-500 dark:[&>[data-check-icon]]:text-blue-300 [&>[data-progress]]:bg-gradient-to-r [&>[data-progress]]:from-gray-200 [&>[data-progress]]:to-gray-200/50 [&>[data-progress]]:shadow-lg">
                  <Collection.Lessons className="overflow-hidden rounded-b border-gray-200/75 pb-3 pt-0">
                    <Collection.Lesson
                      className='font-semibold transition before:hidden data-[active="true"]:bg-transparent data-[active="true"]:opacity-100 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-blue-500 [&_[data-item="lesson"][data-state="open"]]:border-l-2 [&_[data-item="lesson"][data-state="open"]]:border-blue-500 [&_[data-item="lesson"][data-state="open"]]:bg-card [&_[data-item]>div]:leading-tight [&_[data-item]>div]:opacity-90 [&_[data-item]>div]:transition hover:[&_[data-item]>div]:opacity-100 [&_[data-item]]:items-center [&_[data-item]]:py-3 [&_[data-lock-icon]]:w-3.5 [&_[data-lock-icon]]:text-gray-400'
                      scrollContainerRef={scrollContainerRef}
                    >
                      <Collection.Resources />
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
  )
}
