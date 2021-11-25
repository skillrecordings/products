import * as React from 'react'
import cx from 'classnames'
import {useSelector} from '@xstate/react'

import {useVideo} from '../context/video-context'
import * as browser from '../utils/browser'

import {Video} from './video'
import {Shortcut} from './shortcut'
import {LoadingSpinner} from './loading-spinner'
import {BigPlayButton} from './big-play-button'
import {Bezel} from './bezel'
import {ControlBar} from './control-bar'
import {ProgressBar} from './progress-bar'
import {CueBar} from './cue-bar'

import {
  selectHasStarted,
  selectIsActive,
  selectIsFullscreen,
  selectIsPaused,
  selectIsSeeking,
  selectIsWaiting,
  selectVideo,
} from '../selectors'

type PlayerProps = {
  container?: HTMLElement
  className?: string
  fluid?: boolean
  muted?: boolean
  playsInline?: boolean
  preload?: string
  aspectRatio?: string
  width?: string | number
  height?: string | number
}

const usePlayerState = () => {
  const videoService = useVideo()
  const hasStarted = useSelector(videoService, selectHasStarted)
  const isActive = useSelector(videoService, selectIsActive)
  const paused = useSelector(videoService, selectIsPaused)

  const isSeeking = useSelector(videoService, selectIsSeeking)
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const isWaiting = useSelector(videoService, selectIsWaiting)
  const video = useSelector(videoService, selectVideo)

  return {
    videoService,
    isActive,
    hasStarted,
    isSeeking,
    paused,
    isFullscreen,
    isWaiting,
    video,
  }
}

/**
 * The primary player instance. Must be a descendent by a {VideoProvider}.
 * @param props {PlayerProps}
 * @constructor
 */
export const Player: React.FC<PlayerProps> = (props) => {
  const {children, className, container = null, fluid = true} = props
  const containerRef = React.useRef(container)
  const {
    videoService,
    isActive,
    hasStarted,
    isSeeking,
    paused,
    isFullscreen,
    isWaiting,
    video,
  } = usePlayerState()

  const handleActivity = () => videoService.send('ACTIVITY')

  function setWidthOrHeight(style: any, name: string, value: string | number) {
    let styleVal
    if (typeof value === 'string') {
      if (value === 'auto') {
        styleVal = 'auto'
      } else if (value.match(/\d+%/)) {
        styleVal = value
      }
    } else if (typeof value === 'number') {
      styleVal = `${value}px`
    }

    Object.assign(style, {
      [name]: styleVal,
    })
  }

  function getAspectRatioStyle() {
    const {
      aspectRatio: propsAspectRatio,
      height: propsHeight,
      width: propsWidth,
    } = props

    const style: any = {}
    let width
    let height
    let aspectRatio

    // The aspect ratio is either used directly or to calculate width and height.
    if (propsAspectRatio !== undefined && propsAspectRatio !== 'auto') {
      // Use any aspectRatio that's been specifically set
      aspectRatio = propsAspectRatio
    } else if (video?.videoWidth) {
      // Otherwise try to get the aspect ratio from the video metadata
      aspectRatio = `${video.videoWidth}:${video.videoHeight}`
    } else {
      // Or use a default. The video element's is 2:1, but 16:9 is more common.
      aspectRatio = '16:9'
    }

    // Get the ratio as a decimal we can use to calculate dimensions
    const ratioParts = aspectRatio.split(':')
    const ratioMultiplier = Number(ratioParts[1]) / Number(ratioParts[0])

    if (propsWidth !== undefined) {
      // Use any width that's been specifically set
      width = propsWidth
    } else if (propsHeight !== undefined) {
      // Or calulate the width from the aspect ratio if a height has been set
      width = Number(propsHeight) / ratioMultiplier
    } else {
      // Or use the video's metadata, or use the video el's default of 300
      width = video?.videoWidth ?? 400
    }

    if (propsHeight !== undefined) {
      // Use any height that's been specifically set
      height = propsHeight
    } else {
      // Otherwise calculate the height from the ratio and the width
      height = Number(width) * ratioMultiplier
    }

    if (fluid) {
      style.paddingTop = `${ratioMultiplier * 100}%`
    } else {
      // If Width contains "auto", set "auto" in style
      setWidthOrHeight(style, 'width', width)
      setWidthOrHeight(style, 'height', height)
    }

    return style
  }

  return (
    <div
      ref={(c) => {
        containerRef.current = container ? container : c
        videoService.send({type: 'SET_ROOT_ELEM', rootElemRef: containerRef})
      }}
      onMouseDown={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
      className={cx(
        {
          'cueplayer-react-controls-enabled': true,
          'cueplayer-react-has-started': hasStarted,
          'cueplayer-react-paused': paused,
          'cueplayer-react-playing': !paused,
          'cueplayer-react-waiting': isWaiting,
          'cueplayer-react-seeking': isSeeking,
          'cueplayer-react-fluid': fluid,
          'cueplayer-react-fullscreen': isFullscreen,
          'cueplayer-react-user-inactive': !isActive,
          'cueplayer-react-user-active': isActive,
          'cueplayer-react-workinghover': !browser.IS_IOS,
          // 'cueplayer-react-cues-active': !isEmpty(activeMetadataTracks),
        },
        'cueplayer-react',
        className,
      )}
    >
      <div
        className={cx('fullscreen-wrapper', {
          fullscreen: isFullscreen,
        })}
      >
        <div
          style={getAspectRatioStyle()}
          className="cueplayer-react-video-holder"
        >
          <Video>{children}</Video>
          <BigPlayButton />
          <Bezel />
          <LoadingSpinner />
        </div>
      </div>
      <ProgressBar />
      <CueBar />
      <ControlBar />
      <Shortcut />
    </div>
  )
}
