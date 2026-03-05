import type {
  DeepgramConfig,
  DeepgramInitiateResponse,
  TranscriptionOptions,
  TranscriptResult,
  DeepgramCallback,
} from './types'
import {processDeepgramResults} from './transcript-utils'

/**
 * Create a Deepgram provider instance for transcription services
 */
export function createDeepgramProvider(config: DeepgramConfig) {
  const {apiKey, callbackBaseUrl} = config

  return {
    /**
     * Initiate an asynchronous transcription request with Deepgram
     * Results will be sent to the callback URL when ready
     */
    initiateTranscription: async (
      options: TranscriptionOptions,
    ): Promise<DeepgramInitiateResponse> => {
      const {mediaUrl, videoResourceId} = options

      // Build callback URL with videoResourceId
      const callbackUrl = `${callbackBaseUrl}/api/webhooks/deepgram/transcript?videoResourceId=${encodeURIComponent(
        videoResourceId,
      )}`

      // Deepgram API parameters
      const params = new URLSearchParams({
        model: 'nova-2', // Latest and most accurate model
        punctuate: 'true', // Add punctuation
        paragraphs: 'true', // Group into paragraphs
        utterances: 'true', // Detect speaker turns
        smart_format: 'true', // Smart formatting (numbers, dates, etc.)
        diarize: 'false', // Speaker diarization (disabled for single-speaker content)
        callback: callbackUrl,
      })

      const response = await fetch(
        `https://api.deepgram.com/v1/listen?${params}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${apiKey}`,
          },
          body: JSON.stringify({url: mediaUrl}),
        },
      )

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Deepgram API error: ${response.status} - ${error}`)
      }

      return response.json()
    },

    /**
     * Process Deepgram callback results into transcript formats
     */
    processResults: (results: DeepgramCallback): TranscriptResult => {
      return processDeepgramResults(results)
    },
  }
}

/**
 * Get the default Deepgram provider using environment variables
 */
export function getDeepgramProvider() {
  const apiKey = process.env.DEEPGRAM_API_KEY
  const callbackBaseUrl =
    process.env.NEXT_PUBLIC_URL || process.env.COURSEBUILDER_URL

  if (!apiKey) {
    throw new Error('DEEPGRAM_API_KEY environment variable is not set')
  }

  if (!callbackBaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_URL or COURSEBUILDER_URL environment variable is not set',
    )
  }

  return createDeepgramProvider({
    apiKey,
    callbackBaseUrl,
  })
}

/**
 * Directly initiate a transcription request (convenience function)
 */
export async function initiateDeepgramTranscription(
  options: TranscriptionOptions,
): Promise<DeepgramInitiateResponse> {
  const provider = getDeepgramProvider()
  return provider.initiateTranscription(options)
}
