// Running this script:
//
// Ensure you have `dataFilePath` set to the location of the formatted export
// of Epic React data. Also, be sure to set `SANITY_EDITOR_TOKEN` in your
// `.env.local` environment variables file.
//
// Execute the Mux Asset Upload script with:
//
// ```
// npx ts-node --files --skipProject src/data/sanity-import-2.ts
// ```

import fs from 'fs'
import fetch from 'node-fetch'
import Mux from '@mux/mux-node'
// import sanityClient from '@sanity/client'
import {v4 as uuidv4} from 'uuid'
import {z, ZodError} from 'zod'
import csvParser from 'csv-parser'
import last from 'lodash/last'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import slugify from 'slugify'

require('dotenv-flow').config({
  default_node_env: 'development',
})

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: DATASET,
  SANITY_EDITOR_TOKEN: EDITOR_TOKEN,
  NEXT_PUBLIC_SANITY_API_VERSION: API_VERSION,
  SANITY_IMPORT_DATA_FILE_PATH: dataFilePath,
} = process.env

// Set up Mux API Client
const MUX_ACCESS_TOKEN = process.env.MUX_ACCESS_TOKEN as string
const MUX_SECRET_KEY = process.env.MUX_SECRET_KEY as string
const muxClient = new Mux(MUX_ACCESS_TOKEN, MUX_SECRET_KEY)
const {Video} = muxClient

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const readJsonData = (path: string) => {
  let fileData = fs.readFileSync(path)
  return JSON.parse(fileData.toString())
}

// copied from https://github.com/eggheadio/epic-react-gatsby/blob/main/plugins/gatsby-source-egghead-epic-react/lib/parse-epic-react.js
function parseEpicReactTitle(title: string, seperator = `~`) {
  const [contentId, contentSection, contentLabel, contentDetail] =
    title.split(seperator)
  return {contentId, contentSection, contentLabel, contentDetail}
}

function resourceSlugFromTitle(title: string) {
  const {contentSection, contentLabel} = parseEpicReactTitle(title)
  return slugify(
    contentLabel
      ? `${contentSection && contentSection.toLowerCase()} ${
          contentLabel && contentLabel.toLowerCase()
        }`
      : `${contentSection && contentSection.toLowerCase()}`,
    {
      remove: /[*+~.()'"!:@]/g,
    },
  )
}

function collectionSlugfromTitle(title: string) {
  return slugify(title.toLowerCase(), {
    remove: /[*+~.()'"!:@]/g,
  })
}

function sectionSlugFromTitle(title: string) {
  return collectionSlugfromTitle(title)
}

const MuxData = (function () {
  // this depends on the original (egghead-rails) lesson slugs
  const muxUploadPath = './mux-upload.json'

  const playbackIdSchema = z.object({
    playbackId: z.array(z.object({policy: z.string(), id: z.string()})),
    assetId: z.string(),
    mediaUrl: z.string(),
  })
  const playbackFileSchema = z.record(playbackIdSchema)
  // .transform((val) => {
  //   return Object.entries(val)
  // })

  // Read and parse data file containing Mux playback IDs for each lesson
  // Note: these are tied to their original egghead slugs, use those to
  // cross-reference.
  let playbackIds = playbackFileSchema.parse(readJsonData(muxUploadPath))

  return {
    playbackIds,
  }
})()

type MuxPlaybackIds = typeof MuxData.playbackIds

const LessonTitles = (function () {
  const CsvSchema = z.object({
    courseId: z.coerce.string(),
    id: z.coerce.string(),
    moduleSlug: z.string(),
    generatedLessonSlug: z.string(),
    sectionLabel: z.string(),
    itemLabel: z.string().optional(),
    lessonType: z.enum([
      'break',
      'explainer',
      'interview',
      'intro',
      'module-intro',
      'module-outro',
      'solution',
      'xtra-solution',
    ]),
  })

  type Csv = z.infer<typeof CsvSchema>

  function readAndParseCsv(filePath: string): Promise<Csv[]> {
    return new Promise((resolve, reject) => {
      const results: Csv[] = []

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data: any) => {
          try {
            const parsedData = CsvSchema.parse(data)
            results.push(parsedData)
          } catch (error) {
            if (error instanceof ZodError) {
              reject(`Invalid data: ${error.message}`)
            } else {
              reject(error)
            }
          }
        })
        .on('end', () => {
          resolve(results)
        })
        .on('error', (error: Error) => {
          reject(`Error reading CSV file: ${error.message}`)
        })
    })
  }

  const getData = async (filePath: string) => {
    const parsedData = await readAndParseCsv(filePath)

    const parsedDataWithOriginalOrder = parsedData.map((item, index) => {
      return {
        ...item,
        originalOrder: index,
      }
    })

    return {
      lessonTitlesWithOriginalOrder: parsedDataWithOriginalOrder,
    }
  }

  return {
    getData,
  }
})()

