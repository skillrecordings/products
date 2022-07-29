import * as React from 'react'
import Hls from 'hls.js'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import {selectVideo} from '../selectors'

type HLSSourceProps = {
  hlsConfig?: any
  src: string
  type?: string
}

/**
 * Wrapper for the hls.js library that attaches to an active video element
 * and allows us to load m3u8 (hls) streaming video
 *
 * @see {@link https://github.com/devcshort/react-hls/blob/master/src/index.tsx}
 * @param src
 * @param type
 * @param hlsConfig
 * @constructor
 */
export const HLSSource: React.FC<React.PropsWithChildren<HLSSourceProps>> = ({
  src,
  type = 'application/x-mpegURL',
  hlsConfig,
}) => {
  const videoService = useVideo()
  const video = useSelector(videoService, selectVideo)

  React.useEffect(() => {
    let hls: Hls

    if (!video) return

    function _initPlayer() {
      if (hls) {
        hls.destroy()
      }

      hls = new Hls({
        enableWorker: false,
        ...hlsConfig,
      })

      if (video) {
        hls.attachMedia(video)
      }

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src)
      })

      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error('HLS streaming error', {event, data})
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              _initPlayer()
              break
          }
        }
      })
    }

    const canUseNative = video.canPlayType('application/vnd.apple.mpegurl')
    const shouldUseNative = canUseNative && !Hls.isSupported()

    function handleExitedFullscreenOnIphone() {
      videoService.send('PAUSE')
    }

    // Check for Media Source support
    if (!shouldUseNative) {
      _initPlayer()
    } else {
      video.load()
      video.addEventListener(
        'webkitendfullscreen',
        handleExitedFullscreenOnIphone,
        false,
      )
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
      video.removeEventListener(
        'webkitendfullscreen',
        handleExitedFullscreenOnIphone,
      )
    }
  }, [hlsConfig, video, src, videoService])

  // Fallback to using a regular video player if HLS is supported by default in the user's browser
  return <source src={src} type={type} />
}
