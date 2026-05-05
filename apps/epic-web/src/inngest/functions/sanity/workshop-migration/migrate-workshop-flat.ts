import {inngest} from 'inngest/inngest.server'
import {sanityWriteClient} from 'utils/sanity-server'
import {NonRetriableError} from 'inngest'
import slugify from 'slugify'

import {
  WORKSHOP_FLAT_MIGRATION_EVENT,
  WorkshopFlatMigrationDataSchema,
} from './workshop-flat-migration-events'
import {
  getDropboxClient,
  listAllFilesFlat,
  getOrCreateSharedLink,
} from 'lib/dropbox/client'
import {parseFlatLayout, type FlatItem} from 'lib/dropbox/flat-layout'

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Creates a videoResource with `state: 'new'` + `originalMediaUrl`. The
 * Sanity webhook (videoResource/created) picks this up and triggers the
 * downstream Inngest pipeline:
 *   1. Create Mux asset
 *   2. Order Deepgram transcription
 *   3. Save transcript / SRT on the videoResource
 *
 * Mirrors `createVideoResource` in `migrate-workshop-aws.ts:23-43`.
 */
async function createVideoResource(
  title: string,
  originalMediaUrl: string,
): Promise<string> {
  const videoDoc = {
    _type: 'videoResource',
    title,
    slug: {
      _type: 'slug',
      current: slugify(title, {lower: true, strict: true}),
    },
    state: 'new',
    originalMediaUrl,
  }

  const created = await sanityWriteClient.create(videoDoc)
  console.info(
    `Created video: ${created._id} (${title}) - will trigger processing`,
  )
  return created._id
}

/**
 * Migrate a workshop whose source videos live in a flat Dropbox folder.
 *
 * Same shape as `migrateWorkshopFromAws` but for the flat naming convention
 * (filenames encode section/item position + kind). Single Inngest event for
 * the whole workshop; sections are derived from the parsed filenames.
 *
 * Flow per item:
 *   - Create Sanity videoResource with originalMediaUrl pointing to the
 *     Dropbox public shared-link URL (?dl=1).
 *   - Sanity webhook fires → existing `processVideoResource` Inngest
 *     function uploads to Mux and orders Deepgram.
 *
 * This function does NOT talk to Mux. It just writes to Sanity.
 */
