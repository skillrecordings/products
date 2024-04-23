import * as React from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import {motion} from 'framer-motion'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react'
import pluralize from 'pluralize'
import {capitalize, divide} from 'lodash'
import Balancer from 'react-wrap-balancer'

import {cn} from '@skillrecordings/ui/utils/cn'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {ArticleJsonLd, CourseJsonLd} from '@skillrecordings/next-seo'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import {ModuleProgress} from '@skillrecordings/skill-lesson/video/module-progress'
import * as LessonCompletionToggle from '@skillrecordings/skill-lesson/video/lesson-completion-toggle'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ScrollAreaPrimitive} from '@skillrecordings/ui/primitives/scroll-area'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {Button, ScrollArea, ScrollBar, Skeleton} from '@skillrecordings/ui'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {LessonDescription} from '@skillrecordings/skill-lesson/video/lesson-description'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import GitHubLink from '@skillrecordings/skill-lesson/video/github-link'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'

import {trpc} from '@/trpc/trpc.client'
import BlockedOverlay from '@/components/video-overlays/blocked-overlay'
import Container from '@/components/app/container'
import Spinner from '@/components/spinner'
import Layout from '@/components/app/layout'
import ProgressBar from '@/components/progress-bar'
import {getOgImage} from '@/utils/get-og-image'
import {track} from '@/utils/analytics'
import {lessonPathBuilder} from '@/utils/lesson-path-builder'

