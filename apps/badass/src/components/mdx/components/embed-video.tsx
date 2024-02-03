import MuxVideo from '@mux/mux-player-react'

export type EmbedVideoProps = {
  playbackId: string
  poster?: string
  title?: string
}

const EmbedVideo: React.FC<EmbedVideoProps> = ({playbackId, poster, title}) => {
  return (
    <div data-embed-video-wrapper="not-prose">
      <MuxVideo
        className="aspect-video w-full block"
        playbackId={playbackId}
        streamType="on-demand"
        {...(poster && {poster})}
        {...(title && {title})}
      />
    </div>
  )
}

export default EmbedVideo
