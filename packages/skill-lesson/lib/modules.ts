import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'
import {z} from 'zod'
import * as mysql from 'mysql2/promise'
import slugify from '@sindresorhus/slugify'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

const CoreResourceSchema = z.object({
  _id: z.string(),
  slug: z.string(),
  title: z.string(),
  moduleType: z.string().optional(),
})
const LessonSchema = CoreResourceSchema
const SectionSchema = CoreResourceSchema.merge(
  z.object({
    lessons: LessonSchema.array(),
  }),
)
const ResourceSchema = CoreResourceSchema.merge(
  z.object({
    _type: z.string(),
    resources: CoreResourceSchema.array().optional(),
  }),
)
const ModuleSchema = CoreResourceSchema.merge(
  z.object({
    sections: SectionSchema.array(),
    lessons: LessonSchema.array(),
    resources: ResourceSchema.array(),
  }),
)

export type ResourceStructure = z.infer<typeof ResourceSchema>

const toQuotedList = (identifiers: string[]): string => {
  return identifiers.map((identifier) => `'${identifier}'`).join(', ')
}

const lessonTypes = ['lesson', 'exercise', 'explainer', 'interview']

const lessonStructureSubQuery = `resources[@->._type in [${toQuotedList(
  lessonTypes,
)}]]->{
  _id,
  title,
  "slug": slug.current,
}`

const moduleStructureQuery = groq`*[_type == "module" && (slug.current == $slug || _id == $id)][0]{
  _id,
  title,
  moduleType,
  "slug": slug.current,
  "sections": resources[@->._type == 'section']->{
    _id,
    title,
    "slug": slug.current,
    "lessons": ${lessonStructureSubQuery},
  },
  "lessons": ${lessonStructureSubQuery},
  "resources": resources[@->._type in ['section', ${toQuotedList(
    lessonTypes,
  )}]]->{
    _id,
    _type,
    title,
    "slug": slug.current,
    (_type == 'section') => {
      "resources": resources[@->._type in [${toQuotedList(lessonTypes)}]]->{
        _id,
        title,
        "slug": slug.current,
      }
    }
  }
}`

export const getModuleStructure = async ({
  id = '',
  slug = '',
}: {
  id?: string
  slug?: string
}) => {
  const result = await sanityClient.fetch(moduleStructureQuery, {slug, id})

  return ModuleSchema.parse(result)
}

const modulesQuery = groq`*[_type == "module" && state == 'published'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "product": resources[@._type == 'product'][0]{productId},
  "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer']]->{
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
    },
    }
}`

export const getAllModules = async () => await sanityClient.fetch(modulesQuery)

export const getModule = async (slug: string) => {
  if (process.env.COURSE_BUILDER_DATABASE_URL) {
    try {
      const connection = await mysql.createConnection(access)

      const [rows] = await connection.execute(
        `SELECT * FROM zEW_ContentResource 
         WHERE type = 'tutorial'
         AND JSON_EXTRACT(fields, "$.slug") = ?
         AND deletedAt IS NULL`,
        [slug],
      )

      if (Array.isArray(rows) && rows.length > 0) {
        const tutorialRow = rows[0] as any
        const fields =
          typeof tutorialRow.fields === 'string'
            ? JSON.parse(tutorialRow.fields)
            : tutorialRow.fields || {}

        const [sectionRows] = await connection.execute(
          `
          SELECT
            resource.id,
            resource.fields,
            resource.type,
            crr.position
          FROM
            zEW_ContentResourceResource crr
          JOIN
            zEW_ContentResource resource ON crr.resourceId = resource.id
          WHERE
            crr.resourceOfId = ?
            AND resource.type = 'section'
            AND crr.deletedAt IS NULL
            AND resource.deletedAt IS NULL
          ORDER BY
            crr.position ASC
          `,
          [tutorialRow.id],
        )

        const sections: any[] = []
        if (Array.isArray(sectionRows)) {
          for (const sectionRow of sectionRows as any[]) {
            const sectionFields =
              typeof sectionRow.fields === 'string'
                ? JSON.parse(sectionRow.fields)
                : sectionRow.fields || {}

            const [lessonRows] = await connection.execute(
              `
              SELECT
                resource.id,
                resource.type,
                resource.fields,
                crr.position
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

            sections.push({
              _id: sectionRow.id,
              _type: 'section',
              _updatedAt: sectionRow.updatedAt
                ? new Date(sectionRow.updatedAt).toISOString()
                : new Date().toISOString(),
              title: sectionFields.title || '',
              description: sectionFields.description || null,
              slug: sectionFields.slug || slugify(sectionFields.title || ''),
              lessons,
              resources: [],
            })
          }
        }

        const allLessons = sections.flatMap((section) => section.lessons || [])

        return {
          id: tutorialRow.id,
          _id: tutorialRow.id,
          _type: 'module',
          title: fields.title || '',
          state:
            fields.state ||
            (fields.visibility === 'public' ? 'published' : 'draft'),
          slug: {current: fields.slug || slug},
          body: fields.body || null,
          moduleType: 'tutorial',
          github: fields.github || null,
          ogImage: null,
          description: fields.description || null,
          _updatedAt: tutorialRow.updatedAt
            ? new Date(tutorialRow.updatedAt).toISOString()
            : new Date().toISOString(),
          image: null,
          product: null,
          sections,
          lessons: allLessons,
        }
      }
    } catch (error) {
      console.error('[getModule] Error fetching tutorial from database:', error)
    }
  }

  return await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
        slug,
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
        "image": image.asset->url,
        "product": resources[@._type == 'product'][0]{productId},
        "sections": resources[@->._type == 'section']->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer']]->{
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
        },
        "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer', 'interview']]->{
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
    }`,
    {slug: `${slug}`},
  )
}
export const getModuleById = async (id: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && _id == $id][0]{
        "id": _id,
        _type,
        title,
        "slug": slug.current,
        "image": image.url,
    }`,
    {id: `${id}`},
  )

export const getModuleWithResources = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
        slug,
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
        "image": select(image.asset->url != null => image.asset->url, image.secure_url),
        "product": resources[@._type == 'product'][0]{productId},
       "resources": resources[@->._type in ['section', 'explainer', 'lesson', 'exercise']]->{
          _id,
          _type,
          _updatedAt,
          title,
          "slug": slug.current,
          (_type == 'explainer') => {
            explainerType
          },
          (_type == 'section') => {
            "lessons": resources[@->._type in ['explainer', 'exercise', 'lesson']]->{
              _id,
              _type,
              _updatedAt,
              title,
              "slug": slug.current,
              description,
              (_type == 'explainer') => {
                explainerType
              },
              "solution": resources[@._type == 'solution'][0]{
                _key,
                _type,
                "_updatedAt": ^._updatedAt,
                title,
                description,
                "slug": slug.current,
              }
            }
          }
        },
         "sections": resources[@->._type == 'section']->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer']]->{
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
        },
        "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer', 'interview']]->{
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
    }`,
    {slug: `${slug}`},
  )
