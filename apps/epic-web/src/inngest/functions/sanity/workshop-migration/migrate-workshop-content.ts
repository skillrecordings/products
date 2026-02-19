import {inngest} from 'inngest/inngest.server'
import {sanityWriteClient} from 'utils/sanity-server'
import {NonRetriableError} from 'inngest'
import slugify from 'slugify'
import {
  WORKSHOP_MIGRATION_EVENT,
  WorkshopMigrationDataSchema,
  type ContentItem,
  type Solution,
} from './workshop-migration-events'

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

interface VideoInput {
  title: string
  muxAssetId: string
  muxPlaybackId: string
  transcript?: string | null
  srt?: string | null
}

async function findOrCreateVideoResource(input: VideoInput): Promise<string> {
  const {title, muxAssetId, muxPlaybackId, transcript, srt} = input

  // Check if video already exists by muxAssetId
  const existingVideo = await sanityWriteClient.fetch(
    `*[_type == "videoResource" && muxAsset.muxAssetId == $muxAssetId][0]`,
    {muxAssetId},
  )

  if (existingVideo) {
    console.info(`Video already exists: ${existingVideo._id} (${title})`)
    return existingVideo._id
  }

  // Create new videoResource with state: "ready" (skip processing pipeline)
  const videoDoc: Record<string, unknown> = {
    _type: 'videoResource',
    title,
    slug: {
      _type: 'slug',
      current: slugify(title, {lower: true, strict: true}),
    },
    state: 'ready', // Already processed, skip webhooks
    muxAsset: {
      muxAssetId,
      muxPlaybackId,
    },
  }

  // Add transcript if available
  if (transcript || srt) {
    videoDoc.transcript = {
      ...(transcript && {text: transcript}),
      ...(srt && {srt}),
    }
  }

  const created = await sanityWriteClient.create(videoDoc)
  console.info(`Created video: ${created._id} (${title})`)
  return created._id
}

