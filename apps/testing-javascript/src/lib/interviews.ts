import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'

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
  slug: z.object({current: z.string()}),
  title: z.string(),
  description: SanityBlockSchema,
  portraits: z.object({
    image1: ExternalImageSchema,
    image2: ExternalImageSchema,
  }),
  videoResource: z.object({
    _id: z.string(),
    muxPlaybackId: z.string(),
    transcript: z.string(),
  }),
})

export const getInterview = async (slug: string) => {
  const interviewQuery = groq`*[_type == "interview" && slug.current == $slug][0]{
    _id,
    slug,
    title,
    description,
    portraits,
    "videoResource": resources[@->._type == 'videoResource'][0]->{
      _id,
      "muxPlaybackId": muxAsset.muxPlaybackId,
      "transcript": castingwords.transcript
    }
  }`
  const response = await sanityClient.fetch(interviewQuery, {slug})

  return InterviewSchema.parse(response)
}
