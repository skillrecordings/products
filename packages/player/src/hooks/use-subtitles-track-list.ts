import * as React from 'react'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import {selectTextTracks} from '../selectors'
import {getPlayerPrefs} from './use-player-prefs'
import find from 'lodash/find'

export const useSubtitlesTrackList = () => {
  const videoService = useVideo()
  const textTracks = useSelector(videoService, selectTextTracks)

  const subtitles = Array.from(textTracks || []).filter((track) => {
    return ['subtitles'].includes(track.kind)
  })

  const activateSubtitlesTrack = (track: any) => {
    videoService.send({type: 'ACTIVATE_SUBTITLES_TRACK', track})
  }
  const clearSubtitlesTracks = () => {
    videoService.send({type: 'CLEAR_SUBTITLES_TRACKS'})
  }

  /**
   * Get subtitle preference from cookie and activate it
   */
  const {
    subtitle: {language},
  } = getPlayerPrefs()

  React.useEffect(() => {
    const currentSubtitles =
      textTracks && find(subtitles, (track) => track?.language === language)
    currentSubtitles && activateSubtitlesTrack(currentSubtitles)
  }, [textTracks, subtitles])

  return {
    subtitles,
    activateSubtitlesTrack,
    clearSubtitlesTracks,
  }
}
