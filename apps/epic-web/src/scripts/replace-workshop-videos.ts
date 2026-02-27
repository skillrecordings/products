/**
 * Replace Workshop Videos
 *
 * Replaces video files for an existing workshop by:
 * 1. Scanning a Dropbox folder for corrected videos
 * 2. Matching them to existing Sanity videoResources by position
 * 3. Patching each videoResource with the new Dropbox URL
 * 4. Sending Inngest events to trigger Mux upload + Deepgram transcription
 *
 * The existing Inngest pipeline handles:
 * - Creating new Mux assets
 * - Ordering Deepgram transcription
 * - Saving transcript/SRT
 * - Attaching SRT to Mux
 *
 * Usage:
 *   cd apps/epic-web
 *   pnpm tsx src/scripts/replace-workshop-videos.ts
 */

import * as path from 'path'
import {config} from 'dotenv'
import {Dropbox} from 'dropbox'
import {Inngest} from 'inngest'

// Load environment variables
config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

// ============================================
// CONFIGURE THESE:
// ============================================

// Sanity workshop _id
const WORKSHOP_ID = '614ce1b8-8ed6-4ac8-b153-a0e9b7b4dcc7'

// Dropbox folder path for corrected videos
const DROPBOX_FOLDER_PATH =
  '/02 areas/Epic Web/Epic TypeScript/01-programming-foundations'

// Set to false to actually make changes
const DRY_RUN = false

// Sanity project config
const SANITY_PROJECT_ID = 'i1a93n76'
const SANITY_DATASET = 'production'

// ============================================

const VIDEO_RESOURCE_CREATED_EVENT = 'video/resource.created'

// -------------------------------------------
// Types
// -------------------------------------------

interface VideoMatch {
  sectionTitle: string
  lessonTitle: string
  lessonType: string
  videoType: 'problem' | 'solution'
  videoResourceId: string
  dropboxUrl: string
  dropboxFileName: string
}

interface SanityVideoInfo {
  videoResourceId: string
  title: string
}

interface SanityLesson {
  _id: string
  _type: string
  title: string
  problemVideo: SanityVideoInfo | null
  solutionVideo: SanityVideoInfo | null
}

interface SanitySection {
  title: string
  lessons: SanityLesson[]
}

interface DropboxVideo {
  name: string
  path: string
  position: number
  type: 'problem' | 'solution' | 'intro' | 'outro' | 'break' | 'lesson'
  title: string
  url: string
}

interface DropboxSection {
  name: string
  position: number
  videos: DropboxVideo[]
}

// -------------------------------------------
// Dropbox helpers (from generate-workshop-json-from-dropbox.ts)
// -------------------------------------------

function getDropboxClient(): Dropbox {
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('DROPBOX_ACCESS_TOKEN environment variable is required')
  }

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

function extractPosition(filename: string): number {
  const match = filename.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 999
}

function detectVideoType(filename: string): DropboxVideo['type'] {
  const lower = filename.toLowerCase()
  if (/[.\-_\s]problem[.\-_\s]/i.test(lower)) return 'problem'
  if (/[.\-_\s]solution[.\-_\s]/i.test(lower)) return 'solution'
  if (
    lower.includes('intro') &&
    !lower.includes('problem') &&
    !lower.includes('solution')
  )
    return 'intro'
  if (
    lower.includes('outro') &&
    !lower.includes('problem') &&
    !lower.includes('solution')
  )
    return 'outro'
  if (
    lower.includes('break') &&
    !lower.includes('problem') &&
    !lower.includes('solution')
  )
    return 'break'
  return 'lesson'
}

function extractTitle(filename: string, type: DropboxVideo['type']): string {
  let name = filename.replace(/\.(mp4|mov|webm|mkv)$/i, '')
  name = name.replace(/^\d+[\.\-_\s]+/, '')
  name = name.replace(/[.\-_\s]*(problem|solution)[.\-_\s]*/gi, '')
  name = name.replace(/[\.\-_]+/g, ' ')
  name = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()
  return name || filename
}

function extractSectionName(folderName: string): string {
  let name = folderName.replace(/^\d+[\s\-_]*/, '')
  name = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()
  return name
}

