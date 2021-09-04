import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {Player, VideoProvider} from '@skillrecordings/player'

const PlayerPage = () => {
  return (
    <VideoProvider>
      <Player>
        <source
          src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
          type="video/mp4"
        />
      </Player>
    </VideoProvider>
  )
}

export default PlayerPage
