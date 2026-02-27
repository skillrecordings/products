import {Purchase, User} from '@skillrecordings/database'
import {getModule} from '@skillrecordings/skill-lesson/lib/modules'
import {getSection} from 'lib/sections'
import {getExercise} from 'lib/exercises'
import {getProducts} from '@skillrecordings/skill-lesson/lib/products'
import {AppAbility, getCurrentAbility} from '@skillrecordings/skill-lesson'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import {z} from 'zod'
import * as Sentry from '@sentry/nextjs'
import * as mysql from 'mysql2/promise'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

const VideoResourceSchema = z.object({
  transcript: z.coerce.string(),
  muxPlaybackId: z.string(),
})
type VideoResource = z.infer<typeof VideoResourceSchema>

type Error = {
  error:
    | 'video-resource-not-found'
    | 'unauthorized-to-view-lesson'
    | 'region-restricted'
    | 'lesson-not-found'
  ability?: AppAbility
}

type GetLessonProps = {
  useSolution?: boolean
  lessonSlug: string
  moduleSlug: string
  sectionSlug: string
  country: string
  user?: User & {purchases: Purchase[]}
}
export async function getLessonVideoForDevice({
  useSolution = false,
  lessonSlug,
  moduleSlug,
  sectionSlug,
  user,
  country,
}: GetLessonProps): Promise<(VideoResource & {httpUrl: string}) | Error> {
  const module = await getModule(moduleSlug)
  const section = await getSection(sectionSlug)
  const lessonData = await getExercise(lessonSlug, false)

  if (lessonData) {
    const lesson = useSolution ? (lessonData.solution as Lesson) : lessonData

    const productsPurchased =
      user?.purchases?.map((purchase) => purchase.productId) || []
    const purchasedModules = await getProducts(productsPurchased)

    const ability = getCurrentAbility({
      user,
      purchasedModules,
      lesson,
      section,
      module,
      country: country,
    })

    if (ability.can('view', 'Content')) {
      const sanityResponse = await sanityClient.fetch(
        groq`*[_type in ['videoResource'] && _id == $id][0]{
      "transcript": transcript.text,
      "muxPlaybackId": muxAsset.muxPlaybackId
    }`,
        {id: lesson.videoResourceId as string},
      )

      let result = VideoResourceSchema.safeParse(sanityResponse)

      // MySQL fallback for course-builder video resources
      if (
        !result.success &&
        lesson.videoResourceId &&
        process.env.COURSE_BUILDER_DATABASE_URL
      ) {
        try {
          const connection = await mysql.createConnection(access)
          const [rows] = await connection.execute(
            `SELECT fields FROM zEW_ContentResource WHERE id = ? AND type = 'videoResource' AND deletedAt IS NULL LIMIT 1`,
            [lesson.videoResourceId],
          )
          await connection.end()

          if (Array.isArray(rows) && rows.length > 0) {
            const videoFields =
              typeof (rows[0] as any).fields === 'string'
                ? JSON.parse((rows[0] as any).fields)
                : (rows[0] as any).fields || {}

            result = VideoResourceSchema.safeParse({
              muxPlaybackId: videoFields.muxPlaybackId || '',
              transcript:
                videoFields.transcript?.text ||
                (typeof videoFields.transcript === 'string'
                  ? videoFields.transcript
                  : '') ||
                (lesson as any).transcript ||
                '',
            })
          }
        } catch (err) {
          console.error(
            '[getLessonVideoForDevice] MySQL video fallback error:',
            err,
          )
        }
      }

      if (result.success) {
        const videoResource = result.data

        return {
          ...videoResource,
          httpUrl: `${process.env.NEXT_PUBLIC_URL}/${
            module.moduleType
          }s/${moduleSlug}/${sectionSlug}/${lessonSlug}${
            useSolution ? '/solution' : ''
          }`,
        }
      } else {
        return {
          error: 'video-resource-not-found',
        } as const
      }
    } else if (ability.can('view', 'RegionRestriction')) {
      return {
        error: 'region-restricted',
      } as const
    } else {
      return {
        error: 'unauthorized-to-view-lesson',
      }
    }
  } else {
    const msg = `Unable to find Exercise for slug (${lessonSlug}). Context: module (${moduleSlug}) and section (${sectionSlug})`
    Sentry.captureMessage(msg)

    return {
      error: 'lesson-not-found',
    } as const
  }
}

export const getLessonWithModule = async (id: string): Promise<any> => {
  return await sanityClient.fetch(
    `*[_id == $id][0]{
      _id,
      title,
      description,
      workshopApp,
      "solution": resources[@._type == 'solution'][0]{
        _key,
      },
      "section": *[_type in ['section'] && references(^._id)][0]{
        _id,
        "slug": slug.current,
      },
    } | {
      ...,
      "module": *[_type in ['module'] && references(^.section._id)][0] {
        _type,
        title,
        slug,
        body,
        moduleType,
        _id,
        github,
        description,
        github,
        workshopApp,
        "sections": resources[@->._type == 'section']->{
          _id,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
            _id,
            _type,
            title,
            description,
            "slug": slug.current
          },
          "resources": resources[@->._type in ['linkResource']]->
        },
        "image": image.asset->url, 
      }
    }`,
    {id},
  )
}
