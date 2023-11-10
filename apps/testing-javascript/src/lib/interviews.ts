import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'
import type {Module} from '@skillrecordings/skill-lesson/schemas/module'
import type {Section} from '@skillrecordings/skill-lesson/schemas/section'
import type {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'

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
  const interviewsQuery = groq`*[_type == "interview"] | order(_createdAt asc) {
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    portraits,
    "resources": resources[@->._type == 'videoResource'][]->{
      "videoResourceId": _id,
      _type,
      "slug": slug.current,
      title,
      _updatedAt
    },
    "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
    _updatedAt
  }`
  const response = await sanityClient.fetch(interviewsQuery)
  console.log(response)
  const lessons = InterviewSchema.array().parse(response)

  const sections: Section[] = [
    {
      _type: 'section',
      slug: 'interviews-section',
      title: 'Interviews',
      lessons,
    },
  ]

  const module: Module = {
    slug: {current: 'interviews-module'},
    _type: 'module',
    title: 'Interviews',
    moduleType: 'bonus',
    image: null,
    sections,
    lessons,
  }

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
