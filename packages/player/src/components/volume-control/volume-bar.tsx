import * as React from 'react'
import cx from 'classnames'
import {useSelector} from '@xstate/react'
import {useVideo} from '../../context/video-context'
import {selectMuted, selectVolume} from '../../selectors'
import {
  SliderInput,
  SliderTrack,
  SliderRange,
  SliderHandle,
} from '@reach/slider'

export const VolumeBar: React.FC<React.PropsWithChildren<any>> = ({
  isActive,
  ...props
}) => {
  const {className, onMouseEnter, onMouseLeave} = props
  const videoService = useVideo()
  const volume = useSelector(videoService, selectVolume)
  const muted = useSelector(videoService, selectMuted)

  function getVolume() {
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

  function formattedVolume(value: number) {
    return (value * 100).toFixed(0) + `% ${muted ? 'volume muted' : 'volume'}`
  }

  return (
    <SliderInput
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      min={0}
      max={1}
      value={getVolume()}
      defaultValue={getVolume()}
      step={0.05}
      handleAlignment="contain"
      getAriaValueText={(value = 0) => formattedVolume(muted ? volume : value)}
      aria-label="volume slider"
      onChange={(newValue) => {
        checkMuted()
        videoService.send({type: 'VOLUME_CHANGE', volume: newValue})
      }}
      className={cx(className, 'cueplayer-react-volume-bar')}
      {...props}
    >
      {({hasFocus}) => {
        const isVisible = hasFocus || isActive
        return (
          <SliderTrack
            className={cx('cueplayer-react-volume-slider', {
              'cueplayer-react-volume-slider-active': isVisible,
            })}
          >
            <SliderRange />
            <SliderHandle />
          </SliderTrack>
        )
      }}
    </SliderInput>
  )
}
