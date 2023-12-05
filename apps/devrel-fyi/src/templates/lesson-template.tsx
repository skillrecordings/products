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
import Spinner from '@/components/spinner'
import pluralize from 'pluralize'
import GitHubLink from '@skillrecordings/skill-lesson/video/github-link'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import {Button, ScrollArea, ScrollBar, Skeleton} from '@skillrecordings/ui'
import Image from 'next/image'
import Link from 'next/link'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {capitalize} from 'lodash'
import {cn} from '@skillrecordings/ui/utils/cn'
import {getOgImage} from '@/utils/get-og-image'
import {ScrollAreaPrimitive} from '@skillrecordings/ui/primitives/scroll-area'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'

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
    image: module.image,
  })
  const {ogImage: moduleOGImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? ogImage : {url: moduleOGImage}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${pluralize(module.moduleType)}`
  const {data: session} = useSession()

  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: lessonResources, status: lessonResourcesStatus} =
    trpc.lessonResources.byLessonSlug.useQuery({slug: lesson.slug})

  const exerciseCount = section
    ? section.lessons && section.lessons.length
    : module.lessons && module.lessons.length

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: module.slug.current,
        moduleType: 'workshop',
        lessonSlug: lesson.slug,
        isSolution: lesson._type === 'solution',
        sectionSlug: section?.slug,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  const canViewContent = ability.can('view', 'Content')

  const displayLessonCompletionToggle =
    (lesson._type === 'solution' ||
      lesson._type === 'explainer' ||
      lesson._type === 'lesson' ||
      lesson._type === 'interview') &&
    session

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      path={path}
      onModuleEnded={async () => {
        addProgressMutation.mutate({lessonSlug: router.query.lesson as string})
      }}
      // @ts-expect-error
      inviteTeamPagePath={`/products/${module.product?.slug}`}
    >
      <Layout
        meta={{
          title: pageTitle,
          openGraph: {
            images: [{url: shareCard.url as string}],
            description: pageDescription as string,
          },
        }}
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
        <div className="relative flex flex-grow flex-col lg:flex-row 2xl:h-[calc(100vh-49px)] 2xl:overflow-y-hidden">
          <div className="relative z-40 hidden w-full lg:block lg:max-w-[330px]">
            <LessonList module={module} path={path} />
          </div>
          <main className="relative mx-auto w-full max-w-[1480px] items-start border-gray-200 dark:border-gray-900 2xl:flex 2xl:max-w-none">
            <div className="flex flex-col border-gray-200 scrollbar-thin scrollbar-thumb-foreground/10 dark:border-gray-800 2xl:relative 2xl:h-[calc(100vh-48px)] 2xl:w-full 2xl:overflow-y-scroll 2xl:border-r">
              <div className="dark bg-gray-900">
                <Video
                  product={module?.product as SanityProduct}
                  ref={muxPlayerRef}
                  exerciseOverlayRenderer={() => <div>TODO</div>}
                  loadingIndicator={<Spinner />}
                />
              </div>
              <details data-mobile-module-lesson-list="">
                <summary>
                  <Balancer>
                    {section
                      ? `Current section: ${section.title}`
                      : module.title}{' '}
                    {section ? null : capitalize(module.moduleType)}{' '}
                  </Balancer>
                  <span data-byline="">{exerciseCount || 0} exercises</span>
                </summary>
                <LessonList
                  className="block lg:hidden"
                  scrollAreaClassName="h-[400px]"
                  module={module}
                  path={path}
                />
              </details>
              <div className="relative hidden flex-grow border-t border-gray-200 dark:border-gray-900 2xl:block">
                <VideoTranscript transcript={transcript} />
              </div>
            </div>
            <article className="relative flex-shrink-0 2xl:w-full 2xl:max-w-2xl">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 scrollbar-thin scrollbar-thumb-foreground/10 lg:py-6 2xl:h-[calc(100vh-48px)] 2xl:w-full 2xl:max-w-2xl 2xl:overflow-y-scroll">
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

                {(lessonBodySerialized || lessonBodyPreviewSerialized) && (
                  <LessonDescription
                    mdxComponents={{
                      Callout: (props) => {
                        const {type, children} = props
                        return (
                          <blockquote className="!border-l-7 rounded-md !border-primary bg-foreground/5 !px-6 py-5 !not-italic prose-p:!mb-0 [&>p]:first-of-type:before:content-['']">
                            {children}
                          </blockquote>
                        )
                      },
                      // TODO: following only work in local workshop app
                      InlineFile: (props) => {
                        const {type, file} = props
                        if (type) {
                          return type
                        }
                        if (file) {
                          return file
                        }
                        return null
                      },
                      LinkToApp: (props) => {
                        const {to} = props
                        return to
                      },
                      CodeFile: (props) => {
                        return props.file
                      },
                      DiffLink: (props) => {
                        return props.children
                      },
                      Link: (props) => {
                        return props.children
                      },
                    }}
                    lessonMDXBody={lessonBodySerialized}
                    lessonBodyPreview={lessonBodyPreviewSerialized}
                    productName={module.title}
                    loadingIndicator={<Spinner />}
                  />
                )}
                {displayLessonCompletionToggle && <LessonCompletionToggle />}
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
    <div className="sticky top-0 border-r">
      <div ref={ref}>
        <div className="relative z-10 flex items-center space-x-3 border-b border-r border-white/5 bg-gray-50 px-2 py-3 dark:bg-foreground/10 dark:shadow-xl dark:shadow-black/20">
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
                className="mt-2 inline-flex h-auto items-center space-x-1 px-1.5 py-1 text-xs font-semibold uppercase leading-none"
              >
                <Link href={module?.github?.repo + '#setup'} target="_blank">
                  <Icon name="Github" size="16" />
                  <span>
                    {module.moduleType === 'tutorial' ? 'Code' : 'Workshop App'}
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <ScrollAreaPrimitive.Root
        className="relative flex flex-col"
        style={scrollAreaClassName ? {} : {height: `calc(100vh - ${height}px)`}}
      >
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-24 w-full bg-gradient-to-t from-background to-transparent"
          aria-hidden
        />
        <ScrollAreaPrimitive.Viewport
          className={cn('flex-grow pb-[48px]', className, scrollAreaClassName)}
          ref={scrollContainerRef}
        >
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
                <Skeleton className="h-14 rounded-none bg-gradient-to-br from-gray-200 to-white opacity-100 dark:from-gray-700 dark:to-gray-800 dark:opacity-40" />
              ) : (
                <Collection.Section className="border-b font-semibold leading-tight transition data-[state]:rounded-none data-[state='closed']:opacity-75 data-[state='closed']:hover:opacity-100 [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-blue-500 dark:[&>[data-check-icon]]:text-blue-300 [&>[data-progress]]:h-[2px] [&>[data-progress]]:bg-blue-500 dark:[&>[data-progress]]:bg-gray-700">
                  <Collection.Lessons className="py-0">
                    <Collection.Lesson
                      className='font-semibold transition before:hidden data-[active="true"]:bg-white data-[active="true"]:opacity-100 data-[active="true"]:shadow-lg data-[active="true"]:shadow-gray-500/10 dark:data-[active="true"]:bg-gray-800/60 dark:data-[active="true"]:shadow-black/10 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-blue-500  dark:[&_[data-check-icon]]:text-blue-300 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:opacity-90 [&_[data-item]>div]:transition hover:[&_[data-item]>div]:opacity-100 [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:w-3.5  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500'
                      scrollContainerRef={scrollContainerRef}
                    >
                      <Collection.Resources />
                    </Collection.Lesson>
                  </Collection.Lessons>
                </Collection.Section>
              )}
            </Collection.Sections>
            {/* Used if module has either none or single section so they can be styled differently */}
            <Collection.Lessons className="py-0">
              <Collection.Lesson className='font-semibold transition before:hidden data-[active="true"]:bg-white data-[active="true"]:opacity-100 data-[active="true"]:shadow-lg data-[active="true"]:shadow-gray-500/10 dark:data-[active="true"]:bg-gray-800/60 dark:data-[active="true"]:shadow-black/10 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-blue-500  dark:[&_[data-check-icon]]:text-blue-300 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:opacity-90 [&_[data-item]>div]:transition hover:[&_[data-item]>div]:opacity-100 [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:w-3.5  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500' />
            </Collection.Lessons>
          </Collection.Root>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </div>
  )
}
