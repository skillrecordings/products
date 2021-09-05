import * as React from 'react'
import {useSelector} from '@xstate/react'
import {MouseEvent} from 'react'
import cx from 'classnames'
import {selectDuration} from '../player'
import {SeekBar} from './seek-bar'
import {VideoContext} from '../../context/video-context'
import {findElPosition, getPointerPosition} from '../../utils'

export const ProgressControl: React.FC<any> = (props) => {
  const {videoService} = React.useContext(VideoContext)
  const duration = useSelector(videoService, selectDuration)
  const [mouseTime, setMouseTime] = React.useState({time: 0, position: 0})
  const seekBar = React.useRef(null)

  function handleMouseMove(event: MouseEvent) {
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
      className={cx(
        'cueplayer-react-progress-control cueplayer-react-control',
        props.className,
      )}
    >
      <SeekBar mouseTime={mouseTime} ref={seekBar} {...props} />
    </div>
  )
}
