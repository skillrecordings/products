import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'
import {z} from 'zod'

const CoreResourceSchema = z.object({
  _id: z.string(),
  slug: z.string(),
  title: z.string(),
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

export const getModule = async (slug: string) =>
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
