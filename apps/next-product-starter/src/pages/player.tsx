import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {Player, VideoProvider, HLSSource} from '@skillrecordings/player'

const PlayerPage = () => {
  return (
    <Layout>
      <VideoProvider>
        <Player className="font-sans">
          <HLSSource src="https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8" />
        </Player>
      </VideoProvider>
    </Layout>
  )
}

export default PlayerPage
