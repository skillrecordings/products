// Running this script:
//
// Be sure to set `MUX_ACCESS_TOKEN` and `MUX_SECRET_KEY` in your
// `.env.local` environment variables file. And assign string values
// to the `assetId` and `srtUrl` variables below.
//
// Execute the script with:
//
// ```
// npx ts-node --files --skipProject src/data/add-srt-to-specific-video.ts
// ```

import Mux from '@mux/mux-node'

require('dotenv-flow').config({
  default_node_env: 'development',
})

const assetId = undefined // Set me!
const srtUrl = undefined // Set me!

const addSrtToSpecificVideo = async (
  assetId: string | undefined,
  srtUrl: string | undefined,
) => {
  if (!assetId) {
    throw new Error('Must define assetId at the beginning of this script')
  }
  if (!srtUrl) {
    throw new Error('Must define srtUrl at the beginning of this script')
  }

  // Set up Mux API Client
  const MUX_ACCESS_TOKEN = process.env.MUX_ACCESS_TOKEN as string
  const MUX_SECRET_KEY = process.env.MUX_SECRET_KEY as string
  const muxClient = new Mux(MUX_ACCESS_TOKEN, MUX_SECRET_KEY)
  const {Video} = muxClient

  await Video.Assets.createTrack(assetId, {
    url: srtUrl,
    type: 'text',
    text_type: 'subtitles',
    closed_captions: false,
    language_code: 'en-US',
    name: 'English',
    passthrough: 'English',
  })
}

addSrtToSpecificVideo(assetId, srtUrl)
