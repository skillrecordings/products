#!/usr/bin/env node
/**
 * Revert: Strip number prefixes from lesson titles
 *
 * Usage:
 *   node apps/epic-web/scripts/strip-lesson-numbers.mjs <workshop-slug>           # dry run
 *   node apps/epic-web/scripts/strip-lesson-numbers.mjs <workshop-slug> --apply   # actually update
 */

import {readFileSync} from 'fs'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

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
  const url = new URL(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`)
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
  if (!token) throw new Error('SANITY_API_TOKEN required')
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
    body: JSON.stringify({mutations}),
  })
  if (!res.ok) throw new Error(`Sanity mutation error: ${res.status} - ${await res.text()}`)
  return res.json()
}

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  const slug = process.argv[2]
  const apply = process.argv.includes('--apply')
  if (!slug) { console.log('Usage: node strip-lesson-numbers.mjs <workshop-slug> [--apply]'); process.exit(1) }

  const workshop = await sanityFetch(
    `*[_type == "module" && slug.current == $slug][0]{
      title, "slug": slug.current,
      "sections": resources[@->._type == 'section']->{
        title,
        "lessons": resources[@->._type in ['exercise','explainer','lesson','interview']]->{
          _id, title, "slug": slug.current
        }
      }
    }`, {slug})

  if (!workshop) { console.error(`Not found: ${slug}`); process.exit(1) }

  console.log(`Workshop: ${workshop.title}`)
  console.log(`Mode: ${apply ? 'APPLY' : 'DRY RUN'}\n`)

  const changes = []
  for (const section of workshop.sections || []) {
    for (const lesson of section.lessons || []) {
      const match = lesson.title.match(/^\d+\.\d+\s+(.+)$/)
      if (!match) continue
      const newTitle = match[1]
      const newSlug = toSlug(newTitle)
      console.log(`  "${lesson.title}" → "${newTitle}" (slug: ${newSlug})`)
      changes.push({id: lesson._id, newTitle, newSlug})
    }
  }

  console.log(`\nTotal: ${changes.length} to revert`)
  if (!apply || changes.length === 0) {
    if (!apply) console.log('\nRun with --apply to execute.')
    return
  }

  const mutations = changes.map(c => ({patch: {id: c.id, set: {title: c.newTitle, 'slug.current': c.newSlug}}}))
  console.log('Applying...')
  const result = await sanityMutate(mutations)
  console.log(`Done! ${result.results.length} updated.`)
}

main().catch(console.error)