type LessonTitles = Awaited<
  ReturnType<typeof LessonTitles.getData>
>['lessonTitlesWithOriginalOrder']

const LessonExport = (function () {
  const indexObjectsById = <T extends {id: string}>(
    objects: T[],
  ): {[id: string]: T} => {
    return objects.reduce<{[id: string]: T}>((accumulator, currentObject) => {
      accumulator[currentObject.id] = currentObject
      return accumulator
    }, {})
  }

  const LessonSchema = z.object({
    id: z.coerce.string(),
    slug: z.string(),
    title: z.string(),
    full_title: z.string(),
    description: z.coerce.string(),
    media_url: z.string(),
    transcript: z.string().nullable(),
    subtitles_url: z.string().nullable(),
  })
  type Lesson = z.infer<typeof LessonSchema>
  const CourseSchema = z
    .object({
      id: z.coerce.string(),
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      lessons: LessonSchema.array(),
      square_cover_large_url: z.string().url(),
    })
    .passthrough()
  type Course = z.infer<typeof CourseSchema>
  const ProductSchema = z
    .object({
      id: z.coerce.string(),
      title: z.enum([
        'Epic React Basic',
        'Epic React Pro',
        'Epic React Standard',
      ]),
      description: z.string(),
      slug: z.string(),
      courses: CourseSchema.array(),
      square_cover_large_url: z.string(),
    })
    .passthrough()

  const readAndParse = (filePath: string) => {
    const unparsedProducts = readJsonData(filePath)

    const basicProduct = ProductSchema.parse(
      unparsedProducts.find(
        (product: {title: string}) => product.title === 'Epic React Basic',
      ),
    )
    const standardProduct = ProductSchema.parse(
      unparsedProducts.find(
        (product: {title: string}) => product.title === 'Epic React Standard',
      ),
    )
    const proProduct = ProductSchema.parse(
      unparsedProducts.find(
        (product: {title: string}) => product.title === 'Epic React Pro',
      ),
    )

    const allProLessons = proProduct.courses.flatMap<Lesson>(
      (course) => course.lessons,
    )
    const allProCourses = proProduct.courses
    const lessonMetadataById = indexObjectsById<Lesson>(allProLessons)
    const courseMetadataById = indexObjectsById<Course>(allProCourses)

    return {
      basicProduct,
      standardProduct,
      proProduct,
      lessonMetadataById,
      courseMetadataById,
    }
  }

  return {
    readAndParse,
  }
})()

type LessonMetadataById = ReturnType<
  typeof LessonExport.readAndParse
>['lessonMetadataById']
type CourseMetadataById = ReturnType<
  typeof LessonExport.readAndParse
>['courseMetadataById']

