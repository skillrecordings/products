import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'

export const lessonResourcesRouter = router({
  byLessonSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.slug)

      const github = lesson.github

      return {github}
    }),
})
