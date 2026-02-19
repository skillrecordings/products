import {z} from 'zod'

export const WORKSHOP_AWS_MIGRATION_EVENT = 'sanity/workshop-aws-migration'
export const WORKSHOP_AWS_SECTION_EVENT = 'sanity/workshop-aws-section'

const SolutionSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  awsUrl: z.string(),
  code: z.string().nullable().optional(),
})

const ContentItemSchema = z.object({
  type: z.enum(['lesson', 'exercise', 'explainer']),
  title: z.string(),
  description: z.string().nullable().optional(),
  awsUrl: z.string(),
  code: z.string().nullable().optional(),
  solution: SolutionSchema.optional(),
})

// Section name -> array of content items (no subsections)
export const WorkshopAwsMigrationDataSchema = z.record(
  z.string(),
  z.array(ContentItemSchema),
)

// Single section data
export const SectionDataSchema = z.array(ContentItemSchema)

export type WorkshopAwsMigrationData = z.infer<
  typeof WorkshopAwsMigrationDataSchema
>
export type SectionData = z.infer<typeof SectionDataSchema>
export type AwsContentItem = z.infer<typeof ContentItemSchema>
export type AwsSolution = z.infer<typeof SolutionSchema>

export type WorkshopAwsMigrationEventData = {
  workshopId: string
  migrationData: WorkshopAwsMigrationData
}

export type WorkshopAwsSectionEventData = {
  workshopId: string
  sectionName: string
  sectionItems: AwsContentItem[]
}

export type WorkshopAwsMigrationEvent = {
  name: typeof WORKSHOP_AWS_MIGRATION_EVENT
  data: WorkshopAwsMigrationEventData
}

export type WorkshopAwsSectionEvent = {
  name: typeof WORKSHOP_AWS_SECTION_EVENT
  data: WorkshopAwsSectionEventData
}
