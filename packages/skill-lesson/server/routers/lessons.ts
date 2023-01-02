import {z} from 'zod'
import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import {publicProcedure, router} from '../trpc'
import {getModule} from '../../lib/modules'
import {getSection} from '../../lib/sections'
import {getLesson} from '../../lib/lesson-resource'
import {LessonResourceSchema} from '../../schemas/lesson-resource'

export const lessonsRouter = router({
  getNextLesson: publicProcedure
    .input(
      z.object({
        type: z.string(),
        slug: z.string(),
        section: z.string().optional(),
        module: z.string().optional(),
      }),
    )
    .query(async ({input}) => {
      if (input.module === 'tips') return null
      const lesson = await getLesson(input.slug)
      const section = input.section && (await getSection(input.section))
      const module = input.module && (await getModule(input.module))

      if (input.type === 'exercise') {
        return LessonResourceSchema.parse(lesson.solution)
      }

      const lessons = section ? section.lessons : module.lessons

      const exerciseForSolution = lessons.find((resource: SanityDocument) => {
        return resource.solution?._key === lesson.solution?._key
      })

      // TODO: this is likely overloading the lesson type just because it
      //   exists and is different that the exercise type. We should probably
      //   create a new type instead of `lesson` since `lesson` describes ALL
      //   lessons, not just the ones that are not exercises.
      const current =
        input.type === 'lesson'
          ? find(lessons, {slug: input.slug})
          : find(lessons, {_id: exerciseForSolution._id})
      const nextExerciseIndex = indexOf(lessons, current) + 1

      return lessons[nextExerciseIndex]
        ? LessonResourceSchema.parse(lessons[nextExerciseIndex])
        : null
    }),
})
