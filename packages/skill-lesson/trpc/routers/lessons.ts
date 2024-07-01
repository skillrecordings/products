import {z} from 'zod'
import {type SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import {publicProcedure, router} from '../trpc.server'
import {getModule} from '../../lib/modules'
import {getSection} from '../../lib/sections'
import {getLesson} from '../../lib/lesson-resource'
import {
  SolutionResourceSchema,
  LessonResourceSchema,
} from '../../schemas/lesson'
import {getToken} from 'next-auth/jwt'
import {TRPCError} from '@trpc/server'
import {getModuleProgress} from '../../lib/module-progress'

export const lessonsRouter = router({
  getNextLesson: publicProcedure
    .input(
      z.object({
        type: z.string(),
        slug: z.string().optional(),
        section: z.string().optional(),
        module: z.string().nullish(),
      }),
    )
    .query(async ({input}) => {
      if (input.module === 'tips' || !input.slug) return null

      const lesson = await getLesson(input.slug)
      const section = input.section && (await getSection(input.section))
      const module = input.module && (await getModule(input.module))

      // it seems like this conditional and return are going result in the
      // case statement for `exercise` below never getting triggered.
      if (input.type === 'exercise') {
        return SolutionResourceSchema.parse(lesson.solution)
      }

      const lessons = section ? section?.lessons : module?.lessons

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
  getNextLessonAndSkipPreviousLessons: publicProcedure
    .input(
      z.object({
        lessonSlug: z.string(),
        module: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token?.sub) {
        return new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not logged in',
        })
      }

      const progress = await getModuleProgress({
        moduleSlug: input.module,
        userId: token.sub,
      })
      const currentLessonIndex = progress?.lessons.findIndex(
        (lesson) => lesson.slug === input.lessonSlug,
      )
      const nextLesson = progress.lessons
        .slice(currentLessonIndex + 1)
        .find((lesson) => !lesson.lessonCompleted)

      const firstUncompletedLesson = progress.lessons.find(
        (lesson) => !lesson.lessonCompleted,
      )

      return nextLesson ? nextLesson : firstUncompletedLesson
    }),
})
