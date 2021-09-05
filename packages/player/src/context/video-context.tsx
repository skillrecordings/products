import {ActorRefFrom} from 'xstate'
import * as React from 'react'
import {createContext} from 'react'
import {useInterpret} from '@xstate/react'
import {videoMachine} from '../machines/video-machine'

interface VideoContextType {
  videoService: ActorRefFrom<typeof videoMachine>
}

export const VideoContext = createContext({} as VideoContextType)

export const VideoProvider: React.FC = (props) => {
  const videoService = useInterpret(videoMachine, {
    actions: {
      setPlaybackRate: (context, event) => {
        // These threw type errors if the event type wasn't specified
        // assuming that the machine under the hood doesn't
        // have enough context since these actions are very separated
        // from the config.
        if (context.video && event.type === 'PLAYBACKRATE_CHANGE')
          context.video.playbackRate = event.playbackRate
      },
      setVolume: (context, event) => {
        if (context.video && event.type === 'VOLUME_CHANGE')
          context.video.volume = event.volume ?? 0.8
      },
      toggleMute: (context, _event) => {
        if (context.video) context.video.muted = !context.video.muted
      },
      playVideo: (context, _event) => {
        const {video} = context
        video?.play()
      },
      pauseVideo: (context, _event) => {
        const {video} = context
        video?.pause()
      },
      seekVideo: (context, _event) => {
        const {video, seekingTime} = context
        if (video) video.currentTime = seekingTime ?? video.currentTime
      },
    },
  })

  return (
    <VideoContext.Provider value={{videoService}}>
      {props.children}
    </VideoContext.Provider>
  )
}
