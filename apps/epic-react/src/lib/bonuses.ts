import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

const ResourceSchema = z.object({
  _id: z.string(),
  _type: z.literal('interview'),
  _updatedAt: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
})

export const BonusSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  title: z.string(),
  state: z.union([z.literal('published'), z.literal('draft')]),
  slug: z.object({current: z.string()}),
  moduleType: z.string(),
  description: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  resources: z.array(ResourceSchema),
  image: z.string().nullable(),
  body: z.string().nullable(),
  lessonCount: z.number().optional().nullable(),
})

const bonusesForProductQuery = groq`*[_type == "product" && productId == $productId][0]{
  "bonuses": modules[@->._type == "module" && @->.moduleType == "bonus"]->{
    _id,
    _type,
    title,
    state,
    slug,
    moduleType,
    description,
    _createdAt,
    _updatedAt,
    body,
    "resources": resources[@->._type in ["interview"]]->{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current
    },
    "image": image.url,
  }
}`

export const getBonusesForProduct = async ({
  productId,
}: {
  productId: string
}) => {
  const result = await sanityClient.fetch(bonusesForProductQuery, {productId})

  return BonusSchema.array().parse(result.bonuses)
}

const bonusesQuery = groq`*[_type == "module" && moduleType == 'bonus'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.url,
  _updatedAt,
  moduleType,
  _createdAt,
  description,
  state,
  body,
  "lessonCount": count(resources[@->._type in ['interview']]),
  "resources": resources[@->._type in ['interview']]->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current
    }
}`

export const getAllBonuses = async () => await sanityClient.fetch(bonusesQuery)

export const getBonus = async (slug: string) => {
  const result = await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'bonus' && slug.current == $slug][0]{
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
        _createdAt,
        body,
        "resources": resources[@->._type in ['interview']]->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current
        },
        "image": image.url,
        // get product that includes current workshop and has
        // the largest number of modules so we can assume it's a bundle
         'product': *[_type == 'product' && references(^._id)] | order(count(modules) desc) | order(_createdAt desc)[0]{
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

  return BonusSchema.passthrough().nullable().parse(result)
}

export type Bonus = z.infer<typeof BonusSchema>
