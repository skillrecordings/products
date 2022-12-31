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
      const lesson = await getLesson(input.slug)
      const section = input.section && (await getSection(input.section))
      const module = input.module && (await getModule(input.module))

      if (input.type === 'exercise') {
        return LessonResourceSchema.parse(lesson.solution)
      }

      const exercises = section ? section.exercises : module.exercises

      const exerciseForSolution = exercises.find((resource: SanityDocument) => {
        return resource.solution?._key === lesson.solution?._key
      })

      const current = find(exercises, {_id: exerciseForSolution._id})
      const nextExerciseIndex = indexOf(exercises, current) + 1

      return exercises[nextExerciseIndex]
        ? LessonResourceSchema.parse(exercises[nextExerciseIndex])
        : null
    }),
})
