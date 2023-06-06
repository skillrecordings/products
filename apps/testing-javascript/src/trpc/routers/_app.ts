import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilitiesRouter} from './abilities'
import {productsRouter} from './products'

export const appRouter = mergeRouters(
  router({
    abilities: abilitiesRouter,
    products: productsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
