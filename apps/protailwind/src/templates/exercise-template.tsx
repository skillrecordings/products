import * as React from 'react'
import ExerciseSidebar from 'components/exercise-sidebar'
import Layout from 'components/layout'
import capitalize from 'lodash/capitalize'
import {SanityDocument} from '@sanity/client'
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
import {LargeScreenModuleLessonList} from 'video/large-screen-module-lesson-list'
import {MobileModuleLessonList} from 'video/mobile-module-lesson-list'

const ExerciseTemplate: React.FC<{
  transcript: any[]
  tutorialFiles?: any
}> = ({transcript, tutorialFiles}) => {
  const router = useRouter()
  const muxPlayerRef = React.useRef<HTMLDivElement>()
  const {lesson, section, module} = useLesson()
  const {videoResourceId} = useVideoResource()

  const {title, description: exerciseDescription} = lesson
  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${module.moduleType}s`

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
          description={pageDescription}
        />
        <div className="flex flex-col lg:flex-row">
          <LargeScreenModuleLessonList
            module={module}
            path={path}
            section={section}
          />
          <main className="relative mx-auto max-w-[1480px] grow items-start  sm:bg-gray-100 2xl:flex 2xl:max-w-none  2xl:bg-transparent">
            <div className="border-gray-100 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r 2xl:bg-gray-100">
              <Video ref={muxPlayerRef} tutorialFiles={tutorialFiles} />
              <MobileModuleLessonList
                module={module}
                section={section}
                path={path}
              />
              <div className="hidden 2xl:block ">
                <VideoTranscript
                  transcript={transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="relative flex-shrink-0 shadow-gray-500/10 sm:bg-gray-100 2xl:h-full 2xl:bg-transparent 2xl:shadow-xl">
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

const MobileLessonNavigator: React.FC<{
  module: SanityDocument
  section?: SanityDocument
  path: string
}> = ({module, path, section}) => {
  return (
    <details className="group block border-t-2 border-gray-900 lg:hidden">
      <summary className="no-marker flex cursor-pointer items-center gap-1 bg-white px-4 py-3 font-medium shadow-2xl shadow-gray-500/10 transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-full after:bg-gray-100 after:text-lg after:content-['↑'] group-open:after:rotate-0 hover:bg-gray-100">
        {module.title} {capitalize(module.moduleType)}{' '}
        <span className="opacity-80">
          ({section ? section.lessons.length : module.lessons.length} exercises)
        </span>
      </summary>
      <ExerciseSidebar module={module} path={path} section={section} />
    </details>
  )
}

export default ExerciseTemplate
