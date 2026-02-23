#!/usr/bin/env node
/**
 * Script: Number lesson titles with section.lesson prefix
 *
 * Usage:
 *   node apps/epic-web/scripts/number-lesson-titles.mjs <workshop-slug>           # dry run
 *   node apps/epic-web/scripts/number-lesson-titles.mjs <workshop-slug> --apply   # actually update
 *
 * Examples:
 *   node apps/epic-web/scripts/number-lesson-titles.mjs type-safety
 *   node apps/epic-web/scripts/number-lesson-titles.mjs type-safety --apply
 *
 * This will prepend "{sectionIndex}.{lessonIndex} " to each lesson title
 * and update the slug accordingly.
 *
 * Requires SANITY_API_TOKEN env var for --apply mode.
 */

import {readFileSync} from 'fs'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

// Load SANITY_API_TOKEN from .env.local if not already set
const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.+)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
} catch {}

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
  if (!res.ok) throw new Error(`Sanity query error: ${res.status}`)
  return (await res.json()).result
}

async function sanityMutate(mutations) {
  const token = process.env.SANITY_API_TOKEN
  if (!token) {
    throw new Error(
      'SANITY_API_TOKEN env var is required for --apply mode.\n' +
        'You can create one at: https://www.sanity.io/manage/project/i1a93n76/api#tokens',
    )
  }

  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({mutations}),
    },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sanity mutation error: ${res.status} - ${text}`)
  }

  return res.json()
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const slug = process.argv[2]
  const apply = process.argv.includes('--apply')

  if (!slug) {
    console.log(
      'Usage: node apps/epic-web/scripts/number-lesson-titles.mjs <workshop-slug> [--apply]',
    )
    process.exit(1)
  }

  // Fetch workshop structure
  const workshop = await sanityFetch(
    `*[_type == "module" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      "sections": resources[@->._type == 'section']->{
        _id,
        title,
        "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson', 'interview']]->{
          _id,
          _type,
          title,
          "slug": slug.current
        }
      }
    }`,
    {slug},
  )

  if (!workshop) {
    console.error(`Workshop not found: "${slug}"`)
    process.exit(1)
  }

  console.log(`Workshop: ${workshop.title} (${workshop.slug})`)
  console.log(`Mode: ${apply ? 'APPLY (will update Sanity!)' : 'DRY RUN (preview only)'}`)
  console.log(`${'='.repeat(70)}\n`)

  const changes = []

  for (let si = 0; si < (workshop.sections || []).length; si++) {
    const section = workshop.sections[si]
    console.log(`Section ${si}: ${section.title}`)

    for (let li = 0; li < (section.lessons || []).length; li++) {
      const lesson = section.lessons[li]
      const prefix = `${si}.${li + 1}`

      // Check if title already has a number prefix (avoid double-numbering)
      const alreadyNumbered = /^\d+\.\d+\s/.test(lesson.title)
      if (alreadyNumbered) {
        console.log(`  ${prefix}  "${lesson.title}" — already numbered, skipping`)
        continue
      }

      const newTitle = `${prefix} ${lesson.title}`
      const newSlug = toSlug(newTitle)

      console.log(`  ${lesson.slug}`)
      console.log(`    title: "${lesson.title}" → "${newTitle}"`)
      console.log(`    slug:  "${lesson.slug}" → "${newSlug}"`)

      changes.push({
        id: lesson._id,
        oldTitle: lesson.title,
        newTitle,
        oldSlug: lesson.slug,
        newSlug,
      })
    }
    console.log()
  }

  console.log(`${'='.repeat(70)}`)
  console.log(`Total changes: ${changes.length}`)

  if (changes.length === 0) {
    console.log('Nothing to update!')
    return
  }

  if (!apply) {
    console.log(
      '\nThis was a DRY RUN. To apply changes, run again with --apply:',
    )
    console.log(
      `  SANITY_API_TOKEN=<your-token> node apps/epic-web/scripts/number-lesson-titles.mjs ${slug} --apply`,
    )
    return
  }

  // Build mutations
  const mutations = changes.map((c) => ({
    patch: {
      id: c.id,
      set: {
        title: c.newTitle,
        'slug.current': c.newSlug,
      },
    },
  }))

  console.log(`\nApplying ${mutations.length} mutations...`)
  const result = await sanityMutate(mutations)
  console.log('Done!', JSON.stringify(result, null, 2))
}

main().catch(console.error)
