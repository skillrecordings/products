import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {ResourceSchema} from '@skillrecordings/skill-lesson/schemas/resource'
import * as mysql from 'mysql2/promise'

// Establish connection options for the course-builder database
const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

export const ExerciseSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    github: z.nullable(z.string()).optional(),
    videoResourceId: z.nullable(z.string()).optional(),
    transcript: z.nullable(z.string()).optional(),
    legacyTranscript: z.nullable(z.string()).optional(),
    workshopApp: z
      .nullable(
        z.object({
          path: z.string().optional(),
          localhost: z
            .object({
              port: z.string().optional(),
            })
            .optional(),
          external: z
            .object({
              url: z.string().optional(),
            })
            .optional(),
        }),
      )
      .optional(),
    solution: z.nullable(
      z
        .object({
          _key: z.string(),
          github: z.nullable(z.string()).optional(),
          videoResourceId: z.nullable(z.string()).optional(),
          transcript: z.nullable(z.string()).optional(),
          legacyTranscript: z.nullable(z.string()).optional(),
          workshopApp: z
            .nullable(
              z.object({
                path: z.string().optional(),
                localhost: z
                  .object({
                    port: z.string().optional(),
                  })
                  .optional(),
                external: z
                  .object({
                    url: z.string().optional(),
                  })
                  .optional(),
              }),
            )
            .optional(),
        })
        .merge(ResourceSchema.omit({_id: true}))
        .optional(),
    ),
  })
  .merge(ResourceSchema)

export type Exercise = z.infer<typeof ExerciseSchema>

export const getExerciseMuxPlaybackId = async (exerciseSlug: string) => {
  const exerciseVideo = await sanityClient.fetch(
    `
  *[_type == "exercise" && slug.current == $slug][0]
    .resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId`,
    {slug: `${exerciseSlug}`},
  )

  return z.string().nullish().parse(exerciseVideo)
}

export const getExerciseMedia = async (exerciseSlug: string) => {
  const exerciseMedia = await sanityClient.fetch(
    groq`*[_type in ['exercise', 'explainer', 'interview', 'lesson'] && slug.current == $slug][0]{
      "slug": slug.current,
      body,
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "workshopApp": resources[@._type == 'workshopApp'][0]{
          path
        },
      "solution": resources[@._type == 'solution'][0]{
        body,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "slug": slug.current,
        "workshopApp": resources[@._type == 'workshopApp'][0]{
          path
        },
      }
    }`,
    {slug: `${exerciseSlug}`},
  )

  return exerciseMedia
}

