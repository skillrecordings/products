import * as React from 'react'
import Layout from 'components/layout'
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
import {LargeScreenModuleLessonList} from 'video/module-lesson-list/large-screen-module-lesson-list'
import {MobileModuleLessonList} from 'video/module-lesson-list/mobile-module-lesson-list'
// import {MuxPlayerRefAttributes} from '@mux/mux-player-react/*'
import {trpc} from 'trpc/trpc.client'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {
  ExerciseLink,
  ExplainerLink,
  ProblemLink,
  SolutionLink,
} from 'video/module-lesson-list/lesson-list'
// import ExerciseOverlay from 'components/exercise-overlay'
import Spinner from 'components/spinner'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'

const ExerciseTemplate: React.FC<{
  transcript: any[]
  tutorialFiles?: any
}> = ({transcript, tutorialFiles}) => {
  const router = useRouter()
  const {
    muxPlayerProps,
    displayOverlay,
    nextExercise,
    nextExerciseStatus,
    canShowVideo,
    loadingUserStatus,
    nextSection,
  } = useMuxPlayer()
  const {videoResource, loadingVideoResource} = useVideoResource()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {lesson, section, module} = useLesson()
  const {videoResourceId} = useVideoResource()
  const {title, description: exerciseDescription} = lesson
  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${module.moduleType}s`
  // const {data: resources, status: resourcesStatus} =
  //   trpc.resources.byExerciseSlug.useQuery({
  //     slug: router.query.lesson as string,
  //     type: lesson._type,
  //   })
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
        <MuxPlayer
          ref={muxPlayerRef}
          {...(muxPlayerProps as MuxPlayerProps)}
          playbackId={videoResource?.muxPlaybackId}
        />
      </Layout>
    </VideoProvider>
  )
}

export default ExerciseTemplate
