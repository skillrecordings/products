import * as React from 'react'
import {useSelector} from '@xstate/react'
import {PopupButton} from '../popup/popup-button'
import cx from 'classnames'
import {VolumeBar} from '../volume-control/volume-bar'
import {useVideo} from '../../context/video-context'
import {selectMuted, selectVolume} from '../../selectors'

export const VolumeMenuButtonControl: React.FC<any> = (props) => {
  const {className, vertical = false, alwaysShowVolume} = props
  const [active, setActive] = React.useState(false)
  const videoService = useVideo()
  const volume = useSelector(videoService, selectVolume)
  const muted = useSelector(videoService, selectMuted)

  const inline = !vertical
  const level = volumeLevel()

  function volumeLevel() {
    let level = 3
    if (volume === 0 || muted) {
      level = 0
    } else if (volume < 0.33) {
      level = 1
    } else if (volume < 0.67) {
      level = 2
    }
    return level
  }

  function handleClick() {
    videoService.send('TOGGLE_MUTE')
  }

  function handleFocus() {
    setActive(true)
  }

  function handleBlur() {
    setActive(false)
  }

  return (
    <PopupButton
      className={cx(
        className,
        {
          'cueplayer-react-volume-menu-button-vertical': vertical,
          'cueplayer-react-volume-menu-button-horizontal': !vertical,
          'cueplayer-react-vol-muted': muted,
          'cueplayer-react-vol-0': level === 0 && !muted,
          'cueplayer-react-vol-1': level === 1,
          'cueplayer-react-vol-2': level === 2,
          'cueplayer-react-vol-3': level === 3,
          'cueplayer-react-slider-active': alwaysShowVolume || active,
          'cueplayer-react-lock-showing': alwaysShowVolume || active,
        },
        'cueplayer-react-volume-menu-button',
      )}
      onClick={handleClick}
      inline={inline}
    >
      <VolumeBar onFocus={handleFocus} onBlur={handleBlur} {...props} />
    </PopupButton>
  )
}
