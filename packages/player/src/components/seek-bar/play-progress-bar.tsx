import * as React from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {useVideo} from '../../context/video-context'
import {selectFormattedTime, selectPercent} from '../../selectors'

export const PlayProgressBar: React.FC<React.PropsWithChildren<any>> = ({
  className,
}) => {
  const videoService = useVideo()
  const formattedTime = useSelector(videoService, selectFormattedTime)
  const percent = `${useSelector(videoService, selectPercent) * 100}%`

  return (
    <div
      data-current-time={formattedTime}
      className={cx(
        'cueplayer-react-play-progress cueplayer-react-slider-bar',
        className,
      )}
      style={{
        width: percent,
      }}
    >
      <span className="cueplayer-react-control-text">
        {`Progress: ${percent}`}
      </span>
    </div>
  )
}
