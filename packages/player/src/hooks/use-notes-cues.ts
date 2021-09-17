import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import {selectMetadataTracks, selectTextTracks, selectVideo} from '../selectors'
import * as React from 'react'
import {cueCountFromTracks} from '../utils/cue-count-from-tracks'

/**
 * Returns and array of VTTCues from the current video element.
 *
 * @return {VTTCue[]}
 */
export const useNotesCues = () => {
  const [trackListUpdated, setTrackListUpdated] = React.useState(false)
  const [cues, setCues] = React.useState<VTTCue[]>([])
  const videoService = useVideo()
  const metadataTracks = useSelector(videoService, selectMetadataTracks)
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
      textTracks.addEventListener('addtrack', handleTrackChanges)
      textTracks.addEventListener('removetrack', handleTrackChanges)
    }

    return () => {
      if (textTracks) {
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

  /**
   * if the number of metadata track cues changes, we want to load
   * the cues
   */
  let cueCount = cueCountFromTracks(metadataTracks)

  /**
   * parse the metadata tracks when the total cue count changes and set
   * the cues in local state to return
   */
  React.useEffect(() => {
    const noteTracks: any[] = metadataTracks.filter((track: TextTrack) => {
      return track.label === 'notes'
    })

    const allCues: VTTCue[] = noteTracks.reduce(
      (acc: VTTCue[], track: TextTrack) => {
        return [...acc, ...Array.from(track.cues || [])]
      },
      [],
    )

    setCues(allCues)
  }, [metadataTracks, cueCount])

  return cues
}
