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
      const sandpack = lesson?.sandpack

      const github =
        input.type === 'exercise'
          ? lesson.github
          : input.type === 'explainer'
          ? lesson.github
          : lesson.solution?.github

      return {sandpack, github}
    }),
})
