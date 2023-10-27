// This script replaces the basic PT transcripts with enhanced transcripts in
// markdown for each VideoResource.
//
// Execute the Replace Transcript Text script with:
//
// ```
// npx ts-node --files --skipProject src/data/replace-transcript-text.ts
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

const dataPath = 'src/data/json/tjs-enhanced-transcripts.json'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const readJsonData = (path: string) => {
  let fileData = fs.readFileSync(path)
  return JSON.parse(fileData.toString())
}

const replaceTranscriptText = async () => {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    // a token with write access
    token: EDITOR_TOKEN,
    useCdn: false,
  })

  // Read in enhanced transcript data
  const EnhancedTranscriptSchema = z
    .object({id: z.number(), transcript: z.string()})
    .array()
  const enhancedTranscripts = EnhancedTranscriptSchema.parse(
    readJsonData(dataPath),
  )

  for (const transcriptData of enhancedTranscripts) {
    const {id: lessonId, transcript} = transcriptData

    // Look up the Lesson and Video Resource combination to get the `videoResource._id`.
    const getVideoResourceIdQuery = groq`
      *[_type == "explainer" &&
        _id == "lesson-${lessonId}"]
        [0]
      {'videoResourceId': resources[0]->_id}`

    const {videoResourceId} = z
      .object({videoResourceId: z.string()})
      .parse(await client.fetch(getVideoResourceIdQuery))

    // Patch the videoResource by `_id` with the new `transcript` value.
    await client
      .patch(videoResourceId)
      .set({'castingwords.transcript': transcript})
      .commit()

    // avoid rate-limiting
    await sleep(250)
  }
}

replaceTranscriptText()
