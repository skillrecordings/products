import {useQuery} from '@tanstack/react-query'
import {z} from 'zod'
import {localProgressDb} from '../utils/dexie'

export const BookmarkEventSchema = z.object({
  resource: z.string(),
  section: z.string(),
  module: z.string(),
  eventName: z.string(),
  createdOn: z.date(),
})

export type BookmarkEvent = z.infer<typeof BookmarkEventSchema>

export const useBookmark = (id: string) => {
  const {
    data: bookmarkEvent,
    status,
    refetch,
  } = useQuery(['bookmarkEvent', id], async () => {
    const bookmarkEvent = await localProgressDb.bookmarks
      .where('resource')
      .equals(id)
      .first()

    if (!bookmarkEvent) {
      return null
    }

    return bookmarkEvent
  })

  return {resourceBookmarked: bookmarkEvent, status, refetch}
}
