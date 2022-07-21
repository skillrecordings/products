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

export const selectResource = (state: StateFrom<typeof videoMachine>) =>
  state.context.resource ?? {}

export const selectRootElem = (state: StateFrom<typeof videoMachine>) => {
  return state.context.rootElemRef?.current ?? null
}

export const selectCueFormElem = (state: StateFrom<typeof videoMachine>) =>
  state.context.cueFormElemRef?.current ?? null

export const selectPercent = (state: StateFrom<typeof videoMachine>) => {
  if (!state.context.videoRef?.current) return 0
  const {currentTime, duration} = state.context.videoRef.current
  const {seekingTime} = state.context
  const time = seekingTime || currentTime
  const percent = time / duration

  return percent >= 1 ? 1 : percent
}

export const selectTextTracks = (
  state: StateFrom<typeof videoMachine>,
): TextTrackList | undefined => {
  const video = state.context.videoRef?.current
  if (!video) return
  return video.textTracks
}

export const selectMetadataTracks = (state: StateFrom<typeof videoMachine>) =>
  state.context.metadataTracks

export const selectCues = (state: StateFrom<typeof videoMachine>) => {
  const noteTracks: any[] = state.context.metadataTracks.filter(
    (track: TextTrack) => {
      return track.label === 'notes'
    },
  )

  return noteTracks.reduce((acc: VTTCue[], track: TextTrack) => {
    return [...acc, ...Array.from(track.cues || [])]
  }, [])
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
  state.context.isFullscreen ?? false

export const selectWithSidePanel = (state: StateFrom<typeof videoMachine>) =>
  state.context.withSidePanel

export const selectHasStarted = (state: StateFrom<typeof videoMachine>) =>
  state.context.hasStarted || false

export const selectIsWaiting = (state: StateFrom<typeof videoMachine>) =>
  state.context.waiting || false

export const selectCurrentSrc = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.currentSrc

export const selectIsPaused = (state: StateFrom<typeof videoMachine>) =>
  state.matches('ready.paused')

export const selectIsTakingNote = (state: StateFrom<typeof videoMachine>) =>
  state.matches('taking_note')

export const selectIsSubmittingCueNote = (
  state: StateFrom<typeof videoMachine>,
) => state.context.isSubmittingCueNote || false

export const selectHasFailed = (state: StateFrom<typeof videoMachine>) =>
  state.matches('failure')

export const selectHasEnded = (state: StateFrom<typeof videoMachine>) =>
  state.matches('ready.ended')

export const selectVideo = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current ?? null

export const selectPaused = (state: StateFrom<typeof videoMachine>) =>
  state.context.videoRef?.current?.paused ?? false

export const selectReadyState = (state: StateFrom<typeof videoMachine>) =>
  state.context.readyState ?? -1

export const selectIsSeeking = (state: StateFrom<typeof videoMachine>) =>
  state.context.seeking

export const selectActiveCues = (state: StateFrom<typeof videoMachine>) =>
  state.context.activeCues

export const selectCuesMuted = (state: StateFrom<typeof videoMachine>) =>
  state.context.cuesMuted

export const selectCueNoteVisibility = (
  state: StateFrom<typeof videoMachine>,
) => state.context.writingCueNoteVisibility

export const selectIsWritingCue = (state: StateFrom<typeof videoMachine>) =>
  state.context.writingCueNote

export const selectLastAction = (state: StateFrom<typeof videoMachine>) =>
  state.context.lastAction

export const selectViewer = (state: StateFrom<typeof videoMachine>) =>
  state.context.viewer

export const selectShortcutsEnabled = (state: StateFrom<typeof videoMachine>) =>
  state.context.shortcutsEnabled
