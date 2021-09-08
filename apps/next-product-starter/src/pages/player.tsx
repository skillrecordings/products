import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {Player, VideoProvider, HLSSource} from '@skillrecordings/player'

const PlayerPage = () => {
  const videoUrl = `https://d2c5owlt6rorc3.cloudfront.net/egghead-create-a-new-supabase-project-lEG2O_feW/hls/egghead-create-a-new-supabase-project-lEG2O_feW.m3u8`
  const subtitlesUrl = `https://app.egghead.io/api/v1/lessons/javascript-create-a-new-supabase-project/subtitles`
  const notesUrl = `https://gist.githubusercontent.com/joelhooks/d16c649f7d258289cbbc622d8867c608/raw/45f875698610140c28ec991c1aad1979dbf1a990/test.vtt`
  return (
    <Layout>
      <VideoProvider>
        <Player className="font-sans">
          <HLSSource src={videoUrl} />
          <track
            src={subtitlesUrl}
            kind="subtitles"
            srcLang="en"
            label="English"
            default
          />
          <track id="notes" src={notesUrl} kind="metadata" label="notes" />
        </Player>
      </VideoProvider>
    </Layout>
  )
}

export default PlayerPage
