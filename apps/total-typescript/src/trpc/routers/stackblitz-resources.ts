import {publicProcedure, router} from '@skillrecordings/skill-lesson'
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

      if (!lesson) {
        return null
      }

      return input.type === 'solution'
        ? lesson.solution?.stackblitz
        : lesson.stackblitz
    }),
})
