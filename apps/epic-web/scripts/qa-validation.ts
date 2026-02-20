// HOW TO USE:
// sanity exec --with-user-token scripts/qa-validation.ts -- --product "Practical TypeScript: Foundations to Fluency"

import {getCliClient} from 'sanity/cli'
import groq from 'groq'
import * as fs from 'fs'
import * as path from 'path'

const client = getCliClient()

// --- Argument parsing ---
function getProductTitle(): string {
  const argv = process.argv
  const idx = argv.indexOf('--product')
  if (idx === -1 || !argv[idx + 1]) {
    console.error(
      'Error: --product argument is required.\n' +
        'Usage: sanity exec --with-user-token scripts/qa-validation.ts -- --product "<Product Title>"',
    )
    process.exit(1)
  }
  return argv[idx + 1]
}

// --- Types ---
type VideoResource = {
  _id: string
  title: string
  transcript?: {text?: string; srt?: string}
  generatedDescription?: string
} | null

type Solution = {
  _key: string
  _type: string
  title: string
  slug?: string
  videoResource: VideoResource
} | null

type Lesson = {
  _id: string
  _type: string
  title: string
  slug?: string
  videoResource: VideoResource
}

type Exercise = {
  _id: string
  _type: string
  title: string
  slug?: string
  videoResource: VideoResource
  solution: Solution
}

type Section = {
  _id: string
  title: string
  slug?: string
  lessons?: Lesson[]
  exercises?: Exercise[]
}

type Module = {
  _id: string
  title: string
  slug?: string
  moduleType?: string
  sections?: Section[]
}

type Product = {
  _id: string
  title: string
  slug?: string
  type?: string
  modules?: Module[]
}

type ParentRef = {
  _id: string
  title: string
  slug?: string
}

type ErrorEntry = {
  _id: string
  _type: string
  title: string
  slug?: string
  parentModule?: ParentRef
  parentSection?: ParentRef
  parentResource?: {
    _id: string
    _type: string
    title: string
    slug?: string
  }
  missingFields?: string[]
  error: string
}

// --- GROQ query ---
const productQuery = groq`
*[_type == "product" && title == $productTitle][0] {
  _id,
  title,
  "slug": slug.current,
  type,
  modules[]-> {
    _id,
    title,
    "slug": slug.current,
    moduleType,
    "sections": resources[@->._type == 'section']-> {
      _id,
      title,
      "slug": slug.current,
      "lessons": resources[@->._type in ['lesson', 'explainer']]-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        "videoResource": resources[@->._type == 'videoResource'][0]-> {
          _id,
          title,
          "transcript": transcript { text, srt },
          generatedDescription
        }
      },
      "exercises": resources[@->._type == 'exercise']-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        "videoResource": resources[@->._type == 'videoResource'][0]-> {
          _id,
          title,
          "transcript": transcript { text, srt },
          generatedDescription
        },
        "solution": resources[@._type == 'solution'][0] {
          _key,
          _type,
          title,
          "slug": slug.current,
          "videoResource": resources[@->._type == 'videoResource'][0]-> {
            _id,
            title,
            "transcript": transcript { text, srt },
            generatedDescription
          }
        }
      }
    }
  }
}
`

// --- Validation helpers ---
function isNonEmptyString(val: unknown): boolean {
  return typeof val === 'string' && val.trim().length > 0
}

function validateVideoResource(
  vr: VideoResource,
  parentResource: {_id: string; _type: string; title: string; slug?: string},
  parentModule: ParentRef | undefined,
  parentSection: ParentRef | undefined,
  errors: ErrorEntry[],
): void {
  if (!vr) return

  const missingFields: string[] = []
  if (!isNonEmptyString(vr.transcript?.text))
    missingFields.push('transcript.text')
  if (!isNonEmptyString(vr.transcript?.srt))
    missingFields.push('transcript.srt')
  if (!isNonEmptyString(vr.generatedDescription))
    missingFields.push('generatedDescription')

  if (missingFields.length > 0) {
    errors.push({
      _id: vr._id,
      _type: 'videoResource',
      title: vr.title ?? '(untitled)',
      parentModule,
      parentSection,
      parentResource,
      missingFields,
      error: `VideoResource is missing: ${missingFields.join(', ')}`,
    })
  }
}

function validateLesson(
  lesson: Lesson,
  parentModule: ParentRef,
  parentSection: ParentRef,
  errors: ErrorEntry[],
): void {
  const typeLabel = lesson._type === 'explainer' ? 'Explainer' : 'Lesson'

  if (!lesson.videoResource) {
    errors.push({
      _id: lesson._id,
      _type: lesson._type,
      title: lesson.title ?? '(untitled)',
      slug: lesson.slug,
      parentModule,
      parentSection,
      error: `${typeLabel} is missing a video resource`,
    })
  } else {
    validateVideoResource(
      lesson.videoResource,
      {
        _id: lesson._id,
        _type: lesson._type,
        title: lesson.title ?? '(untitled)',
        slug: lesson.slug,
      },
      parentModule,
      parentSection,
      errors,
    )
  }
}

