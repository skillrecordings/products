export {Video} from './components/video'

export type PlayerContext = {
  currentSrc: null
  duration: number
  currentTime: number
  seekingTime: number
  buffered: null
  waiting: boolean
  seeking: boolean
  paused: boolean
  autoPaused: boolean
  ended: boolean
  playbackRate: number
  muted: boolean
  volume: number
  readyState: number
  networkState: number
  videoWidth: number
  videoHeight: number
  hasStarted: boolean
  userActivity: boolean
  isActive: boolean
  isFullscreen: false
  activeTextTrack: TextTrack
  activeMetadataTracks: TextTrack[]
  activeMetadataTrackCues: VTTCue[]
}
