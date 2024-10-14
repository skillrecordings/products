import z from 'zod'

import {ResourceSchema} from './resource'

export const LessonResourceSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    resources: z.array(ResourceSchema).nullish(),
    visibility: z.enum(['public', 'paid', 'subscribed']).optional().nullable(),
  })
  .merge(ResourceSchema)

export const SolutionResourceSchema = LessonResourceSchema.omit({_id: true})

export type Lesson = z.infer<typeof LessonResourceSchema>
export type Solution = z.infer<typeof SolutionResourceSchema>
