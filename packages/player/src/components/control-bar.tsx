import * as React from 'react'
import {PlayToggle} from './controls/play-toggle'
import {ForwardReplayControl} from './controls/forward-replay-control'
import {VolumeMenuButton} from './controls/volume-menu-button'
import {CurrentTimeDisplay} from './time-controls/current-time-display'
import {TimeDivider} from './time-controls/time-divider'
import {DurationDisplay} from './time-controls/duration-display'
import {ProgressControl} from './controls/progress-control'
import {RemainingTimeDisplay} from './time-controls/remaining-time-display'
import {PlaybackRateMenuButton} from './controls/playback-rate-menu-button'
import {FullscreenToggle} from './controls/fullscreen-toggle'

export const ControlBar: React.FC = () => {
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
      <FullscreenToggle />
    </div>
  )
}
