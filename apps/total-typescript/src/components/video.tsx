import {type SanityDocument} from '@sanity/client'
import * as React from 'react'
import cx from 'classnames'
import MuxPlayer, {type MuxPlayerProps} from '@mux/mux-player-react'

import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {type LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'

import {
  BlockedOverlay,
  DefaultOverlay,
  ExerciseOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from './exercise-overlay'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'

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
          {canShowVideo && !loadingVideoResource ? (
            <MuxPlayer
              ref={ref}
              {...(muxPlayerProps as MuxPlayerProps)}
              playbackId={videoResource?.muxPlaybackId}
            />
          ) : (
            <>
              {loadingUserStatus || loadingVideoResource ? (
                <LoadingOverlay />
              ) : (
                <BlockedOverlay />
              )}
            </>
          )}
        </div>
      </>
    )
  },
)
