import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {pricing} from './pricing'
import {stackblitzResourceRouter} from './stackblitz-resource'
import {soulutionsRouter} from './solutions'

export const appRouter = mergeRouters(
  router({
    workshops: workshop,
    abilities: abilities,
    pricing: pricing,
    stackblitz: stackblitzResourceRouter,
    solutions: soulutionsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
