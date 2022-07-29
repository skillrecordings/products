import * as React from 'react'
import {useVideo} from '../context/video-context'

export const useCue = (cue: VTTCue) => {
  const videoService = useVideo()
  const setActive = React.useCallback(
    function setActive(active: any) {
      if (active) {
        videoService.send({type: 'ACTIVATE_CUE', cue})
      } else {
        videoService.send({type: 'DEACTIVATE_CUE', cue})
      }
    },
    [cue, videoService],
  )

  React.useEffect(() => {
    const enterCue = () => {
      setActive(true)
    }

    const exitCue = () => {
      setActive(false)
    }

    cue.addEventListener('enter', enterCue)
    cue.addEventListener('exit', exitCue)

    return () => {
      cue.removeEventListener('enter', enterCue)
      cue.removeEventListener('exit', exitCue)
    }
  }, [cue, setActive])

  return setActive
}
