/**
 * Script to trigger a flat-layout Dropbox -> Sanity workshop migration.
 *
 * Sends ONE `sanity/workshop-flat-migration` Inngest event whose payload
 * conforms to WorkshopFlatMigrationDataSchema (defaults applied via Zod).
 *
 * Usage:
 *   cd apps/epic-web
 *   pnpm tsx src/scripts/trigger-flat-workshop-migration.ts \
 *     --workshop-id <sanity-id> \
 *     (--dropbox-path "/path/to/folder" | --dropbox-url "https://www.dropbox.com/scl/fo/...") \
 *     [--workshop-name "Foo Workshop"] \
 *     [--code-prefix "/foo-workshop"]
 */

import * as path from 'path'
import {parseArgs} from 'node:util'
import {config} from 'dotenv'
import {Inngest} from 'inngest'

import {
  WORKSHOP_FLAT_MIGRATION_EVENT,
  WorkshopFlatMigrationDataSchema,
} from '../inngest/functions/sanity/workshop-migration/workshop-flat-migration-events'

// Load environment variables from .env / .env.local
config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

const USAGE = `Usage:
  pnpm tsx src/scripts/trigger-flat-workshop-migration.ts \\
    --workshop-id <sanity-id> \\
    (--dropbox-path "/path/to/folder" | --dropbox-url "https://www.dropbox.com/scl/fo/...") \\
    [--workshop-name "Foo Workshop"] \\
    [--code-prefix "/foo-workshop"]

Provide exactly ONE of --dropbox-path (a path in your namespace) or
--dropbox-url (a shared-folder URL of the form
https://www.dropbox.com/scl/fo/...?rlkey=...).
`

function printUsageAndExit(message?: string): never {
  if (message) {
    console.error(`❌ ${message}`)
    console.error('')
  }
  console.error(USAGE)
  process.exit(1)
}

async function main() {
  let parsed
  try {
    parsed = parseArgs({
      options: {
        'workshop-id': {type: 'string'},
        'dropbox-path': {type: 'string'},
        'dropbox-url': {type: 'string'},
        'workshop-name': {type: 'string'},
        'code-prefix': {type: 'string'},
      },
      strict: true,
      allowPositionals: false,
    })
  } catch (err) {
    printUsageAndExit(
      err instanceof Error ? err.message : 'Failed to parse arguments',
    )
  }

  const {values} = parsed

  const workshopId = values['workshop-id']
  const dropboxFolderPath = values['dropbox-path']
  const dropboxFolderUrl = values['dropbox-url']

  if (!workshopId) printUsageAndExit('--workshop-id is required')
  if (!dropboxFolderPath && !dropboxFolderUrl) {
    printUsageAndExit('Provide either --dropbox-path or --dropbox-url')
  }
  if (dropboxFolderPath && dropboxFolderUrl) {
    printUsageAndExit(
      'Provide ONLY ONE of --dropbox-path or --dropbox-url, not both',
    )
  }

  const rawPayload: Record<string, unknown> = {
    workshopId,
    dropboxLayout: 'flat',
  }
  if (dropboxFolderPath) rawPayload.dropboxFolderPath = dropboxFolderPath
  if (dropboxFolderUrl) rawPayload.dropboxFolderUrl = dropboxFolderUrl

  if (values['workshop-name'] !== undefined) {
    rawPayload.workshopName = values['workshop-name']
  }
  if (values['code-prefix'] !== undefined) {
    rawPayload.codePathPrefix = values['code-prefix']
  }

  // Apply Zod defaults + fail-fast on shape errors.
  const validated = WorkshopFlatMigrationDataSchema.parse(rawPayload)

  console.log('🚀 Triggering flat-layout workshop migration...')
  console.log(`   Workshop ID:        ${validated.workshopId}`)
  if (validated.dropboxFolderPath) {
    console.log(`   Dropbox path:       ${validated.dropboxFolderPath}`)
  }
  if (validated.dropboxFolderUrl) {
    console.log(`   Dropbox URL:        ${validated.dropboxFolderUrl}`)
  }
  console.log(`   Layout:             ${validated.dropboxLayout}`)
  if (validated.workshopName) {
    console.log(`   Workshop name:      ${validated.workshopName}`)
  }
  if (validated.codePathPrefix) {
    console.log(`   Code path prefix:   ${validated.codePathPrefix}`)
  }
  console.log('')

  const inngest = new Inngest({
    id:
      process.env.INNGEST_APP_NAME ||
      process.env.NEXT_PUBLIC_SITE_TITLE ||
      'epic-web',
  })

  try {
    const result = await inngest.send({
      name: WORKSHOP_FLAT_MIGRATION_EVENT,
      data: validated,
    })

    console.log('✅ Migration event sent!')
    console.log('   Event IDs:', result.ids)
    console.log('')
    console.log('📊 Check progress at: http://localhost:8288')
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to send migration event:', error)
    process.exit(1)
  }
}

main()
