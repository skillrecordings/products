import z from 'zod'
import {sanityQuery} from '@/server/sanity.server'
import groq from 'groq'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {findIndex} from 'lodash'

export const ChapterResourceSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  body: z.string().optional(),
  mdx: z.unknown() as z.Schema<MDXRemoteSerializeResult>,
  video: z
    .object({
      videoResourceId: z.string(),
    })
    .nullable()
    .optional(),
  solution: z
    .object({
      body: z.string().optional(),
      mdx: z.unknown() as z.Schema<MDXRemoteSerializeResult>,
      videoResourceId: z.string(),
      code: z
        .object({
          openFile: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  code: z
    .object({
      openFile: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})

export const ChapterSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  moduleType: z.literal('chapter'),
  github: z
    .object({
      _type: z.literal('github'),
      repo: z.string().optional().nullable(),
      title: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  resources: z.array(ChapterResourceSchema).optional().nullable(),
})

export type Chapter = z.infer<typeof ChapterSchema>
export type ChapterResource = z.infer<typeof ChapterResourceSchema>

const chapterQuery = `
  _id,
  _type,
  _updatedAt,
  _createdAt,
  title,
  slug,
  moduleType,
  github,
`

export async function getChapter(slugOrId: string) {
  const chapter = await sanityQuery<Omit<Chapter, 'resources'>>(
    groq`*[_type == 'module' && moduleType == 'chapter' && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
       ${chapterQuery}
    }`,
    {tags: ['chapter', slugOrId]},
  )

  const parsed = ChapterSchema.omit({resources: true}).safeParse(chapter)

  if (!parsed.success) {
    console.error('Error parsing chapter', slugOrId)
    console.error(parsed.error)
    return null
  } else {
    return parsed.data
  }
}

export async function getChapterWithResources(slugOrId: string) {
  const chapter = await sanityQuery<Chapter | Omit<Chapter, 'resources'>>(
    groq`*[_type == 'module' && moduleType == 'chapter' && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
       ${chapterQuery}
      'resources': resources[]->{${chapterResourceQuery()}},
    }`,
    {tags: ['chapter', slugOrId]},
  )

  const parsed = ChapterSchema.safeParse(chapter)

  if (!parsed.success) {
    console.error('Error parsing chapter with resources', slugOrId)
    console.error(parsed.error)
    return null
  } else {
    const serializedChapterResources =
      parsed.data.resources && (await serializeBodyToMdx(parsed.data.resources))
    const data = {...parsed.data, resources: serializedChapterResources}

    return data
  }
}

export const chapterResourceQuery = (withBody = false) => `
  _id,
  _type,
  _updatedAt,
  _createdAt,
  title,
  slug,
  ${withBody ? 'body,' : ''}
  'video': resources[@->._type == 'videoResource'][0]->{
    "videoResourceId": _id,
  },
  'code': resources[@._type == 'stackblitz'][0]{
    openFile
  },
  'solution': resources[@._type == 'solution'][0]{
    ${withBody ? 'body,' : ''}
    'videoResourceId': resources[@->._type == 'videoResource'][0]->_id,
    "code": resources[@._type == 'stackblitz'][0]{
      openFile
    }
  },
`

export async function getChapterResource(slugOrId: string, withBody = true) {
  const chapterResource = await sanityQuery<ChapterResource>(
    groq`*[_type in ['exercise', 'lesson', 'explainer', 'solution'] && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
        ${chapterResourceQuery(withBody)}
      },
      }`,
    {tags: ['resource', slugOrId]},
  )

  const parsed = ChapterResourceSchema.safeParse(chapterResource)

  if (!parsed.success) {
    console.error('Error parsing chapter resource', slugOrId)
    console.error(parsed.error)
    return null
  } else {
    const serializedChapterResource = await serializeBodyToMdx([parsed.data])
    return serializedChapterResource[0]
  }
}

const serializeBodyToMdx = async (chapterResources: ChapterResource[]) => {
  const promises = chapterResources.map(async (resource) => {
    let solution = resource.solution
    if (solution && solution.body) {
      const mdx = await serializeMDX(solution.body as string, {
        // useShikiTwoslash: true,
        syntaxHighlighterOptions: {
          theme: 'github-light',
          // authorization: process.env.SHIKI_AUTH_TOKEN,
          // endpoint: process.env.SHIKI_ENDPOINT,
        },
      })
      solution = {...solution, mdx}
    }

    if (resource.body) {
      const mdx = await serializeMDX(resource.body as string, {
        // useShikiTwoslash: true,
        syntaxHighlighterOptions: {
          theme: 'github-light',
          // authorization: process.env.SHIKI_AUTH_TOKEN,
          // endpoint: process.env.SHIKI_ENDPOINT,
        },
      })
      return {...resource, mdx, solution}
    }
    return {...resource, solution}
  })
  return Promise.all(promises)
}

export async function getChapterPositions(
  chapterSlug: string,
  resourceSlug?: string,
) {
  if (!chapterSlug) return {}

  const allChapters = await sanityQuery<{
    chapters: {
      _id: string
      slug: string
      title: string
      resources: {
        _id: string
        slug: string
        title: string
        solution?: {_key: string} | null
      }[]
    }[]
  }>(
    groq`*[_type == 'module' && moduleType == 'book'][0]{
    'chapters': resources[]->{
      _id,
      "slug": slug.current,
      title,
      "resources": resources[]->{
        _id,
        "slug": slug.current,
        title,
        'solution': resources[@._type == 'solution'][0]{_key},
      }
    }
    
  }`,
    {tags: ['chapters']},
  )

  const chapters = allChapters.chapters

  const currentChapterIndex = findIndex(chapters, {
    slug: chapterSlug,
  })

  const nextChapter =
    findIndex(chapters, chapters[currentChapterIndex + 1]) !== -1
      ? chapters[currentChapterIndex + 1]
      : null

  const prevChapter =
    findIndex(chapters, chapters[currentChapterIndex - 1]) !== -1
      ? chapters[currentChapterIndex - 1]
      : null

  const currentChapter = chapters[currentChapterIndex]

  const resources = currentChapter.resources

  const currentResourceIndex = findIndex(currentChapter.resources, {
    slug: resourceSlug,
  })

  const nextResource =
    findIndex(resources, resources[currentResourceIndex + 1]) !== -1
      ? resources[currentResourceIndex + 1]
      : null

  const firstResourceInNextChapter = nextChapter?.resources[0]

  const prevResource =
    findIndex(resources, resources[currentResourceIndex - 1]) !== -1
      ? resources[currentResourceIndex - 1]
      : null

  const lastResourceInPrevChapter =
    prevChapter?.resources[prevChapter.resources.length - 1]

  const currentResource = resources[currentResourceIndex]

  return {
    nextChapter: nextChapter as Chapter | null,
    currentChapterIndex: currentChapterIndex + 1,
    currentChapter,
    prevChapter,
    chapters,
    nextResource: nextResource || firstResourceInNextChapter,
    prevResource: prevResource || lastResourceInPrevChapter,
    currentResourceIndex: currentResourceIndex + 1,
    currentResource,
  }
}

export async function getResourcePositions(
  resourceSlug: string,
  chapter?: Chapter | null,
) {
  if (!chapter || !resourceSlug) return {}

  let resources
  if (chapter.resources) {
    resources = chapter.resources
  } else {
    const chapterWithResources = await getChapterWithResources(
      chapter.slug.current,
    )
    if (chapterWithResources && chapterWithResources.resources) {
      resources = chapterWithResources.resources
    }
  }

  const currentResourceIndex = findIndex(chapter.resources, {
    slug: {current: resourceSlug},
  })

  if (!resources) return {}

  const nextResource =
    findIndex(resources, resources[currentResourceIndex + 1]) !== -1
      ? resources[currentResourceIndex + 1]
      : null

  const prevResource =
    findIndex(resources, resources[currentResourceIndex - 1]) !== -1
      ? resources[currentResourceIndex - 1]
      : null

  return {
    currentResourceIndex: currentResourceIndex + 1,
    nextResource,
    prevResource,
  }
}

export async function nextResourceUrlBuilder(
  currentResourceSlug: string,
  currentChapterSlug: string,
  withSolution?: boolean,
  isSolution?: boolean, // TODO: check if we're currently on /solution route
) {
  const {nextChapter, nextResource, currentChapter, currentResource} =
    await getChapterPositions(currentChapterSlug, currentResourceSlug)

  if (
    nextResource ||
    nextChapter ||
    (currentResource && currentResource.solution)
  ) {
    return {
      url:
        withSolution &&
        !isSolution &&
        currentResource &&
        currentResource?.solution
          ? `/book/${currentChapter.slug}/${currentResource.slug}/solution`
          : nextResource &&
            currentChapter.resources.find((r) => r.slug === nextResource.slug)
          ? `/book/${currentChapter.slug}/${nextResource.slug}`
          : nextChapter?.resources
          ? `/book/${nextChapter.slug}/${nextChapter.resources[0].slug}`
          : '',
      label:
        withSolution &&
        !isSolution &&
        currentResource &&
        currentResource.solution
          ? `Solution`
          : nextResource &&
            currentChapter.resources.find((r) => r.slug === nextResource.slug)
          ? nextResource.title
          : nextChapter?.resources
          ? nextChapter.resources[0].title
          : null,
    }
  } else {
    return {
      url: null,
      label: null,
    }
  }
}
