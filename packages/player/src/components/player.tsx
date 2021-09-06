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

type PlayerProps = {
  container?: HTMLElement
  className?: string
}

/**
 * The primary player instance. Must be a descendent by a {VideoProvider}.
 * @param children {React.ReactNode=}
 * @param className {string}
 * @param container {HTMLElement=} element used floor fullscreen
 * @constructor
 */
export const Player: React.FC<PlayerProps> = ({
  children,
  className,
  container = null,
}) => {
  const containerRef = React.useRef(container)
  const {videoService} = React.useContext(VideoContext)
  const isActive = useSelector(videoService, selectIsActive)
  const hasStarted = useSelector(videoService, selectHasStarted)
  const paused = useSelector(videoService, selectIsPaused)
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const isWaiting = useSelector(videoService, selectIsWaiting)
  const handleActivity = () => videoService.send('ACTIVITY')
  return (
    <div
      ref={(c) => {
        containerRef.current = container ? container : c
        videoService.send({type: 'SET_ROOT_ELEM', rootElemRef: containerRef})
      }}
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
      <ControlBar />
      <Shortcut />
    </div>
  )
}
