import * as React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {
  VideoProvider,
  useMuxPlayer,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
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
  const {muxPlayerProps} = useMuxPlayer()
  const {videoResource, loadingVideoResource, videoResourceId} =
    useVideoResource()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {lesson, module} = useLesson()
  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: defaultProduct} = trpc.products.getDefaultProduct.useQuery()
  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      handleContinue={customContinueHandler}
      handlePlayFromBeginning={customPlayFromBeginningHandler}
    >
      <div className="container max-w-6xl pt-4 pb-8 md:pb-12 md:pt-6 lg:pb-16">
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
        <div className="flex flex-col-reverse lg:flex-row mt-12">
          <div className="grow mt-12 lg:mt-0">
            <h2 className="text-[2.125rem] leading-tight hidden lg:block">
              {lesson.title}
            </h2>
            <article className="lg:mt-8">
              <VideoTranscript transcript={videoResource?.transcript || ''} />
            </article>
          </div>
          <div className="w-full lg:max-w-[350px] shrink-0 lg:ml-8">
            <h2 className="text-[1.625rem] md:text-[2.125rem] leading-tight block lg:hidden mb-8">
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
