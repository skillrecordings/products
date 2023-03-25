import * as React from 'react'
import {z} from 'zod'
import {trpc} from '../trpc/trpc.client'

export const ModuleProgressContext = React.createContext<
  ModuleProgress | null | undefined
>(null)

export function useModuleProgress() {
  return React.useContext(ModuleProgressContext)
}

export const ModuleProgressProvider: React.FC<React.PropsWithChildren<any>> = ({
  children,
  moduleSlug,
}) => {
  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: moduleSlug,
  })

  return (
    <ModuleProgressContext.Provider value={moduleProgress}>
      {children}
    </ModuleProgressContext.Provider>
  )
}

export const ModuleProgressSchema = z.object({
  moduleId: z.string(),
  moduleCompleted: z.boolean(),
  percentComplete: z.number(),
  lessonCount: z.number(),
  completedLessonCount: z.number(),
  nextLesson: z
    .object({
      id: z.string(),
      slug: z.string(),
    })
    .nullish(),
  lessons: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      lessonCompleted: z.boolean().default(false),
    }),
  ),
})

export type ModuleProgress = z.infer<typeof ModuleProgressSchema>
