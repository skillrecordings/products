import * as React from 'react'
import cx from 'classnames'
import {Slider} from '../core/slider'
import {useSelector} from '@xstate/react'
import {SyntheticEvent} from 'react'
import {VolumeLevel} from './volume-level'
import {useVideo} from '../../context/video-context'
import {getPointerPosition} from '../../utils'
import {selectMuted, selectVolume} from '../../selectors'

export const VolumeBar: React.FC<any> = (props) => {
  const {className} = props
  const videoService = useVideo()
  const volume = useSelector(videoService, selectVolume)
  const muted = useSelector(videoService, selectMuted)

  const sliderRef = React.useRef(null)

  const formattedVolume = (volume * 100).toFixed(2)

  function calculateDistance(event: Event | SyntheticEvent) {
    // forwarding refs made for a bit of a weird situation with
    // the typing but there IS a ref here
    const node = sliderRef?.current
    const position = getPointerPosition(node, event)
    return position.x
  }

  function getPercent() {
    if (muted) {
      return 0
    }
    return volume
  }

  function checkMuted() {
    if (muted) {
      videoService.send('TOGGLE_MUTE')
    }
  }

  function handleMouseMove(event: Event) {
    checkMuted()
    const distance = calculateDistance(event)
    videoService.send({type: 'VOLUME_CHANGE', volume: distance})
  }

  function stepForward() {
    checkMuted()
    videoService.send({type: 'VOLUME_CHANGE', volume: volume + 0.1})
  }

  function stepBack() {
    checkMuted()
    videoService.send({type: 'VOLUME_CHANGE', volume: volume - 0.1})
  }

  function handleFocus(e: Event) {
    if (props.onFocus) {
      props.onFocus(e)
    }
  }

  function handleBlur(e: Event) {
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  function handleClick(event: Event) {
    event.stopPropagation()
  }

  return (
    <Slider
      ref={sliderRef}
      label="volume level"
      valuenow={formattedVolume}
      valuetext={`${formattedVolume}%`}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      sliderActive={handleFocus}
      sliderInactive={handleBlur}
      getPercent={getPercent}
      stepForward={stepForward}
      stepBack={stepBack}
      {...props}
      className={cx(
        className,
        'cueplayer-react-volume-bar cueplayer-react-slider-bar',
      )}
    >
      <VolumeLevel {...props} />
    </Slider>
  )
}
