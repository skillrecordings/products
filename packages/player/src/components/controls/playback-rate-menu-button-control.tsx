import * as React from 'react'
import cx from 'classnames'
import {
  ListboxItem,
  ListboxButton,
  ListboxGroup,
} from '../listbox/listbox-button'
import {useVideo} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import find from 'lodash/find'
import {selectPlaybackRate} from '../../selectors'

type PlaybackRateMenuButtonProps = {
  className?: string
  rates?: number[]
  selected?: number
  onChange?: (rate: number) => void
}

export const PlaybackRateMenuButtonControl: React.FC<
  React.PropsWithChildren<PlaybackRateMenuButtonProps>
> = (props) => {
  const videoService = useVideo()
  const playbackRate = useSelector(videoService, selectPlaybackRate)
  const {
    rates = [3, 2.5, 2, 1.5, 1.25, 1, 0.5, 0.25],
    selected = playbackRate,
    onChange,
  } = props

  const items: ListboxItem[] = rates.map((rate) => ({
    label: `${rate}×`,
    value: `${rate}`,
  }))

  const group: ListboxGroup = {
    label: 'Speed',
    items,
  }
  const selectedItem: ListboxItem =
    find(items, {value: selected.toString()}) || items[3]

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

  React.useEffect(() => {
    const selectedIndex =
      rates.indexOf(selected) > -1
        ? rates.indexOf(selected)
        : rates.indexOf(playbackRate) || 0

    handleSelectItem(selectedIndex)
  }, [handleSelectItem, playbackRate, rates, selected])

  const title = `${
    playbackRate?.toString() === '1' ? 'Normal' : playbackRate
  } playback speed`

  return (
    <div className="cueplayer-react-playback-rate">
      <ListboxButton
        className={cx('cueplayer-react-playback-rate-button', props.className)}
        selectedItem={selectedItem}
        onSelectItem={handleSelectItem}
        title={title}
        items={[group]}
      >
        <span className="cueplayer-react-control-text">Playback Rate</span>
        <div className="cueplayer-react-playback-rate-value">
          {`${playbackRate.toFixed(2)}×`}
        </div>
      </ListboxButton>
    </div>
  )
}
