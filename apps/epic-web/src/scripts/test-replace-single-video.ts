/**
 * Test: Replace a single video resource
 *
 * Tests the replacement pipeline with one video before doing the full workshop.
 *
 * Usage:
 *   cd apps/epic-web
 *   ./node_modules/.bin/tsx src/scripts/test-replace-single-video.ts
 */

import * as path from 'path'
import {config} from 'dotenv'
import {Dropbox} from 'dropbox'
import {Inngest} from 'inngest'

config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

// ============================================
// CONFIGURE:
// ============================================

// The videoResource to replace
const VIDEO_RESOURCE_ID = '0UOhjI9g2ayhHIqYLotTbl' // "Intro to Introduction To Programming Foundations"

// Dropbox file path for the corrected video
const DROPBOX_FILE_PATH =
  '/02 areas/Epic Web/Epic TypeScript/01-programming-foundations/intro/00.intro (4).mp4'

// Set to false to execute
const DRY_RUN = false

// Sanity config
const SANITY_PROJECT_ID = 'i1a93n76'
const SANITY_DATASET = 'production'

const VIDEO_RESOURCE_CREATED_EVENT = 'video/resource.created'

// ============================================

function getDropboxClient(): Dropbox {
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN
  if (!accessToken) throw new Error('DROPBOX_ACCESS_TOKEN not set')

  const options: {accessToken: string; selectUser?: string; pathRoot?: string} =
    {accessToken}

  if (process.env.DROPBOX_TEAM_MEMBER_ID) {
    options.selectUser = process.env.DROPBOX_TEAM_MEMBER_ID
  }

  if (process.env.DROPBOX_TEAM_NAMESPACE_ID) {
    options.pathRoot = JSON.stringify({
      '.tag': 'namespace_id',
      namespace_id: process.env.DROPBOX_TEAM_NAMESPACE_ID,
    })
  }

  return new Dropbox(options)
}

/**
 * Get a temporary direct download link from Dropbox.
 * This gives a real direct URL (no redirects) that Mux can ingest.
 * Links expire after 4 hours.
 */
async function getTemporaryLink(
  dbx: Dropbox,
  filePath: string,
): Promise<string> {
  console.log(`Getting temporary direct link for: ${filePath}`)
  const result = await dbx.filesGetTemporaryLink({path: filePath})
  console.log(`Got direct link (expires in 4h)`)
  return result.result.link
}

async function main() {
  console.log('=== Test: Replace Single Video ===\n')
  console.log(`Video Resource: ${VIDEO_RESOURCE_ID}`)
  console.log(`Dropbox file: ${DROPBOX_FILE_PATH}`)
  console.log(`Dry run: ${DRY_RUN}\n`)

  // Step 1: Get Dropbox direct download link
  console.log('Step 1: Getting Dropbox direct download link...')
  const dbx = getDropboxClient()
  const downloadUrl = await getTemporaryLink(dbx, DROPBOX_FILE_PATH)
  console.log(`Download URL: ${downloadUrl}\n`)

  // Step 2: Verify the videoResource exists in Sanity
  console.log('Step 2: Verifying videoResource in Sanity...')
  const query = encodeURIComponent(
    `*[_id == "${VIDEO_RESOURCE_ID}"][0]{_id, title, state, "muxAssetId": muxAsset.muxAssetId, "hasSrt": defined(transcript.srt)}`,
  )
  const sanityRes = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-19/data/query/${SANITY_DATASET}?query=${query}`,
  )
  const sanityData = await sanityRes.json()
  const videoResource = sanityData.result

  if (!videoResource) {
    console.error(`VideoResource ${VIDEO_RESOURCE_ID} not found in Sanity!`)
    process.exit(1)
  }

  console.log(`  Title: ${videoResource.title}`)
  console.log(`  Current state: ${videoResource.state}`)
  console.log(`  Current Mux Asset: ${videoResource.muxAssetId}`)
  console.log(`  Has SRT: ${videoResource.hasSrt}\n`)

  if (DRY_RUN) {
    console.log('=== DRY RUN ===')
    console.log('Would do:')
    console.log(
      `  1. Patch ${VIDEO_RESOURCE_ID}: state='new', originalMediaUrl='${downloadUrl}'`,
    )
    console.log(`  2. Send VIDEO_RESOURCE_CREATED_EVENT to Inngest`)
    console.log('\nSet DRY_RUN = false to execute')
    return
  }

  // Step 3: Patch Sanity
  console.log('Step 3: Patching videoResource in Sanity...')
  const sanityToken = process.env.SANITY_API_TOKEN
  if (!sanityToken) {
    throw new Error('SANITY_API_TOKEN is required')
  }

  const patchRes = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-19/data/mutate/${SANITY_DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sanityToken}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            patch: {
              id: VIDEO_RESOURCE_ID,
              set: {
                originalMediaUrl: downloadUrl,
                state: 'new',
                muxAsset: {
                  muxAssetId: '',
                  muxPlaybackId: '',
                },
              },
              // Clear transcript so Deepgram result replaces it cleanly
              unset: ['transcript', 'duration'],
            },
          },
        ],
      }),
    },
  )

  if (!patchRes.ok) {
    throw new Error(
      `Sanity patch failed: ${patchRes.status} ${await patchRes.text()}`,
    )
  }

  console.log('  Patched successfully\n')

  // Step 4: Send Inngest event
  console.log('Step 4: Sending Inngest event...')
  const inngest = new Inngest({
    id:
      process.env.INNGEST_APP_NAME ||
      process.env.NEXT_PUBLIC_SITE_TITLE ||
      'epic-web',
  })

  const result = await inngest.send({
    name: VIDEO_RESOURCE_CREATED_EVENT,
    data: {
      videoResourceId: VIDEO_RESOURCE_ID,
      originalMediaUrl: downloadUrl,
    },
  })

  console.log(`  Event sent: ${result.ids[0]}\n`)

  console.log('=== Done ===')
  console.log('The Inngest pipeline will now:')
  console.log('  1. Create a new Mux asset from the Dropbox URL')
  console.log('  2. Order Deepgram transcription')
  console.log('  3. Save transcript/SRT when Deepgram calls back')
  console.log('  4. Attach SRT to the new Mux asset')
  console.log('\nCheck progress at: http://localhost:8288')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
