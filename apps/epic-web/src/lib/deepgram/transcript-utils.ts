import type {DeepgramCallback, TranscriptResult} from './types'

/**
 * Convert seconds to SRT timestamp format (HH:MM:SS,mmm)
 */
export function secondsToSrtTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.round((seconds % 1) * 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms
    .toString()
    .padStart(3, '0')}`
}

/**
 * Convert seconds to simple timestamp format (MM:SS)
 */
export function secondsToTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`
}

/**
 * Generate standard SRT format from Deepgram results
 * Groups words into segments of ~5 seconds or ~12 words
 */
export function srtFromTranscriptResult(results: DeepgramCallback): string {
  const words = results.results?.channels?.[0]?.alternatives?.[0]?.words || []

  if (words.length === 0) {
    return ''
  }

  const segments: Array<{start: number; end: number; text: string}> = []
  let currentSegment = {
    start: words[0].start,
    end: words[0].end,
    text: '',
  }
  const maxSegmentDuration = 5 // seconds
  const maxWordsPerSegment = 12

  for (const word of words) {
    const wouldExceedDuration =
      word.end - currentSegment.start > maxSegmentDuration
    const wouldExceedWords =
      currentSegment.text.split(' ').filter(Boolean).length >=
      maxWordsPerSegment

    // Use punctuated_word if available, otherwise fall back to word
    const wordText = word.punctuated_word || word.word

    if (
      (wouldExceedDuration || wouldExceedWords) &&
      currentSegment.text.trim()
    ) {
      segments.push({...currentSegment})
      currentSegment = {
        start: word.start,
        end: word.end,
        text: wordText,
      }
    } else {
      currentSegment.end = word.end
      currentSegment.text += (currentSegment.text ? ' ' : '') + wordText
    }
  }

  // Don't forget the last segment
  if (currentSegment.text.trim()) {
    segments.push(currentSegment)
  }

  return segments
    .map(
      (seg, i) =>
        `${i + 1}\n${secondsToSrtTime(seg.start)} --> ${secondsToSrtTime(
          seg.end,
        )}\n${seg.text.trim()}`,
    )
    .join('\n\n')
}

/**
 * Generate paragraph format with timestamps
 * Format: [MM:SS] Paragraph text here.
 */
export function transcriptAsParagraphsWithTimestamps(
  results: DeepgramCallback,
): string {
  const alternative = results.results?.channels?.[0]?.alternatives?.[0]
  const paragraphs = alternative?.paragraphs?.paragraphs

  // If paragraphs are available, use them
  if (paragraphs && paragraphs.length > 0) {
    return paragraphs
      .map((para) => {
        const firstSentence = para.sentences[0]
        const timestamp = secondsToTimestamp(firstSentence?.start || 0)
        const text = para.sentences.map((s) => s.text).join(' ')
        return `[${timestamp}] ${text}`
      })
      .join('\n\n')
  }

  // Fallback to plain transcript if no paragraphs
  const plainTranscript = alternative?.transcript || ''

  if (!plainTranscript) {
    return ''
  }

  // Try to break into paragraphs by sentences (roughly every 3-4 sentences)
  const words = alternative?.words || []

  if (words.length === 0) {
    return plainTranscript
  }

  // Group by ~30 second chunks
  const chunks: Array<{start: number; text: string}> = []
  let currentChunk = {start: words[0].start, text: ''}
  let lastEnd = 0

  for (const word of words) {
    // Use punctuated_word if available, otherwise fall back to word
    const wordText = word.punctuated_word || word.word

    // Start new chunk every ~30 seconds
    if (word.start - currentChunk.start > 30 && currentChunk.text) {
      chunks.push({...currentChunk})
      currentChunk = {start: word.start, text: wordText}
    } else {
      currentChunk.text += (currentChunk.text ? ' ' : '') + wordText
    }
    lastEnd = word.end
  }

  if (currentChunk.text) {
    chunks.push(currentChunk)
  }

  return chunks
    .map((chunk) => `[${secondsToTimestamp(chunk.start)}] ${chunk.text.trim()}`)
    .join('\n\n')
}

/**
 * Process Deepgram callback results into all transcript formats
 */
export function processDeepgramResults(
  results: DeepgramCallback,
): TranscriptResult {
  return {
    text: transcriptAsParagraphsWithTimestamps(results),
    srt: srtFromTranscriptResult(results),
  }
}

/**
 * Get plain transcript text without timestamps
 */
export function getPlainTranscript(results: DeepgramCallback): string {
  return results.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
}

/**
 * Get transcript duration in seconds
 */
export function getTranscriptDuration(results: DeepgramCallback): number {
  const words = results.results?.channels?.[0]?.alternatives?.[0]?.words || []

  if (words.length === 0) {
    return 0
  }

  return words[words.length - 1].end
}
