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
export const HLSSource: React.FC<HLSSourceProps> = ({
  src,
  type = 'application/x-mpegURL',
  hlsConfig,
}) => {
  const [hlsSupported, sethlsSupported] = React.useState(true)
  const videoService = useVideo()
  const video = useSelector(videoService, selectVideo)

  React.useEffect(() => {
    let hls: Hls

    function _initPlayer() {
      if (hls != null) {
        hls.destroy()
      }

      const newHls = new Hls({
        enableWorker: false,
        ...hlsConfig,
      })

      if (video) {
        newHls.attachMedia(video)
      }

      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(src)
      })

      newHls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              newHls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError()
              break
            default:
              _initPlayer()
              break
          }
        }
      })

      hls = newHls
    }

    // Check for Media Source support
    if (Hls.isSupported()) {
      sethlsSupported(true)
      _initPlayer()
    } else {
      sethlsSupported(false)
    }

    return () => {
      if (hls != null) {
        hls.destroy()
      }
    }
  }, [hlsConfig, video, src])

  // Fallback to using a regular video player if HLS is supported by default in the user's browser
  return hlsSupported ? null : <source src={src} type={type} />
}