const NavigationProgressModule: React.FC<{
  module: Module
  moduleProgress: ModuleProgress
  moduleProgressStatus: 'error' | 'loading' | 'success'
}> = ({module, moduleProgress, moduleProgressStatus}) => {
  const percentComplete = moduleProgress
    ? Number(
        (
          (100 * moduleProgress.completedLessonCount) /
          moduleProgress.lessonCount
        ).toFixed(0),
      )
    : 0
  return moduleProgress ? (
    moduleProgressStatus === 'loading' ? (
      <Skeleton className="h-10 w-[220px] rounded-md bg-gradient-to-br from-gray-200 to-white opacity-100 dark:from-gray-700 dark:to-gray-800 dark:opacity-40" />
    ) : (
      <div className="flex items-center">
        <span className="ml-2 mr-3 text-lg text-er-gray-500">/</span>
        {module?.image && (
          <div className="mr-2 inline-block h-10 w-10">
            <Image
              src={module.image}
              alt={module.title}
              width={40}
              height={40}
            />
          </div>
        )}
        <div className="flex flex-col">
          {module?.resources && (
            <h4 className="inline-block text-sm font-semibold leading-tight md:text-base">
              <Link
                href={`/modules/${module.slug.current}/${module.resources[0]?.slug}`}
              >
                {module.title}
              </Link>
            </h4>
          )}
          <ProgressBar percentComplete={percentComplete} />
        </div>
      </div>
    )
  ) : null
}

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
  const pageTitle = title
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? ogImage : {url: moduleOGImage}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${pluralize('module')}`
  const {data: session, status: sessionStatus} = useSession()

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: lessonResources, status: lessonResourcesStatus} =
    trpc.lessonResources.byLessonSlug.useQuery({slug: lesson.slug})

  const exerciseCount = section
    ? section.lessons && section.lessons.length
    : module.lessons && module.lessons.length

  const displayLessonCompletionToggle =
    (lesson._type === 'solution' ||
      lesson._type === 'explainer' ||
      lesson._type === 'exercise' ||
      lesson._type === 'lesson' ||
      lesson._type === 'interview') &&
    session

  const epicReactModule = {...module, moduleType: 'module'}

  // TODO: fix hydration issue
  // const [isTheaterMode, setIsTheaterMode] = useLocalStorage(
  //   'theaterMode',
  //   false,
  // )
  const [isTheaterMode, setIsTheaterMode] = React.useState<boolean>(false)

  console.log({transcript, lessonBodySerialized, lessonBodyPreviewSerialized})

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
        navigationProps={{
          navChildren: (
            <NavigationProgressModule
              module={epicReactModule}
              moduleProgress={moduleProgress as ModuleProgress}
              moduleProgressStatus={moduleProgressStatus}
            />
          ),
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
        <div className="mx-auto mt-5 w-full max-w-7xl px-5 sm:px-6">
          {/* <AnimateSharedLayout> */}
          <div className="mx-auto grid grid-cols-1 pb-5 sm:pb-16 md:grid-cols-6 md:gap-4">
            <motion.div
              className={isTheaterMode ? ' col-span-6' : 'col-span-4'}
            >
              <div className="-mx-5 md:mx-0">
                <motion.div
                  layout
                  className="relative overflow-hidden rounded-none bg-gray-100 md:rounded-md"
                >
                  <Video
                    product={module?.product as SanityProduct}
                    ref={muxPlayerRef}
                    exerciseOverlayRenderer={() => <div>TODO</div>}
                    blockedOverlayRenderer={BlockedOverlay}
                    loadingIndicator={<Spinner />}
                  />
                </motion.div>
              </div>
              <motion.div
                className={
                  isTheaterMode
                    ? 'grid grid-cols-1 md:grid-cols-6 md:gap-4'
                    : ''
                }
              >
                <div className={isTheaterMode ? 'col-span-4' : ''}>
                  <div className="flex w-full items-center justify-end py-5 sm:py-6">
                    {displayLessonCompletionToggle && (
                      <section aria-label="track progress" className="group">
                        <div className="mx-auto flex w-full max-w-4xl items-center justify-center gap-5 px-5">
                          {/* {sessionStatus === 'loading' ? (
                            <Skeleton className="h-10 w-full" />
                          ) : ( */}
                          <LessonCompletionToggle.Root>
                            <Button asChild variant="secondary">
                              <LessonCompletionToggle.Toggle className="flex cursor-pointer flex-row-reverse items-center gap-1 rounded p-3 data-[fetching='true']:cursor-wait [&>button]:x-[relative,h-5,w-10,rounded-full,border,border-gray-700/50,bg-gray-800,shadow-md,shadow-black/50] [&_button>span[data-state='checked']]:x-[translate-x-5] [&_button>span]:x-[block,h-4,w-4,translate-x-0.5,rounded-full,bg-gray-200,shadow-sm,shadow-black/50,transition-all,ease-out] [&_button[data-state='checked']]:x-[bg-primary]">
                                <span className="text-base">
                                  Mark as complete
                                </span>
                              </LessonCompletionToggle.Toggle>
                            </Button>
                          </LessonCompletionToggle.Root>
                          {/* )} */}
                        </div>
                      </section>
                    )}
                  </div>
                  <hr className="border-er-gray-300 opacity-50" />
                  <div className="md:prose-md prose mx-auto mt-8 max-w-none pb-12 sm:pb-16 md:mt-10 lg:mt-12">
                    <MDX contents={lessonBodySerialized} />
                    <VideoTranscript transcript={transcript} />
                  </div>
                </div>
                {isTheaterMode && (
                  <div className="relative mt-6 w-full sm:pb-5 md:col-span-2 md:pl-2">
                    <motion.div
                      layoutId="list"
                      className="sm:sticky sm:top-20"
                      style={{maxHeight: 'calc(100dvh - 300px)'}}
                    >
                      <LessonList
                        module={epicReactModule}
                        moduleProgressStatus={moduleProgressStatus}
                        path={path}
                        isTheaterMode={isTheaterMode}
                        theaterModeHandler={setIsTheaterMode}
                      />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
            {!isTheaterMode && (
              <div className="mt-6 w-full sm:mt-0 sm:pb-5 md:col-span-2 md:pl-2">
                <motion.div
                  layoutId="list"
                  className="sm:sticky sm:top-[81px]"
                  style={{maxHeight: 'calc(100dvh - 300px)'}}
                >
                  <LessonList
                    module={epicReactModule}
                    moduleProgressStatus={moduleProgressStatus}
                    path={path}
                    isTheaterMode={isTheaterMode}
                    theaterModeHandler={setIsTheaterMode}
                  />
                </motion.div>
              </div>
            )}
          </div>
          {/* </AnimateSharedLayout> */}
        </div>
      </Layout>
    </VideoProvider>
  )
}

export default ExerciseTemplate

const LessonList: React.FC<{
  module: Module
  moduleProgressStatus: 'error' | 'loading' | 'success'
  className?: string
  scrollAreaClassName?: string
  path: string
  isTheaterMode: boolean
  theaterModeHandler: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
  module,
  moduleProgressStatus,
  className,
  scrollAreaClassName,
  path,
  isTheaterMode,
  theaterModeHandler,
}) => {
  const scrollContainerRef = React.useRef<any>(null)

  return (
    <div className="group relative">
      {/* <div ref={ref}>
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
                <Link href={`${path}/${module.slug.current}`}>
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
      </div> */}

      <ScrollAreaPrimitive.Root
        className="relative flex flex-col bg-gray-50 dark:bg-background"
        style={scrollAreaClassName ? {} : {maxHeight: `calc(100dvh - 300px)`}}
      >
        <ScrollAreaPrimitive.Viewport
          className={cn(
            'flex-grow rounded-md border border-er-gray-200',
            className,
            scrollAreaClassName,
          )}
          ref={scrollContainerRef}
        >
          <Collection.Root
            module={module}
            lessonPathBuilder={lessonPathBuilder}
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
            <Collection.Sections
              data-lessons-list
              className="space-y-0 bg-er-gray-100 [&_[data-state]]:animate-none"
            >
              {moduleProgressStatus === 'loading' ? (
                <Skeleton className="h-24 rounded-none bg-gradient-to-br from-gray-200 to-white opacity-100 dark:from-gray-700 dark:to-gray-800 dark:opacity-40" />
              ) : (
                <Collection.Section className="border-er-gray-200 bg-transparent font-semibold leading-tight transition data-[state='open']:rounded-none data-[state]:rounded-none data-[state='closed']:border-b hover:bg-er-gray-300 [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-green-500 dark:[&>[data-check-icon]]:text-green-500 [&>[data-progress]]:h-[2px] [&>[data-progress]]:bg-primary dark:[&>[data-progress]]:bg-primary">
                  <Collection.Lessons className="border-none bg-transparent py-0">
                    <Collection.Lesson
                      className='pl-4 transition before:hidden data-[active="true"]:bg-white hover:bg-er-gray-300 dark:data-[active="true"]:bg-er-gray-200 dark:hover:data-[active="true"]:bg-er-gray-300 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-green-500 [&_[data-check-icon]]:opacity-100 dark:[&_[data-check-icon]]:text-green-500 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:transition [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:w-3.5  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500'
                      scrollContainerRef={scrollContainerRef}
                    >
                      <Collection.Resources />
                    </Collection.Lesson>
                  </Collection.Lessons>
                </Collection.Section>
              )}
            </Collection.Sections>
            <Collection.Lessons className="bg-er-gray-100 py-0">
              <Collection.Lesson className='bg-transparent font-semibold transition before:hidden data-[active="true"]:bg-white data-[active="true"]:opacity-100 data-[active="true"]:shadow-lg data-[active="true"]:shadow-gray-500/10 dark:data-[active="true"]:bg-gray-800/60 dark:data-[active="true"]:shadow-black/10 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-blue-500  dark:[&_[data-check-icon]]:text-green-500 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:opacity-90 [&_[data-item]>div]:transition hover:[&_[data-item]>div]:opacity-100 [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:w-3.5  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500' />
            </Collection.Lessons>
          </Collection.Root>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
      <button
        onClick={() => theaterModeHandler(!isTheaterMode)}
        className={cn(
          'absolute right-2 z-10 hidden items-center justify-center rounded-md bg-background p-2 text-text opacity-0 duration-150 group-hover:opacity-75 group-hover:hover:bg-blue-500 group-hover:hover:opacity-100 lg:flex',
          isTheaterMode ? 'top-2' : 'bottom-2',
        )}
      >
        {isTheaterMode ? (
          // prettier-ignore
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16"><g fill="currentColor"><path fill="currentColor" d="M7,7v8c0,0.6,0.4,1,1,1h0c0.6,0,1-0.4,1-1V7h5L8,0L2,7H7z"></path></g></svg>
        ) : (
          // prettier-ignore
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16"><g fill="currentColor"><path fill="currentColor" d="M9,9V1c0-0.6-0.4-1-1-1h0C7.4,0,7,0.4,7,1v8H2l6,7l6-7H9z"></path></g></svg>
        )}
      </button>
    </div>
  )
}
