import * as React from 'react'
import cx from 'classnames'
import {VideoContext} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectFormattedDuration} from '../player'

export const DurationDisplay: React.FC<any> = ({className}) => {
  const {videoService} = React.useContext(VideoContext)
  const formattedTime = useSelector(videoService, selectFormattedDuration)
  return (
    <div
      className={cx(
        className,
        'cueplayer-react-duration cueplayer-react-time-control cueplayer-react-control',
      )}
    >
      <div className="cueplayer-react-duration-display" aria-live="off">
        <span className="cueplayer-react-control-text">Duration Time </span>
        {formattedTime}
      </div>
    </div>
  )
}
