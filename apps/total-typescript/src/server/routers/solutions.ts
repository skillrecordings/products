import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'

export const soulutionsRouter = router({
  getSolution: publicProcedure
    .input(
      z.object({
        exerciseSlug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.exerciseSlug)
      return lesson.solution
    }),
})
