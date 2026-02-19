/**
 * Generate Workshop Migration JSON from Dropbox Folder Structure
 *
 * Reads Dropbox folder and generates the JSON needed for AWS migration.
 *
 * Usage:
 *   cd apps/epic-web
 *   pnpm tsx src/scripts/generate-workshop-json-from-dropbox.ts
 *
 * EXPECTED FOLDER STRUCTURE:
 *   /Workshop Folder/
 *     ├── 00-intro.mp4                    → "Introduction to {Workshop}" section
 *     ├── 99-outro.mp4                    → "Outro to {Workshop}" section
 *     ├── 01 - Section Name/
 *     │   ├── 00.intro.mp4               → "Intro to Section Name"
 *     │   ├── 01.problem.hello-world.mp4 → Exercise (problem)
 *     │   ├── 01.solution.hello-world.mp4 → Solution for #01
 *     │   ├── 02-lesson-title.mp4        → Regular lesson
 *     │   └── 99.break.mp4               → Break lesson
 *     └── 02 - Another Section/
 */

import * as fs from 'fs'
import * as path from 'path'
import {config} from 'dotenv'
import {Dropbox} from 'dropbox'

// Load environment variables
config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

// ============================================
// CONFIGURE THIS:
// ============================================

// Dropbox folder path (relative to team namespace, e.g., "/02 areas/Epic Web/Workshop Name")
const DROPBOX_FOLDER_PATH =
  '/02 areas/Epic Web/Epic TypeScript/05-advanced-typescript'

// Output JSON file
const OUTPUT_FILE = path.join(__dirname, '../lib/deepgram/workshop-aws.json')

// Set to true to just preview without writing
const DRY_RUN = false

// ============================================

interface VideoFile {
  name: string
  path: string
  position: number
  type: 'problem' | 'solution' | 'intro' | 'outro' | 'break' | 'lesson'
  title: string
  awsUrl: string
}

interface Section {
  name: string
  position: number
  videos: VideoFile[]
}

// Initialize Dropbox client
function getDropboxClient(): Dropbox {
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('DROPBOX_ACCESS_TOKEN environment variable is required')
  }

  const options: {accessToken: string; selectUser?: string; pathRoot?: string} =
    {accessToken}

  // For team accounts
  if (process.env.DROPBOX_TEAM_MEMBER_ID) {
    options.selectUser = process.env.DROPBOX_TEAM_MEMBER_ID
  }

  // Use team namespace if available
  if (process.env.DROPBOX_TEAM_NAMESPACE_ID) {
    options.pathRoot = JSON.stringify({
      '.tag': 'namespace_id',
      namespace_id: process.env.DROPBOX_TEAM_NAMESPACE_ID,
    })
  }

  return new Dropbox(options)
}

// Extract position number from filename (e.g., "01-intro.mp4" → 1)
function extractPosition(filename: string): number {
  const match = filename.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 999
}

