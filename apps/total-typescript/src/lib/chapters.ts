import z from 'zod'
import {sanityQuery} from '@/server/sanity.server'
import groq from 'groq'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'

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
      video: z
        .object({
          videoResourceId: z.string(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
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
  resources: z.array(ChapterResourceSchema),
})

export type Chapter = z.infer<typeof ChapterSchema>
export type ChapterResource = z.infer<typeof ChapterResourceSchema>

export async function getChapter(slugOrId: string) {
  const chapter = await sanityQuery<Chapter>(
    groq`*[_type == 'module' && moduleType == 'chapter' && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        slug,
        moduleType,
        'resources': resources[]->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          title,
          slug,
          body,
          'lesson': resources[@->._type == 'videoResource'][0]->{
            "videoResourceId": _id,
          },
          'solution': resources[@._type == 'solution'][0]{
            'videoResourceId': resources[@->._type == 'videoResource'][0]->._id,
          },
        },
    }`,
    {tags: ['chapter', slugOrId]},
  )

  const parsed = ChapterSchema.safeParse(chapter)

  if (!parsed.success) {
    console.error('Error parsing chapter', slugOrId)
    console.error(parsed.error)
    return null
  } else {
    const serializedChapterResources = await serializeBodyToMdx(
      parsed.data.resources,
    )
    const data = {...parsed.data, resources: serializedChapterResources}

    return data
  }
}

const serializeBodyToMdx = async (chapterResources: ChapterResource[]) => {
  const promises = chapterResources.map(async (resource) => {
    if (resource.body) {
      const mdx = await serializeMDX(resource.body as string, {})
      return {...resource, mdx}
    }
    return resource
  })
  return Promise.all(promises)
}
