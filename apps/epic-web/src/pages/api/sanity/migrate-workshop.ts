import {NextApiRequest, NextApiResponse} from 'next'
import {inngest} from 'inngest/inngest.server'
import {
  WORKSHOP_MIGRATION_EVENT,
  WorkshopMigrationDataSchema,
} from 'inngest/functions/sanity/workshop-migration'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'})
  }

  // Simple API key auth - you can make this more robust
  const apiKey = req.headers['x-api-key']
  if (apiKey !== process.env.MIGRATION_API_KEY) {
    return res.status(401).json({error: 'Unauthorized'})
  }

  const {workshopId, migrationData} = req.body

  if (!workshopId) {
    return res.status(400).json({error: 'workshopId is required'})
  }

  if (!migrationData) {
    return res.status(400).json({error: 'migrationData is required'})
  }

  // Validate the migration data schema
  const validationResult = WorkshopMigrationDataSchema.safeParse(migrationData)
  if (!validationResult.success) {
    return res.status(400).json({
      error: 'Invalid migration data format',
      details: validationResult.error.issues,
    })
  }

  try {
    // Send the event to Inngest
    await inngest.send({
      name: WORKSHOP_MIGRATION_EVENT,
      data: {
        workshopId,
        migrationData: validationResult.data,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Migration event sent to Inngest',
      workshopId,
    })
  } catch (error) {
    console.error('Failed to send migration event:', error)
    return res.status(500).json({
      error: 'Failed to trigger migration',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
