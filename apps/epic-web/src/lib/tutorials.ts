import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

const authorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  imageAlt: z.string().nullable(),
  twitterHandle: z.string().nullable(),
})

const resourceSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  body: z.string().nullable(),
  author: authorSchema.nullable(),
})

const solutionSchema = z.object({
  _key: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string(),
})

const lessonSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string(),
  solution: solutionSchema.nullable(),
})

const sectionSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string(),
  lessons: z.array(lessonSchema),
  resources: z.array(resourceSchema),
})

const tutorialSchema = z.object({
  id: z.string(),
  _type: z.string(),
  title: z.string(),
  state: z.string().nullable(),
  slug: z.object({
    current: z.string(),
  }),
  moduleType: z.string(),
  _id: z.string(),
  github: z.string().nullable(),
  ogImage: z.string().nullable(),
  description: z.string().nullable(),
  _updatedAt: z.string(),
  image: z.string().nullable(),
  body: z.string().nullable(),
  author: authorSchema.nullable(),
  testimonials: z.array(resourceSchema),
  sections: z.array(sectionSchema),
})

export type Tutorial = z.infer<typeof tutorialSchema>

export const getAllTutorials = async (onlyPublished = true) => {
  const tutorials = await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'tutorial' ${
      onlyPublished ? ` && state == 'published'` : ''
    }] | order(_createdAt desc) {
    _id,
    _type,
    title,
    slug,
    "image": image.asset->url,
    _updatedAt,
    _createdAt,
    description,
    moduleType,
    state,
    author-> {
      name,
      "slug": slug.current,
      "image": picture.asset->url,
      "imageAlt": picture.alt
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
  }`,
  )
  return tutorials
}
export const getTutorial = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'tutorial' && slug.current == $slug][0]{
      "id": _id,
      _type,
      title,
      state,
      slug,
      moduleType,
      _id,
      github,
      ogImage,
      description,
      _updatedAt,
      "image": image.asset->url,
      body,
      author-> {
          name,
          "slug": slug.current,
          "image": picture.asset->url,
          "imageAlt": picture.alt,
          twitterHandle,
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
    }`,
    {slug: `${slug}`},
  )
