import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

const legacyModulesForProductQuery = groq`*[_type == "product" && productId == $productId][0]{
  "modules": modules[@->._type == "module" && @->.moduleType == 'legacy-module']->{
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
    github,
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
  }
}`

export const getLegacyModulesForProduct = async ({
  productId,
}: {
  productId: string
}) => {
  const result = await sanityClient.fetch(legacyModulesForProductQuery, {
    productId,
  })
  console.log(result)
  return LegacyModuleSchema.array().parse(result.modules)
}

const legacyModuleQuery = groq`*[_type == "module" && moduleType == 'legacy-module'] | order(_createdAt asc) {
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
  github,
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

export const LegacyModuleSchema = z.object({
  _id: z.string(),
  _type: z.literal('module'),
  title: z.string(),
  slug: z.object({current: z.string()}),
  moduleType: z.literal('legacy-module'),
  image: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  description: z.string().nullable(),
  body: z.string().nullable(),
  state: z.union([z.literal('published'), z.literal('draft')]),
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
  github: z.object({repo: z.string()}).nullable().optional(),
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

export const getAllLegacyModules = async () => {
  const result = await sanityClient.fetch(legacyModuleQuery)

  return LegacyModuleSchema.array().parse(result)
}

export const getLegacyModule = async (slug: string) => {
  const result = await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'legacy-module' && slug.current == $slug][0]{
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
        "sections": resources[@->._type in ['section', 'explainer']]->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          (_type == 'section') => {
            "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
              _id,
              _type,
              _updatedAt,
              title,
              description,
              workshopApp,
              "slug": slug.current
            },
          },
          (_type == 'explainer') => {
            "lessons": [{
              _id,
              _type,
              _updatedAt,
              title,
              description,
              workshopApp,
              "slug": slug.current
            }]
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

  return LegacyModuleSchema.passthrough().nullable().parse(result)
}

export type LegacyModule = z.infer<typeof LegacyModuleSchema>
