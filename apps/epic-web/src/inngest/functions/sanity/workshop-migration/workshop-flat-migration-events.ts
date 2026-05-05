import {z} from 'zod'

export const WORKSHOP_FLAT_MIGRATION_EVENT = 'sanity/workshop-flat-migration'

export const WorkshopFlatMigrationDataSchema = z
  .object({
    workshopId: z.string(),
    dropboxFolderPath: z.string().optional(),
    dropboxFolderUrl: z.string().url().optional(),
    dropboxLayout: z.enum(['flat', 'nested']).default('flat'),
    workshopName: z.string().optional(),
    codePathPrefix: z.string().optional(),
  })
  .refine((d) => Boolean(d.dropboxFolderPath) !== Boolean(d.dropboxFolderUrl), {
    message: 'Provide exactly one of dropboxFolderPath or dropboxFolderUrl.',
    path: ['dropboxFolderPath'],
  })

export type WorkshopFlatMigrationData = z.infer<
  typeof WorkshopFlatMigrationDataSchema
>

export type WorkshopFlatMigrationEvent = {
  name: typeof WORKSHOP_FLAT_MIGRATION_EVENT
  data: WorkshopFlatMigrationData
}
