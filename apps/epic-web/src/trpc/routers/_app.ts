import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {lessonResourcesRouter} from './lesson-resources'
import {tipsRouter} from 'trpc/routers/tips'
import {abilitiesRouter} from 'trpc/routers/abilities'
import {moduleResourcesRouter} from './module-resources'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
    moduleResources: moduleResourcesRouter,
    tips: tipsRouter,
    abilities: abilitiesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
