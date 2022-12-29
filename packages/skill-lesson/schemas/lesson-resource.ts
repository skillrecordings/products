import z from 'zod'

import {BaseLessonResourceSchema} from './base-lesson-resource'

export const LessonResourceSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
  })
  .merge(BaseLessonResourceSchema)

export type LessonResource = z.infer<typeof LessonResourceSchema>
