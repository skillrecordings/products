import {z} from 'zod'

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
  nextSection: z
    .object({
      id: z.string(),
      slug: z.string(),
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
          lessonCompleted: z.boolean().default(false),
        }),
      ),
    }),
  ),
  lessons: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      lessonCompleted: z.boolean().default(false),
    }),
  ),
})

export type ModuleProgress = z.infer<typeof ModuleProgressSchema>
