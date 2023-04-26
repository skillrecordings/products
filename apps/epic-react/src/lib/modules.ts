import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

export const ModuleSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  title: z.string(),
  slug: z.object({
    _type: z.literal('slug'),
    current: z.string(),
  }),
  state: z.string(),
  moduleType: z.string(),
  description: z.string().nullable(),
  body: z.array(z.any()),
  github: z
    .object({
      repo: z.string(),
    })
    .nullable(),
  square_cover_large_url: z.string(),
  resources: z.array(
    z.object({
      _id: z.string(),
      _type: z.enum(['section', 'exercise', 'explainer', 'interview']),
      title: z.string(),
      slug: z.string(),
      _updatedAt: z.string(),
      _createdAt: z.string(),
      description: z.string().nullable(),
      resources: z
        .array(
          z.object({
            _id: z.string(),
            _type: z.enum(['exercise', 'explainer', 'interview']),
            title: z.string(),
            slug: z.string(),
            _updatedAt: z.string(),
            _createdAt: z.string(),
            description: z.string().nullable(),
            body: z.array(z.any()),
          }),
        )
        .optional(),
      body: z.array(z.any()).optional(),
    }),
  ),
})

export const ProductModulesSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  modules: z.array(ModuleSchema),
})

const productModulesQuery = groq`*[_type == "product" && productId == $productId][0] {
  _id,
  title,
  description,
  "modules": modules[]->{
    _id,
    _type,
    title,
    slug,
    description,
    body,
    state,
    moduleType,
    github,
    "square_cover_large_url": image.url,
    "resources": resources[@->._type in ['section', 'exercise', 'explainer', 'interview']]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      _updatedAt,
      _createdAt,
      description,
      _type == 'section' => {
        "resources": resources[@->._type in ['exercise', 'explainer', 'interview']]->{
          _id,
          _type,
          title,
          "slug": slug.current,
          _updatedAt,
          _createdAt,
          description,
          body,
        }
      },
      _type in ['exercise', 'explainer', 'interview'] => {
        body,
      },
    }
  }
}`

export const getProductModules = async ({productId}: {productId: string}) => {
  const productModules = await sanityClient.fetch(productModulesQuery, {
    productId,
  })

  return ProductModulesSchema.parse(productModules)
}

const modulesQuery = groq`*[_type == "module" && moduleType == 'workshop'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  state,
  "resources": resources[@->._type in ['section', 'exercise', 'explainer', 'interview']]->{
    _id,
    _type,
    title,
    "slug": slug.current,
    _updatedAt,
    _createdAt,
    description,
    _type == 'section' => {
      "resources": resources[@->._type in ['exercise', 'explainer', 'interview']]=>{
        _id,
        _type,
        title,
        _slug,
        _updatedAt,
        _createdAt,
        description,
        body,
      }
    }
    _type in ['exercise, 'explainer', 'interview'] => {
      body,
    }
  },
}`

export const getAllModules = async () => await sanityClient.fetch(modulesQuery)

export const getModule = async (slug: string) => {
  const result = await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && slug.current == $slug][0]{
      _id,
      _type,
      title,
      state,
      slug,
      moduleType,
      github,
      description,
      body,
      _updatedAt,
      "square_cover_large_url": image.url,
      "resources": resources[@->._type in ['section', 'exercise', 'explainer', 'interview']]->{
        _id,
        _type,
        title,
        "slug": slug.current,
        _updatedAt,
        _createdAt,
        description,
        _type == 'section' => {
          "resources": resources[@->._type in ['exercise', 'explainer', 'interview']]->{
            _id,
            _type,
            title,
            "slug": slug.current,
            _updatedAt,
            _createdAt,
            description,
            body,
          }
        },
        _type in ['exercise', 'explainer', 'interview'] => {
          body,
        },
      }
    }`,
    {slug: `${slug}`},
  )

  return ModuleSchema.parse(result)
}
