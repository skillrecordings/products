import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {chapterResourceQuery} from './chapters'
import groq from 'groq'

import z from 'zod'

export const BookChapterSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  moduleType: z.literal('chapter'),
  body: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  github: z
    .object({
      _type: z.literal('github'),
      repo: z.string().optional().nullable(),
      title: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})

export const BookSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  moduleType: z.literal('book'),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  body: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  chapters: z.array(
    BookChapterSchema,
    // ChapterSchema.extend({
    //   firstResource: z.object({
    //     _id: z.string(),
    //     slug: z.object({
    //       current: z.string(),
    //     }),
    //     title: z.string(),
    //   }),
    // }),
  ),
})

export type Book = z.infer<typeof BookSchema>
export type BookChapter = z.infer<typeof BookChapterSchema>

export async function getBook(slugOrId: string) {
  const book = await sanityClient.fetch<Book>(
    groq`*[_type == 'module' && moduleType == 'book' && (slug.current == $slugOrId || _id == $slugOrId)][0]{
        _id,
        _type,
        _updatedAt,
        _createdAt,
        moduleType,
        title,
        slug,
        body,
        ogImage,
        "image": image.asset->url,
        'chapters': resources[]->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          moduleType,
          title,
          "slug": slug.current,

        }
      }`,
    {slugOrId: `${slugOrId}`},
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

export async function getBookChapter(chapterSlugOrId: string) {
  const chapter = await sanityClient.fetch<BookChapter>(
    groq`*[_type == 'module' && moduleType == 'chapter' && (slug.current == $chapterSlugOrId || _id == $chapterSlugOrId)][0]{
        _id,
        _type,
        _updatedAt,
        _createdAt,
        moduleType,
        description,
        title,
        "slug": slug.current,
        'github': github,
        body,

      }`,
    {
      chapterSlugOrId: `${chapterSlugOrId}`,
    },
  )
  return chapter
}
