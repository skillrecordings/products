import * as React from 'react'
import {VideoContext} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectCurrentTime, selectDuration} from '../player'

type ForwardReplayControlProps = {
  mode?: 'forward' | 'replay'
  className?: string
  seconds?: 5 | 10 | 30
}
export const ForwardReplayControl: React.FC<ForwardReplayControlProps> =
  React.forwardRef<HTMLButtonElement, ForwardReplayControlProps>(
    (props, ref) => {
      const {seconds = 10, className, mode = 'forward'} = props
      const {videoService} = React.useContext(VideoContext)
      const duration = useSelector(videoService, selectDuration)
      const currentTime = useSelector(videoService, selectCurrentTime)
      const classNames = [
        'cueplayer-react-control',
        'cueplayer-react-button',
        'cueplayer-react-icon',
      ]
      classNames.push(
        `cueplayer-react-icon-${mode}-${seconds}`,
        `cueplayer-react-${mode}-control`,
      )
      if (className) {
        classNames.push(className)
      }

      function handleClick() {
        // Depends mode to implement different actions
        if (mode === 'forward') {
          const seekingTime = currentTime + seconds
          videoService.send({
            type: 'SEEKING',
            seekingTime: seekingTime < duration ? seekingTime : duration,
          })
        } else {
          const seekingTime = currentTime - seconds
          videoService.send({
            type: 'SEEKING',
            seekingTime: seekingTime > 0 ? seekingTime : 0,
          })
        }
      }

      return (
        <button
          ref={ref}
          className={classNames.join(' ')}
          type="button"
          onClick={handleClick}
        >
          <span className="cueplayer-react-control-text">{`${mode} ${seconds} seconds`}</span>
        </button>
      )
    },
  )
