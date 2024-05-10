import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

const workshopsForProductQuery = groq`*[_type == "product" && productId == $productId][0]{
  "workshops": modules[@->._type == "module" && @->.moduleType == 'workshop']->{
    _id,
    _type,
    title,
    state,
    slug,
    body,
    moduleType,
    description,
    _createdAt,
    _updatedAt,
    "resources": resources[@->._type in ['section', 'explainer']]->{
      _id,
      _type,
      _updatedAt,
      title,
      "slug": slug.current,
      (_type == 'explainer') => {
        explainerType
      },
      (_type == 'section') => {
        "resources": resources[@->._type in ['explainer', 'exercise']]->{
          _id,
          _type,
          _updatedAt,
          title,
          "slug": slug.current,
          description,
          (_type == 'explainer') => {
            explainerType
          },
        }
      }
    },
    "image": image.url,
  }
}`

export const getWorkshopsForProduct = async ({
  productId,
}: {
  productId: string
}) => {
  const result = await sanityClient.fetch(workshopsForProductQuery, {productId})

  return WorkshopSchema.array().parse(result.workshops)
}

const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop'] | order(_createdAt asc) {
  _id,
  _type,
  title,
  slug,
  moduleType,
  "image": image.url,
  _updatedAt,
  _createdAt,
  description,
  state,
  body,
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
  "resources": resources[@->._type in ['section', 'explainer']]->{
    _id,
    _type,
    _updatedAt,
    title,
    "slug": slug.current,
    (_type == 'explainer') => {
      explainerType
    },
    (_type == 'section') => {
      "lessons": resources[@->._type in ['explainer', 'exercise']]->{
        _id,
        _type,
        _updatedAt,
        title,
        "slug": slug.current,
        description,
        (_type == 'explainer') => {
          explainerType
        },
      }
    }
  }
}`

export const WorkshopSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  title: z.string(),
  slug: z.object({current: z.string()}),
  moduleType: z.string(),
  image: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  description: z.string().nullable(),
  body: z.string().nullable(),
  state: z.union([z.literal('published'), z.literal('draft')]),
  resources: z.array(
    z.object({
      _id: z.string(),
      _type: z.union([z.literal('section'), z.literal('explainer')]),
      _updatedAt: z.string(),
      title: z.string(),
      slug: z.string(),
      explainerType: z.string().optional(),
      lessons: z
        .array(
          z.object({
            _id: z.string(),
            _type: z.union([z.literal('explainer'), z.literal('exercise')]),
            _updatedAt: z.string(),
            title: z.string(),
            slug: z.string(),
            description: z.string().nullable(),
            explainerType: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
})

export const getAllWorkshops = async () => {
  const result = await sanityClient.fetch(workshopsQuery)

  return WorkshopSchema.array().parse(result)
}

export const getWorkshop = async (slug: string) => {
  const result = await sanityClient.fetch(
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
        ogImage,
        description,
        _createdAt,
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
          "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
            _id,
            _type,
            _updatedAt,
            title,
            description,
            workshopApp,
            "slug": slug.current
          },
          "resources": resources[@->._type in ['linkResource']]->
        },
        "resources": resources[@->._type in ['section', 'explainer']]->{
          _id,
          _type,
          _updatedAt,
          title,
          "slug": slug.current,
          (_type == 'explainer') => {
            explainerType
          },
          (_type == 'section') => {
            "lessons": resources[@->._type in ['explainer', 'exercise']]->{
              _id,
              _type,
              _updatedAt,
              title,
              "slug": slug.current,
              description,
              (_type == 'explainer') => {
                explainerType
              },
            }
          }
        },
        "image": image.url,
        // get product that includes current workshop and has
        // the largest number of modules so we can assume it's a bundle
        'product': *[_type == 'product' && references(^._id)] | order(count(modules) desc)[0]{
          "name": title,
          "slug": slug.current,
          productId,
          state,
          description,
          action,
          "image": image.asset->{url, alt},
          modules[]->{
            "slug": slug.current,
            moduleType,
            title,
            "image": {"url": image.secure_url},
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

  return WorkshopSchema.parse(result)
}

export type Workshop = z.infer<typeof WorkshopSchema>
