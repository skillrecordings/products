import {BaseLessonResourceSchema} from './base-lesson-resource'
import z from 'zod'

export const SolutionSchema = z
  .object({
    _key: z.string().optional(),
  })
  .merge(BaseLessonResourceSchema)

export type Solution = z.infer<typeof SolutionSchema>
