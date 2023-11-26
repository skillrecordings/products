// Running this script:
//
// Ensure you have `dataFilePath` set to the location of the formatted export
// of Testing JavaScript data. Also, be sure to set `MUX_ACCESS_TOKEN` and
// `MUX_SECRET_KEY` in your `.env.local` environment variables file.
//
// Execute the Mux Asset Upload script with:
//
// ```
// npx ts-node --skipProject src/data/upload-interviews-to-mux.ts
// ```

import fs from 'fs'
import Mux, {InputSettings} from '@mux/mux-node'
import fetch from 'node-fetch'

require('dotenv-flow').config()

const MUX_UPLOAD_FILENAME = 'mux-interviews-upload.json'

const MUX_ACCESS_TOKEN = process.env.MUX_ACCESS_TOKEN as string
const MUX_SECRET_KEY = process.env.MUX_SECRET_KEY as string

const dataFilePath =
  '/Users/jbranchaud/code/clients/egghead/professional-javascript-testing/interview-export.json'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const writeJsonToFile = (path: string, data: Object) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
    console.log('Data successfully saved to disk')
  } catch (error) {
    console.log('An error has occurred ', error)
  }
}

const uploadInterviewsToMux = async () => {
  const muxClient = new Mux(MUX_ACCESS_TOKEN, MUX_SECRET_KEY)

  const {Video} = muxClient

  // read JSON file
  let fileData = fs.readFileSync(dataFilePath)
  let interviews: Array<{
    slug: string
    media_url: string
    subtitles_url: string | null
    transcript: string | null
    duration: number
  }> = JSON.parse(fileData.toString())

  // read in existing Mux uploads file if it exists
  let muxUploadsData = {}

  // pull in existing file content if it already exists
  if (fs.existsSync(MUX_UPLOAD_FILENAME)) {
    const fileContents = fs.readFileSync(MUX_UPLOAD_FILENAME)
    muxUploadsData = JSON.parse(fileContents.toString())
  }

  const runningLessonListing: {[key: string]: Object} = muxUploadsData
  const errors: {[key: string]: any} = {}

  const uploadVideoAsset = async (
    slug: string,
    media_url: string,
    subtitles_url: string | null,
  ) => {
    // already did this lesson, skip it
    if (runningLessonListing[slug]) {
      return
    }

    const input: Array<InputSettings> = [{url: media_url}]

    if (subtitles_url) {
      input.push({
        url: subtitles_url,
        type: 'text',
        text_type: 'subtitles',
        closed_captions: false,
        language_code: 'en-US',
        name: 'English',
        passthrough: 'English',
      })
    }

    const asset = await Video.Assets.create({
      input,
      playback_policy: ['public'],
      mp4_support: 'standard',
    })

    if (asset.errors) {
      const formattedError = `${
        asset.errors.type
      }: ${asset.errors.messages.join(', ')}`
      console.log(formattedError)
      errors[slug] = asset.errors
    } else {
      runningLessonListing[slug] = {
        playbackId: asset.playback_ids,
        assetId: asset.id,
        mediaUrl: media_url,
      }
    }
  }

  for (const interview of interviews) {
    const {slug, media_url, subtitles_url} = interview

    // throttle API requests a little
    await sleep(250)

    try {
      await uploadVideoAsset(slug, media_url, subtitles_url)
    } catch (e: any) {
      errors[slug] = {
        type: 'catch all error',
        messages: [e.toString()],
      }
    }
  }

  writeJsonToFile('mux-upload-errors.json', errors)
  writeJsonToFile(MUX_UPLOAD_FILENAME, runningLessonListing)

  if (Object.entries(errors).length === 0) {
    console.log('No errors while uploading the assets')
  }
}

uploadInterviewsToMux()
