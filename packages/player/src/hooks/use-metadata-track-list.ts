import {useVideo} from '../context/video-context'
import * as React from 'react'
import {useSelector} from '@xstate/react'
import {selectTextTracks} from '../selectors'

export const useMetadataTrackList = () => {
  const videoService = useVideo()
  const [trackListUpdated, setTrackListUpdated] = React.useState(true)
  const textTracks = useSelector(videoService, selectTextTracks)

  /**
   * listen to add an remove track events on the {TextTrackList} so we can
   * clear and update the cues accordingly
   */
  React.useEffect(() => {
    function handleTrackChanges() {
      setTrackListUpdated(true)
    }

    if (textTracks) {
      textTracks.addEventListener('change', handleTrackChanges)
      textTracks.addEventListener('addtrack', handleTrackChanges)
      textTracks.addEventListener('removetrack', handleTrackChanges)
    }

    return () => {
      if (textTracks) {
        textTracks.removeEventListener('change', handleTrackChanges)
        textTracks.removeEventListener('addtrack', handleTrackChanges)
        textTracks.removeEventListener('removetrack', handleTrackChanges)
      }
    }
  }, [textTracks])

  /**
   * monitor the textTracks on the current video element and register
   * any metadata tracks that appear
   */
  React.useEffect(() => {
    if (trackListUpdated) {
      videoService.send({type: 'CLEAR_METADATA_TRACKS'})

      // {TextTrackList} objects aren't real arrays so you have to
      // convert them accordingly
      const tracks = Array.from(textTracks || []).filter((track) => {
        return ['metadata'].includes(track.kind)
      })

      tracks.forEach((track) => {
        videoService.send({type: 'ACTIVATE_METADATA_TRACK', track})
      })
    }

    setTrackListUpdated(false)
  }, [videoService, textTracks, trackListUpdated])
}
