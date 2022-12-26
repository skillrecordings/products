import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getExercise} from '../../lib/exercises'
import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import {getSection} from '../../lib/sections'
import {getTutorial} from '../../lib/tutorials'

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
    .query(async ({ctx, input}) => {
      const lesson = await getExercise(input.slug)
      const section = input.section && (await getSection(input.section))
      const module = input.module && (await getTutorial(input.module))

      if (input.type === 'exercise') {
        return lesson.solution
      }

      const exercises = section ? section.exercises : module.exercises

      const exerciseForSolution = exercises.find((resource: SanityDocument) => {
        return resource.solution?._key === lesson._key
      })

      const current = find(exercises, {_id: exerciseForSolution._id})
      const nextExerciseIndex = indexOf(exercises, current) + 1
      return exercises[nextExerciseIndex]
    }),
})
