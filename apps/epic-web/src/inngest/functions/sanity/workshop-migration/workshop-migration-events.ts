import {z} from 'zod'

export const WORKSHOP_MIGRATION_EVENT = 'sanity/workshop-migration'

const SolutionSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  muxAssetId: z.string(),
  muxPlaybackId: z.string(),
  transcript: z.string().nullable().optional(),
  srt: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
})

const ContentItemSchema = z.object({
  type: z.enum(['lesson', 'exercise', 'explainer']),
  title: z.string(),
  description: z.string().nullable().optional(),
  muxAssetId: z.string(),
  muxPlaybackId: z.string(),
  transcript: z.string().nullable().optional(),
  srt: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  solution: SolutionSchema.optional(),
})

const SectionContentSchema = z.record(z.string(), z.array(ContentItemSchema))

export const WorkshopMigrationDataSchema = z.record(
  z.string(),
  SectionContentSchema,
)

export type WorkshopMigrationData = z.infer<typeof WorkshopMigrationDataSchema>
export type ContentItem = z.infer<typeof ContentItemSchema>
export type Solution = z.infer<typeof SolutionSchema>

export type WorkshopMigrationEventData = {
  workshopId: string
  migrationData: WorkshopMigrationData
}

export type WorkshopMigrationEvent = {
  name: typeof WORKSHOP_MIGRATION_EVENT
  data: WorkshopMigrationEventData
}
