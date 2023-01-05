import React from 'react'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react/*'

const ignoredInputs = ['input', 'select', 'button', 'textarea', 'mux-player']

export const useGlobalPlayerShortcuts = (muxPlayerRef: {
  current: MuxPlayerRefAttributes
}) => {
  const handleUserKeyPress = React.useCallback((e: any) => {
    const activeElement = document.activeElement
    if (
      activeElement &&
      ignoredInputs.indexOf(activeElement.tagName.toLowerCase()) === -1
    ) {
      if (muxPlayerRef.current) {
        if (e.key === ' ') {
          e.preventDefault()
          muxPlayerRef.current.paused
            ? muxPlayerRef.current.play()
            : muxPlayerRef.current.pause()
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          muxPlayerRef.current.currentTime =
            muxPlayerRef.current.currentTime +
            (muxPlayerRef.current.forwardSeekOffset || 10)
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          muxPlayerRef.current.currentTime =
            muxPlayerRef.current.currentTime -
            (muxPlayerRef.current.forwardSeekOffset || 10)
        }
      }
    }
  }, [])

  React.useEffect(() => {
    window.document?.addEventListener('keydown', handleUserKeyPress)
    return () => {
      window.document?.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [handleUserKeyPress])
}
