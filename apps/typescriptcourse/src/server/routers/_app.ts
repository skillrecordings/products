import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'

export const appRouter = mergeRouters(
  router({
    resource: lessonResourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
