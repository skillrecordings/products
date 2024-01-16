// Running this script:
//
// Ensure you have `dataFilePath` set to the location of the formatted export
// of Epic React data. Also, be sure to set `MUX_ACCESS_TOKEN` and
// `MUX_SECRET_KEY` in your `.env.local` environment variables file.
//
// This script is idempotent, so it can be run multiple times and only
// unprocessed videos will be uploaded. The Mux API sometimes starts returning
// 429 errors after ~150 assets. In that case you'd need to rerun and the
// script will pick up where it left off based on the results of the
// `mux-upload.json` file.
//
// Execute the Mux Asset Upload script with:
//
// ```
// npx ts-node --skipProject src/data/upload-s3-assets-to-mux.ts
// ```

import fs from 'fs'
import Mux, {AssetError} from '@mux/mux-node'

require('dotenv-flow').config()

const MUX_UPLOAD_FILENAME = 'mux-upload.json'

const MUX_ACCESS_TOKEN = process.env.MUX_ACCESS_TOKEN as string
const MUX_SECRET_KEY = process.env.MUX_SECRET_KEY as string

const dataFilePath =
  '/Users/jbranchaud/code/clients/egghead/epic-react-gatsby/unformatted-export.json'

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

const uploadMuxAssets = async () => {
  const muxClient = new Mux(MUX_ACCESS_TOKEN, MUX_SECRET_KEY)

  const {Video} = muxClient

  // read JSON file
  let fileData = fs.readFileSync(dataFilePath)
  let products = JSON.parse(fileData.toString())

  // read in existing Mux uploads file if it exists
  let muxUploadsData = {}

  if (fs.existsSync(MUX_UPLOAD_FILENAME)) {
    const fileContents = fs.readFileSync(MUX_UPLOAD_FILENAME)
    muxUploadsData = JSON.parse(fileContents.toString())
  }

  const runningLessonListing: {[key: string]: Object} = muxUploadsData
  const errors: {[key: string]: AssetError} = {}

  const uniqueLessons: {[key: string]: string} = {}

  for (const product of products) {
    for (const course of product.courses) {
      for (const lesson of course.lessons) {
        const lessonSlug = lesson.slug as string

        if (uniqueLessons[lessonSlug]) {
          break
        }

        uniqueLessons[lessonSlug] = lesson.media_url
      }
    }
  }

  const uploadVideoAsset = async (slug: string, media_url: string) => {
    // already did this lesson, skip it
    if (runningLessonListing[slug]) {
      return
    }

    const asset = await Video.Assets.create({
      input: media_url,
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

  const uniqueEntries = Object.entries(uniqueLessons)

  for (const entry of uniqueEntries) {
    const [slug, media_url] = entry

    // throttle API requests a little
    await sleep(250)

    try {
      await uploadVideoAsset(slug, media_url)
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

uploadMuxAssets()
