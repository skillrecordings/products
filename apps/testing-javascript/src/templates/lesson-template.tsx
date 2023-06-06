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
          <div className="shrink-0">
            <Playlist />
          </div>
        </section>

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
        <div className="">
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
      </div>
    </VideoProvider>
  )
}

export default LessonTemplate
