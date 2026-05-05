/**
 * Pure filename parser for the new flat Dropbox layout.
 *
 * No Dropbox SDK calls — operates only on `FlatEntry[]` produced upstream
 * (e.g., by `listAllFilesFlat` in ./client). Filenames follow these rules
 * (case-insensitive extension, allowed: .mp4 .mov .webm .mkv):
 *
 *   00-<rest>.<ext>                              → intro-workshop
 *   99-<rest>.<ext>                              → outro-workshop
 *   <SS>-<II>-<kindKeyword>-<rest>.<ext>         → sectioned item
 *
 * Where SS is the 2-digit section position, II is the 2-digit item position,
 * and kindKeyword normalizes to: intro → section-intro, problem/solution
 * (paired into exercise), lesson | explainer → that kind, anything else
 * (break, outro, etc.) → lesson + warning.
 */

export type FlatEntry = {
  name: string
  path: string
  url?: string
}

export type FlatItem =
  | {kind: 'intro-workshop'; title: string; entry: FlatEntry}
  | {kind: 'outro-workshop'; title: string; entry: FlatEntry}
  | {
      kind: 'section-intro'
      sectionPos: number
      itemPos: number
      title: string
      /**
       * True when the source filename carried a descriptive name after
       * the `intro` keyword (e.g. `02-00-intro-fetching.mp4`). Drives the
       * section-title fallback: descriptive → use it, otherwise
       * `Section {N}`.
       */
      hasDescriptiveName: boolean
      entry: FlatEntry
    }
  | {
      kind: 'lesson' | 'explainer'
      sectionPos: number
      itemPos: number
      title: string
      entry: FlatEntry
    }
  | {
      kind: 'exercise'
      sectionPos: number
      itemPos: number
      title: string
      problem: FlatEntry
      solution?: FlatEntry
    }

export type ParsedFlatWorkshop = {
  introItems: FlatItem[]
  sections: {position: number; title: string; items: FlatItem[]}[]
  outroItems: FlatItem[]
  warnings: string[]
}

const VIDEO_EXT_RE = /\.(mp4|mov|webm|mkv)$/i

// 00-<rest>.<ext> (workshop intro)
const INTRO_WORKSHOP_RE = /^00-(.+)\.(mp4|mov|webm|mkv)$/i

// 99-<rest>.<ext> (workshop outro)
const OUTRO_WORKSHOP_RE = /^99-(.+)\.(mp4|mov|webm|mkv)$/i

// <SS>-<II>-<kindKeyword>[-<rest>].<ext>
// kindKeyword is a single word ([A-Za-z]+); the trailing `-<rest>` is OPTIONAL
// — many real workshops just use `02-01-problem.mp4` with no descriptive name.
// rest can contain hyphens.
// We deliberately DON'T match 00 or 99 as the section prefix here; those are
// handled by the intro/outro patterns above.
const SECTIONED_RE =
  /^(\d{2})-(\d{2})-([A-Za-z]+)(?:-(.+))?\.(mp4|mov|webm|mkv)$/i

/**
 * Title cleaning: strip extension, replace `_` and `-` with spaces, collapse
 * whitespace, and Title Case each word. Mirrors the spirit of `extractTitle`
 * in `src/scripts/generate-workshop-json-from-dropbox.ts`.
 */
function cleanTitle(rest: string): string {
  const noExt = rest.replace(VIDEO_EXT_RE, '')
  const spaced = noExt.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!spaced) return ''
  return spaced
    .split(' ')
    .map((word) =>
      word.length === 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ')
}

type DeferredPair = {
  kind: 'problem' | 'solution'
  sectionPos: number
  itemPos: number
  title: string
  entry: FlatEntry
}

type Classified =
  | {bucket: 'intro'; item: FlatItem}
  | {bucket: 'outro'; item: FlatItem}
  | {bucket: 'section'; item: FlatItem}
  | {bucket: 'pair'; pair: DeferredPair}
  | {bucket: 'skip'}

function classify(
  entry: FlatEntry,
  opts: {workshopName?: string} | undefined,
  warnings: string[],
): Classified {
  const name = entry.name

  // Workshop intro
  const introMatch = INTRO_WORKSHOP_RE.exec(name)
  if (introMatch) {
    const cleaned = cleanTitle(introMatch[1])
    // Choice: when workshopName is provided, prefix with "Introduction to {workshopName}"
    // for nicer output; otherwise use the cleaned filename as the title.
    const title = opts?.workshopName
      ? `Introduction to ${opts.workshopName}`
      : cleaned
    return {
      bucket: 'intro',
      item: {kind: 'intro-workshop', title, entry},
    }
  }

  // Workshop outro
  const outroMatch = OUTRO_WORKSHOP_RE.exec(name)
  if (outroMatch) {
    const cleaned = cleanTitle(outroMatch[1])
    const title = opts?.workshopName ? `Outro to ${opts.workshopName}` : cleaned
    return {
      bucket: 'outro',
      item: {kind: 'outro-workshop', title, entry},
    }
  }

  // Sectioned item
  const sectionedMatch = SECTIONED_RE.exec(name)
  if (sectionedMatch) {
    const sectionPos = parseInt(sectionedMatch[1], 10)
    const itemPos = parseInt(sectionedMatch[2], 10)
    const kindKeyword = sectionedMatch[3].toLowerCase()
    const rest = sectionedMatch[4] // may be undefined when filename is `SS-NN-<kind>.<ext>`
    const ii = String(itemPos).padStart(2, '0')
    // Fallback titles when no descriptive name is encoded in the filename.
    // These are deterministic and fine-grained enough to distinguish items;
    // editors can rename in Sanity Studio later.
    const fallbackByKind: Record<string, string> = {
      intro: 'Intro',
      lesson: `Lesson ${ii}`,
      explainer: `Explainer ${ii}`,
      problem: `Exercise ${ii}`,
      solution: `Exercise ${ii}`,
    }
    const title = rest
      ? cleanTitle(rest)
      : fallbackByKind[kindKeyword] ?? `Item ${ii}`
    const hasDescriptiveName = Boolean(rest)

    switch (kindKeyword) {
      case 'intro':
        return {
          bucket: 'section',
          item: {
            kind: 'section-intro',
            sectionPos,
            itemPos,
            title,
            hasDescriptiveName,
            entry,
          },
        }
      case 'lesson':
        return {
          bucket: 'section',
          item: {
            kind: 'lesson',
            sectionPos,
            itemPos,
            title,
            entry,
          },
        }
      case 'explainer':
        return {
          bucket: 'section',
          item: {
            kind: 'explainer',
            sectionPos,
            itemPos,
            title,
            entry,
          },
        }
      case 'problem':
        return {
          bucket: 'pair',
          pair: {kind: 'problem', sectionPos, itemPos, title, entry},
        }
      case 'solution':
        return {
          bucket: 'pair',
          pair: {kind: 'solution', sectionPos, itemPos, title, entry},
        }
      default: {
        warnings.push(
          `unknown kind '${kindKeyword}' for file '${name}', defaulted to lesson`,
        )
        return {
          bucket: 'section',
          item: {
            kind: 'lesson',
            sectionPos,
            itemPos,
            title,
            entry,
          },
        }
      }
    }
  }

  warnings.push(`unrecognized filename: ${name}`)
  return {bucket: 'skip'}
}

