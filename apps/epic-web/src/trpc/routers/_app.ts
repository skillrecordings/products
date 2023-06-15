import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {lessonResourcesRouter} from './lesson-resources'
import {tipsRouter} from 'trpc/routers/tips'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
    tips: tipsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
