// This script replaces the PT descriptions with markdown descriptions for each
// Interview of TJS.
//
// Execute this script with:
//
// ```
// npx ts-node --files --skipProject src/data/replace-interview-descriptions.ts
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

const dataPath = './interview-descriptions.json'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const readJsonData = (path: string) => {
  let fileData = fs.readFileSync(path)
  return JSON.parse(fileData.toString())
}

const replaceDescriptionText = async () => {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    // a token with write access
    token: EDITOR_TOKEN,
    useCdn: false,
  })

  // Read in the interview descriptions
  const InterviewDescriptionSchema = z
    .object({slug: z.string(), description: z.string()})
    .array()
  const descriptions = InterviewDescriptionSchema.parse(readJsonData(dataPath))

  for (const descriptionData of descriptions) {
    const {slug, description} = descriptionData

    const getInterviewIdQuery = groq`
      *[_type == "interview" && slug.current == $slug][0]{_id}`
    const {_id}: {_id: string} = await client.fetch(getInterviewIdQuery, {slug})

    // Patch the videoResource by `_id` with the new `transcript` value.
    await client.patch(_id).set({description: description}).commit()

    // avoid rate-limiting
    await sleep(250)
  }
}

replaceDescriptionText()
