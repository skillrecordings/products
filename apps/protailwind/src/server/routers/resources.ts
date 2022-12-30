import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'

export const lessonResourcesRouter = router({
  byExerciseSlug: publicProcedure
    .input(
      z.object({
        type: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.slug)
      const sandpack = input.type === 'exercise' ? lesson.sandpack : undefined
      const figma = input.type === 'exercise' ? lesson.figma : undefined
      const github =
        input.type === 'exercise' ? lesson.github : lesson.solution?.github

      return {sandpack, figma, github}
    }),
})
