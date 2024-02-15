import {getPaginatedArticles} from '@/lib/articles'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'

export const articlesRouter = router({
  getPaginatedArticles: publicProcedure
    .input(
      z.object({
        offset: z.number(),
        limit: z.number(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {offset, limit} = input
      const articles = await getPaginatedArticles(offset, limit)
      return articles
    }),
})
