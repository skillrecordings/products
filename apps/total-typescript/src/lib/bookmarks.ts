import {z} from 'zod'
import {prisma} from '@skillrecordings/database'

export const BookmarkInputSchema = z.object({
  module: z.string(),
  section: z.object({
    title: z.string(),
    slug: z.string(),
  }),
  resource: z.object({
    id: z.string(),
    children: z.string(),
  }),
  userId: z.string(),
})

export const ReturnedBookmarkSchema = z.object({
  id: z.string(),
  module: z.string(),
  section: z.object({
    title: z.string(),
    slug: z.string(),
  }),
  resource: z.object({
    id: z.string(),
    children: z.string(),
  }),
})

export type Bookmark = z.infer<typeof ReturnedBookmarkSchema>
export type BookmarkInput = z.infer<typeof BookmarkInputSchema>

export async function getBookmarksForUser(userId: string) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      select: {
        id: true,
        module: true,
        section: true,
        resource: true,
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
        module: true,
        section: true,
        resource: true,
      },
      where: {
        userId,
        resource: {
          path: '$.id',
          equals: resourceId,
        },
      },
    })
    return bookmark
  } catch (error) {
    console.error('Error getting bookmark', error)
    throw new Error('Error getting bookmark')
  }
}

export async function getLastBookmarkedResource({
  userId,
  bookSlug,
}: {
  userId: string
  bookSlug: string
}) {
  try {
    const lastBookmarkedResource = await prisma.bookmark.findFirst({
      select: {
        id: true,
        module: true,
        section: true,
        resource: true,
      },
      where: {
        module: bookSlug,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return lastBookmarkedResource
  } catch (error) {
    console.error('Error getting last bookmarked resource', error)
    throw new Error('Error getting last bookmarked resource')
  }
}

export async function addBookmark({
  userId,
  module,
  section,
  resource,
}: BookmarkInput) {
  try {
    console.log('Adding bookmark to user', {userId, module, section, resource})
    const bookmark = await prisma.bookmark.create({
      select: {
        id: true,
        module: true,
        section: true,
        resource: true,
      },
      data: {
        module,
        section: {
          title: section.title,
          slug: section.slug,
        },
        resource,
        userId,
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
