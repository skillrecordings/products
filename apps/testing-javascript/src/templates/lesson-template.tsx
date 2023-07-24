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

const Playlist: React.FC<any> = () => {
  return (
    <div>
      <div>Playlist goes here...</div>
    </div>
  )
}

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
      <div className="container max-w-6xl">
        <main className="relative mx-auto w-full max-w-[1480px] items-start border-t border-transparent lg:mt-16 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
          <div className="flex flex-col border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
            <Video
              ref={muxPlayerRef}
              product={defaultProduct}
              exerciseOverlayRenderer={() => <div>DIIIIIV</div>}
              loadingIndicator={<Spinner />}
            />
          </div>
        </main>
        <div className="relative hidden flex-grow 2xl:block">
          <VideoTranscript transcript={videoResource?.transcript || ''} />
        </div>
        <article className="relative flex-shrink-0 2xl:bg-transparent">
          <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-6 2xl:max-w-xl">
            <div className="relative z-10 block flex-grow 2xl:hidden">
              <VideoTranscript transcript={videoResource?.transcript || ''} />
            </div>
          </div>
        </article>
        {/* <div className="shrink-0">
            <Playlist />
          </div> */}
      </div>
    </VideoProvider>
  )
}

export default LessonTemplate
