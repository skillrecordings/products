import * as React from 'react'
import {z} from 'zod'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'

export const ModuleProgressContext = React.createContext<
  ModuleProgress | null | undefined
>(null)

export function useModuleProgress() {
  return React.useContext(ModuleProgressContext)
}

export const ModuleProgressProvider: React.FC<React.PropsWithChildren<any>> = ({
  children,
  moduleSlug,
  skipQuery = false,
}) => {
  const {data: moduleProgress} =
    trpcSkillLessons.moduleProgress.bySlug.useQuery(
      {
        slug: moduleSlug,
      },
      {
        enabled: !skipQuery,
      },
    )

  return (
    <ModuleProgressContext.Provider value={skipQuery ? null : moduleProgress}>
      {children}
    </ModuleProgressContext.Provider>
  )
}

export const ModuleProgressSchema = z.object({
  moduleId: z.string(),
  moduleType: z.string().optional(),
  moduleCompleted: z.boolean(),
  percentComplete: z.number(),
  lessonCount: z.number(),
  completedLessonCount: z.number(),
  nextLesson: z
    .object({
      id: z.string(),
      slug: z.string(),
      title: z.string(),
    })
    .nullish(),
  nextSection: z
    .object({
      id: z.string(),
      slug: z.string(),
      title: z.string(),
    })
    .nullish(),
  sections: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      sectionCompleted: z.boolean(),
      percentComplete: z.number(),
      lessonCount: z.number(),
      completedLessonCount: z.number(),
      lessons: z.array(
        z.object({
          id: z.string(),
          slug: z.string(),
          title: z.string(),
          lessonCompleted: z.boolean().default(false),
        }),
      ),
    }),
  ),
  lessons: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      title: z.string(),
      lessonCompleted: z.boolean().default(false),
    }),
  ),
  moduleCompletedAt: z.string().nullable(),
})

export type ModuleProgress = z.infer<typeof ModuleProgressSchema>
export type SectionProgress =
  | z.infer<typeof ModuleProgressSchema>['sections'][number]
  | undefined
