// HOW TO USE:
// sanity exec scripts/transcript-fix.ts --with-user-token -- --report "scripts/qa-reports/<filename>.json"
//
// Required env vars: MUX_TOKEN_ID, MUX_TOKEN_SECRET, OPENAI_API_KEY, DEEPGRAM_API_KEY
// These are loaded from .env via dotenv-flow.

import {getCliClient} from 'sanity/cli'
import groq from 'groq'
import Mux from '@mux/mux-node'
import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'

// Load .env files (sanity exec does not auto-load them)
import dotenv from 'dotenv-flow'
dotenv.config({path: path.resolve(process.cwd())})

const client = getCliClient()

// --- Argument parsing ---
function getReportPath(): string {
  const argv = process.argv
  const idx = argv.indexOf('--report')
  if (idx === -1 || !argv[idx + 1]) {
    console.error(
      'Error: --report argument is required.\n' +
        'Usage: sanity exec scripts/transcript-fix.ts --with-user-token -- --report "path/to/qa-report.json"',
    )
    process.exit(1)
  }
  return argv[idx + 1]
}

// --- Types ---
type ErrorEntry = {
  _id: string
  _type: string
  title: string
  missingFields?: string[]
  parentModule?: {_id: string; title: string; slug?: string}
  parentSection?: {_id: string; title: string; slug?: string}
  parentResource?: {_id: string; _type: string; title: string; slug?: string}
  error: string
}

type QAReport = {
  product: {_id: string; title: string; slug?: string}
  timestamp: string
  summary: {totalErrors: number; byType: Record<string, number>}
  errors: ErrorEntry[]
}

type VideoResourceSanity = {
  originalMediaUrl?: string
  muxAsset?: {
    muxAssetId?: string
    muxPlaybackId?: string
  }
  transcript?: {
    text?: string
    srt?: string
  }
}

// --- Helpers ---
function formatError(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}

function formatSrtTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.round((seconds % 1) * 1000)
  return (
    String(h).padStart(2, '0') +
    ':' +
    String(m).padStart(2, '0') +
    ':' +
    String(s).padStart(2, '0') +
    ',' +
    String(ms).padStart(3, '0')
  )
}

function formatTranscriptTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
}

// Build SRT from word-level timestamps, grouping into ~3-second chunks
function buildSrtFromWords(words: any[]): string {
  if (!words || words.length === 0) return ''

  const entries: string[] = []
  let entryIndex = 1
  let chunkStart = words[0].start
  let chunkWords: string[] = []

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    chunkWords.push(word.punctuated_word ?? word.word)

    const chunkDuration = word.end - chunkStart
    const isLastWord = i === words.length - 1
    const endsWithPunctuation = /[.!?,;:]$/.test(
      word.punctuated_word ?? word.word,
    )
    const shouldBreak =
      isLastWord ||
      chunkDuration >= 3 ||
      (endsWithPunctuation && chunkDuration >= 1.5)

    if (shouldBreak) {
      const start = formatSrtTimestamp(chunkStart)
      const end = formatSrtTimestamp(word.end)
      const text = chunkWords.join(' ')
      entries.push(`${entryIndex}\n${start} --> ${end}\n${text}`)
      entryIndex++
      chunkWords = []
      if (!isLastWord) {
        chunkStart = words[i + 1].start
      }
    }
  }

  return entries.join('\n\n') + '\n'
}

// Build timestamped transcript text with [MM:SS] paragraph markers
function buildTimestampedTranscript(
  paragraphs: any[] | null,
  utterances: any[] | null,
): string {
  // Prefer paragraphs from Deepgram (natural paragraph breaks)
  if (paragraphs && paragraphs.length > 0) {
    const parts: string[] = []
    for (const para of paragraphs) {
      const sentences = para.sentences ?? []
      if (sentences.length === 0) continue
      const ts = formatTranscriptTimestamp(sentences[0].start)
      const text = sentences.map((s: any) => s.text).join(' ')
      parts.push(`[${ts}] ${text}`)
    }
    return parts.join('\n\n')
  }

  // Fallback: group utterances into ~20-30 second paragraphs
  if (utterances && utterances.length > 0) {
    const parts: string[] = []
    let currentChunks: string[] = []
    let paragraphStart = utterances[0].start

    for (const u of utterances) {
      currentChunks.push(u.transcript)
      const duration = u.end - paragraphStart
      if (duration >= 20) {
        const ts = formatTranscriptTimestamp(paragraphStart)
        parts.push(`[${ts}] ${currentChunks.join(' ')}`)
        currentChunks = []
        paragraphStart = u.end
      }
    }
    if (currentChunks.length > 0) {
      const ts = formatTranscriptTimestamp(paragraphStart)
      parts.push(`[${ts}] ${currentChunks.join(' ')}`)
    }
    return parts.join('\n\n')
  }

  return ''
}

