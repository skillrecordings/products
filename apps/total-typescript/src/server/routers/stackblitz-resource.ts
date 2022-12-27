import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'

export const stackblitzResourceRouter = router({
  byExerciseSlug: publicProcedure
    .input(
      z.object({
        type: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.slug)

      const stackblitz =
        input.type === 'solution'
          ? lesson.solution?.stackblitz
          : lesson.stackblitz

      return stackblitz
    }),
})
