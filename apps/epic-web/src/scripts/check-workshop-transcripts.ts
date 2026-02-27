/**
 * Check Workshop Transcripts
 *
 * Queries Sanity to verify every videoResource in a workshop has a transcript.
 *
 * Usage:
 *   cd apps/epic-web
 *   pnpm tsx src/scripts/check-workshop-transcripts.ts
 */

const WORKSHOP_ID = '614ce1b8-8ed6-4ac8-b153-a0e9b7b4dcc7'
const SANITY_PROJECT_ID = 'i1a93n76'
const SANITY_DATASET = 'production'

async function main() {
  const query = `*[_id == $workshopId][0]{
    title,
    "sections": resources[]->{
      title,
      "lessons": resources[]->{
        _id,
        _type,
        title,
        "problemVideo": resources[@._type == 'reference'][0]->{
          _id,
          title,
          state,
          "hasTranscript": defined(transcript.text),
          "hasSrt": defined(transcript.srt),
          "muxPlaybackId": muxAsset.muxPlaybackId,
          "muxAssetId": muxAsset.muxAssetId
        },
        "solutionVideo": resources[@._type == 'solution'][0].resources[@._type == 'reference'][0]->{
          _id,
          title,
          state,
          "hasTranscript": defined(transcript.text),
          "hasSrt": defined(transcript.srt),
          "muxPlaybackId": muxAsset.muxPlaybackId,
          "muxAssetId": muxAsset.muxAssetId
        }
      }
    }
  }`

  const encodedQuery = encodeURIComponent(query)
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-19/data/query/${SANITY_DATASET}?query=${encodedQuery}&$workshopId=%22${WORKSHOP_ID}%22`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)

  const data = await res.json()
  const workshop = data.result

  console.log(`=== ${workshop.title} ===\n`)

  let total = 0
  let withTranscript = 0
  let withSrt = 0
  let withMux = 0
  let missing: string[] = []
  let noMux: string[] = []

  for (const section of workshop.sections) {
    console.log(`  ${section.title}`)

    for (const lesson of section.lessons) {
      const videos = [
        {label: lesson.title, video: lesson.problemVideo},
        lesson.solutionVideo
          ? {label: `${lesson.title} (Solution)`, video: lesson.solutionVideo}
          : null,
      ].filter(Boolean) as {label: string; video: any}[]

      for (const {label, video} of videos) {
        if (!video) continue
        total++

        const transcriptOk = video.hasTranscript ? '✓' : '✗'
        const srtOk = video.hasSrt ? '✓' : '✗'
        const muxOk = video.muxPlaybackId ? '✓' : '✗'
        const state = video.state || '?'

        if (video.hasTranscript) withTranscript++
        if (video.hasSrt) withSrt++
        if (video.muxPlaybackId) withMux++

        const status =
          video.hasTranscript && video.hasSrt && video.muxPlaybackId
            ? '  '
            : '⚠ '

        console.log(
          `    ${status}${label}  [state:${state}  transcript:${transcriptOk}  srt:${srtOk}  mux:${muxOk}]`,
        )

        if (!video.hasTranscript || !video.hasSrt)
          missing.push(`${label} (${video._id})`)
        if (!video.muxPlaybackId) noMux.push(`${label} (${video._id})`)
      }
    }
    console.log()
  }

  console.log(`=== Summary ===`)
  console.log(`  Total videos: ${total}`)
  console.log(`  With transcript: ${withTranscript}/${total}`)
  console.log(`  With SRT: ${withSrt}/${total}`)
  console.log(`  With Mux playback: ${withMux}/${total}`)

  if (missing.length > 0) {
    console.log(`\n⚠ Missing transcript/SRT (${missing.length}):`)
    for (const m of missing) console.log(`    - ${m}`)
  }

  if (noMux.length > 0) {
    console.log(`\n⚠ Missing Mux playback ID (${noMux.length}):`)
    for (const m of noMux) console.log(`    - ${m}`)
  }

  if (missing.length === 0 && noMux.length === 0) {
    console.log(
      `\n✓ All ${total} videos have transcripts, SRTs, and Mux playback IDs!`,
    )
  }
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
