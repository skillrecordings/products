import React from 'react'
import {selectAutoplay} from '../selectors'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'

const AutoplayToggle = () => {
  const videoService = useVideo()
  const autoplay = useSelector(videoService, selectAutoplay)

  return (
    <button
      onClick={() => {
        videoService.send('TOGGLE_AUTOPLAY')
      }}
    >
      autoplay is {autoplay ? 'on' : 'off'}
    </button>
  )
}

export {AutoplayToggle}
