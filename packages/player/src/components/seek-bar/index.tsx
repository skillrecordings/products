import * as React from 'react'
import {SyntheticEvent} from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {useVideo} from '../../context/video-context'
import {convertTimeWithTitles} from '@skillrecordings/time'
import {getPointerPosition} from '../../utils'
import {selectCurrentTime, selectDuration} from '../../selectors'
import {
  SliderHandle,
  SliderInput,
  SliderRange,
  SliderTrack,
} from '@reach/slider'
import {LoadProgressBar} from './load-progress-bar'

export const SeekBar: React.FC<React.PropsWithChildren<any>> = (props) => {
  const videoService = useVideo()
  const duration = useSelector(videoService, selectDuration)
  const currentTime = useSelector(videoService, selectCurrentTime)
  const ref = React.useRef(null)
  const [isActive, setActive] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState(0)

  const handleMouseEnter = (e: SyntheticEvent) => {
    return setActive(true)
  }

  const handleMouseLeave = () => {
    return setActive(false)
  }

  function calculateDistance(event: Event | SyntheticEvent) {
    const node = ref?.current
    const position = getPointerPosition(node, event)
    return position.x
  }

  return (
    <SliderInput
      ref={ref}
      onMouseMoveCapture={(e: SyntheticEvent) => {
        setMousePosition(calculateDistance(e))
      }}
      onMouseOut={() => {
        setMousePosition(0)
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{width: '100%'}}
      min={0}
      max={duration}
      value={currentTime}
      step={0.5}
      handleAlignment="contain"
      onChange={(newValue) => {
        videoService.send({
          type: 'SEEKING',
          seekingTime: newValue,
        })
        videoService.send('END_SEEKING')
      }}
      aria-label="seek slider"
      getAriaValueText={(value = 0) => {
        const currentValue = Number(value.toFixed(0))

        const currentTime =
          currentValue === 0
            ? '0 seconds'
            : convertTimeWithTitles(currentValue, {
                showSeconds: true,
                longForm: true,
              })
        return (
          currentTime +
          ` of ${convertTimeWithTitles(duration, {
            showSeconds: true,
            longForm: true,
          })}`
        )
      }}
    >
      {({hasFocus}) => {
        const isVisible = hasFocus || isActive

        return (
          <SliderTrack
            className={cx('cueplayer-react-progress-slider', {
              'cueplayer-react-progress-slider-active': isVisible,
            })}
          >
            <LoadProgressBar />
            <div
              className={cx('cueplayer-react-progress-slider-highlight')}
              style={{
                width: mousePosition * 100 + '%',
              }}
            />
            <SliderRange />
            <SliderHandle />
          </SliderTrack>
        )
      }}
    </SliderInput>
  )
}
