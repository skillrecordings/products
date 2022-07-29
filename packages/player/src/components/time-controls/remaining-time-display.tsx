import * as React from 'react'
import cx from 'classnames'
import {useVideo} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectFormattedRemainingTime} from '../../selectors'

export const RemainingTimeDisplay: React.FC<React.PropsWithChildren<any>> = ({
  className,
}) => {
  const videoService = useVideo()
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
