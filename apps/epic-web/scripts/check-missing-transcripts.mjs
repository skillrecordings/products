#!/usr/bin/env node
/**
 * QA Script: Check for missing transcripts in a workshop
 *
 * Usage:
 *   node apps/epic-web/scripts/check-missing-transcripts.mjs <workshop-slug>
 *   node apps/epic-web/scripts/check-missing-transcripts.mjs --all
 *   node apps/epic-web/scripts/check-missing-transcripts.mjs --list
 *   node apps/epic-web/scripts/check-missing-transcripts.mjs slug-1,slug-2
 */

const PROJECT_ID = 'i1a93n76'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

async function sanityFetch(query, params = {}) {
  const url = new URL(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`,
  )
  url.searchParams.set('query', query)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Sanity API error: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  return data.result
}

async function checkWorkshop(slug) {
  const workshop = await sanityFetch(
    `*[_type == "module" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      moduleType,
      "sections": resources[@->._type == 'section']->{
        _id,
        title,
        "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson', 'interview']]->{
          _id,
          _type,
          title,
          "videoResource": resources[@->._type == 'videoResource'][0]->{
            _id,
            state,
            "hasTranscriptText": defined(transcript.text) && length(transcript.text) > 0,
            "hasTranscriptSrt": defined(transcript.srt) && length(transcript.srt) > 0,
            "hasCastingwords": defined(castingwords.transcript) && length(castingwords.transcript) > 0
          },
          "solution": resources[@._type == 'solution'][0]{
            _key,
            "videoResource": resources[@->._type == 'videoResource'][0]->{
              _id,
              state,
              "hasTranscriptText": defined(transcript.text) && length(transcript.text) > 0,
              "hasTranscriptSrt": defined(transcript.srt) && length(transcript.srt) > 0,
              "hasCastingwords": defined(castingwords.transcript) && length(castingwords.transcript) > 0
            }
          }
        }
      },
      "directLessons": resources[@->._type in ['exercise', 'explainer', 'lesson', 'interview']]->{
        _id,
        _type,
        title,
        "videoResource": resources[@->._type == 'videoResource'][0]->{
          _id,
          state,
          "hasTranscriptText": defined(transcript.text) && length(transcript.text) > 0,
          "hasTranscriptSrt": defined(transcript.srt) && length(transcript.srt) > 0,
          "hasCastingwords": defined(castingwords.transcript) && length(castingwords.transcript) > 0
        },
        "solution": resources[@._type == 'solution'][0]{
          _key,
          "videoResource": resources[@->._type == 'videoResource'][0]->{
            _id,
            state,
            "hasTranscriptText": defined(transcript.text) && length(transcript.text) > 0,
            "hasTranscriptSrt": defined(transcript.srt) && length(transcript.srt) > 0,
            "hasCastingwords": defined(castingwords.transcript) && length(castingwords.transcript) > 0
          }
        }
      }
    }`,
    {slug},
  )

  if (!workshop) {
    console.error(`Workshop not found: "${slug}"`)
    return null
  }

  console.log(`\n${'='.repeat(70)}`)
  console.log(`Workshop: ${workshop.title}`)
  console.log(`Type: ${workshop.moduleType} | Slug: ${workshop.slug}`)
  console.log(`${'='.repeat(70)}`)

  const allVideos = []

  // Process sections
  for (const section of workshop.sections || []) {
    for (const lesson of section.lessons || []) {
      allVideos.push({
        lessonTitle: lesson.title,
        lessonType: lesson._type,
        sectionTitle: section.title,
        videoResourceId: lesson.videoResource?._id || null,
        hasTranscriptText: lesson.videoResource?.hasTranscriptText || false,
        hasTranscriptSrt: lesson.videoResource?.hasTranscriptSrt || false,
        hasCastingwords: lesson.videoResource?.hasCastingwords || false,
        state: lesson.videoResource?.state || null,
        isSolution: false,
      })

      if (lesson.solution?.videoResource) {
        allVideos.push({
          lessonTitle: `${lesson.title} (Solution)`,
          lessonType: lesson._type,
          sectionTitle: section.title,
          videoResourceId: lesson.solution.videoResource._id,
          hasTranscriptText:
            lesson.solution.videoResource.hasTranscriptText || false,
          hasTranscriptSrt:
            lesson.solution.videoResource.hasTranscriptSrt || false,
          hasCastingwords:
            lesson.solution.videoResource.hasCastingwords || false,
          state: lesson.solution.videoResource.state || null,
          isSolution: true,
        })
      }
    }
  }

  // Process direct lessons (not in sections)
  for (const lesson of workshop.directLessons || []) {
    allVideos.push({
      lessonTitle: lesson.title,
      lessonType: lesson._type,
      sectionTitle: null,
      videoResourceId: lesson.videoResource?._id || null,
      hasTranscriptText: lesson.videoResource?.hasTranscriptText || false,
      hasTranscriptSrt: lesson.videoResource?.hasTranscriptSrt || false,
      hasCastingwords: lesson.videoResource?.hasCastingwords || false,
      state: lesson.videoResource?.state || null,
      isSolution: false,
    })

    if (lesson.solution?.videoResource) {
      allVideos.push({
        lessonTitle: `${lesson.title} (Solution)`,
        lessonType: lesson._type,
        sectionTitle: null,
        videoResourceId: lesson.solution.videoResource._id,
        hasTranscriptText:
          lesson.solution.videoResource.hasTranscriptText || false,
        hasTranscriptSrt:
          lesson.solution.videoResource.hasTranscriptSrt || false,
        hasCastingwords:
          lesson.solution.videoResource.hasCastingwords || false,
        state: lesson.solution.videoResource.state || null,
        isSolution: true,
      })
    }
  }

  // Report
  const hasAnyTranscript = (v) =>
    v.hasTranscriptText || v.hasCastingwords
  const missing = allVideos.filter((v) => v.videoResourceId && !hasAnyTranscript(v))
  const noVideoResource = allVideos.filter((v) => !v.videoResourceId)
  const withTranscript = allVideos.filter(hasAnyTranscript)
  const missingSrt = allVideos.filter(
    (v) => v.videoResourceId && !v.hasTranscriptSrt && !v.hasCastingwords,
  )

  console.log(
    `\nTotal: ${allVideos.length} videos | With transcript: ${withTranscript.length} | Missing: ${missing.length} | No video resource: ${noVideoResource.length}`,
  )

  if (noVideoResource.length > 0) {
    console.log(`\n--- NO VIDEO RESOURCE (${noVideoResource.length}) ---`)
    for (const v of noVideoResource) {
      const section = v.sectionTitle ? `[${v.sectionTitle}] ` : ''
      console.log(`  !  ${section}${v.lessonTitle} (${v.lessonType})`)
    }
  }

  if (missing.length > 0) {
    console.log(`\n--- MISSING TRANSCRIPT (${missing.length}) ---`)
    for (const v of missing) {
      const section = v.sectionTitle ? `[${v.sectionTitle}] ` : ''
      const state = v.state ? ` state=${v.state}` : ''
      console.log(
        `  x  ${section}${v.lessonTitle} (${v.lessonType})${state} — ${v.videoResourceId}`,
      )
    }
  }

  // Check for has-text-but-no-SRT
  const srtOnly = missingSrt.filter(hasAnyTranscript)
  if (srtOnly.length > 0) {
    console.log(
      `\n--- HAS TRANSCRIPT BUT MISSING SRT (${srtOnly.length}) ---`,
    )
    for (const v of srtOnly) {
      const section = v.sectionTitle ? `[${v.sectionTitle}] ` : ''
      console.log(`  ~  ${section}${v.lessonTitle} — ${v.videoResourceId}`)
    }
  }

  if (missing.length === 0 && noVideoResource.length === 0) {
    console.log('\n  All videos have transcripts!')
  }

  return {
    workshop: workshop.title,
    slug: workshop.slug,
    total: allVideos.length,
    withTranscript: withTranscript.length,
    missingTranscript: missing.length,
    noVideoResource: noVideoResource.length,
  }
}

async function listAllWorkshops() {
  const modules = await sanityFetch(
    `*[_type == "module" && moduleType == "workshop"] | order(title asc) {
      title,
      "slug": slug.current
    }`,
  )

  console.log('\nAvailable workshops:')
  for (const m of modules) {
    console.log(`  - ${m.slug}  (${m.title})`)
  }
}

// Main
async function main() {
  const arg = process.argv[2]

  if (!arg) {
    console.log(
      'Usage: node apps/epic-web/scripts/check-missing-transcripts.mjs <workshop-slug>',
    )
    console.log(
      '       node apps/epic-web/scripts/check-missing-transcripts.mjs --all',
    )
    console.log(
      '       node apps/epic-web/scripts/check-missing-transcripts.mjs --list',
    )
    await listAllWorkshops()
    process.exit(0)
  }

  if (arg === '--list') {
    await listAllWorkshops()
    process.exit(0)
  }

  if (arg === '--all') {
    const modules = await sanityFetch(
      `*[_type == "module" && moduleType == "workshop"] | order(title asc) {
        "slug": slug.current
      }`,
    )

    let totalMissing = 0
    let totalVideos = 0

    for (const m of modules) {
      const result = await checkWorkshop(m.slug)
      if (result) {
        totalMissing += result.missingTranscript
        totalVideos += result.total
      }
    }

    console.log(`\n${'='.repeat(70)}`)
    console.log(
      `TOTAL: ${totalVideos} videos, ${totalMissing} missing transcripts across ${modules.length} workshops`,
    )
    console.log(`${'='.repeat(70)}`)
  } else {
    const slugs = arg.split(',')
    for (const slug of slugs) {
      await checkWorkshop(slug.trim())
    }
  }
}

main().catch(console.error)
