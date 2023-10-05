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
import {userRouter} from './user'
import {deviceVerificationRouter} from 'trpc/routers/device-verification'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
    moduleResources: moduleResourcesRouter,
    tips: tipsRouter,
    abilities: abilitiesRouter,
    user: userRouter,
    deviceVerification: deviceVerificationRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
