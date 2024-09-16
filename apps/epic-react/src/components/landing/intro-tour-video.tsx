import * as React from 'react'
import MuxPlayer from '@mux/mux-player-react'
import {useTheme} from 'next-themes'

const TOUR_VIDEO_ID = '02pm13UEJQ4M9Xkc9kIjX6E6gvnZ4ELM5GG57IN2UV3E'

const IntroTourVideo = () => {
  const {theme} = useTheme()
  const playerRef = React.useRef(null)
  const poster =
    theme === 'light'
      ? `https://res.cloudinary.com/epic-web/image/upload/v1726494776/tour-of-epic-react-v2-thumbnail--light_2x.jpg`
      : `https://res.cloudinary.com/epic-web/image/upload/v1726492067/tour-of-epic-react-v2-thumbnail_2x.jpg`
  React.useEffect(() => {
    if (playerRef.current) {
      playerRef.current.poster = poster
    }
  }, [theme, playerRef])

  return (
    <div className="mx-auto mb-10 max-w-4xl overflow-hidden rounded-lg border border-transparent sm:overflow-hidden sm:rounded-md sm:border-er-gray-100">
      <MuxPlayer
        streamType="on-demand"
        playbackId={TOUR_VIDEO_ID}
        className="block"
        ref={playerRef}
        poster={poster}
      />
    </div>
  )
}

export default IntroTourVideo
