/**
 * Script to trigger workshop migration
 *
 * Usage:
 *   cd apps/epic-web
 *   pnpm tsx src/scripts/trigger-workshop-migration.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import {config} from 'dotenv'
import {Inngest} from 'inngest'

// Load environment variables from .env
config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

// Your Sanity workshop _id
const WORKSHOP_ID = 'c5d9c868-756e-4d57-bcb9-652cb198aadf'

const WORKSHOP_MIGRATION_EVENT = 'sanity/workshop-migration'

async function main() {
  // Read the migration data from JSON file
  const jsonPath = path.join(__dirname, '../lib/deepgram/workshop.json')

  if (!fs.existsSync(jsonPath)) {
    console.error('❌ workshop.json not found at:', jsonPath)
    process.exit(1)
  }

  const migrationData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  console.log('🚀 Triggering workshop migration...')
  console.log(`   Workshop ID: ${WORKSHOP_ID}`)
  console.log(`   Sections: ${Object.keys(migrationData).length}`)

  // Count total items
  let totalItems = 0
  for (const section of Object.values(migrationData)) {
    for (const subsection of Object.values(
      section as Record<string, unknown[]>,
    )) {
      if (Array.isArray(subsection)) {
        totalItems += subsection.length
      }
    }
  }
  console.log(`   Total items: ${totalItems}`)

  // Create Inngest client
  const inngest = new Inngest({
    id:
      process.env.INNGEST_APP_NAME ||
      process.env.NEXT_PUBLIC_SITE_TITLE ||
      'epic-web',
  })

  try {
    const result = await inngest.send({
      name: WORKSHOP_MIGRATION_EVENT,
      data: {
        workshopId: WORKSHOP_ID,
        migrationData,
      },
    })

    console.log('')
    console.log('✅ Migration event sent!')
    console.log('   Event IDs:', result.ids)
    console.log('')
    console.log('📊 Check progress at: http://localhost:8288')
  } catch (error) {
    console.error('❌ Failed to send migration event:', error)
    process.exit(1)
  }
}

main()
