import {StateFrom} from 'xstate'
import {videoMachine} from '../machines/video-machine'
import {formatVideoTime} from '../utils/format-video-time'

export const selectFormattedRemainingTime = (
  state: StateFrom<typeof videoMachine>,
) =>
  formatVideoTime(
    (state.context.videoRef?.current?.duration ?? 0) -
      (state.context.videoRef?.current?.currentTime ?? 0),
  )
export const selectFormattedDuration = (
  state: StateFrom<typeof videoMachine>,
) => formatVideoTime(state.context.videoRef?.current?.duration)

export const selectFormattedTime = (state: StateFrom<typeof videoMachine>) =>
  formatVideoTime(
    state.context.videoRef?.current?.currentTime,
    state.context.videoRef?.current?.duration,
  )

export const selectRootElem = (state: StateFrom<typeof videoMachine>) =>
  state.context.rootElemRef?.current ?? null

export const selectPercent = (state: StateFrom<typeof videoMachine>) => {
  if (!state.context.videoRef?.current) return 0
  const {currentTime, duration} = state.context.videoRef.current
  const {seekingTime} = state.context
  const time = seekingTime || currentTime
  const percent = time / duration

  return percent >= 1 ? 1 : percent
}

export const selectIsActive = (state: StateFrom<typeof videoMachine>) =>
  state.context.isActive || false

export const selectCurrentTime = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.currentTime || 0

export const selectDuration = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.duration || 0

export const selectBuffered = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.buffered || 0

export const selectVolume = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.volume ?? 0.8

export const selectMuted = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.muted ?? false

export const selectSeekTime = (state: StateFrom<typeof videoMachine>) =>
  state.context.seekingTime ?? state.context.videoRef?.current?.currentTime ?? 0

export const selectPlaybackRate = (state: StateFrom<typeof videoMachine>) =>
  state.context.playbackRate ?? 1.0

export const selectIsFullscreen = (state: StateFrom<typeof videoMachine>) =>
  state.context.isFullscreen

export const selectHasStarted = (state: StateFrom<typeof videoMachine>) =>
  state.context.hasStarted || false

export const selectIsWaiting = (state: StateFrom<typeof videoMachine>) =>
  state.context.waiting || false

export const selectCurrentSrc = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.currentSrc

export const selectIsPaused = (state: StateFrom<typeof videoMachine>) =>
  state.matches('ready.paused')

export const selectHasFailed = (state: StateFrom<typeof videoMachine>) =>
  state.matches('failure')

export const selectVideo = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current

export const selectPaused = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.paused ?? false

export const selectReadyState = (state: StateFrom<typeof videoMachine>) =>
  state.context.readyState ?? -1

export const selectIsSeeking = (state: StateFrom<typeof videoMachine>) =>
  state.context.seeking
