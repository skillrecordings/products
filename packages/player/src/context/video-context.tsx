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
        if (context.videoRef && event.type === 'PLAYBACKRATE_CHANGE')
          context.videoRef.current.playbackRate = event.playbackRate
      },
      setVolume: (context, event) => {
        if (context.videoRef && event.type === 'VOLUME_CHANGE')
          context.videoRef.current.volume = event.volume ?? 0.8
      },
      toggleMute: (context, _event) => {
        if (context.videoRef)
          context.videoRef.current.muted = !context.videoRef.current.muted
      },
      playVideo: (context, _event) => {
        const {videoRef} = context
        videoRef?.current?.play()
      },
      pauseVideo: (context, _event) => {
        const {videoRef} = context
        videoRef?.current?.pause()
      },
      seekVideo: (context, _event) => {
        const {videoRef, seekingTime} = context
        if (videoRef)
          videoRef.current.currentTime =
            seekingTime ?? videoRef.current.currentTime
      },
    },
  })

  return (
    <VideoContext.Provider value={{videoService}}>
      {props.children}
    </VideoContext.Provider>
  )
}
