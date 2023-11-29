// Running this script:
//
// Ensure you have `dataFilePath` set to the location of the formatted export
// of Testing JavaScript data. Also, be sure to set `SANITY_EDITOR_TOKEN` in
// your `.env.local` environment variables file.
//
// Execute the Sanity Import script with:
//
// ```
// npx ts-node --files --skipProject src/data/sanity-import.ts
// ```

import fs from 'fs'
import fetch from 'node-fetch'
import Mux from '@mux/mux-node'
import {v4 as uuidv4} from 'uuid'
import {z} from 'zod'
import last from 'lodash/last'

require('dotenv-flow').config({
  default_node_env: 'development',
})

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET_ID: DATASET,
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
    srt: z.string(),
  })
  .nullish()
  .transform((data) => {
    if (data === null || data === undefined) {
      return data
    }

    const {srt, ...rest} = data

    if (srt.startsWith('WEBVTT\n\n')) {
      const updatedSrt = srt.replace(/^WEBVTT\n\n/, '')

      return {
        ...rest,
        srt: updatedSrt,
      }
    } else {
      return data
    }
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
type VideoResource = z.infer<typeof VideoResourceSchema>

const SanityReferenceSchema = z.object({
  _type: z.literal('reference'),
  _key: z.string(),
  _ref: z.string(),
})
type SanityReference = z.infer<typeof SanityReferenceSchema>

const ExternalImageSchema = z.object({
  _type: z.literal('externalImage'),
  url: z.string().url(),
})

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

const SectionSchema = z.object({
  _id: z.string(),
  _type: z.literal('section'),
  slug: SanitySlugSchema,
  title: z.string(),
  resources: SanityReferenceSchema.array(),
  body: SanityBlockSchema.optional(),
})
type Section = z.infer<typeof SectionSchema>

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
  image: ExternalImageSchema,
})
type Workshop = z.infer<typeof WorkshopSchema>

