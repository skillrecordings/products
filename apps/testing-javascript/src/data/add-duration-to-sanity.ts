// This script adds missing duration values to the read-only duration fields on
// modules and videoResources.
//
// Execute the Add Duration to Sanity script with:
//
// ```
// npx ts-node --files --skipProject src/data/add-duration-to-sanity.ts
// ```

import fs from 'fs'
import {createClient} from '@sanity/client'
import groq from 'groq'
import {z} from 'zod'

require('dotenv-flow').config({
  default_node_env: 'development',
})

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET_ID: DATASET,
  SANITY_EDITOR_TOKEN: EDITOR_TOKEN,
  NEXT_PUBLIC_SANITY_API_VERSION: API_VERSION,
} = process.env

const playlistDurationPath = 'src/data/json/playlist-durations.json'
const lessonDurationPath = 'src/data/json/lesson-durations.json'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const readJsonData = (path: string) => {
  let fileData = fs.readFileSync(path)
  return JSON.parse(fileData.toString())
}

const addDurationToSanity = async () => {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    // a token with write access
    token: EDITOR_TOKEN,
    useCdn: false,
  })

  // Read in the playlist duration data
  const playlistDurationSchema = z.record(z.number())
  const prefilteredPlaylistDurations = playlistDurationSchema.parse(
    readJsonData(playlistDurationPath),
  )

  // Read in the lesson duration data
  const lessonDurationSchema = z.record(z.record(z.number()))
  const prefilteredLessonDurations = lessonDurationSchema.parse(
    readJsonData(lessonDurationPath),
  )

  // ignore courses with the following slugs because they are the Series
  // duplicates. The up-to-date courses are Playlist records with the other
  // slugs.
  // Series.where(id: [214, 406, 223, 407, 409, 408, 246, 410]).pluck(:slug)
  const ignoredCourseSlugs = [
    'static-analysis-testing-javascript-applications-71c1',
    'test-node-js-backends',
    'use-dom-testing-library-to-test-any-js-framework',
    'install-configure-and-script-cypress-for-javascript-web-applications-8184',
    'test-react-components-with-jest-and-react-testing-library-30af',
    'configure-jest-for-testing-javascript-applications-b3674a',
    'javascript-mocking-fundamentals',
    'fundamentals-of-testing-in-javascript',
  ]

  const filterObjectByKeys = <V>(
    obj: Record<string, V>,
    ignoredKeys: string[],
  ) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, _value]) => !ignoredKeys.includes(key)),
    )
  }

  const playlistDurations = filterObjectByKeys<number>(
    prefilteredPlaylistDurations,
    ignoredCourseSlugs,
  )
  const lessonDurations = filterObjectByKeys<Record<string, number>>(
    prefilteredLessonDurations,
    ignoredCourseSlugs,
  )

  for (const playlistDuration of Object.entries(playlistDurations)) {
    const [slug, duration] = playlistDuration

    console.log(`Updating playlist duration for: ${slug}`)

    const getPlaylistIdQuery = groq`*[_type == "module" && slug.current == "${slug}"][0]{_id}`

    const {_id} = z
      .object({_id: z.string()})
      .parse(await client.fetch(getPlaylistIdQuery))
    await client.patch(_id).set({duration}).commit()

    await sleep(250)
  }

  for (const playlistCollection of Object.entries(lessonDurations)) {
    const [playlistSlug, lessons] = playlistCollection

    console.log(`Processing lessons for playlist: ${playlistSlug}`)

    for (const lessonDuration of Object.entries(lessons)) {
      const [slug, duration] = lessonDuration

      console.log(`- Updating lesson duration for: ${slug}`)

      const getVideoResourceIdQuery = groq`
        *[_type == "explainer" &&
          slug.current == "${slug}"]
          [0]
        {_id, 'videoResourceId': resources[0]->_id}`

      const {videoResourceId} = z
        .object({_id: z.string(), videoResourceId: z.string()})
        .parse(await client.fetch(getVideoResourceIdQuery))
      await client.patch(videoResourceId).set({duration}).commit()

      await sleep(250)
    }
  }
}

addDurationToSanity()
