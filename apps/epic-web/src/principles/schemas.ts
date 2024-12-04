import {z} from 'zod'

// Base schemas for common fields
const sluggedSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
})

// Example schema for individual examples
const exampleSchema = z.string()

// Schema for a principle
const principleSchema = sluggedSchema.extend({
  examples: z.array(exampleSchema).optional(),
  details: z.string().optional(),
})

// Schema for a subsection with principles
const subsectionSchema = z.object({
  slug: z.string(),
  title: z.string(),
  principles: z.array(principleSchema),
})

// Schema for a main section that might have subsections
const sectionSchema = sluggedSchema.extend({
  subsections: z.array(subsectionSchema).optional(),
  principles: z.array(principleSchema).optional(),
})

// Root schema for the entire document
export const epicPrinciplesSchema = z.object({
  version: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  sections: z.array(sectionSchema),
})

// Type inference
export type EpicPrinciples = z.infer<typeof epicPrinciplesSchema>
export type Section = z.infer<typeof sectionSchema>
export type Subsection = z.infer<typeof subsectionSchema>
export type Principle = z.infer<typeof principleSchema>
export type Example = z.infer<typeof exampleSchema>

// Validation function
export function validateEpicPrinciples(data: unknown): EpicPrinciples {
  return epicPrinciplesSchema.parse(data)
}

// Validation function that returns a Result
export function validateEpicPrinciplesResult(data: unknown): {
  success: boolean
  data?: EpicPrinciples
  error?: z.ZodError
} {
  try {
    const validated = epicPrinciplesSchema.parse(data)
    return {success: true, data: validated}
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {success: false, error}
    }
    throw error
  }
}