// --- Deepgram transcription ---
async function transcribeWithDeepgram(
  audioUrl: string,
): Promise<{text: string; srt: string} | null> {
  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    console.log('  WARNING: DEEPGRAM_API_KEY not set — cannot transcribe')
    return null
  }

  const response = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova-3&utterances=true&smart_format=true&paragraphs=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: audioUrl}),
    },
  )

  if (!response.ok) {
    const body = await response.text()
    console.log(
      `  WARNING: Deepgram API returned HTTP ${response.status}: ${body}`,
    )
    return null
  }

  const result = (await response.json()) as any

  const alt = result?.results?.channels?.[0]?.alternatives?.[0]
  if (!alt?.transcript) {
    console.log('  WARNING: Deepgram returned no transcript text')
    return null
  }

  const words = alt.words ?? []
  const paragraphs = alt.paragraphs?.paragraphs ?? null
  const utterances = result?.results?.utterances ?? null

  // Build timestamped transcript text with [MM:SS] paragraph markers
  const text = buildTimestampedTranscript(paragraphs, utterances)
  if (!text) {
    console.log('  WARNING: Could not build timestamped transcript')
    return null
  }

  // Build SRT from word-level timestamps (~3s per entry)
  const srt = buildSrtFromWords(words)
  if (!srt) {
    console.log('  WARNING: No word-level timestamps for SRT')
    return null
  }

  return {text, srt}
}

// --- Get audio URLs for Deepgram (ordered by preference) ---
function getAudioUrls(vr: VideoResourceSanity): string[] {
  const urls: string[] = []
  if (vr.originalMediaUrl) {
    urls.push(vr.originalMediaUrl)
  }
  if (vr.muxAsset?.muxPlaybackId) {
    urls.push(`https://stream.mux.com/${vr.muxAsset.muxPlaybackId}/low.mp4`)
  }
  return urls
}

// --- Process a single videoResource error entry ---
async function processVideoResource(
  entry: ErrorEntry,
  Video: any,
  openai: OpenAI,
  counters: {
    transcriptsFetched: number
    descriptionsGenerated: number
    srtTracksAdded: number
    failures: number
  },
): Promise<void> {
  const missingFields = entry.missingFields ?? []
  const needsTranscript =
    missingFields.includes('transcript.text') ||
    missingFields.includes('transcript.srt')
  const needsDescription = missingFields.includes('generatedDescription')

  const locationParts: string[] = []
  if (entry.parentModule)
    locationParts.push(`module: ${entry.parentModule.title}`)
  if (entry.parentSection)
    locationParts.push(`section: ${entry.parentSection.title}`)
  if (entry.parentResource)
    locationParts.push(`parent: ${entry.parentResource.title}`)
  const location =
    locationParts.length > 0 ? ` [${locationParts.join(', ')}]` : ''

  console.log(`\nProcessing: "${entry.title}" (${entry._id})${location}`)
  console.log(`  Missing: ${missingFields.join(', ')}`)

  let transcriptText: string | null = null
  let srtWasWritten = false
  let muxAssetId: string | null = null

  try {
    // Step 1: Transcribe via Deepgram if needed
    if (needsTranscript) {
      const vr = await client.fetch<VideoResourceSanity>(
        groq`*[_type == 'videoResource' && _id == $id][0]{ originalMediaUrl, muxAsset, transcript }`,
        {id: entry._id},
      )

      muxAssetId = vr?.muxAsset?.muxAssetId ?? null
      const audioUrls = vr ? getAudioUrls(vr) : []

      if (audioUrls.length === 0) {
        console.log(
          '  WARNING: No audio URL available (no originalMediaUrl or muxPlaybackId)',
        )
      } else {
        console.log(`  Transcribing via Deepgram...`)
        let result: {text: string; srt: string} | null = null
        for (const audioUrl of audioUrls) {
          console.log(`  Trying URL: ${audioUrl}`)
          result = await transcribeWithDeepgram(audioUrl)
          if (result) break
          if (audioUrls.length > 1) console.log('  Trying fallback URL...')
        }

        if (result) {
          transcriptText = result.text

          await client
            .patch(entry._id)
            .set({
              'transcript.text': result.text,
              'transcript.srt': result.srt,
            })
            .commit()

          console.log(
            `  Transcript written to Sanity (${result.text.length} chars, ${
              result.srt.split('\n\n').length
            } SRT entries)`,
          )
          counters.transcriptsFetched++
          srtWasWritten = true
        }
      }
    }

    // Step 2: Generate description via OpenAI if needed
    if (needsDescription) {
      // Use transcript text just fetched, or fetch from Sanity if already exists
      if (!transcriptText) {
        const vr = await client.fetch<VideoResourceSanity>(
          groq`*[_type == 'videoResource' && _id == $id][0]{ muxAsset, transcript }`,
          {id: entry._id},
        )
        transcriptText = vr?.transcript?.text ?? null
        if (!muxAssetId) {
          muxAssetId = vr?.muxAsset?.muxAssetId ?? null
        }
      }

      if (!transcriptText) {
        console.log(
          '  WARNING: No transcript text available for description generation — skipping',
        )
      } else {
        console.log('  Generating description via OpenAI...')
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Generate a concise SEO description for a programming tutorial video. Output ONLY the description text, no quotes, no prefix. Maximum 120 characters.',
            },
            {
              role: 'user',
              content: `Video title: "${
                entry.title
              }"\n\nTranscript:\n${transcriptText.slice(0, 2000)}`,
            },
          ],
          max_tokens: 60,
        })

        const description = completion.choices[0].message.content?.trim()

        if (!description) {
          console.log('  WARNING: OpenAI returned empty description — skipping')
        } else {
          await client
            .patch(entry._id)
            .set({generatedDescription: description})
            .commit()
          console.log(`  Description written: "${description}"`)
          counters.descriptionsGenerated++
        }
      }
    }

    // Step 3: Add SRT subtitle track to Mux asset if SRT was written
    if (srtWasWritten && muxAssetId) {
      console.log('  Adding SRT subtitle track to Mux asset...')

      try {
        const asset = await Video.Assets.get(muxAssetId)
        const existingSubtitle = (asset.tracks ?? []).find(
          (track: any) => track.name === 'English',
        )

        if (existingSubtitle) {
          await Video.Assets.deleteTrack(
            muxAssetId,
            (existingSubtitle as any).id,
          )
          console.log('  Removed existing English subtitle track.')
        }

        await Video.Assets.createTrack(muxAssetId, {
          url: `https://www.epicweb.dev/api/videoResource/${entry._id}/srt`,
          type: 'text',
          text_type: 'subtitles',
          closed_captions: false,
          language_code: 'en-US',
          name: 'English',
          passthrough: 'English',
        })

        console.log('  SRT subtitle track added to Mux.')
        counters.srtTracksAdded++
      } catch (muxErr: unknown) {
        // Don't fail the whole resource if Mux subtitle track fails (e.g., mismatching environment)
        console.log(
          `  WARNING: Failed to add SRT to Mux: ${formatError(muxErr)}`,
        )
      }
    }
  } catch (err: unknown) {
    console.error(
      `  ERROR processing "${entry.title}" (${entry._id}): ${formatError(err)}`,
    )
    counters.failures++
  }
}

