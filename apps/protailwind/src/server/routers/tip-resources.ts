import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getTip} from '../../lib/tips'

export const tipResourcesRouter = router({
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getTip(input.slug)
      const tweetId = lesson.tweetId

      return {tweetId}
    }),
})
