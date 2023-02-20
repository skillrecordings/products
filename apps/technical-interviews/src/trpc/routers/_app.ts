import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilities} from './abilities'

export const appRouter = mergeRouters(
  router({
    abilities: abilities,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
