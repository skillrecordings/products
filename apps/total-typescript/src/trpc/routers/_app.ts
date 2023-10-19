import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {solutionsRouter} from './solutions'
import {stackblitzResourceRouter} from './stackblitz-resources'
import {searchRouter} from './search'
import {certificateRouter} from './certificate'

export const appRouter = mergeRouters(
  router({
    workshops: workshop,
    abilities: abilities,
    solutions: solutionsRouter,
    stackblitz: stackblitzResourceRouter,
    search: searchRouter,
    certificate: certificateRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
