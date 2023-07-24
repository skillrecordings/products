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
        <section className="flex">
          <div className="grow">
            <Video
              ref={muxPlayerRef}
              product={defaultProduct}
              exerciseOverlayRenderer={() => <div>DIIIIIV</div>}
              loadingIndicator={<Spinner />}
            />
          </div>
          {/* <div className="shrink-0">
            <Playlist />
          </div> */}
        </section>
      </div>
    </VideoProvider>
  )
}

export default LessonTemplate
