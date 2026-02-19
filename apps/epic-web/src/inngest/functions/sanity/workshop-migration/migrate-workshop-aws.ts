import {inngest} from 'inngest/inngest.server'
import {sanityWriteClient} from 'utils/sanity-server'
import {NonRetriableError} from 'inngest'
import slugify from 'slugify'
import {
  WORKSHOP_AWS_SECTION_EVENT,
  type AwsContentItem,
  type AwsSolution,
} from './workshop-aws-migration-events'

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Creates a videoResource with originalMediaUrl.
 * This triggers the video processing pipeline:
 * 1. Sanity webhook fires
 * 2. Inngest creates Mux asset
 * 3. Inngest orders Deepgram transcription
 * 4. Deepgram webhook saves transcript/SRT
 */
async function createVideoResource(
  title: string,
  awsUrl: string,
): Promise<string> {
  const videoDoc = {
    _type: 'videoResource',
    title,
    slug: {
      _type: 'slug',
      current: slugify(title, {lower: true, strict: true}),
    },
    state: 'new', // Triggers processing pipeline
    originalMediaUrl: awsUrl,
  }

  const created = await sanityWriteClient.create(videoDoc)
  console.info(
    `Created video: ${created._id} (${title}) - will trigger processing`,
  )
  return created._id
}

/**
 * Processes a single section - called once per section to avoid 1MB limit
 */
export const migrateWorkshopFromAws = inngest.createFunction(
  {
    id: 'workshop-aws-section-migration',
    name: 'Migrate Workshop Section from AWS',
    concurrency: 1, // Process one section at a time
  },
  {
    event: WORKSHOP_AWS_SECTION_EVENT,
  },
  async ({event, step}) => {
    const {workshopId, sectionName, sectionItems} = event.data

    // Verify workshop exists
    const workshop = await step.run('verify workshop exists', async () => {
      const doc = await sanityWriteClient.getDocument(workshopId)
      if (!doc) {
        throw new NonRetriableError(`Workshop with ID ${workshopId} not found`)
      }
      return doc
    })

    const results = {
      lessonsCreated: [] as string[],
      exercisesCreated: [] as string[],
      solutionsEmbedded: [] as string[],
      videosCreated: [] as string[],
    }

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

    // Process each item in the section
    for (const item of sectionItems as AwsContentItem[]) {
      if (item.type === 'exercise') {
        // Handle exercise with solution
        const exerciseResult = await step.run(
          `create exercise: ${item.title}`,
          async () => {
            const slug = slugify(item.title, {
              lower: true,
              strict: true,
            }).replace(/\./g, '-')

            // Create video (triggers processing pipeline)
            const videoId = await createVideoResource(item.title, item.awsUrl)
            results.videosCreated.push(item.title)

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

            const createdExercise = await sanityWriteClient.create(exerciseDoc)

            // If solution exists, embed it in the exercise
            if (item.solution) {
              const solution = item.solution as AwsSolution
              const solutionVideoId = await createVideoResource(
                solution.title,
                solution.awsUrl,
              )
              results.videosCreated.push(solution.title)

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
          if (exerciseResult.solutionEmbedded && exerciseResult.solutionTitle) {
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

            // Create video (triggers processing pipeline)
            const videoId = await createVideoResource(item.title, item.awsUrl)
            results.videosCreated.push(item.title)

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

    return {
      success: true,
      workshopId,
      workshopTitle: workshop.title,
      sectionName,
      sectionId,
      summary: {
        lessonsCreated: results.lessonsCreated.length,
        exercisesCreated: results.exercisesCreated.length,
        solutionsEmbedded: results.solutionsEmbedded.length,
        videosCreated: results.videosCreated.length,
      },
      details: results,
    }
  },
)
