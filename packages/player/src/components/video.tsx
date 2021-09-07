import * as React from 'react'
import {useVideo} from '../context/video-context'
import cx from 'classnames'

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
  loop,
  poster,
  preload = 'auto',
  src,
  autoPlay,
  playsInline,
  muted,
  crossOrigin,
  id,
  className,
}) => {
  //if you type this to an HTMLVideoElement it becomes read only
  //and below we need to manually assign it so we can dispatch
  //to the videoService and update our state machine context
  const videoElemRef = React.useRef<any>(null)
  const videoService = useVideo()

  return (
    <video
      className={cx([`cueplayer-react-video`, className])}
      id={id}
      crossOrigin={crossOrigin}
      ref={(c: HTMLVideoElement) => {
        videoElemRef.current = c
        videoService.send({type: 'REGISTER', videoRef: videoElemRef})

        // sometimes the event handlers aren't registered before the
        // `canPlay` event is fired (caching, for instance) so we want
        // to check and see if it's ready as soon as we get a ref to
        // the HTMLVideoElement and "manually" fire an event
        if (c && c.readyState > 3) {
          videoService.send('LOADED')
        }
      }}
      muted={muted}
      preload={preload}
      loop={loop}
      playsInline={playsInline}
      autoPlay={autoPlay}
      poster={poster}
      src={src}
      onCanPlay={(_event) => {
        videoService.send('LOADED')
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
      tabIndex={-1}
    >
      {children}
    </video>
  )
}
