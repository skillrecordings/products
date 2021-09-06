import * as React from 'react'
import cx from 'classnames'
import {VideoContext} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectFormattedRemainingTime} from '../player'

export const RemainingTimeDisplay: React.FC<any> = ({className}) => {
  const {videoService} = React.useContext(VideoContext)
  const formattedTime = useSelector(videoService, selectFormattedRemainingTime)

  return (
    <div
      className={cx(
        'cueplayer-react-remaining-time cueplayer-react-time-control cueplayer-react-control',
        className,
      )}
    >
      <div className="cueplayer-react-remaining-time-display" aria-live="off">
        <span className="cueplayer-react-control-text">Remaining Time </span>
        {`-${formattedTime}`}
      </div>
    </div>
  )
}