/**
 * Get a temporary direct download link from Dropbox.
 * Gives a real direct URL (no redirects) that Mux can ingest.
 * Links expire after 4 hours.
 */
async function getTemporaryLink(
  dbx: Dropbox,
  filePath: string,
  retries = 3,
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`   Getting direct link for: ${filePath.split('/').pop()}`)
      const result = await dbx.filesGetTemporaryLink({path: filePath})
      return result.result.link
    } catch (error: any) {
      if (attempt < retries && error?.status >= 500) {
        console.warn(
          `   Retry ${attempt}/${retries} for ${filePath.split('/').pop()} (${
            error.status
          })`,
        )
        await new Promise((r) => setTimeout(r, 2000 * attempt))
        continue
      }
      console.error(`   Failed to get temporary link for ${filePath}:`, error)
      return `DROPBOX_LINK_ERROR:${filePath}`
    }
  }
  return `DROPBOX_LINK_ERROR:${filePath}`
}

// -------------------------------------------
// Sanity helpers
// -------------------------------------------

async function fetchWorkshopStructure(): Promise<SanitySection[]> {
  const query = `*[_id == $workshopId][0]{
    "sections": resources[]->{
      title,
      "lessons": resources[]->{
        _id,
        _type,
        title,
        "problemVideo": {
          "videoResourceId": resources[@._type == 'reference'][0]->_id,
          "title": resources[@._type == 'reference'][0]->title
        },
        "solutionVideo": {
          "videoResourceId": resources[@._type == 'solution'][0].resources[@._type == 'reference'][0]->_id,
          "title": resources[@._type == 'solution'][0].title
        }
      }
    }
  }`

  const params = encodeURIComponent(JSON.stringify({workshopId: WORKSHOP_ID}))
  const encodedQuery = encodeURIComponent(query)
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-19/data/query/${SANITY_DATASET}?query=${encodedQuery}&$workshopId=%22${WORKSHOP_ID}%22`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Sanity query failed: ${response.status} ${await response.text()}`,
    )
  }

  const data = await response.json()
  return data.result.sections
}

