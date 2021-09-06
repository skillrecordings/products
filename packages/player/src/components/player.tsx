import * as React from 'react'
import cx from 'classnames'
import {useSelector} from '@xstate/react'

import {Video} from './video'
import {Shortcut} from './shortcut'
import {VideoContext} from '../context/video-context'
import {LoadingSpinner} from './loading-spinner'
import {BigPlayButton} from './big-play-button'
import {Bezel} from './bezel'
import {ControlBar} from './control-bar'

import {
  selectHasStarted,
  selectIsActive,
  selectIsFullscreen,
  selectIsPaused,
  selectIsWaiting,
} from '../selectors'

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
      <ControlBar fullscreenElement={fullscreenContainerRef.current} />
      <Shortcut />
    </div>
  )
}
