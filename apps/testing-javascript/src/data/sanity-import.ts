// Running this script:
//
// Ensure you have `dataFilePath` set to the location of the formatted export
// of Testing JavaScript data. Also, be sure to set `SANITY_EDITOR_TOKEN` in
// your `.env.local` environment variables file.
//
// Execute the Mux Asset Upload script with:
//
// ```
// npx ts-node --skipProject src/data/sanity-import.ts
// ```

import fs from 'fs'
import fetch from 'node-fetch'
// import sanityClient from '@sanity/client'
import {v4 as uuidv4} from 'uuid'
import {z} from 'zod'
import last from 'lodash/last'

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

const muxUploadPath = './mux-upload.json'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const SanitySlugSchema = z.object({
  _type: z.literal('slug'),
  current: z.string(),
})
type SanitySlug = z.infer<typeof SanitySlugSchema>

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
type SanityBlock = z.infer<typeof SanityBlockSchema>

// Pulled from: https://github.com/skillrecordings/products/blob/3ae585ba345db36c75df8d2391ace3306d3f6b88/apps/total-typescript/src/lib/sanity.ts#LL13-L30C3
const CastingWordsSchema = z
  .object({
    audioFileId: z.string().or(z.number()).optional(),
    orderId: z.string().optional(),
    transcript: SanityBlockSchema,
    srt: z.string().optional(),
  })
  .nullish()
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
type VideoResource = z.infer<typeof VideoResourceSchema>

const SanityReferenceSchema = z.object({
  _type: z.literal('reference'),
  _key: z.string(),
  _ref: z.string(),
})
type SanityReference = z.infer<typeof SanityReferenceSchema>

const ExplainerSchema = z.object({
  _id: z.string(),
  _type: z.literal('explainer'),
  explainerType: z.literal('general'),
  slug: SanitySlugSchema,
  title: z.string(),
  description: z.string(),
  resources: SanityReferenceSchema.array(),
  body: SanityBlockSchema.optional(),
})
type Explainer = z.infer<typeof ExplainerSchema>

const WorkshopSchema = z.object({
  _id: z.string(),
  _type: z.literal('module'),
  state: z.literal('draft').or(z.literal('published')),
  title: z.string(),
  moduleType: z.literal('workshop'),
  slug: SanitySlugSchema,
  resources: SanityReferenceSchema.array(),
  description: z.string(),
  body: SanityBlockSchema.optional(),
})
type Workshop = z.infer<typeof WorkshopSchema>

const ProductSchema = z.object({
  _id: z.string(),
  _type: z.literal('product'),
  title: z.string(),
  productId: z.string(),
  description: z.string(),
  modules: SanityReferenceSchema.array(),
})
type Product = z.infer<typeof ProductSchema>

const readJsonData = (path: string) => {
  let fileData = fs.readFileSync(path)
  return JSON.parse(fileData.toString())
}