function validateExercise(
  exercise: Exercise,
  parentModule: ParentRef,
  parentSection: ParentRef,
  errors: ErrorEntry[],
): void {
  if (!exercise.videoResource) {
    errors.push({
      _id: exercise._id,
      _type: exercise._type,
      title: exercise.title ?? '(untitled)',
      slug: exercise.slug,
      parentModule,
      parentSection,
      error: 'Exercise is missing a video resource',
    })
  } else {
    validateVideoResource(
      exercise.videoResource,
      {
        _id: exercise._id,
        _type: exercise._type,
        title: exercise.title ?? '(untitled)',
        slug: exercise.slug,
      },
      parentModule,
      parentSection,
      errors,
    )
  }

  if (!exercise.solution) {
    errors.push({
      _id: exercise._id,
      _type: exercise._type,
      title: exercise.title ?? '(untitled)',
      slug: exercise.slug,
      parentModule,
      parentSection,
      error: 'Exercise is missing a solution resource',
    })
  } else {
    const solution = exercise.solution
    if (!solution.videoResource) {
      errors.push({
        _id: solution._key,
        _type: 'solution',
        title: solution.title ?? '(untitled)',
        slug: solution.slug,
        parentModule,
        parentSection,
        parentResource: {
          _id: exercise._id,
          _type: exercise._type,
          title: exercise.title ?? '(untitled)',
          slug: exercise.slug,
        },
        error: 'Solution is missing a video resource',
      })
    } else {
      validateVideoResource(
        solution.videoResource,
        {
          _id: solution._key,
          _type: 'solution',
          title: solution.title ?? '(untitled)',
          slug: solution.slug,
        },
        parentModule,
        parentSection,
        errors,
      )
    }
  }
}

function validateSection(
  section: Section,
  parentModule: ParentRef,
  errors: ErrorEntry[],
): void {
  const lessonCount = section.lessons?.length ?? 0
  const exerciseCount = section.exercises?.length ?? 0

  if (lessonCount + exerciseCount === 0) {
    errors.push({
      _id: section._id,
      _type: 'section',
      title: section.title ?? '(untitled)',
      slug: section.slug,
      parentModule,
      error: 'Section has no lesson, exercise, or explainer resources',
    })
    return
  }

  const sectionRef: ParentRef = {
    _id: section._id,
    title: section.title ?? '(untitled)',
    slug: section.slug,
  }

  for (const lesson of section.lessons ?? []) {
    validateLesson(lesson, parentModule, sectionRef, errors)
  }

  for (const exercise of section.exercises ?? []) {
    validateExercise(exercise, parentModule, sectionRef, errors)
  }
}

function validateModule(mod: Module, errors: ErrorEntry[]): void {
  if (!mod.sections || mod.sections.length === 0) {
    errors.push({
      _id: mod._id,
      _type: 'module',
      title: mod.title ?? '(untitled)',
      slug: mod.slug,
      error: 'Module has no sections',
    })
    return
  }

  const moduleRef: ParentRef = {
    _id: mod._id,
    title: mod.title ?? '(untitled)',
    slug: mod.slug,
  }

  for (const section of mod.sections) {
    validateSection(section, moduleRef, errors)
  }
}

function buildSummary(errors: ErrorEntry[]): {
  totalErrors: number
  byType: Record<string, number>
} {
  const byType: Record<string, number> = {
    module: 0,
    section: 0,
    lesson: 0,
    exercise: 0,
    solution: 0,
    videoResource: 0,
  }

  for (const err of errors) {
    if (err._type === 'videoResource') {
      byType.videoResource = (byType.videoResource ?? 0) + 1
    } else if (err._type === 'solution') {
      byType.solution = (byType.solution ?? 0) + 1
    } else if (err._type === 'module') {
      byType.module = (byType.module ?? 0) + 1
    } else if (err._type === 'section') {
      byType.section = (byType.section ?? 0) + 1
    } else if (err._type === 'lesson' || err._type === 'explainer') {
      byType.lesson = (byType.lesson ?? 0) + 1
    } else if (err._type === 'exercise') {
      byType.exercise = (byType.exercise ?? 0) + 1
    }
  }

  return {totalErrors: errors.length, byType}
}

// --- Main ---
async function main(): Promise<void> {
  const productTitle = getProductTitle()

  console.log(`Fetching content tree for: "${productTitle}"...`)

  const product: Product | null = await client.fetch(productQuery, {
    productTitle,
  })

  if (!product) {
    console.error(`Product not found: ${productTitle}`)
    process.exit(1)
  }

  const errors: ErrorEntry[] = []

  for (const mod of product.modules ?? []) {
    validateModule(mod, errors)
  }

  const summary = buildSummary(errors)

  const report = {
    product: {
      _id: product._id,
      title: product.title,
      slug: product.slug,
    },
    timestamp: new Date().toISOString(),
    summary,
    errors,
  }

  // Write report to file
  const reportsDir = path.join('scripts', 'qa-reports')
  fs.mkdirSync(reportsDir, {recursive: true})

  const now = new Date()
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const timePart = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')
  const timestamp = `${datePart}-${timePart}`

  const slug = product.slug ?? product.title.toLowerCase().replace(/\s+/g, '-')
  const filename = `${slug}-${timestamp}.json`
  const reportPath = path.join(reportsDir, filename)

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  // Print summary
  console.log(`\nQA Validation Report for "${product.title}"`)
  console.log('==========================================')

  if (errors.length === 0) {
    console.log('All content passed validation!')
  } else {
    console.log(`Total errors: ${summary.totalErrors}`)
    console.log('\nBreakdown by type:')
    console.log(`  module:        ${summary.byType.module}`)
    console.log(`  section:       ${summary.byType.section}`)
    console.log(`  lesson:        ${summary.byType.lesson}`)
    console.log(`  exercise:      ${summary.byType.exercise}`)
    console.log(`  solution:      ${summary.byType.solution}`)
    console.log(`  videoResource: ${summary.byType.videoResource}`)
  }

  console.log(`\nReport written to: ${reportPath}`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
