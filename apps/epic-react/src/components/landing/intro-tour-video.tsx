import MuxPlayer from '@mux/mux-player-react'

const IntroTourVideo = () => {
  return (
    <div className="-mx-8 mb-10 overflow-auto rounded-none border border-transparent sm:overflow-hidden sm:rounded-md sm:border-er-gray-100">
      <MuxPlayer
        streamType="on-demand"
        playbackId="aYqygpEcRs14JrREocaLqqrTuMY4kZKSV7DwWLJNEb00"
        className="block"
        poster={`${process.env.NEXT_PUBLIC_URL}/assets/intro-tour-poster@2x.png`}
      />
    </div>
  )
}

export default IntroTourVideo
