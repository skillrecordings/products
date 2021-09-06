import * as React from 'react'
import cx from 'classnames'
import {MenuButton} from '../menu/menu-button'
import {VideoContext} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectPlaybackRate} from '../../selectors'

type PlaybackRateMenuButtonProps = {
  className?: string
  rates?: number[]
  selected?: number
  onChange?: (rate: number) => void
}

export const PlaybackRateMenuButton: React.FC<PlaybackRateMenuButtonProps> = (
  props,
) => {
  const {videoService} = React.useContext(VideoContext)
  const playbackRate = useSelector(videoService, selectPlaybackRate)
  const {
    rates = [2, 1.5, 1.25, 1, 0.5, 0.25],
    selected = playbackRate,
    onChange,
  } = props
  const items = rates.map((rate) => ({
    label: `${rate}x`,
    value: rate,
  }))

  const handleSelectItem = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < rates.length) {
        videoService.send({
          type: 'PLAYBACKRATE_CHANGE',
          playbackRate: rates[index],
        })
        if (onChange) {
          onChange(rates[index])
        }
      }
    },
    [onChange, rates, videoService],
  )

  // remember 0  is a "false" in JS 🥴
  const selectedIndex =
    rates.indexOf(selected) > -1
      ? rates.indexOf(selected)
      : rates.indexOf(playbackRate) || 0

  React.useEffect(() => {
    const selectedIndex =
      rates.indexOf(selected) > -1
        ? rates.indexOf(selected)
        : rates.indexOf(playbackRate) || 0

    handleSelectItem(selectedIndex)
  }, [handleSelectItem, playbackRate, rates, selected])

  return (
    <MenuButton
      className={cx('cueplayer-react-playback-rate', props.className)}
      onSelectItem={handleSelectItem}
      items={items}
      selectedIndex={selectedIndex}
    >
      <span className="cueplayer-react-control-text">Playback Rate</span>
      <div className="cueplayer-react-playback-rate-value">
        {`${playbackRate.toFixed(2)}x`}
      </div>
    </MenuButton>
  )
}
