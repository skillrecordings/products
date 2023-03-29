import * as React from 'react'
import cx from 'classnames'
import MuxPlayer, {type MuxPlayerProps} from '@mux/mux-player-react'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import ExerciseOverlay from 'components/exercise-overlay'
import {
  BlockedOverlay,
  DefaultOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from './video-overlays'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import Spinner from 'components/spinner'

type VideoProps = {
  ref: any
  tutorialFiles: any
}

export const Video: React.FC<VideoProps> = React.forwardRef(
  ({tutorialFiles}, ref: any) => {
    const {lesson, module} = useLesson()
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
              <LoadingOverlay loadingIndicator={<Spinner />} />
            ) : (
              <>
                {nextExercise ? (
                  <>
                    {isExercise ? (
                      canShowVideo ? (
                        <ExerciseOverlay tutorialFiles={tutorialFiles} /> // TODO: should be passed down from exerciseOverlayRenderer() callback function
                      ) : (
                        <BlockedOverlay
                          product={module.product as SanityProduct}
                        /> // TODO: product should be passed down from to this Video component
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
                <BlockedOverlay product={module.product as SanityProduct} />
              )}
            </>
          )}
        </div>
      </>
    )
  },
)
