import {z} from 'zod'

/**
 * Deepgram API Response Types
 * Based on Deepgram Nova-2 model response structure
 */

// Word-level transcription data (passthrough allows extra fields from Deepgram)
export const WordSchema = z
  .object({
    word: z.string(),
    start: z.number(),
    end: z.number(),
    confidence: z.number(),
    punctuated_word: z.string().optional(), // Made optional as fallback
  })
  .passthrough()

export type Word = z.infer<typeof WordSchema>

// Sentence within a paragraph
export const SentenceSchema = z
  .object({
    text: z.string(),
    start: z.number(),
    end: z.number(),
  })
  .passthrough()

export type Sentence = z.infer<typeof SentenceSchema>

// Paragraph containing sentences
export const ParagraphSchema = z
  .object({
    sentences: z.array(SentenceSchema),
    start: z.number().optional(),
    end: z.number().optional(),
    num_words: z.number().optional(),
  })
  .passthrough()

export type Paragraph = z.infer<typeof ParagraphSchema>

// Paragraphs container
export const ParagraphsSchema = z
  .object({
    transcript: z.string().optional(),
    paragraphs: z.array(ParagraphSchema),
  })
  .passthrough()

export type Paragraphs = z.infer<typeof ParagraphsSchema>

// Alternative transcription
export const AlternativeSchema = z
  .object({
    transcript: z.string(),
    confidence: z.number(),
    words: z.array(WordSchema),
    paragraphs: ParagraphsSchema.optional(),
  })
  .passthrough()

export type Alternative = z.infer<typeof AlternativeSchema>

// Channel containing alternatives
export const ChannelSchema = z
  .object({
    alternatives: z.array(AlternativeSchema),
  })
  .passthrough()

export type Channel = z.infer<typeof ChannelSchema>

// Results container
export const ResultsSchema = z
  .object({
    channels: z.array(ChannelSchema),
  })
  .passthrough()

export type Results = z.infer<typeof ResultsSchema>

// Metadata from Deepgram response
export const MetadataSchema = z
  .object({
    request_id: z.string(),
    created: z.string().optional(),
    duration: z.number().optional(),
    channels: z.number().optional(),
    models: z.array(z.string()).optional(),
    model_info: z.record(z.any()).optional(),
  })
  .passthrough()

export type Metadata = z.infer<typeof MetadataSchema>

// Full Deepgram callback response
export const DeepgramCallbackSchema = z
  .object({
    metadata: MetadataSchema.optional(),
    results: ResultsSchema,
  })
  .passthrough()

export type DeepgramCallback = z.infer<typeof DeepgramCallbackSchema>

// Initiate transcription response
export const DeepgramInitiateResponseSchema = z.object({
  request_id: z.string(),
})

export type DeepgramInitiateResponse = z.infer<
  typeof DeepgramInitiateResponseSchema
>

// Processed transcript result
export interface TranscriptResult {
  text: string // Full transcript with paragraph timestamps
  srt: string // Standard SRT format
}

// Deepgram provider configuration
export interface DeepgramConfig {
  apiKey: string
  callbackBaseUrl: string
}

// Options for initiating transcription
export interface TranscriptionOptions {
  mediaUrl: string
  videoResourceId: string
}
