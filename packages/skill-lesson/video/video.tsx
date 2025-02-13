import * as React from 'react'
import cx from 'classnames'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {useMuxPlayer} from '../hooks/use-mux-player'
import {useVideoResource} from '../hooks/use-video-resource'
import {useLesson} from '../hooks/use-lesson'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {
  BlockedOverlay,
  DefaultOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from './video-overlays'
import {PriceCheckProvider} from '../path-to-purchase/pricing-check-context'

type VideoProps = {
  product?: SanityProduct
  exerciseOverlayRenderer?: () => void
  defaultOverlayRenderer?: () => void
  blockedOverlayRenderer?: () => void
  finishedSectionOverlayRenderer?: () => void
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
      defaultOverlayRenderer = () => <DefaultOverlay />,
      blockedOverlayRenderer = () => <BlockedOverlay product={product} />,
      finishedSectionOverlayRenderer = () => <FinishedSectionOverlay />,
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
      loadingUserStatus,
      nextSection,
      canShowVideo,
    } = useMuxPlayer()

    return (
      <>
        <PriceCheckProvider>
          {displayOverlay ? (
            <>
              {nextExerciseStatus === 'loading' ? (
                <LoadingOverlay loadingIndicator={loadingIndicator} />
              ) : (
                <>
                  {nextExercise ? (
                    <>
                      {isExercise
                        ? canShowVideo
                          ? exerciseOverlayRenderer()
                          : blockedOverlayRenderer()
                        : defaultOverlayRenderer()}
                    </>
                  ) : nextSection ? (
                    finishedSectionOverlayRenderer()
                  ) : (
                    <FinishedOverlay />
                  )}
                </>
              )}
            </>
          ) : (
            <div
              className={cx(
                'relative flex w-full items-center justify-center',
                {
                  hidden: displayOverlay,
                },
              )}
            >
              {Boolean(canShowVideo && videoResource?.muxPlaybackId) ? (
                <MuxPlayer
                  ref={ref}
                  {...(muxPlayerProps as MuxPlayerProps)}
                  playbackId={videoResource?.muxPlaybackId}
                  metadata={{
                    video_title: lesson.title,
                  }}
                />
              ) : (
                <>
                  {loadingUserStatus || loadingVideoResource ? (
                    <LoadingOverlay loadingIndicator={loadingIndicator} />
                  ) : (
                    blockedOverlayRenderer()
                  )}
                </>
              )}
            </div>
          )}
        </PriceCheckProvider>
      </>
    )
  },
)
