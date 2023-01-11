import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'
import {type PrismaClient} from '@skillrecordings/database'
import {type CommerceProps} from '@skillrecordings/commerce-server/dist/@types'

export const appRouter = mergeRouters(
  router({
    resource: lessonResourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
