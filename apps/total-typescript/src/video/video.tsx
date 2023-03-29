import * as React from 'react'
import cx from 'classnames'
import MuxPlayer, {type MuxPlayerProps} from '@mux/mux-player-react'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import ExerciseOverlay from 'components/exercise-overlay'
import {
  BlockedOverlay,
  DefaultOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from './video-overlays'
import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'

type VideoProps = {
  ref: any
}

export const Video: React.FC<VideoProps> = React.forwardRef(
  (props, ref: any) => {
    const {lesson} = useLesson()
    const isExercise = Boolean(lesson._type === 'exercise')
    const {videoResource, loadingVideoResource} = useVideoResource()
    const {
      muxPlayerProps,
      displayOverlay,
      nextExercise,
      nextExerciseStatus,
      canShowVideo,
      loadingUserStatus,
      nextSection,
    } = useMuxPlayer()
    const {data: products} = trpc.products.getProducts.useQuery()
    const activeProduct = products?.products[0]

    return (
      <>
        {displayOverlay && (
          <>
            {nextExerciseStatus === 'loading' ? (
              <LoadingOverlay loadingIndicator={<Spinner />} />
            ) : (
              <>
                {nextExercise ? (
                  <>
                    {isExercise ? (
                      canShowVideo ? (
                        <ExerciseOverlay /> // TODO: should be passed down from exerciseOverlayRenderer() callback function
                      ) : (
                        <BlockedOverlay product={activeProduct} /> // TODO: product should be passed down from to this Video component
                      )
                    ) : (
                      <DefaultOverlay />
                    )}
                  </>
                ) : nextSection ? (
                  <FinishedSectionOverlay />
                ) : (
                  <FinishedOverlay />
                )}
              </>
            )}
          </>
        )}
        <div
          className={cx('relative flex w-full items-center justify-center', {
            hidden: displayOverlay,
          })}
        >
          {canShowVideo && !loadingVideoResource ? (
            <MuxPlayer
              ref={ref}
              {...(muxPlayerProps as MuxPlayerProps)}
              playbackId={videoResource?.muxPlaybackId}
            />
          ) : (
            <>
              {loadingUserStatus || loadingVideoResource ? (
                <LoadingOverlay loadingIndicator={<Spinner />} />
              ) : (
                <BlockedOverlay product={activeProduct} />
              )}
            </>
          )}
        </div>
      </>
    )
  },
)
