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
    </VideoProvider>
  )
}

export default LessonTemplate