export function parseFlatLayout(
  entries: FlatEntry[],
  opts?: {workshopName?: string},
): ParsedFlatWorkshop {
  const warnings: string[] = []
  const introItems: FlatItem[] = []
  const outroItems: FlatItem[] = []

  // Sectioned, non-pair items keyed by sectionPos.
  const sectionItems = new Map<number, FlatItem[]>()

  // Deferred problem/solution pairs keyed by `${sectionPos}:${itemPos}`.
  const pairs = new Map<
    string,
    {problem?: DeferredPair; solution?: DeferredPair}
  >()

  for (const entry of entries) {
    const result = classify(entry, opts, warnings)
    switch (result.bucket) {
      case 'intro':
        introItems.push(result.item)
        break
      case 'outro':
        outroItems.push(result.item)
        break
      case 'section': {
        // Bucket by sectionPos.
        if (
          result.item.kind === 'section-intro' ||
          result.item.kind === 'lesson' ||
          result.item.kind === 'explainer'
        ) {
          const sp = result.item.sectionPos
          const arr = sectionItems.get(sp) ?? []
          arr.push(result.item)
          sectionItems.set(sp, arr)
        }
        break
      }
      case 'pair': {
        const key = `${result.pair.sectionPos}:${result.pair.itemPos}`
        const existing = pairs.get(key) ?? {}
        existing[result.pair.kind] = result.pair
        pairs.set(key, existing)
        break
      }
      case 'skip':
        break
    }
  }

  // Resolve pairs into exercise items (or fall back with warnings).
  // Use Array.from to avoid needing --downlevelIteration in tsconfig.
  for (const [, pair] of Array.from(pairs.entries())) {
    if (pair.problem && pair.solution) {
      const sp = pair.problem.sectionPos
      const arr = sectionItems.get(sp) ?? []
      arr.push({
        kind: 'exercise',
        sectionPos: pair.problem.sectionPos,
        itemPos: pair.problem.itemPos,
        title: pair.problem.title,
        problem: pair.problem.entry,
        solution: pair.solution.entry,
      })
      sectionItems.set(sp, arr)
    } else if (pair.problem && !pair.solution) {
      warnings.push(
        `problem without matching solution: ${pair.problem.entry.name}`,
      )
      const sp = pair.problem.sectionPos
      const arr = sectionItems.get(sp) ?? []
      arr.push({
        kind: 'exercise',
        sectionPos: pair.problem.sectionPos,
        itemPos: pair.problem.itemPos,
        title: pair.problem.title,
        problem: pair.problem.entry,
        solution: undefined,
      })
      sectionItems.set(sp, arr)
    } else if (pair.solution && !pair.problem) {
      warnings.push(
        `solution without matching problem: ${pair.solution.entry.name}`,
      )
      const sp = pair.solution.sectionPos
      const arr = sectionItems.get(sp) ?? []
      arr.push({
        kind: 'lesson',
        sectionPos: pair.solution.sectionPos,
        itemPos: pair.solution.itemPos,
        title: pair.solution.title,
        entry: pair.solution.entry,
      })
      sectionItems.set(sp, arr)
    }
  }

  // Build sections, sort items by itemPos, and compute section titles.
  const sections: ParsedFlatWorkshop['sections'] = []
  for (const [position, items] of Array.from(sectionItems.entries())) {
    // Sort items within the section by itemPos ascending. Workshop
    // intro/outro items don't carry itemPos and never land here.
    items.sort((a: FlatItem, b: FlatItem) => {
      const aPos = 'itemPos' in a ? a.itemPos : 0
      const bPos = 'itemPos' in b ? b.itemPos : 0
      return aPos - bPos
    })

    const sectionIntro = items.find(
      (it: FlatItem) => it.kind === 'section-intro',
    )
    const title =
      sectionIntro &&
      sectionIntro.kind === 'section-intro' &&
      sectionIntro.hasDescriptiveName &&
      sectionIntro.title
        ? sectionIntro.title
        : `Section ${position}`

    sections.push({position, title, items})
  }

  // Sort sections by sectionPos ascending.
  sections.sort((a, b) => a.position - b.position)

  return {introItems, sections, outroItems, warnings}
}
