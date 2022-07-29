import * as React from 'react'
import cx from 'classnames'
import {ForwardedRef, MutableRefObject} from 'react'
import {useVideo} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectIsFullscreen, selectRootElem} from '../../selectors'

type FullscrenToggleProps = {
  className?: string
  ref?: ForwardedRef<HTMLButtonElement>
}

export const FullscreenToggleControl: React.FC<
  React.PropsWithChildren<FullscrenToggleProps>
> = React.forwardRef<HTMLButtonElement, FullscrenToggleProps>((props, ref) => {
  const {className} = props
  const videoService = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const rootElem = useSelector(videoService, selectRootElem)

  function handleClick() {
    isFullscreen
      ? videoService.send({type: 'EXIT_FULLSCREEN', element: rootElem})
      : videoService.send({type: 'TOGGLE_FULLSCREEN', element: rootElem})
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
      <span className="cueplayer-react-control-text">
        {isFullscreen ? 'Exit full screen (f)' : 'Full screen (f)'}
      </span>
    </button>
  )
})
