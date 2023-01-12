import {publicProcedure, router} from '@skillrecordings/skill-lesson'
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
      const sandpack = input.type === 'exercise' ? lesson.sandpack : null
      const figma =
        input.type === 'exercise' || input.type === 'explainer'
          ? lesson.figma
          : null
      const github =
        input.type === 'exercise' ? lesson.github : lesson.solution?.github

      return {sandpack, figma, github}
    }),
})
