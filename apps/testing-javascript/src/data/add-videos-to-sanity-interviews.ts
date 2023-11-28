// This script creates VideoResources for each interview and then ties it to
// the corresponding Sanity Interview record.
//
// Execute the script with:
//
// ```
// npx ts-node --files --skipProject src/data/add-videos-to-sanity-interviews.ts
// ```

import fs from 'fs'
import {createClient} from '@sanity/client'
import groq from 'groq'
import {z} from 'zod'
import fetch from 'node-fetch'

require('dotenv-flow').config({
  default_node_env: 'development',
})

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET_ID: DATASET,
  SANITY_EDITOR_TOKEN: EDITOR_TOKEN,
  NEXT_PUBLIC_SANITY_API_VERSION: API_VERSION,
} = process.env

const muxInterviewUploadPath = 'src/data/json/mux-interviews-upload.json'
const interviewMetadataPath = 'src/data/json/interview-export.json'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const readJsonData = (path: string) => {
  let fileData = fs.readFileSync(path)
  return JSON.parse(fileData.toString())
}

const addVideosToSanityInterviews = async () => {
  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    // a token with write access
    token: EDITOR_TOKEN,
    useCdn: false,
  })

  // Read in Mux interview playback IDs
  const MuxUploadSchema = z.record(
    z.object({
      assetId: z.string(),
      playbackId: z.array(z.object({id: z.string()})),
    }),
  )
  const muxInterviews = MuxUploadSchema.parse(
    readJsonData(muxInterviewUploadPath),
  )

  // Read in the Interview metadata
  const InterviewMetadataSchema = z.array(
    z.object({
      slug: z.string(),
      sanitySlug: z.string(),
      subtitles_url: z.string().nullable(),
      duration: z.number(),
      transcript: z.string().nullable(),
      media_url: z.string(),
    }),
  )
  const interviewMetadata = InterviewMetadataSchema.parse(
    readJsonData(interviewMetadataPath),
  )

  type InterviewMetadata = z.infer<typeof InterviewMetadataSchema>[0]
  type MetadataBySlug = {[slug: string]: InterviewMetadata}
  const metadataBySlug = interviewMetadata.reduce(
    (obj: MetadataBySlug, item): {[slug: string]: InterviewMetadata} => {
      obj[item.slug] = item
      return obj
    },
    {},
  )

  const slugs = Object.keys(muxInterviews)

  for (const slug of slugs) {
    const uploadData = muxInterviews[slug]
    const metadata = metadataBySlug[slug]

    const {assetId, playbackId: playbackIds} = uploadData
    const playbackId = playbackIds[0].id

    console.log(`Creating video resource for ${slug}`)

    let srt: string | undefined = undefined

    const removeLeadingWebvttAndWhitespace = (str: string) => {
      return str.replace(/^WEBVTT\s*/, '')
    }

    if (metadata.subtitles_url) {
      try {
        const response = await fetch(metadata.subtitles_url)
        const text = await response.text()
        srt = removeLeadingWebvttAndWhitespace(text)
      } catch (e) {
        console.error(`Error fetching SRT for ${slug}:`, e)
      }
    }

    const videoResourceDoc = {
      _id: `mux-video-${assetId}`,
      _type: 'videoResource',
      duration: metadata.duration,
      muxAsset: {
        muxAssetId: assetId,
        muxPlaybackId: playbackId,
      },
      slug: {
        current: slug,
      },
      title: metadata.media_url.split('/').slice(-1)[0],
      originalMediaUrl: metadata.media_url,
      castingwords: {
        srt, // remove preceeding VVT as necessary
        transcript: metadata.transcript || undefined,
      },
    }

    const result = await client.create(videoResourceDoc)
    const {_id: videoResourceId} = result

    console.log(`Updating interview resource for: ${slug}`)

    const getInterviewIdQuery = groq`*[_type == "interview" && slug.current == "${metadata.sanitySlug}"][0]{_id}`

    const {_id} = z
      .object({_id: z.string()})
      .parse(await client.fetch(getInterviewIdQuery))
    await client
      .patch(_id)
      .setIfMissing({resources: []})
      .append('resources', [{_type: 'reference', _ref: videoResourceId}])
      .commit({autoGenerateArrayKeys: true})

    await sleep(250)
  }
}

addVideosToSanityInterviews()
