import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

import {z} from 'zod'

const ImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
})

const ModuleSchema = z.object({
  slug: z.string(),
  moduleType: z.string(),
  title: z.string(),
  image: ImageSchema.optional(),
  state: z.string(),
})

const ProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  productId: z.string(),
  state: z.string(),
  description: z.string(),
  action: z.string(),
  upgradableTo: z
    .object({
      productId: z.string(),
      state: z.string(),
      description: z.string().optional(),
      image: z
        .object({
          url: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
      slug: z.string(),
      title: z.string(),
      modules: z.array(ModuleSchema),
    })
    .optional(),
  image: ImageSchema.optional(),
  modules: z.array(ModuleSchema),
  features: z.array(
    z.object({
      value: z.string(),
    }),
  ),
})

export type Product = z.infer<typeof ProductSchema>

const SolutionSchema = z.object({
  _key: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
})

const LessonSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  solution: SolutionSchema.optional(),
})

export type Lesson = z.infer<typeof LessonSchema>

const SectionSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  lessons: z.array(LessonSchema),
  resources: z.array(z.unknown()),
})

export type Section = z.infer<typeof SectionSchema>

const TestimonialSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  body: z.string(),
  author: z.object({
    name: z.string(),
    image: z.string(),
  }),
})

export type Testimonial = z.infer<typeof TestimonialSchema>

const WorkshopSchema = z.object({
  id: z.string(),
  _type: z.string(),
  title: z.string(),
  state: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  body: z.string().optional(),
  moduleType: z.string(),
  _id: z.string(),
  github: z
    .object({
      repo: z.string(),
    })
    .optional(),
  ogImage: z.string().optional(),
  description: z.string(),
  _updatedAt: z.string(),
  testimonials: z.array(TestimonialSchema),
  sections: z.array(SectionSchema),
  image: z.string(),
  product: ProductSchema.optional(),
})

export type Workshop = z.infer<typeof WorkshopSchema>

const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop' && state == 'published'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  moduleType,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  state,
  'product': *[_type=='product' && references(^._id)][]{
    "slug": slug.current,
    state,
    productId,
    description,
    action,
    image {
      url,
      alt
    },
    modules[]->{
      "slug": slug.current,
      moduleType,
      title,
      "image": image.asset->{url, alt},
      state,
    },
    features[]{
      value
    }
  },
  "sections": resources[@->._type == 'section']->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "lessons": resources[@->._type in ['exercise', 'explainer']]->{
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

export const getAllWorkshops = async () =>
  await sanityClient.fetch(workshopsQuery)

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
        ogImage,
        description,
        _updatedAt,
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
        "sections": resources[@->._type == 'section']->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['exercise', 'explainer']]->{
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
        "image": image.asset->url, 
        // get product that includes current workshop and has
        // the largest number of modules so we can assume it's a bundle
        'product': *[_type == 'product' && references(^._id) && state == 'active'] | order(count(modules) asc)[0]{
          "name": title,
          "slug": slug.current,
          productId,
          state,
          unitAmount,
          description,
          upgradableTo[0]->{
            productId,
            state,
            description,
            image {
              url
            },
            "slug": slug.current,
            title,
            modules[]->{
              "slug": slug.current,
              moduleType,
              title,
              "image": image.asset->{url, alt},
              state,
            }
          },
          action,
          image {
            url,
            alt
          },
          modules[]->{
            "slug": slug.current,
            moduleType,
            title,
            "image": image.asset->{url, alt},
            state,
          },
          features[]{
            value
          }
        },
    }`,
    {slug: `${slug}`},
  )
