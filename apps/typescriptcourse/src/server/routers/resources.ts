import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getLesson} from '../../lib/lesson'

export const lessonResourcesRouter = router({
  byExerciseSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getLesson(input.slug)

      const github = lesson.github

      return {github}
    }),
})
