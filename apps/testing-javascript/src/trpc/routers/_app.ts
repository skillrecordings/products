import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilitiesRouter} from './abilities'
import {moduleProgressRouter} from './module-progress'

export const appRouter = mergeRouters(
  router({
    abilities: abilitiesRouter,
    moduleProgress: moduleProgressRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
