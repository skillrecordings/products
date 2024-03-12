import {sanityQuery} from '@/server/sanity.server'
import {ChapterSchema, chapterResourceQuery} from './chapters'
import z from 'zod'
import groq from 'groq'

export const BookSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  moduleType: z.literal('book'),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  chapters: z.array(ChapterSchema),
})

export type Book = z.infer<typeof BookSchema>

export async function getBook(slugOrId: string) {
  const book = await sanityQuery<Book>(
    groq`*[_type == 'module' && moduleType == 'book' && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
        _id,
        _type,
        _updatedAt,
        _createdAt,
        moduleType,
        title,
        slug,
        'chapters': resources[]->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          moduleType,
          title,
          slug,
          'resources': resources[]->{
            ${chapterResourceQuery}
          }
        }
      }`,
    {tags: ['book', slugOrId]},
  )

  const parsed = BookSchema.safeParse(book)

  if (!parsed.success) {
    console.error('Error parsing book', slugOrId)
    console.error(parsed.error)
    return null
  } else {
    return parsed.data
  }
}
