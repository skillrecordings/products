import * as React from 'react'
import {Video} from './video'
import {StateFrom} from 'xstate'
import {formatVideoTime} from '../utils/format-video-time'
import {Shortcut} from './shortcut'
import {PlayToggle} from './controls/play-toggle'
import {VolumeMenuButton} from './controls/volume-menu-button'
import {ProgressControl} from './controls/progress-control'
import {CurrentTimeDisplay} from './controls/current-time-display'
import {VideoContext} from '../context/video-context'
import {videoMachine} from '../machines/video-machine'

export const Player: React.FC = ({children}) => {
  const {videoService} = React.useContext(VideoContext)
  const handleActivity = () => videoService.send('ACTIVITY')
  return (
    <div
      onMouseDown={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
      className="cueplayer-react"
      style={{height: '500px'}}
    >
      <div className="cueplayer-react-controls-enabled">
        <Video>{children}</Video>
      </div>
      <VideoControlBar />
      <Shortcut />
    </div>
  )
}

const VideoControlBar = () => {
  return (
    <div className="cueplayer-react-control-bar">
      <PlayToggle />
      <VolumeMenuButton />
      <CurrentTimeDisplay />
      <ProgressControl />
    </div>
  )
}

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
