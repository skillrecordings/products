import * as React from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {useVideo} from '../../context/video-context'
import {selectPaused, selectHasEnded} from '../../selectors'

export const PlayToggleControl: React.FC<React.PropsWithChildren<any>> =
  React.forwardRef<HTMLButtonElement, any>(({className}, ref) => {
    const videoService = useVideo()
    const paused = useSelector(videoService, selectPaused)
    const ended = useSelector(videoService, selectHasEnded)
    const controlText = paused ? 'Play' : 'Pause'

    function handleClick() {
      if (paused) {
        videoService.send('PLAY')
      } else {
        videoService.send('PAUSE')
      }
    }

    return (
      <button
        ref={ref}
        className={cx(className, {
          'cueplayer-react-play-control': true,
          'cueplayer-react-control': true,
          'cueplayer-react-button': true,
          'cueplayer-react-paused': paused,
          'cueplayer-react-playing': !paused,
          'cueplayer-react-ended': ended,
        })}
        type="button"
        tabIndex={0}
        onClick={handleClick}
      >
        <span className="cueplayer-react-control-text">{controlText}</span>
      </button>
    )
  })
