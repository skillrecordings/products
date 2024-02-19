import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const ChapterSchema = z.object({
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  moduleType: z.string(),
})

export const ChapterResourceSchema = z.object({
  _type: z.string(),
  title: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  body: z.string(),
  state: z.enum(['published', 'draft']),
  chapter: ChapterSchema,
})

export type Chapter = z.infer<typeof ChapterSchema>
export type ChapterResource = z.infer<typeof ChapterResourceSchema>

export async function getAllChapterResources() {
  const resources = await sanityClient.fetch(
    groq`*[_type == 'chapterResource']{
        _type,
        _updatedAt,
        _createdAt,
        title,
        slug,
        body,
        state,
        'chapter': *[_type=='module' && moduleType=='chapter' && references(^._id)][0]{
          _type,
          _updatedAt,
          title,
          slug,
          moduleType
        }
    }`,
  )

  const result = z.array(ChapterResourceSchema).safeParse(resources)

  if (result.success) {
    return result.data
  } else {
    throw new Error('Could not find chapter resources')
  }
}

export async function getChapterResource(slug: string) {
  const resource = await sanityClient.fetch(
    groq`*[_type == 'chapterResource' && slug.current == $slug][0]{
            _type,
            _updatedAt,
            _createdAt,
            title,
            slug,
            body,
            state,
            'chapter': *[_type=='module' && moduleType=='chapter' && references(^._id)][0]{
                _type,
                _updatedAt,
                title,
                slug,
                moduleType
            }
        }`,
    {slug},
  )
  const result = ChapterResourceSchema.safeParse(resource)

  if (result.success) {
    return result.data
  } else {
    throw new Error('Could not find chapter resource')
    return null
  }
}
