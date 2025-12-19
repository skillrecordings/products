import groq from 'groq'
import z from 'zod'
import {ResourceSchema} from '../schemas/resource'
import {sanityClient} from '../utils/sanity-client'
import * as mysql from 'mysql2/promise'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

export const LessonSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    visibility: z.enum(['public', 'paid', 'subscribed']).optional().nullable(),
    solution: z
      .nullable(
        z
          .object({
            _key: z.string(),
            visibility: z
              .enum(['public', 'paid', 'subscribed'])
              .optional()
              .nullable(),
          })
          .merge(ResourceSchema.omit({_id: true}))
          .optional(),
      )
      .optional(),
  })
  .merge(ResourceSchema)

export type Lesson = z.infer<typeof LessonSchema>

export const getLesson = async (slug: string): Promise<Lesson> => {
  if (process.env.COURSE_BUILDER_DATABASE_URL) {
    try {
      const connection = await mysql.createConnection(access)

      const [rows] = await connection.execute(
        `SELECT * FROM zEW_ContentResource 
         WHERE (type = 'post' OR type = 'lesson' OR type = 'exercise' OR type = 'explainer')
         AND JSON_EXTRACT(fields, "$.slug") = ?
         AND deletedAt IS NULL`,
        [slug],
      )

      if (Array.isArray(rows) && rows.length > 0) {
        const lessonRow = rows[0] as any
        const fields =
          typeof lessonRow.fields === 'string'
            ? JSON.parse(lessonRow.fields)
            : lessonRow.fields || {}

        let solution: any = null
        const [solutionRows] = await connection.execute(
          `
          SELECT
            resource.id,
            resource.fields
          FROM
            zEW_ContentResourceResource crr
          JOIN
            zEW_ContentResource resource ON crr.resourceId = resource.id
          WHERE
            crr.resourceOfId = ?
            AND resource.type = 'solution'
            AND crr.deletedAt IS NULL
            AND resource.deletedAt IS NULL
          LIMIT 1
          `,
          [lessonRow.id],
        )

        if (Array.isArray(solutionRows) && solutionRows.length > 0) {
          const solutionRow = solutionRows[0] as any
          const solutionFields =
            typeof solutionRow.fields === 'string'
              ? JSON.parse(solutionRow.fields)
              : solutionRow.fields || {}

          solution = {
            _key: solutionRow.id,
            _type: 'solution',
            visibility: solutionFields.visibility || 'public',
            _updatedAt: lessonRow.updatedAt
              ? new Date(lessonRow.updatedAt).toISOString()
              : new Date().toISOString(),
            title: solutionFields.title || '',
            description: solutionFields.description || null,
            body: solutionFields.body || null,
            slug: solutionFields.slug || slug,
          }
        }

        const lesson = {
          _id: lessonRow.id,
          _type:
            lessonRow.type === 'post' ? 'lesson' : lessonRow.type || 'lesson',
          _updatedAt: lessonRow.updatedAt
            ? new Date(lessonRow.updatedAt).toISOString()
            : new Date().toISOString(),
          title: fields.title || '',
          visibility: fields.visibility || 'public',
          description: fields.description || null,
          slug: fields.slug || slug,
          body: fields.body || null,
          solution,
        }

        return LessonSchema.parse(lesson)
      }
    } catch (error) {
      console.error('[getLesson] Error fetching from database:', error)
    }
  }

  const exercise = await sanityClient.fetch(
    `*[_type in ['lesson', 'exercise', 'explainer', 'tip', 'interview', 'talk'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      visibility,
      description,
      "slug": slug.current,
      body,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        visibility,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        body,
        "slug": slug.current,
      }
    }`,
    {slug},
  )

  if (!exercise) {
    throw new Error(`Lesson not found with slug: ${slug}`)
  }

  return LessonSchema.parse(exercise)
}

export const getAllLessons = async (): Promise<Lesson[]> => {
  const lessons =
    await sanityClient.fetch(groq`*[_type in ['lesson', 'exercise', 'explainer', 'interview']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      visibility,
      "slug": slug.current,
      "videoResourceId": resources[@->._type == 'videoResource'][0],
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        visibility,
        description,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0],
       "slug": slug.current
       }
    }`)

  return z.array(LessonSchema).parse(lessons)
}
