import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'
import {type PrismaClient} from '@skillrecordings/database'

export const appRouter = mergeRouters(
  router({
    resource: lessonResourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
