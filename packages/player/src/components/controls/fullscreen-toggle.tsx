import * as React from 'react'
import cx from 'classnames'
import {ForwardedRef, MutableRefObject} from 'react'
import {VideoContext} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectIsFullscreen} from '../player'

type FullscrenToggleProps = {
  className?: string
  ref?: ForwardedRef<HTMLButtonElement>
  fullscreenElement?: HTMLElement
}

export const FullscreenToggle: React.FC<FullscrenToggleProps> =
  React.forwardRef<HTMLButtonElement, FullscrenToggleProps>((props, ref) => {
    const {className} = props
    const {videoService} = React.useContext(VideoContext)
    const isFullscreen = useSelector(videoService, selectIsFullscreen)
    function handleClick() {
      const {fullscreenElement} = props
      videoService.send({type: 'TOGGLE_FULLSCREEN', element: fullscreenElement})
    }
    return (
      <button
        className={cx(
          className,
          {
            'cueplayer-react-icon-fullscreen-exit': isFullscreen,
            'cueplayer-react-icon-fullscreen': !isFullscreen,
          },
          'cueplayer-react-fullscreen-control cueplayer-react-control cueplayer-react-button cueplayer-react-icon',
        )}
        ref={ref}
        type="button"
        tabIndex={0}
        onClick={handleClick}
      >
        <span className="cueplayer-react-control-text">Non-Fullscreen</span>
      </button>
    )
  })
