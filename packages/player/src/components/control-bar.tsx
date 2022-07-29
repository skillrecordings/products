import * as React from 'react'
import {PlayToggleControl} from './controls/play-toggle-control'
import {ForwardReplayControl} from './controls/forward-replay-control'
import {VolumeMenuButtonControl} from './controls/volume-menu-button-control'
import {CurrentTimeDisplay} from './time-controls/current-time-display'
import {TimeDivider} from './time-controls/time-divider'
import {DurationDisplay} from './time-controls/duration-display'
import {PlaybackRateMenuButtonControl} from './controls/playback-rate-menu-button-control'
import {FullscreenToggleControl} from './controls/fullscreen-toggle-control'
import {SidePanelToggleControl} from './controls/side-panel-toggle-control'
import {ClosedCaptionsMenuButtonControl} from './controls/closed-captions-menu-button-control'

export const ControlBar: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <div className="cueplayer-react-control-bar">
      <div className="cueplayer-react-control-bar-left-part">
        <PlayToggleControl />
        {/* <ForwardReplayControl mode="replay" />
        <ForwardReplayControl /> */}
        <PlaybackRateMenuButtonControl />
        <VolumeMenuButtonControl />
      </div>
      <div className="cueplayer-react-control-bar-center-part">
        <CurrentTimeDisplay />
        <TimeDivider />
        <DurationDisplay />
      </div>
      <div className="cueplayer-react-control-bar-right-part">
        {children}
        <ClosedCaptionsMenuButtonControl />
        <SidePanelToggleControl />
        <FullscreenToggleControl />
      </div>
    </div>
  )
}
