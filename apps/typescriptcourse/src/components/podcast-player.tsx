import * as React from 'react'

const PodcastPlayer: React.FC<
  React.PropsWithChildren<{simplecastId: string}>
> = ({simplecastId}) => {
  return (
    <div className="relative my-20">
      <iframe
        title="Simplecast Player"
        className="my-8"
        height="200px"
        width="100%"
        seamless
        src={`https://player.simplecast.com/${simplecastId}?dark=true&color=111111`}
      />
    </div>
  )
}

export default PodcastPlayer
