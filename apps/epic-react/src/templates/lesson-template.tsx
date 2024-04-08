import * as React from 'react'
import {motion, AnimateSharedLayout} from 'framer-motion'
import {
  useMedia,
  useWindowSize,
  useLocalStorage,
  useMeasure,
  useSize,
} from 'react-use'

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
import {lessonPathBuilder} from '@/utils/lesson-path-builder'

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
      lesson._type === 'exercise' ||
      lesson._type === 'lesson' ||
      lesson._type === 'interview') &&
    session

  // TODO: added
  const [isTheaterMode, setIsTheaterMode] = useLocalStorage(
    'theaterMode',
    false,
  )

  const {height} = useWindowSize()
  const listMaxHeight = (height - 65) / 1.25

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
        <div className="mx-auto mt-5 w-full max-w-7xl px-5 sm:px-6">
          {/* <AnimateSharedLayout> */}
          <div className="mx-auto grid grid-cols-1 pb-5 sm:pb-16 md:grid-cols-6 md:gap-4">
            <motion.div
              className={isTheaterMode ? ' col-span-6' : 'col-span-4'}
            >
              <>
                <div className="-mx-5 md:mx-0">
                  <motion.div
                    layout
                    // className="relative overflow-hidden rounded-none bg-gray-100 md:rounded-md"
                  >
                    <Video
                      product={module?.product as SanityProduct}
                      ref={muxPlayerRef}
                      exerciseOverlayRenderer={() => <div>TODO</div>}
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
                    <div className="my-5 grid w-full grid-flow-row items-start justify-between gap-4 sm:my-6 sm:grid-flow-col sm:items-center sm:gap-0">
                      <div className="grid grid-flow-row items-start gap-4 sm:grid-flow-col sm:items-center">
                        <button
                          onClick={() => setIsTheaterMode(!isTheaterMode)}
                        >
                          123
                        </button>
                        {/* <PlaybackRateButton
                            availableRates={AVAILABLE_PLAYBACK_RATES}
                            playbackRate={playbackRate}
                            setPlaybackRate={setPlaybackRate}
                          />
                          <RepositoryLink codeUrl={collection.code_url} /> */}

                        {/* {!next &&
                            course.slug === 'welcome-to-epic-react-1044' && (
                              <Link
                                to="/modules/react-fundamentals"
                                state={collection}
                                className="inline-flex items-center rounded-lg border border-transparent bg-blue-500 px-4 py-3 text-sm font-medium leading-none text-white transition duration-150 ease-in-out hover:bg-blue-600"
                              >
                                {'Start learning React'}
                              </Link>
                            )} */}
                      </div>
                      {/* {videoData && isAuthenticated() && (
                          <LessonCompleteToggle
                            lesson_view_url={videoData.lesson_view_url}
                            authToken={authToken}
                            collection={collection}
                            resource={resource}
                            next={next}
                            nextSection={nextSection}
                            courseSlug={course.slug}
                            previous={previous}
                          />
                        )} */}
                    </div>
                    <hr className="opacity-50" />
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Error dignissimos neque, hic fugit, sequi ipsum quia officia
                    alias molestiae cum nisi harum enim maiores culpa voluptate
                    quis dolore! At, iusto! Lorem ipsum dolor sit, amet
                    consectetur adipisicing elit. Magnam minus porro ut dolor
                    esse, labore quibusdam, temporibus maiores unde quae,
                    architecto quidem ducimus. Voluptates harum id eos, quae
                    dicta quaerat. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit. Error dignissimos neque, hic fugit, sequi
                    ipsum quia officia alias molestiae cum nisi harum enim
                    maiores culpa voluptate quis dolore! At, iusto! Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Magnam minus
                    porro ut dolor esse, labore quibusdam, temporibus maiores
                    unde quae, architecto quidem ducimus. Voluptates harum id
                    eos, quae dicta quaerat. Lorem ipsum, dolor sit amet
                    consectetur adipisicing elit. Error dignissimos neque, hic
                    fugit, sequi ipsum quia officia alias molestiae cum nisi
                    harum enim maiores culpa voluptate quis dolore! At, iusto!
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Magnam minus porro ut dolor esse, labore quibusdam,
                    temporibus maiores unde quae, architecto quidem ducimus.
                    Voluptates harum id eos, quae dicta quaerat. Lorem ipsum,
                    dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat. Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Error
                    dignissimos neque, hic fugit, sequi ipsum quia officia alias
                    molestiae cum nisi harum enim maiores culpa voluptate quis
                    dolore! At, iusto! Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Magnam minus porro ut dolor esse, labore
                    quibusdam, temporibus maiores unde quae, architecto quidem
                    ducimus. Voluptates harum id eos, quae dicta quaerat.
                    {/* {summaryMdx && (
                        <>
                          <div className="prose my-8 max-w-none lg:prose-lg">
                            <MDXRenderer>
                              {summaryMdx.childMdx.body}
                            </MDXRenderer>
                          </div>
                          <hr className="opacity-50" />
                        </>
                      )}
                      {videoData && (
                        <Transcript
                          setPlaying={setPlaying}
                          resourceId={slug}
                          player={playerRef}
                        />
                      )} */}
                  </div>
                  {isTheaterMode && (
                    <div className="relative mt-6 w-full sm:pb-5 md:col-span-2 md:pl-2">
                      <motion.div
                        layoutId="list"
                        className="sm:sticky sm:top-20"
                        style={{height: listMaxHeight}}
                      >
                        {/* <List
                            isTheaterMode={isTheaterMode}
                            toggleTheaterMode={toggleTheaterMode}
                            collection={course}
                            location={location}
                            moduleProgress={moduleProgress}
                            listMaxHeight={listMaxHeight}
                          /> */}
                        <LessonList module={module} path={path} />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </>
            </motion.div>
            {!isTheaterMode && (
              <div className="mt-6 w-full sm:mt-0 sm:pb-5 md:col-span-2 md:pl-2">
                <motion.div
                  layoutId="list"
                  className="sm:sticky sm:top-20"
                  style={{height: listMaxHeight}}
                >
                  <LessonList module={module} path={path} />
                  {/* <List
                      isTheaterMode={isTheaterMode}
                      toggleTheaterMode={toggleTheaterMode}
                      collection={course}
                      location={location}
                      moduleProgress={moduleProgress}
                      listMaxHeight={listMaxHeight}
                    /> */}
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
    <div>
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
            {/* Used for module that has either mixed lessons with sections, no sections whatsoever, or single section */}
            <Collection.Lessons className="py-0">
              <Collection.Lesson className='bg-teal-800 font-semibold transition before:hidden data-[active="true"]:bg-white data-[active="true"]:opacity-100 data-[active="true"]:shadow-lg data-[active="true"]:shadow-gray-500/10 dark:data-[active="true"]:bg-gray-800/60 dark:data-[active="true"]:shadow-black/10 [&_[data-check-icon]]:w-3.5 [&_[data-check-icon]]:text-blue-500  dark:[&_[data-check-icon]]:text-blue-300 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:opacity-90 [&_[data-item]>div]:transition hover:[&_[data-item]>div]:opacity-100 [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:w-3.5  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500' />
            </Collection.Lessons>
          </Collection.Root>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </div>
  )
}
