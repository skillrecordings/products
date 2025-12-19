import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {getSection} from '@skillrecordings/skill-lesson/lib/sections'

const sectionsQuery = groq`*[_type == "module" && moduleType == 'section'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "lessons": resources[@->._type == 'lesson']->{
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
}`

export {getSection}

export const getAllSections = async () =>
  await sanityClient.fetch(sectionsQuery)
