import {ResourceSchema} from './resource'
import z from 'zod'
import {SolutionResourceSchema} from './lesson'

export const ExerciseSchema = z
  .object({
    solution: z.nullable(SolutionResourceSchema.optional()),
  })
  .merge(ResourceSchema)

export type Exercise = z.infer<typeof ExerciseSchema>
