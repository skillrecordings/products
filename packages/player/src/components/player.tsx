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
import cx from 'classnames'
import {useSelector} from '@xstate/react'

export const Player: React.FC<any> = ({children, className}) => {
  const {videoService} = React.useContext(VideoContext)
  const isActive = useSelector(videoService, selectIsActive)
  const hasStarted = useSelector(videoService, selectHasStarted)
  const paused = useSelector(videoService, selectIsPaused)
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const isWaiting = useSelector(videoService, selectIsWaiting)
  const handleActivity = () => videoService.send('ACTIVITY')
  const fullscreenContainerRef = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={fullscreenContainerRef}
      onMouseDown={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
      style={{height: '500px'}}
      className={cx(
        {
          'cueplayer-react-controls-enabled': true,
          'cueplayer-react-has-started': hasStarted,
          'cueplayer-react-paused': paused,
          'cueplayer-react-playing': !paused,
          'cueplayer-react-waiting': isWaiting,
          // 'cueplayer-react-seeking': seeking,
          'cueplayer-react-fluid': true,
          'cueplayer-react-fullscreen': isFullscreen,
          'cueplayer-react-user-inactive': !isActive,
          'cueplayer-react-user-active': isActive,
          // 'cueplayer-react-workinghover': !browser.IS_IOS,
          // 'cueplayer-react-cues-active': !isEmpty(activeMetadataTracks),
        },
        'cueplayer-react',
        className,
      )}
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