export const migrateWorkshopFlat = inngest.createFunction(
  {
    id: 'workshop-flat-migration',
    name: 'Migrate Workshop from Flat Dropbox Layout',
    concurrency: 1,
  },
  {event: WORKSHOP_FLAT_MIGRATION_EVENT},
  async ({event, step}) => {
    const data = WorkshopFlatMigrationDataSchema.parse(event.data)
    if (data.dropboxLayout !== 'flat') {
      throw new NonRetriableError(
        'this function only handles dropboxLayout=flat',
      )
    }

    const {
      workshopId,
      dropboxFolderPath,
      dropboxFolderUrl,
      workshopName,
      codePathPrefix,
    } = data

    // ── 1. verify workshop ────────────────────────────────────────────────
    const workshop = await step.run('verify-workshop', async () => {
      const doc = await sanityWriteClient.getDocument(workshopId)
      if (!doc) {
        throw new NonRetriableError(`Workshop with ID ${workshopId} not found`)
      }
      return doc
    })

    // ── 2. list dropbox folder (resolve URL → path if needed) ─────────────
    const entries = await step.run('list-dropbox', async () => {
      const dbx = getDropboxClient()
      let folderPath: string
      if (dropboxFolderUrl) {
        const meta = await dbx.sharingGetSharedLinkMetadata({
          url: dropboxFolderUrl,
        })
        const resolved = meta.result.path_lower
        if (!resolved) {
          throw new NonRetriableError(
            `Could not resolve ${dropboxFolderUrl} to a path in your Dropbox namespace. ` +
              `The folder must be owned by (or mounted under) the account that owns DROPBOX_ACCESS_TOKEN. ` +
              `Mount the folder in your Dropbox and re-run with --dropbox-path "/path/to/folder", ` +
              `or have the owner share it into your account.`,
          )
        }
        folderPath = resolved
      } else {
        folderPath = dropboxFolderPath as string
      }
      return listAllFilesFlat(dbx, folderPath)
    })

    if (entries.length === 0) {
      throw new NonRetriableError(
        `No video files found in Dropbox folder (${
          dropboxFolderUrl ?? dropboxFolderPath
        }). Confirm the folder contains .mp4/.mov/.webm/.mkv files and that the access token can see it.`,
      )
    }

    // ── 3. parse flat layout ──────────────────────────────────────────────
    const parsed = await step.run('parse-flat', async () => {
      const result = parseFlatLayout(entries, {workshopName})
      return result
    })

    // ── 4. resolve per-file shared links ──────────────────────────────────
    const sharedLinks = await step.run('resolve-shared-links', async () => {
      const dbx = getDropboxClient()
      const allPaths = new Set<string>()
      const collect = (item: FlatItem) => {
        if (item.kind === 'exercise') {
          allPaths.add(item.problem.path)
          if (item.solution) allPaths.add(item.solution.path)
        } else {
          allPaths.add(item.entry.path)
        }
      }
      parsed.introItems.forEach(collect)
      parsed.outroItems.forEach(collect)
      for (const section of parsed.sections) {
        section.items.forEach(collect)
      }

      const map: Record<string, string> = {}
      for (const p of Array.from(allPaths)) {
        map[p] = await getOrCreateSharedLink(dbx, p)
      }
      return map
    })

    // ── 5. iterate virtual sections (intro + sections + outro) ────────────
    type VirtualSection = {title: string; items: FlatItem[]}
    const virtualSections: VirtualSection[] = []
    if (parsed.introItems.length > 0) {
      virtualSections.push({title: 'Introduction', items: parsed.introItems})
    }
    for (const s of parsed.sections) {
      virtualSections.push({title: s.title, items: s.items})
    }
    if (parsed.outroItems.length > 0) {
      virtualSections.push({title: 'Outro', items: parsed.outroItems})
    }

    const results = {
      sectionsCreated: 0,
      lessonsCreated: [] as string[],
      exercisesCreated: [] as string[],
      solutionsEmbedded: [] as string[],
      videosCreated: [] as string[],
      warnings: parsed.warnings,
    }

    for (const vsection of virtualSections) {
      // ── 5a. create section doc ────────────────────────────────────────
      const sectionId: string = await step.run(
        `create section: ${vsection.title}`,
        async () => {
          const sectionDoc = {
            _type: 'section',
            title: vsection.title,
            slug: {
              _type: 'slug',
              current: slugify(vsection.title, {
                lower: true,
                strict: true,
              }),
            },
            resources: [],
          }
          const created = await sanityWriteClient.create(sectionDoc)
          return created._id
        },
      )
      results.sectionsCreated += 1

      // ── 5b. process items ────────────────────────────────────────────
      for (const item of vsection.items) {
        if (item.kind === 'exercise') {
          const problemUrl = sharedLinks[item.problem.path]
          const solutionUrl = item.solution
            ? sharedLinks[item.solution.path]
            : undefined

          if (!problemUrl) {
            throw new NonRetriableError(
              `Missing shared link for problem: ${item.problem.path}`,
            )
          }

          const exerciseResult = await step.run(
            `create exercise: ${item.title}`,
            async () => {
              const slug = slugify(item.title, {
                lower: true,
                strict: true,
              }).replace(/\./g, '-')

              // Create the problem video — webhook will trigger Mux + Deepgram
              const videoId = await createVideoResource(item.title, problemUrl)
              results.videosCreated.push(item.title)

              const exerciseDoc = {
                _type: 'exercise',
                title: item.title,
                description: '',
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
                  ...(codePathPrefix
                    ? [
                        {
                          _type: 'workshopApp',
                          path: `${codePathPrefix}/${slug}`,
                          _key: generateKey(),
                        },
                      ]
                    : []),
                ],
              }

              const createdExercise = await sanityWriteClient.create(
                exerciseDoc,
              )

              if (item.solution && solutionUrl) {
                const solutionTitle = `${item.title} (Solution)`
                const solutionVideoId = await createVideoResource(
                  solutionTitle,
                  solutionUrl,
                )
                results.videosCreated.push(solutionTitle)

                await sanityWriteClient
                  .patch(createdExercise._id)
                  .set({
                    resources: [
                      ...exerciseDoc.resources,
                      {
                        _key: generateKey(),
                        _type: 'solution',
                        title: solutionTitle,
                        description: '',
                        slug: {
                          _type: 'slug',
                          current: slugify(solutionTitle, {
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
                          ...(codePathPrefix
                            ? [
                                {
                                  _key: generateKey(),
                                  _type: 'workshopApp',
                                  path: `${codePathPrefix}/${slug}`,
                                },
                              ]
                            : []),
                        ],
                      },
                    ],
                  })
                  .commit()

                return {
                  exerciseId: createdExercise._id,
                  solutionEmbedded: true,
                  solutionTitle,
                }
              }

              return {
                exerciseId: createdExercise._id,
                solutionEmbedded: false as const,
                solutionTitle: undefined,
              }
            },
          )

          results.exercisesCreated.push(item.title)
          if (exerciseResult.solutionEmbedded && exerciseResult.solutionTitle) {
            results.solutionsEmbedded.push(exerciseResult.solutionTitle)
          }

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
        } else {
          // Non-exercise: intro-workshop / outro-workshop / section-intro / lesson / explainer
          const url = sharedLinks[item.entry.path]
          if (!url) {
            throw new NonRetriableError(
              `Missing shared link for: ${item.entry.path}`,
            )
          }

          const docType = item.kind === 'explainer' ? 'explainer' : 'lesson'

          const lessonId: string = await step.run(
            `create ${docType}: ${item.title}`,
            async () => {
              const slug = slugify(item.title, {
                lower: true,
                strict: true,
              }).replace(/\./g, '-')

              const videoId = await createVideoResource(item.title, url)
              results.videosCreated.push(item.title)

              const lessonDoc = {
                _type: docType,
                title: item.title,
                description: '',
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
                  ...(codePathPrefix
                    ? [
                        {
                          _type: 'workshopApp',
                          path: `${codePathPrefix}/${slug}`,
                          _key: generateKey(),
                        },
                      ]
                    : []),
                ],
              }
              const created = await sanityWriteClient.create(lessonDoc)
              return created._id
            },
          )

          results.lessonsCreated.push(item.title)

          await step.run(
            `attach ${docType} to section: ${item.title}`,
            async () => {
              await sanityWriteClient
                .patch(sectionId)
                .setIfMissing({resources: []})
                .append('resources', [
                  {
                    _type: 'reference',
                    _ref: lessonId,
                    _key: generateKey(),
                  },
                ])
                .commit()
            },
          )
        }
      }

      // ── 5c. attach section to workshop ────────────────────────────────
      await step.run(
        `attach section to workshop: ${vsection.title}`,
        async () => {
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
        },
      )
    }

    return {
      success: true,
      workshopId,
      workshopTitle: (workshop as {title?: string} | null)?.title,
      summary: {
        sectionsCreated: results.sectionsCreated,
        lessonsCreated: results.lessonsCreated.length,
        exercisesCreated: results.exercisesCreated.length,
        solutionsEmbedded: results.solutionsEmbedded.length,
        videosCreated: results.videosCreated.length,
      },
      warnings: results.warnings,
      details: results,
    }
  },
)
