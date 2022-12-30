import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'

export const sandpackResourceRouter = router({
  byExerciseSlug: publicProcedure
    .input(
      z.object({
        type: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.slug)
      return lesson.sandpack
    }),
})
