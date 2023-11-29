import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'

export const solutionsRouter = router({
  getSolution: publicProcedure
    .input(
      z.object({
        exerciseSlug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.exerciseSlug)
      return lesson ? lesson.solution : null
    }),
})
