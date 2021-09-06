import * as React from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {VideoContext} from '../../context/video-context'
import {selectPaused} from '../player'

export const PlayToggle: React.FC<any> = React.forwardRef<
  HTMLButtonElement,
  any
>(({className}, ref) => {
  const {videoService} = React.useContext(VideoContext)
  const paused = useSelector(videoService, selectPaused)
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
      })}
      type="button"
      tabIndex={0}
      onClick={handleClick}
    >
      <span className="cueplayer-react-control-text">{controlText}</span>
    </button>
  )
})
