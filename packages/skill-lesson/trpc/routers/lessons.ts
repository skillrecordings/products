import {z} from 'zod'
import {type SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import {publicProcedure, router} from '../trpc.server'
import {getModule, getModuleWithResources} from '../../lib/modules'
import {getSection} from '../../lib/sections'
import {getLesson} from '../../lib/lesson-resource'
import {
  SolutionResourceSchema,
  LessonResourceSchema,
} from '../../schemas/lesson'
import flatMap from 'lodash/flatMap'

export const lessonsRouter = router({
  getNextLesson: publicProcedure
    .input(
      z.object({
        type: z.string(),
        slug: z.string().optional(),
        section: z.string().optional(),
        module: z.string().nullish(),
        isModuleWithResources: z.boolean().optional(),
      }),
    )
    .query(async ({input}) => {
      if (input.module === 'tips' || !input.slug) return null

      const lesson = await getLesson(input.slug)
      const section = input.section && (await getSection(input.section))
      const module = input.module && (await getModule(input.module))
      const moduleWithResources =
        input.module && (await getModuleWithResources(input.module))

      // lessons when we use resources
      const allLessons = flatMap(moduleWithResources?.resources, (resource) => {
        if (resource._type === 'lesson') {
          return resource
        } else if (
          resource._type === 'section' &&
          Array.isArray(resource.lessons)
        ) {
          return resource.lessons
        }
        return []
      })

      if (input.type === 'exercise') {
        return SolutionResourceSchema.parse(lesson.solution)
      }

      const lessons =
        input.isModuleWithResources === true
          ? allLessons
          : section
          ? section?.lessons
          : module?.lessons || module?.resources

      if (!lessons) return null

      let currentLesson

      switch (input.type) {
        case 'exercise':
          //exercises have solutions, that's what makes them exercises
          //so we match the solution key to identify the exercise
          const exerciseForSolution = lessons.find(
            (resource: SanityDocument) => {
              return resource.solution?._key === lesson.solution?._key
            },
          )
          currentLesson = find(lessons, {_id: exerciseForSolution._id})
          break
        default:
          currentLesson = find(lessons, {slug: input.slug})
      }

      const nextLessonIndex = indexOf(lessons, currentLesson) + 1

      if (lessons[nextLessonIndex]) {
        const parsedLesson = LessonResourceSchema.safeParse(
          lessons[nextLessonIndex],
        )
        if (parsedLesson.success) {
          return parsedLesson.data
        }
      }

      return null
    }),
})
