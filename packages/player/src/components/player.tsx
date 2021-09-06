import * as React from 'react'
import {Video} from './video'
import {StateFrom} from 'xstate'
import {formatVideoTime} from '../utils/format-video-time'
import {Shortcut} from './shortcut'
import {PlayToggle} from './controls/play-toggle'
import {VolumeMenuButton} from './controls/volume-menu-button'
import {ProgressControl} from './controls/progress-control'
import {CurrentTimeDisplay} from './time-controls/current-time-display'
import {VideoContext} from '../context/video-context'
import {videoMachine} from '../machines/video-machine'
import {TimeDivider} from './time-controls/time-divider'
import {DurationDisplay} from './time-controls/duration-display'
import {RemainingTimeDisplay} from './time-controls/remaining-time-display'
import {PlaybackRateMenuButton} from './controls/playback-rate-menu-button'
import {ForwardReplayControl} from './controls/forward-replay-control'
import {FullscreenToggle} from './controls/fullscreen-toggle'
import {MutableRefObject} from 'react'
import {LoadingSpinner} from './loading-spinner'
import {BigPlayButton} from './big-play-button'
import {Bezel} from './bezel'

export const Player: React.FC = ({children}) => {
  const {videoService} = React.useContext(VideoContext)
  const handleActivity = () => videoService.send('ACTIVITY')
  const fullscreenContainerRef = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={fullscreenContainerRef}
      onMouseDown={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
      className="cueplayer-react"
      style={{height: '500px'}}
    >
      <div className="cueplayer-react-controls-enabled">
        <Video>{children}</Video>
        <BigPlayButton />
        <Bezel />
        <LoadingSpinner />
      </div>
      <VideoControlBar fullscreenElement={fullscreenContainerRef.current} />
      <Shortcut />
    </div>
  )
}

const VideoControlBar: React.FC<{
  fullscreenElement?: HTMLElement | null
}> = ({fullscreenElement}) => {
  if (fullscreenElement === null) {
    fullscreenElement = undefined
  }
  return (
    <div className="cueplayer-react-control-bar">
      <PlayToggle />
      <ForwardReplayControl mode="replay" />
      <ForwardReplayControl />
      <VolumeMenuButton />
      <CurrentTimeDisplay />
      <TimeDivider />
      <DurationDisplay />
      <ProgressControl />
      <RemainingTimeDisplay />
      <PlaybackRateMenuButton />
      <FullscreenToggle fullscreenElement={fullscreenElement} />
    </div>
  )
}

export const selectFormattedRemainingTime = (
  state: StateFrom<typeof videoMachine>,
) =>
  formatVideoTime(
    (state.context.video?.duration ?? 0) -
      (state.context.video?.currentTime ?? 0),
  )

export const selectFormattedDuration = (
  state: StateFrom<typeof videoMachine>,
) => formatVideoTime(state.context.video?.duration)

export const selectFormattedTime = (state: StateFrom<typeof videoMachine>) =>
  formatVideoTime(
    state.context.video?.currentTime,
    state.context.video?.duration,
  )

export const selectPercent = (state: StateFrom<typeof videoMachine>) => {
  if (!state.context.video) return 0
  const {currentTime, duration} = state.context.video
  const {seekingTime} = state.context
  const time = seekingTime || currentTime
  const percent = time / duration
  return percent >= 1 ? 1 : percent
}

export const selectCurrentTime = (state: StateFrom<typeof videoMachine>) =>
  state.context.video?.currentTime || 0

export const selectDuration = (state: StateFrom<typeof videoMachine>) =>
  state.context.video?.duration || 0

export const selectBuffered = (state: StateFrom<typeof videoMachine>) =>
  state.context.video?.buffered || 0

export const selectVolume = (state: StateFrom<typeof videoMachine>) =>
  state.context.video?.volume ?? 0.8

export const selectMuted = (state: StateFrom<typeof videoMachine>) =>
  state.context.video?.muted ?? false

export const selectSeekTime = (state: StateFrom<typeof videoMachine>) =>
  state.context.seekingTime ?? state.context.video?.currentTime ?? 0

export const selectPlaybackRate = (state: StateFrom<typeof videoMachine>) =>
  state.context.playbackRate ?? 1.0

export const selectIsFullscreen = (state: StateFrom<typeof videoMachine>) =>
  state.context.isFullscreen

export const selectHasStarted = (state: StateFrom<typeof videoMachine>) =>
  state.context.hasStarted || false

export const selectCurrentSrc = (state: StateFrom<typeof videoMachine>) =>
  state.context.video?.currentSrc

export const selectIsPaused = (state: StateFrom<typeof videoMachine>) =>
  state.matches('ready.paused')

export const selectHasFailed = (state: StateFrom<typeof videoMachine>) =>
  state.matches('failure')
