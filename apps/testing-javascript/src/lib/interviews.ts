import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

const ExternalImageSchema = z.object({
  _type: z.literal('externalImage'),
  alt: z.string(),
  url: z.string(),
})

const SanityBlockSchema = z.array(
  z.object({
    style: z.literal('normal'),
    _type: z.literal('block'),
    children: z.array(
      z.object({
        _type: z.literal('span'),
        marks: z.array(z.any()),
        _key: z.string(),
        text: z.string(),
      }),
    ),
    markDefs: z.array(z.any()),
    _key: z.string(),
  }),
)

const InterviewSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  portraits: z.object({
    image1: ExternalImageSchema,
    image2: ExternalImageSchema.optional(),
  }),
  resources: z
    .object({
      _id: z.string(),
      videoResourceId: z.string(),
      _type: z.string(),
      slug: z.string(),
      title: z.string(),
      _updatedAt: z.string(),
      description: z.string().optional(),
      body: z.string().optional(),
    })
    .array(),
  videoResourceId: z.string().optional(),
  _updatedAt: z.string().optional(),
})

export const getAllInterviews = async () =>
  await sanityClient.fetch(groq`*[_type == "interview"] | order(_createdAt asc) {
  _id,
  _type,
  title,
  description,
  portraits,
  slug,
  isMultiple
}`)

export const getInterviewModule = async () => {
  const moduleQuery = groq`*[_type == 'module' && slug.current == $slug][0]{
    slug,
    _type,
    title,
    moduleType,
    image,
    sections,
    "lessons": *[_type == "interview"] | order(_createdAt asc) {
      _id,
      _type,
      "slug": slug.current,
      title,
      description,
      portraits,
      "resources": resources[@->._type == 'videoResource'][]->{
        _id,
        "videoResourceId": _id,
        _type,
        "slug": slug.current,
        title,
        _updatedAt
      },
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      _updatedAt
    }
  }`

  const module = await sanityClient.fetch(moduleQuery, {
    slug: 'expert-interviews-module',
  })

  return module
}

export const getInterview = async (slug: string) => {
  const interviewQuery = groq`*[_type == "interview" && slug.current == $slug][0]{
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    portraits,
    "resources": resources[@->._type == 'videoResource'][]->{
      _id,
      "videoResourceId": _id,
      _type,
      "slug": slug.current,
      title,
      _updatedAt
    },
    "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
    _updatedAt
  }`
  const response = await sanityClient.fetch(interviewQuery, {slug})

  return InterviewSchema.parse(response)
}
