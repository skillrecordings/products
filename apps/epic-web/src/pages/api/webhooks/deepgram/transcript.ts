import type {NextApiRequest, NextApiResponse} from 'next'
import * as Sentry from '@sentry/nextjs'
import {inngest} from 'inngest/inngest.server'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {processDeepgramResults} from 'lib/deepgram'
import {
  VIDEO_TRANSCRIPT_READY_EVENT,
  VIDEO_SRT_READY_EVENT,
  TIP_VIDEO_SRT_READY_EVENT,
} from 'inngest/events'

/**
 * Deepgram Webhook Handler
 *
 * Receives transcription results from Deepgram when async transcription completes.
 * - Validates the payload
 * - Processes transcript into text and SRT formats
 * - Updates the Sanity videoResource document
 * - Emits Inngest events for downstream processing (SRT to Mux, SEO description)
 */
export default async function deepgramWebhookHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'})
  }

  try {
    // Extract videoResourceId from query params
    const videoResourceId = req.query.videoResourceId as string

    if (!videoResourceId) {
      console.error('Deepgram webhook: Missing videoResourceId')
      return res.status(400).json({error: 'Missing videoResourceId'})
    }

    console.info(
      `Deepgram webhook received for videoResourceId: ${videoResourceId}`,
    )

    // Log the raw payload for debugging
    console.log(
      'Deepgram webhook: Raw payload received:',
      JSON.stringify(req.body, null, 2).slice(0, 3000),
    )
    console.log('Deepgram webhook: Payload keys:', Object.keys(req.body || {}))

    // Check if this is an error response from Deepgram
    if (req.body?.err_code || req.body?.error) {
      console.error('Deepgram webhook: Received error from Deepgram:', req.body)
      return res
        .status(200)
        .json({success: false, error: 'Deepgram transcription failed'})
    }

    // Skip strict validation for now - just check we have results
    if (!req.body?.results?.channels?.[0]?.alternatives?.[0]) {
      console.error('Deepgram webhook: Missing expected results structure')
      console.error(
        'Deepgram webhook: Full body:',
        JSON.stringify(req.body, null, 2),
      )
      return res.status(400).json({error: 'Invalid payload structure'})
    }

    const deepgramResults = req.body

    // Process transcript into different formats
    const {text, srt} = processDeepgramResults(deepgramResults)

    console.info(
      `Deepgram webhook: Processed transcript for ${videoResourceId}`,
      {
        textLength: text.length,
        srtLength: srt.length,
      },
    )

    // Fetch current video resource to get muxAssetId
    const videoResource = await sanityWriteClient.fetch(
      `*[_id == $videoResourceId][0]{
        _id,
        muxAsset
      }`,
      {videoResourceId},
    )

    if (!videoResource) {
      console.error(
        `Deepgram webhook: Video resource not found: ${videoResourceId}`,
      )
      return res.status(404).json({error: 'Video resource not found'})
    }

    // Update Sanity with transcript data
    await sanityWriteClient
      .patch(videoResourceId)
      .set({
        transcript: {text, srt},
        state: 'ready',
      })
      .commit()

    console.info(`Deepgram webhook: Updated Sanity for ${videoResourceId}`)

    // Emit Inngest events for downstream processing
    // Note: We emit TIP_VIDEO_SRT_READY_EVENT for backwards compatibility
    // with the existing addSrtToMuxAsset function
    await inngest.send([
      {
        name: VIDEO_TRANSCRIPT_READY_EVENT,
        data: {
          videoResourceId,
          transcript: {text, srt},
        },
      },
      {
        name: VIDEO_SRT_READY_EVENT,
        data: {
          videoResourceId,
          srt,
          muxAssetId: videoResource.muxAsset?.muxAssetId,
        },
      },
      // Backwards compatibility: triggers existing addSrtToMuxAsset function
      {
        name: TIP_VIDEO_SRT_READY_EVENT,
        data: {
          videoResourceId,
          srt,
          muxAssetId: videoResource.muxAsset?.muxAssetId,
        },
      },
    ])

    console.info(`Deepgram webhook: Emitted events for ${videoResourceId}`)

    return res.status(200).json({success: true})
  } catch (error) {
    console.error('Deepgram webhook error:', error)
    Sentry.captureException(error)
    return res.status(500).json({error: 'Internal server error'})
  }
}

// Configure body parser for larger payloads (transcripts can be big)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