export const migrateWorkshopContent = inngest.createFunction(
  {
    id: 'workshop-content-migration',
    name: 'Migrate Workshop Content from Course Builder',
    concurrency: 1,
  },
  {
    event: WORKSHOP_MIGRATION_EVENT,
  },
  async ({event, step}) => {
    const {workshopId, migrationData} = event.data

    // Validate the migration data
    const validatedData = await step.run(
      'validate migration data',
      async () => {
        const result = WorkshopMigrationDataSchema.safeParse(migrationData)
        if (!result.success) {
          throw new NonRetriableError(
            `Invalid migration data: ${result.error.message}`,
          )
        }
        return result.data
      },
    )

    // Verify workshop exists
    const workshop = await step.run('verify workshop exists', async () => {
      const doc = await sanityWriteClient.getDocument(workshopId)
      if (!doc) {
        throw new NonRetriableError(`Workshop with ID ${workshopId} not found`)
      }
      return doc
    })

    const results = {
      sectionsCreated: [] as string[],
      lessonsCreated: [] as string[],
      exercisesCreated: [] as string[],
      solutionsEmbedded: [] as string[],
      videosCreated: [] as string[],
      warnings: [] as string[],
    }

    // Process each section
    for (const [sectionName, sectionContent] of Object.entries(validatedData)) {
      // Create the section
      const sectionId = await step.run(
        `create section: ${sectionName}`,
        async () => {
          const sectionDoc = {
            _type: 'section',
            title: sectionName,
            slug: {
              _type: 'slug',
              current: slugify(sectionName.toLowerCase()),
            },
            resources: [],
          }

          const created = await sanityWriteClient.create(sectionDoc)
          return created._id
        },
      )

      results.sectionsCreated.push(sectionName)

      // Process each subsection's resources
      for (const [_subsectionName, resources] of Object.entries(
        sectionContent,
      )) {
        if (!Array.isArray(resources)) {
          results.warnings.push(`${_subsectionName} is not an array, skipping`)
          continue
        }

        for (const item of resources as ContentItem[]) {
          if (item.type === 'exercise') {
            // Handle exercise with solution
            const exerciseResult = await step.run(
              `create exercise: ${item.title}`,
              async () => {
                const slug = slugify(item.title, {
                  lower: true,
                  strict: true,
                }).replace(/\./g, '-')

                // Find or create video
                const videoId = await findOrCreateVideoResource({
                  title: item.title,
                  muxAssetId: item.muxAssetId,
                  muxPlaybackId: item.muxPlaybackId,
                  transcript: item.transcript,
                  srt: item.srt,
                })

                // Create exercise document
                const exerciseDoc = {
                  _type: 'exercise',
                  title: item.title,
                  description: item.description || '',
                  body: '',
                  slug: {
                    _type: 'slug',
                    current: slug,
                  },
                  resources: [
                    {
                      _type: 'reference',
                      _ref: videoId,
                      _key: generateKey(),
                    },
                    ...(item.code
                      ? [
                          {
                            _type: 'workshopApp',
                            path: item.code,
                            _key: generateKey(),
                          },
                        ]
                      : []),
                  ],
                }

                const createdExercise = await sanityWriteClient.create(
                  exerciseDoc,
                )

                // If solution exists, embed it in the exercise
                if (item.solution) {
                  const solution = item.solution as Solution
                  const solutionVideoId = await findOrCreateVideoResource({
                    title: solution.title,
                    muxAssetId: solution.muxAssetId,
                    muxPlaybackId: solution.muxPlaybackId,
                    transcript: solution.transcript,
                    srt: solution.srt,
                  })

                  await sanityWriteClient
                    .patch(createdExercise._id)
                    .set({
                      resources: [
                        ...exerciseDoc.resources,
                        {
                          _key: generateKey(),
                          _type: 'solution',
                          title: solution.title,
                          description: solution.description || '',
                          slug: {
                            _type: 'slug',
                            current: slugify(solution.title, {
                              lower: true,
                              strict: true,
                            }),
                          },
                          resources: [
                            {
                              _key: generateKey(),
                              _ref: solutionVideoId,
                              _type: 'reference',
                            },
                            ...(solution.code
                              ? [
                                  {
                                    _key: generateKey(),
                                    _type: 'workshopApp',
                                    path: solution.code,
                                  },
                                ]
                              : []),
                          ],
                        },
                      ],
                    })
                    .commit()

                  return {
                    success: true,
                    exerciseId: createdExercise._id,
                    solutionEmbedded: true,
                    solutionTitle: solution.title,
                  }
                }

                return {
                  success: true,
                  exerciseId: createdExercise._id,
                  solutionEmbedded: false,
                }
              },
            )

            if (exerciseResult.success && exerciseResult.exerciseId) {
              results.exercisesCreated.push(item.title)
              if (
                exerciseResult.solutionEmbedded &&
                exerciseResult.solutionTitle
              ) {
                results.solutionsEmbedded.push(exerciseResult.solutionTitle)
              }

              // Attach exercise to section
              await step.run(
                `attach exercise to section: ${item.title}`,
                async () => {
                  await sanityWriteClient
                    .patch(sectionId)
                    .setIfMissing({resources: []})
                    .append('resources', [
                      {
                        _type: 'reference',
                        _ref: exerciseResult.exerciseId,
                        _key: generateKey(),
                      },
                    ])
                    .commit()
                },
              )
            }
          } else {
            // Handle lesson/explainer
            const lessonResult = await step.run(
              `create ${item.type}: ${item.title}`,
              async () => {
                const slug = slugify(item.title, {
                  lower: true,
                  strict: true,
                }).replace(/\./g, '-')

                // Find or create video
                const videoId = await findOrCreateVideoResource({
                  title: item.title,
                  muxAssetId: item.muxAssetId,
                  muxPlaybackId: item.muxPlaybackId,
                  transcript: item.transcript,
                  srt: item.srt,
                })

                const lessonDoc = {
                  _type: item.type,
                  title: item.title,
                  description: item.description || '',
                  body: '',
                  slug: {
                    _type: 'slug',
                    current: slug,
                  },
                  resources: [
                    {
                      _type: 'reference',
                      _ref: videoId,
                      _key: generateKey(),
                    },
                    ...(item.code
                      ? [
                          {
                            _type: 'workshopApp',
                            path: item.code,
                            _key: generateKey(),
                          },
                        ]
                      : []),
                  ],
                }

                const created = await sanityWriteClient.create(lessonDoc)
                return {success: true, lessonId: created._id}
              },
            )

            if (lessonResult.success && lessonResult.lessonId) {
              results.lessonsCreated.push(item.title)

              // Attach lesson to section
              await step.run(
                `attach ${item.type} to section: ${item.title}`,
                async () => {
                  await sanityWriteClient
                    .patch(sectionId)
                    .setIfMissing({resources: []})
                    .append('resources', [
                      {
                        _type: 'reference',
                        _ref: lessonResult.lessonId,
                        _key: generateKey(),
                      },
                    ])
                    .commit()
                },
              )
            }
          }
        }
      }

      // Attach section to workshop
      await step.run(`attach section to workshop: ${sectionName}`, async () => {
        await sanityWriteClient
          .patch(workshopId)
          .setIfMissing({resources: []})
          .append('resources', [
            {
              _type: 'reference',
              _ref: sectionId,
              _key: generateKey(),
            },
          ])
          .commit()
      })
    }

    return {
      success: true,
      workshopId,
      workshopTitle: workshop.title,
      summary: {
        sectionsCreated: results.sectionsCreated.length,
        lessonsCreated: results.lessonsCreated.length,
        exercisesCreated: results.exercisesCreated.length,
        solutionsEmbedded: results.solutionsEmbedded.length,
        warnings: results.warnings.length,
      },
      details: results,
    }
  },
)
