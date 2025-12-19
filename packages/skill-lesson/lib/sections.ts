import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'
import * as mysql from 'mysql2/promise'
import slugify from '@sindresorhus/slugify'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

const sectionsQuery = groq`*[_type == "module" && moduleType == 'section'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "solution": resources[@._type == 'solution'][0]{
      _key,
      _type,
      "_updatedAt": ^._updatedAt,
      title,
      description,
      "slug": slug.current,
    }
  },
  "resources": resources[@->._type in ['linkResource']]->
}`

export const getAllSections = async () =>
  await sanityClient.fetch(sectionsQuery)

export const getSection = async (slug: string) => {
  if (process.env.COURSE_BUILDER_DATABASE_URL) {
    try {
      const connection = await mysql.createConnection(access)

      const [rows] = await connection.execute(
        `SELECT * FROM zEW_ContentResource 
         WHERE type = 'section'
         AND JSON_EXTRACT(fields, "$.slug") = ?
         AND deletedAt IS NULL`,
        [slug],
      )

      if (Array.isArray(rows) && rows.length > 0) {
        const sectionRow = rows[0] as any
        const fields =
          typeof sectionRow.fields === 'string'
            ? JSON.parse(sectionRow.fields)
            : sectionRow.fields || {}

        const [lessonRows] = await connection.execute(
          `
          SELECT
            resource.id,
            resource.type,
            resource.fields,
            resource.createdAt,
            resource.updatedAt
          FROM
            zEW_ContentResourceResource crr
          JOIN
            zEW_ContentResource resource ON crr.resourceId = resource.id
          WHERE
            crr.resourceOfId = ?
            AND crr.deletedAt IS NULL
            AND resource.deletedAt IS NULL
            AND (resource.type = 'post' OR resource.type = 'lesson' OR resource.type = 'exercise' OR resource.type = 'explainer')
          ORDER BY
            crr.position ASC
          `,
          [sectionRow.id],
        )

        const lessons: any[] = []
        if (Array.isArray(lessonRows)) {
          for (const lessonRow of lessonRows as any[]) {
            const lessonFields =
              typeof lessonRow.fields === 'string'
                ? JSON.parse(lessonRow.fields)
                : lessonRow.fields || {}

            lessons.push({
              _id: lessonRow.id,
              _type:
                lessonRow.type === 'post'
                  ? 'lesson'
                  : lessonRow.type || 'lesson',
              _updatedAt: lessonRow.updatedAt
                ? new Date(lessonRow.updatedAt).toISOString()
                : new Date().toISOString(),
              title: lessonFields.title || '',
              description: lessonFields.description || null,
              slug: lessonFields.slug || slugify(lessonFields.title || ''),
              solution: null,
            })
          }
        }

        await connection.end()
        return {
          id: sectionRow.id,
          _id: sectionRow.id,
          _type: 'section',
          title: fields.title || '',
          state: fields.state || 'published',
          slug: fields.slug || slug,
          body: fields.body || null,
          moduleType: fields.moduleType || null,
          github: fields.github || null,
          ogImage: null,
          description: fields.description || null,
          _updatedAt: sectionRow.updatedAt
            ? new Date(sectionRow.updatedAt).toISOString()
            : new Date().toISOString(),
          lessons,
          resources: [],
          image: null,
        }
      }
      await connection.end()
    } catch (error) {
      console.error('[getSection] Error fetching from database:', error)
      if (connection) await connection.end()
      // Fall through to Sanity
    }
  }

  return await sanityClient.fetch(
    groq`*[_type == "section" && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
         "slug": slug.current,
        body[]{
          ...,
          _type == "bodyTestimonial" => {
            "body": testimonial->body,
            "author": testimonial->author {
              "image": image.asset->url,
              name
            }
        }
        },
        moduleType,
        _id,
        github,
        ogImage,
        description,
        _updatedAt,
        "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "solution": resources[@._type == 'solution'][0]{
            _key,
            _type,
            "_updatedAt": ^._updatedAt,
            title,
            description,
            "slug": slug.current,
          }
        },
        "resources": resources[@->._type in ['linkResource']]->,
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
}