const writeObjectsToSanity = async (
  objects: Object[],
): Promise<{_id: string}> => {
  const mutations = objects.map((object: Object) => {
    return {
      createOrReplace: object,
    }
  })

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${EDITOR_TOKEN}`,
      },
      body: JSON.stringify({mutations}),
    },
  ).then((response: any) => response.json())

  if (response?.message === 'no Route matched with those values') {
    throw new Error(`Failed to write data to Sanity: ${response.message}`)
  }

  return response
}

const writeJsonToFile = (path: string, data: Object) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
    console.log('Data successfully saved to disk')
  } catch (error) {
    console.log('An error has occurred ', error)
  }
}

const buildId = (type: string) => {
  return `${type}-${uuidv4()}`
}

const buildSlug = (slug: string): SanitySlug => {
  return {_type: 'slug', current: slug}
}

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

type CastingWords = z.infer<typeof CastingWordsSchema>
const buildCastingWordsBlock = (transcript: string): CastingWords => {
  return {
    transcript: buildBlock(transcript),
  }
}

const importCourseData = async () => {
  // Note: not using client because it doesn't directly support multi-object
  // transactional creates. You have to drop down to directly calling API
  // endpoints for that.
  //
  // const client = sanityClient({
  //   projectId: PROJECT_ID,
  //   dataset: DATASET,
  //   apiVersion: API_VERSION,
  //   // a token with write access
  //   token: EDITOR_TOKEN,
  //   useCdn: false,
  // })

  const lessonSchema = z.object({
    id: z.coerce.string(),
    slug: z.string(),
    title: z.string(),
    description: z.coerce.string(),
    media_url: z.string(),
    transcript: z.string(),
  })
  const courseSchema = z
    .object({
      id: z.coerce.string(),
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      lessons: lessonSchema.array(),
    })
    .passthrough()
  const productSchema = z
    .object({
      id: z.coerce.number(),
      title: z.string(),
      description: z.string(),
      slug: z.string(),
      courses: courseSchema.array(),
    })
    .passthrough()

  // ******************************************
  // ** Read and Parse Full Course Data JSON **
  // ******************************************
  let products = z.array(productSchema).parse(readJsonData(dataFilePath))

  // Read and parse data file containing Mux playback IDs for each lesson
  let muxPlaybackIds = z
    .object({})
    .passthrough()
    .parse(readJsonData(muxUploadPath))

  const ProductDataSchema = productSchema.merge(
    z.object({courseSlugs: z.string().array()}),
  )
  type ProductData = z.infer<typeof ProductDataSchema>
  const uniqueProducts: {[productSlug: string]: ProductData} = {}
  const CourseDataSchema = courseSchema.merge(
    z.object({lessonSlugs: z.string().array()}),
  )
  type CourseData = z.infer<typeof CourseDataSchema>
  const uniqueCourses: {[courseSlug: string]: CourseData} = {}
  type LessonData = z.infer<typeof lessonSchema>
  const uniqueLessons: {[lessonSlug: string]: LessonData} = {}

  for (const product of products) {
    const parsedProduct = productSchema.parse(product)

    const {slug: productSlug} = parsedProduct

    uniqueProducts[productSlug] = {
      courseSlugs: product.courses.map((course) => course.slug),
      ...parsedProduct,
    }

    for (const course of product.courses) {
      const courseSlug = course.slug as string

      if (uniqueCourses[courseSlug] === undefined) {
        uniqueCourses[courseSlug] = {
          lessonSlugs: course.lessons.map((lesson) => lesson.slug),
          ...course,
        }
      }

      for (const lesson of course.lessons) {
        const parsedLesson = lessonSchema.parse(lesson)

        const {slug: lessonSlug} = parsedLesson

        if (uniqueLessons[lessonSlug]) {
          break
        }

        uniqueLessons[lessonSlug] = parsedLesson
      }
    }
  }

  // "javascript-intro-to-fundamentals-of-testing-in-javascript": {
  //   "playbackId": [
  //     {
  //       "policy": "public",
  //       "id": "02YQHw8fTJWpj02tNaXPjMGoQqTZnvuy3X02zbuUYSrxeQ"
  //     }
  //   ],
  //   "assetId": "XmOiJ0293Rqct6dMugXTjkgqwaBRq8Ga7XdQNUkhqUPs"
  // }
  const playbackIdSchema = z.object({
    playbackId: z.array(z.object({policy: z.string(), id: z.string()})),
    assetId: z.string(),
    mediaUrl: z.string(),
  })
  const playbackFileSchema = z.record(playbackIdSchema).transform((val) => {
    return Object.entries(val)
  })

  const muxPlaybackEntries = playbackFileSchema.parse(muxPlaybackIds)

  const muxVideoResources: {
    [lessonSlug: string]: {
      muxVideoResourceId: string
      videoResourceData: VideoResource
    }
  } = {}

  // *********************
  // ** Video Resources **
  // *********************

  // FIRST, assemble all the VideoResource payloads
  for (const entry of muxPlaybackEntries) {
    const [lessonSlug, playbackData] = entry
    const {assetId, mediaUrl, playbackId} = playbackData
    const muxPlaybackId = playbackId[0].id

    // The title doesn't matter much, but if it could be the last bit of the
    // media URL, that would be pretty readable.
    const title = last(mediaUrl.split('/')) || mediaUrl

    const {transcript} = uniqueLessons[lessonSlug]

    const muxVideoResourceId = `mux-video-${assetId}`

    const videoResourceData: VideoResource = {
      _id: muxVideoResourceId,
      _type: 'videoResource',
      title,
      slug: buildSlug(lessonSlug),
      originalMediaUrl: playbackData.mediaUrl,
      castingwords: buildCastingWordsBlock(transcript),
      muxAsset: {
        muxAssetId: assetId,
        muxPlaybackId,
      },
    }

    muxVideoResources[lessonSlug] = {videoResourceData, muxVideoResourceId}
  }

  // SECOND, post a bulk create request to Sanity API for VideoResources
  await sleep(250)
  const videoResourcePayloads = Object.entries(muxVideoResources).map(
    (tuple) => {
      const [_slug, data] = tuple
      return data.videoResourceData
    },
  )
  const resultOfVideoResourceCreates: any = await writeObjectsToSanity(
    videoResourcePayloads,
  )

  // **************************
  // ** Explainers (Lessons) **
  // **************************

  const explainerPayloads: {
    [lessonSlug: string]: {explainerPayload: Explainer; sanityId: string}
  } = {}

  // FIRST, assemble all the Explainer payloads
  for (const lesson of Object.entries(uniqueLessons)) {
    const [lessonSlug, lessonData] = lesson

    const videoResourceId = muxVideoResources[lessonSlug].muxVideoResourceId

    const {title, description, id: eggheadId} = lessonData

    const explainerSanityId = `lesson-${eggheadId}`

    const explainer: Explainer = {
      _id: explainerSanityId,
      _type: 'explainer',
      explainerType: 'general',
      slug: buildSlug(lessonSlug),
      title,
      description: '',
      resources: [
        {
          _type: 'reference',
          _key: buildId('resource-key'),
          _ref: videoResourceId,
        },
      ],
      body: buildBlock(description),
    }

    explainerPayloads[lessonSlug] = {
      explainerPayload: explainer,
      sanityId: explainerSanityId,
    }
  }

  // SECOND, post a bulk create request to Sanity API for Explainers
  await sleep(250)
  const listOfExplainerPayloads: Explainer[] = Object.entries(
    explainerPayloads,
  ).map((tuple) => {
    const [_slug, data] = tuple
    return data.explainerPayload
  })
  const resultOfExplainerCreates: any = await writeObjectsToSanity(
    listOfExplainerPayloads,
  )

  // *************************
  // ** Workshops (Courses) **
  // *************************

  const workshopPayloads: {
    [courseSlug: string]: {workshopPayload: Workshop; sanityId: string}
  } = {}

  // FIRST, assemble all the Workshop payloads
  for (const course of Object.entries(uniqueCourses)) {
    const [courseSlug, courseData] = course

    const {lessonSlugs, title, description, id: eggheadId} = courseData

    const sanityLessonIds = lessonSlugs.map((lessonSlug) => {
      return explainerPayloads[lessonSlug].sanityId
    })

    const sanityLessonRefs: SanityReference[] = sanityLessonIds.map(
      (sanityLessonId) => {
        return {
          _type: 'reference',
          _key: buildId('explainer-key'),
          _ref: sanityLessonId,
        }
      },
    )

    const workshopSanityId = `course-${eggheadId}`

    const workshop: Workshop = {
      _id: workshopSanityId,
      _type: 'module',
      moduleType: 'workshop',
      state: 'published',
      slug: buildSlug(courseSlug),
      title,
      description,
      resources: sanityLessonRefs,
      body: undefined,
    }

    workshopPayloads[courseSlug] = {
      workshopPayload: workshop,
      sanityId: workshopSanityId,
    }
  }

  // SECOND, post a bulk create request to Sanity API for Workshops
  await sleep(250)
  const listOfWorkshopPayloads: Workshop[] = Object.entries(
    workshopPayloads,
  ).map((tuple) => {
    const [_slug, data] = tuple
    return data.workshopPayload
  })
  const resultOfWorkshopCreates: any = await writeObjectsToSanity(
    listOfWorkshopPayloads,
  )

  // **********************
  // ** Products (Tiers) **
  // **********************

  const productPayloads: {
    [productSlug: string]: {productPayload: Product; sanityId: string}
  } = {}

  // FIRST, assemble all the Product payloads
  for (const productEntry of Object.entries(uniqueProducts)) {
    const [productSlug, productData] = productEntry

    const {courseSlugs, title, description, id: eggheadId} = productData

    const sanityWorkshopIds = courseSlugs.map((courseSlug) => {
      return workshopPayloads[courseSlug].sanityId
    })

    const sanityWorkshopRefs: SanityReference[] = sanityWorkshopIds.map(
      (sanityWorkshopId) => {
        return {
          _type: 'reference',
          _key: buildId('workshop-key'),
          _ref: sanityWorkshopId,
        }
      },
    )

    const productSanityId = `product-${eggheadId}`

    const product: Product = {
      _id: productSanityId,
      _type: 'product',
      productId: productSanityId,
      title,
      description,
      modules: sanityWorkshopRefs,
    }

    productPayloads[productSlug] = {
      productPayload: product,
      sanityId: productSanityId,
    }
  }

  // SECOND, post a bulk create request to Sanity API for Workshops
  await sleep(250)
  const listOfProductPayloads: Product[] = Object.entries(productPayloads).map(
    (tuple) => {
      const [_slug, data] = tuple
      return data.productPayload
    },
  )
  const resultOfProductCreates: any = await writeObjectsToSanity(
    listOfProductPayloads,
  )

  // Write each of the Sanity API responses to JSON files
  writeJsonToFile(
    'resultOfVideoResourceCreates.json',
    resultOfVideoResourceCreates,
  )
  writeJsonToFile('resultOfExplainerCreates.json', resultOfExplainerCreates)
  writeJsonToFile('resultOfWorkshopCreates.json', resultOfWorkshopCreates)
  writeJsonToFile('resultOfProductCreates.json', resultOfProductCreates)

  console.log('Script ran to completion without error')
}

importCourseData()