// --- Main ---
async function main(): Promise<void> {
  const reportPath = getReportPath()

  if (!fs.existsSync(reportPath)) {
    console.error(`Error: Report file not found: ${reportPath}`)
    process.exit(1)
  }

  let report: QAReport
  try {
    const raw = fs.readFileSync(reportPath, 'utf-8')
    report = JSON.parse(raw) as QAReport
  } catch (err: unknown) {
    console.error(`Error: Failed to parse report JSON: ${formatError(err)}`)
    process.exit(1)
  }

  const productTitle = report.product?.title ?? '(unknown product)'
  console.log(`Transcript Fix: "${productTitle}"`)
  console.log(`Report: ${reportPath}`)
  console.log(`Report timestamp: ${report.timestamp}`)

  // Verify required env vars
  const missing: string[] = []
  if (!process.env.DEEPGRAM_API_KEY) missing.push('DEEPGRAM_API_KEY')
  if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY')
  if (missing.length > 0) {
    console.error(`Error: Missing required env vars: ${missing.join(', ')}`)
    process.exit(1)
  }

  const videoResourceErrors = report.errors.filter(
    (e) =>
      e._type === 'videoResource' &&
      e.missingFields &&
      e.missingFields.length > 0,
  )

  console.log(
    `\nTotal videoResource errors in report: ${videoResourceErrors.length}`,
  )

  if (videoResourceErrors.length === 0) {
    console.log('Nothing to fix.')
    return
  }

  // Initialize Mux and OpenAI clients (after dotenv has loaded .env)
  const mux = new Mux()
  const {Video} = mux
  const openai = new OpenAI()

  const counters = {
    transcriptsFetched: 0,
    descriptionsGenerated: 0,
    srtTracksAdded: 0,
    failures: 0,
  }

  let processed = 0

  // Process sequentially to avoid rate limits
  for (const entry of videoResourceErrors) {
    await processVideoResource(entry, Video, openai, counters)
    processed++
  }

  // Print summary
  console.log(`\nTranscript Fix Summary for "${productTitle}"`)
  console.log('==========================================')
  console.log(
    `Total videoResource errors in report: ${videoResourceErrors.length}`,
  )
  console.log(`Processed: ${processed}`)
  console.log(
    `Transcripts fetched via Deepgram: ${counters.transcriptsFetched}`,
  )
  console.log(
    `Descriptions generated via OpenAI: ${counters.descriptionsGenerated}`,
  )
  console.log(`SRT tracks added to Mux: ${counters.srtTracksAdded}`)
  console.log(`Failures: ${counters.failures}`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
