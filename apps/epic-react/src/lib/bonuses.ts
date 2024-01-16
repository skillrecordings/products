import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const bonusesQuery = groq`*[_type == "module" && moduleType == 'bonus'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  moduleType,
  _createdAt,
  description,
  state,
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
        "lessons": resources[@->._type in ['interview']]->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current
        },
        "image": image.asset->url,
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
