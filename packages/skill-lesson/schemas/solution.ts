import {ResourceSchema} from './resource'
import z from 'zod'

export const SolutionSchema = z
  .object({
    _key: z.string().optional(),
  })
  .merge(ResourceSchema)

export type Solution = z.infer<typeof SolutionSchema>
