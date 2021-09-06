import * as React from 'react'
import {SyntheticEvent} from 'react'
import {useSelector} from '@xstate/react'
import {Slider} from '../slider'
import cx from 'classnames'
import {LoadProgressBar} from './load-progress-bar'
import {PlayProgressBar} from './play-progress-bar'
import {VideoContext} from '../../context/video-context'
import {getPointerPosition} from '../../utils'
import {
  selectCurrentTime,
  selectDuration,
  selectFormattedTime,
  selectPercent,
  selectSeekTime,
} from '../../selectors'

export const SeekBar: React.FC<any> = React.forwardRef<HTMLDivElement, any>(
  (props, ref) => {
    // currentTime, seekingTime, duration, buffered
    const {videoService} = React.useContext(VideoContext)
    const formattedTime = useSelector(videoService, selectFormattedTime)
    const percent = useSelector(videoService, selectPercent)
    const duration = useSelector(videoService, selectDuration)
    const currentTime = useSelector(videoService, selectCurrentTime)
    const seekingTime = useSelector(videoService, selectSeekTime)

    function calculateDistance(event: Event | SyntheticEvent) {
      // forwarding refs made for a bit of a weird situation with
      // the typing but there IS a ref here
      // @ts-ignore
      const node = ref?.current
      const position = getPointerPosition(node, event)
      return position.x
    }

    function getNewTime(event: Event | SyntheticEvent) {
      const distance = calculateDistance(event)
      const newTime = distance * duration
      // Don't let video end while scrubbing.
      return newTime === duration ? newTime - 0.1 : newTime
    }

    function handleMouseDown() {}

    function handleMouseUp(event: Event | SyntheticEvent) {
      const newTime = getNewTime(event)
      videoService.send({type: 'SEEKING', seekingTime: newTime})
      videoService.send('END_SEEKING')
    }

    function handleMouseMove(event: Event | SyntheticEvent) {
      const newTime = getNewTime(event)
      videoService.send({type: 'SEEKING', seekingTime: newTime})
    }

    function stepForward() {
      let newTime = currentTime + 10
      if (newTime > duration) {
        newTime = duration
      }
      videoService.send({type: 'SEEKING', seekingTime: newTime})
    }

    function stepBack() {
      let newTime = currentTime - 10
      if (newTime < 0) {
        newTime = 0
      }
      videoService.send({type: 'SEEKING', seekingTime: newTime})
    }

    function getPercent() {
      const time = seekingTime || currentTime
      const percent = time / duration
      return percent >= 1 ? 1 : percent
    }

    return (
      <Slider
        ref={ref}
        label="video progress bar"
        className={cx('cueplayer-react-progress-holder', props.className)}
        valuenow={(percent * 100).toFixed(2)}
        valuetext={formattedTime}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        getPercent={getPercent}
        stepForward={stepForward}
        stepBack={stepBack}
      >
        <LoadProgressBar />
        {/*<MouseTimeDisplay duration={duration} mouseTime={mouseTime} />*/}
        <PlayProgressBar />
      </Slider>
    )
  },
)