const SanitySchemas = (function () {
  const SanitySlugSchema = z.object({
    _type: z.literal('slug'),
    current: z.string(),
  })

  const SanityBlockSchema = z.array(
    z.object({
      style: z.literal('normal'),
      _type: z.literal('block'),
      children: z.array(
        z.object({
          _type: z.literal('span'),
          marks: z.array(z.any()),
          _key: z.string(),
          text: z.string(),
        }),
      ),
      markDefs: z.array(z.any()),
      _key: z.string(),
    }),
  )
  // type SanityBlock = z.infer<typeof SanityBlockSchema>

  const CastingWordsSchema = z
    .object({
      audioFileId: z.string().or(z.number()).optional(),
      orderId: z.string().optional(),
      transcript: SanityBlockSchema,
      srt: z.string(),
    })
    .nullish()

  const ExternalImageSchema = z.object({
    _type: z.literal('externalImage'),
    url: z.string().url(),
  })

  const VideoResourceSchema = z.object({
    _id: z.string(),
    _type: z.literal('videoResource'),
    slug: SanitySlugSchema,
    title: z.string(),
    originalMediaUrl: z.string(),
    castingwords: CastingWordsSchema,
    muxAsset: z.object({
      muxAssetId: z.string(),
      muxPlaybackId: z.string(),
    }),
  })

  const SanityReferenceSchema = z.object({
    _type: z.literal('reference'),
    _key: z.string(),
    _ref: z.string(),
  })

  const BaseLessonSchema = z.object({
    _id: z.string(),
    slug: SanitySlugSchema,
    title: z.string(),
    description: z.string(),
    resources: SanityReferenceSchema.array(),
    body: SanityBlockSchema.optional(),
  })

  const ExplainerSchema = BaseLessonSchema.merge(
    z.object({
      _type: z.literal('explainer'),
      explainerType: z.enum([
        'moduleIntro',
        'moduleOutro',
        'sectionIntro',
        'general',
      ]),
    }),
  )

  const ExerciseSchema = BaseLessonSchema.merge(
    z.object({
      _type: z.literal('exercise'),
      exerciseType: z.enum(['solution', 'xtraSolution', 'break']),
    }),
  )

  const InterviewSchema = BaseLessonSchema.merge(
    z.object({
      _type: z.literal('interview'),
    }),
  )

  const SectionSchema = z.object({
    _id: z.string(),
    _type: z.literal('section'),
    resources: SanityReferenceSchema.array(),
    slug: SanitySlugSchema,
    title: z.string(),
    description: z.string(),
    body: SanityBlockSchema.optional(),
  })

  const ModuleSchema = z.object({
    _id: z.string(),
    _type: z.literal('module'),
    state: z.literal('draft').or(z.literal('published')),
    title: z.string(),
    moduleType: z.literal('workshop'),
    slug: SanitySlugSchema,
    resources: SanityReferenceSchema.array(),
    description: z.string(),
    body: SanityBlockSchema.optional(),
    image: ExternalImageSchema,
  })

  const ProductSchema = z.object({
    _id: z.string(),
    _type: z.literal('product'),
    title: z.string(),
    productId: z.string(),
    description: z.string(),
    modules: SanityReferenceSchema.array(),
    image: ExternalImageSchema,
  })

  return {
    SanitySlugSchema,
    SanityBlockSchema,
    CastingWordsSchema,
    VideoResourceSchema,
    ExplainerSchema,
    ExerciseSchema,
    InterviewSchema,
    SectionSchema,
    ModuleSchema,
    ProductSchema,
  }
})()

const SanityHelper = (function () {
  type SanitySlug = z.infer<typeof SanitySchemas.SanitySlugSchema>
  const buildSlug = (slug: string): SanitySlug => {
    return {_type: 'slug', current: slug}
  }

  const buildId = (type: string) => {
    return `${type}-${uuidv4()}`
  }

  type SanityBlock = z.infer<typeof SanitySchemas.SanityBlockSchema>
  const buildBlock = (text: string): SanityBlock => {
    return [
      {
        style: 'normal',
        _type: 'block',
        children: [
          {
            _type: 'span',
            marks: [],
            _key: buildId('body-key'),
            text: text,
          },
        ],
        markDefs: [],
        _key: buildId('block-key'),
      },
    ]
  }

  type CastingWords = z.infer<typeof SanitySchemas.CastingWordsSchema>
  const buildCastingWordsBlock = (
    transcript: string,
    srt_text: string,
  ): CastingWords => {
    let srt = srt_text

    if (srt_text.startsWith('WEBVTT\n\n')) {
      srt = srt_text.replace(/^WEBVTT\n\n/, '')
    }

    return {
      transcript: buildBlock(transcript),
      srt,
    }
  }

  return {
    buildId,
    buildSlug,
    buildBlock,
    buildCastingWordsBlock,
  }
})()

