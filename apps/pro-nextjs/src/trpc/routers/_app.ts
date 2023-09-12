import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilities} from './abilities'
import {tipResourcesRouter} from './tip-resources'
import {searchRouter} from './search'
import {lessonResourcesRouter} from './lesson-resources'

export const appRouter = mergeRouters(
  router({
    abilities: abilities,
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
    search: searchRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
