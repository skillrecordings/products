import * as React from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {SeekBar} from './seek-bar'
import {useVideo} from '../context/video-context'
import {findElPosition, getPointerPosition} from '../utils'
import {selectDuration} from '../selectors'

export const ProgressBar: React.FC<any> = (props) => {
  const videoService = useVideo()
  const duration = useSelector(videoService, selectDuration)
  const [mouseTime, setMouseTime] = React.useState({time: 0, position: 0})
  const seekBar = React.useRef(null)

  function handleMouseMove(event: React.MouseEvent) {
    if (!event.pageX) {
      return
    }

    const node = seekBar.current
    const newTime = getPointerPosition(node, event).x * duration
    const position = event.pageX - findElPosition(node).left

    setMouseTime({
      time: newTime,
      position,
    })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cx('cueplayer-react-progress-bar', props.className)}
    >
      <SeekBar mouseTime={mouseTime} ref={seekBar} {...props} />
    </div>
  )
}
