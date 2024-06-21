import {
  addBookmark,
  BookmarkInputSchema,
  ReturnedBookmarkSchema,
  deleteBookmark,
  getBookmarksForUser,
  getBookmarkByResourceId,
  getLastBookmarkedResource,
} from '@/lib/bookmarks'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'

export const bookmarksRouter = router({
  getBookmark: publicProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new Error('Unauthorized')
      }

      const bookmark = await getBookmarkByResourceId({
        userId: token.id as string,
        resourceId: input.id,
      })

      return ReturnedBookmarkSchema.nullable().parse(bookmark)
    }),
  getBookmarksForUser: publicProcedure.query(async ({ctx}) => {
    const token = await getToken({req: ctx.req})
    if (!token) {
      throw new Error('Unauthorized')
    }

    const bookmarks = await getBookmarksForUser(token.id as string)

    return bookmarks.map((bookmark) => ReturnedBookmarkSchema.parse(bookmark))
  }),
  lastBookmarkedResource: publicProcedure
    .input(z.object({bookSlug: z.string()}))
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new Error('Unauthorized')
      }
      const bookmark = await getLastBookmarkedResource({
        userId: token.id as string,
        bookSlug: input.bookSlug,
      })

      return ReturnedBookmarkSchema.parse(bookmark)
    }),
  addBookmark: publicProcedure
    .input(
      BookmarkInputSchema.omit({
        userId: true,
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new Error('Unauthorized')
      }

      return await addBookmark({
        ...input,
        userId: token.id as string,
      })
    }),
  deleteBookmark: publicProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new Error('Unauthorized')
      }

      return await deleteBookmark({
        userId: token.id as string,
        bookmarkId: input.id,
      })
    }),
})
