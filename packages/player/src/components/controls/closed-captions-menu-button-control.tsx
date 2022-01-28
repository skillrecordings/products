import * as React from 'react'
import cx from 'classnames'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import isEmpty from 'lodash/isEmpty'
import {MenuButton} from '../menu/menu-button'
import {useSubtitlesTrackList} from '../../hooks/use-subtitles-track-list'

type ClosedCaptionsMenuButtonProps = {
  className?: string
  subtitles?: TextTrackList
  selected?: TextTrack
  onChange?: (rate: TextTrack) => void
}

export const ClosedCaptionsMenuButtonControl: React.FC<ClosedCaptionsMenuButtonProps> =
  (props) => {
    const {subtitles, activateSubtitlesTrack, clearSubtitlesTracks} =
      useSubtitlesTrackList()

    const items = [
      ...subtitles.map((track) => ({
        label: `${track.label}`,
        value: track.language,
      })),
      {
        label: 'Off',
        value: {},
      },
    ]

    const activeTrack =
      subtitles && subtitles.filter((track) => track.mode === 'showing')

    const activeItemIndex = indexOf(
      items,
      find(items, (track) => track.value === activeTrack[0]?.language),
    )

    const lastItemIndex = items.length - 1
    const selectedIndex = isEmpty(activeTrack) ? lastItemIndex : activeItemIndex

    const handleSelectItem = React.useCallback(
      (index: number) => {
        const track = subtitles[index]
        track?.language ? activateSubtitlesTrack(track) : clearSubtitlesTracks()
      },
      [subtitles],
    )

    return !isEmpty(subtitles) ? (
      <MenuButton
        className={cx('cueplayer-react-closed-caption', props.className)}
        onSelectItem={handleSelectItem}
        items={items}
        selected={selectedIndex}
      >
        <span className="cueplayer-react-control-text">Subtitles</span>
      </MenuButton>
    ) : null
  }
