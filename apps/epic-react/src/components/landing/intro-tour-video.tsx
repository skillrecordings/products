import MuxPlayer from '@mux/mux-player-react'

const TOUR_VIDEO_ID = '02pm13UEJQ4M9Xkc9kIjX6E6gvnZ4ELM5GG57IN2UV3E'

const IntroTourVideo = () => {
  return (
    <div className="mb-10 overflow-auto rounded-none border border-transparent sm:overflow-hidden sm:rounded-md sm:border-er-gray-100 lg:-mx-8">
      <MuxPlayer
        streamType="on-demand"
        playbackId={TOUR_VIDEO_ID}
        className="block"
        poster={`${process.env.NEXT_PUBLIC_URL}/assets/intro-tour-poster@2x.png`}
      />
    </div>
  )
}

export default IntroTourVideo
