import * as React from 'react'
import {useRouter} from 'next/router'
import {type MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {
  customPlayFromBeginningHandler,
  customContinueHandler,
} from 'utils/custom-handlers'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'

import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'
import LessonsSidebar from 'components/lessons-sidebar'

const LessonTemplate = () => {
  const router = useRouter()
  const {videoResource} = useVideoResource()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {lesson, module} = useLesson()
  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: defaultProduct} =
    trpc['testingJavascript.products'].getDefaultProduct.useQuery()

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      handleContinue={customContinueHandler}
      handlePlayFromBeginning={customPlayFromBeginningHandler}
    >
      <div className="container max-w-6xl pb-8 pt-4 md:pb-12 md:pt-6 lg:pb-16">
        <main className="relative mx-auto w-full items-start border-t border-transparent 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
          <div className="flex flex-col border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
            <Video
              ref={muxPlayerRef}
              product={defaultProduct}
              exerciseOverlayRenderer={() => <div>DIIIIIV</div>}
              loadingIndicator={<Spinner />}
            />
          </div>
        </main>
        <div className="mt-12 flex flex-col-reverse lg:flex-row">
          <div className="grow">
            <h2 className="hidden leading-tight lg:block lg:text-4xl xl:text-5xl">
              {lesson.title}
            </h2>
            {lesson.description && (
              <article className="lg:mt-8">
                <div className="prose prose-md">{lesson.description}</div>
              </article>
            )}
            <article className="lg:mt-8">
              <div className="prose prose-md">
                <VideoTranscript transcript={videoResource?.transcript || ''} />
              </div>
            </article>
          </div>
          <div className="w-full shrink-0 lg:ml-8 lg:max-w-[350px]">
            <h2 className="mb-8 block text-3xl leading-tight md:text-[2.125rem] lg:hidden">
              {lesson.title}
            </h2>
            <LessonsSidebar lesson={lesson} module={module} />
          </div>
        </div>
      </div>
    </VideoProvider>
  )
}

export default LessonTemplate
