import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

const ResourceSchema = z.object({
  _id: z.string(),
  _type: z.string(),
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
  image: z.string(),
  body: z.string().nullable(),
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
  "lessons": resources[@->._type in ['interview']]->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current
    }
}`

export const getAllBonuses = async () => await sanityClient.fetch(bonusesQuery)

export const getBonus = async (slug: string) =>
  await sanityClient.fetch(
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
        body,
        "lessons": resources[@->._type in ['interview']]->{
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
        'product': *[_type == 'product' && references(^._id)] | order(count(modules) desc)[0]{
          "name": title,
          "slug": slug.current,
          productId,
          description,
          action,
          "image": image.asset->{url, alt},
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

export type Bonus = z.infer<typeof BonusSchema>
