import * as React from 'react'
import {useSelector} from '@xstate/react'
import cx from 'classnames'
import {VolumeBar} from '../volume-control/volume-bar'
import {useVideo} from '../../context/video-context'
import {selectMuted, selectVolume} from '../../selectors'

export const VolumeMenuButtonControl: React.FC<React.PropsWithChildren<any>> = (
  props,
) => {
  const {className, alwaysShowVolume} = props
  const [isActive, setActive] = React.useState(alwaysShowVolume)
  const videoService = useVideo()
  const volume = useSelector(videoService, selectVolume)
  const muted = useSelector(videoService, selectMuted)

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
    !alwaysShowVolume && setActive(false)
  }

  return (
    <div className="cueplayer-react-volume-control">
      <button
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleFocus}
        onMouseLeave={handleBlur}
        title={muted ? 'Unmute' : 'Mute'}
        aria-label={muted ? 'Unmute' : 'Mute'}
        role="button"
        onClick={handleClick}
        className={cx(
          className,
          {
            'cueplayer-react-vol-muted': muted,
            'cueplayer-react-vol-0': level === 0 && !muted,
            'cueplayer-react-vol-1': level === 1,
            'cueplayer-react-vol-2': level === 2,
            'cueplayer-react-vol-3': level === 3,
          },
          'cueplayer-react-volume-menu-button',
          'cueplayer-react-control',
          'cueplayer-react-button',
          'cueplayer-react-menu-button',
        )}
      />
      <VolumeBar
        onMouseEnter={handleFocus}
        onMouseLeave={handleBlur}
        isActive={isActive}
        {...props}
      />
    </div>
  )
}