async function patchVideoResource(
  videoResourceId: string,
  newUrl: string,
): Promise<void> {
  const sanityToken = process.env.SANITY_API_TOKEN
  if (!sanityToken) {
    throw new Error('SANITY_API_TOKEN is required for patching')
  }

  const mutations = [
    {
      patch: {
        id: videoResourceId,
        set: {
          originalMediaUrl: newUrl,
          state: 'new',
          muxAsset: {
            muxAssetId: '',
            muxPlaybackId: '',
          },
        },
        unset: ['transcript', 'duration'],
      },
    },
  ]

  const response = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-19/data/mutate/${SANITY_DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sanityToken}`,
      },
      body: JSON.stringify({mutations}),
    },
  )

  if (!response.ok) {
    throw new Error(
      `Sanity patch failed for ${videoResourceId}: ${
        response.status
      } ${await response.text()}`,
    )
  }
}

// -------------------------------------------
// Dropbox folder scanning
// -------------------------------------------

async function scanDropboxFolder(dbx: Dropbox): Promise<{
  rootVideos: DropboxVideo[]
  sections: DropboxSection[]
}> {
  console.log(`Scanning Dropbox folder: ${DROPBOX_FOLDER_PATH}\n`)

  const rootContents = await dbx.filesListFolder({path: DROPBOX_FOLDER_PATH})

  const sections: DropboxSection[] = []
  const rootVideos: DropboxVideo[] = []

  for (const entry of rootContents.result.entries) {
    if (entry['.tag'] === 'folder') {
      sections.push({
        name: extractSectionName(entry.name),
        position: extractPosition(entry.name),
        videos: [],
      })
    } else if (
      entry['.tag'] === 'file' &&
      /\.(mp4|mov|webm|mkv)$/i.test(entry.name)
    ) {
      const type = detectVideoType(entry.name)
      rootVideos.push({
        name: entry.name,
        path: entry.path_lower || entry.path_display || '',
        position: extractPosition(entry.name),
        type,
        title: extractTitle(entry.name, type),
        url: '',
      })
    }
  }

  sections.sort((a, b) => a.position - b.position)

  // Get videos for each section folder
  for (const section of sections) {
    const matchingEntry = rootContents.result.entries.find(
      (e) =>
        e['.tag'] === 'folder' && extractSectionName(e.name) === section.name,
    )

    if (!matchingEntry || !matchingEntry.path_lower) {
      console.warn(`Could not find folder for section: ${section.name}`)
      continue
    }

    const sectionContents = await dbx.filesListFolder({
      path: matchingEntry.path_lower,
    })

    for (const entry of sectionContents.result.entries) {
      if (
        entry['.tag'] === 'file' &&
        /\.(mp4|mov|webm|mkv)$/i.test(entry.name)
      ) {
        const type = detectVideoType(entry.name)
        section.videos.push({
          name: entry.name,
          path: entry.path_lower || entry.path_display || '',
          position: extractPosition(entry.name),
          type,
          title: extractTitle(entry.name, type),
          url: '',
        })
      }
    }

    section.videos.sort((a, b) => a.position - b.position)
  }

  rootVideos.sort((a, b) => a.position - b.position)

  // Get shared links for all videos
  console.log('Getting Dropbox shared links...\n')

  for (const video of rootVideos) {
    video.url = await getTemporaryLink(dbx, video.path)
  }

  for (const section of sections) {
    for (const video of section.videos) {
      video.url = await getTemporaryLink(dbx, video.path)
    }
  }

  return {rootVideos, sections}
}

// -------------------------------------------
// Matching logic
// -------------------------------------------

function matchVideos(
  sanity: SanitySection[],
  dropbox: {rootVideos: DropboxVideo[]; sections: DropboxSection[]},
): VideoMatch[] {
  const matches: VideoMatch[] = []

  // Build a flat list of Sanity sections (skip intro/outro which are single-lesson sections)
  // The Sanity structure has:
  //   Section 0: "Introduction to Programming Foundations" (1 lesson = workshop intro)
  //   Section 1-6: Numbered content sections with exercises
  //   Section 7: "Outro Foundations" (1 lesson = workshop outro)

  // The Dropbox structure has:
  //   Root: intro video, outro video
  //   Folders: numbered section folders with intros, problems, solutions, breaks

  const introSection = sanity[0] // "Introduction to Programming Foundations"
  const outroSection = sanity[sanity.length - 1] // "Outro Foundations"
  const contentSections = sanity.slice(1, -1) // Sections 1-6

  // Match root intro video → first section's single lesson
  const introVideo = dropbox.rootVideos.find((v) => v.type === 'intro')
  if (introVideo && introSection?.lessons?.[0]?.problemVideo?.videoResourceId) {
    matches.push({
      sectionTitle: introSection.title,
      lessonTitle: introSection.lessons[0].title,
      lessonType: introSection.lessons[0]._type,
      videoType: 'problem',
      videoResourceId: introSection.lessons[0].problemVideo.videoResourceId,
      dropboxUrl: introVideo.url,
      dropboxFileName: introVideo.name,
    })
  }

  // Match root outro video → last section's single lesson
  const outroVideo = dropbox.rootVideos.find((v) => v.type === 'outro')
  if (outroVideo && outroSection?.lessons?.[0]?.problemVideo?.videoResourceId) {
    matches.push({
      sectionTitle: outroSection.title,
      lessonTitle: outroSection.lessons[0].title,
      lessonType: outroSection.lessons[0]._type,
      videoType: 'problem',
      videoResourceId: outroSection.lessons[0].problemVideo.videoResourceId,
      dropboxUrl: outroVideo.url,
      dropboxFileName: outroVideo.name,
    })
  }

  // Match each content section
  for (
    let i = 0;
    i < contentSections.length && i < dropbox.sections.length;
    i++
  ) {
    const sanitySection = contentSections[i]
    const dropboxSection = dropbox.sections[i]

    // Build ordered list of Dropbox videos by type
    const dbIntro = dropboxSection.videos.find((v) => v.type === 'intro')
    const dbProblems = dropboxSection.videos.filter((v) => v.type === 'problem')
    const dbSolutions = dropboxSection.videos.filter(
      (v) => v.type === 'solution',
    )
    const dbBreak = dropboxSection.videos.find((v) => v.type === 'break')
    const dbLessons = dropboxSection.videos.filter(
      (v) => !['intro', 'break', 'problem', 'solution'].includes(v.type),
    )

    // Sanity lessons are ordered: intro, exercises (with solutions), break
    let sanityIdx = 0

    // Match intro
    if (dbIntro && sanityIdx < sanitySection.lessons.length) {
      const lesson = sanitySection.lessons[sanityIdx]
      if (lesson.problemVideo?.videoResourceId) {
        matches.push({
          sectionTitle: sanitySection.title,
          lessonTitle: lesson.title,
          lessonType: lesson._type,
          videoType: 'problem',
          videoResourceId: lesson.problemVideo.videoResourceId,
          dropboxUrl: dbIntro.url,
          dropboxFileName: dbIntro.name,
        })
      }
      sanityIdx++
    }

    // Match exercises (problems + solutions) and standalone lessons
    let problemIdx = 0
    let solutionIdx = 0
    let lessonIdx = 0

    while (sanityIdx < sanitySection.lessons.length) {
      const lesson = sanitySection.lessons[sanityIdx]

      // Check if this is the break (last lesson that's not an exercise)
      const isLastLesson = sanityIdx === sanitySection.lessons.length - 1
      const isBreak =
        isLastLesson &&
        lesson._type === 'lesson' &&
        lesson.title.toLowerCase().includes('break')

      if (isBreak) {
        if (dbBreak && lesson.problemVideo?.videoResourceId) {
          matches.push({
            sectionTitle: sanitySection.title,
            lessonTitle: lesson.title,
            lessonType: lesson._type,
            videoType: 'problem',
            videoResourceId: lesson.problemVideo.videoResourceId,
            dropboxUrl: dbBreak.url,
            dropboxFileName: dbBreak.name,
          })
        }
        break
      }

      if (lesson._type === 'exercise') {
        // Match problem video
        if (
          problemIdx < dbProblems.length &&
          lesson.problemVideo?.videoResourceId
        ) {
          matches.push({
            sectionTitle: sanitySection.title,
            lessonTitle: lesson.title,
            lessonType: lesson._type,
            videoType: 'problem',
            videoResourceId: lesson.problemVideo.videoResourceId,
            dropboxUrl: dbProblems[problemIdx].url,
            dropboxFileName: dbProblems[problemIdx].name,
          })
          problemIdx++
        }

        // Match solution video
        if (
          solutionIdx < dbSolutions.length &&
          lesson.solutionVideo?.videoResourceId
        ) {
          matches.push({
            sectionTitle: sanitySection.title,
            lessonTitle: lesson.title + ' (Solution)',
            lessonType: 'solution',
            videoType: 'solution',
            videoResourceId: lesson.solutionVideo.videoResourceId,
            dropboxUrl: dbSolutions[solutionIdx].url,
            dropboxFileName: dbSolutions[solutionIdx].name,
          })
          solutionIdx++
        }
      } else {
        // Regular lesson (not intro, not break)
        if (
          lessonIdx < dbLessons.length &&
          lesson.problemVideo?.videoResourceId
        ) {
          matches.push({
            sectionTitle: sanitySection.title,
            lessonTitle: lesson.title,
            lessonType: lesson._type,
            videoType: 'problem',
            videoResourceId: lesson.problemVideo.videoResourceId,
            dropboxUrl: dbLessons[lessonIdx].url,
            dropboxFileName: dbLessons[lessonIdx].name,
          })
          lessonIdx++
        }
      }

      sanityIdx++
    }
  }

  return matches
}

// -------------------------------------------
// Main
// -------------------------------------------

async function main() {
  if (DROPBOX_FOLDER_PATH === '/YOUR/DROPBOX/FOLDER/PATH') {
    console.error('Please update DROPBOX_FOLDER_PATH in this script first!')
    process.exit(1)
  }

  console.log('=== Replace Workshop Videos ===\n')
  console.log(`Workshop ID: ${WORKSHOP_ID}`)
  console.log(`Dropbox: ${DROPBOX_FOLDER_PATH}`)
  console.log(`Dry run: ${DRY_RUN}\n`)

  // Step 1: Fetch Sanity workshop structure
  console.log('Fetching workshop structure from Sanity...\n')
  const sanity = await fetchWorkshopStructure()

  let totalVideos = 0
  for (const section of sanity) {
    for (const lesson of section.lessons) {
      if (lesson.problemVideo?.videoResourceId) totalVideos++
      if (lesson.solutionVideo?.videoResourceId) totalVideos++
    }
  }
  console.log(`Found ${sanity.length} sections, ${totalVideos} total videos\n`)

  // Step 2: Scan Dropbox folder
  const dbx = getDropboxClient()
  const dropbox = await scanDropboxFolder(dbx)

  let dbVideoCount = dropbox.rootVideos.length
  for (const section of dropbox.sections) {
    dbVideoCount += section.videos.length
  }
  console.log(
    `\nFound ${dropbox.sections.length} sections + ${dropbox.rootVideos.length} root videos (${dbVideoCount} total) in Dropbox\n`,
  )

  // Step 3: Match videos
  const matches = matchVideos(sanity, dropbox)

  // Step 4: Show match preview
  console.log('=== Video Mapping ===\n')
  let currentSection = ''
  for (const match of matches) {
    if (match.sectionTitle !== currentSection) {
      currentSection = match.sectionTitle
      console.log(`\n  ${currentSection}`)
    }
    const typeTag = match.videoType === 'solution' ? ' [solution]' : ''
    console.log(
      `    ${match.lessonTitle}${typeTag}\n      -> ${match.dropboxFileName}\n      -> videoResource: ${match.videoResourceId}`,
    )
  }

  console.log(`\n\nTotal matches: ${matches.length} / ${totalVideos} videos`)

  if (matches.length !== totalVideos) {
    console.warn(
      `\nWARNING: ${totalVideos - matches.length} videos could not be matched!`,
    )
  }

  // Check for errors
  const errors = matches.filter((m) =>
    m.dropboxUrl.startsWith('DROPBOX_LINK_ERROR'),
  )
  if (errors.length > 0) {
    console.error(`\n${errors.length} Dropbox links failed:`)
    for (const err of errors) {
      console.error(`  - ${err.dropboxFileName}`)
    }
  }

  if (DRY_RUN) {
    console.log('\n=== DRY RUN - No changes made ===')
    console.log('Set DRY_RUN = false in the script to execute\n')
    return
  }

  // Step 5: Execute replacements
  console.log('\n=== Executing Replacements ===\n')

  const inngest = new Inngest({
    id:
      process.env.INNGEST_APP_NAME ||
      process.env.NEXT_PUBLIC_SITE_TITLE ||
      'epic-web',
  })

  let successCount = 0
  let failCount = 0

  for (const match of matches) {
    if (match.dropboxUrl.startsWith('DROPBOX_LINK_ERROR')) {
      console.error(`Skipping ${match.lessonTitle} — no valid Dropbox URL`)
      failCount++
      continue
    }

    try {
      // Patch Sanity videoResource
      console.log(`Patching: ${match.lessonTitle} (${match.videoResourceId})`)
      await patchVideoResource(match.videoResourceId, match.dropboxUrl)

      // Send Inngest event to trigger processing pipeline
      const result = await inngest.send({
        name: VIDEO_RESOURCE_CREATED_EVENT,
        data: {
          videoResourceId: match.videoResourceId,
          originalMediaUrl: match.dropboxUrl,
        },
      })

      console.log(`  -> Inngest event: ${result.ids[0]}`)
      successCount++

      // Small delay to avoid overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`  -> FAILED: ${error}`)
      failCount++
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`  Succeeded: ${successCount}`)
  console.log(`  Failed: ${failCount}`)
  console.log(`\nCheck Inngest dashboard: http://localhost:8288`)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
