import {inngest} from 'inngest/inngest.server'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {createMuxAsset} from '@skillrecordings/skill-lesson/lib/mux'
import {VIDEO_RESOURCE_CREATED_EVENT} from 'inngest/events'

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY!
const CALLBACK_BASE_URL =
  process.env.NEXT_PUBLIC_URL || process.env.COURSEBUILDER_URL!

async function getVideoResource(videoResourceId: string) {
  return await sanityWriteClient.fetch(`*[_id == $videoResourceId][0]`, {
    videoResourceId,
  })
}

/**
 * Process Video Resource
 *
 * Triggered when a new video resource is created.
 * 1. Creates a Mux asset from the original media URL
 * 2. Updates Sanity with Mux playbackId and assetId
 * 3. Initiates Deepgram transcription with callback
 *
 * When Deepgram completes, it calls our webhook which:
 * - Saves transcript and SRT to Sanity
 * - Triggers SRT addition to Mux
 * - Triggers SEO description generation
 */
export const processVideoResource = inngest.createFunction(
  {
    id: 'process-video-resource',
    name: 'Process Video Resource (Mux + Deepgram)',
    retries: 3,
  },
  {event: VIDEO_RESOURCE_CREATED_EVENT},
  async ({event, step}) => {
    const {videoResourceId, originalMediaUrl} = event.data

    if (!DEEPGRAM_API_KEY) {
      throw new Error('DEEPGRAM_API_KEY is not configured')
    }

    if (!CALLBACK_BASE_URL) {
      throw new Error('NEXT_PUBLIC_URL or COURSEBUILDER_URL is not configured')
    }

    // Update video resource state to 'preparing'
    await step.run('Update video state to preparing', async () => {
      return sanityWriteClient
        .patch(videoResourceId)
        .set({state: 'preparing'})
        .commit()
    })

    // Create Mux asset from original media URL
    const newMuxAsset = await step.run('Create Mux Asset', async () => {
      const videoResource = await getVideoResource(videoResourceId)
      const {muxAsset, duration} = videoResource

      console.info(`Creating Mux asset for ${videoResourceId}`)

      return await createMuxAsset({
        originalMediaUrl,
        muxAsset,
        duration,
      })
    })

    // Update Sanity with Mux asset data
    await step.run('Save Mux Asset to Sanity', async () => {
      const {duration: assetDuration, ...muxAsset} = newMuxAsset

      console.info(
        `Saving Mux asset to Sanity for ${videoResourceId}: playbackId=${muxAsset.muxPlaybackId}, assetId=${muxAsset.muxAssetId}`,
      )

      return sanityWriteClient
        .patch(videoResourceId)
        .set({
          duration: assetDuration,
          muxAsset,
        })
        .commit()
    })

    // Initiate Deepgram transcription with callback
    const deepgramResponse = await step.run(
      'Initiate Deepgram transcription',
      async () => {
        const callbackUrl = `${CALLBACK_BASE_URL}/api/webhooks/deepgram/transcript?videoResourceId=${encodeURIComponent(
          videoResourceId,
        )}`

        const params = new URLSearchParams({
          model: 'nova-2',
          punctuate: 'true',
          paragraphs: 'true',
          utterances: 'true',
          smart_format: 'true',
          callback: callbackUrl,
        })

        console.info(
          `Ordering transcript for ${videoResourceId} with callback: ${callbackUrl}`,
        )

        const response = await fetch(
          `https://api.deepgram.com/v1/listen?${params}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${DEEPGRAM_API_KEY}`,
            },
            body: JSON.stringify({url: originalMediaUrl}),
          },
        )

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `Deepgram API error: ${response.status} - ${errorText}`,
          )
        }

        return response.json()
      },
    )

    // Store Deepgram request ID for tracking
    await step.run('Store Deepgram request ID', async () => {
      return sanityWriteClient
        .patch(videoResourceId)
        .set({deepgramRequestId: deepgramResponse.request_id})
        .commit()
    })

    console.info(
      `Video resource processed: ${videoResourceId}, muxAssetId: ${newMuxAsset.muxAssetId}, deepgramRequestId: ${deepgramResponse.request_id}`,
    )

    return {
      videoResourceId,
      muxAssetId: newMuxAsset.muxAssetId,
      muxPlaybackId: newMuxAsset.muxPlaybackId,
      deepgramRequestId: deepgramResponse.request_id,
    }
  },
)
