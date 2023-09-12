import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilities} from './abilities'
import {tipResourcesRouter} from './tip-resources'
import {searchRouter} from './search'

export const appRouter = mergeRouters(
  router({
    abilities: abilities,
    tipResources: tipResourcesRouter,
    search: searchRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
