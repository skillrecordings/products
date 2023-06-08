// Running this script:
//
// Ensure you have `dataFilePath` set to the location of the formatted export
// of Testing JavaScript data. Also, be sure to set `MUX_ACCESS_TOKEN` and
// `MUX_SECRET_KEY` in your `.env.local` environment variables file.
//
// Execute the Mux Asset Upload script with:
//
// ```
// npx ts-node --skipProject src/data/mux-assets.ts
// ```

import fs from 'fs'
import Mux from '@mux/mux-node'
import fetch from 'node-fetch'

require('dotenv-flow').config()

const MUX_UPLOAD_FILENAME = 'mux-upload.json'

const MUX_ACCESS_TOKEN = process.env.MUX_ACCESS_TOKEN as string
const MUX_SECRET_KEY = process.env.MUX_SECRET_KEY as string

const dataFilePath =
  '/Users/jbranchaud/code/clients/egghead/professional-javascript-testing/formatted-export.json'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const urlExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {method: 'HEAD'})

    if (response.status < 400) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
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
  const errors: {[key: string]: any} = {}

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
      const mp4Exists: boolean = await urlExists(media_url)
      if (mp4Exists) {
        await uploadVideoAsset(slug, media_url)
      } else {
        const m4v_url = media_url.replace(/.mp4$/, '.m4v')
        const m4vExists: boolean = await urlExists(m4v_url)

        if (m4vExists) {
          await uploadVideoAsset(slug, m4v_url)
        } else {
          errors[slug] = {
            type: 'not found',
            messages: ['File (.mp4/.m4v) does not exist'],
          }
        }
      }
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