const SanityData = (function () {
  type VideoResource = z.infer<typeof SanitySchemas.VideoResourceSchema>

  const checkIfSrtTrackIsNeeded = async (data: {
    subtitles_url: string | null
    assetId: string
  }) => {
    const {subtitles_url, assetId} = data

    let srt_text = ''
    if (subtitles_url !== null) {
      try {
        const response = await fetch(subtitles_url)
        srt_text = await response.text()
      } catch (e) {
        console.log(e)
      }
    }

    // check the Mux asset and see if we need to add an SRT track to the asset
    // https://github.com/skillrecordings/products/blob/81fe98ceec24ef107544453b81afb4d8a1ec7eec/apps/total-typescript/src/lib/sanity.ts#L50-L69
    if (srt_text !== '') {
      const {tracks} = await Video.Assets.get(assetId)

      const existingSubtitle = tracks?.find(
        (track: any) => track.name === 'English',
      )

      if (!existingSubtitle) {
        return {
          status: 'ADD' as const,
          data: {
            muxAssetId: assetId,
            srtUrl: subtitles_url,
            srt_text,
          },
        }
      }
    }

    return {status: 'IGNORE' as const}
  }

  const bundleVideoResources = async (data: {
    lessonTitlesWithOriginalOrder: LessonTitles
    lessonMetadataById: LessonMetadataById
    muxPlaybackIds: MuxPlaybackIds
  }) => {
    const {lessonTitlesWithOriginalOrder, lessonMetadataById, muxPlaybackIds} =
      data

    const muxAssetsThatNeedSRT: {
      [lessonSlug: string]: {muxAssetId: string; srtUrl: string | null}
    } = {}

    const videoResourceBundles: {[lessonId: string]: VideoResource} = {}

    for (const lessonTitle of lessonTitlesWithOriginalOrder) {
      const {id, generatedLessonSlug} = lessonTitle

      const metadata = lessonMetadataById[id]
      const muxData = muxPlaybackIds[metadata.slug]

      const muxPlaybackId = muxData.playbackId[0].id
      const videoTitle = last(muxData.mediaUrl.split('/')) || muxData.mediaUrl

      const muxVideoResourceId = `mux-video-${muxData.assetId}`

      const {transcript: _transcript, subtitles_url} = metadata

      const transcript = _transcript || ''

      const {status, data} = await checkIfSrtTrackIsNeeded({
        subtitles_url,
        assetId: muxData.assetId,
      })

      if (status === 'ADD') {
        muxAssetsThatNeedSRT[metadata.slug] = data
      }
      // throttle the Mux API to ~1 RPS
      // "Requests against the all other General Data APIs are rate limited to a sustained 5 request per second (RPS)"
      await sleep(1000)

      videoResourceBundles[id] = SanitySchemas.VideoResourceSchema.parse({
        _id: muxVideoResourceId,
        _type: 'videoResource',
        title: videoTitle,
        slug: SanityHelper.buildSlug(metadata.slug),
        originalMediaUrl: muxData.mediaUrl,
        castingwords: SanityHelper.buildCastingWordsBlock(
          transcript,
          data?.srt_text || '',
        ),
        muxAsset: {
          muxAssetId: muxData.assetId,
          muxPlaybackId,
        },
      })
    }

    return {videoResourceBundles, muxAssetsThatNeedSRT}
  }

  type LessonTitle = LessonTitles[0]
  const determineLessonTitle = (data: LessonTitle) => {
    const {lessonType, itemLabel, sectionLabel} = data

    if (lessonType === 'explainer') {
      return itemLabel || sectionLabel
    } else if (
      lessonType === 'interview' ||
      lessonType === 'module-intro' ||
      lessonType === 'module-outro'
    ) {
      return sectionLabel
    } else {
      return itemLabel as string
    }
  }

  const bundleLessons = (data: {
    lessonTitlesWithOriginalOrder: LessonTitles
    lessonMetadataById: LessonMetadataById
    videoResourceIds: {[lessonId: string]: {_id: string}}
  }) => {
    const {
      lessonTitlesWithOriginalOrder,
      lessonMetadataById,
      videoResourceIds,
    } = data

    // const lessonTypes = {
    //   'intro': {
    //     type: 'explainer',
    //     subType: 'sectionIntro',
    //     schema: SanitySchemas.ExplainerSchema
    //   },
    //   'module-intro': {
    //     type: 'explainer',
    //     subType: 'moduleIntro',
    //     schema: SanitySchemas.ExplainerSchema
    //   },
    //   'module-outro': {
    //     type: 'explainer',
    //     subType: 'moduleOutro',
    //     schema: SanitySchemas.ExplainerSchema
    //   },
    //   'explainer': {
    //     type: 'explainer',
    //     subType: 'general',
    //     schema: SanitySchemas.ExplainerSchema
    //   },
    //   'interview': {
    //     type: 'interview',
    //     subType: undefined,
    //     schema: SanitySchemas.InterviewSchema
    //   },
    //   'solution': {
    //     type: 'exercise',
    //     subType: 'solution',
    //     schema: SanitySchemas.ExerciseSchema
    //   },
    //   'xtra-solution': {
    //     type: 'exercise',
    //     subType: 'xtraSolution',
    //     schema: SanitySchemas.ExerciseSchema
    //   },
    //   'break': {
    //     type: 'exercise',
    //     subType: 'break',
    //     schema: SanitySchemas.ExerciseSchema
    //   }
    // }

    type Exercise = z.infer<typeof SanitySchemas.ExerciseSchema>
    type Explainer = z.infer<typeof SanitySchemas.ExplainerSchema>
    type Interview = z.infer<typeof SanitySchemas.InterviewSchema>

    const lessonBundlesById: {
      [lessonId: string]: Exercise | Explainer | Interview
    } = {}

    // we want to know the `_id` value for each VideoResource so that we can
    // connect the lessons to their video resources.
    for (const lessonTitle of lessonTitlesWithOriginalOrder) {
      const metadata = lessonMetadataById[lessonTitle.id]
      const {id: eggheadId, description} = metadata
      const {_id: videoResourceId} = videoResourceIds[lessonTitle.id]

      const explainerSanityId = `lesson-${eggheadId}`

      const title = determineLessonTitle(lessonTitle)

      const baseData = {
        _id: explainerSanityId,
        title,
        slug: SanityHelper.buildSlug(lessonTitle.generatedLessonSlug),
        description: '',
        body: SanityHelper.buildBlock(description),
        resources: [
          {
            _type: 'reference' as const,
            _key: SanityHelper.buildId('resource-key'),
            _ref: videoResourceId,
          },
        ],
      }

      switch (lessonTitle.lessonType) {
        case 'intro':
          const introData: Explainer = {
            ...baseData,
            _type: 'explainer',
            explainerType: 'sectionIntro',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.ExplainerSchema.parse(introData)
          break
        case 'module-intro':
          const moduleIntro: Explainer = {
            ...baseData,
            _type: 'explainer',
            explainerType: 'moduleIntro',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.ExplainerSchema.parse(moduleIntro)
          break
        case 'module-outro':
          const moduleOutro: Explainer = {
            ...baseData,
            _type: 'explainer',
            explainerType: 'moduleOutro',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.ExplainerSchema.parse(moduleOutro)
          break
        case 'explainer':
          const explainer: Explainer = {
            ...baseData,
            _type: 'explainer',
            explainerType: 'general',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.ExplainerSchema.parse(explainer)
          break
        case 'interview':
          const interview: Interview = {
            ...baseData,
            _type: 'interview',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.InterviewSchema.parse(interview)
          break
        case 'solution':
          const solution: Exercise = {
            ...baseData,
            _type: 'exercise',
            exerciseType: 'solution',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.ExerciseSchema.parse(solution)
          break
        case 'xtra-solution':
          const xtraSolution: Exercise = {
            ...baseData,
            _type: 'exercise',
            exerciseType: 'xtraSolution',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.ExerciseSchema.parse(xtraSolution)
          break
        case 'break':
          const breakData: Exercise = {
            ...baseData,
            _type: 'exercise',
            exerciseType: 'break',
          }
          lessonBundlesById[lessonTitle.id] =
            SanitySchemas.ExerciseSchema.parse(breakData)
          break
      }
    }

    // TODO: Need to probably surface the `_id` values for each lesson along
    // with the its eggheadId so that they are tied together.
    return lessonBundlesById
  }

  type Section = z.infer<typeof SanitySchemas.SectionSchema>
  type Module = z.infer<typeof SanitySchemas.ModuleSchema>

  const bundleCourseStructure = (data: {
    lessonTitlesWithOriginalOrder: LessonTitles
    lessonBundlesById: {[lessonId: string]: {_id: string}}
    courseMetadataById: CourseMetadataById
  }) => {
    const {
      lessonTitlesWithOriginalOrder,
      lessonBundlesById,
      courseMetadataById,
    } = data

    // build up Section and Module(Workshop) bundles
    const sectionBundles: Section[] = []
    const moduleBundlesById: {[courseId: string]: Module} = {}

    const lessonTitlesGroupedByCourse = groupBy(
      lessonTitlesWithOriginalOrder,
      'courseId',
    )
    for (const lessonTitlesTuple of Object.entries(
      lessonTitlesGroupedByCourse,
    )) {
      const [courseId, lessonTitlesByCourse] = lessonTitlesTuple
      const {moduleSlug} = lessonTitlesByCourse[0]
      const {
        id: eggheadId,
        title,
        description,
        square_cover_large_url,
      } = courseMetadataById[courseId]
      const moduleSanityId = `module-${eggheadId}`

      const specialCaseModules = [
        'welcome-to-epic-react',
        'epic-react-expert-interviews',
      ]

      type SanityResourceRef = Module['resources'][0]

      if (specialCaseModules.includes(lessonTitlesByCourse[0].moduleSlug)) {
        // create a Module and load up the resources with this set of
        // standalone lessons.
        const sanityLessonRefs: Array<SanityResourceRef> =
          lessonTitlesByCourse.map(({lessonType, id}) => {
            const sanityLessonId = lessonBundlesById[id]['_id']

            return {
              _type: 'reference' as const,
              _key: SanityHelper.buildId(`${lessonType}-key`),
              _ref: sanityLessonId,
            }
          })

        const module: Module = {
          _id: moduleSanityId,
          _type: 'module',
          moduleType: 'workshop',
          state: 'published',
          slug: SanityHelper.buildSlug(moduleSlug),
          title,
          description: '',
          resources: sanityLessonRefs,
          body: SanityHelper.buildBlock(description),
          image: {
            _type: 'externalImage',
            url: square_cover_large_url,
          },
        }

        moduleBundlesById[courseId] = SanitySchemas.ModuleSchema.parse(module)
      } else {
        // separate the course by its sectionLabel values and then create
        // sections for each of those. Or if the lesson is standalone, then it
        // doesn't go in a section.
        // Each of those entities is then tied to the Module.
        const lessonTitlesBySection = groupBy(
          lessonTitlesByCourse,
          'sectionLabel',
        )

        for (const sectionedLessonTitlesTuple of Object.entries(
          lessonTitlesBySection,
        )) {
          const [sectionLabel, lessonTitlesBySection] =
            sectionedLessonTitlesTuple

          const indexedModuleResources: Array<{
            lessonSortIndex: number
            ref: SanityResourceRef
          }> = []

          if (lessonTitlesBySection.length === 1) {
            const {id, lessonType, originalOrder} = lessonTitlesBySection[0]
            const sanityLessonId = lessonBundlesById[id]['_id']
            const ref = {
              _type: 'reference' as const,
              _key: SanityHelper.buildId(`${lessonType}-key`),
              _ref: sanityLessonId,
            }
            indexedModuleResources.push({lessonSortIndex: originalOrder, ref})
          } else if (lessonTitlesBySection.length > 1) {
            const {sectionLabel, originalOrder: sectionOriginalOrder} =
              lessonTitlesBySection[0]

            const indexedSectionResources: Array<{
              lessonSortIndex: number
              ref: SanityResourceRef
            }> = []

            // build lesson refs
            for (const lessonTitle of lessonTitlesBySection) {
              const {id, lessonType, originalOrder} = lessonTitle
              const sanityLessonId = lessonBundlesById[id]['_id']
              const ref = {
                _type: 'reference' as const,
                _key: SanityHelper.buildId(`${lessonType}-key`),
                _ref: sanityLessonId,
              }
              indexedSectionResources.push({
                lessonSortIndex: originalOrder,
                ref,
              })
            }

            const sortedSectionReferences = sortBy(
              indexedSectionResources,
              'lessonSortIndex',
            ).map(({ref}) => ref)

            const sectionSlug = sectionSlugFromTitle(sectionLabel)
            const section = SanitySchemas.SectionSchema.parse({
              _id: sectionSlug,
              _type: 'section',
              slug: SanityHelper.buildSlug(sectionSlug),
              title: sectionLabel,
              body: SanityHelper.buildBlock(''),
              resources: sortedSectionReferences,
            })

            sectionBundles.push(section)

            const sectionRef = {
              _type: 'reference' as const,
              _key: SanityHelper.buildId('section-key'),
              _ref: section['_id'],
            }

            indexedModuleResources.push({
              lessonSortIndex: sectionOriginalOrder,
              ref: sectionRef,
            })
          } else {
            const msg = `Empty lesson collection encountered for moduleSlug: ${moduleSlug}, sectionLabel: ${sectionLabel}`
            throw new Error(msg)
          }

          const sortedModuleReferences = sortBy(
            indexedModuleResources,
            'lessonSortIndex',
          ).map(({ref}) => ref)

          // build up module with references
          const module: Module = {
            _id: moduleSanityId,
            _type: 'module',
            moduleType: 'workshop',
            state: 'published',
            slug: SanityHelper.buildSlug(moduleSlug),
            title,
            description: '',
            resources: sortedModuleReferences,
            body: SanityHelper.buildBlock(description),
            image: {
              _type: 'externalImage',
              url: square_cover_large_url,
            },
          }

          moduleBundlesById[courseId] = SanitySchemas.ModuleSchema.parse(module)
        }
      }
    }

    return {
      sectionBundles,
      moduleBundlesById,
    }
  }

  type ProProduct = ReturnType<typeof LessonExport.readAndParse>['proProduct']
  type StandardProduct = ReturnType<
    typeof LessonExport.readAndParse
  >['standardProduct']
  type BasicProduct = ReturnType<
    typeof LessonExport.readAndParse
  >['basicProduct']
  type ModuleBundlesById = ReturnType<
    typeof bundleCourseStructure
  >['moduleBundlesById']

  const assembleSanityProduct = (
    productData: ProProduct | StandardProduct | BasicProduct,
    moduleBundlesById: ModuleBundlesById,
  ) => {
    const {courses, id, title, description, square_cover_large_url} =
      productData

    const proModuleRefs = courses.map((course) => {
      return {
        _type: 'reference' as const,
        _key: SanityHelper.buildId('course-key'),
        _ref: moduleBundlesById[course.id]['_id'],
      }
    })

    const proProductId = `product-${id}`
    return SanitySchemas.ProductSchema.parse({
      _id: proProductId,
      _type: 'product',
      productId: proProductId,
      title: title,
      description: description,
      modules: proModuleRefs,
      image: {
        _type: 'externalImage',
        url: square_cover_large_url,
      },
    })
  }

  const bundleProducts = (data: {
    proProduct: ProProduct
    standardProduct: StandardProduct
    basicProduct: BasicProduct
    moduleBundlesById: ModuleBundlesById
  }) => {
    const {proProduct, standardProduct, basicProduct, moduleBundlesById} = data

    const products = [
      assembleSanityProduct(proProduct, moduleBundlesById),
      assembleSanityProduct(standardProduct, moduleBundlesById),
      assembleSanityProduct(basicProduct, moduleBundlesById),
    ]

    return products
  }

  return {
    bundleVideoResources,
    bundleLessons,
    bundleCourseStructure,
    bundleProducts,
  }
})()

;(async () => {
  try {
    const lessonTitlesPath = 'src/data/epic-react-lesson-titles.csv'
    const {lessonTitlesWithOriginalOrder} = await LessonTitles.getData(
      lessonTitlesPath,
    )

    const lessonMetadataPath = dataFilePath
    const {
      lessonMetadataById,
      courseMetadataById,
      proProduct,
      standardProduct,
      basicProduct,
    } = LessonExport.readAndParse(lessonMetadataPath)

    const {videoResourceBundles, muxAssetsThatNeedSRT} =
      await SanityData.bundleVideoResources({
        lessonTitlesWithOriginalOrder,
        lessonMetadataById,
        muxPlaybackIds: MuxData.playbackIds,
      })

    const lessonBundlesById = SanityData.bundleLessons({
      lessonTitlesWithOriginalOrder,
      lessonMetadataById,
      videoResourceIds: videoResourceBundles,
    })

    const {sectionBundles, moduleBundlesById} =
      SanityData.bundleCourseStructure({
        lessonTitlesWithOriginalOrder,
        lessonBundlesById,
        courseMetadataById,
      })

    const productBundles = SanityData.bundleProducts({
      proProduct,
      standardProduct,
      basicProduct,
      moduleBundlesById,
    })

    // To send batched creates to Sanity:
    // TODO: Iterate over Object.entries(videoResourceBundles)
    // TODO: Iterate over Object.entries(lessonBundlesById)

    // TODO: Build the Product bundles based on something from LessonExport

    // TODO: process muxAssetsThatNeedSRT with calls to Mux Video API
  } catch (error) {
    console.error(`Error: ${error}`)
  }
})()
