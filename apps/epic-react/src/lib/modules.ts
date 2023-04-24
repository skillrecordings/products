import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

export const ProductModulesSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  modules: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
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
    }),
  ),
})

const productModulesQuery = groq`*[_type == "product" && productId == $productId][0] {
  _id,
  title,
  description,
  "modules": modules[]->{
    _id,
    title,
    description,
    "slug": slug.current,
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

// "sections": resources[@->._type == 'section']->{
//   _id,
//   _type,
//   _updatedAt,
//   title,
//   description,
//   "slug": slug.current,
//   "lessons": resources[@->._type in ['exercise', 'explainer']]->{
//     _id,
//     _type,
//     _updatedAt,
//     title,
//     description,
//     "slug": slug.current,
//     "solution": resources[@._type == 'solution'][0]{
//       _key,
//       _type,
//       "_updatedAt": ^._updatedAt,
//       title,
//       description,
//       "slug": slug.current,
//     }
//   },
//   "resources": resources[@->._type in ['linkResource']]->
// }

export const getAllModules = async () => await sanityClient.fetch(modulesQuery)

export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && slug.current == $slug][0]{
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
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
