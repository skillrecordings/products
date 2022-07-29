import * as React from 'react'
import {useVideo} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectVideo} from '../../selectors'

type ForwardReplayControlProps = {
  mode?: 'forward' | 'replay'
  className?: string
  seconds?: 5 | 10 | 30
}
export const ForwardReplayControl: React.FC<
  React.PropsWithChildren<ForwardReplayControlProps>
> = React.forwardRef<HTMLButtonElement, ForwardReplayControlProps>(
  (props, ref) => {
    const {seconds = 10, className, mode = 'forward'} = props
    const videoService = useVideo()
    const video = useSelector(videoService, selectVideo)
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
      if (!video) return
      if (mode === 'forward') {
        const seekingTime = video.currentTime + seconds
        videoService.send({
          type: 'SEEKING',
          seekingTime:
            seekingTime < video.duration ? seekingTime : video.duration,
        })
      } else {
        const seekingTime = video.currentTime - seconds
        videoService.send({
          type: 'SEEKING',
          seekingTime: seekingTime > 0 ? seekingTime : 0,
        })
      }

      videoService.send('END_SEEKING')
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
