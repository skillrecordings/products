/**
 * Script to trigger workshop migration from AWS URLs
 *
 * Sends ONE EVENT PER SECTION to avoid the 1MB limit.
 *
 * This creates videos with originalMediaUrl which triggers:
 * 1. Mux upload
 * 2. Deepgram transcription
 *
 * Usage:
 *   cd apps/epic-web
 *   pnpm tsx src/scripts/trigger-aws-migration.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import {config} from 'dotenv'
import {Inngest} from 'inngest'

// Load environment variables
config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

// ============================================
// CONFIGURE THESE:
// ============================================

// Your Sanity workshop _id
const WORKSHOP_ID = 'c5d9c868-756e-4d57-bcb9-652cb198aadf'

// Path to your JSON file
const JSON_FILE = path.join(__dirname, '../lib/deepgram/workshop-aws.json')

// ============================================

const WORKSHOP_AWS_SECTION_EVENT = 'sanity/workshop-aws-section'

async function main() {
  if (!WORKSHOP_ID) {
    console.error('❌ Please set WORKSHOP_ID in this script first!')
    process.exit(1)
  }

  if (!fs.existsSync(JSON_FILE)) {
    console.error('❌ JSON file not found at:', JSON_FILE)
    console.error('')
    console.error('Create a file with this format:')
    console.error(`{
  "Section Name": [
    {
      "type": "lesson",
      "title": "Intro",
      "awsUrl": "https://s3.amazonaws.com/.../video.mp4",
      "code": null
    },
    {
      "type": "exercise",
      "title": "Do Something",
      "awsUrl": "https://s3.amazonaws.com/.../exercise.mp4",
      "code": "/01/02/problem",
      "solution": {
        "title": "Do Something (Solution)",
        "awsUrl": "https://s3.amazonaws.com/.../solution.mp4",
        "code": "/01/02/solution"
      }
    }
  ]
}`)
    process.exit(1)
  }

  const migrationData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'))
  const sections = Object.entries(migrationData)

  console.log('🚀 Triggering AWS workshop migration...')
  console.log(`   Workshop ID: ${WORKSHOP_ID}`)
  console.log(`   Sections: ${sections.length}`)
  console.log('')

  // Count total items
  let totalItems = 0
  for (const [, items] of sections) {
    if (Array.isArray(items)) {
      totalItems += items.length
    }
  }
  console.log(`   Total items: ${totalItems}`)
  console.log('')
  console.log('⚠️  Sending one event per section to avoid 1MB limit')
  console.log('⚠️  Videos will trigger Mux/Deepgram processing')
  console.log('')

  const inngest = new Inngest({
    id:
      process.env.INNGEST_APP_NAME ||
      process.env.NEXT_PUBLIC_SITE_TITLE ||
      'epic-web',
  })

  // Send one event per section
  for (const [sectionName, sectionItems] of sections) {
    try {
      console.log(
        `📤 Sending section: ${sectionName} (${
          (sectionItems as unknown[]).length
        } items)`,
      )

      const result = await inngest.send({
        name: WORKSHOP_AWS_SECTION_EVENT,
        data: {
          workshopId: WORKSHOP_ID,
          sectionName,
          sectionItems,
        },
      })

      console.log(`   ✅ Event ID: ${result.ids[0]}`)
    } catch (error) {
      console.error(`   ❌ Failed to send section ${sectionName}:`, error)
    }
  }

  console.log('')
  console.log('✅ All section events sent!')
  console.log('')
  console.log('📊 Check progress at: http://localhost:8288')
  console.log('')
  console.log(
    'Note: Each video will trigger a separate Mux/Deepgram processing job',
  )
}

main()
