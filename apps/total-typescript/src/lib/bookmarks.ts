import {z} from 'zod'
import {prisma} from '@skillrecordings/database'

export const BookmarkInputSchema = z.object({
  userId: z.string(),
  resourceId: z.string(),
  type: z.string(),
  fields: z.record(z.string().nullable()).optional(),
})

export const ReturnedBookmarkSchema = z.object({
  id: z.string(),
  resourceId: z.string(),
  type: z.string(),
  fields: z.record(z.string().nullable()).optional(),
})

export const ReturnedBookmarkForBookSchema = z.object({
  id: z.string(),
  resourceId: z.string(),
  type: z.string(),
  fields: z.object({
    chapterSlug: z.string(),
    chapterTitle: z.string(),
    resourceTitle: z.string(),
  }),
})

export type Bookmark = z.infer<typeof ReturnedBookmarkSchema>
export type BookmarkForBook = z.infer<typeof ReturnedBookmarkForBookSchema>
export type BookmarkInput = z.infer<typeof BookmarkInputSchema>

export async function getBookmarksForUser(userId: string) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      select: {
        id: true,
        resourceId: true,
        type: true,
        fields: true,
      },
      where: {
        userId,
      },
    })
    return bookmarks
  } catch (error) {
    console.error('Error getting bookmarks for user', error)
    throw new Error('Error getting bookmarks for user')
  }
}

export async function getBookmarkByResourceId({
  userId,
  resourceId,
}: {
  userId: string
  resourceId: string
}) {
  try {
    const bookmark = await prisma.bookmark.findFirst({
      select: {
        id: true,
        resourceId: true,
        type: true,
        fields: true,
      },
      where: {
        userId,
        resourceId,
      },
    })
    return bookmark
  } catch (error) {
    console.error('Error getting bookmark', error)
    throw new Error('Error getting bookmark')
  }
}

export async function getLastestBookmarkedResources({
  userId,
  type,
}: {
  userId: string
  type: string
}) {
  try {
    const latestBookmarkResources = await prisma.bookmark.findMany({
      select: {
        id: true,
        resourceId: true,
        type: true,
        fields: true,
      },
      where: {
        type,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return latestBookmarkResources
  } catch (error) {
    console.error('Error getting last bookmarked resource', error)
    throw new Error('Error getting last bookmarked resource')
  }
}

export async function addBookmark({
  userId,
  type,
  resourceId,
  fields,
}: BookmarkInput) {
  try {
    console.log('Adding bookmark to user', {userId, resourceId})
    const bookmark = await prisma.bookmark.create({
      select: {
        id: true,
        type: true,
        resourceId: true,
        fields: true,
      },
      data: {
        type,
        resourceId,
        userId,
        fields: {...fields},
      },
    })
    return bookmark
  } catch (error) {
    console.error('Error adding bookmark to user', error)
    throw new Error('Error adding bookmark to user')
  }
}

export async function deleteBookmark({
  userId,
  bookmarkId,
}: {
  userId: string
  bookmarkId: string
}) {
  try {
    console.log('Deleting bookmark', {bookmarkId})
    await prisma.bookmark.delete({
      where: {
        userId,
        id: bookmarkId,
      },
    })
  } catch (error) {
    console.error('Error deleting bookmark', error)
    throw new Error('Error deleting bookmark')
  }
}
