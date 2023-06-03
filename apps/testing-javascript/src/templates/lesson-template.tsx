import * as React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'

import {trpc} from 'trpc/trpc.client'

const LessonTemplate = () => {
  const router = useRouter()
  const {muxPlayerProps} = useMuxPlayer()
  const {videoResource, loadingVideoResource} = useVideoResource()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {lesson, module} = useLesson()
  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: defaultProduct} = trpc.product.getDefaultProduct()
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
      <div className="mt-8">
        <button
          data-action="continue"
          onClick={() => {
            addProgressMutation.mutate(
              {lessonSlug: router.query.lesson as string},
              // {
              //   onSettled: (data, error, variables, context) => {
              //     handleContinue({
              //       router,
              //       module,
              //       nextExercise,
              //       handlePlay,
              //       path,
              //       section,
              //     })
              //   },
              // },
            )
          }}
        >
          Complete & Continue{' '}
          <span aria-hidden="true" data-icon="">
            →
          </span>
        </button>
      </div>
      <div className="container">
        <h2 className="mt-8 text-xl">
          module:{' '}
          <b>
            <Link
              href={{
                pathname: '/playlists/[module]',
                query: {
                  module: module.slug.current,
                },
              }}
            >
              {module?.title}
            </Link>
          </b>
        </h2>
        <h2 className="mt-8 text-xl">
          lesson: <b>{lesson?.title}</b>
        </h2>
      </div>
    </VideoProvider>
  )
}

export default LessonTemplate
