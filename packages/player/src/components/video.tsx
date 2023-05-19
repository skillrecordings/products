import * as React from 'react'
import {useVideo} from '../context/video-context'
import cx from 'classnames'
import {useMetadataTrackList} from '../hooks/use-metadata-track-list'
import {selectIsPaused} from '../selectors'
import {useSelector} from '@xstate/react'

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
export const Video: React.FC<React.PropsWithChildren<VideoProps>> = ({
  children,
  loop = false,
  poster,
  preload = 'auto',
  src,
  autoPlay = false,
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
  const paused = useSelector(videoService, selectIsPaused)

  useMetadataTrackList()

  React.useEffect(() => {
    videoService.send({type: 'REGISTER', videoRef: videoElemRef})

    // sometimes the event handlers aren't registered before the
    // `canPlay` event is fired (caching, for instance) so we want
    // to check and see if it's ready as soon as we get a ref to
    // the HTMLVideoElement and "manually" fire an event
    if (videoElemRef.current && videoElemRef.current.readyState > 3) {
      videoService.send('LOADED')
    }
  }, [videoElemRef.current])

  return (
    <video
      className={cx([`cueplayer-react-video`, className])}
      id={id}
      crossOrigin={crossOrigin as any}
      ref={videoElemRef}
      muted={muted}
      preload={preload}
      loop={loop}
      playsInline={playsInline}
      autoPlay={autoPlay}
      poster={poster}
      src={src}
      onError={() => {
        console.error('video player had an error')
      }}
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
      onEnded={() => {
        videoService.send('END')
      }}
      tabIndex={-1}
    >
      {children}
    </video>
  )
}
