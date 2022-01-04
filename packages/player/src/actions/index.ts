import screenfull from 'screenfull'
import {
  VideoEvent,
  videoMachine,
  VideoStateContext,
} from '../machines/video-machine'
import {ActionFunctionMap} from 'xstate'

export const defaultActions: ActionFunctionMap<VideoStateContext, VideoEvent> =
  {
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
      if (videoRef) {
        videoRef.current.currentTime =
          seekingTime ?? videoRef.current.currentTime
      }
    },
    toggleFullscreen: (_context, event) => {
      if (screenfull.isEnabled && event.type === 'TOGGLE_FULLSCREEN') {
        const element = event.element === null ? undefined : event.element
        screenfull.toggle(element)
      }
    },
    onVideoEnded: (_context, _event) => {},
  }
