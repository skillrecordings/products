import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {Player, VideoProvider, HLSSource} from '@skillrecordings/player'
// https://stream.mux.com/Wxle5yzErvilJ02C13zuv8OSeROvfwsjS.m3u8
const PlayerPage = () => {
  return (
    <VideoProvider>
      <Player>
        <HLSSource src="https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8" />
      </Player>
    </VideoProvider>
  )
}

export default PlayerPage