// Detect video type from filename
function detectVideoType(filename: string): VideoFile['type'] {
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

// Extract clean title from filename
function extractTitle(filename: string, type: VideoFile['type']): string {
  // Remove extension
  let name = filename.replace(/\.(mp4|mov|webm|mkv)$/i, '')

  // Remove position prefix (01-, 01., 01_, 01 )
  name = name.replace(/^\d+[\.\-_\s]+/, '')

  // Remove type indicators
  name = name.replace(/[.\-_\s]*(problem|solution)[.\-_\s]*/gi, '')

  // Replace separators with spaces
  name = name.replace(/[\.\-_]+/g, ' ')

  // Title case
  name = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()

  return name || filename
}

// Extract section name from folder name
function extractSectionName(folderName: string): string {
  // Remove number prefix (e.g., "01 - Section Name" → "Section Name")
  let name = folderName.replace(/^\d+[\s\-_]*/, '')

  // Title case
  name = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()

  return name
}

// Convert Dropbox shared link to direct download URL for Mux
function toDirectDownloadUrl(sharedLink: string): string {
  // Dropbox shared links have ?dl=0 or no dl param
  // Change to ?dl=1 for direct download (required for Mux)
  const url = new URL(sharedLink)

  // Set dl=1 to get direct download instead of web preview
  url.searchParams.set('dl', '1')

  return url.toString()
}

// Get or create shared link for Dropbox file (works with Mux)
async function getSharedLink(dbx: Dropbox, filePath: string): Promise<string> {
  try {
    // First check for existing shared links
    const existing = await dbx.sharingListSharedLinks({
      path: filePath,
      direct_only: true,
    })
    if (existing.result.links.length > 0) {
      console.log(`   ✓ Found existing link for: ${filePath.split('/').pop()}`)
      return toDirectDownloadUrl(existing.result.links[0].url)
    }

    // No existing link - create a new one
    console.log(`   Creating shared link for: ${filePath.split('/').pop()}`)
    const created = await dbx.sharingCreateSharedLinkWithSettings({
      path: filePath,
      settings: {
        requested_visibility: {'.tag': 'public'},
        audience: {'.tag': 'public'},
        access: {'.tag': 'viewer'},
      },
    })

    return toDirectDownloadUrl(created.result.url)
  } catch (error: unknown) {
    // Handle case where link already exists (race condition or different API response)
    if (error && typeof error === 'object' && 'error' in error) {
      const dropboxError = error as {
        error?: {
          error_summary?: string
          shared_link_already_exists?: {metadata?: {url?: string}}
        }
      }
      if (
        dropboxError.error?.error_summary?.includes(
          'shared_link_already_exists',
        )
      ) {
        // Link exists, fetch it
        const metadata = dropboxError.error.shared_link_already_exists?.metadata
        if (metadata?.url) {
          return toDirectDownloadUrl(metadata.url)
        }
        // Fallback: re-fetch the link
        const existing = await dbx.sharingListSharedLinks({
          path: filePath,
          direct_only: true,
        })
        if (existing.result.links.length > 0) {
          return toDirectDownloadUrl(existing.result.links[0].url)
        }
      }
    }
    console.error(
      `   ✗ Failed to get/create shared link for ${filePath}:`,
      error,
    )
    return `DROPBOX_LINK_ERROR:${filePath}`
  }
}

// Generate exercise code path
function generateCodePath(
  sectionPosition: number,
  lessonPosition: number,
): string {
  const paddedSection = String(sectionPosition).padStart(2, '0')
  const paddedLesson = String(lessonPosition).padStart(2, '0')
  return `/${paddedSection}/${paddedLesson}/problem`
}

async function main() {
  if (DROPBOX_FOLDER_PATH === '/YOUR/DROPBOX/FOLDER/PATH') {
    console.error('❌ Please update DROPBOX_FOLDER_PATH in this script first!')
    process.exit(1)
  }

  console.log('📂 Scanning Dropbox folder:', DROPBOX_FOLDER_PATH)
  console.log('')

  const dbx = getDropboxClient()

  // Get workshop name from folder path
  const workshopName = DROPBOX_FOLDER_PATH.split('/').pop() || 'Workshop'
  console.log(`📚 Workshop: ${workshopName}`)
  console.log('')

  // List contents of the main folder
  const rootContents = await dbx.filesListFolder({path: DROPBOX_FOLDER_PATH})

  const sections: Section[] = []
  const rootVideos: VideoFile[] = []

  // Separate folders (sections) from files (root videos)
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
        awsUrl: '', // Will be filled later
      })
    }
  }

  // Sort sections by position
  sections.sort((a, b) => a.position - b.position)

  // Get videos for each section
  for (const section of sections) {
    const sectionPath = `${DROPBOX_FOLDER_PATH}/${section.position
      .toString()
      .padStart(2, '0')} - ${section.name}`

    // Try different path formats
    let sectionContents
    try {
      sectionContents = await dbx.filesListFolder({path: sectionPath})
    } catch {
      // Try finding the actual folder
      const matchingEntry = rootContents.result.entries.find(
        (e) =>
          e['.tag'] === 'folder' && extractSectionName(e.name) === section.name,
      )
      if (matchingEntry && matchingEntry.path_lower) {
        sectionContents = await dbx.filesListFolder({
          path: matchingEntry.path_lower,
        })
      } else {
        console.warn(`⚠️  Could not find folder for section: ${section.name}`)
        continue
      }
    }

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
          awsUrl: '', // Will be filled later
        })
      }
    }

    // Sort videos by position
    section.videos.sort((a, b) => a.position - b.position)
  }

  // Sort root videos
  rootVideos.sort((a, b) => a.position - b.position)

  // Now get shared links for all videos (permanent, works with Mux)
  console.log('🔗 Getting shared Dropbox links...')

  for (const video of rootVideos) {
    video.awsUrl = await getSharedLink(dbx, video.path)
  }

  for (const section of sections) {
    for (const video of section.videos) {
      video.awsUrl = await getSharedLink(dbx, video.path)
    }
  }

  // Build the output JSON
  const output: Record<string, unknown[]> = {}

  // Add intro section if there's a root intro video
  const introVideo = rootVideos.find((v) => v.type === 'intro')
  if (introVideo) {
    output[`Introduction to ${workshopName}`] = [
      {
        type: 'lesson',
        title: `Intro to ${workshopName}`,
        awsUrl: introVideo.awsUrl,
        code: null,
      },
    ]
  }

  // Add each section
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex]
    const sectionPosition = sectionIndex + 1
    const items: unknown[] = []

    // Group problems and solutions
    const problems = section.videos.filter((v) => v.type === 'problem')
    const solutions = section.videos.filter((v) => v.type === 'solution')
    const others = section.videos.filter(
      (v) => !['problem', 'solution'].includes(v.type),
    )

    // Add intro if exists
    const sectionIntro = others.find((v) => v.type === 'intro')
    if (sectionIntro) {
      items.push({
        type: 'lesson',
        title: `Intro to ${section.name}`,
        awsUrl: sectionIntro.awsUrl,
        code: null,
      })
    }

    // Add problems with solutions
    for (const problem of problems) {
      const matchingSolution = solutions.find(
        (s) => s.position === problem.position,
      )
      const lessonPosition = problem.position

      const exerciseItem: Record<string, unknown> = {
        type: 'exercise',
        title: problem.title,
        awsUrl: problem.awsUrl,
        code: generateCodePath(sectionPosition, lessonPosition),
      }

      if (matchingSolution) {
        exerciseItem.solution = {
          title: `${problem.title} (Solution)`,
          awsUrl: matchingSolution.awsUrl,
          code: generateCodePath(sectionPosition, lessonPosition).replace(
            '/problem',
            '/solution',
          ),
        }
      }

      items.push(exerciseItem)
    }

    // Add other lessons (excluding intro, break)
    const regularLessons = others.filter(
      (v) => !['intro', 'break'].includes(v.type),
    )
    for (const lesson of regularLessons) {
      items.push({
        type: 'lesson',
        title: lesson.title,
        awsUrl: lesson.awsUrl,
        code: null,
      })
    }

    // Add break at the end if exists
    const breakVideo = others.find((v) => v.type === 'break')
    if (breakVideo) {
      items.push({
        type: 'lesson',
        title: 'Break',
        awsUrl: breakVideo.awsUrl,
        code: null,
      })
    }

    if (items.length > 0) {
      output[section.name] = items
    }
  }

  // Add outro section if there's a root outro video
  const outroVideo = rootVideos.find((v) => v.type === 'outro')
  if (outroVideo) {
    output[`Outro to ${workshopName}`] = [
      {
        type: 'lesson',
        title: `Outro to ${workshopName}`,
        awsUrl: outroVideo.awsUrl,
        code: null,
      },
    ]
  }

  // Output summary
  console.log('')
  console.log('📊 Summary:')
  console.log(`   Sections: ${Object.keys(output).length}`)
  let totalItems = 0
  for (const items of Object.values(output)) {
    totalItems += items.length
  }
  console.log(`   Total items: ${totalItems}`)
  console.log('')

  // Print structure
  console.log('📋 Structure:')
  for (const [sectionName, items] of Object.entries(output)) {
    console.log(`   ${sectionName}:`)
    for (const item of items as Array<{type: string; title: string}>) {
      console.log(`      - [${item.type}] ${item.title}`)
    }
  }
  console.log('')

  if (DRY_RUN) {
    console.log('🔍 DRY RUN - not writing file')
    console.log('')
    console.log('Set DRY_RUN = false to write the output file')
  } else {
    // Write the JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
    console.log(`✅ Written to: ${OUTPUT_FILE}`)
  }
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
