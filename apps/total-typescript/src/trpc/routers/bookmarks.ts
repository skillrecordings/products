import {
  addBookmark,
  BookmarkInputSchema,
  ReturnedBookmarkSchema,
  BookmarkForBook,
  ReturnedBookmarkForBookSchema,
  deleteBookmark,
  getBookmarksForUser,
  getBookmarkByResourceId,
  getLastestBookmarkedResources,
} from '@/lib/bookmarks'
import {TRPCError} from '@trpc/server'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'

export const bookmarksRouter = router({
  getBookmark: publicProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not logged in',
        })
      }

      const bookmark = await getBookmarkByResourceId({
        userId: token.id as string,
        resourceId: input.id,
      })

      return ReturnedBookmarkSchema.nullable().parse(bookmark)
    }),
  getBookmarksForUser: publicProcedure
    .input(
      z.object({
        resourceIds: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not logged in',
        })
      }

      const bookmarks = await getBookmarksForUser(
        token.id as string,
        input.resourceIds,
      )

      return bookmarks.map((bookmark) => ReturnedBookmarkSchema.parse(bookmark))
    }),
  lastBookmarkedResource: publicProcedure
    .input(
      z.object({
        type: z.string(),
        sectionSlugs: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {type, sectionSlugs} = input
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new Error('Unauthorized')
      }
      const bookmarks = await getLastestBookmarkedResources({
        userId: token.id as string,
        type: type,
      })

      if (!bookmarks.length) {
        return null
      }

      if (type === 'book' && sectionSlugs) {
        const bookmarkForBooks = bookmarks.map((bookmark) =>
          ReturnedBookmarkForBookSchema.parse(bookmark),
        )
        return bookmarkForBooks
          ?.filter((bookmark) => {
            return sectionSlugs.includes(bookmark?.fields?.chapterSlug ?? '')
          })
          .shift()
      } else {
        return ReturnedBookmarkSchema.parse(bookmarks.shift())
      }
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
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not logged in',
        })
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
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not logged in',
        })
      }

      return await deleteBookmark({
        userId: token.id as string,
        bookmarkId: input.id,
      })
    }),
})
