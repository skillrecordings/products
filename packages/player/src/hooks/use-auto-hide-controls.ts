import React from 'react'
import * as browser from '../utils/browser'
import {useSelector} from '@xstate/react'
import {selectIsFullscreen} from '../selectors'
import {useVideo} from '../context/video-context'

const DELAY = 1250

const useAutoHideControls = () => {
  const [controlsHovered, setControlsHovered] = React.useState<boolean>(false)
  const [controlsHidden, setControlsHidden] = React.useState<boolean>(false)

  const videoService = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)

  React.useEffect(() => {
    !isFullscreen && setControlsHidden(false)

    const hideControlsInFullscreen = setTimeout(() => {
      if (!browser.IS_IOS && !controlsHovered && isFullscreen)
        setControlsHidden(true)
    }, DELAY)

    return () => clearTimeout(hideControlsInFullscreen)
  }, [isFullscreen, controlsHidden, controlsHovered])

  return {
    controlsHidden,
    setControlsHovered,
    setControlsHidden,
  }
}

export {useAutoHideControls}
