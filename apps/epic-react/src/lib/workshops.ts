import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'
import {ContributorSchema} from './contributors'
import {ProductSchema} from './products'
import type {Lesson as LessonType} from '@skillrecordings/skill-lesson/schemas/lesson'
import type {Module} from '@skillrecordings/skill-lesson/schemas/module'
import pluralize from 'pluralize'

export const getModuleLessonPath = (lesson: LessonType, module: Module) => {
  const pathname = `/${pluralize(module.moduleType)}/[module]/[lesson]`
  const query = {
    lesson: lesson.slug,
    module: module.slug.current,
  }
  return {pathname, query}
}

const WorkshopSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  tagline: z.string().optional().nullable(),
  lessonCount: z.number().optional().nullable(),
  resources: z
    .array(
      z.object({
        _id: z.string(),
        _type: z.string(),
        _updatedAt: z.string().optional(),
        title: z.string(),
        description: z.string().optional().nullable(),
        slug: z.string(),
        solution: z
          .nullable(
            z.object({
              _key: z.string(),
              _type: z.string(),
              _updatedAt: z.string().optional(),
              title: z.string(),
              description: z.string().optional().nullable(),
              slug: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .nullable()
    .optional(),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  moduleType: z.enum(['workshop', 'bonus']),
  state: z.enum(['draft', 'published']),
  image: z.nullable(z.string()).optional(),
  ogImage: z.nullable(z.string()).optional(),
  workshopApp: z
    .object({
      path: z.string().nullable().optional(),
      localhost: z
        .object({
          path: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      external: z
        .object({
          url: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
  github: z
    .nullable(
      z.object({
        repo: z.string(),
        title: z.string().nullable().optional(),
      }),
    )
    .optional(),
  instructor: ContributorSchema.optional().nullable(),
  product: z.array(ProductSchema).optional().nullable(),
  lessons: z.array(z.any()).optional().nullable(),
  sections: z
    .array(
      z.object({
        _id: z.string(),
        _type: z.string(),
        _updatedAt: z.string().optional(),
        title: z.string(),
        description: z.string().optional().nullable(),
        slug: z.string(),
        lessons: z.array(
          z.object({
            _id: z.string(),
            _type: z.string(),
            _updatedAt: z.string().optional(),
            title: z.string(),
            description: z.string().optional().nullable(),
            slug: z.string(),
            solution: z
              .nullable(
                z.object({
                  _key: z.string(),
                  _type: z.string(),
                  _updatedAt: z.string().optional(),
                  title: z.string(),
                  description: z.string().optional().nullable(),
                  slug: z.string(),
                }),
              )
              .optional(),
          }),
        ),
        resources: z.any(),
      }),
    )
    .optional()
    .nullable(),
})
export const WorkshopsSchema = z.array(WorkshopSchema)
export type Workshop = z.infer<typeof WorkshopSchema>

// const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop' && state == 'published'] | order(_createdAt asc) {
const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop'] | order(_createdAt asc) {
  _id,
  _type,
  title,
  slug,
  moduleType,
  "image": image.secure_url,
  _updatedAt,
  _createdAt,
  description,
  state,
  workshopApp,
  github,
  tagline,
  "instructor": contributors[@.role == 'instructor'][0].contributor->{
      _id,
      _type,
      _updatedAt,
      _createdAt,
      name,
      bio,
      links[] {
        url, label
      },
      picture {
          "url": asset->url,
          alt
      },
      "slug": slug.current,
    },
  'product': *[_type=='product' && references(^._id)][]{
    _id,
    _type,
    _updatedAt,
    _createdAt,
    productId,
    title,
    description,
    type,
    image,
    state,
    "slug": slug.current,
    body,
    "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
    upgradableTo[]->{
      ...,
      modules[]->{
        ...,
        "description": "",
        "image": image.asset->{url},
      }  
    },
    modules[]->{
      ...,
      "image": image.secure_url,
    }
  },
  "lessonCount": count(resources[@->._type in ['lesson', 'exercise', 'explainer']] + resources[@->._type == 'section']->resources[@->._type in ['lesson', 'exercise', 'explainer']]),
  "sections": resources[@->._type == 'section']->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
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
  }
}`

export const getAllWorkshops = async () => {
  const workshops = await sanityClient.fetch(workshopsQuery)
  const parsedWorkshops = WorkshopsSchema.safeParse(workshops)

  if (!parsedWorkshops.success) {
    console.error('Error parsing workshops')
    console.error(parsedWorkshops.error)
    return []
  } else {
    return parsedWorkshops.data
  }
}

export const getWorkshop = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
        slug,
        body,
        moduleType,
        _id,
        github,
        workshopApp,
        "ogImage": ogImage.secure_url,
        description,
        _updatedAt,
        "instructor": contributors[@.role == 'instructor'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
        "testimonials": resources[@->._type == 'testimonial']->{
          _id,
          _type,
          _updatedAt,
          body,
          author {
            name,
            "image": image.asset->url
          }
        },
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
          "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
            _id,
            _type,
            _updatedAt,
            title,
            description,
            workshopApp,
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
        "image": image.secure_url, 
        // get product that includes current workshop and has
        // the largest number of modules so we can assume it's a bundle
        'product': *[_type == 'product' && references(^._id)] | order(count(modules) desc)[0]{
          "name": title,
          "slug": slug.current,
          productId,
          state,
          'active': *[_type == 'pricing' && slug.current == 'epic-react-v2'][0].active,
          description,
          action,
          image,
          type,
          unitAmount,
          upgradableTo[0]->{
            ...,
            productId,
            "slug": slug.current,
            modules[]->{moduleType},
          },
          modules[]->{
            "slug": slug.current,
            moduleType,
            title,
            "image": {"url":image.secure_url},
            state,
          },
          features[]{
            value,
            icon
          }
        },
    }`,
    {slug: `${slug}`},
  )
