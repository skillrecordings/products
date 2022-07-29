import * as React from 'react'
import cx from 'classnames'
import isEmpty from 'lodash/isEmpty'
import first from 'lodash/first'
import last from 'lodash/last'
import {
  ListboxItem,
  ListboxButton,
  ListboxGroup,
} from '../listbox/listbox-button'
import {useSubtitlesTrackList} from '../../hooks/use-subtitles-track-list'

type ClosedCaptionsMenuButtonProps = {
  className?: string
  subtitles?: TextTrackList
  selected?: TextTrack
  onChange?: (rate: TextTrack) => void
}

export const ClosedCaptionsMenuButtonControl: React.FC<
  React.PropsWithChildren<ClosedCaptionsMenuButtonProps>
> = (props) => {
  const {subtitles, activateSubtitlesTrack, clearSubtitlesTracks} =
    useSubtitlesTrackList()

  const items: ListboxItem[] = [
    ...subtitles.map((track: TextTrack) => {
      return {
        mode: track.mode,
        value: track.language,
        label: track.label,
      }
    }),
    {
      label: 'Off',
      value: 'off',
    },
  ]

  const activeTrack: any = first(
    items.filter((track: TextTrack | ListboxItem) => track.mode === 'showing'),
  )

  const activeItem: ListboxItem = isEmpty(activeTrack)
    ? last(items)
    : activeTrack

  const groups: ListboxGroup[] = [
    {
      label: 'Closed Captions',
      items,
    },
  ]

  const handleSelectItem = React.useCallback(
    (index: number) => {
      const track = subtitles[index]
      track?.language ? activateSubtitlesTrack(track) : clearSubtitlesTracks()
    },
    [subtitles],
  )

  return !isEmpty(subtitles) ? (
    <div className="cueplayer-react-closed-caption">
      <ListboxButton
        className={cx(props.className)}
        selectedItem={activeItem}
        onSelectItem={handleSelectItem}
        items={groups}
        title={'Closed captions'}
      >
        <span className="cueplayer-react-control-text">
          {activeItem.label} subtitles
        </span>
      </ListboxButton>
    </div>
  ) : null
}
