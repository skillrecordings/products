import {useQuery} from '@tanstack/react-query'
import {z} from 'zod'
import {localBookDb} from '../utils/dexie'

export const BookmarkEventSchema = z.object({
  resource: z.object({
    id: z.string(),
    children: z.string(),
  }),
  section: z.object({
    title: z.string(),
    slug: z.string(),
  }),
  module: z.string(),
  eventName: z.string(),
  createdOn: z.date(),
})

export type BookmarkEvent = z.infer<typeof BookmarkEventSchema>

export const useBookmark = (resource: string) => {
  const {
    data: bookmarkEvent,
    status,
    refetch,
  } = useQuery(['bookmarkEvent', resource], async () => {
    const bookmarkEvent = await localBookDb.bookmarks
      .where('resource.id')
      .equals(resource)
      .first()

    if (!bookmarkEvent) {
      return null
    }

    return bookmarkEvent
  })

  return {resourceBookmarked: bookmarkEvent, status, refetch}
}

export const useBookProgress = (bookSlug: string) => {
  const {data, status} = useQuery(['bookmarkProgress', bookSlug], async () => {
    const lastBookmarkedResource = await localBookDb.bookmarks
      .where('module')
      .equals(bookSlug)
      .last()

    if (!lastBookmarkedResource) {
      return null
    }

    return lastBookmarkedResource
  })

  return {lastBookmarkedResource: data, status}
}

export const useBookmarks = (bookSlug: string) => {
  const {data, status, refetch} = useQuery(
    ['bookmarks', bookSlug],
    async () => {
      const bookmarks = await localBookDb.bookmarks
        .where('module')
        .equals(bookSlug)
        .reverse()
        .toArray()

      if (!bookmarks) {
        return []
      }

      return bookmarks
    },
  )

  return {bookmarks: data, status, refetch}
}
