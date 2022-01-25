import * as React from 'react'
import {useVideo} from '../context/video-context'
import cx from 'classnames'
import {useMetadataTrackList} from '../hooks/use-metadata-track-list'
import {useSelector} from '@xstate/react'
import {
  selectPaused,
  selectIsWaiting,
  selectCurrentTime,
  selectAutoplay,
  selectIsActive,
  selectReadyState,
} from '../selectors'

type VideoProps = {
  loop?: boolean
  poster?: string
  preload?: string
  src?: string
  autoPlay?: boolean
  playsInline?: boolean
  muted?: boolean
  crossOrigin?: string
  id?: string
  className?: string
}

/**
 * React component wrapper for the HTMLVideoElement that supplies an element
 * reference that is registered with the videoService xstate machine.
 *
 * @param children
 * @param loop
 * @param poster
 * @param preload
 * @param src
 * @param autoPlay
 * @param playsInline
 * @param muted
 * @param crossOrigin
 * @param id
 * @param className
 * @constructor
 */
export const Video: React.FC<VideoProps> = ({
  children,
  loop = false,
  poster,
  preload = 'auto',
  src,
  playsInline = false,
  muted = false,
  crossOrigin = 'anonymous',
  id,
  className,
}) => {
  //if you type this to an HTMLVideoElement it becomes read only
  //and below we need to manually assign it so we can dispatch
  //to the videoService and update our state machine context
  const videoElemRef = React.useRef<any>(null)
  const videoService = useVideo()
  const paused = useSelector(videoService, selectPaused)
  const readyState = useSelector(videoService, selectReadyState)
  const currentTime = useSelector(videoService, selectCurrentTime)
  const autoplay = useSelector(videoService, selectAutoplay)

  useMetadataTrackList()

  React.useEffect(() => {
    videoService.send({type: 'REGISTER', videoRef: videoElemRef})

    // sometimes the event handlers aren't registered before the
    // `canPlay` event is fired (caching, for instance) so we want
    // to check and see if it's ready as soon as we get a ref to
    // the HTMLVideoElement and "manually" fire an event

    videoElemRef.current.readyState > 3 && videoService.send('LOADED')
  }, [videoElemRef])

  return (
    <video
      className={cx([`cueplayer-react-video`, className])}
      id={id}
      crossOrigin={crossOrigin}
      ref={(c: HTMLVideoElement) => {
        videoElemRef.current = c
      }}
      muted={muted}
      preload={preload}
      loop={loop}
      playsInline={playsInline}
      autoPlay={false}
      poster={poster}
      src={src}
      onClickCapture={(_event) => {
        videoService.send(paused ? 'PLAY' : 'PAUSE')
      }}
      onCanPlay={(_event) => {
        videoService.send('LOADED')
        // only autoplay if player is ready, paused, and at the beginning
        if (autoplay && paused && readyState > 3 && currentTime === 0) {
          videoService.send('PLAY')
        }
      }}
      onCanPlayThrough={(_event) => {
        videoService.send('LOADED')
      }}
      onTimeUpdate={() => {
        videoService.send('TIMING')
      }}
      onWaiting={() => {
        videoService.send('WAITING')
      }}
      onPlaying={() => {
        videoService.send('DONE_WAITING')
      }}
      onEnded={() => {
        videoService.send('END')
      }}
      tabIndex={-1}
    >
      {children}
    </video>
  )
}
