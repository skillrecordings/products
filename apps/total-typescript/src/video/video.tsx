import * as React from 'react'
import cx from 'classnames'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {
  BlockedOverlay,
  DefaultOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from './video-overlays'

type VideoProps = {
  product: SanityProduct
  exerciseOverlayRenderer: () => void
  loadingIndicator: React.ReactElement
}

export const Video: React.FC<
  {
    ref: React.ForwardedRef<MuxPlayerRefAttributes>
  } & VideoProps
> = React.forwardRef<MuxPlayerRefAttributes, VideoProps>(
  (
    {
      product,
      exerciseOverlayRenderer = () => <DefaultOverlay />,
      loadingIndicator,
    },
    ref,
  ) => {
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

    return (
      <>
        {displayOverlay && (
          <>
            {nextExerciseStatus === 'loading' ? (
              <LoadingOverlay loadingIndicator={loadingIndicator} />
            ) : (
              <>
                {nextExercise ? (
                  <>
                    {isExercise ? (
                      canShowVideo ? (
                        exerciseOverlayRenderer()
                      ) : (
                        <BlockedOverlay product={product} />
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
          {canShowVideo && videoResource?.muxPlaybackId ? (
            <MuxPlayer
              ref={ref}
              {...(muxPlayerProps as MuxPlayerProps)}
              playbackId={videoResource?.muxPlaybackId}
            />
          ) : (
            <>
              {loadingUserStatus || loadingVideoResource ? (
                <LoadingOverlay loadingIndicator={loadingIndicator} />
              ) : (
                <BlockedOverlay product={product} />
              )}
            </>
          )}
        </div>
      </>
    )
  },
)
