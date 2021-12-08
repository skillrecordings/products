import * as React from 'react'
import {PlayToggleControl} from './controls/play-toggle-control'
import {ForwardReplayControl} from './controls/forward-replay-control'
import {VolumeMenuButtonControl} from './controls/volume-menu-button-control'
import {CurrentTimeDisplay} from './time-controls/current-time-display'
import {TimeDivider} from './time-controls/time-divider'
import {DurationDisplay} from './time-controls/duration-display'
import {ProgressControl} from './controls/progress-control'
import {RemainingTimeDisplay} from './time-controls/remaining-time-display'
import {PlaybackRateMenuButtonControl} from './controls/playback-rate-menu-button-control'
import {FullscreenToggleControl} from './controls/fullscreen-toggle-control'
import {SidePanelToggleControl} from './controls/side-panel-toggle-control'

export const ControlBar: React.FC = () => {
  return (
    <div className="cueplayer-react-control-bar">
      <PlayToggleControl />
      <ForwardReplayControl mode="replay" />
      <ForwardReplayControl />
      <VolumeMenuButtonControl />
      <CurrentTimeDisplay />
      <TimeDivider />
      <DurationDisplay />
      <ProgressControl />
      <RemainingTimeDisplay />
      <PlaybackRateMenuButtonControl />
      <SidePanelToggleControl />
      <FullscreenToggleControl />
    </div>
  )
}
