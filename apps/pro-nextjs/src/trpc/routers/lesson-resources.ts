import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'

export const lessonResourcesRouter = router({
  byLessonSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        type: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.slug)
      const github =
        input.type === 'exercise'
          ? lesson.github
          : input.type === 'explainer'
          ? lesson.github
          : lesson.solution?.github
      const gitpod =
        input.type === 'exercise'
          ? lesson.gitpod
          : input.type === 'explainer'
          ? lesson.gitpod
          : lesson.solution?.gitpod

      return {github, gitpod}
    }),
})
