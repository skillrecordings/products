import * as React from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {useVideo} from '../../context/video-context'
import {selectFormattedTime} from '../../selectors'

export const CurrentTimeDisplay: React.FC<React.PropsWithChildren<any>> = ({
  className,
}) => {
  const videoService = useVideo()
  const formattedTime = useSelector(videoService, selectFormattedTime)

  return (
    <div
      className={cx(
        'cueplayer-react-current-time cueplayer-react-time-control cueplayer-react-control',
        className,
      )}
    >
      <div className="cueplayer-react-current-time-display" aria-live="off">
        <span className="cueplayer-react-control-text">Current Time </span>
        {formattedTime}
      </div>
    </div>
  )
}
