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
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {trpc} from '@/trpc/trpc.client'
import * as LessonCompletionToggle from '@skillrecordings/skill-lesson/video/lesson-completion-toggle'
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
import Container from '@/components/app/container'
import {track} from '@/utils/analytics'

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
  const {data: session, status: sessionStatus} = useSession()

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
        <Container className="flex px-5 sm:px-0 lg:px-0">
          <div className="relative z-40 hidden w-full lg:block lg:max-w-[330px]">
            <LessonList module={module} path={path} />
          </div>
          <main className="relative w-full">
            <div>
              <Video
                product={module?.product as SanityProduct}
                ref={muxPlayerRef}
                exerciseOverlayRenderer={() => <div>TODO</div>}
                loadingIndicator={<Spinner />}
              />
              {/* MOBILE NAV */}
              <details className="sm:hidden">
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
              {/* <div className="relative hidden flex-grow border-t border-gray-200 dark:border-gray-900 2xl:block">
                <VideoTranscript transcript={transcript} />
              </div> */}
            </div>
            <article className="relative flex-shrink-0 py-5 2xl:w-full 2xl:max-w-2xl">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 scrollbar-thin scrollbar-thumb-foreground/10 lg:py-6 2xl:h-[calc(100vh-48px)] 2xl:w-full 2xl:max-w-2xl 2xl:overflow-y-scroll">
                {/* <LessonTitle /> */}
                <div className="flex w-full flex-col items-center justify-between sm:flex-row">
                  <div>
                    <span
                      className={cn(
                        'text-xs font-semibold uppercase text-muted-foreground',
                      )}
                      // data-lesson-badge={lesson._type}
                    >
                      {lesson._type !== 'exercise' ? lesson._type : 'Problem'}
                    </span>
                    <h1 className="pt-2 text-4xl font-bold">
                      <Balancer>{title}</Balancer>
                    </h1>
                  </div>
                  {lessonResources?.github && (
                    <Button
                      asChild
                      variant="outline"
                      className="gap-1 text-lg"
                      size="lg"
                    >
                      <a
                        onClick={() => {
                          track('clicked github code link', {
                            lesson: lesson.slug,
                            module: module.slug.current,
                            moduleType: module.moduleType,
                            lessonType: lesson._type,
                          })
                        }}
                        href={lessonResources.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="Github" /> <span>Code</span>
                      </a>
                    </Button>
                  )}
                  {/* <GitHubLink
                    className="flex gap-2 p-3"
                    exercise={lesson}
                    loadingIndicator={<Spinner />}
                    module={module}
                    url={lessonResources.github}
                    repository="Code"
                  /> */}
                </div>

                {(lessonBodySerialized || lessonBodyPreviewSerialized) && (
                  <LessonDescription
                    className="prose prose-lg mt-10 max-w-none dark:prose-invert"
                    loadingRenderer={(lesson) => {
                      return (
                        <div role="status">
                          {new Array(6).fill(0).map((_, index) => (
                            <div key={index} />
                          ))}
                          <span className="sr-only">
                            Loading {lesson._type}
                          </span>
                        </div>
                      )
                    }}
                    mdxComponents={{
                      Callout: (props) => {
                        const {type, children} = props
                        return (
                          <blockquote className="!border-l-7 rounded-md !border-primary bg-foreground/5 !px-6 py-5 !not-italic prose-p:!mb-0 [&>p]:first-of-type:before:content-['']">
                            {children}
                          </blockquote>
                        )
                      },
                    }}
                    lessonMDXBody={lessonBodySerialized}
                    lessonBodyPreview={lessonBodyPreviewSerialized}
                    productName={module.title}
                    loadingIndicator={<Spinner />}
                  />
                )}
              </div>
            </article>
            {displayLessonCompletionToggle && (
              <section
                aria-label="track progress"
                className="group border-t py-10"
              >
                <div className="mx-auto flex w-full max-w-4xl items-center justify-center gap-5 px-5">
                  {sessionStatus === 'loading' ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <>
                      <h3>Finished this lesson?</h3>
                      <LessonCompletionToggle.Root>
                        <Button asChild variant="secondary">
                          <LessonCompletionToggle.Toggle className="flex cursor-pointer flex-row-reverse items-center gap-1 rounded p-3 data-[fetching='true']:cursor-wait [&>button]:x-[relative,h-5,w-10,rounded-full,border,border-gray-700/50,bg-gray-800,shadow-md,shadow-black/50] [&_button>span[data-state='checked']]:x-[translate-x-5] [&_button>span]:x-[block,h-4,w-4,translate-x-0.5,rounded-full,bg-gray-200,shadow-sm,shadow-black/50,transition-all,ease-out] [&_button[data-state='checked']]:x-[bg-primary]">
                            <span className="text-base">Mark as complete</span>
                          </LessonCompletionToggle.Toggle>
                        </Button>
                      </LessonCompletionToggle.Root>
                    </>
                  )}
                </div>
              </section>
            )}
            {transcript && (
              <section aria-label="transcript" className="group border-t pt-10">
                <div className="mx-auto w-full max-w-4xl px-5">
                  <h3 className="pb-5 text-xl font-bold">Transcript</h3>
                  <VideoTranscript
                    withTitle={false}
                    transcript={transcript}
                    className="prose max-w-none opacity-80 transition dark:prose-invert group-hover:opacity-100"
                  />
                </div>
              </section>
            )}
          </main>
        </Container>
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
        <div className="relative z-10 flex items-center space-x-5 border-b bg-white px-5 py-3 dark:bg-foreground/10 dark:shadow-xl dark:shadow-black/20">
          {module.image && (
            <Image
              src={module.image}
              width={75}
              height={75}
              alt={module.title}
            />
          )}
          <div>
            <h3 className="font-bold leading-tight">
              <Balancer>
                <Link href={`${path}/${module.slug.current!}`}>
                  {module.title}
                </Link>
              </Balancer>
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
        className="relative flex flex-col bg-gray-50 dark:bg-background"
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
                <Skeleton className="h-24 rounded-none bg-gradient-to-br from-gray-200 to-white opacity-100 dark:from-gray-700 dark:to-gray-800 dark:opacity-40" />
              ) : (
                <Collection.Section className="bg-transparent font-semibold leading-tight transition data-[state]:rounded-none data-[state='closed']:border-b data-[state='closed']:opacity-75 data-[state='closed']:hover:opacity-100 [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-primary dark:[&>[data-check-icon]]:text-primary [&>[data-progress]]:h-[2px] [&>[data-progress]]:bg-primary dark:[&>[data-progress]]:bg-primary">
                  <Collection.Lessons className="border-none bg-transparent px-2 pb-5 pt-0">
                    <Collection.Lesson
                      className='rounded font-semibold transition before:hidden data-[active="true"]:bg-white data-[active="true"]:opacity-100 data-[active="true"]:shadow-lg data-[active="true"]:shadow-gray-500/10 dark:data-[active="true"]:bg-gray-800/60 dark:data-[active="true"]:shadow-black/10 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-primary  dark:[&_[data-check-icon]]:text-primary [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:opacity-90 [&_[data-item]>div]:transition hover:[&_[data-item]>div]:opacity-100 [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:w-3.5  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500'
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
