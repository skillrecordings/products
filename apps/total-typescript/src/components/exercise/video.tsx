import {SanityDocument} from '@sanity/client'
import {Exercise} from '../../lib/exercises'
import * as React from 'react'
import {useConvertkit} from '../../hooks/use-convertkit'
import {useMuxPlayer} from '../../hooks/use-mux-player'
import {
  BlockedOverlay,
  DefaultOverlay,
  ExerciseOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from '../exercise-overlay'
import cx from 'classnames'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'

type VideoProps = {
  module: SanityDocument
  section?: SanityDocument
  exercise: Exercise
  ref: any
}

export const Video: React.FC<VideoProps> = React.forwardRef(
  ({module, exercise, section}, ref: any) => {
    const isExercise = Boolean(exercise._type === 'exercise')
    const {
      muxPlayerProps,
      displayOverlay,
      nextExercise,
      canShowVideo,
      loadingUserStatus,
      nextSection,
    } = useMuxPlayer()

    return (
      <>
        {displayOverlay && (
          <>
            {nextExercise ? (
              <>{isExercise ? <ExerciseOverlay /> : <DefaultOverlay />}</>
            ) : nextSection ? (
              <FinishedSectionOverlay />
            ) : (
              <FinishedOverlay />
            )}
          </>
        )}
        <div
          className={cx('relative flex w-full items-center justify-center', {
            hidden: displayOverlay,
          })}
        >
          {canShowVideo ? (
            <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
          ) : (
            <>{loadingUserStatus ? <LoadingOverlay /> : <BlockedOverlay />}</>
          )}
        </div>
      </>
    )
  },
)