const ProductSchema = z.object({
  _id: z.string(),
  _type: z.literal('product'),
  title: z.string(),
  productId: z.string(),
  description: z.string(),
  modules: SanityReferenceSchema.array(),
  image: ExternalImageSchema,
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

const importCourseData = async () => {
  const lessonSchema = z.object({
    id: z.coerce.string(),
    slug: z.string(),
    title: z.string(),
    description: z.coerce.string(),
    media_url: z.string(),
    transcript: z.string(),
    subtitles_url: z.string(),
  })
  const courseSchema = z
    .object({
      id: z.coerce.string(),
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      lessons: lessonSchema.array(),
      square_cover_large_url: z.string().url(),
    })
    .passthrough()
  const productSchema = z
    .object({
      id: z.coerce.number(),
      title: z.string(),
      description: z.string(),
      slug: z.string(),
      courses: courseSchema.array(),
      square_cover_large_url: z.string(),
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
    // they have already been parsed, no reason to re-parse them individually
    // here
    const parsedProduct = productSchema.parse(product)

    const {slug: productSlug} = parsedProduct

    // ignore courses with the following slugs because they are the Series
    // duplicates. The up-to-date courses are Playlist records with the other
    // slugs.
    // Series.where(id: [214, 406, 223, 407, 409, 408, 246, 410]).pluck(:slug)
    const ignoredCourseSlugs = [
      'static-analysis-testing-javascript-applications-71c1',
      'test-node-js-backends',
      'use-dom-testing-library-to-test-any-js-framework',
      'install-configure-and-script-cypress-for-javascript-web-applications-8184',
      'test-react-components-with-jest-and-react-testing-library-30af',
      'configure-jest-for-testing-javascript-applications-b3674a',
      'javascript-mocking-fundamentals',
      'fundamentals-of-testing-in-javascript',
    ]

    const allowedCourses = product.courses.filter((course) => {
      return !ignoredCourseSlugs.includes(course.slug)
    })

    const courseSlugs = allowedCourses.map((course) => course.slug)

    uniqueProducts[productSlug] = {
      courseSlugs,
      ...parsedProduct,
    }

    for (const course of allowedCourses) {
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
  const muxAssetsThatNeedSRT: {
    [lessonSlug: string]: {muxAssetId: string; srtUrl: string}
  } = {}

  // Set up Mux API Client
  const MUX_ACCESS_TOKEN = process.env.MUX_ACCESS_TOKEN as string
  const MUX_SECRET_KEY = process.env.MUX_SECRET_KEY as string
  const muxClient = new Mux(MUX_ACCESS_TOKEN, MUX_SECRET_KEY)
  const {Video} = muxClient

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

    const {transcript, subtitles_url} = uniqueLessons[lessonSlug]

    let srt_text = ''
    try {
      const response = await fetch(subtitles_url)
      srt_text = await response.text()
    } catch (e) {
      console.log(e)
    }

    // check the Mux asset and see if we need to add an SRT track to the asset
    // https://github.com/skillrecordings/products/blob/81fe98ceec24ef107544453b81afb4d8a1ec7eec/apps/total-typescript/src/lib/sanity.ts#L50-L69
    if (srt_text !== '') {
      const {tracks} = await Video.Assets.get(assetId)

      const existingSubtitle = tracks?.find(
        (track: any) => track.name === 'English',
      )

      if (!existingSubtitle) {
        muxAssetsThatNeedSRT[lessonSlug] = {
          muxAssetId: assetId,
          srtUrl: subtitles_url,
        }
      }

      // throttle the Mux API to ~1 RPS
      // "Requests against the all other General Data APIs are rate limited to a sustained 5 request per second (RPS)"
      await sleep(1000)
    }

    const muxVideoResourceId = `mux-video-${assetId}`

    const videoResourceData: VideoResource = {
      _id: muxVideoResourceId,
      _type: 'videoResource',
      title,
      slug: buildSlug(lessonSlug),
      originalMediaUrl: playbackData.mediaUrl,
      castingwords: buildCastingWordsBlock(transcript, srt_text),
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

  // add the SRT tracks to the Mux assets as well
  for (const subtitleData of Object.entries(muxAssetsThatNeedSRT)) {
    const [_, {muxAssetId, srtUrl}] = subtitleData

    await Video.Assets.createTrack(muxAssetId, {
      url: srtUrl,
      type: 'text',
      text_type: 'subtitles',
      closed_captions: false,
      language_code: 'en-US',
      name: 'English',
      passthrough: 'English',
    })

    // throttle the Mux API to ~1 RPS
    // "Requests against the all other General Data APIs are rate limited to a sustained 5 request per second (RPS)"
    await sleep(1000)
  }

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

  let sectionCount = 0

  const sectionPayloads: {
    [sectionSlug: string]: {sectionPayload: Section; sanityId: string}
  } = {}

  const workshopPayloads: {
    [courseSlug: string]: {workshopPayload: Workshop; sanityId: string}
  } = {}

  // FIRST, assemble all the Workshop payloads
  for (const course of Object.entries(uniqueCourses)) {
    const [courseSlug, courseData] = course

    const {
      lessonSlugs,
      title,
      description,
      id: eggheadId,
      square_cover_large_url,
    } = courseData

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

    const sectionSlug = `section-${sectionCount.toString().padStart(2, '0')}`
    const sanitySectionId = sectionSlug

    const section: Section = {
      _id: sanitySectionId,
      _type: 'section',
      slug: buildSlug(sectionSlug),
      title, // same as workshop title
      body: buildBlock(description), // same as workshop body
      resources: sanityLessonRefs,
    }

    const sanitySectionRef: SanityReference[] = [
      {
        _type: 'reference',
        _key: buildId('section-key'),
        _ref: sanitySectionId,
      },
    ]

    const sanityWorkshopId = `course-${eggheadId}`

    const workshop: Workshop = {
      _id: sanityWorkshopId,
      _type: 'module',
      moduleType: 'workshop',
      state: 'published',
      slug: buildSlug(courseSlug),
      title,
      description: '',
      resources: sanitySectionRef,
      body: buildBlock(description),
      image: {
        _type: 'externalImage',
        url: square_cover_large_url,
      },
    }

    sectionPayloads[sectionSlug] = {
      sectionPayload: section,
      sanityId: sanitySectionId,
    }

    workshopPayloads[courseSlug] = {
      workshopPayload: workshop,
      sanityId: sanityWorkshopId,
    }

    sectionCount += 1
  }

  await sleep(250)
  const listOfSectionPayloads: Section[] = Object.entries(sectionPayloads).map(
    (tuple) => {
      const [_slug, data] = tuple
      return data.sectionPayload
    },
  )
  const resultOfSectionCreates: any = await writeObjectsToSanity(
    listOfSectionPayloads,
  )

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

    const {
      courseSlugs,
      title,
      description,
      id: eggheadId,
      square_cover_large_url,
    } = productData

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

    let productId = ''
    switch (title) {
      case 'Basic Testing':
        productId = 'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff'
        break
      case 'Standard Testing':
        productId = 'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3'
        break
      case 'Pro Testing':
        productId = 'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5'
        break
    }

    const product: Product = {
      _id: productSanityId,
      _type: 'product',
      productId,
      title,
      description,
      modules: sanityWorkshopRefs,
      image: {
        _type: 'externalImage',
        url: square_cover_large_url,
      },
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
  writeJsonToFile('resultOfSectionCreates.json', resultOfSectionCreates)
  writeJsonToFile('resultOfWorkshopCreates.json', resultOfWorkshopCreates)
  writeJsonToFile('resultOfProductCreates.json', resultOfProductCreates)

  console.log('Script ran to completion without error')
}

importCourseData()
