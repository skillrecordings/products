import * as React from 'react'
import Navigation from '@/components/app/navigation'
import Layout from '@/components/app/layout'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import Image from 'next/image'
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
import ExerciseOverlay from '@/components/exercise-overlay'
import Spinner from '@/components/spinner'
import {getExerciseGitHubUrl} from '@/exercise/get-exercise-github-url'
import pluralize from 'pluralize'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

import {useModuleProgress} from '@skillrecordings/skill-lesson/video/module-progress'
import {cn} from '@skillrecordings/ui/utils/cn'
import ModuleCertificate from '@/certificate/module-certificate'
import {ProEssentialsBanner} from '@/components/book/pro-essentials-banner'
import {BlockedOverlay} from '@/components/blocked-overlay'

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
  const completeModuleMutation = trpc.convertkit.completeModule.useMutation()
  const startModuleMutation = trpc.convertkit.startModule.useMutation()

  const {data: stackblitz, status: stackblitzStatus} =
    trpc.stackblitz.byExerciseSlug.useQuery({
      slug: router.query.lesson as string,
      type: lesson._type,
    })

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
            {stackblitzStatus === 'loading' ? (
              <li data-exercise-is-loading="">Exercise</li>
            ) : (
              stackblitz && (
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
      </>
    )
  }
  const {exerciseGitHubUrl, openFile} = getExerciseGitHubUrl({
    stackblitz,
    module,
  })

  return (
    <VideoProvider
      accentColor="#0ea5e9"
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      path={path}
      onModuleStarted={async () => {
        startModuleMutation.mutate({
          module: {
            moduleType: module.moduleType,
            slug: module.slug.current as string,
          },
        })
      }}
      onModuleEnded={async () => {
        addProgressMutation.mutate({lessonSlug: router.query.lesson as string})
        completeModuleMutation.mutate({
          module: {
            moduleType: module.moduleType,
            slug: module.slug.current as string,
          },
        })
      }}
      moduleCertificateRenderer={() => (
        <div className="mt-5 flex w-full max-w-[200px] items-center justify-center sm:max-w-[320px]">
          <ModuleCertificate
            className="py-0"
            module={module}
            withTitle={false}
          />
        </div>
      )}
    >
      <Layout
        meta={{title: pageTitle, ...shareCard, description: pageDescription}}
        nav={
          <Navigation
            className="relative flex w-full lg:absolute lg:pl-[calc(280px+20px)] xl:pl-[calc(320px+20px)]"
            containerClassName="flex h-full justify-between w-full items-stretch"
            isMinified={true}
          />
        }
        footer={null}
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
        <div className={cn('flex flex-grow flex-col lg:flex-row', {})}>
          <LargeScreenModuleLessonList
            lessonResourceRenderer={lessonResourceRenderer}
            module={module}
            path={path}
          />
          <main
            className={cn(
              'relative mx-auto w-full max-w-[1480px] items-start border-t border-transparent lg:mt-16 2xl:flex 2xl:max-w-none 2xl:border-gray-800',
            )}
          >
            <div className="flex flex-col border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
              <Video
                product={module?.product as SanityProduct}
                ref={muxPlayerRef}
                exerciseOverlayRenderer={() => <ExerciseOverlay />}
                loadingIndicator={<Spinner />}
                blockedOverlayRenderer={() => (
                  <BlockedOverlay product={module?.product as SanityProduct} />
                )}
              />
              <MobileModuleLessonList
                lessonResourceRenderer={lessonResourceRenderer}
                module={module}
                section={section}
                path={path}
              />
              <div className="relative hidden flex-grow 2xl:block 2xl:bg-black/20">
                <VideoTranscript transcript={transcript} />
              </div>
            </div>
            <article className="relative flex-shrink-0 sm:bg-black/20 2xl:bg-transparent">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-6 2xl:max-w-xl">
                <LessonTitle />
                {openFile && (
                  <GitHubLink
                    exercise={lesson}
                    module={module}
                    loadingIndicator={<Spinner className="h-7 w-7" />}
                    url={exerciseGitHubUrl}
                    file={openFile}
                    repository={module?.github?.repo}
                  />
                )}
                <LessonDescription
                  lessonMDXBody={lessonBodySerialized}
                  lessonBodyPreview={lessonBodyPreviewSerialized}
                  productName={module?.product?.name || module.title}
                  loadingIndicator={<Spinner />}
                />
                {(lesson._type === 'solution' ||
                  lesson._type === 'explainer') &&
                  session && <LessonCompletionToggle />}
              </div>
              <div className="relative z-10 block flex-grow 2xl:hidden">
                <VideoTranscript transcript={transcript} />
              </div>
              <Image
                src={require('../../public/assets/landing/bg-divider-6.png')}
                alt=""
                aria-hidden="true"
                fill
                className="pointer-events-none z-0 select-none object-contain object-top"
                priority
              />
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

export default ExerciseTemplate
