import * as React from 'react'

export const useCue = (cue: VTTCue) => {
  const setActive = React.useCallback(
    function setActive(active) {
      if (active) {
        console.log('activate cue', cue)
      } else {
        console.log('deactivate cue', cue)
      }
    },
    [cue],
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
