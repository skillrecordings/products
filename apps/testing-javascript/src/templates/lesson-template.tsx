import * as React from 'react'
import Layout from 'components/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useRouter} from 'next/router'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'

const LessonTemplate = () => {
  const router = useRouter()
  const {muxPlayerProps} = useMuxPlayer()
  const {videoResource, loadingVideoResource} = useVideoResource()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {lesson, module} = useLesson()
  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
    >
      <MuxPlayer
        ref={muxPlayerRef}
        {...(muxPlayerProps as MuxPlayerProps)}
        playbackId={videoResource?.muxPlaybackId}
      />
      <div className="container">
        <h2 className="mt-8 text-xl">
          module: <b>{module?.title}</b>
        </h2>
        <h2 className="mt-8 text-xl">
          lesson: <b>{lesson?.title}</b>
        </h2>
      </div>
    </VideoProvider>
  )
}

export default LessonTemplate
