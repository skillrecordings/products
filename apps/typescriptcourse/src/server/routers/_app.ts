import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'

export const appRouter = mergeRouters(router({}), skillLessonRouter)

export type AppRouter = typeof appRouter
