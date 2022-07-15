import * as React from 'react'

const PodcastPlayer: React.FC<{simplecastId: string}> = ({simplecastId}) => {
  return (
    <div className="relative">
      <iframe
        className="my-8"
        height="200px"
        width="100%"
        frameBorder="no"
        scrolling="no"
        seamless
        src={`https://player.simplecast.com/${simplecastId}?dark=true&color=111111`}
      />
    </div>
  )
}

export default PodcastPlayer