export const getExercise = async (
  slug: string,
  includeMedia: boolean = true,
): Promise<Exercise | null> => {
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

    let transcript: string | null = null
    let legacyTranscript: string | null = null
    if (fields.transcript) {
      if (typeof fields.transcript === 'string') {
        transcript = fields.transcript
      } else if (
        fields.transcript.text &&
        typeof fields.transcript.text === 'string'
      ) {
        transcript = fields.transcript.text
      } else if (Array.isArray(fields.transcript)) {
        transcript = JSON.stringify(fields.transcript)
      }
    }

    if (fields.castingwords?.transcript) {
      if (typeof fields.castingwords.transcript === 'string') {
        legacyTranscript = fields.castingwords.transcript
      } else if (Array.isArray(fields.castingwords.transcript)) {
        legacyTranscript = JSON.stringify(fields.castingwords.transcript)
      }
    }

    let videoResourceId: string | null = null

    const [videoRows] = await connection.execute(
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
        AND resource.type = 'videoResource'
        AND crr.deletedAt IS NULL
        AND resource.deletedAt IS NULL
      LIMIT 1
      `,
      [lessonRow.id],
    )

    if (Array.isArray(videoRows) && videoRows.length > 0) {
      const videoRow = videoRows[0] as any
      videoResourceId = videoRow.id
      const videoFields =
        typeof videoRow.fields === 'string'
          ? JSON.parse(videoRow.fields)
          : videoRow.fields || {}

      if (!transcript) {
        transcript =
          (videoFields.transcript?.text &&
          typeof videoFields.transcript.text === 'string'
            ? videoFields.transcript.text
            : null) ||
          (typeof videoFields.transcript === 'string'
            ? videoFields.transcript
            : null) ||
          (Array.isArray(videoFields.transcript)
            ? JSON.stringify(videoFields.transcript)
            : null) ||
          (videoFields.castingwords?.transcript &&
          typeof videoFields.castingwords.transcript === 'string'
            ? videoFields.castingwords.transcript
            : null) ||
          (Array.isArray(videoFields.castingwords?.transcript)
            ? JSON.stringify(videoFields.castingwords.transcript)
            : null) ||
          null
      }
      if (!legacyTranscript) {
        legacyTranscript =
          (videoFields.castingwords?.transcript &&
          typeof videoFields.castingwords.transcript === 'string'
            ? videoFields.castingwords.transcript
            : null) ||
          (Array.isArray(videoFields.castingwords?.transcript)
            ? JSON.stringify(videoFields.castingwords.transcript)
            : null) ||
          null
      }
    }

    let solution: any = null
    const [solutionRows] = await connection.execute(
      `
      SELECT
        resource.id,
        resource.fields,
        resource.type
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

      let solutionVideoResourceId: string | null = null
      let solutionTranscript: string | null = null
      let solutionLegacyTranscript: string | null = null

      const [solutionVideoRows] = await connection.execute(
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
          AND resource.type = 'videoResource'
          AND crr.deletedAt IS NULL
          AND resource.deletedAt IS NULL
        LIMIT 1
        `,
        [solutionRow.id],
      )

      if (Array.isArray(solutionVideoRows) && solutionVideoRows.length > 0) {
        const solutionVideoRow = solutionVideoRows[0] as any
        solutionVideoResourceId = solutionVideoRow.id
        const solutionVideoFields =
          typeof solutionVideoRow.fields === 'string'
            ? JSON.parse(solutionVideoRow.fields)
            : solutionVideoRow.fields || {}
        solutionTranscript = solutionVideoFields.transcript?.text || null
        solutionLegacyTranscript =
          solutionVideoFields.castingwords?.transcript || null
      }

      solution = {
        _key: solutionRow.id,
        _type: 'solution',
        _updatedAt: lessonRow.updatedAt
          ? new Date(lessonRow.updatedAt).toISOString()
          : new Date().toISOString(),
        title: solutionFields.title || '',
        description: solutionFields.description || null,
        body: solutionFields.body || null,
        videoResourceId: solutionVideoResourceId,
        transcript: solutionTranscript,
        legacyTranscript: solutionLegacyTranscript,
        slug: solutionFields.slug || slug,
        workshopApp: solutionFields.workshopApp || null,
      }
    }

    await connection.end()

    const exercise = {
      _id: lessonRow.id,
      _type: lessonRow.type === 'post' ? 'lesson' : lessonRow.type || 'lesson',
      _updatedAt: lessonRow.updatedAt
        ? new Date(lessonRow.updatedAt).toISOString()
        : new Date().toISOString(),
      title: fields.title || '',
      description: fields.description || null,
      slug: fields.slug || slug,
      body: fields.body || null,
      github: fields.github || null,
      videoResourceId,
      transcript,
      legacyTranscript,
      workshopApp: fields.workshopApp || null,
      solution,
    }

    return ExerciseSchema.nullable().parse(exercise)
  }

  await connection.end()

  const exercise = await sanityClient.fetch(
    `*[_type in ['exercise', 'explainer', 'interview', 'lesson'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      body,
      "github": resources[@._type == 'github'][0].url,
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
      "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "workshopApp": resources[@._type == 'workshopApp'][0]{
        path
      },
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
        "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "slug": slug.current,
        "workshopApp": resources[@._type == 'workshopApp'][0]{
          path
        },
      }
    }`,
    {slug},
  )

  return ExerciseSchema.nullable().parse(exercise)
}

export const getAllExercises = async (): Promise<Exercise[]> => {
  const lessons =
    await sanityClient.fetch(groq`*[_type in ['exercise', 'explainer', 'interview', 'lesson']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "videoResourceId": resources[@->._type == 'videoResource'][0],
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        description,
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "videoResourceId": resources[@->._type == 'videoResource'][0],
       "slug": slug.current
       }
    }`)

  return z.array(ExerciseSchema).parse(lessons)
}
