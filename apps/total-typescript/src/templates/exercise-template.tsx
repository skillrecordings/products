import * as React from 'react'
import Navigation from 'components/app/navigation'
import Layout from 'components/app/layout'
import {VideoProvider} from 'hooks/use-mux-player'
import {SanityDocument} from '@sanity/client'
import Image from 'next/image'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {Video} from '../components/exercise/video'
import {GitHubLink} from '../components/exercise/github-link'
import {VideoTranscript} from '../components/exercise/video-transcript'
import {ExerciseTitle} from '../components/exercise/exercise-title'
import {ExerciseDescription} from '../components/exercise/exercise-description'
import {MobileModuleLessonList} from '../components/exercise/mobile-module-lesson-list'
import {LargeScreenModuleLessonList} from '../components/exercise/large-screen-module-lesson-list'
import {useRouter} from 'next/router'
import {getBaseUrl} from 'utils/get-base-url'
import {useLesson} from '../video/use-lesson'

const ExerciseTemplate: React.FC<{
  transcript: any[]
  videoResourceId: string
}> = ({transcript, videoResourceId}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()
  const router = useRouter()
  const {lesson: exercise, section, module} = useLesson()

  const {title, description: exerciseDescription} = exercise

  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${module.moduleType}s`

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.exercise as string}
      path={path}
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
      >
        <ArticleJsonLd
          url={`${process.env.NEXT_PUBLIC_URL}/${module.slug.current}/${exercise.slug}`}
          title={exercise.title}
          images={[
            `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
          ]}
          datePublished={exercise._updatedAt || new Date().toISOString()}
          authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
          description={pageDescription}
        />
        <div className="flex flex-col lg:flex-row">
          <LargeScreenModuleLessonList
            module={module}
            path={path}
            section={section}
          />
          <main className="relative mx-auto w-full max-w-[1480px] items-start border-t border-transparent lg:mt-16 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
            <div className="flex flex-col border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
              <Video
                ref={muxPlayerRef}
                module={module}
                exercise={exercise}
                section={section}
              />
              <MobileModuleLessonList
                module={module}
                section={section}
                path={path}
              />
              <div className="hidden flex-grow 2xl:block 2xl:bg-black/20">
                <VideoTranscript
                  transcript={transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="relative flex-shrink-0 sm:bg-black/20 2xl:bg-transparent">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-8 2xl:max-w-xl">
                <ExerciseTitle exercise={exercise} />
                <GitHubLink exercise={exercise} module={module} />
                <ExerciseDescription exercise={exercise} />
              </div>
              <div className="relative z-10 block flex-grow 2xl:hidden">
                <VideoTranscript
                  transcript={transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
              <Image
                src={require('../../public/assets/landing/bg-divider-6.png')}
                alt=""
                aria-hidden="true"
                layout="fill"
                objectFit="contain"
                objectPosition="center top"
                className="pointer-events-none z-0 select-none"
              />
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

export default ExerciseTemplate
