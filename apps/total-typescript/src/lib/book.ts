'use server'

import {sanityQuery} from '@/server/sanity.server'
import {chapterResourceQuery} from './chapters'
import groq from 'groq'
import {
  Book,
  BookSchema,
  ChapterListSchema,
} from '@/app/book/_schema/book-schemas'

export async function getChapterList(slugOrId: string) {
  const book = await sanityQuery<Book>(
    groq`*[_type == 'module' && moduleType == 'book' && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
      "chapters": resources[]->{
           title,
          slug,
          'resources': resources[]->{
            title,
            slug,
            'solution': resources[@._type == 'solution'][0]._key
          }
      }}`,
    {tags: ['book', slugOrId]},
  )

  console.log(JSON.stringify(book))

  const parsed = ChapterListSchema.safeParse(book.chapters)

  if (!parsed.success) {
    console.error('Error parsing book', slugOrId)
    console.error(parsed.error)
    return null
  } else {
    return parsed.data
  }
}

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
          'firstResource': resources[0]->{_id, slug, title},
          'resources': resources[]->{
            ${chapterResourceQuery()}
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
