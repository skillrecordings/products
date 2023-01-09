import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {stackblitzResourceRouter} from './stackblitz-resource'
import {solutionsRouter} from './solutions'

export const appRouter = mergeRouters(
  router({
    workshops: workshop,
    abilities: abilities,
    stackblitz: stackblitzResourceRouter,
    solutions: solutionsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
